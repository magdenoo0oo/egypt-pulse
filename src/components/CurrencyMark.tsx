/** Coin-style emblem: engraved ring with tick marks and the ISO code. Decorative, so hidden from assistive tech. */
export function CurrencyMark({ iso, size = 48, className = "" }: { iso: string; size?: number; className?: string }) {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const long = i % 4 === 0;
    const r1 = 30, r2 = long ? 26.5 : 28;
    return `M${(32 + r1 * Math.cos(a)).toFixed(2)} ${(32 + r1 * Math.sin(a)).toFixed(2)}L${(32 + r2 * Math.cos(a)).toFixed(2)} ${(32 + r2 * Math.sin(a)).toFixed(2)}`;
  }).join("");
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={`shrink-0 text-note ${className}`}>
      <circle cx="32" cy="32" r="31" fill="var(--paper-2)" stroke="currentColor" strokeWidth="1.5" />
      <path d={ticks} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--ink)" style={{ fontFamily: "var(--font-reem), sans-serif" }}>
        {iso}
      </text>
    </svg>
  );
}
