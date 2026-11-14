import type { Metadata } from "next";
import { MultiConverter } from "@/components/MultiConverter";
import { CODES, CURRENCIES, getRows, unitOf } from "@/lib/rates";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "محوّل العملات: حوّل بين أي عملتين والجنيه المصري",
  description: "حوّل أي مبلغ بين الجنيه المصري والدولار واليورو والريال والدرهم وباقي العملات بآخر سعر.",
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
    <main className="mx-auto max-w-3xl px-4">
      <p className="text-mute">بسعر {fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">محوّل العملات</h1>
      <p className="mt-3 text-mute">حوّل بين أي عملتين من {CODES.length + 1} عملة. السعر مرجعي وليس سعر بنك.</p>
      <div className="mt-8 rounded-2xl border border-line bg-paper-2 p-5 sm:p-8">
        <MultiConverter options={options} />
      </div>
    </main>
  );
}
