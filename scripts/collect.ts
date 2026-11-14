/**
 * Collects daily EGP reference rates into data/rates.csv.
 *   tsx scripts/collect.ts               -> today's snapshot
 *   tsx scripts/collect.ts --backfill 365 -> last 365 days (fills days that are missing or incomplete)
 * Source: fawazahmed0/currency-api (free, keyless, daily history).
 *
 * Every column is "EGP per `unit` units" (see src/lib/currencies.ts); gold24 and silver are EGP per gram
 * of pure metal, derived from the international spot price (no retail premium).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CODES, COLUMNS, CURRENCIES, type Key } from "../src/lib/currencies";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "rates.csv");
const META = join(dirname(OUT), "meta.json");
const HEADER = ["date", ...COLUMNS].join(",");
const OUNCE_GRAMS = 31.1034768;

type Row = { date: string } & Record<Key, number>;

const round = (n: number, d = 4) => Number(n.toFixed(d));

async function fetchDay(date: string | "latest"): Promise<Row | null> {
  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`,
    `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!res.ok) continue;
      const j = (await res.json()) as { date: string; usd: Record<string, number> };
      const r = j.usd;
      if (!r.egp || !r.xau || !r.xag || CODES.some((c) => c !== "usd" && !r[c])) continue;
      const row: Record<string, number | string> = { date: j.date };
      for (const c of CODES) {
        const perOne = c === "usd" ? r.egp : r.egp / r[c];
        row[c] = round(perOne * CURRENCIES[c].unit);
      }
      // xau/xag are ounces per 1 USD -> EGP per gram of pure metal
      row.gold24 = round(r.egp / r.xau / OUNCE_GRAMS, 2);
      row.silver = round(r.egp / r.xag / OUNCE_GRAMS, 2);
      return row as Row;
    } catch {}
  }
  return null;
}

const complete = (r?: Partial<Row>) => !!r && COLUMNS.every((c) => Number.isFinite(r[c]) && (r[c] as number) > 0);

function load(): Map<string, Partial<Row> & { date: string }> {
  const m = new Map<string, Partial<Row> & { date: string }>();
  if (!existsSync(OUT)) return m;
  const [head, ...lines] = readFileSync(OUT, "utf8").trim().split("\n");
  const cols = head.split(",");
  for (const line of lines) {
    const v = line.split(",");
    const row: Record<string, string | number> = {};
    cols.forEach((c, i) => (row[c] = c === "date" ? v[i] : Number(v[i])));
    m.set(v[0], row as Partial<Row> & { date: string });
  }
  return m;
}

function save(m: Map<string, Partial<Row> & { date: string }>) {
  mkdirSync(dirname(OUT), { recursive: true });
  const rows = [...m.values()].filter((r) => complete(r)).sort((a, b) => a.date.localeCompare(b.date));
  const body = rows.map((r) => [r.date, ...COLUMNS.map((c) => r[c])].join(","));
  writeFileSync(OUT, [HEADER, ...body].join("\n") + "\n");
  return rows.length;
}

async function main() {
  const store = load();
  const i = process.argv.indexOf("--backfill");
  if (i > -1) {
    const days = Number(process.argv[i + 1] ?? 90);
    const todo: string[] = [];
    for (let k = days; k >= 1; k--) {
      const d = new Date(Date.now() - k * 86_400_000).toISOString().slice(0, 10);
      if (!complete(store.get(d))) todo.push(d);
    }
    for (let s = 0; s < todo.length; s += 8) {
      const batch = await Promise.all(todo.slice(s, s + 8).map(async (d) => [d, await fetchDay(d)] as const));
      for (const [d, row] of batch) {
        if (row) store.set(row.date, row);
        else console.warn("skip", d);
      }
    }
  }
  const today = await fetchDay("latest");
  if (!today) throw new Error("could not fetch today's rates");
  store.set(today.date, today);
  const count = save(store);
  // Records every successful check, even when the source has no new day yet.
  writeFileSync(META, JSON.stringify({ checkedAt: new Date().toISOString(), latestDate: today.date, days: count }, null, 2) + "\n");
  console.log(`rates.csv: ${count} days, latest ${today.date}`, today);
}

main().catch((e) => { console.error(e); process.exit(1); });
