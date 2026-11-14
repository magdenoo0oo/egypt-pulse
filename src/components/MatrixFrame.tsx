"use client";

import { useState, type ReactNode } from "react";

type Hit = { r: number; c: number; read: string; note: string };

/**
 * Wraps the server-rendered matrix. One delegated handler reads `data-r/c/read/note` off the cell under
 * the pointer, lights its row and column with a scoped <style>, and prints the rate in a live readout.
 * Click or tap pins a cell (touch has no hover). The table itself stays plain, readable HTML.
 */
export function MatrixFrame({ idle, children }: { idle: string; children: ReactNode }) {
  const [hit, setHit] = useState<Hit | null>(null);
  const [pinned, setPinned] = useState(false);

  const read = (el: EventTarget | null): Hit | null => {
    const td = (el as HTMLElement | null)?.closest<HTMLElement>("td[data-r]");
    if (!td) return null;
    return { r: Number(td.dataset.r), c: Number(td.dataset.c), read: td.dataset.read ?? "", note: td.dataset.note ?? "" };
  };

  return (
    <div
      onPointerOver={(e) => { if (!pinned && e.pointerType === "mouse") { const h = read(e.target); if (h) setHit(h); } }}
      onPointerLeave={(e) => { if (!pinned && e.pointerType === "mouse") setHit(null); }}
      onClick={(e) => {
        const h = read(e.target);
        if (!h) return;
        if (pinned && hit?.r === h.r && hit.c === h.c) { setPinned(false); setHit(null); }
        else { setHit(h); setPinned(true); }
      }}
    >
      <p role="status" aria-live="polite" className="mb-3 flex min-h-12 flex-wrap items-baseline gap-x-4 gap-y-1">
        {hit ? (
          <>
            <bdi dir="ltr" className="font-display text-2xl font-bold sm:text-3xl">{hit.read}</bdi>
            <span className="text-mute">{hit.note}</span>
          </>
        ) : (
          <span className="text-mute">{idle}</span>
        )}
      </p>
      {hit && (
        <style>{`.mx [data-r="${hit.r}"],.mx [data-c="${hit.c}"]{box-shadow:inset 0 0 0 999px color-mix(in oklab,var(--note) 16%,transparent)}.mx [data-r="${hit.r}"][data-c="${hit.c}"]{box-shadow:inset 0 0 0 2px var(--note)}.mx th[data-r="${hit.r}"],.mx th[data-c="${hit.c}"]{color:var(--note)}`}</style>
      )}
      {children}
    </div>
  );
}
