import type { Metadata } from "next";

export const metadata: Metadata = { title: "للمطوّرين" };

const endpoints = [
  ["GET /api/v1/rates", "آخر سعر لكل العملات وتغيّر اليوم."],
  ["GET /api/v1/rates/usd?days=30", "تاريخ عملة معيّنة (usd, eur, sar, gbp)، من يوم لـ ٣٦٥ يوم."],
  ["GET /api/v1/gold", "سعر جرام الذهب عيار ٢٤ و٢١ و١٨ والجنيه الذهب."],
];

export default function Developers() {
  return (
    <main className="mx-auto max-w-3xl px-4">
      <h1 className="font-display text-4xl font-bold">API مفتوح</h1>
      <p className="mt-3 max-w-[60ch] text-lg text-mute">
        نفس البيانات اللي في الموقع، JSON جاهز لأي تطبيق أو بوت. من غير مفتاح ومن غير تسجيل.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {endpoints.map(([path, desc]) => (
          <li key={path} className="py-5">
            <code dir="ltr" className="block text-start font-mono text-base text-note">{path}</code>
            <p className="mt-1">{desc}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-xl font-semibold">مثال</h2>
      <pre dir="ltr" className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper-2 p-4 text-sm">
{`curl https://YOUR-DOMAIN/api/v1/rates

{
  "date": "2026-11-13",
  "base": "EGP",
  "rates": { "USD": { "egp": 53.4356, "change_1d": -0.1167 } }
}`}
      </pre>
    </main>
  );
}
