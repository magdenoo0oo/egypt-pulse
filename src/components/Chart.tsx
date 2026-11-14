import { fmt, fmtDate } from "@/lib/format";

export function Chart({ data, label }: { data: { date: string; v: number }[]; label: string }) {
  const W = 800, H = 320, P = { l: 12, r: 84, t: 16, b: 34 };
  const vs = data.map((d) => d.v);
  const min = Math.min(...vs), max = Math.max(...vs), span = max - min || 1;
  const lo = min - span * 0.12, hi = max + span * 0.12;
  const x = (i: number) => P.l + (i / (data.length - 1)) * (W - P.l - P.r);
  const y = (n: number) => P.t + (1 - (n - lo) / (hi - lo)) * (H - P.t - P.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join("");
  const area = `${line}L${x(data.length - 1)} ${H - P.b}L${x(0)} ${H - P.b}Z`;
  const last = data.length - 1;
  return (
    <div dir="ltr"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {[0, 1, 2, 3].map((k) => {
        const n = lo + ((hi - lo) * k) / 3;
        return (
          <g key={k}>
            <line x1={P.l} x2={W - P.r} y1={y(n)} y2={y(n)} stroke="var(--line)" />
            <text x={W - P.r + 10} y={y(n) + 4} fontSize="17" fill="var(--mute)">{fmt(n)}</text>
          </g>
        );
      })}
      <path d={area} fill="var(--note)" opacity="0.1" />
      <path d={line} fill="none" stroke="var(--note)" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx={x(last)} cy={y(data[last].v)} r="4.5" fill="var(--note)" />
      <text x={P.l} y={H - 9} fontSize="17" fill="var(--mute)">{fmtDate(data[0].date, "short")}</text>
      <text x={W - P.r} y={H - 9} fontSize="17" fill="var(--mute)" textAnchor="end">{fmtDate(data[last].date, "short")}</text>
    </svg></div>
  );
}
