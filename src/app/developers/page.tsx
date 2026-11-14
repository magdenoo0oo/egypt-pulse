import type { Metadata } from "next";

export const metadata: Metadata = { title: "للمطوّرين" };

const endpoints = [
  ["GET /api/v1/currencies", "قايمة العملات المتاحة ووحدة التسعير."],
  ["GET /api/v1/rates", "آخر سعر لكل العملات، وتغيّر اليوم وتغيّر ٣٠ يوم."],
  ["GET /api/v1/rates/usd?days=30", "تاريخ عملة معيّنة، من يوم لـ ٣٦٥ يوم."],
  ["GET /api/v1/convert?from=usd&to=egp&amount=100", "تحويل بين أي عملتين (egp مسموح في الطرفين)."],
  ["GET /api/v1/gold", "جرام الذهب عيار ٢٤ و٢١ و١٨ و١٤، والجنيه الذهب ونصفه والأوقية."],
  ["GET /api/v1/gold/21?days=90", "تاريخ منتج ذهب (24, 21, 18, 14, pound, half-pound, ounce)."],
  ["GET /api/v1/silver", "سعر جرام الفضة ٩٩٩ و٩٢٥."],
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
{`curl "https://YOUR-DOMAIN/api/v1/convert?from=usd&to=egp&amount=100"

{
  "date": "2026-11-13",
  "from": "USD",
  "to": "EGP",
  "amount": 100,
  "rate": 53.4356,
  "result": 5343.56
}`}
      </pre>
    </main>
  );
}
