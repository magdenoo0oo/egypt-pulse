export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const w = 120, h = 36;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const d = values
    .map((v, i) => `${i ? "L" : "M"}${((i / (values.length - 1)) * w).toFixed(1)} ${(h - 3 - ((v - min) / span) * (h - 6)).toFixed(1)}`)
    .join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className={`h-9 w-28 ${className}`}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
