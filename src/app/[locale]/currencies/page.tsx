import type { Metadata } from "next";
import { Heatmap } from "@/components/Heatmap";
import { PageHead } from "@/components/PageHead";
import { RateList } from "@/components/RateList";
import { Section } from "@/components/Section";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { CODES, CURRENCIES, getRows, type Group } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("cur.meta.title"), description: t("cur.meta.desc"), alternates: altLinks(locale, "/currencies") };
}

const GROUPS: Group[] = ["main", "gulf", "world"];

export default async function Currencies() {
  const { t, f } = await getI18n();
  const rows = await getRows();
  return (
    <main>
      <PageHead
        crumbs={[{ label: t("nav.currencies") }]}
        title={t("cur.title")}
        lead={t("cur.lead", { n: CODES.length, date: f.fmtDate(rows.at(-1)!.date) })}
      />
      <Section vault id="heat" title={t("cur.map.title")} lead={t("cur.map.lead")}>
        <Heatmap rows={rows} />
      </Section>
      {GROUPS.map((g) => (
        <Section key={g} id={`g-${g}`} title={t(`group.${g}` as "group.main")}>
          <RateList rows={rows} codes={CODES.filter((c) => CURRENCIES[c].group === g)} />
        </Section>
      ))}
    </main>
  );
}
