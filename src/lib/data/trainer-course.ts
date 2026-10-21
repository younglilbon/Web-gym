import type { Locale } from "@/lib/i18n";

export const trainerZaloUrl = "https://zalo.me/84358914534";

export const trainerCourse = {
  overview: {
    vi: {
      eyebrow: "ĐÀO TẠO HỌC VIÊN",
      title: "Giúp Người mới biết được những kiến thức cơ bản.",
      description:
        "Khóa học này dành cho học viên muốn hiểu rõ cơ thể, dinh dưỡng và cách xây dựng lộ trình tập luyện từ dữ liệu thực tế.",
      length: "48 giờ học",
      sessions: "16 buổi · 2 buổi/tuần",
      chapters: "25 chương",
      classSize: "12–20 học viên",
      primaryCta: "Tư vấn qua Zalo",
      secondaryCta: "Xem các gói học",
    },
    en: {
      eyebrow: "STUDENT EDUCATION",
      title: "Helping beginners learn the fundamentals.",
      description:
        "This course is for learners who want to understand the body, nutrition, and how to build training plans from real-world data.",
      length: "48 learning hours",
      sessions: "16 sessions · twice a week",
      chapters: "25 chapters",
      classSize: "12–20 learners",
      primaryCta: "Ask us on Zalo",
      secondaryCta: "Explore course plans",
    },
  },
  plans: [
    {
      id: "foundation",
      name: { vi: "Cơ bản", en: "Foundation" },
      price: "7.900.000",
      pricePerHour: { vi: "Khoảng 165.000đ/giờ học", en: "About 165,000 VND/hour" },
      description: {
        vi: "Nắm nền tảng chuyên môn và hiểu cách giải thích các chỉ số thường gặp.",
        en: "Build a solid foundation and learn to explain common fitness metrics.",
      },
      features: {
        vi: [
          "16 buổi học trực tuyến (48 giờ)",
          "Giáo trình 25 chương và slide bài giảng",
          "Bài tập, câu hỏi ôn tập và đáp án",
          "Bài kiểm tra cuối khóa và chứng nhận hoàn thành",
          "Tham gia nhóm hỗ trợ sau khóa học",
        ],
        en: [
          "16 online sessions (48 hours)",
          "25-chapter course book and lecture slides",
          "Practice exercises, review questions, and answers",
          "Final assessment and course completion certificate",
          "Post-course learning support group",
        ],
      },
    },
    {
      id: "advanced",
      name: { vi: "Chuyên sâu", en: "Advanced" },
      price: "10.900.000",
      pricePerHour: { vi: "Khoảng 225.000đ/giờ học", en: "About 225,000 VND/hour" },
      description: {
        vi: "Thực hành áp dụng kiến thức và cùng giảng viên phân tích tình huống thật.",
        en: "Apply the material and work through real-world cases with the instructor.",
      },
      recommended: true,
      features: {
        vi: [
          "Tất cả quyền lợi của gói Cơ bản",
          "3 tháng sử dụng ứng dụng hỗ trợ huấn luyện (tối đa 5 học viên)",
          "2 buổi phân tích case do học viên mang tới",
        ],
        en: [
          "Everything in the Foundation plan",
          "Three months using the coaching support app (up to 5 clients)",
          "Two sessions reviewing learner-submitted cases",
        ],
      },
    },
    {
      id: "mentoring",
      name: { vi: "Kèm 1:1", en: "1:1 Mentoring" },
      price: "15.900.000",
      pricePerHour: { vi: "Kèm riêng sau khóa học", en: "Includes individual follow-up" },
      description: {
        vi: "Có người hướng dẫn riêng trong giai đoạn đầu áp dụng kiến thức vào công việc.",
        en: "Get individual guidance as you start applying the course in your work.",
      },
      features: {
        vi: [
          "Tất cả quyền lợi của gói Chuyên sâu",
          "4 buổi kèm 1:1 trong 2 tháng sau khóa",
          "Cùng xem lại tình huống với học viên thực tế",
        ],
        en: [
          "Everything in the Advanced plan",
          "Four 1:1 sessions during the two months after the course",
          "Review cases from your own coaching practice",
        ],
      },
    },
  ],
  methodology: {
    vi: [
      {
        title: "Nền tảng có căn cứ",
        description: "Học các nguyên lý về cơ thể, dinh dưỡng và tập luyện dựa trên tài liệu chuyên môn.",
      },
      {
        title: "Thực hành ngay trong buổi học",
        description: "Tính toán chỉ số, đọc dữ liệu và làm bài tập để hiểu cách áp dụng vào công việc.",
      },
      {
        title: "Phân tích tình huống",
        description: "Thảo luận ví dụ học viên, cách theo dõi tiến độ và điều chỉnh lộ trình phù hợp.",
      },
    ],
    en: [
      {
        title: "Evidence-informed foundations",
        description: "Learn core principles of the body, nutrition, and training from professional references.",
      },
      {
        title: "Practice during class",
        description: "Calculate metrics, interpret data, and work through exercises you can use at work.",
      },
      {
        title: "Case-based learning",
        description: "Discuss learner examples, progress tracking, and how to adjust a training plan.",
      },
    ],
  },
  curriculum: {
    vi: [
      "Thành phần cơ thể và cách đo tỷ lệ mỡ",
      "FFMI, calo, BMR và TDEE",
      "Điều chỉnh năng lượng và dinh dưỡng theo mục tiêu",
      "Theo dõi bữa ăn và các vi chất thiết yếu",
      "Cơ bắp phát triển và khối lượng tập phù hợp",
      "Cường độ, lịch tập, tăng tiến và deload",
      "Thiết kế lộ trình và trao đổi với học viên",
      "Đọc báo cáo tiến độ, xử lý chững cân",
      "Thực hành tổng hợp qua các tình huống mẫu",
      "Kiểm tra cuối khóa và tổng kết",
    ],
    en: [
      "Body composition and body-fat measurement",
      "FFMI, calories, BMR, and TDEE",
      "Adjusting energy intake and nutrition to a goal",
      "Food tracking and essential micronutrients",
      "Muscle growth and appropriate training volume",
      "Intensity, schedules, progressive overload, and deloads",
      "Planning a program and communicating with clients",
      "Reading progress reports and handling weight plateaus",
      "Integrated practice with sample cases",
      "Final assessment and course wrap-up",
    ],
  },
  instructor: {
    name: "Anh Tuấn",
    role: { vi: "Giảng viên khóa đào tạo HLV", en: "Personal Trainer Course Instructor" },
    description: {
      vi: "Hướng dẫn học viên kết nối kiến thức chuyên môn với dữ liệu và tình huống thực tế trong quá trình huấn luyện.",
      en: "Guides learners in connecting professional knowledge with real coaching data and situations.",
    },
  },
  labels: {
    vi: {
      plansEyebrow: "HỌC PHÍ RÕ RÀNG",
      plansTitle: "Chọn mức đồng hành phù hợp",
      planNote: "Học phí tham khảo theo bảng giá khóa học 2026.",
      recommended: "ĐƯỢC LỰA CHỌN NHIỀU",
      register: "Đăng ký khóa học",
      methodEyebrow: "CÁCH HỌC",
      methodTitle: "Hiểu kiến thức, thực hành và áp dụng",
      curriculumEyebrow: "NỘI DUNG CHƯƠNG TRÌNH",
      curriculumTitle: "Các chủ đề bạn sẽ học",
      curriculumNote: "Khóa học gồm 16 buổi, mỗi buổi 3 giờ. Nội dung được nhóm theo chủ đề để dễ theo dõi.",
      instructorEyebrow: "NGƯỜI HƯỚNG DẪN",
      instructorTitle: "Học cùng giảng viên",
      termsEyebrow: "LƯU Ý",
      termsTitle: "Trước khi đăng ký",
      terms: [
        "Chứng nhận là chứng nhận hoàn thành khóa học của đơn vị đào tạo, không thay thế chứng chỉ hành nghề do cơ quan nhà nước cấp.",
        "Nội dung đào tạo hỗ trợ kiến thức huấn luyện, không thay thế chẩn đoán hoặc điều trị y khoa.",
        "Nhắn Zalo để xác nhận lịch khai giảng, học phí hiện hành và chính sách thanh toán trước khi đăng ký.",
      ],
      contactTitle: "Bạn chưa biết chọn gói nào?",
      contactText: "Trao đổi trực tiếp để chọn khóa học và hình thức học phù hợp.",
      schedule: "16 buổi · học trực tuyến",
      backHome: "Về trang chủ",
      footer: "Đào tạo huấn luyện viên · Tuấn Đơn Giản",
    },
    en: {
      plansEyebrow: "CLEAR COURSE PRICING",
      plansTitle: "Choose the right level of support",
      planNote: "Reference pricing from the 2026 course price list.",
      recommended: "POPULAR CHOICE",
      register: "Register for this course",
      methodEyebrow: "HOW YOU WILL LEARN",
      methodTitle: "Understand, practice, and apply",
      curriculumEyebrow: "COURSE CURRICULUM",
      curriculumTitle: "Topics covered",
      curriculumNote: "The course includes 16 three-hour sessions, grouped by topic for an easy-to-follow learning path.",
      instructorEyebrow: "YOUR INSTRUCTOR",
      instructorTitle: "Learn with an instructor",
      termsEyebrow: "PLEASE NOTE",
      termsTitle: "Before you register",
      terms: [
        "The completion certificate is issued by the training provider and is not a professional license issued by a government authority.",
        "This course provides coaching education and does not replace medical diagnosis or treatment.",
        "Message us on Zalo to confirm the next start date, current fee, and payment terms before registering.",
      ],
      contactTitle: "Not sure which plan is right for you?",
      contactText: "Talk to us directly to choose a suitable course and learning format.",
      schedule: "16 sessions · online",
      backHome: "Back to home",
      footer: "Personal Trainer Education · Tuấn Đơn Giản",
    },
  },
} as const;

export function getTrainerCourseText(locale: Locale) {
  return {
    overview: trainerCourse.overview[locale],
    labels: trainerCourse.labels[locale],
    plans: trainerCourse.plans,
    methodology: trainerCourse.methodology[locale],
    curriculum: trainerCourse.curriculum[locale],
    instructor: {
      name: trainerCourse.instructor.name,
      role: trainerCourse.instructor.role[locale],
      description: trainerCourse.instructor.description[locale],
    },
  };
}
