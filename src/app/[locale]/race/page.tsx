import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { RaceChart, type RaceAsset } from "@/components/RaceChart";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { movers } from "@/lib/insights";
import { CODES, getRows, type Key } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("rc.meta.title"), description: t("rc.meta.desc"), alternates: altLinks(locale, "/race") };
}

export default async function Race() {
  const i18n = await getI18n();
  const { t, href } = i18n;
  const rows = await getRows();
  const info = new Map(movers(rows, i18n, 30).map((m) => [m.key, m]));
  const keys: Key[] = [...CODES, "gold24", "silver"];
  const assets: RaceAsset[] = keys.map((k) => ({
    key: k,
    name: info.get(k)!.name,
    href: href(info.get(k)!.path),
    metal: k === "gold24" || k === "silver",
    v: rows.map((r) => r[k]),
  }));
  const labels = {
    play: t("rc.play"), replay: t("rc.replay"), pause: t("rc.pause"), range: t("rc.range"), scrub: t("rc.scrub"),
    base: t("rc.base", { date: "{date}" }), say: t("rc.say", { date: "{date}", up: "{up}", upPct: "{upPct}", down: "{down}", downPct: "{downPct}" }),
    periods: [
      { days: 30, label: t("period.30") },
      { days: 90, label: t("period.90") },
      { days: 180, label: t("rc.p180") },
      { days: 365, label: t("period.365") },
    ],
  };
  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.race") }]} title={t("rc.title")} lead={t("rc.lead")} />
      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel vault>
          <RaceChart dates={rows.map((r) => r.date)} assets={assets} labels={labels} />
          <p className="mt-6 max-w-[80ch] text-sm text-mute">{t("rc.note")}</p>
        </Panel>
      </div>
    </main>
  );
}
