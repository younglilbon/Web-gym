import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { otherLocale, switchLocalePath } from "@/lib/i18n";

export default function PublicHeader({ locale, pathname = `/${locale}` }: { locale: Locale; pathname?: string }) {
  const other = otherLocale(locale);
  const languageLabel = locale === "vi" ? "Ngôn ngữ" : "Language";
  return (
    <header className="container site-header">
      <Link href={`/${locale}`} className="brand" aria-label="Tuấn Đơn Giản">Tuấn Đơn Giản</Link>
      <nav className="desktop-nav" aria-label={languageLabel}>
        <Link href={`/${locale}/auth/login`} className="pill auth-header-link">
          {locale === "vi" ? "Đăng nhập" : "Sign in"}
        </Link>
        <Link
          href={switchLocalePath(pathname, other)}
          className="pill"
          aria-label={`${languageLabel}: ${other.toUpperCase()}`}
        >
          {other.toUpperCase()}
        </Link>
      </nav>
    </header>
  );
}
