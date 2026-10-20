import { notFound } from "next/navigation";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { isLocale } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/auth/server";
import { loadOverview } from "@/lib/dashboard/overview";

export default async function LocalizedDashboard({ params, searchParams }: { params: { locale: string }; searchParams: { period?: string } }) { if (!isLocale(params.locale)) notFound(); const profile = await getCurrentProfile(); const result = await loadOverview(searchParams.period); return <DashboardOverview locale={params.locale} data={result.data} error={result.error} profileName={profile?.full_name ?? undefined} />; }
