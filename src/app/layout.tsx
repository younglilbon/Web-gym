import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "FitManager — Personal training, made personal", template: "%s | FitManager" },
  description: "A simple management platform for trainers and small studios.",
  applicationName: "FitManager",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = headers().get("x-fitmanager-locale") === "en" ? "en" : "vi";
  return <html lang={locale}><body>{children}</body></html>;
}
