import Link from "next/link";
import type { Metadata } from "next";
import { CurrencyMark } from "@/components/CurrencyMark";
import { MultiConverter } from "@/components/MultiConverter";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { Section } from "@/components/Section";
import { CODES, CURRENCIES, getRows, unitOf } from "@/lib/rates";
import { fmt, fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "محوّل العملات: حوّل بين أي عملتين والجنيه المصري",
  description: "حوّل أي مبلغ بين الجنيه المصري والدولار واليورو والريال والدرهم وباقي العملات بآخر سعر مرجعي.",
  alternates: { canonical: "/convert" },
};

export default async function Convert() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const options = [
    { code: "egp", name: "الجنيه المصري", perOne: 1 },
    ...CODES.map((c) => ({ code: c, name: CURRENCIES[c].name, perOne: last[c] / unitOf(c) })),
  ];
  return (
    <main>
      <PageHead
        crumbs={[{ label: "المحوّل" }]}
        title="محوّل العملات"
        lead={`حوّل بين أي عملتين من ${CODES.length + 1} عملة بسعر ${fmtDate(last.date)}. السعر مرجعي وليس سعر بنك.`}
      />
      <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-6 xl:px-12">
        <Panel vault title="حوّل" id="c"><MultiConverter options={options} /></Panel>
      </div>
      <Section id="pairs" title="تحويلات جاهزة" lead="صفحة لكل عملة من وإلى الجنيه، فيها جدول مبالغ شائعة.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CODES.map((c) => (
            <li key={c} className="flex items-center gap-4 rounded-[10px] border border-line p-3">
              <CurrencyMark iso={CURRENCIES[c].iso} size={44} />
              <div className="flex-1">
                <p className="text-lg">{CURRENCIES[c].name}</p>
                <p className="text-sm text-mute">{fmt(last[c])} جنيه</p>
              </div>
              <div className="flex flex-col text-sm">
                <Link href={`/convert/${c}-to-egp`} className="inline-flex min-h-9 items-center text-note underline">إلى جنيه</Link>
                <Link href={`/convert/egp-to-${c}`} className="inline-flex min-h-9 items-center text-note underline">من جنيه</Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
