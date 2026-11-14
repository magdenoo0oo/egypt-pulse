/**
 * Static catalogue shared by the app, the API and scripts/collect.ts.
 * Keep this file free of framework imports so the collector can load it with tsx.
 *
 * Every stored value is "EGP per `unit` units of the currency" (JPY and INR are quoted per 100,
 * the way exchange offices quote them).
 */
export type Group = "main" | "gulf" | "world";

export const GROUPS: Record<Group, string> = {
  main: "العملات الرئيسية",
  gulf: "الخليج والدول العربية",
  world: "عملات العالم",
};

export const CURRENCIES = {
  usd: { name: "الدولار الأمريكي", short: "دولار", iso: "USD", group: "main", unit: 1 },
  eur: { name: "اليورو", short: "يورو", iso: "EUR", group: "main", unit: 1 },
  gbp: { name: "الجنيه الإسترليني", short: "إسترليني", iso: "GBP", group: "main", unit: 1 },
  chf: { name: "الفرنك السويسري", short: "فرنك سويسري", iso: "CHF", group: "main", unit: 1 },
  sar: { name: "الريال السعودي", short: "ريال سعودي", iso: "SAR", group: "gulf", unit: 1 },
  aed: { name: "الدرهم الإماراتي", short: "درهم", iso: "AED", group: "gulf", unit: 1 },
  kwd: { name: "الدينار الكويتي", short: "دينار كويتي", iso: "KWD", group: "gulf", unit: 1 },
  qar: { name: "الريال القطري", short: "ريال قطري", iso: "QAR", group: "gulf", unit: 1 },
  bhd: { name: "الدينار البحريني", short: "دينار بحريني", iso: "BHD", group: "gulf", unit: 1 },
  omr: { name: "الريال العماني", short: "ريال عماني", iso: "OMR", group: "gulf", unit: 1 },
  jod: { name: "الدينار الأردني", short: "دينار أردني", iso: "JOD", group: "gulf", unit: 1 },
  cad: { name: "الدولار الكندي", short: "دولار كندي", iso: "CAD", group: "world", unit: 1 },
  aud: { name: "الدولار الأسترالي", short: "دولار أسترالي", iso: "AUD", group: "world", unit: 1 },
  try: { name: "الليرة التركية", short: "ليرة تركية", iso: "TRY", group: "world", unit: 1 },
  cny: { name: "اليوان الصيني", short: "يوان", iso: "CNY", group: "world", unit: 1 },
  jpy: { name: "الين الياباني", short: "ين", iso: "JPY", group: "world", unit: 100 },
  inr: { name: "الروبية الهندية", short: "روبية", iso: "INR", group: "world", unit: 100 },
  sek: { name: "الكرونة السويدية", short: "كرونة سويدية", iso: "SEK", group: "world", unit: 1 },
} as const satisfies Record<
  string,
  { name: string; short: string; iso: string; group: Group; unit: number }
>;

export type Code = keyof typeof CURRENCIES;
export const CODES = Object.keys(CURRENCIES) as Code[];
export const isCode = (c: string): c is Code => Object.hasOwn(CURRENCIES, c);

/** Metals are priced per gram in EGP. */
export const METALS = ["gold24", "silver"] as const;
export type Metal = (typeof METALS)[number];
export type Key = Code | Metal;
export const COLUMNS: Key[] = [...CODES, ...METALS];

export const unitOf = (c: Code): number => CURRENCIES[c].unit;

/** Gold products sold in Egypt. `grams` is the weight, `karat` the purity out of 24. */
export const GOLD = {
  "24": { name: "عيار ٢٤", karat: 24, grams: 1, label: "جرام ذهب عيار ٢٤" },
  "21": { name: "عيار ٢١", karat: 21, grams: 1, label: "جرام ذهب عيار ٢١" },
  "18": { name: "عيار ١٨", karat: 18, grams: 1, label: "جرام ذهب عيار ١٨" },
  "14": { name: "عيار ١٤", karat: 14, grams: 1, label: "جرام ذهب عيار ١٤" },
  pound: { name: "الجنيه الذهب", karat: 21, grams: 8, label: "الجنيه الذهب (٨ جرام عيار ٢١)" },
  "half-pound": { name: "نصف جنيه ذهب", karat: 21, grams: 4, label: "نصف جنيه ذهب (٤ جرام عيار ٢١)" },
  ounce: { name: "أوقية الذهب", karat: 24, grams: 31.1034768, label: "أوقية الذهب (٣١٫١ جرام عيار ٢٤)" },
} as const;
export type GoldType = keyof typeof GOLD;
export const GOLD_TYPES = Object.keys(GOLD) as GoldType[];
export const isGoldType = (t: string): t is GoldType => Object.hasOwn(GOLD, t);

export const SITE = {
  name: "تسعيرة",
  latin: "Tas3era",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://egypt-pulse.vercel.app",
};
