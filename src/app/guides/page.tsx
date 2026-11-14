import Link from "next/link";
import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Section } from "@/components/Section";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "أدلة الذهب والعملات: شرح مبسّط",
  description: "أدلة بالعربي المبسّط عن قراءة سعر الذهب والعيارات والمصنعية وسعر الصرف وإزاي تحوّل عملة صح.",
  alternates: { canonical: "/guides" },
};

const CATS = { gold: "الذهب", currency: "العملات", basics: "أساسيات" } as const;

export default function Guides() {
  return (
    <main>
      <PageHead crumbs={[{ label: "الأدلة" }]} title="الأدلة" lead="شرح مبسّط ومن غير مصطلحات معقدة. للتعلّم، مش نصيحة مالية." />
      {(Object.keys(CATS) as (keyof typeof CATS)[]).map((c) => {
        const list = GUIDES.filter((g) => g.category === c);
        return list.length ? (
          <Section key={c} id={`c-${c}`} title={CATS[c]}>
            <ul className="divide-y divide-line border-y border-line">
              {list.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="grid gap-1 py-6 hover:bg-paper-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-10 sm:px-4">
                    <span>
                      <span className="block font-display text-2xl font-bold sm:text-3xl">{g.title}</span>
                      <span className="mt-2 block max-w-[62ch] text-mute">{g.summary}</span>
                    </span>
                    <span className="text-sm text-mute">{g.minutes} دقايق قراءة</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      })}
      <Section id="gl" title="مش فاهم مصطلح؟">
        <Link href="/glossary" className="inline-flex min-h-12 items-center rounded-md bg-ink px-6 text-paper hover:opacity-90">قاموس المصطلحات</Link>
      </Section>
    </main>
  );
}
