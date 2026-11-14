import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/content/guides";
import { CODES, GOLD_TYPES } from "@/lib/currencies";
import { PAIRS } from "@/lib/pairs";

const VALID: Record<string, Set<string>> = {
  currency: new Set(CODES),
  gold: new Set(GOLD_TYPES),
  convert: new Set(PAIRS.map((p) => p.slug)),
  guides: new Set(GUIDES.map((g) => g.slug)),
};

/**
 * Cache Components streams unlisted dynamic paths with a 200 on the first hit.
 * Reject unknown ids here so crawlers always get a real 404.
 */
export function proxy(req: NextRequest) {
  const [, section, id] = req.nextUrl.pathname.split("/");
  if (!VALID[section]?.has(id)) {
    return NextResponse.rewrite(new URL("/not-a-real-page", req.url), { status: 404 });
  }
}

export const config = { matcher: ["/currency/:code", "/gold/:type", "/convert/:pair", "/guides/:slug"] };
