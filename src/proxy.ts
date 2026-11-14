import { NextResponse, type NextRequest } from "next/server";
import { CODES, GOLD_TYPES } from "@/lib/currencies";

const VALID: Record<string, Set<string>> = {
  currency: new Set(CODES),
  gold: new Set(GOLD_TYPES),
};

/**
 * Cache Components streams unlisted dynamic paths with a 200 on the first hit.
 * Reject unknown currencies and gold types here so crawlers always get a real 404.
 */
export function proxy(req: NextRequest) {
  const [, section, id] = req.nextUrl.pathname.split("/");
  if (!VALID[section]?.has(id)) {
    return NextResponse.rewrite(new URL("/not-a-real-page", req.url), { status: 404 });
  }
}

export const config = { matcher: ["/currency/:code", "/gold/:type"] };
