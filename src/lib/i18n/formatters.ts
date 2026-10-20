import type { Locale } from "@/lib/i18n/config";

const localeMap: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };
export function formatCurrency(amount: number, locale: Locale) { return new Intl.NumberFormat(localeMap[locale], { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount); }
export function formatNumber(amount: number, locale: Locale) { return new Intl.NumberFormat(localeMap[locale]).format(amount); }
export function formatDate(date: Date, locale: Locale) { return new Intl.DateTimeFormat(localeMap[locale], { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date); }
