import { readFile } from "node:fs/promises";
import { join } from "node:path";

let cache: { at: number; dates: Set<string> } | null = null;

/**
 * Every date that has a row in data/rates.csv, for the proxy (real 404 on /day/:date).
 * Returns null when the file cannot be read, so the proxy fails open and the page decides.
 */
export async function knownDates(): Promise<Set<string> | null> {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache.dates;
  try {
    const csv = await readFile(join(process.cwd(), "data", "rates.csv"), "utf8");
    const dates = new Set(csv.trim().split("\n").slice(1).map((l) => l.slice(0, l.indexOf(","))));
    cache = { at: Date.now(), dates };
    return dates;
  } catch {
    return null;
  }
}
