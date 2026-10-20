import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import { blogPosts, packages, services, testimonials } from "@/lib/data";
import { getDictionary, isLocale } from "@/lib/i18n";

export default function LocalizedHome({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const t = getDictionary(locale);

  return <main lang={locale}>
    <PublicHeader locale={locale} />
    <section className="container hero hero-premium">
      <div className="hero-copy"><div className="eyebrow">{t.hero.eyebrow}</div><h1>{t.hero.title}<br /><span>{t.hero.accent}</span></h1><p>{t.hero.body}</p><div className="actions"><Link href={`/${locale}/consultation`} className="button button-coral">{t.hero.cta}</Link><a href="#services" className="button button-ghost">{t.hero.secondary}</a></div><div className="trust-row"><span>★★★★★</span><span>{t.public.clients}</span></div></div>
      <div className="hero-visual"><div className="hero-visual-top"><span className="status-dot" /> {t.public.training}</div><div className="hero-silhouette"><div className="silhouette-head" /><div className="silhouette-body" /><div className="silhouette-arm" /></div><div className="hero-visual-note"><strong>01</strong><span>{t.public.goal}</span></div><div className="hero-visual-word">{t.public.heroWord}</div></div>
    </section>

    <section className="proof-strip"><div className="container proof-grid"><div><strong>12+</strong><span>{t.public.years}</span></div><div><strong>1:1</strong><span>{t.public.focused}</span></div><div><strong>120+</strong><span>{t.public.clients}</span></div><div><strong>4.9/5</strong><span>{t.public.rating}</span></div></div></section>

    <section id="services" className="section section-light"><div className="container"><div className="section-heading"><div><div className="eyebrow">{t.services.eyebrow}</div><h2>{t.services.title}</h2></div><p>{t.services.body}</p></div><div className="service-grid premium-grid">{services.map((service) => <article className={`service-card ${service.tone}`} key={service.number}><div className="service-number">{service.number}</div><div><h3>{service.title[locale]}</h3><p>{service.description[locale]}</p></div><span className="arrow-mark">↗</span></article>)}</div></div></section>

    <section id="story" className="section section-dark"><div className="container story-grid"><div className="story-portrait"><div className="portrait-label">NAM NGUYỄN<br /><span>{t.public.trainerLabel}</span></div><div className="portrait-shape" /></div><div className="story-content"><div className="eyebrow light">{t.public.trainerEyebrow}</div><h2>{t.public.trainerTitle}</h2><p>{t.public.trainerBody}</p><Link href={`/${locale}/consultation`} className="text-link">{t.public.meetTrainer} →</Link></div></div></section>

    <section className="section section-cream"><div className="container"><div className="section-heading"><div><div className="eyebrow">{t.public.memberships}</div><h2>{t.public.membershipTitle}</h2></div><Link href={`/${locale}/consultation`} className="text-link">{t.public.options} →</Link></div><div className="package-grid">{packages.map((item) => <article className={`package-card ${item.featured ? "featured" : ""}`} key={item.name.en}>{item.featured && <span className="package-badge">{t.packages.popular}</span>}<div className="package-top"><span>{item.name[locale]}</span><span className="package-arrow">↗</span></div><div className="package-price">{item.price}<small> ₫</small></div><p>{item.detail[locale]}</p><div className="package-line" /><span className="package-note">{t.packages.tailored}</span></article>)}</div></div></section>

    <section className="section section-blush"><div className="container testimonial-layout"><div><div className="eyebrow">{t.public.stories}</div><h2>{t.public.storiesTitle}</h2><p className="muted-copy">{t.public.sampleContent}</p></div><div className="testimonial-list">{testimonials.map((item) => <blockquote key={item.name}><div className="quote-mark">“</div><p>{item.quote[locale]}</p><footer><span className="avatar-dot">{item.name.slice(0, 1)}</span><span><strong>{item.name}</strong><small>{item.role[locale]}</small></span></footer></blockquote>)}</div></div></section>

    <section className="section section-light"><div className="container"><div className="section-heading"><div><div className="eyebrow">{t.public.journal}</div><h2>{t.public.journalTitle}</h2></div><Link href={`/${locale}/blog`} className="text-link">{t.public.readAll} →</Link></div><div className="blog-preview-grid">{blogPosts.map((post, index) => <article className="blog-preview" key={post.slug}><div className={`blog-thumb thumb-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span></div><small>{post.date}</small><h3>{post.title[locale]}</h3><p>{post.excerpt[locale]}</p><Link href={`/${locale}/blog/${post.slug}`}>{t.public.readArticle} →</Link></article>)}</div></div></section>

    <section id="contact" className="cta-section"><div className="container cta-content"><div className="eyebrow">{t.public.startEyebrow}</div><h2>{t.public.startTitle}</h2><Link href={`/${locale}/consultation`} className="button button-dark">{t.hero.cta}</Link></div></section>
    <footer className="site-footer"><div className="container footer-grid"><div><div className="brand">fit<span>.</span>manager</div><p>{t.public.footerTagline}</p></div><div><span className="footer-label">{t.public.explore}</span><Link href={`/${locale}#services`}>{t.nav.services}</Link><Link href={`/${locale}/blog`}>{t.nav.blog}</Link></div><div><span className="footer-label">{t.public.hello}</span><a href="mailto:hello@fitmanager.vn">hello@fitmanager.vn</a><span>Hà Nội · Hồ Chí Minh</span></div></div><div className="container footer-bottom"><span>© 2026 FitManager</span><span>{t.public.demo}</span></div></footer>
  </main>;
}
