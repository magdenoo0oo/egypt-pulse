import Link from "next/link";
import type { Metadata } from "next";
import { ContentNotice } from "@/components/ContentNotice";
import { PageHead } from "@/components/PageHead";
import { Section } from "@/components/Section";
import { getContent } from "@/content";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("guides.meta.title"), description: t("guides.meta.desc"), alternates: altLinks(locale, "/guides") };
}

const CATS = ["gold", "currency", "basics"] as const;

export default async function Guides() {
  const { t, href, locale } = await getI18n();
  const { guides } = getContent(locale);
  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.guides") }]} title={t("nav.guides")} lead={t("guides.lead")} />
      <ContentNotice />
      {CATS.map((c) => {
        const list = guides.filter((g) => g.category === c);
        return list.length ? (
          <Section key={c} id={`c-${c}`} title={t(`cat.${c}` as "cat.gold")}>
            <ul className="divide-y divide-line border-y border-line">
              {list.map((g) => (
                <li key={g.slug}>
                  <Link href={href(`/guides/${g.slug}`)} className="grid gap-1 py-6 hover:bg-paper-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-10 sm:px-4">
                    <span>
                      <span className="block font-display text-2xl font-bold sm:text-3xl">{g.title}</span>
                      <span className="mt-2 block max-w-[62ch] text-mute">{g.summary}</span>
                    </span>
                    <span className="text-sm text-mute">{t("guide.minutes", { n: g.minutes })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      })}
      <Section id="gl" title={t("guides.gl.title")}>
        <Link href={href("/glossary")} className="inline-flex min-h-12 items-center rounded-md bg-ink px-6 text-paper hover:opacity-90">{t("footer.glossary")}</Link>
      </Section>
    </main>
  );
}
