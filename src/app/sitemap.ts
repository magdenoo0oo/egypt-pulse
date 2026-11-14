import type { MetadataRoute } from "next";
import { CODES, GOLD_TYPES, SITE } from "@/lib/currencies";

export default function sitemap(): MetadataRoute.Sitemap {
  const daily = ["", "/currencies", "/gold", "/silver", "/convert", "/movers", ...CODES.map((c) => `/currency/${c}`), ...GOLD_TYPES.map((t) => `/gold/${t}`)];
  const rare = ["/developers", "/methodology"];
  return [
    ...daily.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.8 })),
    ...rare.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
