import Link from "next/link";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { GoldCalculator } from "@/components/GoldCalculator";
import { PeriodTable } from "@/components/PeriodTable";
import { tone } from "@/components/RateList";
import { GOLD, GOLD_TYPES, change, getRows, goldPrice } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "سعر الذهب اليوم في مصر: عيار ٢٤ و٢١ و١٨ والجنيه الذهب",
  description: "سعر جرام الذهب عيار ٢٤ و٢١ و١٨ و١٤ والجنيه الذهب والأوقية بالجنيه المصري، محسوب من السعر العالمي، مع حاسبة ورسم بياني لسنة.",
  alternates: { canonical: "/gold" },
};

export default async function Gold() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const ch = change(rows, "gold24", 30);
  return (
    <main className="mx-auto max-w-5xl px-4">
      <p className="text-mute">{fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">سعر الذهب اليوم</h1>
      <p className="mt-3 max-w-[62ch] text-mute">
        محسوب من السعر العالمي للأوقية بسعر الدولار. سعر الصاغة في المحلات بيزيد عليه مصنعية وهامش، فاعتبر الأرقام دي مرجع للمقارنة مش سعر شراء.
      </p>

      <section className="mt-10" aria-labelledby="list">
        <h2 id="list" className="sr-only">الأسعار حسب العيار</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GOLD_TYPES.map((t) => {
            const now = goldPrice(last.gold24, t);
            return (
              <li key={t}>
                <Link href={`/gold/${t}`} className="block h-full rounded-2xl border border-line bg-paper p-5 hover:bg-paper-2">
                  <span className="block text-mute">{GOLD[t].name}</span>
                  <span className="mt-1 block font-display text-3xl font-bold text-gold">{fmtInt(now)}</span>
                  <span className={`block text-sm ${tone(ch.pct)}`}>{fmtPct(ch.pct)} / ٣٠ يوم</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-14 grid gap-10 md:grid-cols-[1.8fr_1fr]">
        <section aria-labelledby="hist" className="min-w-0">
          <h2 id="hist" className="mb-2 text-xl font-semibold">جرام الذهب عيار ٢٤ خلال سنة</h2>
          <Chart data={rows.map((r) => ({ date: r.date, v: r.gold24 }))} label="تطور سعر جرام الذهب عيار ٢٤ بالجنيه خلال آخر سنة" />
          <h2 className="mb-2 mt-10 text-xl font-semibold">الأداء حسب الفترة</h2>
          <PeriodTable rows={rows} k="gold24" caption="تغيّر وأدنى وأعلى سعر جرام الذهب عيار ٢٤" />
        </section>
        <section aria-labelledby="calc" className="h-fit rounded-2xl border border-line bg-paper-2 p-5">
          <h2 id="calc" className="mb-4 text-xl font-semibold">حاسبة الذهب</h2>
          <GoldCalculator gold24={last.gold24} />
        </section>
      </div>

      <section className="mt-14" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-semibold">إزاي بيتحسب الذهب</h2>
        <p className="mt-2 max-w-[62ch] text-mute">
          عيار ٢٤ ذهب صافي. عيار ٢١ هو ٢١ ÷ ٢٤ من سعره، وعيار ١٨ هو ١٨ ÷ ٢٤. والجنيه الذهب ٨ جرام عيار ٢١.
          التفاصيل في <Link className="text-note underline" href="/methodology">صفحة المنهجية</Link>. للمقارنة: الفضة في <Link className="text-note underline" href="/silver">صفحتها</Link>، والدولار في <Link className="text-note underline" href="/currency/usd">صفحة الدولار</Link>.
        </p>
        <p className="mt-2 text-sm text-mute">سعر الجرام عيار ٢٤ اليوم: {fmt(last.gold24)} جنيه.</p>
      </section>
    </main>
  );
}
