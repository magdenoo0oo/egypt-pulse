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
import { CODES, CURRENCIES, getRows, unitOf } from "@/lib/rates";
import { PAIRS, parsePair } from "@/lib/pairs";
import { fmt, fmtDate, fmtInt, fmtRate } from "@/lib/format";

export function generateStaticParams() {
  return PAIRS.map((p) => ({ pair: p.slug }));
}

const title = (p: NonNullable<ReturnType<typeof parsePair>>) =>
  p.to === "egp" ? `تحويل ${CURRENCIES[p.from as keyof typeof CURRENCIES].short} إلى جنيه مصري` : `تحويل الجنيه المصري إلى ${CURRENCIES[p.to as keyof typeof CURRENCIES].short}`;

export async function generateMetadata({ params }: PageProps<"/convert/[pair]">): Promise<Metadata> {
  const { pair } = await params;
  const p = parsePair(pair);
  if (!p) return {};
  return {
    title: `${title(p)} بآخر سعر`,
    description: `${title(p)} بآخر سعر مرجعي، مع جدول مبالغ شائعة ورسم لتاريخ السعر وأسئلة شائعة.`,
    alternates: { canonical: `/convert/${pair}` },
  };
}

const AMOUNTS_FOREIGN = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
const AMOUNTS_EGP = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

export default async function PairPage({ params }: PageProps<"/convert/[pair]">) {
  const { pair } = await params;
  const p = parsePair(pair);
  if (!p) notFound();
  const code = (p.from === "egp" ? p.to : p.from) as keyof typeof CURRENCIES;
  const toEgp = p.to === "egp";
  const rows = await getRows();
  const last = rows.at(-1)!;
  const meta = CURRENCIES[code];
  const perOne = last[code] / unitOf(code);
  const options = [{ code: "egp", name: "الجنيه المصري", perOne: 1 }, ...CODES.map((c) => ({ code: c, name: CURRENCIES[c].name, perOne: last[c] / unitOf(c) }))];
  const hist = rows.map((r) => ({ date: r.date, v: r[code] }));
  const amounts = toEgp ? AMOUNTS_FOREIGN : AMOUNTS_EGP;
  const faq = toEgp
    ? [
        { q: `${fmtInt(100)} ${meta.short} بكام جنيه؟`, a: `${fmtInt(100)} ${meta.short} = ${fmt(100 * perOne)} جنيه بالسعر المرجعي في ${fmtDate(last.date)}.` },
        { q: `هل ده سعر ${meta.short} في البنك؟`, a: "لا. ده سعر مرجعي (mid-market). البنك أو الصرّاف بيشتري بسعر أقل ويبيع بسعر أعلى." },
      ]
    : [
        { q: `${fmtInt(1000)} جنيه بكام ${meta.short}؟`, a: `${fmtInt(1000)} جنيه = ${fmtRate(1000 / perOne)} ${meta.short} بالسعر المرجعي في ${fmtDate(last.date)}.` },
        { q: `هل ده سعر شراء ${meta.short} من البنك؟`, a: "لا. ده سعر مرجعي. اللي هتدفعه فعلًا بيتحدد من البنك أو مكتب الصرافة وبيشمل فرق البيع والشراء." },
      ];
  const reverse = toEgp ? `egp-to-${code}` : `${code}-to-egp`;

  return (
    <main>
      <PageHead
        crumbs={[{ href: "/convert", label: "المحوّل" }, { label: title(p) }]}
        title={title(p)}
        lead={`بآخر سعر مرجعي بتاريخ ${fmtDate(last.date)}: ١ ${meta.short} = ${fmt(perOne)} جنيه.`}
        icon={<CurrencyMark iso={meta.iso} size={72} />}
      />
      <div className="mx-auto mt-8 grid max-w-page gap-4 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel vault title="حوّل الآن" id="c">
          <MultiConverter options={options} initialFrom={p.from} initialTo={p.to} />
          <Link href={`/convert/${reverse}`} className="mt-4 inline-flex min-h-11 items-center text-note underline">
            {toEgp ? `من الجنيه إلى ${meta.short}` : `من ${meta.short} إلى الجنيه`}
          </Link>
        </Panel>
        <Panel title="مبالغ شائعة" id="t">
          <table className="w-full text-start">
            <caption className="sr-only">{title(p)} لمبالغ شائعة</caption>
            <tbody>
              {amounts.map((a) => (
                <tr key={a} className="border-b border-line">
                  <th scope="row" className="py-2 text-start font-normal">{fmtInt(a)} {toEgp ? meta.short : "جنيه"}</th>
                  <td className="text-end font-display font-bold">{toEgp ? `${fmt(a * perOne)} جنيه` : `${fmtRate(a / perOne)} ${meta.short}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
      <div className="mx-auto mt-4 max-w-page px-4 sm:px-6">
        <Panel title={`سعر ${meta.name} بالجنيه`} id="h">
          <PriceChart data={hist} label={`تطور سعر ${meta.name} مقابل الجنيه`}>
            <Chart data={hist.slice(-90)} label={`تطور سعر ${meta.name} آخر ٩٠ يوم`} />
          </PriceChart>
          <p className="mt-4"><Link href={`/currency/${code}`} className="inline-flex min-h-11 items-center text-note underline">التحليل الكامل لـ{meta.name}</Link></p>
        </Panel>
      </div>
      <div className="mx-auto mt-20 max-w-page px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold">أسئلة شائعة</h2>
        <div className="mt-6 max-w-3xl"><Faq items={faq} /></div>
      </div>
    </main>
  );
}
