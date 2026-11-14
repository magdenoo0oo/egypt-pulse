import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { CurrencyMark } from "@/components/CurrencyMark";
import { Faq } from "@/components/Faq";
import { MultiConverter } from "@/components/MultiConverter";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { PriceChart } from "@/components/PriceChart";
import { altLinks } from "@/i18n/seo";
import { getI18n, type I18n } from "@/i18n/server";
import { PAIRS, parsePair } from "@/lib/pairs";
import { CODES, CURRENCIES, getRows, unitOf, type Code } from "@/lib/rates";

export function generateStaticParams() {
  return PAIRS.map((p) => ({ pair: p.slug }));
}

const pairTitle = ({ t, f }: I18n, p: NonNullable<ReturnType<typeof parsePair>>) =>
  p.to === "egp" ? t("pair.titleTo", { x: f.cshort(p.from as Code) }) : t("pair.titleFrom", { x: f.cshort(p.to as Code) });

export async function generateMetadata({ params }: PageProps<"/[locale]/convert/[pair]">): Promise<Metadata> {
  const { pair } = await params;
  const p = parsePair(pair);
  if (!p) return {};
  const i18n = await getI18n();
  const title = pairTitle(i18n, p);
  return { title: i18n.t("pair.meta.title", { title }), description: i18n.t("pair.meta.desc", { title }), alternates: altLinks(i18n.locale, `/convert/${pair}`) };
}

const AMOUNTS_FOREIGN = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
const AMOUNTS_EGP = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

export default async function PairPage({ params }: PageProps<"/[locale]/convert/[pair]">) {
  const { pair } = await params;
  const p = parsePair(pair);
  if (!p) notFound();
  const i18n = await getI18n();
  const { t, f, href } = i18n;
  const code = (p.from === "egp" ? p.to : p.from) as Code;
  const toEgp = p.to === "egp";
  const rows = await getRows();
  const last = rows.at(-1)!;
  const meta = CURRENCIES[code];
  const name = f.cname(code), short = f.cshort(code);
  const perOne = last[code] / unitOf(code);
  const title = pairTitle(i18n, p);
  const options = [{ code: "egp", name: t("conv.egp"), perOne: 1 }, ...CODES.map((c) => ({ code: c, name: f.cname(c), perOne: last[c] / unitOf(c) }))];
  const hist = rows.map((r) => ({ date: r.date, v: r[code] }));
  const amounts = toEgp ? AMOUNTS_FOREIGN : AMOUNTS_EGP;
  const date = f.fmtDate(last.date);
  const faq = toEgp
    ? [
        { q: t("pair.faq.q1to", { n: f.fmtInt(100), short }), a: t("pair.faq.a1to", { n: f.fmtInt(100), short, v: f.fmt(100 * perOne), date }) },
        { q: t("pair.faq.q2to", { short }), a: t("pair.faq.a2to") },
      ]
    : [
        { q: t("pair.faq.q1from", { n: f.fmtInt(1000), short }), a: t("pair.faq.a1from", { n: f.fmtInt(1000), short, v: f.fmtRate(1000 / perOne), date }) },
        { q: t("pair.faq.q2from", { short }), a: t("pair.faq.a2from") },
      ];
  const reverse = toEgp ? `egp-to-${code}` : `${code}-to-egp`;

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/convert", label: t("nav.convert") }, { label: title }]}
        title={title}
        lead={t("pair.lead", { date, short, v: f.fmt(perOne) })}
        icon={<CurrencyMark iso={meta.iso} size={72} />}
      />
      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[1.2fr_1fr]">
        <Panel vault title={t("pair.now")} id="c">
          <MultiConverter options={options} initialFrom={p.from} initialTo={p.to} />
          <Link href={href(`/convert/${reverse}`)} className="mt-4 inline-flex min-h-11 items-center text-note underline">
            {toEgp ? t("pair.reverseFrom", { x: short }) : t("pair.reverseTo", { x: short })}
          </Link>
        </Panel>
        <Panel title={t("pair.amounts")} id="t">
          <table className="w-full text-start">
            <caption className="sr-only">{t("pair.amountsCap", { title })}</caption>
            <tbody>
              {amounts.map((a) => (
                <tr key={a} className="border-b border-line">
                  <th scope="row" className="py-2 text-start font-normal">{f.fmtInt(a)} {toEgp ? short : t("c.egp")}</th>
                  <td className="text-end font-display font-bold">{toEgp ? t("val.egp", { v: f.fmt(a * perOne) }) : `${f.fmtRate(a / perOne)} ${short}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel title={t("pair.chartTitle", { name })} id="h">
          <PriceChart data={hist} label={t("cc.chart.label", { name })}>
            <Chart data={hist.slice(-90)} label={t("cc.chart90", { name })} />
          </PriceChart>
          <p className="mt-4"><Link href={href(`/currency/${code}`)} className="inline-flex min-h-11 items-center text-note underline">{t("pair.full", { name })}</Link></p>
        </Panel>
      </div>
      <div className="mx-auto mt-14 max-w-page px-4 sm:px-6 xl:px-12">
        <h2 className="font-display text-3xl font-bold">{t("pair.faqTitle")}</h2>
        <div className="mt-6"><Faq items={faq} /></div>
      </div>
    </main>
  );
}
