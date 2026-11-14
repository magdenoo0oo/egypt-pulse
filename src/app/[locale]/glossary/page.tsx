import type { Metadata } from "next";
import { ContentNotice } from "@/components/ContentNotice";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { getContent } from "@/content";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("gl.meta.title"), description: t("gl.meta.desc"), alternates: altLinks(locale, "/glossary") };
}

export default async function Glossary() {
  const { t, locale } = await getI18n();
  const { glossary } = getContent(locale);
  const lang = locale === "ar" ? "ar" : "en";
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: t("gl.meta.title"), inLanguage: lang, hasDefinedTerm: glossary.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.def })) }} />
      <PageHead crumbs={[{ href: "/guides", label: t("nav.guides") }, { label: t("footer.glossary") }]} title={t("footer.glossary")} lead={t("gl.lead", { n: glossary.length })} />
      <ContentNotice />
      <dl lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto mt-8 grid max-w-page gap-x-12 px-4 sm:px-6 xl:px-12 md:grid-cols-2 xl:grid-cols-3">
        {glossary.map((g) => (
          <div key={g.term} className="border-b border-line py-5">
            <dt className="font-display text-2xl font-bold">
              {g.term} {g.latin && <span dir="ltr" className="ms-2 font-sans text-sm font-normal text-mute">{g.latin}</span>}
            </dt>
            <dd className="mt-1 max-w-[56ch] font-serif text-lg leading-8">{g.def}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
