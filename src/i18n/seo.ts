import { DEFAULT_LOCALE, LOCALES, href, type Locale } from "./config";

/** canonical + hreflang alternates for a locale-free path like "/currency/usd". */
export function altLinks(locale: Locale, path: string) {
  return {
    canonical: href(locale, path),
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, href(l, path)])), "x-default": href(DEFAULT_LOCALE, path) },
  };
}
