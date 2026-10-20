import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import { services } from "@/lib/data";
import { loadPublicPlans } from "@/lib/memberships/server";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale; const t = getDictionary(locale); const plans = await loadPublicPlans();
  return <main lang={locale}><PublicHeader locale={locale} pathname={`/${locale}/services`} /><section className="container blog-page"><div className="eyebrow">{t.services.eyebrow}</div><h1>{t.services.title}</h1><p className="lead-copy">{t.services.body}</p><div className="service-grid premium-grid">{services.map((service) => <article className={`service-card ${service.tone}`} key={service.number}><div className="service-number">{service.number}</div><div><h3>{service.title[locale]}</h3><p>{service.description[locale]}</p></div></article>)}</div><div className="section-heading service-packages-heading"><div><div className="eyebrow">{t.public.memberships}</div><h2>{t.public.membershipTitle}</h2></div></div><div className="package-grid">{plans.map((item) => <article className="package-card" key={item.id}><div className="package-top"><span>{item.name}</span></div><div className="package-price">{Number(item.price).toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}<small> ₫</small></div><p>{item[locale === "vi" ? "description_vi" : "description_en"] || item.description || `${item.session_count} sessions · ${item.duration_days} days`}</p><div className="package-line" /><span className="package-note">{item.session_count} · {item.duration_days} days</span></article>)}</div>{plans.length === 0 && <p className="lead-copy">{t.public.options}</p>}<div className="service-cta"><h2>{t.public.startTitle}</h2><Link href={`/${locale}/consultation`} className="button button-coral">{t.hero.cta} →</Link></div></section></main>;
}
