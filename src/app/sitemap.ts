import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { LOCALES, href } from "@/i18n/config";
import { CODES, GOLD_TYPES, SITE } from "@/lib/currencies";
import { PAIRS } from "@/lib/pairs";

export default function sitemap(): MetadataRoute.Sitemap {
  const daily = [
    "/", "/currencies", "/gold", "/silver", "/convert", "/movers",
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
  return [
    ...daily.flatMap((p) => entry(p, "daily", p === "/" ? 1 : p.startsWith("/convert/") ? 0.5 : 0.8)),
    ...rare.flatMap((p) => entry(p, "monthly", 0.5)),
  ];
}
