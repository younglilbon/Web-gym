import { notFound } from "next/navigation";
import DashboardPageFrame from "@/components/dashboard/DashboardPageFrame";
import { EmptyState } from "@/components/shared/EmptyState";
import { getDictionary, isLocale } from "@/lib/i18n";

const sections = ["memberships", "training-plans", "schedule", "payments", "progress", "reports", "settings"] as const;
type Section = (typeof sections)[number];

export default function DashboardSectionPage({ params }: { params: { locale: string; section: string } }) {
  if (!isLocale(params.locale) || !sections.includes(params.section as Section)) notFound();
  const d = getDictionary(params.locale).dashboard;
  const labels: Record<Section, string> = { memberships: d.memberships, "training-plans": d.trainingPlans, schedule: d.schedule, payments: d.payments, progress: d.progress, reports: d.reports, settings: d.settings };
  const title = labels[params.section as Section];
  return <DashboardPageFrame locale={params.locale} title={title}><EmptyState title={getDictionary(params.locale).empty.title} description={getDictionary(params.locale).empty.description} /></DashboardPageFrame>;
}
