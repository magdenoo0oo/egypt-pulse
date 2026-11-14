import Link from "next/link";
import type { Metadata } from "next";
import { tone } from "@/components/RateList";
import { CODES, CURRENCIES, change, getRows } from "@/lib/rates";
import { fmt, fmtPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "أكتر العملات ارتفاعًا وانخفاضًا مقابل الجنيه",
  description: "ترتيب العملات والذهب حسب التغيّر مقابل الجنيه المصري خلال أسبوع وشهر وثلاثة شهور وسنة.",
  alternates: { canonical: "/movers" },
};

const PERIODS = [[7, "أسبوع"], [30, "شهر"], [90, "٣ شهور"], [365, "سنة"]] as const;

export default async function Movers() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const items = [
    ...CODES.map((c) => ({ key: c as string, name: CURRENCIES[c].name, href: `/currency/${c}`, now: last[c], k: c })),
    { key: "gold24", name: "الذهب عيار ٢٤", href: "/gold", now: last.gold24, k: "gold24" as const },
    { key: "silver", name: "الفضة", href: "/silver", now: last.silver, k: "silver" as const },
  ];
  const table = items.map((i) => ({ ...i, ch: PERIODS.map(([d]) => (rows.length > d ? change(rows, i.k, d).pct : null)) }));
  const sorted = [...table].sort((a, b) => (b.ch[1] ?? 0) - (a.ch[1] ?? 0));

  return (
    <main className="mx-auto max-w-5xl px-4">
      <h1 className="font-display text-4xl font-bold">الحركة: مين طلع ومين نزل</h1>
      <p className="mt-3 max-w-[60ch] text-mute">
        مرتّبة حسب التغيّر خلال آخر شهر. الأحمر معناه إن السعر زاد (يعني الجنيه بيشتري أقل)، والأخضر معناه إنه نزل.
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-start">
          <caption className="sr-only">تغيّر الأسعار مقابل الجنيه حسب الفترة</caption>
          <thead className="text-sm text-mute">
            <tr className="border-b border-line">
              <th scope="col" className="py-2 text-start font-normal">الأصل</th>
              <th scope="col" className="text-start font-normal">السعر</th>
              {PERIODS.map(([, l]) => <th key={l} scope="col" className="text-start font-normal">{l}</th>)}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.key} className="border-b border-line">
                <th scope="row" className="py-3 text-start font-normal">
                  <Link href={r.href} className="inline-flex min-h-11 items-center hover:underline">{r.name}</Link>
                </th>
                <td className="font-display font-bold">{fmt(r.now)}</td>
                {r.ch.map((c, i) => (
                  <td key={i} className={c === null ? "text-mute" : tone(c)}>{c === null ? "-" : fmtPct(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
