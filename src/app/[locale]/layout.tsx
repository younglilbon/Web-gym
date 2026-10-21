import type { ReactNode } from "react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { const locale = params.locale === "en" ? "en" : "vi"; const brand = "Tuấn Đơn Giản"; return { title: locale === "vi" ? "Đào tạo huấn luyện viên" : "Personal Trainer Education", description: locale === "vi" ? "Các khóa đào tạo chuyên môn dành cho huấn luyện viên." : "Professional education courses for personal trainers.", alternates: { languages: { vi: "/vi", en: "/en" } }, openGraph: { type: "website", locale: locale === "vi" ? "vi_VN" : "en_US", siteName: brand } }; }

export default function PublicLocaleLayout({ children }: { children: ReactNode }) {
  return <div className="public-layout">{children}</div>;
}
