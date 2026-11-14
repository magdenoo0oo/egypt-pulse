import Link from "next/link";
import { CODES, CURRENCIES, GOLD, GOLD_TYPES } from "@/lib/currencies";
import { GUIDES } from "@/content/guides";
import { getMeta } from "@/lib/rates";
import { fmtDateTime } from "@/lib/format";

const link = "inline-flex min-h-9 items-center hover:underline";

export async function Footer() {
  const m = await getMeta();
  return (
    <footer className="vault mt-16">
      <div aria-hidden className="engrave h-3 border-b border-line" />
      <div className="mx-auto grid max-w-page gap-10 px-4 py-10 sm:px-6 xl:px-12 md:grid-cols-[1.3fr_1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-bold">تسعيرة</p>
          <p className="mt-3 max-w-[38ch] text-mute">
            أسعار العملات والذهب والفضة مقابل الجنيه المصري، بتاريخ سنة كاملة وأدوات تحويل وAPI مفتوح.
          </p>
          <p className="mt-4 max-w-[38ch] text-sm text-mute">
            الأسعار مرجعية (mid-market) من السوق العالمي، مش أسعار البنوك أو الصاغة. المصنعية والهامش بيزيدوا على الأرقام دي.
          </p>
        </div>
        <nav aria-label="العملات">
          <h2 className="font-display text-xl font-bold">العملات</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4">
            {CODES.map((c) => (
              <li key={c}><Link href={`/currency/${c}`} className={link}>{CURRENCIES[c].name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="الذهب والأدوات">
          <h2 className="font-display text-xl font-bold">الذهب والفضة</h2>
          <ul className="mt-3">
            {GOLD_TYPES.map((t) => (
              <li key={t}><Link href={`/gold/${t}`} className={link}>{GOLD[t].name}</Link></li>
            ))}
            <li><Link href="/silver" className={link}>الفضة</Link></li>
          </ul>
          <h2 className="mt-6 font-display text-xl font-bold">أدوات</h2>
          <ul className="mt-3">
            <li><Link href="/convert" className={link}>محوّل العملات</Link></li>
            <li><Link href="/movers" className={link}>الحركة</Link></li>
            <li><Link href="/developers" className={link}>API مفتوح</Link></li>
          </ul>
        </nav>
        <nav aria-label="المعرفة">
          <h2 className="font-display text-xl font-bold">أدلة</h2>
          <ul className="mt-3">
            {GUIDES.map((g) => (
              <li key={g.slug}><Link href={`/guides/${g.slug}`} className={link}>{g.title}</Link></li>
            ))}
            <li><Link href="/glossary" className={link}>قاموس المصطلحات</Link></li>
            <li><Link href="/methodology" className={link}>المنهجية والمصادر</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm text-mute sm:px-6 xl:px-12">
          <p>آخر فحص للبيانات: {fmtDateTime(m.checkedAt)}. البيانات بتتحدّث وتتسجّل أوتوماتيك كل يوم، والـ commits على GitHub من الأتمتة.</p>
          <p>
            الرسوم التفاعلية:{" "}
            <a href="https://www.tradingview.com/" className="underline" rel="noopener">TradingView Lightweight Charts™</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
