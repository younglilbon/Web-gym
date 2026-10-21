import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import InstructorAvatar from "@/components/marketing/InstructorAvatar";
import { getTrainerCourseText, trainerZaloUrl } from "@/lib/data/trainer-course";
import { isLocale } from "@/lib/i18n";

export default function LocalizedHome({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { overview, labels, plans, methodology, instructor } = getTrainerCourseText(locale);

  return (
    <main className="training-site" lang={locale}>
      <PublicHeader locale={locale} />

      <section className="training-hero">
        <div className="container training-hero-grid">
          <div className="training-hero-copy">
            <div className="eyebrow">{overview.eyebrow}</div>
            <h1>{overview.title}</h1>
            <p>{overview.description}</p>
            <div className="actions">
              <a className="button button-coral" href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
                {locale === "vi" ? "Đăng ký HLV qua Zalo" : "Join as a trainer on Zalo"} <span aria-hidden="true">↗</span>
              </a>
              <Link className="button button-ghost" href={`/${locale}/dao-tao-hlv`}>
                {locale === "vi" ? "Xem khóa học" : "Explore the course"}
              </Link>
            </div>
          </div>
          <div className="training-hero-card">
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

      <section className="section training-section">
        <div className="container">
          <div className="training-section-heading">
            <div>
              <div className="eyebrow">{labels.plansEyebrow}</div>
              <h2>{labels.plansTitle}</h2>
            </div>
            <Link className="text-link" href={`/${locale}/dao-tao-hlv`}>{locale === "vi" ? "So sánh các gói →" : "Compare course plans →"}</Link>
          </div>
          <div className="training-plan-grid">
            {plans.map((plan) => (
              <article className={`training-plan${"recommended" in plan && plan.recommended ? " is-recommended" : ""}`} key={plan.id}>
                {"recommended" in plan && plan.recommended && <span className="training-plan-badge">{labels.recommended}</span>}
                <h3>{plan.name[locale]}</h3>
                <p className="training-plan-description">{plan.description[locale]}</p>
                <p className="training-plan-price">{plan.price}<span>đ</span></p>
                <Link className="text-link" href={`/${locale}/dao-tao-hlv`}>{locale === "vi" ? "Xem quyền lợi" : "See what is included"} →</Link>
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

      <section className="section training-instructor-section">
        <div className="container training-instructor">
          <InstructorAvatar />
          <div>
            <div className="eyebrow">{labels.instructorEyebrow}</div>
            <h2>{instructor.name}</h2>
            <p className="training-instructor-role">{instructor.role}</p>
            <p>{instructor.description}</p>
            <Link className="text-link" href={`/${locale}/dao-tao-hlv`}>{locale === "vi" ? "Tìm hiểu nội dung khóa học" : "Explore the course"} →</Link>
          </div>
        </div>
      </section>

      <section className="training-contact-section">
        <div className="container training-contact">
          <div>
            <h2>{labels.contactTitle}</h2>
            <p>{labels.contactText}</p>
          </div>
          <a className="button button-dark" href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
            {locale === "vi" ? "Đăng ký HLV · 0358 914 534" : "Join as a trainer · 0358 914 534"} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="training-footer">
        <div className="container training-footer-inner">
          <Link href={`/${locale}`} className="brand">Tuấn Đơn Giản</Link>
          <span>{labels.footer}</span>
          <Link href={`/${locale}/dao-tao-hlv`}>{locale === "vi" ? "Chi tiết khóa học" : "Course details"}</Link>
        </div>
      </footer>
    </main>
  );
}
