import { en } from "@/lib/i18n/dictionaries/en";
import { vi } from "@/lib/i18n/dictionaries/vi";
import { type Locale } from "@/lib/i18n/config";

export * from "@/lib/i18n/config";
export const dictionaries = { vi, en } as const;
export type Dictionary = typeof vi | typeof en;
export function getDictionary(locale: Locale): Dictionary { return dictionaries[locale]; }
