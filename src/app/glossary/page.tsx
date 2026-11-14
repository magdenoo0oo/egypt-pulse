import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { GLOSSARY } from "@/content/glossary";

export const metadata: Metadata = {
  title: "قاموس مصطلحات العملات والذهب",
  description: "شرح مبسّط لمصطلحات سعر الصرف والذهب والأسواق: mid-market، السبريد، العيار، المصنعية، الدمغة، الأوقية وغيرها.",
  alternates: { canonical: "/glossary" },
};

export default function Glossary() {
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "قاموس مصطلحات العملات والذهب", hasDefinedTerm: GLOSSARY.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.def })) }} />
      <PageHead crumbs={[{ href: "/guides", label: "الأدلة" }, { label: "القاموس" }]} title="قاموس المصطلحات" lead={`${GLOSSARY.length} مصطلح بتقابله في أسعار العملات والذهب، مشروحة ببساطة.`} />
      <dl className="mx-auto mt-10 grid max-w-page gap-x-12 px-4 sm:px-6 md:grid-cols-2">
        {GLOSSARY.map((g) => (
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
