import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { COLUMNS, GOLD, unitOf, type Code, type GoldType, type Key } from "./currencies";

export * from "./currencies";

export type Row = { date: string } & Record<Key, number>;

/** Plain loader, used by the API route. This is the seam for a future database. */
export async function loadRows(): Promise<Row[]> {
  const csv = await readFile(join(process.cwd(), "data", "rates.csv"), "utf8");
  const [head, ...lines] = csv.trim().split("\n");
  const cols = head.split(",");
  return lines.map((l) => {
    const v = l.split(",");
    const row: Record<string, string | number> = {};
    cols.forEach((c, i) => (row[c] = c === "date" ? v[i] : Number(v[i])));
    return row as Row;
  });
}

/** Cached for the page render. Data only changes when the daily commit lands. */
export async function getRows(): Promise<Row[]> {
  "use cache";
  cacheLife("hours");
  return loadRows();
}

export async function getMeta(): Promise<{ checkedAt: string; latestDate: string; days: number; status?: "ok" | "stale" | "unreachable" }> {
  "use cache";
  cacheLife("hours");
  return JSON.parse(await readFile(join(process.cwd(), "data", "meta.json"), "utf8"));
}

export const hasColumns = (rows: Row[]) => COLUMNS.every((c) => c in rows[0]);

export function series(rows: Row[], key: Key, days?: number) {
  const r = days ? rows.slice(-days) : rows;
  return r.map((x) => x[key]);
}

/** Change over the last `days` rows (rows, not calendar days: the source occasionally skips a day). */
export function change(rows: Row[], key: Key, days = 1) {
  const last = rows.at(-1)![key];
  const prev = rows.at(-1 - days)?.[key] ?? rows[0][key];
  return { abs: last - prev, pct: ((last - prev) / prev) * 100 };
}

export function range(rows: Row[], key: Key, days = 30) {
  const v = series(rows, key, days);
  const min = Math.min(...v), max = Math.max(...v);
  const avg = v.reduce((a, b) => a + b, 0) / v.length;
  return { min, max, avg };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Spot-derived gold prices in EGP. Retail (sagha) prices add a premium + making charges. */
export function karats(gold24: number) {
  return {
    k24: gold24,
    k21: r2((gold24 * 21) / 24),
    k18: r2((gold24 * 18) / 24),
    k14: r2((gold24 * 14) / 24),
    pound: r2(((gold24 * 21) / 24) * 8), // gold pound = 8 g of 21k
  };
}

/** Price in EGP of a gold product on a given day. */
export const goldPrice = (gold24: number, t: GoldType) => r2(gold24 * (GOLD[t].karat / 24) * GOLD[t].grams);

/** 1 unit of `from` in `to` (both may be "egp"), using the stored per-unit EGP values. */
export function cross(row: Row, from: Code | "egp", to: Code | "egp") {
  const egp = (c: Code | "egp") => (c === "egp" ? 1 : row[c] / unitOf(c));
  return egp(from) / egp(to);
}
