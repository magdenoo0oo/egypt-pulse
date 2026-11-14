import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { CURRENCIES, change, type Code, type Row } from "@/lib/rates";

type Tile = { id: string; iso: string; name: string; value: string; pct: number; href: string; span: string };

/** Tiles tinted by the move over the period. Warm = price rose (the pound buys less); green = price fell. */
export async function Heatmap({ rows, days = 30 }: { rows: Row[]; days?: number }) {
  const { t, f, href } = await getI18n();
  const last = rows.at(-1)!;
  const order: Code[] = ["usd", "eur", "gbp", "sar", "aed", "kwd", "chf", "qar", "bhd", "omr", "jod", "cad", "aud", "try", "cny", "jpy", "inr", "sek"];
  const big = new Set(["usd"]);
  const wide = new Set(["eur", "gbp", "sek"]);
  const tiles: Tile[] = [
    ...order.map<Tile>((c) => ({
      id: c, iso: CURRENCIES[c].iso, name: f.cshort(c), value: f.fmt(last[c]), pct: change(rows, c, days).pct, href: href(`/currency/${c}`),
      span: big.has(c) ? "col-span-2 row-span-2" : wide.has(c) ? "col-span-2" : "",
    })),
    { id: "gold", iso: "XAU", name: t("heat.gold"), value: f.fmt(last.gold24), pct: change(rows, "gold24", days).pct, href: href("/gold"), span: "col-span-2 sm:col-span-3 lg:col-span-4" },
    { id: "silver", iso: "XAG", name: t("heat.silver"), value: f.fmt(last.silver), pct: change(rows, "silver", days).pct, href: href("/silver"), span: "lg:col-span-2" },
  ];
  const peak = Math.max(1, ...tiles.map((x) => Math.abs(x.pct)));
  const tint = (p: number) =>
    p === 0 ? "var(--paper-2)" : `color-mix(in oklab, var(${p > 0 ? "--down" : "--up"}) ${Math.round(14 + (Math.abs(p) / peak) * 34)}%, var(--paper-2))`;
  return (
    <ul className="grid grid-flow-dense auto-rows-[6.5rem] grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {tiles.map((tile) => (
        <li key={tile.id} className={tile.span}>
          <Link
            href={tile.href}
            style={{ background: tint(tile.pct) }}
            className="tile flex h-full flex-col justify-between rounded-md border border-line p-3 hover:border-note"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className={`font-display font-bold ${tile.id === "usd" ? "text-3xl" : "text-lg"}`}>{tile.iso}</span>
              <span className="truncate text-sm text-mute">{tile.name}</span>
            </span>
            <span className="flex items-baseline justify-between gap-2">
              <span className={`font-display font-bold ${tile.id === "usd" ? "text-5xl" : "text-xl"}`}>{tile.value}</span>
              <span className="text-sm">{f.fmtPct(tile.pct)}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
