import Link from "next/link";
import { Bullion } from "@/components/Bullion";
import { Faq } from "@/components/Faq";
import { Heatmap } from "@/components/Heatmap";
import { IndexChart } from "@/components/IndexChart";
import { MultiConverter } from "@/components/MultiConverter";
import { TimeHero } from "@/components/TimeHero";
import { Panel } from "@/components/Panel";
import { tone } from "@/components/RateList";
import { Section } from "@/components/Section";
import { GUIDES } from "@/content/guides";
import { indexed, marketReport, movers } from "@/lib/insights";
import { CODES, CURRENCIES, change, getRows, goldPrice, unitOf } from "@/lib/rates";
import { fmt, fmtInt, fmtPct } from "@/lib/format";

const FAQ = [
  { q: "هل الأسعار دي هي اللي هتشتري بيها من البنك؟", a: "لا. دي أسعار مرجعية (mid-market) من السوق العالمي. البنوك ومكاتب الصرافة بتبيع بسعر وتشتري بسعر، والفرق بينهم بيتغيّر من مكان لمكان." },
  { q: "كل قد إيه بتتحدّث الأسعار؟", a: "مرة كل يوم. المصدر أحيانًا بيتأخر يوم، وفي الحالة دي بنسجّل آخر يوم متاح ونوضّح تاريخه في الصفحة." },
  { q: "إزاي بيتحسب سعر الذهب؟", a: "من سعر أوقية الذهب العالمية بالدولار × سعر الدولار بالجنيه ÷ ٣١٫١ جرام. عيار ٢١ هو ٢١ ÷ ٢٤ من عيار ٢٤. من غير مصنعية أو دمغة أو هامش صايغ." },
  { q: "ينفع أستخدم الداتا في تطبيقي؟", a: "أيوه. فيه API مفتوح بدون مفتاح ولا تسجيل، والتفاصيل في صفحة المطوّرين." },
];

