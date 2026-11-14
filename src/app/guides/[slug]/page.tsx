import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { Prose } from "@/components/Prose";
import { GUIDES } from "@/content/guides";
import { SITE } from "@/lib/currencies";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  return g ? { title: g.title, description: g.summary, alternates: { canonical: `/guides/${slug}` } } : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const i = GUIDES.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const g = GUIDES[i];
  const others = GUIDES.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.summary, inLanguage: "ar", mainEntityOfPage: `${SITE.url}/guides/${slug}` }} />
      <PageHead crumbs={[{ href: "/guides", label: "الأدلة" }, { label: g.title }]} title={g.title} lead={`${g.summary} (${g.minutes} دقايق قراءة)`} />
      <div className="mx-auto mt-8 grid max-w-page gap-12 px-4 sm:px-6 xl:px-12 lg:grid-cols-[minmax(0,46rem)_20rem] lg:justify-between">
        <article><Prose blocks={g.blocks} /></article>
        <aside className="grid h-fit gap-8 lg:sticky lg:top-6">
          <section aria-labelledby="rel">
            <h2 id="rel" className="font-display text-xl font-bold">شوف الأسعار</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {g.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="flex min-h-11 items-center hover:underline">{l.label}</Link></li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="more">
            <h2 id="more" className="font-display text-xl font-bold">أدلة تانية</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {others.map((o) => (
                <li key={o.slug}><Link href={`/guides/${o.slug}`} className="flex min-h-11 items-center py-2 hover:underline">{o.title}</Link></li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
