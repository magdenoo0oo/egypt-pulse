import type { ReactNode } from "react";

/** A titled data panel. `vault` flips it to the dark engraved surface. */
export function Panel({
  title, id, aside, vault = false, children, className = "",
}: { title?: string; id?: string; aside?: ReactNode; vault?: boolean; children: ReactNode; className?: string }) {
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={`${vault ? "vault border-vault" : "bg-paper-2"} min-w-0 overflow-hidden rounded-[10px] border border-line ${className}`}
    >
      <div aria-hidden className="engrave h-2 border-b border-line" />
      <div className="p-5 sm:p-6">
        {title && (
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id={id} className="font-display text-2xl font-bold">{title}</h2>
            {aside && <div className="text-sm text-mute">{aside}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
