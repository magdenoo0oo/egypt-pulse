import Link from "next/link";
import { CURRENCIES, change, goldPrice, type Code, type Row } from "@/lib/rates";
import { fmt, fmtInt, fmtPct } from "@/lib/format";

type Item = { label: string; value: string; pct: number; href: string };

/** Market tape. Rising prices use the warning tone: the pound buys less. */
export function Ticker({ rows }: { rows: Row[] }) {
  const last = rows.at(-1)!;
  const fx = (["usd", "eur", "gbp", "sar", "aed", "kwd", "chf", "try"] as Code[]).map<Item>((c) => ({
    label: CURRENCIES[c].iso, value: fmt(last[c]), pct: change(rows, c).pct, href: `/currency/${c}`,
  }));
  const metals: Item[] = [
    { label: "ذهب ٢١", value: fmtInt(goldPrice(last.gold24, "21")), pct: change(rows, "gold24").pct, href: "/gold/21" },
    { label: "جنيه ذهب", value: fmtInt(goldPrice(last.gold24, "pound")), pct: change(rows, "gold24").pct, href: "/gold/pound" },
    { label: "فضة", value: fmt(last.silver), pct: change(rows, "silver").pct, href: "/silver" },
  ];
  const items = [...fx, ...metals];
  const list = (hidden: boolean) => (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined} aria-label={hidden ? undefined : "شريط الأسعار"}>
      {items.map((i) => (
        <li key={i.label}>
          <Link
            href={i.href}
            tabIndex={hidden ? -1 : undefined}
            className="flex min-h-11 items-center gap-2 border-s border-line px-5 text-sm hover:bg-paper-2"
          >
            <span className="text-mute">{i.label}</span>
            <span className="font-display text-base font-bold">{i.value}</span>
            <span className={i.pct > 0 ? "text-down" : i.pct < 0 ? "text-up" : "text-mute"}>
              <span aria-hidden>{i.pct > 0 ? "▲" : i.pct < 0 ? "▼" : "■"}</span> {fmtPct(i.pct)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="tape vault border-b border-line" dir="ltr">
      <div className="tape-track" dir="rtl">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
