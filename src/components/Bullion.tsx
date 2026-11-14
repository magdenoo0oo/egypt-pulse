/** Flat-faceted bullion bar illustration (no gradients, three tones). */
export function Bullion({ tone = "gold", className = "" }: { tone?: "gold" | "silver"; className?: string }) {
  const c = tone === "gold"
    ? { top: "#e9c766", front: "#c99a2e", side: "#9a721a", ink: "#6b4c0d" }
    : { top: "#e4e9e6", front: "#b9c2bd", side: "#8d9893", ink: "#56615c" };
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" className={className}>
      <ellipse cx="160" cy="178" rx="128" ry="12" fill="currentColor" opacity="0.12" />
      <polygon points="70,70 250,70 292,118 28,118" fill={c.top} />
      <polygon points="28,118 292,118 280,168 40,168" fill={c.front} />
      <polygon points="250,70 292,118 280,168 262,128" fill={c.side} />
      <polygon points="70,70 28,118 40,168 58,126" fill={c.side} opacity="0.55" />
      <g fill="none" stroke={c.ink} strokeWidth="2" opacity="0.7">
        <path d="M84 134h152M96 146h128" />
        <path d="M104 92h112" strokeWidth="1.5" />
      </g>
      <text x="160" y="106" textAnchor="middle" fontSize="15" fontWeight="700" fill={c.ink} style={{ fontFamily: "var(--font-reem), sans-serif" }}>
        {tone === "gold" ? "٩٩٩٫٩" : "٩٩٩"}
      </text>
    </svg>
  );
}
