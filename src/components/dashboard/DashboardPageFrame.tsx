"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getDictionary, otherLocale, switchLocalePath, type Locale } from "@/lib/i18n";

export default function DashboardPageFrame({ locale, title, children }: { locale: Locale; title: string; children: ReactNode }) {
  const d = getDictionary(locale).dashboard; const pathname = usePathname(); const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="min-h-screen bg-cream md:flex"><DashboardSidebar locale={locale} collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} /><main className="min-w-0 flex-1"><header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-ink/10 bg-cream/90 px-4 backdrop-blur-md md:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white md:hidden" aria-label={d.workspace}>☰</button><button onClick={() => setCollapsed((value) => !value)} className="hidden h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white md:grid" aria-label={d.workspace}>{collapsed ? "→" : "←"}</button><div className="text-xs text-ink/50">{d.workspace} / {title}</div></div><div className="flex items-center gap-2"><button className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white" aria-label={d.notifications}>♧<span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" /></button><Link href={switchLocalePath(pathname, otherLocale(locale))} className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-xs font-bold" aria-label={d.language}>{otherLocale(locale).toUpperCase()}</Link><span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-xs font-extrabold">NN</span></div></header><div className="mx-auto max-w-[1440px] px-4 py-7 md:px-8 md:py-10"><div className="mb-8"><p className="text-xs text-ink/45">{d.breadcrumb}</p><h1 className="mt-2 text-3xl font-black tracking-[-.06em]">{title}</h1></div>{children}</div></main></div>;
}
