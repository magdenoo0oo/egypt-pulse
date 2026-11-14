import { contentLocale, type Locale } from "@/i18n/config";
import { GLOSSARY } from "./glossary";
import { GUIDES } from "./guides";
import { methodologyAr } from "./methodology";
import { CURRENCY_NOTES, GOLD_NOTES } from "./notes";
import { GLOSSARY_EN } from "./en/glossary";
import { GUIDES_EN } from "./en/guides";
import { methodologyEn } from "./en/methodology";
import { CURRENCY_NOTES_EN, GOLD_NOTES_EN } from "./en/notes";

/** Long-form content in Arabic or English; every other locale reads the English text. */
export function getContent(locale: Locale) {
  const ar = contentLocale(locale) === "ar";
  return {
    guides: ar ? GUIDES : GUIDES_EN,
    glossary: ar ? GLOSSARY : GLOSSARY_EN,
    currencyNotes: ar ? CURRENCY_NOTES : CURRENCY_NOTES_EN,
    goldNotes: ar ? GOLD_NOTES : GOLD_NOTES_EN,
    methodology: ar ? methodologyAr : methodologyEn,
  };
}
