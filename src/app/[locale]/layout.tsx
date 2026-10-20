import type { ReactNode } from "react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { const locale = params.locale === "en" ? "en" : "vi"; return { title: locale === "vi" ? "Huấn luyện cá nhân chuyên nghiệp" : "Premium personal training", description: locale === "vi" ? "FitManager đồng hành cùng huấn luyện viên và studio nhỏ." : "FitManager helps trainers and small studios work better.", alternates: { languages: { vi: "/vi", en: "/en" } }, openGraph: { type: "website", locale: locale === "vi" ? "vi_VN" : "en_US", siteName: "FitManager" } }; }

export default function PublicLocaleLayout({ children }: { children: ReactNode }) {
  return <div className="public-layout">{children}</div>;
}
