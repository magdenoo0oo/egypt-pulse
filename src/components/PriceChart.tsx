"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AreaSeries, createChart, type IChartApi, type ISeriesApi, type Time } from "lightweight-charts";
import { alpha, baseOptions, fmtFull, num, token, type Pt, type Token } from "./chartKit";

const RANGES = [
  [30, "شهر"],
  [90, "٣ شهور"],
  [180, "٦ شهور"],
  [365, "سنة"],
] as const;

/**
 * Interactive price history (TradingView lightweight-charts).
 * `children` is the server-rendered SVG chart: it shows until the client chart is ready, so there is no blank frame
 * and the page still reads without JavaScript.
 */
export function PriceChart({
  data, label, children, height = 360, tone = "note", unit = "جنيه",
}: { data: Pt[]; label: string; children?: ReactNode; height?: number; tone?: Token; unit?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<"Area"> | null>(null);
  const [range, setRange] = useState<number>(Math.min(90, data.length));
  const [ready, setReady] = useState(false);
  const last = data.at(-1)!;
  const [hover, setHover] = useState<{ v: number; t: Time } | null>(null);

  useEffect(() => {
    const el = box.current!;
    const c = createChart(el, { ...baseOptions(el), height });
    const apply = () => {
      const col = token(el, tone);
      c.applyOptions(baseOptions(el));
      s.applyOptions({ lineColor: col, topColor: alpha(col, 0.28), bottomColor: alpha(col, 0) });
    };
    const s = c.addSeries(AreaSeries, { lineWidth: 2, priceLineVisible: true, lastValueVisible: true });
    s.setData(data.map((d) => ({ time: d.date as Time, value: d.v })));
    chart.current = c;
    series.current = s;
    apply();
    c.subscribeCrosshairMove((p) => {
      const v = p.seriesData.get(s) as { value?: number } | undefined;
      setHover(p.time && v?.value !== undefined ? { v: v.value, t: p.time } : null);
    });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", apply);
      c.remove();
      chart.current = null;
    };
  }, [data, height, tone]);

  useEffect(() => {
    const c = chart.current;
    if (!c || !ready) return;
    const from = data[Math.max(0, data.length - range)].date as Time;
    c.timeScale().setVisibleRange({ from, to: last.date as Time });
  }, [range, ready, data, last.date]);

  const shown = hover ?? { v: last.v, t: last.date as Time };
  const first = data[Math.max(0, data.length - range)].v;
  const pct = ((shown.v - first) / first) * 100;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div aria-live="off">
          <p className="font-display text-3xl font-bold leading-none">
            {num.format(shown.v)} <span className="font-sans text-sm font-normal text-mute">{unit}</span>
          </p>
          <p className="mt-1 text-sm text-mute">
            {fmtFull(shown.t)} · {"\u061C"}{pct > 0 ? "+" : pct < 0 ? "−" : ""}{num.format(Math.abs(pct))}٪ عن بداية الفترة
          </p>
        </div>
        <div className="flex gap-1" role="group" aria-label="الفترة الزمنية">
          {RANGES.filter(([d]) => data.length >= d * 0.9).map(([d, l]) => (
            <button
              key={d}
              type="button"
              aria-pressed={range === Math.min(d, data.length)}
              onClick={() => setRange(Math.min(d, data.length))}
              className="min-h-11 rounded-md border border-line px-3 text-sm hover:bg-paper-3 aria-pressed:border-note aria-pressed:bg-note aria-pressed:text-paper"
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div dir="ltr" className="relative mt-4" style={{ minHeight: height }} role="img" aria-label={label}>
        <div ref={box} className={ready ? "" : "absolute inset-0 opacity-0"} style={{ height }} />
        {!ready && <div className="absolute inset-0">{children}</div>}
      </div>
    </div>
  );
}
