import type { Metadata } from "next";
import { Heatmap } from "@/components/Heatmap";
import { PageHead } from "@/components/PageHead";
import { RateList } from "@/components/RateList";
import { Section } from "@/components/Section";
import { CODES, CURRENCIES, GROUPS, getRows, type Group } from "@/lib/rates";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "أسعار العملات اليوم مقابل الجنيه المصري",
  description: "أسعار الدولار واليورو والريال والدرهم والدينار وباقي العملات مقابل الجنيه المصري، محدّثة يوميًا مع تاريخ سنة كاملة.",
  alternates: { canonical: "/currencies" },
};

export default async function Currencies() {
  const rows = await getRows();
  return (
    <main>
      <PageHead
        crumbs={[{ label: "العملات" }]}
        title="أسعار العملات اليوم"
        lead={`${CODES.length} عملة مقابل الجنيه المصري بتاريخ ${fmtDate(rows.at(-1)!.date)}. اضغط على أي عملة للتاريخ والتحليل والمحوّل.`}
      />
      <Section vault id="heat" title="الخريطة" lead="لون كل مربع بيعبّر عن حركة السعر آخر ٣٠ يوم.">
        <Heatmap rows={rows} />
      </Section>
      {(Object.keys(GROUPS) as Group[]).map((g) => (
        <Section key={g} id={`g-${g}`} title={GROUPS[g]}>
          <RateList rows={rows} codes={CODES.filter((c) => CURRENCIES[c].group === g)} />
        </Section>
      ))}
    </main>
  );
}
