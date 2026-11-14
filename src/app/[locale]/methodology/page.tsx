import type { Metadata } from "next";
import { ContentNotice } from "@/components/ContentNotice";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { Prose } from "@/components/Prose";
import { getContent } from "@/content";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { CODES } from "@/lib/currencies";
import { getMeta } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("meth.meta.title"), description: t("meth.meta.desc"), alternates: altLinks(locale, "/methodology") };
}

export default async function Methodology() {
  const { t, f, locale } = await getI18n();
  const meta = await getMeta();
  const blocks = getContent(locale).methodology(f.fmtDate(meta.latestDate));
  const lang = locale === "ar" ? "ar" : "en";
  return (
    <main>
      <PageHead crumbs={[{ label: t("footer.methodology") }]} title={t("footer.methodology")} lead={t("meth.lead")} />
      <ContentNotice />
      <div className="mx-auto mt-8 grid max-w-page gap-10 px-4 sm:px-6 xl:px-12 lg:grid-cols-[minmax(0,46rem)_22rem] lg:justify-between">
        <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}><Prose blocks={blocks} /></div>
        <aside className="h-fit lg:sticky lg:top-6">
          <Panel vault title={t("meth.facts")} id="facts">
            <dl className="grid gap-4">
              <div><dt className="text-sm text-mute">{t("meth.f.latest")}</dt><dd className="font-display text-2xl font-bold">{f.fmtDate(meta.latestDate)}</dd></div>
              <div><dt className="text-sm text-mute">{t("meth.f.days")}</dt><dd className="font-display text-2xl font-bold">{f.fmtInt(meta.days)}</dd></div>
              <div><dt className="text-sm text-mute">{t("meth.f.currencies")}</dt><dd className="font-display text-2xl font-bold">{f.fmtInt(CODES.length)}</dd></div>
              <div><dt className="text-sm text-mute">{t("meth.f.update")}</dt><dd className="text-lg">{t("meth.f.daily")}</dd></div>
            </dl>
          </Panel>
        </aside>
      </div>
    </main>
  );
}
