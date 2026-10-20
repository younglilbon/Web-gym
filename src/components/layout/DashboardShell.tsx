import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import type { Locale } from "@/lib/i18n";

export function DashboardShell({ children, locale }: { children: ReactNode; locale: Locale }) { return <div className="min-h-screen bg-cream md:flex"><DashboardSidebar locale={locale} /><main className="min-w-0 flex-1">{children}</main></div>; }
