import Link from "next/link";
import type { Metadata } from "next";
import { Bullion } from "@/components/Bullion";
import { Chart } from "@/components/Chart";
import { DayStrip } from "@/components/DayStrip";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { PeriodTable } from "@/components/PeriodTable";
import { PriceChart } from "@/components/PriceChart";
import { RangeBar } from "@/components/RangeBar";
import { tone } from "@/components/RateList";
import { dailyChanges } from "@/lib/insights";
import { change, getRows, range } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct, fmtSigned } from "@/lib/format";

export const metadata: Metadata = {
  title: "سعر الفضة اليوم في مصر بالجنيه",
  description: "سعر جرام الفضة عيار ٩٩٩ و٩٢٥ و٨٠٠ وسعر الكيلو بالجنيه المصري، محسوب من السعر العالمي، مع رسم تفاعلي لسنة.",
  alternates: { canonical: "/silver" },
};

const PURITY = [["فضة ٩٩٩ (صافية)", 1], ["فضة ٩٢٥ (استرليني)", 0.925], ["فضة ٨٠٠", 0.8]] as const;

export default async function Silver() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const d1 = change(rows, "silver");
  const r = range(rows, "silver", 365);
  const hist = rows.map((x) => ({ date: x.date, v: x.silver }));
  return (
    <main>
      <PageHead
        crumbs={[{ label: "الفضة" }]}
        title="سعر الفضة اليوم"
        lead={`بتاريخ ${fmtDate(last.date)}. محسوب من السعر العالمي لأوقية الفضة، من غير مصنعية أو هامش.`}
        icon={<Bullion tone="silver" className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none">{fmt(last.silver)}</p>
          <p className="mt-2 text-lg"><span className={tone(d1.abs)}>{fmtSigned(d1.abs)} ({fmtPct(d1.pct)})</span> <span className="text-mute">· جنيه لجرام ٩٩٩</span></p>
        </div>
      </PageHead>

      <div className="mx-auto mt-8 max-w-page px-4 sm:px-6">
        <ul className="grid gap-3 sm:grid-cols-3">
          {PURITY.map(([name, f]) => (
            <li key={name} className="rounded-[10px] border border-line bg-paper-2 p-5">
              <p className="text-mute">{name}</p>
              <p className="mt-1 font-display text-4xl font-bold">{fmt(last.silver * f)}</p>
              <p className="text-sm text-mute">جنيه للجرام · الكيلو {fmtInt(last.silver * f * 1000)} جنيه</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <Panel vault title="تاريخ السعر" id="h">
          <PriceChart data={hist} tone="mute" label="تطور سعر جرام الفضة بالجنيه">
            <Chart data={hist.slice(-90)} label="تطور سعر جرام الفضة آخر ٩٠ يوم" />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 content-start gap-4">
          <Panel title="مكانه في السنة" id="p"><RangeBar min={r.min} max={r.max} value={last.silver} lo={fmt(r.min)} hi={fmt(r.max)} label="موقع الفضة في نطاق سنة" /></Panel>
          <Panel title="الأداء" id="pp"><PeriodTable rows={rows} k="silver" caption="تغيّر وأدنى وأعلى سعر جرام الفضة" /></Panel>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6">
        <Panel title="حركة كل يوم" id="d"><DayStrip days={dailyChanges(rows, "silver")} label="حركة الفضة اليومية" /></Panel>
        <p className="mt-8">كمان: <Link className="text-note underline" href="/gold">سعر الذهب</Link> و<Link className="text-note underline" href="/movers">ترتيب الحركة</Link>.</p>
      </div>
    </main>
  );
}
