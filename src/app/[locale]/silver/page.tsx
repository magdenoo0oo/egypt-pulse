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
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { dailyChanges } from "@/lib/insights";
import { change, getRows, range } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("silver.meta.title"), description: t("silver.meta.desc"), alternates: altLinks(locale, "/silver") };
}

const PURITY = [["silver.p999", 1], ["silver.p925", 0.925], ["silver.p800", 0.8]] as const;

export default async function Silver() {
  const { t, f, href } = await getI18n();
  const rows = await getRows();
  const last = rows.at(-1)!;
  const d1 = change(rows, "silver");
  const r = range(rows, "silver", 365);
  const hist = rows.map((x) => ({ date: x.date, v: x.silver }));
  return (
    <main>
      <PageHead
        crumbs={[{ label: t("nav.silver") }]}
        title={t("silver.title")}
        lead={t("silver.lead", { date: f.fmtDate(last.date) })}
        icon={<Bullion tone="silver" className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none">{f.fmt(last.silver)}</p>
          <p className="mt-2 text-lg"><span className={tone(d1.abs)}>{f.fmtSigned(d1.abs)} ({f.fmtPct(d1.pct)})</span> <span className="text-mute">· {t("silver.unit")}</span></p>
        </div>
      </PageHead>

      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <ul className="grid gap-3 sm:grid-cols-3">
          {PURITY.map(([k, p]) => (
            <li key={k} className="rounded-[10px] border border-line bg-paper-2 p-5">
              <p className="text-mute">{t(k)}</p>
              <p className="mt-1 font-display text-4xl font-bold">{f.fmt(last.silver * p)}</p>
              <p className="text-sm text-mute">{t("silver.perGramKilo", { kilo: f.fmtInt(last.silver * p * 1000) })}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title={t("cc.hist")} id="h">
          <PriceChart data={hist} tone="mute" label={t("silver.chartLabel")}>
            <Chart data={hist.slice(-90)} label={t("silver.chart90")} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <Panel title={t("gold.pos")} id="p"><RangeBar min={r.min} max={r.max} value={last.silver} lo={f.fmt(r.min)} hi={f.fmt(r.max)} label={t("silver.rangeLabel")} /></Panel>
          <Panel title={t("gt.perf")} id="pp"><PeriodTable rows={rows} k="silver" caption={t("silver.periodsCap")} /></Panel>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel title={t("gt.strip")} id="d"><DayStrip days={dailyChanges(rows, "silver")} label={t("silver.stripLabel")} /></Panel>
        <p className="mt-8">
          {t("silver.also")} <Link className="text-note underline" href={href("/gold")}>{t("nav.gold")}</Link> · <Link className="text-note underline" href={href("/movers")}>{t("nav.movers")}</Link>
        </p>
      </div>
    </main>
  );
}
