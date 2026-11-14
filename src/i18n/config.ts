/** Eleven locales. Arabic is the source language and lives at the unprefixed URL; the others are /en, /fr, ... */
export const LOCALES = ["ar", "en", "fr", "es", "de", "tr", "ru", "zh", "hi", "pt", "it"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";

export const LOCALE_META: Record<Locale, { name: string; dir: "rtl" | "ltr"; tag: string }> = {
  ar: { name: "العربية", dir: "rtl", tag: "ar-EG" },
  en: { name: "English", dir: "ltr", tag: "en-US" },
  fr: { name: "Français", dir: "ltr", tag: "fr-FR" },
  es: { name: "Español", dir: "ltr", tag: "es-ES" },
  de: { name: "Deutsch", dir: "ltr", tag: "de-DE" },
  tr: { name: "Türkçe", dir: "ltr", tag: "tr-TR" },
  ru: { name: "Русский", dir: "ltr", tag: "ru-RU" },
  zh: { name: "中文", dir: "ltr", tag: "zh-CN" },
  hi: { name: "हिन्दी", dir: "ltr", tag: "hi-IN" },
  pt: { name: "Português", dir: "ltr", tag: "pt-BR" },
  it: { name: "Italiano", dir: "ltr", tag: "it-IT" },
};

export const hasLocale = (l: string): l is Locale => (LOCALES as readonly string[]).includes(l);

/** Long-form content (guides, glossary, notes) exists in Arabic and English only; other locales read English. */
export const contentLocale = (l: Locale): "ar" | "en" => (l === "ar" ? "ar" : "en");
export const hasNativeContent = (l: Locale) => l === "ar" || l === "en";

/** Locale-prefixed path; the default locale stays unprefixed so existing URLs keep working. */
export function href(locale: Locale, path: string): string {
  const p = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? p || "/" : `/${locale}${p}`;
}
