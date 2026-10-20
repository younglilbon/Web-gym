import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationForm from "@/components/marketing/ConsultationForm";
import PublicHeader from "@/components/layout/PublicHeader";
import { getDictionary, isLocale } from "@/lib/i18n";

export default function ConsultationPage({ params }: { params: { locale: string } }) { if (!isLocale(params.locale)) notFound(); const locale = params.locale; const t = getDictionary(locale); return <main lang={locale}><PublicHeader locale={locale} pathname={`/${locale}/consultation`} /><section className="container narrow-page"><div><div className="eyebrow">FITMANAGER</div><h1>{t.form.title}</h1><p>{t.hero.body}</p></div><ConsultationForm locale={locale} /></section><footer className="container footer"><Link href={`/${locale}`}>← {t.nav.home}</Link></footer></main>; }
