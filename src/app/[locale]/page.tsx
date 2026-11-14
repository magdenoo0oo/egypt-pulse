import Link from "next/link";
import { Bullion } from "@/components/Bullion";
import { Faq } from "@/components/Faq";
import { Heatmap } from "@/components/Heatmap";
import { IndexChart } from "@/components/IndexChart";
import { MultiConverter } from "@/components/MultiConverter";
import { Panel } from "@/components/Panel";
import { tone } from "@/components/RateList";
import { Section } from "@/components/Section";
import { TimeHero } from "@/components/TimeHero";
import { getContent } from "@/content";
import { getI18n } from "@/i18n/server";
import { indexed, marketReport, movers } from "@/lib/insights";
import { CODES, change, getRows, goldPrice, unitOf } from "@/lib/rates";

export default async function Home() {
  const i18n = await getI18n();
  const { t, f, href, locale } = i18n;
  const rows = await getRows();
  const last = rows.at(-1)!;
  const mv = movers(rows, i18n, 30);
  const { guides } = getContent(locale);
  const options = [
    { code: "egp", name: t("conv.egp"), perOne: 1 },
    ...CODES.map((c) => ({ code: c, name: f.cname(c), perOne: last[c] / unitOf(c) })),
  ];
  const lines = [
    { key: "usd", name: t("line.usd"), tone: "note" as const, data: indexed(rows, "usd") },
    { key: "eur", name: t("line.eur"), tone: "down" as const, data: indexed(rows, "eur") },
    { key: "sar", name: t("line.sar"), tone: "ink" as const, data: indexed(rows, "sar") },
    { key: "gold24", name: t("line.gold24"), tone: "gold" as const, data: indexed(rows, "gold24") },
    { key: "silver", name: t("line.silver"), tone: "mute" as const, data: indexed(rows, "silver") },
  ];
  const pts = (fn: (r: (typeof rows)[number]) => number) => rows.map((r) => ({ date: r.date, v: fn(r) }));
  const assets = [
    { key: "usd", label: t("hero.usd"), unit: t("hero.unit.usd"), href: href("/currency/usd"), data: pts((r) => r.usd) },
    { key: "eur", label: t("hero.eur"), unit: t("hero.unit.eur"), href: href("/currency/eur"), data: pts((r) => r.eur) },
    { key: "sar", label: t("hero.sar"), unit: t("hero.unit.sar"), href: href("/currency/sar"), data: pts((r) => r.sar) },
    { key: "gold21", label: t("hero.gold21"), unit: t("hero.unit.gold21"), href: href("/gold/21"), data: pts((r) => goldPrice(r.gold24, "21")) },
  ];
  const report = marketReport(rows, i18n);
  const g21 = goldPrice(last.gold24, "21");
  const gch = change(rows, "gold24", 30);
  const sch = change(rows, "silver", 30);
  const faq = [1, 2, 3, 4].map((n) => ({ q: t(`home.faq.q${n}` as "home.faq.q1"), a: t(`home.faq.a${n}` as "home.faq.a1") }));

  return (
    <main>
      <div className="mx-auto mt-5 max-w-page px-4 sm:px-6 xl:px-12">
        <TimeHero assets={assets} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Panel vault title={t("home.gold")} id="home-gold" aside={t("home.goldAside")}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-5xl font-bold leading-none text-gold">{f.fmtInt(g21)}</p>
                <p className={`mt-2 ${tone(gch.pct)}`}>{t("home.pct30", { pct: f.fmtPct(gch.pct) })}</p>
              </div>
              <Bullion className="w-24 text-ink" />
            </div>
            <Link href={href("/gold")} className="mt-4 inline-flex min-h-11 items-center text-note underline">{t("home.goldLink")}</Link>
          </Panel>
          <Panel vault title={t("home.silver")} id="home-silver" aside={t("home.silverAside")}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-5xl font-bold leading-none">{f.fmt(last.silver)}</p>
                <p className={`mt-2 ${tone(sch.pct)}`}>{t("home.pct30", { pct: f.fmtPct(sch.pct) })}</p>
              </div>
              <Bullion tone="silver" className="w-24 text-ink" />
            </div>
            <Link href={href("/silver")} className="mt-4 inline-flex min-h-11 items-center text-note underline">{t("home.silverLink")}</Link>
          </Panel>
          {[
            [t("home.topUp"), mv.slice(0, 4), "home-up"],
            [t("home.topDown"), mv.slice(-4).reverse(), "home-down"],
          ].map(([title, list, id]) => (
            <Panel key={id as string} title={title as string} id={id as string} aside={t("home.days30Aside")}>
              <ul className="divide-y divide-line">
                {(list as typeof mv).map((m) => (
                  <li key={m.key}>
                    <Link href={href(m.path)} className="flex min-h-11 items-center justify-between hover:bg-paper-3">
                      <span>{m.name}</span>
                      <span className={tone(m.pct)}>{f.fmtPct(m.pct)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>

      <Section vault id="map" title={t("home.map.title")} lead={t("home.map.lead")}>
        <Heatmap rows={rows} />
      </Section>

      <Section id="compare" title={t("home.cmp.title")} lead={t("home.cmp.lead")}>
        <Panel>
          <IndexChart lines={lines} label={t("home.cmp.label")} />
        </Panel>
      </Section>

      <Section id="report" title={t("home.report.title")} lead={t("home.report.lead")}>
        <div className="grid gap-10 lg:grid-cols-[1fr_26rem]">
          <div className="font-serif text-xl leading-[2] lg:columns-2 lg:gap-12">
            {report.map((p) => <p key={p} className="mb-4 break-inside-avoid">{p}</p>)}
          </div>
          <Panel title={t("home.conv.title")} id="home-conv" vault>
            <MultiConverter options={options} />
          </Panel>
        </div>
      </Section>

      <Section
        id="guides"
        title={t("home.guides.title")}
        lead={t("home.guides.lead")}
        aside={<Link href={href("/guides")} className="inline-flex min-h-11 items-center text-note underline">{t("home.guides.all")}</Link>}
      >
        <ul className="grid border-t border-line lg:grid-cols-2 lg:gap-x-14">
          {guides.slice(0, 4).map((g) => (
            <li key={g.slug} className="border-b border-line">
              <Link href={href(`/guides/${g.slug}`)} className="grid gap-1 py-5 hover:bg-paper-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8 sm:px-3">
                <span>
                  <span className="block font-display text-2xl font-bold">{g.title}</span>
                  <span className="mt-1 block max-w-[62ch] text-mute">{g.summary}</span>
                </span>
                <span className="text-sm text-mute">{t("guide.minutes", { n: g.minutes })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="api" title={t("home.api.title")} lead={t("home.api.lead")}>
        <div className="vault grid gap-6 rounded-[10px] border border-line p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <ul className="grid gap-2">
            <li>{t("home.api.b1", { n: CODES.length })}</li>
            <li>{t("home.api.b2")}</li>
            <li>{t("home.api.b3")}</li>
            <li><Link href={href("/developers")} className="mt-2 inline-flex min-h-11 items-center text-note underline">{t("home.api.docs")}</Link></li>
          </ul>
          <pre dir="ltr" className="overflow-x-auto rounded-md border border-line bg-paper-2 p-4 text-start text-sm leading-7">
{`curl "/api/v1/convert?from=usd&to=egp&amount=100"

{ "from": "USD", "to": "EGP",
  "rate": ${last.usd}, "result": ${(last.usd * 100).toFixed(2)} }`}
          </pre>
        </div>
      </Section>

      <Section id="faq" title={t("home.faq.title")} lead={t("home.faq.lead", { price: f.fmt(last.usd) })}>
        <div><Faq items={faq} /></div>
      </Section>
    </main>
  );
}
