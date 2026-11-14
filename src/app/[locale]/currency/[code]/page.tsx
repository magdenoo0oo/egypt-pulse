import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { ContentNotice } from "@/components/ContentNotice";
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
import { getContent } from "@/content";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { currencyReport, dailyChanges, volatility } from "@/lib/insights";
import { CODES, CURRENCIES, change, getRows, isCode, range, unitOf } from "@/lib/rates";

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/currency/[code]">): Promise<Metadata> {
  const { code } = await params;
  if (!isCode(code)) return {};
  const { t, f, locale } = await getI18n();
  const name = f.cname(code);
  return {
    title: t("cc.meta.title", { name }),
    description: t("cc.meta.desc", { name, iso: CURRENCIES[code].iso }),
    alternates: altLinks(locale, `/currency/${code}`),
  };
}

const AMOUNTS = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];

export default async function CurrencyPage({ params }: PageProps<"/[locale]/currency/[code]">) {
  const { code } = await params;
  if (!isCode(code)) notFound();
  const i18n = await getI18n();
  const { t, f, href, locale } = i18n;
  const rows = await getRows();
  const last = rows.at(-1)!;
  const meta = CURRENCIES[code];
  const note = getContent(locale).currencyNotes[code];
  const unit = unitOf(code);
  const name = f.cname(code), short = f.cshort(code);
  const perOne = last[code] / unit;
  const d1 = change(rows, code), d30 = change(rows, code, 30);
  const r365 = range(rows, code, 365), r30 = range(rows, code, 30);
  const vol = volatility(rows, code);
  const hist = rows.map((r) => ({ date: r.date, v: r[code] }));
  const related = CODES.filter((c) => c !== code && CURRENCIES[c].group === meta.group).slice(0, 6);
  const report = currencyReport(rows, code, i18n);
  const perText = unit > 1 ? `${f.fmtInt(unit)} ${short}` : short;
  const unitNote = unit > 1 ? t("rep.unitNote", { unit }) : "";
  const faq = [
    { q: t("cc.faq.q1", { name }), a: t("cc.faq.a1", { name, price: f.fmt(last[code]), unitNote, date: f.fmtDate(last.date) }) },
    { q: t("cc.faq.q2", { n: f.fmtInt(100), short }), a: t("cc.faq.a2", { n: f.fmtInt(100), short, v: f.fmt(100 * perOne) }) },
    ...note.faq,
  ];

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/currencies", label: t("nav.currencies") }, { label: name }]}
        title={t("cc.title", { name })}
        lead={note.about}
        icon={<CurrencyMark iso={meta.iso} size={72} />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none">{f.fmt(last[code])}</p>
          <p className="mt-2 text-lg">
            <span className={tone(d1.abs)}>{f.fmtSigned(d1.abs)} ({f.fmtPct(d1.pct)})</span>
            <span className="text-mute"> · {t("cc.perLine", { x: perText })}</span>
          </p>
        </div>
      </PageHead>
      <ContentNotice />

      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title={t("cc.hist")} id="hist" aside={t("cc.asideTo", { date: f.fmtDate(last.date) })}>
          <PriceChart data={hist} label={t("cc.chart.label", { name })}>
            <Chart data={hist.slice(-90)} label={t("cc.chart90", { name })} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <Panel title={t("cc.pos")} id="pos">
            <RangeBar min={r365.min} max={r365.max} value={last[code]} lo={f.fmt(r365.min)} hi={f.fmt(r365.max)} label={t("cc.rangeLabel", { name })} />
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div><dt className="text-sm text-mute">{t("cc.change30")}</dt><dd className={`text-lg ${tone(d30.pct)}`}>{f.fmtPct(d30.pct)}</dd></div>
              <div><dt className="text-sm text-mute">{t("cc.vol")}</dt><dd className="text-lg">{f.fmtNum(vol)}%</dd></div>
              <div><dt className="text-sm text-mute">{t("cc.low30")}</dt><dd className="text-lg">{f.fmt(r30.min)}</dd></div>
              <div><dt className="text-sm text-mute">{t("cc.high30")}</dt><dd className="text-lg">{f.fmt(r30.max)}</dd></div>
            </dl>
          </Panel>
          <Panel title={t("cc.conv")} id="conv">
            <Converter rate={perOne} short={short} />
            <p className="mt-4 flex flex-wrap gap-x-5 text-sm">
              <Link href={href(`/convert/${code}-to-egp`)} className="inline-flex min-h-11 items-center text-note underline">{t("cc.linkTo", { x: short })}</Link>
              <Link href={href(`/convert/egp-to-${code}`)} className="inline-flex min-h-11 items-center text-note underline">{t("cc.linkFrom", { x: short })}</Link>
            </p>
          </Panel>
        </div>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel title={t("cc.strip")} id="strip" aside={t("cc.stripAside")}>
          <DayStrip days={dailyChanges(rows, code)} label={t("cc.stripLabel", { name })} />
        </Panel>
        <Panel title={t("cc.periods")} id="periods">
          <PeriodTable rows={rows} k={code} caption={t("cc.periodsCap", { name })} />
        </Panel>
      </div>

      <div className="mx-auto mt-14 grid max-w-page gap-12 px-4 sm:px-6 xl:px-12 lg:grid-cols-[minmax(0,46rem)_minmax(0,30rem)] lg:justify-between">
        <section aria-labelledby="analysis">
          <h2 id="analysis" className="font-display text-3xl font-bold">{t("cc.analysis")}</h2>
          <div className="mt-4 max-w-[62ch] font-serif text-xl leading-[2]">
            {report.map((p) => <p key={p} className="mt-4 first:mt-0">{p}</p>)}
            <p className="mt-4">{note.why}</p>
          </div>
        </section>
        <section aria-labelledby="amounts">
          <h2 id="amounts" className="font-display text-3xl font-bold">{t("cc.amounts")}</h2>
          <table className="mt-4 w-full text-start">
            <caption className="sr-only">{t("cc.amountsCap", { name })}</caption>
            <tbody>
              {AMOUNTS.map((a) => (
                <tr key={a} className="border-b border-line">
                  <th scope="row" className="py-2 text-start font-normal">{f.fmtInt(a)} {short}</th>
                  <td className="text-end font-display font-bold">{t("val.egp", { v: f.fmt(a * perOne) })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="mx-auto mt-14 max-w-page px-4 sm:px-6 xl:px-12">
        <h2 className="font-display text-3xl font-bold">{t("cc.faqTitle", { name })}</h2>
        <div className="mt-6"><Faq items={faq} /></div>
      </div>

      <div className="mx-auto mt-14 max-w-page px-4 sm:px-6 xl:px-12">
        <h2 className="font-display text-3xl font-bold">{t("cc.related")}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <li key={c}>
              <Link href={href(`/currency/${c}`)} className="flex min-h-16 items-center gap-4 rounded-[10px] border border-line p-3 hover:bg-paper-2">
                <CurrencyMark iso={CURRENCIES[c].iso} size={44} />
                <span className="flex-1 text-lg">{f.cname(c)}</span>
                <span className="font-display text-xl font-bold">{f.fmt(last[c])}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
