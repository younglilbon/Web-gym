import { notFound } from "next/navigation";
import DashboardPageFrame from "@/components/dashboard/DashboardPageFrame";
import { EmptyState } from "@/components/shared/EmptyState";
import { isLocale, getDictionary } from "@/lib/i18n";
import { loadCustomers } from "@/lib/customers/server";
import { CustomerList } from "@/components/customers/CustomerList";

export default async function CustomersPage({ params, searchParams }: { params: { locale: string }; searchParams: { q?: string; status?: string; membership?: string; page?: string } }) { if (!isLocale(params.locale)) notFound(); const d = getDictionary(params.locale).dashboard; const query = searchParams.q ?? ""; const status = searchParams.status ?? "all"; const membership = searchParams.membership ?? "all"; const page = Math.max(1, Number(searchParams.page ?? "1") || 1); const data = await loadCustomers(query, status, membership, page); return <DashboardPageFrame locale={params.locale} title={d.customers}><CustomerList locale={params.locale} initial={data} query={query} status={status} membership={membership} page={page} /></DashboardPageFrame>; }
