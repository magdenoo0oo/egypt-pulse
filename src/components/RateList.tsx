import Link from "next/link";
import { CurrencyMark } from "@/components/CurrencyMark";
import { Sparkline } from "@/components/Sparkline";
import { getI18n } from "@/i18n/server";
import { CURRENCIES, change, series, type Code, type Row } from "@/lib/rates";

export const tone = (n: number) => (n > 0 ? "text-down" : n < 0 ? "text-up" : "text-mute");
// For a household, a rising foreign currency means the pound buys less, so up is shown as the warning tone.

export async function RateList({ rows, codes }: { rows: Row[]; codes: Code[] }) {
  const { t, f, href } = await getI18n();
  const last = rows.at(-1)!;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {codes.map((c) => {
        const ch = change(rows, c, 30);
        return (
          <li key={c}>
            <Link
              href={href(`/currency/${c}`)}
              className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3 hover:bg-paper-2 sm:grid-cols-[1.4fr_1fr_auto_6rem] sm:px-3"
            >
              <span className="flex items-center gap-3 text-lg">
                <CurrencyMark iso={CURRENCIES[c].iso} size={40} />
                <span>
                  {f.cname(c)}
                  {CURRENCIES[c].unit > 1 && <span className="ms-2 text-sm text-mute">{t("rate.per100")}</span>}
                </span>
              </span>
              <span className="font-display text-2xl font-bold">{f.fmt(last[c])}</span>
              <Sparkline values={series(rows, c, 30)} className={`hidden sm:block ${tone(ch.abs)}`} />
              <span className={`hidden text-end text-sm sm:block ${tone(ch.abs)}`}>{t("rate.pct30", { pct: f.fmtPct(ch.pct) })}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
