import Link from "next/link";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { PeriodTable } from "@/components/PeriodTable";
import { change, getRows } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtSigned } from "@/lib/format";

export const metadata: Metadata = {
  title: "سعر الفضة اليوم في مصر بالجنيه",
  description: "سعر جرام الفضة عيار ٩٩٩ و٩٢٥ و٨٠٠ وسعر الكيلو بالجنيه المصري، محسوب من السعر العالمي، مع رسم بياني لسنة.",
  alternates: { canonical: "/silver" },
};

const PURITY = [["فضة ٩٩٩ (صافية)", 1], ["فضة ٩٢٥ (استرليني)", 0.925], ["فضة ٨٠٠", 0.8]] as const;

export default async function Silver() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const d1 = change(rows, "silver");
  return (
    <main className="mx-auto max-w-5xl px-4">
      <p className="text-mute">{fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">سعر الفضة اليوم</h1>
      <p className="mt-4 font-display text-7xl font-bold leading-none">{fmt(last.silver)}</p>
      <p className="mt-3 text-mute">جنيه لجرام الفضة الصافية، {fmtSigned(d1.abs)} عن اليوم السابق. بالسعر العالمي من غير مصنعية.</p>

      <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {PURITY.map(([name, f]) => (
          <div key={name} className="bg-paper p-5">
            <dt className="text-mute">{name}</dt>
            <dd className="mt-1 font-display text-3xl font-bold">{fmt(last.silver * f)}</dd>
            <dd className="text-sm text-mute">للكيلو: {fmtInt(last.silver * f * 1000)} جنيه</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="hist">
        <h2 id="hist" className="mb-2 text-xl font-semibold">آخر سنة</h2>
        <Chart data={rows.map((r) => ({ date: r.date, v: r.silver }))} label="تطور سعر جرام الفضة بالجنيه خلال آخر سنة" />
      </section>
      <section className="mt-10" aria-labelledby="periods">
        <h2 id="periods" className="mb-2 text-xl font-semibold">الأداء حسب الفترة</h2>
        <PeriodTable rows={rows} k="silver" caption="تغيّر وأدنى وأعلى سعر جرام الفضة" />
      </section>
      <p className="mt-10 text-mute">كمان: <Link className="text-note underline" href="/gold">سعر الذهب</Link> و<Link className="text-note underline" href="/movers">الحركة</Link>.</p>
    </main>
  );
}
