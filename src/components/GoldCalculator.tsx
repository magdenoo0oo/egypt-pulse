"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/client";

const parse = (s: string, digits: string) =>
  Number(s.replace(new RegExp(`[${digits}]`, "g"), (d) => String(digits.indexOf(d))).replace(/[٫,]/g, "."));

/** Spot value of a piece of gold. Making charge is the user's own estimate; the site never invents one. */
export function GoldCalculator({ gold24 }: { gold24: number }) {
  const { t, f } = useI18n();
  const [grams, setGrams] = useState("10");
  const [karat, setKarat] = useState("21");
  const [making, setMaking] = useState("0");
  const w = parse(grams, f.digits), m = parse(making, f.digits);
  const spot = Number.isFinite(w) ? w * gold24 * (Number(karat) / 24) : 0;
  const total = spot * (1 + (Number.isFinite(m) ? m : 0) / 100);
  const input = "min-h-12 rounded-md border border-line bg-paper px-3 text-lg text-ink";
  return (
    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm text-mute">
          {t("c.gold.weight")}
          <input inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} className={input} />
        </label>
        <label className="grid gap-1 text-sm text-mute">
          {t("c.gold.karat")}
          <select value={karat} onChange={(e) => setKarat(e.target.value)} className={input}>
            {[24, 21, 18, 14].map((k) => <option key={k} value={k}>{t("c.gold.karatN", { n: f.fmtInt(k) })}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-mute">
          {t("c.gold.making")}
          <input inputMode="decimal" value={making} onChange={(e) => setMaking(e.target.value)} className={input} />
        </label>
      </div>
      <output className="grid gap-1" aria-live="polite">
        <span className="text-sm text-mute">{t("c.gold.spot")}</span>
        <span className="font-display text-4xl font-bold text-gold">{f.fmtNum(spot)} <span className="font-sans text-lg font-normal text-mute">{t("c.egp")}</span></span>
        {Number(m) > 0 && <span className="text-mute">{t("c.gold.withMaking", { v: f.fmtNum(total), egp: t("c.egp") })}</span>}
      </output>
    </form>
  );
}
