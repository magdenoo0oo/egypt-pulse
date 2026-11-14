"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";

export type MapItem = { code: string; name: string; href: string; v: number[] };
export type MapLabels = { play: string; replay: string; pause: string; scrub: string; window: string; read: string; idle: string; list: string };

const WINDOW = 30;

/**
 * Time and interaction for /map. The map itself is server-rendered SVG that reads CSS variables
 * (`--w-xxx` warm opacity, `--g-xxx` green opacity); this wrapper only moves those variables as the date changes,
 * so the whole wave is opacity-only. Hover, tap or list focus highlights a country.
 */
export function WorldMapFrame({ dates, items, labels, children }: { dates: string[]; items: MapItem[]; labels: MapLabels; children: ReactNode }) {
  const { f } = useI18n();
  const last = dates.length - 1;
  const len = last - WINDOW;
  const [idx, setIdx] = useState(len);
  const [playing, setPlaying] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const raf = useRef(0);

  const stop = () => { cancelAnimationFrame(raf.current); setPlaying(false); };
  const run = (from = 0) => {
    cancelAnimationFrame(raf.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPlaying(false); return setIdx(len); }
    setPlaying(true);
    const t0 = performance.now(), dur = 9000 * (1 - from / len) + 600;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setIdx(Math.round(from + (len - from) * k));
      if (k < 1) raf.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => {
    raf.current = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf.current);
    // intro once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const day = Math.min(idx, len);
  const d = day + WINDOW;
  const peak = useMemo(() => {
    let p = 1;
    for (const it of items) for (let i = WINDOW; i <= last; i++) p = Math.max(p, Math.abs((it.v[i] / it.v[i - WINDOW] - 1) * 100));
    return p;
  }, [items, last]);

  const rows = items
    .map((it) => ({ ...it, price: it.v[d], pct: (it.v[d] / it.v[d - WINDOW] - 1) * 100 }))
    .sort((a, b) => b.pct - a.pct);
  const vars: Record<string, string> = {};
  for (const r of rows) {
    const s = Math.min(1, Math.abs(r.pct) / peak);
    const o = (0.18 + 0.72 * s).toFixed(2);
    vars[`--w-${r.code}`] = r.pct > 0.05 ? o : "0";
    vars[`--g-${r.code}`] = r.pct < -0.05 ? o : "0";
  }
  const cur = rows.find((r) => r.code === hot);
  const pick = (el: EventTarget | null) => (el as HTMLElement | null)?.closest<HTMLElement>("[data-cur]")?.dataset.cur ?? null;
  const pct = len ? (day / len) * 100 : 100;
  const tone = (n: number) => (n > 0.05 ? "text-down" : n < -0.05 ? "text-up" : "text-mute");

  return (
    <div className="wm" style={vars as CSSProperties}>
      {hot && <style>{`.wm [data-cur="${hot}"] .map-base{stroke:var(--ink);stroke-width:2.2px}`}</style>}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-display text-4xl font-bold leading-none sm:text-5xl" aria-hidden>{f.fmtDate(dates[d])}</p>
          <p className="mt-2 text-mute">{labels.window.replace("{date}", f.fmtDate(dates[d]))}</p>
        </div>
        <button type="button" onClick={() => (playing ? stop() : run(day >= len ? 0 : day))}
          className="min-h-11 rounded-md border border-note bg-note px-5 font-semibold text-paper hover:opacity-90">
          {playing ? labels.pause : day >= len ? labels.replay : labels.play}
        </button>
      </div>

      <div className="relative mt-4 h-8" dir="ltr">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
        <div aria-hidden className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-note" style={{ width: `${pct}%` }} />
        <div aria-hidden className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-gold" style={{ left: `${pct}%` }} />
        <input type="range" min={0} max={len} value={day} aria-label={labels.scrub} aria-valuetext={f.fmtDate(dates[d])}
          onChange={(e) => { stop(); setIdx(Number(e.target.value)); }} onPointerDown={stop}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>

      <p role="status" aria-live="polite" className="mt-3 min-h-8 text-lg">
        {cur
          ? labels.read.replace("{name}", cur.name).replace("{price}", f.fmtRate(cur.price)).replace("{pct}", f.fmtPct(cur.pct))
          : <span className="text-mute">{labels.idle}</span>}
      </p>

      <div className="mt-2 grid gap-6">
        <div dir="ltr" onPointerOver={(e) => { if (e.pointerType === "mouse") setHot(pick(e.target)); }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setHot(null); }} onClick={(e) => setHot(pick(e.target))}>
          {children}
        </div>
        <ol aria-label={labels.list} className="grid gap-x-8 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <li key={r.code}>
              <Link href={r.href} onPointerEnter={() => setHot(r.code)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(r.code)} onBlur={() => setHot(null)}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-md px-2 hover:bg-paper-3 ${hot === r.code ? "bg-paper-3" : ""}`}>
                <span className="truncate">{r.name}</span>
                <span className="flex items-baseline gap-3 text-sm">
                  <span className="text-mute">{f.fmtRate(r.price)}</span>
                  <b className={`min-w-[4.5rem] text-end ${tone(r.pct)}`}>{f.fmtPct(r.pct)}</b>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
