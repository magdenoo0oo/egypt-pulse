import Link from "next/link";
import { Guilloche } from "@/components/Guilloche";
import { RateList, tone } from "@/components/RateList";
import { CODES, change, getRows, karats, range, type Code } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct, fmtSigned } from "@/lib/format";

export default async function Home() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const usd = change(rows, "usd");
  const usd30 = range(rows, "usd");
  const k = karats(last.gold24);
  const others: Code[] = ["eur", "gbp", "sar", "aed", "kwd", "qar"];

  return (
    <main className="mx-auto max-w-5xl px-4">
      <section className="relative overflow-hidden rounded-[28px] border border-line bg-paper-2 px-6 py-12 sm:px-12 sm:py-16">
        <Guilloche />
        <div className="relative">
          <p className="text-mute">الدولار الأمريكي مقابل الجنيه · {fmtDate(last.date)}</p>
          <h1 className="mt-2 font-display text-[clamp(4.5rem,18vw,10rem)] font-bold leading-none tracking-tight">
            {fmt(last.usd)}
          </h1>
          <p className="mt-4 text-lg">
            <span className={tone(usd.abs)}>
              {fmtSigned(usd.abs)} ({fmtPct(usd.pct)})
            </span>{" "}
            عن اليوم السابق
          </p>
          <p className="mt-1 text-sm text-mute">
            في آخر ٣٠ يوم: من {fmt(usd30.min)} إلى {fmt(usd30.max)}
          </p>
          <Link
            href="/currency/usd"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-paper hover:opacity-90"
          >
            شوف التاريخ والمحوّل
          </Link>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="fx">
        <h2 id="fx" className="font-display text-2xl font-bold">باقي العملات</h2>
        <div className="mt-4"><RateList rows={rows} codes={others} /></div>
        <Link href="/currencies" className="mt-4 inline-flex min-h-11 items-center text-note underline">كل العملات ({CODES.length})</Link>
      </section>

      <section className="mt-16" aria-labelledby="gold">
        <h2 id="gold" className="font-display text-2xl font-bold">الذهب</h2>
        <p className="mt-1 text-mute">سعر الجرام بالجنيه، محسوب من السعر العالمي.</p>
        <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            ["عيار ٢٤", k.k24, "24"],
            ["عيار ٢١", k.k21, "21"],
            ["عيار ١٨", k.k18, "18"],
            ["الجنيه الذهب", k.pound, "pound"],
          ].map(([name, v, t]) => (
            <li key={name as string} className="bg-paper"><Link href={`/gold/${t}`} className="block h-full p-5 hover:bg-paper-2">
              <span className="block text-mute">{name}</span>
              <span className="mt-1 block font-display text-3xl font-bold text-gold">{fmtInt(v as number)}</span>
            </Link></li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
          <Link href="/gold" className="inline-flex min-h-11 items-center text-note underline">حاسبة الذهب وكل العيارات</Link>
          <Link href="/silver" className="inline-flex min-h-11 items-center text-note underline">الفضة: {fmt(last.silver)} جنيه للجرام</Link>
        </p>
      </section>

      <section className="mt-16" aria-labelledby="tools">
        <h2 id="tools" className="font-display text-2xl font-bold">أدوات</h2>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {[
            ["/convert", "محوّل العملات", "بين أي عملتين والجنيه"],
            ["/movers", "الحركة", "مين طلع ومين نزل خلال سنة"],
            ["/developers", "API مفتوح", "نفس الداتا JSON بدون مفتاح"],
          ].map(([h, t, d]) => (
            <li key={h} className="bg-paper">
              <Link href={h} className="block min-h-11 p-5 hover:bg-paper-2">
                <span className="text-lg font-semibold">{t}</span>
                <span className="block text-mute">{d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
