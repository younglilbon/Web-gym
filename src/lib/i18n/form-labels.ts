import type { Locale } from "@/lib/i18n/config";
export const formLabels = {
  vi: { contactMethod: "Cách liên hệ ưu tiên", phone: "Điện thoại", email: "Email", consent: "Tôi đồng ý để FitManager sử dụng thông tin này để liên hệ tư vấn.", consentRequired: "Vui lòng xác nhận đồng ý.", privacy: "Chúng tôi chỉ dùng thông tin để phản hồi yêu cầu tư vấn." },
  en: { contactMethod: "Preferred contact method", phone: "Phone", email: "Email", consent: "I agree that FitManager may use this information to contact me about a consultation.", consentRequired: "Please confirm your consent.", privacy: "We only use this information to respond to your consultation request." },
} as const satisfies Record<Locale, Record<string, string>>;
