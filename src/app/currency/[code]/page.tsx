import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { Converter } from "@/components/Converter";
import { CODES, CURRENCIES, change, getRows, isCode, range } from "@/lib/rates";
import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/format";

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/currency/[code]">): Promise<Metadata> {
  const { code } = await params;
  return isCode(code) ? { title: `سعر ${CURRENCIES[code].name} اليوم` } : {};
}

export default async function CurrencyPage({ params }: PageProps<"/currency/[code]">) {
  const { code } = await params;
  if (!isCode(code)) notFound();
  const rows = await getRows();
  const last = rows.at(-1)!;
  const d1 = change(rows, code), d30 = change(rows, code, 30), r30 = range(rows, code);
  const meta = CURRENCIES[code];

  return (
    <main className="mx-auto max-w-5xl px-4">
      <p className="text-mute">{fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">{meta.name}</h1>
      <p className="mt-4 font-display text-7xl font-bold leading-none">{fmt(last[code])}</p>
      <p className="mt-3 text-mute">جنيه مصري لكل {meta.short}، {fmtSigned(d1.abs)} عن أمس</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.8fr_1fr]">
        <section aria-labelledby="hist">
          <h2 id="hist" className="mb-2 text-xl font-semibold">آخر ٩٠ يوم</h2>
          <Chart
            data={rows.map((r) => ({ date: r.date, v: r[code] }))}
            label={`تطور سعر ${meta.name} مقابل الجنيه خلال آخر ٩٠ يوم`}
          />
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4">
            <div><dt className="text-sm text-mute">تغيّر ٣٠ يوم</dt><dd className="text-lg">{fmtPct(d30.pct)}</dd></div>
            <div><dt className="text-sm text-mute">أدنى ٣٠ يوم</dt><dd className="text-lg">{fmt(r30.min)}</dd></div>
            <div><dt className="text-sm text-mute">أعلى ٣٠ يوم</dt><dd className="text-lg">{fmt(r30.max)}</dd></div>
          </dl>
        </section>
        <section aria-labelledby="conv" className="h-fit rounded-2xl border border-line bg-paper-2 p-5">
          <h2 id="conv" className="mb-4 text-xl font-semibold">المحوّل</h2>
          <Converter rate={last[code]} short={meta.short} />
        </section>
      </div>
    </main>
  );
}
