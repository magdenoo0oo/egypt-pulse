"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";

export type Pt = { date: string; v: number };
export type Asset = { key: string; label: string; unit: string; href: string; data: Pt[] };

/** One rolling digit: a column of 0-9 that slides, like a split-flap board. */
function Drum({ d, digits }: { d: number; digits: string }) {
  return (
    <span className="flap" aria-hidden>
      <span className="drum" style={{ transform: `translateY(-${d * 10}%)` }}>
        {Array.from(digits).map((c) => <span key={c} className="flap-d">{c}</span>)}
      </span>
    </span>
  );
}

/**
 * "Time machine": a split-flap rate display over a one-year ribbon. On load the cursor runs from the first day to
 * today, then the visitor drags (or uses the arrow keys on the hidden range input) to read any day.
 */
export function TimeHero({ assets }: { assets: Asset[] }) {
  const { t, f } = useI18n();
  const DIGITS = f.digits;
  const money = useMemo(() => new Intl.NumberFormat(f.tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [f.tag]);
  const fmtDay = (iso: string) => f.fmtDate(iso);
  const [ai, setAi] = useState(0);
  const a = assets[ai];
  const last = a.data.length - 1;
  const [idx, setIdx] = useState(last);
  const raf = useRef(0);

  const stop = () => cancelAnimationFrame(raf.current);

  const play = (len: number) => {
    stop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setIdx(len - 1);
    const t0 = performance.now(), dur = 2600;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setIdx(Math.round(e * (len - 1)));
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    raf.current = requestAnimationFrame(() => play(assets[0].data.length));
    return stop;
    // run the intro once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i: number) => {
    setAi(i);
    play(assets[i].data.length);
  };

  const cur = a.data[Math.min(idx, last)];
  const now = a.data[last];
  const prev = a.data[last - 1];
  const atToday = idx >= last;
  const diff = atToday ? now.v - prev.v : now.v - cur.v;
  const pct = ((atToday ? diff / prev.v : diff / cur.v) * 100);
  const chars = money.format(cur.v).split("");

  const { path, area, lo, hi, pts } = useMemo(() => {
    const vs = a.data.map((d) => d.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    const W = 1000, H = 260;
    const pts = a.data.map((d, i) => [(i / last) * W, H - 14 - ((d.v - lo) / span) * (H - 40)] as const);
    const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
    return { path, area: `${path}L${W} ${H}L0 ${H}Z`, lo, hi, pts };
  }, [a, last]);

  const xPct = (idx / last) * 100;
  const yPct = (pts[Math.min(idx, last)][1] / 260) * 100;
  const months = useMemo(() => {
    const out: { i: number; label: string }[] = [];
    let m = "";
    a.data.forEach((d, i) => {
      const k = d.date.slice(0, 7);
      if (k !== m) { m = k; if (i > 8 && i < last - 8) out.push({ i, label: f.fmtMonth(d.date) }); }
    });
    return out;
  }, [a, last, f]);

  const warm = diff > 0 ? "text-down" : diff < 0 ? "text-up" : "text-mute";

  const em = chars.reduce((t, c, i) => t + (DIGITS.includes(c) ? 0.66 : 0.4) + (i ? 0.12 : 0), 0);

  return (
    <section aria-labelledby="hero-h" className="timehero relative overflow-hidden rounded-[14px] border-2 border-ink bg-paper-2">
      <div aria-hidden className="engrave h-3 border-b-2 border-ink" />
      <div className="px-5 pb-5 pt-5 sm:px-8 xl:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 id="hero-h" className="font-display text-xl font-bold sm:text-2xl">{t("c.hero.title")}</h1>
          <div className="flex flex-wrap gap-1" role="group" aria-label={t("c.hero.pickAsset")}>
            {assets.map((x, i) => (
              <button
                key={x.key}
                type="button"
                aria-pressed={i === ai}
                onClick={() => pick(i)}
                className="min-h-11 rounded-md border border-ink px-4 hover:bg-paper-3 aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] xl:gap-x-14">
          <div className="flex min-w-0 flex-col justify-between gap-5 [container-type:inline-size]">
            <div>
              <p className="text-lg text-mute" aria-live="off">
                {t(atToday ? "c.hero.today" : "c.hero.on")} <span className="font-semibold text-ink">{fmtDay(cur.date)}</span>
              </p>
              <p
                dir="ltr"
                className="mt-2 flex items-center gap-[0.12em] font-display font-bold leading-none"
                style={{ fontSize: `min(9rem, ${(100 / em).toFixed(2)}cqw)` }}
                role="text"
                aria-label={`${a.label}: ${money.format(cur.v)} ${t("c.egp")}`}
              >
                {chars.map((c, i) => {
                  const d = DIGITS.indexOf(c);
                  return d >= 0 ? <Drum key={`${chars.length}-${i}`} d={d} digits={DIGITS} /> : <span key={`${chars.length}-${i}`} aria-hidden className="px-[0.02em] text-[0.6em] text-mute">{c}</span>;
                })}
              </p>
              <p className="mt-2 text-mute">{a.unit}</p>
            </div>
            <div className="text-xl leading-9" aria-live="polite">
              {atToday ? (
                <p>
                  <span className={`font-semibold ${warm}`}>{f.sign(diff)}{money.format(Math.abs(diff))} {t("c.egp")} ({f.fmtPct(pct)})</span> {t("c.hero.vsPrev")}
                  <span className="block text-base text-mute">{t("c.hero.dragHint")}</span>
                </p>
              ) : (
                <p>
                  {t(diff > 0 ? "c.hero.sinceUp" : "c.hero.sinceDown")} <span className={`font-semibold ${warm}`}>{money.format(Math.abs(diff))} {t("c.egp")}</span> ({f.fmtPct(pct)}).
                  <button type="button" onClick={() => { stop(); setIdx(last); }} className="mt-1 block min-h-11 text-base text-note underline">{t("c.hero.back")}</button>
                </p>
              )}
            </div>
            <Link href={a.href} className="inline-flex min-h-11 w-fit items-center text-base text-note underline">{t("c.hero.full", { name: a.label })}</Link>
          </div>

          <div className="flex min-w-0 flex-col">
            <div dir="ltr" className="relative h-[15rem] touch-pan-y select-none sm:h-[18rem] lg:min-h-[22rem] lg:flex-1">
              <svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full">
                <defs>
                  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <line x1="0" y1="0" x2="0" y2="7" stroke="var(--note)" strokeWidth="1.2" opacity="0.5" />
                  </pattern>
                  <clipPath id="after"><rect x={(idx / last) * 1000} y="0" width="1000" height="260" /></clipPath>
                </defs>
                <path d={area} fill="url(#hatch)" opacity="0.65" />
                <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                <path d={path} fill="none" stroke="var(--gold)" strokeWidth="5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" clipPath="url(#after)" />
              </svg>
              <div aria-hidden className="absolute inset-y-0 w-px bg-ink" style={{ left: `${xPct}%` }} />
              <div aria-hidden className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-gold" style={{ left: `${xPct}%`, top: `${yPct}%` }} />
              <span aria-hidden className="absolute start-1 top-1 rounded bg-paper-2 px-1 text-sm text-mute">{money.format(hi)}</span>
              <span aria-hidden className="absolute bottom-7 start-1 rounded bg-paper-2 px-1 text-sm text-mute">{money.format(lo)}</span>
              <ul aria-hidden className="absolute inset-x-0 bottom-0 h-5 text-sm text-mute">
                {months.map((m, k) => <li key={m.i} className={`absolute -translate-x-1/2 whitespace-nowrap ${k % 2 ? "hidden" : ""}`} style={{ left: `${(m.i / last) * 100}%` }}>{m.label}</li>)}
              </ul>
              <input
                type="range"
                min={0}
                max={last}
                value={Math.min(idx, last)}
                onChange={(e) => { stop(); setIdx(Number(e.target.value)); }}
                onPointerDown={stop}
                aria-label={t("c.hero.pickDay", { name: a.label })}
                aria-valuetext={`${fmtDay(cur.date)}: ${money.format(cur.v)} ${t("c.egp")}`}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
            <p className="mt-2 text-sm text-mute">{t("c.hero.goldNote")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
