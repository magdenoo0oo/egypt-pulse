import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { WorldMapFrame, type MapItem } from "@/components/WorldMapFrame";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { EGYPT_LABEL, GULF_BOX, MAP_H, MAP_REST, MAP_SHAPES, MAP_W } from "@/lib/worldMap";
import { CODES, getRows, type Code } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("mp.meta.title"), description: t("mp.meta.desc"), alternates: altLinks(locale, "/map") };
}

const GULF: Code[] = ["sar", "kwd", "qar", "bhd", "aed", "omr", "jod"];
const baseFill = "color-mix(in oklab, var(--ink) 16%, var(--paper-2))";

/** A country's three layers: neutral base, warm overlay and green overlay (opacity set by the client wrapper). */
function Layers({ c }: { c: Code }) {
  return (
    <g data-cur={c} className="cursor-pointer">
      <use href={`#mp-${c}`} className="map-base" fill={baseFill} stroke="var(--line)" strokeWidth="0.6" />
      <use href={`#mp-${c}`} className="map-ov" fill="var(--down)" style={{ opacity: `var(--w-${c}, 0)` }} />
      <use href={`#mp-${c}`} className="map-ov" fill="var(--up)" style={{ opacity: `var(--g-${c}, 0)` }} />
    </g>
  );
}

export default async function WorldMap() {
  const i18n = await getI18n();
  const { t, f, href } = i18n;
  const rows = await getRows();
  const items: MapItem[] = CODES.map((c) => ({
    code: c,
    name: f.cname(c),
    href: href(`/currency/${c}`),
    v: rows.map((r) => r[c] / (c === "jpy" || c === "inr" ? 100 : 1)),
  }));
  const labels = {
    play: t("rc.play"), replay: t("rc.replay"), pause: t("rc.pause"), scrub: t("rc.scrub"),
    window: t("mp.window", { date: "{date}" }), read: t("mp.read", { name: "{name}", price: "{price}", pct: "{pct}" }),
    idle: t("mp.idle"), list: t("mp.list"),
  };
  const world = CODES.filter((c) => !["kwd", "qar", "bhd", "aed", "omr"].includes(c));

  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.map") }]} title={t("mp.title")} lead={t("mp.lead")} />
      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel vault>
          <WorldMapFrame dates={rows.map((r) => r.date)} items={items} labels={labels}>
            <div className="relative">
              <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden className="block h-auto w-full">
                <defs>
                  <path id="mp-rest" d={MAP_REST} vectorEffect="non-scaling-stroke" />
                  {Object.entries(MAP_SHAPES).map(([c, d]) => <path key={c} id={`mp-${c}`} d={d} vectorEffect="non-scaling-stroke" />)}
                </defs>
                <use href="#mp-rest" fill="var(--paper-3)" stroke="var(--line)" strokeWidth="0.4" />
                {world.map((c) => <Layers key={c} c={c} />)}
                <use href="#mp-egp" fill="var(--gold)" stroke="var(--ink)" strokeWidth="0.8" />
                <text x={EGYPT_LABEL[0]} y={EGYPT_LABEL[1] + 26} textAnchor="middle" className="fill-gold font-display" fontSize="17" fontWeight="700">{t("mp.egypt")}</text>
              </svg>
              <div className="absolute bottom-[3%] start-[1%] w-[22%] min-w-36 max-w-60 overflow-hidden rounded-md border border-line bg-paper shadow-sm" dir="ltr">
                <svg viewBox={GULF_BOX.join(" ")} aria-hidden className="block h-auto w-full">
                  <use href="#mp-rest" fill="var(--paper-3)" stroke="var(--line)" strokeWidth="0.4" />
                  {GULF.map((c) => <Layers key={c} c={c} />)}
                </svg>
                <span className="absolute start-2 top-1 text-xs text-mute">{t("mp.gulf")}</span>
              </div>
            </div>
          </WorldMapFrame>
          <p className="mt-6 max-w-[80ch] text-sm text-mute">{t("mp.note")} {t("mp.credit")}</p>
        </Panel>
      </div>
    </main>
  );
}
