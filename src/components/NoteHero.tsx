import Link from "next/link";
import { AreaSpark } from "@/components/AreaSpark";
import { Guilloche } from "@/components/Guilloche";
import { RangeBar } from "@/components/RangeBar";
import { change, range, series, type Row } from "@/lib/rates";
import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/format";

const ar = new Intl.NumberFormat("ar-EG", { useGrouping: false });

/**
 * The one memorable element: the dollar rate drawn as a banknote.
 * Corner denominations, guilloche rosette, a gold security thread and a serial number are all decoration;
 * the real content is the label, the rate, the change and the 30-day range.
 */
export function NoteHero({ rows }: { rows: Row[] }) {
  const last = rows.at(-1)!;
  const d1 = change(rows, "usd");
  const r = range(rows, "usd", 30);
  const tone = d1.abs > 0 ? "text-down" : d1.abs < 0 ? "text-up" : "text-mute";
  const den = ar.format(Math.round(last.usd));
  const serial = last.date.replaceAll("-", "");
  const corner = "absolute font-display text-3xl font-bold text-note/70";
  return (
    <section aria-labelledby="hero" className="note-frame relative isolate overflow-hidden bg-paper-2">
      <Guilloche className="!text-note opacity-45" />
      <span aria-hidden className={`${corner} start-7 top-6`}>{den}</span>
      <span aria-hidden className={`${corner} end-7 top-6`}>{den}</span>
      <span aria-hidden className={`${corner} start-7 bottom-6`}>{den}</span>
      <span aria-hidden className={`${corner} end-7 bottom-6`}>{den}</span>
      <div aria-hidden className="absolute inset-y-[9px] start-[20%] hidden w-5 overflow-hidden bg-gold/60 sm:block">
        <p className="whitespace-nowrap py-2 text-[10px] leading-5 tracking-widest text-paper [writing-mode:vertical-rl]">
          {"تسعيرة ◆ EGP ◆ ".repeat(14)}
        </p>
      </div>
      <div className="relative px-6 pb-20 pt-24 sm:px-16 sm:pb-24 sm:pt-20 md:ps-[28%]">
        <h1 id="hero" className="text-lg font-normal text-mute">أسعار اليوم: الدولار الأمريكي مقابل الجنيه المصري، {fmtDate(last.date)}</h1>
        <p className="mt-1 font-display text-[clamp(5.5rem,16vw,12rem)] font-bold leading-[0.9] tracking-tight">{fmt(last.usd)}</p>
        <p className="mt-4 text-xl">
          <span className={tone}>{fmtSigned(d1.abs)} ({fmtPct(d1.pct)})</span> عن آخر يوم قبله
        </p>
        <div className="mt-8 grid max-w-xl gap-6 sm:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-1 text-sm text-mute">مكانه في آخر ٣٠ يوم</p>
            <RangeBar min={r.min} max={r.max} value={last.usd} lo={fmt(r.min)} hi={fmt(r.max)} label="موقع الدولار في نطاق ٣٠ يوم" />
          </div>
          <div className="text-note">
            <p className="mb-1 text-sm text-mute">آخر ٩٠ يوم</p>
            <AreaSpark values={series(rows, "usd", 90)} />
          </div>
        </div>
        <Link href="/currency/usd" className="mt-8 inline-flex min-h-12 items-center rounded-md bg-ink px-6 text-paper hover:opacity-90">
          تاريخ الدولار والتحليل
        </Link>
      </div>
      <p aria-hidden className="absolute bottom-6 start-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-note/70 rtl:translate-x-1/2">
        ت ع {serial} ٠٩٠
      </p>
    </section>
  );
}
