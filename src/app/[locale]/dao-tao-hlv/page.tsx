import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrainerCoursePage from "@/components/marketing/TrainerCoursePage";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Đào tạo huấn luyện viên",
  description: "Khóa đào tạo chuyên môn dành cho huấn luyện viên cá nhân.",
};

export default function TrainerCourseRoute({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return <TrainerCoursePage locale={params.locale} />;
}
