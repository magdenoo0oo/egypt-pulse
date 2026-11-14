import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { CODES, GOLD_TYPES } from "@/lib/currencies";

export const metadata: Metadata = {
  title: "API مفتوح لأسعار العملات والذهب",
  description: "API مجاني بدون مفتاح لأسعار العملات والذهب والفضة مقابل الجنيه المصري، مع التاريخ والتحويل.",
  alternates: { canonical: "/developers" },
};

const endpoints = [
  ["GET /api/v1/currencies", "قايمة العملات المتاحة ووحدة التسعير."],
  ["GET /api/v1/rates", "آخر سعر لكل العملات، وتغيّر اليوم وتغيّر ٣٠ يوم."],
  ["GET /api/v1/rates/usd?days=30", "تاريخ عملة معيّنة، من يوم لـ ٣٦٥ يوم."],
  ["GET /api/v1/convert?from=usd&to=egp&amount=100", "تحويل بين أي عملتين (egp مسموح في الطرفين)."],
  ["GET /api/v1/gold", "جرام الذهب عيار ٢٤ و٢١ و١٨ و١٤، والجنيه الذهب ونصفه والأوقية."],
  ["GET /api/v1/gold/21?days=90", `تاريخ منتج ذهب (${GOLD_TYPES.join(", ")}).`],
  ["GET /api/v1/silver", "سعر جرام الفضة ٩٩٩ و٩٢٥."],
];

export default function Developers() {
  return (
    <main>
      <PageHead crumbs={[{ label: "API" }]} title="API مفتوح" lead="نفس البيانات اللي في الموقع، JSON جاهز لأي تطبيق أو بوت. من غير مفتاح ومن غير تسجيل." />
      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="المسارات" id="ep">
          <ul className="divide-y divide-line">
            {endpoints.map(([path, desc]) => (
              <li key={path} className="py-4">
                <code dir="ltr" className="block overflow-x-auto text-start font-mono text-base text-note">{path}</code>
                <p className="mt-1 text-mute">{desc}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="grid min-w-0 content-start gap-4">
          <Panel vault title="مثال" id="ex">
            <pre dir="ltr" className="overflow-x-auto text-sm leading-7">
{`curl "https://YOUR-DOMAIN/api/v1/convert?from=usd&to=egp&amount=100"

{
  "from": "USD",
  "to": "EGP",
  "amount": 100,
  "rate": 53.4356,
  "result": 5343.56
}`}
            </pre>
          </Panel>
          <Panel title="الرموز المتاحة" id="codes">
            <p dir="ltr" className="text-start font-mono text-sm leading-7">egp, {CODES.join(", ")}</p>
            <p className="mt-3 text-sm text-mute">المدخلات الغلط بترجع 400، والرموز غير المعروفة 404. الأسعار مرجعية مش أسعار بنوك.</p>
          </Panel>
        </div>
      </div>
    </main>
  );
}
