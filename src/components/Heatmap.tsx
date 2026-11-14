import Link from "next/link";
import { CURRENCIES, change, type Code, type Row } from "@/lib/rates";
import { fmt, fmtPct } from "@/lib/format";

type Tile = { id: string; iso: string; name: string; value: string; pct: number; href: string; span: string };

/** Tiles tinted by the move over the period. Warm = price rose (the pound buys less); green = price fell. */
export function Heatmap({ rows, days = 30 }: { rows: Row[]; days?: number }) {
  const last = rows.at(-1)!;
  const order: Code[] = ["usd", "eur", "gbp", "sar", "aed", "kwd", "chf", "qar", "bhd", "omr", "jod", "cad", "aud", "try", "cny", "jpy", "inr", "sek"];
  const big = new Set(["usd"]);
  const wide = new Set(["eur", "gbp", "sek"]);
  const tiles: Tile[] = [
    ...order.map<Tile>((c) => ({
      id: c, iso: CURRENCIES[c].iso, name: CURRENCIES[c].short, value: fmt(last[c]), pct: change(rows, c, days).pct, href: `/currency/${c}`,
      span: big.has(c) ? "col-span-2 row-span-2" : wide.has(c) ? "col-span-2" : "",
    })),
    { id: "gold", iso: "XAU", name: "ذهب ٢٤", value: fmt(last.gold24), pct: change(rows, "gold24", days).pct, href: "/gold", span: "col-span-2 sm:col-span-3 lg:col-span-4" },
    { id: "silver", iso: "XAG", name: "فضة", value: fmt(last.silver), pct: change(rows, "silver", days).pct, href: "/silver", span: "lg:col-span-2" },
  ];
  const peak = Math.max(1, ...tiles.map((t) => Math.abs(t.pct)));
  const tint = (p: number) =>
    p === 0 ? "var(--paper-2)" : `color-mix(in oklab, var(${p > 0 ? "--down" : "--up"}) ${Math.round(14 + (Math.abs(p) / peak) * 34)}%, var(--paper-2))`;
  return (
    <ul className="grid grid-flow-dense auto-rows-[6.5rem] grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {tiles.map((t) => (
        <li key={t.id} className={t.span}>
          <Link
            href={t.href}
            style={{ background: tint(t.pct) }}
            className="tile flex h-full flex-col justify-between rounded-md border border-line p-3 hover:border-note"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className={`font-display font-bold ${t.id === "usd" ? "text-3xl" : "text-lg"}`}>{t.iso}</span>
              <span className="truncate text-sm text-mute">{t.name}</span>
            </span>
            <span className="flex items-baseline justify-between gap-2">
              <span className={`font-display font-bold ${t.id === "usd" ? "text-5xl" : "text-xl"}`}>{t.value}</span>
              <span className="text-sm">{fmtPct(t.pct)}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
