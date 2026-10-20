import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary, otherLocale, switchLocalePath } from "@/lib/i18n";

export default function PublicHeader({ locale, pathname = `/${locale}` }: { locale: Locale; pathname?: string }) {
  const t = getDictionary(locale);
  const other = otherLocale(locale);
  const links = <><Link href={`/${locale}/about`}>{t.nav.story}</Link><Link href={`/${locale}/services`}>{t.nav.services}</Link><Link href={`/${locale}/blog`}>{t.nav.blog}</Link><Link href={`/${locale}/contact`}>{t.nav.contact}</Link></>;
  return <header className="container site-header"><Link href={`/${locale}`} className="brand" aria-label="FitManager">fit<span>.</span>manager</Link><nav className="desktop-nav" aria-label={t.nav.home}>{links}<Link href={switchLocalePath(pathname, other)} className="pill" aria-label={`${t.nav.language}: ${other.toUpperCase()}`}>{other.toUpperCase()}</Link><Link href={`/${locale}/dashboard`} className="pill primary">{t.nav.dashboard} →</Link></nav><details className="mobile-nav"><summary aria-label={t.nav.home}>☰</summary><div className="mobile-nav-panel">{links}<Link href={switchLocalePath(pathname, other)} className="pill" aria-label={`${t.nav.language}: ${other.toUpperCase()}`}>{other.toUpperCase()}</Link><Link href={`/${locale}/dashboard`} className="pill primary">{t.nav.dashboard} →</Link></div></details></header>;
}
