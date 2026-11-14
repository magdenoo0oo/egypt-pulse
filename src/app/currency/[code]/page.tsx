import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Chart } from "@/components/Chart";
import { Converter } from "@/components/Converter";
import { PeriodTable } from "@/components/PeriodTable";
import { CODES, CURRENCIES, change, getRows, isCode, unitOf } from "@/lib/rates";
import { fmt, fmtDate, fmtSigned, fmtInt } from "@/lib/format";

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/currency/[code]">): Promise<Metadata> {
  const { code } = await params;
  if (!isCode(code)) return {};
  const m = CURRENCIES[code];
  return {
    title: `سعر ${m.name} اليوم مقابل الجنيه المصري`,
    description: `سعر ${m.name} (${m.iso}) اليوم بالجنيه المصري، مع الرسم البياني لآخر سنة والمحوّل وأعلى وأدنى سعر.`,
    alternates: { canonical: `/currency/${code}` },
  };
}

const AMOUNTS = [1, 5, 10, 50, 100, 500, 1000, 5000];

export default async function CurrencyPage({ params }: PageProps<"/currency/[code]">) {
  const { code } = await params;
  if (!isCode(code)) notFound();
  const rows = await getRows();
  const last = rows.at(-1)!;
  const d1 = change(rows, code);
  const meta = CURRENCIES[code];
  const unit = unitOf(code);
  const perOne = last[code] / unit;
  const same = CODES.filter((c) => c !== code && CURRENCIES[c].group === meta.group).slice(0, 5);
  const hist = (n: number) => rows.slice(-n).map((r) => ({ date: r.date, v: r[code] }));

  return (
    <main className="mx-auto max-w-5xl px-4">
      <nav aria-label="مسار الصفحة" className="text-sm text-mute">
        <Link href="/currencies" className="hover:underline">العملات</Link> ‹ {meta.name}
      </nav>
      <p className="mt-4 text-mute">{fmtDate(last.date)}</p>
      <h1 className="mt-1 font-display text-4xl font-bold">سعر {meta.name} اليوم</h1>
      <p className="mt-4 font-display text-7xl font-bold leading-none">{fmt(last[code])}</p>
      <p className="mt-3 text-mute">
        جنيه مصري لكل {unit > 1 ? `${fmtInt(unit)} ` : ""}{meta.short}، {fmtSigned(d1.abs)} عن اليوم السابق
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 gap-10">
          <section aria-labelledby="hist">
            <h2 id="hist" className="mb-2 text-xl font-semibold">آخر ٩٠ يوم</h2>
            <Chart data={hist(90)} label={`تطور سعر ${meta.name} مقابل الجنيه خلال آخر ٩٠ يوم`} />
          </section>
          <section aria-labelledby="year">
            <h2 id="year" className="mb-2 text-xl font-semibold">آخر سنة</h2>
            <Chart data={hist(365)} label={`تطور سعر ${meta.name} مقابل الجنيه خلال آخر سنة`} />
          </section>
          <section aria-labelledby="periods">
            <h2 id="periods" className="mb-2 text-xl font-semibold">الأداء حسب الفترة</h2>
            <PeriodTable rows={rows} k={code} caption={`تغيّر وأدنى وأعلى سعر ${meta.name}`} />
          </section>
        </div>

        <aside className="grid h-fit min-w-0 grid-cols-1 gap-10">
          <section aria-labelledby="conv" className="rounded-2xl border border-line bg-paper-2 p-5">
            <h2 id="conv" className="mb-4 text-xl font-semibold">المحوّل</h2>
            <Converter rate={perOne} short={meta.short} />
          </section>
          <section aria-labelledby="amounts">
            <h2 id="amounts" className="mb-2 text-xl font-semibold">جدول التحويل</h2>
            <table className="w-full text-start">
              <caption className="sr-only">قيمة مبالغ شائعة من {meta.name} بالجنيه</caption>
              <tbody>
                {AMOUNTS.map((a) => (
                  <tr key={a} className="border-b border-line">
                    <th scope="row" className="py-2 text-start font-normal">{fmtInt(a)} {meta.short}</th>
                    <td className="text-end">{fmt(a * perOne)} جنيه</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </aside>
      </div>

      <section className="mt-14" aria-labelledby="more">
        <h2 id="more" className="text-xl font-semibold">عملات قريبة</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {same.map((c) => (
            <li key={c}>
              <Link href={`/currency/${c}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper-2">
                {CURRENCIES[c].name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/convert" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper-2">
              محوّل كل العملات
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
