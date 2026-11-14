import type { Metadata } from "next";
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
    <main className="mx-auto max-w-3xl px-4">
      <h1 className="font-display text-4xl font-bold">المنهجية والمصادر</h1>
      <div className="mt-8 grid max-w-[62ch] gap-8 text-lg leading-8">
        <section aria-labelledby="src">
          <h2 id="src" className="text-xl font-semibold">مصدر الأسعار</h2>
          <p className="mt-2 text-mute">
            بنسحب كل يوم أسعار الصرف من مجموعة بيانات مفتوحة (fawazahmed0/currency-api)، وبنسجلها في ملف في المستودع على GitHub.
            آخر يوم متاح عندنا: {fmtDate(meta.latestDate)}. الـ commits اليومية بتتعمل أوتوماتيك، وده معلن في الـ README.
          </p>
        </section>
        <section aria-labelledby="mid">
          <h2 id="mid" className="text-xl font-semibold">سعر مرجعي، مش سعر بنك</h2>
          <p className="mt-2 text-mute">
            الأسعار هنا mid-market، يعني منتصف سعر الشراء والبيع في السوق العالمي. البنوك ومكاتب الصرافة بتبيع وتشتري بسعر مختلف، والفرق في مصر ممكن يبقى كبير.
            استخدمها للمتابعة والمقارنة والاتجاه، مش لحساب ما هتدفعه فعلًا.
          </p>
        </section>
        <section aria-labelledby="gold">
          <h2 id="gold" className="text-xl font-semibold">الذهب والفضة</h2>
          <p className="mt-2 text-mute">
            جرام الذهب عيار ٢٤ = (سعر الدولار بالجنيه ÷ سعر الأوقية بالدولار) ÷ ٣١٫١٠٣٤٧٦٨ جرام. باقي العيارات نسبة من عيار ٢٤:
            عيار ٢١ = ٢١÷٢٤، عيار ١٨ = ١٨÷٢٤، عيار ١٤ = ١٤÷٢٤. الجنيه الذهب ٨ جرام عيار ٢١، ونصفه ٤ جرام. الفضة بنفس الطريقة من سعر أوقية الفضة.
            مفيش هنا مصنعية ولا دمغة ولا هامش صاغة، وفي حاسبة الذهب ممكن تدخل نسبة مصنعية تقديرية بنفسك.
          </p>
        </section>
        <section aria-labelledby="units">
          <h2 id="units" className="text-xl font-semibold">وحدات التسعير</h2>
          <p className="mt-2 text-mute">كل سعر بالجنيه لكل وحدة واحدة من العملة، ما عدا الين الياباني والروبية الهندية فهما لكل ١٠٠ وحدة، زي ما بتتسعّر في الصرافة.</p>
        </section>
        <section aria-labelledby="gaps">
          <h2 id="gaps" className="text-xl font-semibold">الفجوات</h2>
          <p className="mt-2 text-mute">
            أحيانًا المصدر بيتأخر يوم. في الحالة دي بنسجّل آخر يوم متاح بدل ما نخمّن، وممكن يوم يتفوّت من التاريخ. التغيّر اليومي بيتحسب مقابل آخر سجل قبله.
          </p>
        </section>
        <p className="text-sm text-mute">
          مش نصيحة مالية. لو لقيت رقم غلط، افتح issue على <a className="text-note underline" href="https://github.com/magdenoo0oo/egypt-pulse/issues">GitHub</a>.
        </p>
      </div>
    </main>
  );
}
