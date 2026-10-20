export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export function otherLocale(locale: Locale): Locale { return locale === "vi" ? "en" : "vi"; }
export function switchLocalePath(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  if (isLocale(parts[1] ?? "")) parts[1] = locale; else parts.splice(1, 0, locale);
  return parts.join("/") || `/${locale}`;
}
