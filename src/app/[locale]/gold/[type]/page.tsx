import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Bullion } from "@/components/Bullion";
import { Chart } from "@/components/Chart";
import { ContentNotice } from "@/components/ContentNotice";
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
import { dailyChanges } from "@/lib/insights";
import { GOLD_TYPES, change, getRows, goldPrice, isGoldType, range } from "@/lib/rates";

export function generateStaticParams() {
  return GOLD_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/gold/[type]">): Promise<Metadata> {
  const { type } = await params;
  if (!isGoldType(type)) return {};
  const { t, locale } = await getI18n();
  const label = t(`gold.label.${type}` as "gold.label.24");
  return { title: t("gt.meta.title", { label }), description: t("gt.meta.desc", { label }), alternates: altLinks(locale, `/gold/${type}`) };
}

export default async function GoldType({ params }: PageProps<"/[locale]/gold/[type]">) {
  const { type } = await params;
  if (!isGoldType(type)) notFound();
  const { t, f, href, locale } = await getI18n();
  const base = await getRows();
  const rows = base.map((r) => ({ ...r, gold24: goldPrice(r.gold24, type) }));
  const last = rows.at(-1)!;
  const d1 = change(rows, "gold24"), d30 = change(rows, "gold24", 30);
  const r = range(rows, "gold24", 365);
  const label = t(`gold.label.${type}` as "gold.label.24");
  const name = t(`gold.${type}` as "gold.24");
  const note = getContent(locale).goldNotes[type];
  const hist = rows.map((x) => ({ date: x.date, v: x.gold24 }));
  const faq = [{ q: t("gt.faq.q", { label }), a: t("gt.faq.a", { price: f.fmt(last.gold24), date: f.fmtDate(last.date) }) }, ...note.faq];

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/gold", label: t("nav.gold") }, { label: name }]}
        title={t("gt.title", { label })}
        lead={note.about}
        icon={<Bullion className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none text-gold">{f.fmt(last.gold24)}</p>
          <p className="mt-2 text-lg"><span className={tone(d1.abs)}>{f.fmtSigned(d1.abs)} ({f.fmtPct(d1.pct)})</span> <span className="text-mute">· {t("c.egp")}</span></p>
        </div>
      </PageHead>
      <ContentNotice />

      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title={t("cc.hist")} id="h">
          <PriceChart data={hist} tone="gold" label={t("gt.chartLabel", { label })}>
            <Chart data={hist.slice(-90)} label={t("gt.chart90", { label })} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <Panel title={t("gold.pos")} id="p">
            <RangeBar min={r.min} max={r.max} value={last.gold24} lo={f.fmt(r.min)} hi={f.fmt(r.max)} label={t("gt.rangeLabel")} />
            <p className={`mt-4 ${tone(d30.pct)}`}>{t("home.pct30", { pct: f.fmtPct(d30.pct) })}</p>
          </Panel>
          <Panel title={t("gt.perf")} id="pp"><PeriodTable rows={rows} k="gold24" caption={t("gt.periodsCap", { label })} /></Panel>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel title={t("gt.strip")} id="d"><DayStrip days={dailyChanges(rows, "gold24")} label={t("gt.stripLabel", { name })} /></Panel>
      </div>

      <div className="mx-auto mt-14 max-w-page px-4 sm:px-6 xl:px-12">
        <h2 className="font-display text-3xl font-bold">{t("gt.faqTitle", { name })}</h2>
        <div className="mt-6"><Faq items={faq} /></div>
        <ul className="mt-10 flex flex-wrap gap-2">
          {GOLD_TYPES.filter((g) => g !== type).map((g) => (
            <li key={g}><Link href={href(`/gold/${g}`)} className="inline-flex min-h-11 items-center rounded-md border border-line px-4 hover:bg-paper-2">{t(`gold.${g}` as "gold.24")}</Link></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
