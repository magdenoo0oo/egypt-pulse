import { getI18n } from "@/i18n/server";
import { change, range, type Key, type Row } from "@/lib/rates";

const tone = (n: number) => (n > 0 ? "text-down" : n < 0 ? "text-up" : "text-mute");
const PERIODS = [7, 30, 90, 365] as const;

/** Change, low, high and average per period. A rising foreign price uses the warning tone (the pound buys less). */
export async function PeriodTable({ rows, k, caption, invert = false }: { rows: Row[]; k: Key; caption: string; invert?: boolean }) {
  const { t, f } = await getI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-start">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-sm text-mute">
          <tr className="border-b border-line">
            {(["period.col.period", "period.col.change", "period.col.low", "period.col.high", "period.col.avg"] as const).map((h) => (
              <th key={h} scope="col" className="py-2 text-start font-normal">{t(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.filter((d) => rows.length > d).map((d) => {
            const c = change(rows, k, d), r = range(rows, k, d + 1);
            return (
              <tr key={d} className="border-b border-line">
                <th scope="row" className="py-3 text-start font-normal">{t(`period.${d}` as "period.7")}</th>
                <td className={tone(invert ? -c.pct : c.pct)}>{f.fmtPct(c.pct)}</td>
                <td>{f.fmt(r.min)}</td>
                <td>{f.fmt(r.max)}</td>
                <td>{f.fmt(r.avg)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
