import { createClient } from "@/lib/supabase/server";

export type ReportingPeriod = "month" | "quarter" | "year";
export type OverviewPeriod = { key: ReportingPeriod; from: Date; to: Date };

export type OverviewData = {
  period: ReportingPeriod;
  metrics: { customers: number; memberships: number; leads: number; sessions: number; revenue: number };
  revenue: { label: string; value: number }[];
  newCustomers: { label: string; value: number }[];
  membershipStatuses: { label: string; value: number }[];
  upcomingSessions: { id: string; startsAt: string; customer: string; location: string | null }[];
  recentPayments: { id: string; paidAt: string | null; customer: string; amount: number; status: string }[];
  recentCustomers: { id: string; name: string; createdAt: string }[];
  expiringMemberships: { id: string; customer: string; expiresOn: string; plan: string }[];
  followUps: { id: string; name: string; status: string; createdAt: string }[];
};

type CustomerRelation = { customers?: { full_name: string } | { full_name: string }[] | null };
function customerName(row: unknown) {
  if (!row || typeof row !== "object") return "—";
  const relation = (row as CustomerRelation).customers;
  if (Array.isArray(relation)) return relation[0]?.full_name ?? "—";
  return relation?.full_name ?? "—";
}

export function getOverviewPeriod(value?: string): OverviewPeriod {
  const key: ReportingPeriod = value === "quarter" || value === "year" ? value : "month";
  const to = new Date();
  const from = new Date(to);
  if (key === "year") from.setFullYear(from.getFullYear() - 1);
  else if (key === "quarter") from.setMonth(from.getMonth() - 3);
  else from.setMonth(from.getMonth() - 1);
  return { key, from, to };
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function buildBuckets(from: Date, to: Date, key: ReportingPeriod) {
  const count = key === "year" ? 12 : key === "quarter" ? 3 : 4;
  const buckets = Array.from({ length: count }, (_, index) => {
    const date = new Date(to);
    date.setMonth(date.getMonth() - (count - 1 - index));
    return { label: monthLabel(date), start: new Date(date.getFullYear(), date.getMonth(), 1), value: 0 };
  });
  return buckets.map((bucket, index) => ({ ...bucket, end: index === buckets.length - 1 ? to : buckets[index + 1].start }));
}

export async function loadOverview(value?: string): Promise<{ data: OverviewData | null; error: string | null }> {
  const period = getOverviewPeriod(value);
  const supabase = createClient();
  const from = period.from.toISOString();
  const now = new Date().toISOString();
  const expiry = new Date(); expiry.setDate(expiry.getDate() + 30);
  const [customers, memberships, leads, sessions, upcomingSessions, payments, paymentRows, customerRows, membershipStatusRows, membershipRows, followUps] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).neq("status", "archived"),
    supabase.from("customer_memberships").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new").gte("created_at", from),
    supabase.from("training_sessions").select("id", { count: "exact", head: true }).eq("status", "scheduled").gte("starts_at", now),
    supabase.from("training_sessions").select("id, starts_at, location, customers(full_name)").eq("status", "scheduled").gte("starts_at", now).order("starts_at").limit(8),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "paid").not("membership_id", "is", null).gte("paid_at", from).lte("paid_at", now),
    supabase.from("payments").select("id, amount, paid_at, customer_id, status, payment_kind, customers(full_name)").in("status", ["paid", "refunded"]).not("membership_id", "is", null).gte("paid_at", from).lte("paid_at", now).order("paid_at", { ascending: false }).limit(20),
    supabase.from("customers").select("id, full_name, created_at").neq("status", "archived").order("created_at", { ascending: false }).limit(8),
    supabase.from("customer_memberships").select("status"),
    supabase.from("customer_memberships").select("id, status, expires_on, plan_name_snapshot, customers(full_name)").eq("status", "active").gte("expires_on", new Date().toISOString().slice(0, 10)).lte("expires_on", expiry.toISOString().slice(0, 10)).order("expires_on").limit(8),
    supabase.from("leads").select("id, full_name, status, created_at").in("status", ["new", "contacted"]).order("created_at", { ascending: true }).limit(8),
  ]);
  const resultErrors = [customers, memberships, leads, sessions, upcomingSessions, payments, paymentRows, customerRows, membershipStatusRows, membershipRows, followUps].find((result) => result.error);
  if (resultErrors?.error) return { data: null, error: resultErrors.error.message };

  const paymentData = paymentRows.data ?? [];
  const revenueBuckets = buildBuckets(period.from, period.to, period.key);
  const customerBuckets = buildBuckets(period.from, period.to, period.key);
  paymentData.forEach((row) => { const bucket = revenueBuckets.find((item) => new Date(row.paid_at ?? 0) >= item.start && new Date(row.paid_at ?? 0) < item.end); if (bucket) bucket.value += row.payment_kind === "refund" ? -Number(row.amount) : Number(row.amount); });
  (customerRows.data ?? []).forEach((row) => { const bucket = customerBuckets.find((item) => new Date(row.created_at) >= item.start && new Date(row.created_at) < item.end); if (bucket) bucket.value += 1; });
  const statusCounts = new Map<string, number>();
  (membershipStatusRows.data ?? []).forEach((row) => statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1));

  return { data: {
    period: period.key,
    metrics: { customers: customers.count ?? 0, memberships: memberships.count ?? 0, leads: leads.count ?? 0, sessions: sessions.count ?? 0, revenue: paymentData.reduce((sum, row) => sum + (row.payment_kind === "refund" ? -Number(row.amount) : Number(row.amount)), 0) },
    revenue: revenueBuckets.map(({ label, value }) => ({ label, value })),
    newCustomers: customerBuckets.map(({ label, value }) => ({ label, value })),
    membershipStatuses: Array.from(statusCounts.entries()).map(([label, value]) => ({ label, value })),
    upcomingSessions: (upcomingSessions.data ?? []).map((row) => ({ id: row.id, startsAt: row.starts_at, location: row.location, customer: customerName(row) })),
    recentPayments: paymentData.map((row) => ({ id: row.id, paidAt: row.paid_at, customer: customerName(row), amount: Number(row.amount), status: row.status })),
    recentCustomers: (customerRows.data ?? []).map((row) => ({ id: row.id, name: row.full_name, createdAt: row.created_at })),
    expiringMemberships: (membershipRows.data ?? []).map((row) => ({ id: row.id, customer: customerName(row), expiresOn: row.expires_on, plan: row.plan_name_snapshot })),
    followUps: (followUps.data ?? []).map((row) => ({ id: row.id, name: row.full_name, status: row.status, createdAt: row.created_at })),
  }, error: null };
}
