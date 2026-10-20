import { createClient } from "@/lib/supabase/server";

export type CustomerRow = { id: string; full_name: string; phone: string; email: string | null; status: string; created_at: string; health_notes: string | null };
export type CustomerPage = { data: CustomerRow[]; count: number; error: string | null };
export async function loadCustomers(search = "", status = "all", membership = "all", page = 1, pageSize = 10): Promise<CustomerPage> {
  let query = createClient().from("customers").select("id, full_name, phone, email, status, created_at, health_notes, customer_memberships(status)", { count: "exact" }).order("created_at", { ascending: false });
  if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  if (membership === "active") query = query.eq("customer_memberships.status", "active");
  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  return { data: (data ?? []) as unknown as CustomerRow[], count: count ?? 0, error: error?.message ?? null };
}

export async function loadCustomerDetail(id: string) {
  const supabase = createClient();
  const [customer, memberships, sessions, records, payments, progress] = await Promise.all([
    supabase.from("customers").select("id, full_name, phone, email, status, created_at, health_notes").eq("id", id).maybeSingle(),
    supabase.from("customer_memberships").select("id, plan_name_snapshot, price_snapshot, currency_snapshot, starts_on, expires_on, total_sessions, used_sessions, status").eq("customer_id", id).order("starts_on", { ascending: false }),
    supabase.from("training_sessions").select("id, starts_at, ends_at, status, location").eq("customer_id", id).order("starts_at", { ascending: false }).limit(20),
    supabase.from("session_records").select("id, performed_at, duration_minutes, summary, exercises").eq("customer_id", id).order("performed_at", { ascending: false }).limit(20),
    supabase.from("payments").select("id, amount, currency, paid_at, payment_method, status, reference_code").eq("customer_id", id).order("paid_at", { ascending: false }).limit(20),
    supabase.from("progress_records").select("id, measured_on, weight_kg, body_fat_percentage, measurements, notes").eq("customer_id", id).order("measured_on", { ascending: false }).limit(20),
  ]);
  const error = [customer, memberships, sessions, records, payments, progress].find((item) => item.error)?.error?.message ?? null;
  return { customer: customer.data, memberships: memberships.data ?? [], sessions: sessions.data ?? [], records: records.data ?? [], payments: payments.data ?? [], progress: progress.data ?? [], error };
}
