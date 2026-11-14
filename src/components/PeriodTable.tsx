import { change, range, type Key, type Row } from "@/lib/rates";
import { fmt, fmtPct } from "@/lib/format";

const tone = (n: number) => (n > 0 ? "text-down" : n < 0 ? "text-up" : "text-mute");
const PERIODS = [
  [7, "٧ أيام"],
  [30, "٣٠ يوم"],
  [90, "٩٠ يوم"],
  [365, "سنة"],
] as const;

/** Change, low, high and average per period. A rising foreign price uses the warning tone (the pound buys less). */
export function PeriodTable({ rows, k, caption, invert = false }: { rows: Row[]; k: Key; caption: string; invert?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-start">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-sm text-mute">
          <tr className="border-b border-line">
            {["الفترة", "التغيّر", "أدنى", "أعلى", "المتوسط"].map((h) => (
              <th key={h} scope="col" className="py-2 text-start font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.filter(([d]) => rows.length > d).map(([d, label]) => {
            const c = change(rows, k, d), r = range(rows, k, d + 1);
            return (
              <tr key={d} className="border-b border-line">
                <th scope="row" className="py-3 text-start font-normal">{label}</th>
                <td className={tone(invert ? -c.pct : c.pct)}>{fmtPct(c.pct)}</td>
                <td>{fmt(r.min)}</td>
                <td>{fmt(r.max)}</td>
                <td>{fmt(r.avg)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
