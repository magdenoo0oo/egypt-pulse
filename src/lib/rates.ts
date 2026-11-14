import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";

export const CURRENCIES = {
  usd: { name: "الدولار الأمريكي", short: "دولار", iso: "USD" },
  eur: { name: "اليورو", short: "يورو", iso: "EUR" },
  sar: { name: "الريال السعودي", short: "ريال", iso: "SAR" },
  gbp: { name: "الجنيه الإسترليني", short: "إسترليني", iso: "GBP" },
} as const;

export type Code = keyof typeof CURRENCIES;
export const CODES = Object.keys(CURRENCIES) as Code[];
export const isCode = (c: string): c is Code => c in CURRENCIES;

export type Row = { date: string } & Record<Code | "gold24", number>;

/** Plain loader, used by the API route. */
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

export function series(rows: Row[], key: Code | "gold24", days?: number) {
  const r = days ? rows.slice(-days) : rows;
  return r.map((x) => x[key]);
}

export function change(rows: Row[], key: Code | "gold24", days = 1) {
  const last = rows.at(-1)![key];
  const prev = rows.at(-1 - days)?.[key] ?? last;
  return { abs: last - prev, pct: ((last - prev) / prev) * 100 };
}

export function range(rows: Row[], key: Code | "gold24", days = 30) {
  const v = series(rows, key, days);
  return { min: Math.min(...v), max: Math.max(...v) };
}

/** Spot-derived gold prices in EGP. Retail (sagha) prices add a premium + making charges. */
export function karats(gold24: number) {
  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    k24: gold24,
    k21: r((gold24 * 21) / 24),
    k18: r((gold24 * 18) / 24),
    pound: r(((gold24 * 21) / 24) * 8), // gold pound = 8 g of 21k
  };
}

export async function getMeta(): Promise<{ checkedAt: string; latestDate: string; days: number }> {
  "use cache";
  cacheLife("hours");
  return JSON.parse(await readFile(join(process.cwd(), "data", "meta.json"), "utf8"));
}
