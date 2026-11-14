"use client";
import { useState } from "react";

export function Converter({ rate, short }: { rate: number; short: string }) {
  const [amount, setAmount] = useState("100");
  const [toEgp, setToEgp] = useState(true);
  const n = Number(amount.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))));
  const out = Number.isFinite(n) ? (toEgp ? n * rate : n / rate) : 0;
  const f = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });
  return (
    <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
      <div className="flex gap-2" role="group" aria-label="اتجاه التحويل">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={toEgp === v}
            onClick={() => setToEgp(v)}
            className="min-h-11 rounded-full border border-line px-4 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {v ? `${short} إلى جنيه` : `جنيه إلى ${short}`}
          </button>
        ))}
      </div>
      <label className="grid gap-1 text-sm text-mute">
        المبلغ
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-12 rounded-md border border-line bg-paper-2 px-3 text-lg text-ink"
        />
      </label>
      <output className="font-display text-3xl font-bold" aria-live="polite">
        {f.format(out)} <span className="font-sans text-lg font-normal text-mute">{toEgp ? "جنيه" : short}</span>
      </output>
    </form>
  );
}
