import Link from "next/link";
import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { getRows } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("day.idx.meta.title"), description: t("day.idx.meta.desc"), alternates: altLinks(locale, "/day") };
}

export default async function Archive() {
  const { t, f, href } = await getI18n();
  const rows = await getRows();
  const days = rows.map((r, i) => ({ date: r.date, usd: r.usd, pct: i ? ((r.usd - rows[i - 1].usd) / rows[i - 1].usd) * 100 : 0 }));
  const peak = Math.max(0.5, ...days.map((d) => Math.abs(d.pct)));
  const tint = (p: number) =>
    p === 0 ? "var(--paper-2)" : `color-mix(in oklab, var(${p > 0 ? "--down" : "--up"}) ${Math.round(12 + (Math.min(Math.abs(p), peak) / peak) * 36)}%, var(--paper-2))`;
  const months = new Map<string, typeof days>();
  for (const d of days) months.set(d.date.slice(0, 7), [...(months.get(d.date.slice(0, 7)) ?? []), d]);

  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.archive") }]} title={t("day.idx.title")} lead={t("day.idx.lead")} />
      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 md:grid-cols-2 xl:grid-cols-3 xl:px-12">
        {[...months].reverse().map(([m, list]) => (
          <Panel key={m} title={f.fmtMonthYear(list[0].date)} id={`m-${m}`}>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
              {list.map((d) => (
                <li key={d.date}>
                  <Link
                    href={href(`/day/${d.date}`)}
                    aria-label={t("day.idx.tile", { date: f.fmtDate(d.date), price: f.fmt(d.usd), pct: f.fmtPct(d.pct) })}
                    style={{ background: tint(d.pct) }}
                    className="tile flex min-h-11 items-center justify-center rounded-md border border-line font-display font-bold hover:border-note"
                  >
                    {f.fmtInt(Number(d.date.slice(8)))}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </main>
  );
}
