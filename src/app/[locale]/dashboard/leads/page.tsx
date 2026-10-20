import { notFound } from "next/navigation";
import DashboardPageFrame from "@/components/dashboard/DashboardPageFrame";
import { LeadManagement } from "@/components/leads/LeadManagement";
import { isLocale } from "@/lib/i18n";
import { loadLeads } from "@/lib/leads/server";

export default async function LeadsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const result = await loadLeads();
  return <DashboardPageFrame locale={params.locale} title="Leads"><LeadManagement locale={params.locale} initialLeads={result.data} initialError={result.error} /></DashboardPageFrame>;
}
