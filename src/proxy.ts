import { NextResponse, type NextRequest } from "next/server";

const VALID = new Set(["usd", "eur", "sar", "gbp"]);

/**
 * Cache Components streams unlisted dynamic paths with a 200 on the first hit.
 * Reject unknown currencies here so crawlers always get a real 404.
 */
export function proxy(req: NextRequest) {
  const code = req.nextUrl.pathname.split("/")[2];
  if (!VALID.has(code)) {
    return NextResponse.rewrite(new URL("/not-a-real-page", req.url), { status: 404 });
  }
}

export const config = { matcher: "/currency/:code" };
