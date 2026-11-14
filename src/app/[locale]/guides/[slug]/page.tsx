import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentNotice } from "@/components/ContentNotice";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Prose } from "@/components/Prose";
import { getContent } from "@/content";
import { GUIDES } from "@/content/guides";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { SITE } from "@/lib/currencies";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const g = getContent(locale).guides.find((x) => x.slug === slug);
  return g ? { title: g.title, description: g.summary, alternates: altLinks(locale, `/guides/${slug}`) } : {};
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guides/[slug]">) {
  const { slug } = await params;
  const { t, href, locale } = await getI18n();
  const { guides } = getContent(locale);
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const others = guides.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.summary, inLanguage: locale === "ar" ? "ar" : "en", mainEntityOfPage: `${SITE.url}${href(`/guides/${slug}`)}` }} />
      <PageHead crumbs={[{ href: "/guides", label: t("nav.guides") }, { label: g.title }]} title={g.title} lead={`${g.summary} (${t("guide.minutes", { n: g.minutes })})`} />
      <ContentNotice />
      <div className="mx-auto mt-8 grid max-w-page gap-12 px-4 sm:px-6 xl:px-12 lg:grid-cols-[minmax(0,46rem)_20rem] lg:justify-between">
        <article lang={locale === "ar" ? "ar" : "en"} dir={locale === "ar" ? "rtl" : "ltr"}><Prose blocks={g.blocks} /></article>
        <aside className="grid h-fit gap-8 lg:sticky lg:top-6">
          <section aria-labelledby="rel">
            <h2 id="rel" className="font-display text-xl font-bold">{t("guide.seeRates")}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {g.links.map((l) => (
                <li key={l.href}><Link href={href(l.href)} className="flex min-h-11 items-center hover:underline">{l.label}</Link></li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="more">
            <h2 id="more" className="font-display text-xl font-bold">{t("guide.more")}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {others.map((o) => (
                <li key={o.slug}><Link href={href(`/guides/${o.slug}`)} className="flex min-h-11 items-center py-2 hover:underline">{o.title}</Link></li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
