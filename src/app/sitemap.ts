import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { CODES, GOLD_TYPES, SITE } from "@/lib/currencies";
import { PAIRS } from "@/lib/pairs";

export default function sitemap(): MetadataRoute.Sitemap {
  const daily = [
    "", "/currencies", "/gold", "/silver", "/convert", "/movers",
    ...CODES.map((c) => `/currency/${c}`),
    ...GOLD_TYPES.map((t) => `/gold/${t}`),
    ...PAIRS.map((p) => `/convert/${p.slug}`),
  ];
  const rare = ["/developers", "/methodology", "/guides", "/glossary", ...GUIDES.map((g) => `/guides/${g.slug}`)];
  return [
    ...daily.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : p.startsWith("/convert/") ? 0.5 : 0.8 })),
    ...rare.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
