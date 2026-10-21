import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import InstructorAvatar from "@/components/marketing/InstructorAvatar";
import { getTrainerCourseText, trainerZaloUrl } from "@/lib/data/trainer-course";
import { isLocale } from "@/lib/i18n";

export const metadata = {
  title: "Giảng viên | FitManager",
  description: "Tìm hiểu về giảng viên khóa đào tạo huấn luyện viên.",
};

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { instructor, labels, methodology } = getTrainerCourseText(locale);

  return (
    <main className="training-site" lang={locale}>
      <PublicHeader locale={locale} pathname={`/${locale}/about`} />
      <section className="section training-instructor-section">
        <div className="container training-instructor">
          <InstructorAvatar />
          <div>
            <div className="eyebrow">{labels.instructorEyebrow}</div>
            <h1>{instructor.name}</h1>
            <p className="training-instructor-role">{instructor.role}</p>
            <p>{instructor.description}</p>
            <Link href={`/${locale}/dao-tao-hlv`} className="button button-coral">
              {locale === "vi" ? "Xem khóa đào tạo" : "Explore the course"} →
            </Link>
          </div>
        </div>
      </section>
      <section className="section training-method-section">
        <div className="container">
          <div className="training-section-heading">
            <div><div className="eyebrow">{labels.methodEyebrow}</div><h2>{labels.methodTitle}</h2></div>
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
          <p className="training-about-contact">
            <a href={trainerZaloUrl} target="_blank" rel="noopener noreferrer">
              {locale === "vi" ? "Liên hệ qua Zalo · 0358 914 534" : "Contact us on Zalo · 0358 914 534"} ↗
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
