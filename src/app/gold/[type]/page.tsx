import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { PeriodTable } from "@/components/PeriodTable";
import { GOLD, GOLD_TYPES, change, getRows, goldPrice, isGoldType } from "@/lib/rates";
import { fmt, fmtDate, fmtSigned } from "@/lib/format";

export function generateStaticParams() {
  return GOLD_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/gold/[type]">): Promise<Metadata> {
  const { type } = await params;
  if (!isGoldType(type)) return {};
  return {
    title: `سعر ${GOLD[type].label} اليوم في مصر`,
    description: `سعر ${GOLD[type].label} بالجنيه المصري اليوم، مع الرسم البياني لسنة وأعلى وأدنى سعر.`,
    alternates: { canonical: `/gold/${type}` },
  };
}

export default async function GoldType({ params }: PageProps<"/gold/[type]">) {
  const { type } = await params;
  if (!isGoldType(type)) notFound();
  const rows = (await getRows()).map((r) => ({ ...r, gold24: goldPrice(r.gold24, type) }));
  const last = rows.at(-1)!;
  const d1 = change(rows, "gold24");
  const g = GOLD[type];

  return (
    <main className="mx-auto max-w-5xl px-4">
      <nav aria-label="مسار الصفحة" className="text-sm text-mute">
        <Link href="/gold" className="hover:underline">الذهب</Link> ‹ {g.name}
      </nav>
      <p className="mt-4 text-mute">{fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">سعر {g.label} اليوم</h1>
      <p className="mt-4 font-display text-7xl font-bold leading-none text-gold">{fmt(last.gold24)}</p>
      <p className="mt-3 text-mute">جنيه مصري، {fmtSigned(d1.abs)} عن اليوم السابق. بالسعر العالمي من غير مصنعية.</p>

      <section className="mt-10" aria-labelledby="hist">
        <h2 id="hist" className="mb-2 text-xl font-semibold">آخر سنة</h2>
        <Chart data={rows.map((r) => ({ date: r.date, v: r.gold24 }))} label={`تطور سعر ${g.label} خلال آخر سنة`} />
      </section>
      <section className="mt-10" aria-labelledby="periods">
        <h2 id="periods" className="mb-2 text-xl font-semibold">الأداء حسب الفترة</h2>
        <PeriodTable rows={rows} k="gold24" caption={`تغيّر وأدنى وأعلى سعر ${g.label}`} />
      </section>
      <ul className="mt-10 flex flex-wrap gap-2">
        {GOLD_TYPES.filter((t) => t !== type).map((t) => (
          <li key={t}>
            <Link href={`/gold/${t}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper-2">{GOLD[t].name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