export default async function Home() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const mv = movers(rows, 30);
  const options = [
    { code: "egp", name: "الجنيه المصري", perOne: 1 },
    ...CODES.map((c) => ({ code: c, name: CURRENCIES[c].name, perOne: last[c] / unitOf(c) })),
  ];
  const lines = [
    { key: "usd", name: "الدولار", tone: "note" as const, data: indexed(rows, "usd") },
    { key: "eur", name: "اليورو", tone: "down" as const, data: indexed(rows, "eur") },
    { key: "sar", name: "الريال السعودي", tone: "ink" as const, data: indexed(rows, "sar") },
    { key: "gold24", name: "الذهب عيار ٢٤", tone: "gold" as const, data: indexed(rows, "gold24") },
    { key: "silver", name: "الفضة", tone: "mute" as const, data: indexed(rows, "silver") },
  ];
  const pts = (f: (r: (typeof rows)[number]) => number) => rows.map((r) => ({ date: r.date, v: f(r) }));
  const assets = [
    { key: "usd", label: "الدولار", unit: "جنيه لكل دولار أمريكي", href: "/currency/usd", data: pts((r) => r.usd) },
    { key: "eur", label: "اليورو", unit: "جنيه لكل يورو", href: "/currency/eur", data: pts((r) => r.eur) },
    { key: "sar", label: "الريال", unit: "جنيه لكل ريال سعودي", href: "/currency/sar", data: pts((r) => r.sar) },
    { key: "gold21", label: "ذهب ٢١", unit: "جنيه لجرام الذهب عيار ٢١", href: "/gold/21", data: pts((r) => goldPrice(r.gold24, "21")) },
  ];
  const report = marketReport(rows);
  const g21 = goldPrice(last.gold24, "21");
  const gch = change(rows, "gold24", 30);

  return (
    <main>
      <div className="mx-auto mt-5 max-w-page px-4 sm:px-6 xl:px-12">
        <TimeHero assets={assets} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Panel vault title="الذهب" id="home-gold" aside="جرام عيار ٢١">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-5xl font-bold leading-none text-gold">{fmtInt(g21)}</p>
                <p className={`mt-2 ${tone(gch.pct)}`}>{fmtPct(gch.pct)} آخر ٣٠ يوم</p>
              </div>
              <Bullion className="w-24 text-ink" />
            </div>
            <Link href="/gold" className="mt-4 inline-flex min-h-11 items-center text-note underline">كل العيارات والحاسبة</Link>
          </Panel>
          <Panel vault title="الفضة" id="home-silver" aside="جرام ٩٩٩">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-5xl font-bold leading-none">{fmt(last.silver)}</p>
                <p className={`mt-2 ${tone(change(rows, "silver", 30).pct)}`}>{fmtPct(change(rows, "silver", 30).pct)} آخر ٣٠ يوم</p>
              </div>
              <Bullion tone="silver" className="w-24 text-ink" />
            </div>
            <Link href="/silver" className="mt-4 inline-flex min-h-11 items-center text-note underline">تفاصيل الفضة</Link>
          </Panel>
          {[
            ["الأكتر ارتفاعًا", mv.slice(0, 4), "home-up"],
            ["الأكتر انخفاضًا", mv.slice(-4).reverse(), "home-down"],
          ].map(([title, list, id]) => (
            <Panel key={id as string} title={title as string} id={id as string} aside="٣٠ يوم">
              <ul className="divide-y divide-line">
                {(list as typeof mv).map((m) => (
                  <li key={m.key}>
                    <Link href={m.href} className="flex min-h-11 items-center justify-between hover:bg-paper-3">
                      <span>{m.name}</span>
                      <span className={tone(m.pct)}>{fmtPct(m.pct)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>

      <Section
        vault
        id="map"
        title="خريطة السوق"
        lead="كل العملات والمعادن في شاشة واحدة، ملوّنة بحركتها آخر ٣٠ يوم. الدافي يعني السعر زاد (الجنيه بيشتري أقل)، والأخضر يعني نزل."
      >
        <Heatmap rows={rows} />
      </Section>

      <Section id="compare" title="مين اتحرك أكتر خلال سنة" lead="كل الأصول متحوّلة لنفس نقطة البداية (١٠٠)، علشان تقارن بينهم على نفس المقياس.">
        <Panel>
          <IndexChart lines={lines} label="مقارنة أداء الدولار واليورو والريال والذهب والفضة مقابل الجنيه خلال سنة" />
        </Panel>
      </Section>

      <Section id="report" title="تقرير السوق" lead="مكتوب أوتوماتيك من أرقام اليوم، من غير رأي ولا توقعات.">
        <div className="grid gap-10 lg:grid-cols-[1fr_26rem]">
          <div className="font-serif text-xl leading-[2] lg:columns-2 lg:gap-12">
            {report.map((p) => <p key={p} className="mb-4 break-inside-avoid">{p}</p>)}
          </div>
          <Panel title="حوّل بسرعة" id="home-conv" vault>
            <MultiConverter options={options} />
          </Panel>
        </div>
      </Section>

      <Section id="guides" title="أدلة بتفيدك قبل ما تشتري أو تحوّل" lead="شرح مبسّط للذهب والعملات بدون مصطلحات معقدة." aside={<Link href="/guides" className="inline-flex min-h-11 items-center text-note underline">كل الأدلة</Link>}>
        <ul className="grid border-t border-line lg:grid-cols-2 lg:gap-x-14">
          {GUIDES.slice(0, 4).map((g) => (
            <li key={g.slug} className="border-b border-line">
              <Link href={`/guides/${g.slug}`} className="grid gap-1 py-5 hover:bg-paper-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8 sm:px-3">
                <span>
                  <span className="block font-display text-2xl font-bold">{g.title}</span>
                  <span className="mt-1 block max-w-[62ch] text-mute">{g.summary}</span>
                </span>
                <span className="text-sm text-mute">{g.minutes} دقايق قراءة</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="api" title="الداتا دي متاحة كـ API" lead="JSON جاهز لأي تطبيق أو بوت أو شيت. من غير مفتاح ومن غير تسجيل.">
        <div className="vault grid gap-6 rounded-[10px] border border-line p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <ul className="grid gap-2">
            <li>{CODES.length} عملة والذهب والفضة</li>
            <li>تاريخ لمدة سنة كاملة</li>
            <li>تحويل بين أي عملتين بطلب واحد</li>
            <li><Link href="/developers" className="mt-2 inline-flex min-h-11 items-center text-note underline">اقرا التوثيق</Link></li>
          </ul>
          <pre dir="ltr" className="overflow-x-auto rounded-md border border-line bg-paper-2 p-4 text-sm leading-7">
{`curl "/api/v1/convert?from=usd&to=egp&amount=100"

{ "from": "USD", "to": "EGP",
  "rate": ${last.usd}, "result": ${(last.usd * 100).toFixed(2)} }`}
          </pre>
        </div>
      </Section>

      <Section id="faq" title="أسئلة شائعة" lead={`آخر سعر للدولار عندنا ${fmt(last.usd)} جنيه.`}>
        <div><Faq items={FAQ} /></div>
      </Section>
    </main>
  );
}
