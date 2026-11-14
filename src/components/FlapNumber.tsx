"use client";
import { useMemo } from "react";
import { useI18n } from "@/i18n/client";

/**
 * Split-flap number. The markup always holds the final value (crawlers and no-JS readers get the real number);
 * a CSS animation rolls each drum from the matching digit of `from`, staggered, transform only.
 */
export function FlapNumber({ from, to, label }: { from: number; to: number; label: string }) {
  const { f } = useI18n();
  const nf = useMemo(() => new Intl.NumberFormat(f.tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [f.tag]);
  const now = nf.format(to).split("");
  const before = nf.format(from).split("");
  const aligned = before.length === now.length;
  const em = now.reduce((t, c, i) => t + (f.digits.includes(c) ? 0.66 : 0.4) + (i ? 0.12 : 0), 0);
  return (
    <p
      dir="ltr"
      className="flex items-center gap-[0.12em] font-display font-bold leading-none"
      style={{ fontSize: `min(7rem, ${(92 / em).toFixed(2)}vw)` }}
      role="text"
      aria-label={`${label}: ${nf.format(to)}`}
    >
      {now.map((c, i) => {
        const d = f.digits.indexOf(c);
        if (d < 0) return <span key={i} aria-hidden className="px-[0.02em] text-[0.6em] text-mute">{c}</span>;
        const fd = aligned ? f.digits.indexOf(before[i]) : -1;
        return (
          <span key={i} className="flap" aria-hidden>
            <span
              className={`drum ${fd >= 0 && fd !== d ? "roll" : ""}`}
              style={{ transform: `translateY(-${d * 10}%)`, "--f": fd, "--t": d, animationDelay: `${150 + i * 70}ms` } as React.CSSProperties}
            >
              {Array.from(f.digits).map((x) => <span key={x} className="flap-d">{x}</span>)}
            </span>
          </span>
        );
      })}
    </p>
  );
}
