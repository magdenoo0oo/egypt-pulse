/**
 * Collects daily EGP reference rates into data/rates.csv.
 *   tsx scripts/collect.ts              -> today's snapshot
 *   tsx scripts/collect.ts --backfill 90 -> last 90 days (skips days already stored)
 * Source: fawazahmed0/currency-api (free, keyless, daily history).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "rates.csv");
const META = join(dirname(OUT), "meta.json");
const HEADER = "date,usd,eur,sar,gbp,gold24";
const OUNCE_GRAMS = 31.1034768;

type Row = { date: string; usd: number; eur: number; sar: number; gbp: number; gold24: number };

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
      if (!r.egp || !r.eur || !r.sar || !r.gbp || !r.xau) continue;
      const round = (n: number, d = 4) => Number(n.toFixed(d));
      return {
        date: j.date,
        usd: round(r.egp),
        eur: round(r.egp / r.eur),
        sar: round(r.egp / r.sar),
        gbp: round(r.egp / r.gbp),
        // xau is ounces per 1 USD -> EGP per gram of 24k gold (spot, no retail premium)
        gold24: round(r.egp / r.xau / OUNCE_GRAMS, 2),
      };
    } catch {}
  }
  return null;
}

function load(): Map<string, Row> {
  const m = new Map<string, Row>();
  if (!existsSync(OUT)) return m;
  for (const line of readFileSync(OUT, "utf8").trim().split("\n").slice(1)) {
    const [date, usd, eur, sar, gbp, gold24] = line.split(",");
    m.set(date, { date, usd: +usd, eur: +eur, sar: +sar, gbp: +gbp, gold24: +gold24 });
  }
  return m;
}

function save(m: Map<string, Row>) {
  mkdirSync(dirname(OUT), { recursive: true });
  const rows = [...m.values()].sort((a, b) => a.date.localeCompare(b.date));
  const body = rows.map((r) => [r.date, r.usd, r.eur, r.sar, r.gbp, r.gold24].join(","));
  writeFileSync(OUT, [HEADER, ...body].join("\n") + "\n");
}

async function main() {
  const store = load();
  const i = process.argv.indexOf("--backfill");
  if (i > -1) {
    const days = Number(process.argv[i + 1] ?? 90);
    for (let k = days; k >= 1; k--) {
      const d = new Date(Date.now() - k * 86_400_000).toISOString().slice(0, 10);
      if (store.has(d)) continue;
      const row = await fetchDay(d);
      if (row) store.set(row.date, row);
      else console.warn("skip", d);
    }
  }
  const today = await fetchDay("latest");
  if (!today) throw new Error("could not fetch today's rates");
  store.set(today.date, today);
  save(store);
  // Records every successful check, even when the source has no new day yet.
  writeFileSync(META, JSON.stringify({ checkedAt: new Date().toISOString(), latestDate: today.date, days: store.size }, null, 2) + "\n");
  console.log(`rates.csv: ${store.size} days, latest ${today.date}`, today);
}

main().catch((e) => { console.error(e); process.exit(1); });
