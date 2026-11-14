import type { Metadata } from "next";
import { RateList } from "@/components/RateList";
import { CODES, CURRENCIES, GROUPS, getRows, type Group } from "@/lib/rates";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "أسعار العملات اليوم مقابل الجنيه المصري",
  description: "أسعار الدولار واليورو والريال والدرهم والدينار وباقي العملات مقابل الجنيه المصري، محدّثة يوميًا.",
  alternates: { canonical: "/currencies" },
};

export default async function Currencies() {
  const rows = await getRows();
  return (
    <main className="mx-auto max-w-5xl px-4">
      <p className="text-mute">{fmtDate(rows.at(-1)!.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">أسعار العملات اليوم</h1>
      <p className="mt-3 max-w-[60ch] text-mute">
        {CODES.length} عملة مقابل الجنيه المصري. اضغط على أي عملة للتاريخ الكامل والمحوّل.
      </p>
      {(Object.keys(GROUPS) as Group[]).map((g) => (
        <section key={g} className="mt-12" aria-labelledby={`g-${g}`}>
          <h2 id={`g-${g}`} className="font-display text-2xl font-bold">{GROUPS[g]}</h2>
          <div className="mt-4">
            <RateList rows={rows} codes={CODES.filter((c) => CURRENCIES[c].group === g)} />
          </div>
        </section>
      ))}
    </main>
  );
}
