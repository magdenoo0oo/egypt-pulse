"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/client";

const parse = (s: string, digits: string) =>
  Number(s.replace(new RegExp(`[${digits}]`, "g"), (d) => String(digits.indexOf(d))).replace(/[٫,]/g, "."));

export function Converter({ rate, short }: { rate: number; short: string }) {
  const { t, f } = useI18n();
  const [amount, setAmount] = useState("100");
  const [toEgp, setToEgp] = useState(true);
  const n = parse(amount, f.digits);
  const out = Number.isFinite(n) ? (toEgp ? n * rate : n / rate) : 0;
  return (
    <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("c.conv.dirAria")}>
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={toEgp === v}
            onClick={() => setToEgp(v)}
            className="min-h-11 rounded-full border border-line px-4 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {t(v ? "c.conv.toEgp" : "c.conv.fromEgp", { x: short })}
          </button>
        ))}
      </div>
      <label className="grid gap-1 text-sm text-mute">
        {t("c.conv.amount")}
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-12 rounded-md border border-line bg-paper-2 px-3 text-lg text-ink"
        />
      </label>
      <output className="font-display text-3xl font-bold" aria-live="polite">
        {f.fmtNum(out)} <span className="font-sans text-lg font-normal text-mute">{toEgp ? t("c.egp") : short}</span>
      </output>
    </form>
  );
}
