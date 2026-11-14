import type { ReactNode } from "react";

/** Page section: a heading with a short lead, then content. Sections alternate paper and vault bands. */
export function Section({
  id, title, lead, aside, vault = false, children, className = "",
}: { id: string; title: string; lead?: string; aside?: ReactNode; vault?: boolean; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={`${vault ? "vault mt-14 py-10 lg:mt-16 lg:py-12" : "mt-14 lg:mt-16"} ${className}`}>
      <div className="mx-auto max-w-page px-4 sm:px-6 xl:px-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id={id} className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
            {lead && <p className="mt-2 max-w-[60ch] text-lg text-mute">{lead}</p>}
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}
