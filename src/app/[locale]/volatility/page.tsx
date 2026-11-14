import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { dailyChanges, movers, volatility } from "@/lib/insights";
import { CODES, getRows, type Key } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("vl.meta.title"), description: t("vl.meta.desc"), alternates: altLinks(locale, "/volatility") };
}

const DAYS = 365;
const H = 56, MID = H / 2, SCALE = 5; // one shared scale: +/-5% a day fills the lane

export default async function Volatility() {
  const i18n = await getI18n();
  const { t, f, href } = i18n;
  const rows = await getRows();
  const info = new Map(movers(rows, i18n, 30).map((m) => [m.key, m]));
  const keys: Key[] = [...CODES, "gold24", "silver"];

  const lanes = keys
    .map((k) => {
      const ch = dailyChanges(rows, k, DAYS);
      const y = (pct: number) => MID - (Math.max(-SCALE, Math.min(SCALE, pct)) / SCALE) * (MID - 2);
      const spikes = (up: boolean) =>
        ch.map((c, i) => (up ? c.pct > 0 : c.pct < 0) ? `M${i} ${MID}V${y(c.pct).toFixed(1)}` : "").join("");
      const peak = ch.reduce<{ date: string; pct: number; i: number }>((m, c, i) => (Math.abs(c.pct) > Math.abs(m.pct) ? { ...c, i } : m), { ...ch[0], i: 0 });
      return { k, n: ch.length, up: spikes(true), down: spikes(false), peak, vol: volatility(rows, k, DAYS), ...info.get(k)!, py: y(peak.pct) };
    })
    .sort((a, b) => b.vol - a.vol);

  const wild = lanes[0], calm = lanes.at(-1)!;
  const n = lanes[0].n;
  const dates = dailyChanges(rows, "usd", DAYS).map((c) => c.date);
  const turns = dates.map((d, i) => ({ d, i })).filter(({ d, i }) => i > 0 && d.slice(5, 7) !== dates[i - 1].slice(5, 7));
  const months = turns[0]?.i >= 25 ? [{ d: dates[0], i: 0 }, ...turns] : turns;

  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.volatility") }]} title={t("vl.title")} lead={t("vl.lead")} />
      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <p className="mb-4 max-w-[80ch] text-lg">
          {t("vl.summary", { calm: calm.name, calmV: f.fmtNum(calm.vol) + "%", wild: wild.name, wildV: f.fmtNum(wild.vol) + "%" })}
        </p>
        <Panel vault title={t("vl.panel")} id="seis" aside={t("vl.aside")}>
          <div dir="ltr" className="grid grid-cols-[minmax(6.5rem,10rem)_1fr_3.5rem] gap-x-3 sm:grid-cols-[11rem_1fr_4.5rem] sm:gap-x-5">
            <span aria-hidden />
            <div aria-hidden className="relative h-6 text-xs text-mute">
              {months.map(({ d, i }) => (
                <span key={d} className="absolute top-0 -translate-x-1/2" style={{ left: `${(i / (n - 1)) * 100}%` }}>{f.fmtMonth(d)}</span>
              ))}
            </div>
            <span aria-hidden />
            {lanes.map((l, rank) => (
              <Lane key={l.k} l={l} rank={rank} n={n} href={href(l.path)} f={f} t={t} />
            ))}
          </div>
          <p className="mt-5 max-w-[80ch] text-sm text-mute">{t("vl.scale")}</p>
        </Panel>
      </div>
    </main>
  );
}

type I18nT = Awaited<ReturnType<typeof getI18n>>;
type LaneData = {
  k: Key; name: string; up: string; down: string; vol: number; py: number;
  peak: { date: string; pct: number; i: number };
};

function Lane({ l, rank, n, href, f, t }: { l: LaneData; rank: number; n: number; href: string; f: I18nT["f"]; t: I18nT["t"] }) {
  return (
    <>
      <Link href={href} dir={f.dir} className="flex min-h-14 flex-col justify-center border-t border-line text-start hover:text-note">
        <span className="truncate font-display text-lg font-bold leading-tight">{l.name}</span>
        <span className="truncate text-xs text-mute">{t("vl.peak", { date: f.fmtDate(l.peak.date, "short"), pct: f.fmtPct(l.peak.pct) })}</span>
      </Link>
      <div className="seis relative border-t border-line" style={{ "--i": rank } as CSSProperties}>
        <svg viewBox={`0 0 ${n - 1} ${H}`} preserveAspectRatio="none" aria-hidden className="block h-14 w-full">
          <line x1="0" x2={n - 1} y1={MID} y2={MID} stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={l.down} stroke="var(--up)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
          <path d={l.up} stroke="var(--down)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          aria-hidden
          className="seis-dot absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          style={{ left: `${(l.peak.i / (n - 1)) * 100}%`, top: `${(l.py / H) * 100}%` }}
        />
      </div>
      <span dir={f.dir} className="flex min-h-14 items-center justify-end border-t border-line text-sm font-bold">{f.fmtNum(l.vol)}%</span>
    </>
  );
}
