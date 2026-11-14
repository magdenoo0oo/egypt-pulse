"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/i18n/client";

export type RaceAsset = { key: string; name: string; href: string; metal: boolean; v: number[] };
export type RaceLabels = {
  play: string; replay: string; pause: string; range: string; scrub: string; base: string; say: string;
  periods: { days: number; label: string }[];
};

const ROW = 2.5; // rem; rows are placed by transform, so the reorder is animated by the compositor

/**
 * Bar-chart race. Every asset is rebased to 100 on the window's first day; bars grow out of the 100 line
 * (warm = price in pounds rose, green = fell) and rows rank themselves by index. Drag the slider or press play.
 */
export function RaceChart({ dates, assets, labels }: { dates: string[]; assets: RaceAsset[]; labels: RaceLabels }) {
  const { f } = useI18n();
  const last = dates.length - 1;
  const [days, setDays] = useState(labels.periods.at(-1)!.days);
  const start = Math.max(0, last - days);
  const len = last - start; // slider max
  const [idx, setIdx] = useState(len);
  const [playing, setPlaying] = useState(false);
  const [say, setSay] = useState("");
  const raf = useRef(0);

  const stop = () => { cancelAnimationFrame(raf.current); setPlaying(false); };
  const run = (n: number, from = 0) => {
    cancelAnimationFrame(raf.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPlaying(false); return setIdx(n); }
    setPlaying(true);
    const t0 = performance.now(), dur = 9000 * (1 - from / n) + 600;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setIdx(Math.round(from + (n - from) * k));
      if (k < 1) raf.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    raf.current = requestAnimationFrame(() => run(len));
    return () => cancelAnimationFrame(raf.current);
    // intro once, on the default window
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickPeriod = (d: number) => {
    const n = Math.min(d, last);
    setDays(d);
    run(n);
  };

  const day = Math.min(idx, len);
  const frame = useMemo(() => {
    const items = assets.map((a) => {
      const idxv = (a.v[start + day] / a.v[start]) * 100;
      return { a, v: idxv, dev: idxv - 100 };
    });
    const order = [...items].sort((x, y) => y.v - x.v);
    const rank = new Map(order.map((o, i) => [o.a.key, i]));
    const scale = Math.max(3, ...items.map((i) => Math.abs(i.dev)));
    return { items, order, rank, scale };
  }, [assets, start, day]);

  // Screen readers get one settled sentence, not 60 updates a second.
  useEffect(() => {
    if (playing) return;
    const id = setTimeout(() => {
      const up = frame.order[0], down = frame.order.at(-1)!;
      setSay(labels.say
        .replace("{date}", f.fmtDate(dates[start + day]))
        .replace("{up}", up.a.name).replace("{upPct}", f.fmtPct(up.dev))
        .replace("{down}", down.a.name).replace("{downPct}", f.fmtPct(down.dev)));
    }, 500);
    return () => clearTimeout(id);
  }, [playing, frame, labels.say, f, dates, start, day]);

  const pct = len ? (day / len) * 100 : 100;
  const fmtScale = f.fmtNum(Math.ceil(frame.scale));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-display text-4xl font-bold leading-none sm:text-5xl" aria-hidden>{f.fmtDate(dates[start + day])}</p>
          <p className="mt-2 text-mute">{labels.base.replace("{date}", f.fmtDate(dates[start]))}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label={labels.range} className="flex flex-wrap gap-1">
            {labels.periods.map((p) => (
              <button key={p.days} type="button" aria-pressed={p.days === days} onClick={() => pickPeriod(p.days)}
                className="min-h-11 rounded-md border border-line px-4 hover:bg-paper-3 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper">
                {p.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => (playing ? stop() : run(len, day >= len ? 0 : day))}
            className="min-h-11 rounded-md border border-note bg-note px-5 font-semibold text-paper hover:opacity-90">
            {playing ? labels.pause : day >= len ? labels.replay : labels.play}
          </button>
        </div>
      </div>

      <div className="relative mt-5 h-8" dir="ltr">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
        <div aria-hidden className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-note" style={{ width: `${pct}%` }} />
        <div aria-hidden className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-gold" style={{ left: `${pct}%` }} />
        <input type="range" min={0} max={len} value={day} aria-label={labels.scrub}
          aria-valuetext={f.fmtDate(dates[start + day])}
          onChange={(e) => { stop(); setIdx(Number(e.target.value)); }}
          onPointerDown={stop}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>

      <p role="status" aria-live="polite" className="sr-only">{say}</p>

      <div dir="ltr" className="mt-4">
        <div className="grid grid-cols-[minmax(5.5rem,9rem)_1fr_5.5rem] gap-x-3 pb-1 text-xs text-mute sm:grid-cols-[10rem_1fr_7rem] sm:gap-x-5" aria-hidden>
          <span />
          <span className="flex justify-between"><span>−{fmtScale}%</span><span>100</span><span>+{fmtScale}%</span></span>
          <span />
        </div>
        <ol className="race relative" style={{ height: `${assets.length * ROW}rem`, "--row": `${ROW}rem` } as CSSProperties}>
          {frame.items.map(({ a, v, dev }) => {
            const r = frame.rank.get(a.key)!;
            const w = Math.min(1, Math.abs(dev) / frame.scale);
            const warm = dev > 0;
            return (
              <li key={a.key} className="race-row absolute inset-x-0 top-0" style={{ "--r": r } as CSSProperties}>
                <div className="grid h-10 grid-cols-[minmax(5.5rem,9rem)_1fr_5.5rem] items-center gap-x-3 sm:grid-cols-[10rem_1fr_7rem] sm:gap-x-5">
                  <Link href={a.href} dir={f.dir} className={`flex min-h-10 items-center truncate text-start text-sm hover:underline sm:text-base ${a.metal ? "font-semibold text-gold" : ""}`}>
                    <span className="truncate">{a.name}</span>
                  </Link>
                  <span className="relative h-5" aria-hidden>
                    <span className="absolute inset-y-[-0.25rem] start-1/2 w-px bg-line" />
                    <span className="race-bar absolute inset-y-0.5 left-1/2 w-1/2 origin-left rounded-e-sm bg-down" style={{ transform: `scaleX(${warm ? w : 0})` }} />
                    <span className="race-bar absolute inset-y-0.5 right-1/2 w-1/2 origin-right rounded-s-sm bg-up" style={{ transform: `scaleX(${warm ? 0 : w})` }} />
                  </span>
                  <span dir={f.dir} className="flex items-baseline justify-end gap-2 text-sm">
                    <b className="font-display text-base">{f.fmtNum(v, 1)}</b>
                    <span className={warm ? "text-down" : dev < 0 ? "text-up" : "text-mute"}>{f.fmtPct(dev)}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
