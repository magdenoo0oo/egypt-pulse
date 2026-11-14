import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { FlapNumber } from "@/components/FlapNumber";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { tone } from "@/components/RateList";
import { Sparkline } from "@/components/Sparkline";
import { hasNativeContent } from "@/i18n/config";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { marketReport, movers } from "@/lib/insights";
import { CODES, getRows, loadRows, type Key } from "@/lib/rates";

/**
 * Arabic and English get every day pre-built. Other locales pre-build only the latest day (Cache Components needs at
 * least one result per locale) and render older days on first visit, then cache them.
 */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const dates = (await loadRows()).map((r) => ({ date: r.date }));
  return hasNativeContent(params.locale as never) ? dates : dates.slice(-1);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/day/[date]">): Promise<Metadata> {
  const { date } = await params;
  const rows = await getRows();
  if (!rows.some((r) => r.date === date)) return {};
  const { t, f, locale } = await getI18n();
  const d = f.fmtDate(date);
  return {
    title: t("day.meta.title", { date: d }),
    description: t("day.meta.desc", { date: d, n: CODES.length }),
    alternates: altLinks(locale, `/day/${date}`),
  };
}

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" } as const;

export default async function Day({ params }: PageProps<"/[locale]/day/[date]">) {
  const { date } = await params;
  const rows = await getRows();
  const i = rows.findIndex((r) => r.date === date);
  if (i < 0) notFound();
  const i18n = await getI18n();
  const { t, f, href } = i18n;
  const row = rows[i], prev = rows[i - 1], next = rows[i + 1];
  const upto = rows.slice(0, i + 1);
  const info = new Map(movers(rows, i18n, 30).map((m) => [m.key, m]));
  const keys: Key[] = [...CODES, "gold24", "silver"];
  const table = keys.map((k) => ({
    k,
    name: info.get(k)!.name,
    path: info.get(k)!.path,
    now: row[k],
    pct: prev ? ((row[k] - prev[k]) / prev[k]) * 100 : null,
    spark: upto.slice(-30).map((r) => r[k]),
  }));
  const usd = table[0];
  const report = marketReport(upto, i18n);
  const long = f.fmtDate(date);

  const nav = "inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 hover:bg-paper-2";

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <PageHead
          crumbs={[{ href: "/day", label: t("nav.archive") }, { label: long }]}
          title={t("day.title", { date: long })}
          lead={t("day.lead")}
        />
        <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {prev ? (
              <Link href={href(`/day/${prev.date}`)} transitionTypes={["nav-back"]} className={nav}>
                <span aria-hidden className="rtl:rotate-180">←</span>{t("day.prev")} <span className="text-mute">{f.fmtDate(prev.date, "short")}</span>
              </Link>
            ) : <span className="text-mute">{t("day.first")}</span>}
            {next && (
              <Link href={href(`/day/${next.date}`)} transitionTypes={["nav-forward"]} className={nav}>
                <span className="text-mute">{f.fmtDate(next.date, "short")}</span> {t("day.next")}<span aria-hidden className="rtl:rotate-180">→</span>
              </Link>
            )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
            <Panel vault title={t("hero.usd")} id="day-usd" aside={t("hero.unit.usd")}>
              <div className="[container-type:inline-size]">
                <FlapNumber key={date} from={prev ? prev.usd : row.usd} to={row.usd} label={t("hero.usd")} />
              </div>
              {usd.pct !== null && (
                <p className={`mt-4 text-xl ${tone(usd.pct)}`}>{f.fmtPct(usd.pct)} <span className="text-base text-mute">{t("day.col.change")}</span></p>
              )}
            </Panel>
            <Panel title={t("day.report")} id="day-report">
              <div className="font-serif text-xl leading-[2]">
                {report.map((p) => <p key={p} className="mb-3">{p}</p>)}
              </div>
            </Panel>
          </div>

          <div className="mt-4">
            <Panel title={t("day.all")} id="day-all">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[20rem] text-start sm:min-w-[34rem]">
                  <caption className="sr-only">{t("day.all")}</caption>
                  <thead className="text-sm text-mute">
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2 text-start font-normal">{t("mvp.col.asset")}</th>
                      <th scope="col" className="text-start font-normal">{t("mvp.col.price")}</th>
                      <th scope="col" className="text-start font-normal">{t("day.col.change")}</th>
                      <th scope="col" className="hidden sm:table-cell"><span className="sr-only">30</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((r) => (
                      <tr key={r.k} className="border-b border-line">
                        <th scope="row" className="py-1 text-start font-normal"><Link href={href(r.path)} className="inline-flex min-h-11 items-center hover:underline">{r.name}</Link></th>
                        <td className="font-display font-bold">{f.fmt(r.now)}</td>
                        <td className={r.pct === null ? "text-mute" : tone(r.pct)}>{r.pct === null ? "-" : f.fmtPct(r.pct)}</td>
                        <td className="hidden sm:table-cell"><Sparkline values={r.spark} className={r.pct === null ? "" : tone(r.pct)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-mute">{t("footer.disclaimer")}</p>
            </Panel>
          </div>
        </div>
      </main>
    </ViewTransition>
  );
}
