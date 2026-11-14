import { JsonLd } from "./JsonLd";

export type QA = { q: string; a: string };

/** Native disclosure list plus FAQPage structured data. */
export function Faq({ items }: { items: QA[] }) {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) }} />
      <div className="divide-y divide-line border-y border-line">
        {items.map((i) => (
          <details key={i.q} className="group">
            <summary className="flex min-h-14 items-center justify-between gap-4 py-3 text-lg font-semibold">
              {i.q}
              <span aria-hidden className="plus text-2xl text-note">+</span>
            </summary>
            <p className="pb-5 pe-8 text-mute">{i.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
