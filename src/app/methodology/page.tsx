import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { Prose } from "@/components/Prose";
import { CODES } from "@/lib/currencies";
import { getMeta } from "@/lib/rates";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "المنهجية والمصادر: إزاي بنحسب الأسعار",
  description: "مصدر الأسعار في تسعيرة، إزاي بنحسب الذهب والفضة، وإيه الفرق بين السعر المرجعي وسعر البنك والصاغة.",
  alternates: { canonical: "/methodology" },
};

export default async function Methodology() {
  const meta = await getMeta();
  return (
    <main>
      <PageHead crumbs={[{ label: "المنهجية" }]} title="المنهجية والمصادر" lead="من أين بتيجي الأرقام، وإزاي بتتحسب، وإيه حدودها." />
      <div className="mx-auto mt-8 grid max-w-page gap-10 px-4 sm:px-6 xl:px-12 lg:grid-cols-[minmax(0,46rem)_22rem] lg:justify-between">
        <Prose
          blocks={[
            { type: "h", text: "مصدر الأسعار" },
            { type: "p", text: `بنسحب كل يوم أسعار الصرف من مجموعة بيانات مفتوحة (fawazahmed0/currency-api)، وبنسجلها في ملف في المستودع على GitHub. آخر يوم متاح عندنا: ${fmtDate(meta.latestDate)}. الـ commits اليومية بتتعمل أوتوماتيك، وده معلن في الـ README.` },
            { type: "h", text: "سعر مرجعي، مش سعر بنك" },
            { type: "p", text: "الأسعار هنا mid-market، يعني منتصف سعر الشراء والبيع في السوق العالمي. البنوك ومكاتب الصرافة بتبيع وتشتري بسعر مختلف، والفرق في مصر ممكن يبقى كبير. استخدمها للمتابعة والمقارنة والاتجاه، مش لحساب ما هتدفعه فعلًا." },
            { type: "h", text: "الذهب والفضة" },
            { type: "p", text: "جرام الذهب عيار ٢٤ = (سعر الدولار بالجنيه ÷ سعر الأوقية بالدولار) ÷ ٣١٫١٠٣٤٧٦٨ جرام. باقي العيارات نسبة من عيار ٢٤: عيار ٢١ = ٢١÷٢٤، عيار ١٨ = ١٨÷٢٤، عيار ١٤ = ١٤÷٢٤. الجنيه الذهب ٨ جرام عيار ٢١، ونصفه ٤ جرام. الفضة بنفس الطريقة من سعر أوقية الفضة." },
            { type: "p", text: "مفيش هنا مصنعية ولا دمغة ولا هامش صاغة. في حاسبة الذهب ممكن تدخل نسبة مصنعية تقديرية بنفسك." },
            { type: "h", text: "وحدات التسعير" },
            { type: "p", text: "كل سعر بالجنيه لكل وحدة واحدة من العملة، ما عدا الين الياباني والروبية الهندية فهما لكل ١٠٠ وحدة، زي ما بتتسعّر في الصرافة." },
            { type: "h", text: "الفجوات" },
            { type: "p", text: "أحيانًا المصدر بيتأخر يوم. في الحالة دي بنسجّل آخر يوم متاح بدل ما نخمّن، وممكن يوم يتفوّت من التاريخ. التغيّر اليومي بيتحسب مقابل آخر سجل قبله." },
            { type: "h", text: "التقارير والتحليلات" },
            { type: "p", text: "النصوص اللي بعنوان «قراءة سريعة» و«تقرير السوق» بتتكتب أوتوماتيك من الأرقام المسجّلة بقوالب ثابتة. مفيش توقعات ولا آراء فيها. التذبذب اليومي هو الانحراف المعياري للتغيّر اليومي بالنسبة المئوية آخر ٣٠ يوم." },
            { type: "h", text: "الرسوم" },
            { type: "p", text: "الرسوم التفاعلية بتستخدم مكتبة TradingView Lightweight Charts™ المفتوحة. باقي الرسوم (الحركة اليومية، نطاق السنة) بتتولّد من البيانات نفسها." },
            { type: "note", text: "مش نصيحة مالية. لو لقيت رقم غلط، افتح issue على GitHub في مستودع المشروع." },
          ]}
        />
        <aside className="h-fit lg:sticky lg:top-6">
          <Panel vault title="الأرقام في سطور" id="facts">
            <dl className="grid gap-4">
              <div><dt className="text-sm text-mute">آخر يوم متاح</dt><dd className="font-display text-2xl font-bold">{fmtDate(meta.latestDate)}</dd></div>
              <div><dt className="text-sm text-mute">أيام التاريخ المسجّلة</dt><dd className="font-display text-2xl font-bold">{meta.days}</dd></div>
              <div><dt className="text-sm text-mute">العملات</dt><dd className="font-display text-2xl font-bold">{CODES.length}</dd></div>
              <div><dt className="text-sm text-mute">التحديث</dt><dd className="text-lg">مرة كل يوم</dd></div>
            </dl>
          </Panel>
        </aside>
      </div>
    </main>
  );
}
