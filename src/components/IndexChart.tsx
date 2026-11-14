"use client";
import { useEffect, useRef, useState } from "react";
import { LineSeries, createChart, type Time } from "lightweight-charts";
import { baseOptions, fmtFull, num, token, type Pt, type Token } from "./chartKit";

export type Line = { key: string; name: string; tone: Token; data: Pt[] };

/** Several things rebased to 100 on one chart. Hover reads every line at that day. */
export function IndexChart({ lines, label, height = 380 }: { lines: Line[]; label: string; height?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<{ t: Time; vals: Record<string, number> } | null>(null);

  useEffect(() => {
    const el = box.current!;
    const c = createChart(el, { ...baseOptions(el), height });
    const made = lines.map((l) => {
      const s = c.addSeries(LineSeries, { color: token(el, l.tone), lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
      s.setData(l.data.map((d) => ({ time: d.date as Time, value: d.v })));
      return [l.key, s] as const;
    });
    c.timeScale().fitContent();
    c.subscribeCrosshairMove((p) => {
      if (!p.time) return setHover(null);
      const vals: Record<string, number> = {};
      for (const [k, s] of made) {
        const v = p.seriesData.get(s) as { value?: number } | undefined;
        if (v?.value !== undefined) vals[k] = v.value;
      }
      setHover({ t: p.time, vals });
    });
    const apply = () => {
      c.applyOptions(baseOptions(el));
      lines.forEach((l, i) => made[i][1].applyOptions({ color: token(el, l.tone) }));
    };
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => { cancelAnimationFrame(raf); mq.removeEventListener("change", apply); c.remove(); };
  }, [lines, height]);

  return (
    <div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {lines.map((l) => {
          const v = hover?.vals[l.key] ?? l.data.at(-1)!.v;
          return (
            <li key={l.key} className="flex items-center gap-2">
              <span aria-hidden className="inline-block size-3 rounded-full" style={{ background: `var(--${l.tone})` }} />
              <span>{l.name}</span>
              <span className="font-display text-lg font-bold">{num.format(v)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-1 text-sm text-mute">{hover ? fmtFull(hover.t) : "القيمة ١٠٠ = بداية الفترة. مرّر على الرسم لقراءة اليوم."}</p>
      <div dir="ltr" className="mt-3" role="img" aria-label={label}>
        <div ref={box} style={{ height }} className={ready ? "" : "opacity-0"} />
      </div>
    </div>
  );
}
