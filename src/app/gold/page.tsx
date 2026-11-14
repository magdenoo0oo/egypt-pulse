import Link from "next/link";
import type { Metadata } from "next";
import { Bullion } from "@/components/Bullion";
import { Chart } from "@/components/Chart";
import { Faq } from "@/components/Faq";
import { GoldCalculator } from "@/components/GoldCalculator";
import { IndexChart } from "@/components/IndexChart";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { PeriodTable } from "@/components/PeriodTable";
import { PriceChart } from "@/components/PriceChart";
import { RangeBar } from "@/components/RangeBar";
import { tone } from "@/components/RateList";
import { Section } from "@/components/Section";
import { GUIDES } from "@/content/guides";
import { dailyChanges, goldReport, indexed } from "@/lib/insights";
import { GOLD, GOLD_TYPES, change, getRows, goldPrice, range } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct } from "@/lib/format";
import { DayStrip } from "@/components/DayStrip";

export const metadata: Metadata = {
  title: "سعر الذهب اليوم في مصر: عيار ٢٤ و٢١ و١٨ والجنيه الذهب",
  description: "سعر جرام الذهب عيار ٢٤ و٢١ و١٨ و١٤ والجنيه الذهب والأوقية بالجنيه المصري، محسوب من السعر العالمي، مع حاسبة ورسم تفاعلي لسنة.",
  alternates: { canonical: "/gold" },
};

const FAQ = [
  { q: "ليه سعر الذهب في المحل أعلى من الموجود هنا؟", a: "لأن الأرقام هنا بالسعر العالمي من غير إضافات. الصايغ بيضيف مصنعية ودمغة وهامش، والمصنعية بتختلف حسب القطعة والمحل." },
  { q: "إيه العيار الأكتر تداولًا في مصر؟", a: "عيار ٢١ هو الأكتر انتشارًا في المصوغات والجنيه الذهب. عيار ٢٤ بيتباع غالبًا سبائك، وعيار ١٨ في مجوهرات الموضة والألماس." },
  { q: "الجنيه الذهب فيه كام جرام؟", a: "٨ جرام عيار ٢١، ونصف الجنيه ٤ جرام. السعر هنا هو قيمة الذهب نفسه بالسعر العالمي من غير مصنعية." },
  { q: "ليه سعر الذهب بالجنيه بيتغيّر حتى لو سعره العالمي ثابت؟", a: "لأن السعر بالجنيه = سعر الأوقية بالدولار × سعر الدولار. لو الدولار زاد قصاد الجنيه، الذهب بالجنيه بيزيد حتى لو المعدن نفسه ثابت بالدولار." },
];

export default async function Gold() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const ch = change(rows, "gold24", 30);
  const r = range(rows, "gold24", 365);
  const g21 = goldPrice(last.gold24, "21");
  const hist = rows.map((x) => ({ date: x.date, v: x.gold24 }));
  const lines = [
    { key: "gold24", name: "الذهب بالجنيه", tone: "gold" as const, data: indexed(rows, "gold24") },
    { key: "usd", name: "الدولار بالجنيه", tone: "note" as const, data: indexed(rows, "usd") },
  ];
  return (
    <main>
      <PageHead
        crumbs={[{ label: "الذهب" }]}
        title="سعر الذهب اليوم"
        lead={`بتاريخ ${fmtDate(last.date)}. محسوب من السعر العالمي للأوقية بسعر الدولار، من غير مصنعية أو دمغة أو هامش صايغ.`}
        icon={<Bullion className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none text-gold">{fmtInt(g21)}</p>
          <p className="mt-2 text-lg">جرام عيار ٢١ · <span className={tone(ch.pct)}>{fmtPct(ch.pct)} آخر ٣٠ يوم</span></p>
        </div>
      </PageHead>

      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GOLD_TYPES.map((t) => (
            <li key={t}>
              <Link href={`/gold/${t}`} className="block h-full rounded-[10px] border border-line bg-paper-2 p-5 hover:border-note">
                <span className="block text-mute">{GOLD[t].name}</span>
                <span className="mt-1 block font-display text-3xl font-bold text-gold">{fmtInt(goldPrice(last.gold24, t))}</span>
                <span className="block text-sm text-mute">{t === "pound" || t === "half-pound" ? `${GOLD[t].grams} جرام عيار ٢١` : t === "ounce" ? "٣١٫١ جرام عيار ٢٤" : "للجرام"}</span>
              </Link>
            </li>
          ))}
          <li className="grid place-items-center rounded-[10px] border border-dashed border-line p-5 text-center text-mute">
            <span>كل الأسعار بالجنيه المصري بدون مصنعية</span>
          </li>
        </ul>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title="جرام عيار ٢٤" id="g-hist">
          <PriceChart data={hist} tone="gold" label="تطور سعر جرام الذهب عيار ٢٤ بالجنيه">
            <Chart data={hist.slice(-90)} label="تطور سعر جرام الذهب عيار ٢٤ آخر ٩٠ يوم" />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 content-start gap-4">
          <Panel title="حاسبة الذهب" id="calc"><GoldCalculator gold24={last.gold24} /></Panel>
          <Panel title="مكانه في السنة" id="pos">
            <RangeBar min={r.min} max={r.max} value={last.gold24} lo={fmt(r.min)} hi={fmt(r.max)} label="موقع جرام الذهب في نطاق سنة" />
          </Panel>
        </div>
      </div>

      <Section id="why" title="الذهب ولا الدولار؟" lead="الذهب بالجنيه بيتحرك بالمعدن وبالدولار مع بعض. المقارنة دي بتوريك مين فيهم اتحرك أكتر في السنة.">
        <Panel>
          <IndexChart lines={lines} label="مقارنة أداء الذهب والدولار مقابل الجنيه خلال سنة" height={320} />
        </Panel>
      </Section>

      <div className="mx-auto mt-14 grid max-w-page gap-10 px-4 sm:px-6 xl:px-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="gr">
          <h2 id="gr" className="font-display text-3xl font-bold">قراءة سريعة</h2>
          <div className="mt-4 max-w-[62ch] font-serif text-xl leading-[2]">
            {goldReport(rows).map((p) => <p key={p} className="mt-4 first:mt-0">{p}</p>)}
          </div>
        </section>
        <Panel title="الأداء حسب الفترة" id="gp"><PeriodTable rows={rows} k="gold24" caption="تغيّر وأدنى وأعلى سعر جرام الذهب" /></Panel>
      </div>

      <Section id="gs" title="حركة الذهب كل يوم" lead="كل مربع يوم خلال آخر سنة.">
        <Panel><DayStrip days={dailyChanges(rows, "gold24")} label="حركة الذهب اليومية" /></Panel>
      </Section>

      <Section id="faq" title="أسئلة عن الذهب">
        <div><Faq items={FAQ} /></div>
        <p className="mt-8 flex flex-wrap gap-x-6">
          {GUIDES.filter((g) => g.category === "gold").map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="inline-flex min-h-11 items-center text-note underline">{g.title}</Link>
          ))}
        </p>
      </Section>
    </main>
  );
}
