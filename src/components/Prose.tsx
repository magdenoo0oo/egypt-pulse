import type { Block } from "@/content/guides";

/** Long-form Arabic text in the naskh face. Line length stays under ~70 characters. */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-[62ch] font-serif text-xl leading-[2]">
      {blocks.map((b, i) =>
        b.type === "h" ? (
          <h2 key={i} className="mb-2 mt-10 font-display text-2xl font-bold leading-snug">{b.text}</h2>
        ) : b.type === "p" ? (
          <p key={i} className="mt-4">{b.text}</p>
        ) : b.type === "ul" ? (
          <ul key={i} className="mt-4 list-disc space-y-2 ps-6 marker:text-note">
            {b.items.map((it) => <li key={it}>{it}</li>)}
          </ul>
        ) : (
          <p key={i} className="mt-6 border-s-4 border-gold bg-paper-2 p-4 text-lg">{b.text}</p>
        ),
      )}
    </div>
  );
}
