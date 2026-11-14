"use client";
import { useState } from "react";

const parse = (s: string) => Number(s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace("٫", "."));
const f = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });

/** Spot value of a piece of gold. Making charge is the user's own estimate; the site never invents one. */
export function GoldCalculator({ gold24 }: { gold24: number }) {
  const [grams, setGrams] = useState("10");
  const [karat, setKarat] = useState("21");
  const [making, setMaking] = useState("0");
  const w = parse(grams), m = parse(making);
  const spot = Number.isFinite(w) ? w * gold24 * (Number(karat) / 24) : 0;
  const total = spot * (1 + (Number.isFinite(m) ? m : 0) / 100);
  const input = "min-h-12 rounded-md border border-line bg-paper px-3 text-lg text-ink";
  return (
    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm text-mute">
          الوزن بالجرام
          <input inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} className={input} />
        </label>
        <label className="grid gap-1 text-sm text-mute">
          العيار
          <select value={karat} onChange={(e) => setKarat(e.target.value)} className={input}>
            {[24, 21, 18, 14].map((k) => <option key={k} value={k}>عيار {f.format(k)}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-mute">
          مصنعية تقديرية ٪
          <input inputMode="decimal" value={making} onChange={(e) => setMaking(e.target.value)} className={input} />
        </label>
      </div>
      <output className="grid gap-1" aria-live="polite">
        <span className="text-sm text-mute">قيمة الذهب بالسعر العالمي</span>
        <span className="font-display text-4xl font-bold text-gold">{f.format(spot)} <span className="font-sans text-lg font-normal text-mute">جنيه</span></span>
        {Number(m) > 0 && (
          <span className="text-mute">مع المصنعية التقديرية: {f.format(total)} جنيه</span>
        )}
      </output>
    </form>
  );
}
