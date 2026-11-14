/** Banknote-style rosette, generated from math. Decorative only. */
export function Guilloche({ className = "" }: { className?: string }) {
  const rings = 44;
  const paths: string[] = [];
  for (let i = 0; i < rings; i++) {
    const a = (i * 360) / rings;
    const rx = 150 + 90 * Math.sin((i / rings) * Math.PI * 4);
    const ry = 42 + 22 * Math.cos((i / rings) * Math.PI * 6);
    // an ellipse as a closed path, rotated around the centre
    paths.push(
      `M${(-rx).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)} 0` +
        `|${a.toFixed(2)}`,
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="-300 -200 600 400"
      preserveAspectRatio="xMidYMid slice"
      className={`rosette pointer-events-none absolute inset-0 h-full w-full text-note ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.55" opacity="0.38">
        {paths.map((p, i) => {
          const [d, rot] = p.split("|");
          return <path key={i} d={d} pathLength={1} transform={`rotate(${rot})`} style={{ animationDelay: `${i * 25}ms` }} />;
        })}
      </g>
    </svg>
  );
}
