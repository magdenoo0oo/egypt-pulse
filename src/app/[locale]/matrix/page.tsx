import type { Metadata } from "next";
import { MatrixFrame } from "@/components/MatrixFrame";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { CODES, CURRENCIES, cross, getRows, type Code } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("mx.meta.title"), description: t("mx.meta.desc"), alternates: altLinks(locale, "/matrix") };
}

const DAYS = 30;
type Axis = Code | "egp";
const AXIS: Axis[] = ["egp", ...CODES];
const iso = (c: Axis) => (c === "egp" ? "EGP" : CURRENCIES[c].iso);

export default async function Matrix() {
  const { t, f } = await getI18n();
  const rows = await getRows();
  const now = rows.at(-1)!;
  const then = rows.at(-1 - DAYS) ?? rows[0];
  const name = (c: Axis) => (c === "egp" ? t("conv.egp") : f.cname(c));

  const cells = AXIS.map((from) =>
    AXIS.map((to) => {
      if (from === to) return null;
      const rate = cross(now, from, to);
      return { rate, pct: (rate / cross(then, from, to) - 1) * 100 };
    }),
  );
  const peak = Math.max(0.5, ...cells.flat().map((c) => (c ? Math.abs(c.pct) : 0)));
  const tint = (p: number) =>
    p === 0 ? "transparent" : `color-mix(in oklab, var(${p > 0 ? "--down" : "--up"}) ${Math.round(8 + (Math.min(Math.abs(p), peak) / peak) * 40)}%, var(--paper-2))`;

  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.matrix") }]} title={t("mx.title")} lead={t("mx.lead")} />
      <div className="mx-auto mt-6 max-w-page px-4 sm:px-6 xl:px-12">
        <Panel vault>
          <MatrixFrame idle={t("mx.idle")}>
            <div className="mx max-h-[75vh] overflow-auto rounded-md border border-line" dir="ltr">
              <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
                <caption className="sr-only">{t("mx.cap")}</caption>
                <thead>
                  <tr>
                    <td className="sticky left-0 top-0 z-30 bg-paper-2" />
                    {AXIS.map((c, ci) => (
                      <th key={c} scope="col" data-c={ci} title={name(c)} className="sticky top-0 z-20 h-11 min-w-[4.6rem] bg-paper-2 px-2 text-center font-display font-bold">
                        {iso(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AXIS.map((from, ri) => (
                    <tr key={from}>
                      <th scope="row" data-r={ri} title={name(from)} className="sticky left-0 z-10 h-11 bg-paper-2 px-3 text-start font-display font-bold">
                        {iso(from)}
                      </th>
                      {AXIS.map((to, ci) => {
                        const cell = cells[ri][ci];
                        if (!cell)
                          return <td key={to} aria-hidden className="mx-cell border-b border-e border-line bg-paper-3 text-center text-mute" style={{ "--d": 0 } as React.CSSProperties}>·</td>;
                        return (
                          <td
                            key={to}
                            data-r={ri}
                            data-c={ci}
                            data-read={t("mx.read", { from: iso(from), to: iso(to), rate: f.fmtRate(cell.rate) })}
                            data-note={t("mx.read30", { pct: f.fmtPct(cell.pct) })}
                            className="mx-cell h-11 cursor-default border-b border-e border-line px-2 text-center tabular-nums"
                            style={{ background: tint(cell.pct), "--d": Math.abs(ri - ci) } as React.CSSProperties}
                          >
                            {f.fmtRate(cell.rate)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MatrixFrame>
          <p className="mt-4 max-w-[80ch] text-sm text-mute">{t("mx.note")}</p>
        </Panel>
      </div>
    </main>
  );
}
