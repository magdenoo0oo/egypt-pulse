import Link from "next/link";
import { Guilloche } from "@/components/Guilloche";
import { Sparkline } from "@/components/Sparkline";
import { CURRENCIES, change, getRows, karats, range, series, type Code } from "@/lib/rates";
import { fmt, fmtDate, fmtInt, fmtPct, fmtSigned } from "@/lib/format";

const tone = (n: number) => (n > 0 ? "text-down" : n < 0 ? "text-up" : "text-mute");
// For a household, a rising foreign currency means the pound buys less, so up is shown as the warning tone.

export default async function Home() {
  const rows = await getRows();
  const last = rows.at(-1)!;
  const usd = change(rows, "usd");
  const usd30 = range(rows, "usd");
  const k = karats(last.gold24);
  const others: Code[] = ["eur", "sar", "gbp"];

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
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {others.map((c) => {
            const ch = change(rows, c, 30);
            return (
              <li key={c}>
                <Link
                  href={`/currency/${c}`}
                  className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3 hover:bg-paper-2 sm:grid-cols-[1.4fr_1fr_auto_6rem] sm:px-3"
                >
                  <span className="text-lg">{CURRENCIES[c].name}</span>
                  <span className="font-display text-2xl font-bold">{fmt(last[c])}</span>
                  <Sparkline values={series(rows, c, 30)} className={`hidden sm:block ${tone(ch.abs)}`} />
                  <span className={`hidden text-end text-sm sm:block ${tone(ch.abs)}`}>{fmtPct(ch.pct)} / ٣٠ يوم</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="gold">
        <h2 id="gold" className="font-display text-2xl font-bold">الذهب</h2>
        <p className="mt-1 text-mute">سعر الجرام بالجنيه، محسوب من السعر العالمي.</p>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            ["عيار ٢٤", k.k24],
            ["عيار ٢١", k.k21],
            ["عيار ١٨", k.k18],
            ["الجنيه الذهب", k.pound],
          ].map(([name, v]) => (
            <div key={name as string} className="bg-paper p-5">
              <dt className="text-mute">{name}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-gold">{fmtInt(v as number)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
