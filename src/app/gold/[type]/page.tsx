import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Bullion } from "@/components/Bullion";
import { Chart } from "@/components/Chart";
import { DayStrip } from "@/components/DayStrip";
import { Faq } from "@/components/Faq";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { PeriodTable } from "@/components/PeriodTable";
import { PriceChart } from "@/components/PriceChart";
import { RangeBar } from "@/components/RangeBar";
import { tone } from "@/components/RateList";
import { GOLD_NOTES } from "@/content/notes";
import { dailyChanges } from "@/lib/insights";
import { GOLD, GOLD_TYPES, change, getRows, goldPrice, isGoldType, range } from "@/lib/rates";
import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/format";

export function generateStaticParams() {
  return GOLD_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/gold/[type]">): Promise<Metadata> {
  const { type } = await params;
  if (!isGoldType(type)) return {};
  return {
    title: `سعر ${GOLD[type].label} اليوم في مصر`,
    description: `سعر ${GOLD[type].label} بالجنيه المصري اليوم، مع رسم تفاعلي لسنة وأعلى وأدنى سعر وأسئلة شائعة.`,
    alternates: { canonical: `/gold/${type}` },
  };
}

export default async function GoldType({ params }: PageProps<"/gold/[type]">) {
  const { type } = await params;
  if (!isGoldType(type)) notFound();
  const base = await getRows();
  const rows = base.map((r) => ({ ...r, gold24: goldPrice(r.gold24, type) }));
  const last = rows.at(-1)!;
  const d1 = change(rows, "gold24"), d30 = change(rows, "gold24", 30);
  const r = range(rows, "gold24", 365);
  const g = GOLD[type];
  const note = GOLD_NOTES[type];
  const hist = rows.map((x) => ({ date: x.date, v: x.gold24 }));
  const faq = [{ q: `كام سعر ${g.label} النهارده؟`, a: `${fmt(last.gold24)} جنيه بتاريخ ${fmtDate(last.date)}، بالسعر العالمي ومن غير مصنعية أو دمغة.` }, ...note.faq];

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/gold", label: "الذهب" }, { label: g.name }]}
        title={`سعر ${g.label}`}
        lead={note.about}
        icon={<Bullion className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none text-gold">{fmt(last.gold24)}</p>
          <p className="mt-2 text-lg"><span className={tone(d1.abs)}>{fmtSigned(d1.abs)} ({fmtPct(d1.pct)})</span> <span className="text-mute">· جنيه</span></p>
        </div>
      </PageHead>

      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title="تاريخ السعر" id="h">
          <PriceChart data={hist} tone="gold" label={`تطور سعر ${g.label}`}>
            <Chart data={hist.slice(-90)} label={`تطور سعر ${g.label} آخر ٩٠ يوم`} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 content-start gap-4">
          <Panel title="مكانه في السنة" id="p">
            <RangeBar min={r.min} max={r.max} value={last.gold24} lo={fmt(r.min)} hi={fmt(r.max)} label="موقع السعر في نطاق سنة" />
            <p className={`mt-4 ${tone(d30.pct)}`}>{fmtPct(d30.pct)} آخر ٣٠ يوم</p>
          </Panel>
          <Panel title="الأداء" id="pp"><PeriodTable rows={rows} k="gold24" caption={`تغيّر وأدنى وأعلى سعر ${g.label}`} /></Panel>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel title="حركة كل يوم" id="d"><DayStrip days={dailyChanges(rows, "gold24")} label={`حركة ${g.name} اليومية`} /></Panel>
      </div>

      <div className="mx-auto mt-14 max-w-page px-4 sm:px-6 xl:px-12">
        <h2 className="font-display text-3xl font-bold">أسئلة عن {g.name}</h2>
        <div className="mt-6"><Faq items={faq} /></div>
        <ul className="mt-10 flex flex-wrap gap-2">
          {GOLD_TYPES.filter((t) => t !== type).map((t) => (
            <li key={t}><Link href={`/gold/${t}`} className="inline-flex min-h-11 items-center rounded-md border border-line px-4 hover:bg-paper-2">{GOLD[t].name}</Link></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
