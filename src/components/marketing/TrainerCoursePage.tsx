import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTrainerCourseText, trainerZaloUrl } from "@/lib/data/trainer-course";
import InstructorAvatar from "@/components/marketing/InstructorAvatar";
import PublicHeader from "@/components/layout/PublicHeader";

export default function TrainerCoursePage({ locale }: { locale: Locale }) {
  const { overview, labels, plans, methodology, curriculum, instructor } = getTrainerCourseText(locale);

  return (
    <main className="training-site" lang={locale}>
      <PublicHeader locale={locale} pathname={`/${locale}/dao-tao-hlv`} />

      <section className="training-hero">
        <div className="container training-hero-grid">
          <div className="training-hero-copy">
            <div className="eyebrow">{overview.eyebrow}</div>
            <h1>{overview.title}</h1>
            <p>{overview.description}</p>
            <div className="actions">
              <a className="button button-coral" href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
                {overview.primaryCta} <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-ghost" href="#goi-hoc">{overview.secondaryCta}</a>
            </div>
          </div>
          <div className="training-hero-card" aria-label={overview.length}>
            <span className="training-card-label">FITMANAGER · EDUCATION</span>
            <strong>48</strong>
            <span className="training-hours">{locale === "vi" ? "GIỜ HỌC CHUYÊN MÔN" : "HOURS OF PROFESSIONAL LEARNING"}</span>
            <div className="training-card-footer">
              <span>{overview.sessions}</span>
              <span>{overview.chapters}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="goi-hoc" className="section training-section">
        <div className="container">
          <div className="training-section-heading">
            <div>
              <div className="eyebrow">{labels.plansEyebrow}</div>
              <h2>{labels.plansTitle}</h2>
              <p>{labels.planNote}</p>
            </div>
          </div>
          <div className="training-plan-grid">
            {plans.map((plan) => (
              <article className={`training-plan${"recommended" in plan && plan.recommended ? " is-recommended" : ""}`} key={plan.id}>
                {"recommended" in plan && plan.recommended && <span className="training-plan-badge">{labels.recommended}</span>}
                <h3>{plan.name[locale]}</h3>
                <p className="training-plan-description">{plan.description[locale]}</p>
                <p className="training-plan-price">{plan.price}<span>đ</span></p>
                <p className="training-plan-rate">{plan.pricePerHour[locale]}</p>
                <ul>{plan.features[locale].map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <a className="button button-dark training-plan-cta" href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
                  {labels.register} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section training-method-section">
        <div className="container">
          <div className="training-section-heading">
            <div>
              <div className="eyebrow">{labels.methodEyebrow}</div>
              <h2>{labels.methodTitle}</h2>
            </div>
            <p>{overview.description}</p>
          </div>
          <div className="training-method-grid">
            {methodology.map((step, index) => (
              <article className="training-method-card" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section training-curriculum-section">
        <div className="container training-curriculum-grid">
          <div>
            <div className="eyebrow">{labels.curriculumEyebrow}</div>
            <h2>{labels.curriculumTitle}</h2>
            <p>{labels.curriculumNote}</p>
            <div className="training-curriculum-meta">{labels.schedule}</div>
          </div>
          <ol className="training-curriculum-list">
            {curriculum.map((topic, index) => (
              <li key={topic}><span>{String(index + 1).padStart(2, "0")}</span>{topic}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section training-instructor-section">
        <div className="container training-instructor">
          <InstructorAvatar />
          <div>
            <div className="eyebrow">{labels.instructorEyebrow}</div>
            <h2>{instructor.name}</h2>
            <p className="training-instructor-role">{instructor.role}</p>
            <p>{instructor.description}</p>
          </div>
        </div>
      </section>

      <section className="section training-terms-section">
        <div className="container training-terms-grid">
          <div>
            <div className="eyebrow">{labels.termsEyebrow}</div>
            <h2>{labels.termsTitle}</h2>
          </div>
          <ul>{labels.terms.map((term) => <li key={term}>{term}</li>)}</ul>
        </div>
      </section>

      <section className="training-contact-section">
        <div className="container training-contact">
          <div>
            <h2>{labels.contactTitle}</h2>
            <p>{labels.contactText}</p>
          </div>
          <a className="button button-dark" href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
            {overview.primaryCta} · 0358 914 534 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="training-footer">
        <div className="container training-footer-inner">
          <Link href={`/${locale}`} className="brand">Tuấn Đơn Giản</Link>
          <span>{labels.footer}</span>
          <Link href={`/${locale}`}>{labels.backHome}</Link>
        </div>
      </footer>
    </main>
  );
}
