"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/client";

export type Option = { code: string; name: string; perOne: number };

const parse = (s: string, digits: string) =>
  Number(s.replace(new RegExp(`[${digits}]`, "g"), (d) => String(digits.indexOf(d))).replace(/[٫,]/g, "."));

/** Convert between any two currencies. `perOne` is EGP per 1 unit of that currency (EGP itself = 1). */
export function MultiConverter({ options, initialFrom = "usd", initialTo = "egp" }: { options: Option[]; initialFrom?: string; initialTo?: string }) {
  const { t, f } = useI18n();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const get = (c: string) => options.find((o) => o.code === c)!;
  const n = parse(amount, f.digits);
  const out = Number.isFinite(n) ? (n * get(from).perOne) / get(to).perOne : 0;
  const select = "min-h-12 w-full rounded-md border border-line bg-paper-2 px-3 text-lg text-ink";

  return (
    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
      <label className="grid gap-1 text-sm text-mute">
        {t("c.conv.amount")}
        <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="min-h-12 rounded-md border border-line bg-paper-2 px-3 text-lg text-ink" />
      </label>
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <label className="grid gap-1 text-sm text-mute">
          {t("c.conv.from")}
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={select}>
            {options.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
        </label>
        <button
          type="button"
          onClick={() => { setFrom(to); setTo(from); }}
          aria-label={t("c.conv.swap")}
          className="min-h-12 min-w-12 rounded-full border border-line text-xl hover:bg-paper-2"
        >⇄</button>
        <label className="grid gap-1 text-sm text-mute">
          {t("c.conv.to")}
          <select value={to} onChange={(e) => setTo(e.target.value)} className={select}>
            {options.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
        </label>
      </div>
      <output className="font-display text-4xl font-bold" aria-live="polite">
        {f.fmtNum(out, 4)} <span className="font-sans text-lg font-normal text-mute">{get(to).name}</span>
      </output>
    </form>
  );
}
