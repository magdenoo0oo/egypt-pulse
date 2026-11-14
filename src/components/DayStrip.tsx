import { getI18n } from "@/i18n/server";

type Day = { date: string; pct: number };

/**
 * One cell per day of the last year, coloured by that day's move (the contribution-graph layout).
 * Warm = the price rose (the pound weakened), green = it fell.
 */
export async function DayStrip({ days, label }: { days: Day[]; label: string }) {
  const { t, f } = await getI18n();
  const cell = 12, gap = 3, step = cell + gap;
  const first = new Date(days[0].date + "T00:00:00Z");
  const offset = first.getUTCDay();
  const day0 = first.getTime() - offset * 86_400_000;
  const cols = Math.ceil((new Date(days.at(-1)!.date + "T00:00:00Z").getTime() - day0) / 86_400_000 / 7) + 1;
  const peak = Math.max(0.5, ...days.map((d) => Math.abs(d.pct)));
  const tint = (p: number) => {
    const k = Math.min(1, Math.abs(p) / peak);
    const pct = Math.round(18 + k * 62);
    return `color-mix(in oklab, var(${p > 0 ? "--down" : "--up"}) ${pct}%, var(--paper-3))`;
  };
  const ups = days.filter((d) => d.pct > 0).length, downs = days.filter((d) => d.pct < 0).length;
  return (
    <div>
      <div dir="ltr" className="overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${cols * step} ${7 * step}`} role="img" aria-label={t("strip.aria", { label, ups, downs })} className="h-auto w-full min-w-[40rem]">
          {days.map((d) => {
            const t = new Date(d.date + "T00:00:00Z").getTime();
            const idx = Math.round((t - day0) / 86_400_000);
            return (
              <rect key={d.date} x={Math.floor(idx / 7) * step} y={(idx % 7) * step} width={cell} height={cell} rx="2" style={{ fill: d.pct === 0 ? "var(--paper-3)" : tint(d.pct) }}>
                <title>{`${f.fmtDate(d.date)}: ${f.fmtPct(d.pct)}`}</title>
              </rect>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mute">
        <span className="inline-flex items-center gap-1"><span aria-hidden className="inline-block size-3 rounded-sm" style={{ background: tint(peak) }} /> {t("strip.up", { n: ups })}</span>
        <span className="inline-flex items-center gap-1"><span aria-hidden className="inline-block size-3 rounded-sm" style={{ background: tint(-peak) }} /> {t("strip.down", { n: downs })}</span>
      </p>
    </div>
  );
}
