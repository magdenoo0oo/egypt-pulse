import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { LOCALES, href } from "@/i18n/config";
import { loadRows } from "@/lib/rates";
import { CODES, GOLD_TYPES, SITE } from "@/lib/currencies";
import { PAIRS } from "@/lib/pairs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const days = (await loadRows()).map((r) => r.date);
  const daily = [
    "/", "/currencies", "/gold", "/silver", "/convert", "/movers", "/race", "/map", "/matrix", "/volatility", "/day",
    ...CODES.map((c) => `/currency/${c}`),
    ...GOLD_TYPES.map((t) => `/gold/${t}`),
    ...PAIRS.map((p) => `/convert/${p.slug}`),
  ];
  const rare = ["/developers", "/methodology", "/guides", "/glossary", ...GUIDES.map((g) => `/guides/${g.slug}`)];
  const entry = (path: string, changeFrequency: "daily" | "monthly", priority: number) =>
    LOCALES.map((l) => ({
      url: `${SITE.url}${href(l, path) === "/" ? "" : href(l, path)}`,
      changeFrequency,
      priority,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE.url}${href(x, path) === "/" ? "" : href(x, path)}`])) },
    }));
  // Day pages are fully built for Arabic and English; the other locales render them on demand and are not listed.
  const dayEntries: MetadataRoute.Sitemap = days.flatMap((d) =>
    (["ar", "en"] as const).map((l) => ({
      url: `${SITE.url}${href(l, `/day/${d}`)}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
      alternates: { languages: Object.fromEntries((["ar", "en"] as const).map((x) => [x, `${SITE.url}${href(x, `/day/${d}`)}`])) },
    })),
  );
  return [
    ...dayEntries,
    ...daily.flatMap((p) => entry(p, "daily", p === "/" ? 1 : p.startsWith("/convert/") ? 0.5 : 0.8)),
    ...rare.flatMap((p) => entry(p, "monthly", 0.5)),
  ];
}
