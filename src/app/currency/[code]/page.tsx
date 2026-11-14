import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { Converter } from "@/components/Converter";
import { CurrencyMark } from "@/components/CurrencyMark";
import { DayStrip } from "@/components/DayStrip";
import { Faq } from "@/components/Faq";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { PeriodTable } from "@/components/PeriodTable";
import { PriceChart } from "@/components/PriceChart";
import { RangeBar } from "@/components/RangeBar";
import { tone } from "@/components/RateList";
import { CURRENCY_NOTES } from "@/content/notes";
import { currencyReport, dailyChanges, volatility } from "@/lib/insights";
import { CODES, CURRENCIES, change, getRows, isCode, range, unitOf } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct, fmtSigned } from "@/lib/format";

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/currency/[code]">): Promise<Metadata> {
  const { code } = await params;
  if (!isCode(code)) return {};
  const m = CURRENCIES[code];
  return {
    title: `سعر ${m.name} اليوم مقابل الجنيه المصري`,
    description: `سعر ${m.name} (${m.iso}) اليوم بالجنيه المصري، مع رسم تفاعلي لسنة كاملة وتحليل الحركة والمحوّل وجدول التحويل.`,
    alternates: { canonical: `/currency/${code}` },
  };
}

const AMOUNTS = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];

export default async function CurrencyPage({ params }: PageProps<"/currency/[code]">) {
  const { code } = await params;
  if (!isCode(code)) notFound();
  const rows = await getRows();
  const last = rows.at(-1)!;
  const meta = CURRENCIES[code];
  const note = CURRENCY_NOTES[code];
  const unit = unitOf(code);
  const perOne = last[code] / unit;
  const d1 = change(rows, code), d30 = change(rows, code, 30);
  const r365 = range(rows, code, 365), r30 = range(rows, code, 30);
  const vol = volatility(rows, code);
  const hist = rows.map((r) => ({ date: r.date, v: r[code] }));
  const related = CODES.filter((c) => c !== code && CURRENCIES[c].group === meta.group).slice(0, 6);
  const report = currencyReport(rows, code);
  const faq = [
    { q: `كام سعر ${meta.name} النهارده؟`, a: `آخر سعر مسجّل لـ${meta.name} هو ${fmt(last[code])} جنيه${unit > 1 ? ` لكل ${unit} وحدة` : ""} بتاريخ ${fmtDate(last.date)}. ده سعر مرجعي من السوق العالمي، مش سعر بنك.` },
    { q: `كام ${fmtInt(100)} ${meta.short} بالجنيه المصري؟`, a: `${fmtInt(100)} ${meta.short} = ${fmt(100 * perOne)} جنيه بالسعر المرجعي الحالي.` },
    ...note.faq,
  ];

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/currencies", label: "العملات" }, { label: meta.name }]}
        title={`سعر ${meta.name} اليوم`}
        lead={note.about}
        icon={<CurrencyMark iso={meta.iso} size={72} />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none">{fmt(last[code])}</p>
          <p className="mt-2 text-lg">
            <span className={tone(d1.abs)}>{fmtSigned(d1.abs)} ({fmtPct(d1.pct)})</span>
            <span className="text-mute"> · جنيه لكل {unit > 1 ? `${fmtInt(unit)} ` : ""}{meta.short}</span>
          </p>
        </div>
      </PageHead>

      <div className="mx-auto mt-8 grid max-w-page gap-4 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <Panel vault title="تاريخ السعر" id="hist" aside={`حتى ${fmtDate(last.date)}`}>
          <PriceChart data={hist} label={`تطور سعر ${meta.name} مقابل الجنيه`}>
            <Chart data={hist.slice(-90)} label={`تطور سعر ${meta.name} خلال آخر ٩٠ يوم`} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 content-start gap-4">
          <Panel title="مكان السعر في السنة" id="pos">
            <RangeBar min={r365.min} max={r365.max} value={last[code]} lo={fmt(r365.min)} hi={fmt(r365.max)} label={`موقع ${meta.name} في نطاق سنة`} />
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div><dt className="text-sm text-mute">تغيّر ٣٠ يوم</dt><dd className={`text-lg ${tone(d30.pct)}`}>{fmtPct(d30.pct)}</dd></div>
              <div><dt className="text-sm text-mute">تذبذب يومي</dt><dd className="text-lg">{fmt(vol)}٪</dd></div>
              <div><dt className="text-sm text-mute">أدنى ٣٠ يوم</dt><dd className="text-lg">{fmt(r30.min)}</dd></div>
              <div><dt className="text-sm text-mute">أعلى ٣٠ يوم</dt><dd className="text-lg">{fmt(r30.max)}</dd></div>
            </dl>
          </Panel>
          <Panel title="المحوّل" id="conv">
            <Converter rate={perOne} short={meta.short} />
            <p className="mt-4 flex flex-wrap gap-x-5 text-sm">
              <Link href={`/convert/${code}-to-egp`} className="inline-flex min-h-11 items-center text-note underline">{meta.short} إلى جنيه</Link>
              <Link href={`/convert/egp-to-${code}`} className="inline-flex min-h-11 items-center text-note underline">جنيه إلى {meta.short}</Link>
            </p>
          </Panel>
        </div>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <Panel title="حركة كل يوم خلال سنة" id="strip" aside="كل مربع يوم">
          <DayStrip days={dailyChanges(rows, code)} label={`حركة ${meta.name} اليومية`} />
        </Panel>
        <Panel title="الأداء حسب الفترة" id="periods">
          <PeriodTable rows={rows} k={code} caption={`تغيّر وأدنى وأعلى سعر ${meta.name}`} />
        </Panel>
      </div>

      <div className="mx-auto mt-20 grid max-w-page gap-12 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="analysis">
          <h2 id="analysis" className="font-display text-3xl font-bold">قراءة سريعة للسعر</h2>
          <div className="mt-4 max-w-[62ch] font-serif text-xl leading-[2]">
            {report.map((p) => <p key={p} className="mt-4 first:mt-0">{p}</p>)}
            <p className="mt-4">{note.why}</p>
          </div>
        </section>
        <section aria-labelledby="amounts">
          <h2 id="amounts" className="font-display text-3xl font-bold">جدول التحويل</h2>
          <table className="mt-4 w-full text-start">
            <caption className="sr-only">قيمة مبالغ شائعة من {meta.name} بالجنيه</caption>
            <tbody>
              {AMOUNTS.map((a) => (
                <tr key={a} className="border-b border-line">
                  <th scope="row" className="py-2 text-start font-normal">{fmtInt(a)} {meta.short}</th>
                  <td className="text-end font-display font-bold">{fmt(a * perOne)} جنيه</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="mx-auto mt-20 max-w-page px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold">أسئلة عن {meta.name}</h2>
        <div className="mt-6 max-w-3xl"><Faq items={faq} /></div>
      </div>

      <div className="mx-auto mt-20 max-w-page px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold">عملات قريبة</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <li key={c}>
              <Link href={`/currency/${c}`} className="flex min-h-16 items-center gap-4 rounded-[10px] border border-line p-3 hover:bg-paper-2">
                <CurrencyMark iso={CURRENCIES[c].iso} size={44} />
                <span className="flex-1 text-lg">{CURRENCIES[c].name}</span>
                <span className="font-display text-xl font-bold">{fmt(rows.at(-1)![c])}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
