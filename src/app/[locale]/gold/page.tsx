import Link from "next/link";
import type { Metadata } from "next";
import { Bullion } from "@/components/Bullion";
import { Chart } from "@/components/Chart";
import { DayStrip } from "@/components/DayStrip";
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
import { getContent } from "@/content";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { dailyChanges, goldReport, indexed } from "@/lib/insights";
import { GOLD, GOLD_TYPES, change, getRows, goldPrice, range } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("gold.meta.title"), description: t("gold.meta.desc"), alternates: altLinks(locale, "/gold") };
}

export default async function Gold() {
  const i18n = await getI18n();
  const { t, f, href, locale } = i18n;
  const rows = await getRows();
  const last = rows.at(-1)!;
  const ch = change(rows, "gold24", 30);
  const r = range(rows, "gold24", 365);
  const g21 = goldPrice(last.gold24, "21");
  const hist = rows.map((x) => ({ date: x.date, v: x.gold24 }));
  const lines = [
    { key: "gold24", name: t("gold.lineGold"), tone: "gold" as const, data: indexed(rows, "gold24") },
    { key: "usd", name: t("gold.lineUsd"), tone: "note" as const, data: indexed(rows, "usd") },
  ];
  const faq = [1, 2, 3, 4].map((n) => ({ q: t(`gold.faq.q${n}` as "gold.faq.q1"), a: t(`gold.faq.a${n}` as "gold.faq.a1") }));
  const { guides } = getContent(locale);
  return (
    <main>
      <PageHead
        crumbs={[{ label: t("nav.gold") }]}
        title={t("gold.title")}
        lead={t("gold.lead", { date: f.fmtDate(last.date) })}
        icon={<Bullion className="hidden w-28 text-ink sm:block" />}
      >
        <div className="text-end">
          <p className="font-display text-7xl font-bold leading-none text-gold">{f.fmtInt(g21)}</p>
          <p className="mt-2 text-lg">{t("gold.k21line")} · <span className={tone(ch.pct)}>{t("home.pct30", { pct: f.fmtPct(ch.pct) })}</span></p>
        </div>
      </PageHead>

      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GOLD_TYPES.map((g) => (
            <li key={g}>
              <Link href={href(`/gold/${g}`)} className="block h-full rounded-[10px] border border-line bg-paper-2 p-5 hover:border-note">
                <span className="block text-mute">{t(`gold.${g}` as "gold.24")}</span>
                <span className="mt-1 block font-display text-3xl font-bold text-gold">{f.fmtInt(goldPrice(last.gold24, g))}</span>
                <span className="block text-sm text-mute">
                  {g === "pound" || g === "half-pound" ? t("gold.gramsK21", { n: GOLD[g].grams }) : g === "ounce" ? t("gold.ounceNote") : t("gold.perGram")}
                </span>
              </Link>
            </li>
          ))}
          <li className="grid min-w-0 place-items-center rounded-[10px] border border-dashed border-line p-5 text-center text-mute [overflow-wrap:anywhere]">
            <span>{t("gold.allNote")}</span>
          </li>
        </ul>
      </div>

      <div className="mx-auto mt-4 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[2fr_1fr]">
        <Panel vault title={t("gold.g24")} id="g-hist">
          <PriceChart data={hist} tone="gold" label={t("gold.chartLabel")}>
            <Chart data={hist.slice(-90)} label={t("gold.chart90")} />
          </PriceChart>
        </Panel>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <Panel title={t("gold.calc")} id="calc"><GoldCalculator gold24={last.gold24} /></Panel>
          <Panel title={t("gold.pos")} id="pos">
            <RangeBar min={r.min} max={r.max} value={last.gold24} lo={f.fmt(r.min)} hi={f.fmt(r.max)} label={t("gold.rangeLabel")} />
          </Panel>
        </div>
      </div>

      <Section id="why" title={t("gold.why.title")} lead={t("gold.why.lead")}>
        <Panel>
          <IndexChart lines={lines} label={t("gold.why.label")} height={320} />
        </Panel>
      </Section>

      <div className="mx-auto mt-14 grid max-w-page gap-10 px-4 sm:px-6 xl:px-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="gr">
          <h2 id="gr" className="font-display text-3xl font-bold">{t("gold.read")}</h2>
          <div className="mt-4 max-w-[62ch] font-serif text-xl leading-[2]">
            {goldReport(rows, i18n).map((p) => <p key={p} className="mt-4 first:mt-0">{p}</p>)}
          </div>
        </section>
        <Panel title={t("cc.periods")} id="gp"><PeriodTable rows={rows} k="gold24" caption={t("gold.periodsCap")} /></Panel>
      </div>

      <Section id="gs" title={t("gold.strip.title")} lead={t("gold.strip.lead")}>
        <Panel><DayStrip days={dailyChanges(rows, "gold24")} label={t("gold.strip.label")} /></Panel>
      </Section>

      <Section id="faq" title={t("gold.faq.title")}>
        <div><Faq items={faq} /></div>
        <p className="mt-8 flex flex-wrap gap-x-6">
          {guides.filter((g) => g.category === "gold").map((g) => (
            <Link key={g.slug} href={href(`/guides/${g.slug}`)} className="inline-flex min-h-11 items-center text-note underline">{g.title}</Link>
          ))}
        </p>
      </Section>
    </main>
  );
}
