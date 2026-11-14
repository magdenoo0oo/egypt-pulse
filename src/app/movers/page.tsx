import Link from "next/link";
import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { tone } from "@/components/RateList";
import { movers, volatility } from "@/lib/insights";
import { CODES, change, getRows, type Key } from "@/lib/rates";
import { fmt, fmtPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "أكتر العملات ارتفاعًا وانخفاضًا مقابل الجنيه",
  description: "ترتيب العملات والذهب والفضة حسب التغيّر مقابل الجنيه المصري خلال أسبوع وشهر وثلاثة شهور وسنة، مع قياس التذبذب.",
  alternates: { canonical: "/movers" },
};

const PERIODS = [[7, "أسبوع"], [30, "شهر"], [90, "٣ شهور"], [365, "سنة"]] as const;

export default async function Movers() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const mv = movers(rows, 30);
  const peak = Math.max(...mv.map((m) => Math.abs(m.pct)));
  const hrefOf = new Map(mv.map((m) => [m.key, m.href]));
  const nameOf = new Map(mv.map((m) => [m.key, m.name]));
  const keys: Key[] = [...CODES, "gold24", "silver"];
  const table = keys.map((k) => ({
    k,
    name: nameOf.get(k)!,
    href: hrefOf.get(k)!,
    now: last[k],
    ch: PERIODS.map(([d]) => (rows.length > d ? change(rows, k, d).pct : null)),
    vol: volatility(rows, k),
  }));
  const volSorted = [...table].sort((a, b) => b.vol - a.vol);
  const maxVol = volSorted[0].vol;

  return (
    <main>
      <PageHead crumbs={[{ label: "الحركة" }]} title="الحركة: مين طلع ومين نزل" lead="الأحمر معناه إن السعر زاد (الجنيه بيشتري أقل)، والأخضر معناه إنه نزل." />
      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-2">
        <Panel vault title="التغيّر آخر ٣٠ يوم" id="bars">
          <ul className="grid gap-1">
            {mv.map((m) => (
              <li key={m.key}>
                <Link href={m.href} className="grid min-h-9 grid-cols-[7.5rem_1fr_4.5rem] items-center gap-3 hover:bg-paper-3">
                  <span className="truncate text-sm">{m.name}</span>
                  <span dir="ltr" className="relative h-3">
                    <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-line" />
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 rounded-sm ${m.pct > 0 ? "bg-down" : "bg-up"}`}
                      style={m.pct > 0 ? { left: "50%", width: `${(m.pct / peak) * 50}%` } : { right: "50%", width: `${(-m.pct / peak) * 50}%` }}
                    />
                  </span>
                  <span className={`text-end text-sm ${tone(m.pct)}`}>{fmtPct(m.pct)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="الأكتر تذبذبًا" id="vol" aside="متوسط الحركة اليومية آخر ٣٠ يوم">
          <ul className="grid gap-1">
            {volSorted.map((m) => (
              <li key={m.k}>
                <Link href={m.href} className="grid min-h-9 grid-cols-[7.5rem_1fr_4.5rem] items-center gap-3 hover:bg-paper-3">
                  <span className="truncate text-sm">{m.name}</span>
                  <span dir="ltr" className="h-3"><span aria-hidden className="block h-3 rounded-sm bg-note" style={{ width: `${(m.vol / maxVol) * 100}%` }} /></span>
                  <span className="text-end text-sm">{fmt(m.vol)}٪</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel title="الجدول الكامل" id="tbl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-start">
              <caption className="sr-only">تغيّر الأسعار مقابل الجنيه حسب الفترة</caption>
              <thead className="text-sm text-mute">
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 text-start font-normal">الأصل</th>
                  <th scope="col" className="text-start font-normal">السعر</th>
                  {PERIODS.map(([, l]) => <th key={l} scope="col" className="text-start font-normal">{l}</th>)}
                  <th scope="col" className="text-start font-normal">التذبذب</th>
                </tr>
              </thead>
              <tbody>
                {table.map((r) => (
                  <tr key={r.k} className="border-b border-line">
                    <th scope="row" className="py-2 text-start font-normal"><Link href={r.href} className="inline-flex min-h-11 items-center hover:underline">{r.name}</Link></th>
                    <td className="font-display font-bold">{fmt(r.now)}</td>
                    {r.ch.map((c, i) => <td key={i} className={c === null ? "text-mute" : tone(c)}>{c === null ? "-" : fmtPct(c)}</td>)}
                    <td>{fmt(r.vol)}٪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  );
}
