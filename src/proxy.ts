import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/content/guides";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { CODES, GOLD_TYPES } from "@/lib/currencies";
import { PAIRS } from "@/lib/pairs";

const VALID: Record<string, Set<string>> = {
  currency: new Set(CODES),
  gold: new Set(GOLD_TYPES),
  convert: new Set(PAIRS.map((p) => p.slug)),
  guides: new Set(GUIDES.map((g) => g.slug)),
};

/**
 * 1. Arabic is the unprefixed default: `/currencies` is rewritten to `/ar/currencies`, and a visible `/ar/...` redirects back.
 * 2. Cache Components streams unlisted dynamic paths with a 200 on the first hit, so unknown ids get a real 404 here.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segs = pathname.split("/");
  const prefixed = hasLocale(segs[1] ?? "");

  if (prefixed && segs[1] === DEFAULT_LOCALE) {
    const to = req.nextUrl.clone();
    to.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(to, 308);
  }

  const locale = prefixed ? segs[1] : DEFAULT_LOCALE;
  const [section, id] = segs.slice(prefixed ? 2 : 1);
  if (id !== undefined && VALID[section] && !VALID[section].has(id)) {
    return NextResponse.rewrite(new URL(`/${locale}/not-a-real-page`, req.url), { status: 404 });
  }

  return prefixed ? NextResponse.next() : NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`, req.url));
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
