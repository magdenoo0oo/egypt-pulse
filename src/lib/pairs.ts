import { CODES, isCode, type Code } from "./currencies";

export type Pair = { from: Code | "egp"; to: Code | "egp"; slug: string };

/** Every supported pair is "<code>-to-egp" or "egp-to-<code>". */
export const PAIRS: Pair[] = CODES.flatMap((c) => [
  { from: c, to: "egp" as const, slug: `${c}-to-egp` },
  { from: "egp" as const, to: c, slug: `egp-to-${c}` },
]);

export function parsePair(slug: string): Pair | null {
  const [a, b] = slug.split("-to-");
  if (!a || !b) return null;
  if (a === "egp" && isCode(b)) return { from: "egp", to: b, slug };
  if (b === "egp" && isCode(a)) return { from: a, to: "egp", slug };
  return null;
}
