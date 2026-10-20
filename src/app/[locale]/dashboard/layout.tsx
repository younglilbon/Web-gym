import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { requireStaff } from "@/lib/auth/server";

export default async function LocalizedDashboardLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  await requireStaff(params.locale);
  return <div className="dashboard-layout">{children}</div>;
}
