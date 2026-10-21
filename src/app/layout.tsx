import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Tuấn Đơn Giản — Đào tạo huấn luyện viên", template: "%s | Tuấn Đơn Giản" },
  description: "Khóa đào tạo chuyên môn dành cho huấn luyện viên cá nhân.",
  applicationName: "Tuấn Đơn Giản",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = headers().get("x-fitmanager-locale") === "en" ? "en" : "vi";
  return <html lang={locale}><body>{children}</body></html>;
}
