"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

export type NavLink = { label: string; href: string; hint?: string };
export type NavSection = { title?: string; links: NavLink[] };
export type NavGroup = { id: string; label: string; cols: 1 | 2 | 3 | 5; sections: NavSection[]; footer?: NavLink };
/** `show` surfaces a direct link in the bar only from that width up, so wide screens fill with shortcuts. */
export type NavLeaf = { id: string; label: string; href: string; show?: "xl" | "2xl" | "3xl" };
export type NavItem = NavGroup | NavLeaf;
const SHOW = { xl: "hidden xl:inline-flex", "2xl": "hidden 2xl:inline-flex", "3xl": "hidden min-[1800px]:inline-flex" } as const;

const isGroup = (i: NavItem): i is NavGroup => "sections" in i;

/**
 * Header menus. Desktop: group buttons open a full-width sheet under the header. Mobile: one Menu button opens
 * the same groups as an accordion. Click, Escape and outside-click close; choosing a link closes. Opacity/transform only.
 */
export function HeaderNav({ items, menuLabel, navLabel, children }: { items: NavItem[]; menuLabel: string; navLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState<string | null>(null); // desktop sheet / mobile accordion section
  const [mobile, setMobile] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const path = usePathname() ?? "/";
  const first = path.split("/")[1];
  const bare = first && (LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE ? path.slice(first.length + 1) || "/" : path;
  const here = (h: string) => {
    const hb = h.replace(new RegExp(`^/(${LOCALES.filter((l) => l !== DEFAULT_LOCALE).join("|")})(?=/|$)`), "") || "/";
    return hb === bare;
  };

  const close = () => { setOpen(null); setMobile(false); };
  // Hover opens a menu on mouse; a short grace period lets the pointer cross the gap into the sheet.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hold = () => clearTimeout(timer.current);
  const release = (e: React.PointerEvent) => { if (e.pointerType === "mouse") { hold(); timer.current = setTimeout(() => setOpen(null), 220); } };
  const enter = (id: string | null, e: React.PointerEvent) => { if (e.pointerType === "mouse") { hold(); setOpen(id); } };
  useEffect(() => {
    if (open === null && !mobile) return;
    const away = (e: PointerEvent) => !root.current?.parentElement?.contains(e.target as Node) && close();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open, mobile]);

  const link = "min-h-12 cursor-pointer items-center whitespace-nowrap rounded-md px-3 text-base hover:bg-paper-2 xl:px-4 xl:text-lg";
  const grp = items.filter(isGroup).find((g) => g.id === open);

  const body = (g: NavGroup, cols: string) => (
    <div className={`grid gap-x-8 gap-y-5 ${cols}`}>
      {g.sections.map((s, i) => (
        <div key={i}>
          {s.title && <h3 className="mb-1 font-display text-lg font-bold">{s.title}</h3>}
          <ul>
            {s.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} aria-current={here(l.href) ? "page" : undefined}
                  className={`flex min-h-11 rounded-md px-2 hover:bg-paper-2 aria-[current=page]:text-note aria-[current=page]:underline ${l.hint && l.hint.length <= 4 ? "items-center justify-between gap-3" : "flex-col justify-center"}`}>
                  <span>{l.label}</span>
                  {l.hint && <span className={`text-sm text-mute ${l.hint.length <= 4 ? "font-display" : ""}`}>{l.hint}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <nav ref={root} aria-label={navLabel} className="hidden flex-1 items-center justify-evenly lg:flex">
        {items.map((it) =>
          isGroup(it) ? (
            <button key={it.id} type="button" aria-expanded={open === it.id} aria-controls={`menu-${it.id}`}
              onClick={() => setOpen(open === it.id ? null : it.id)}
              onPointerEnter={(e) => enter(it.id, e)} onPointerLeave={release}
              className={`${link} inline-flex gap-1.5 ${open === it.id ? "bg-paper-2" : ""}`}>
              {it.label}
              <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden className={`transition-transform ${open === it.id ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ) : (
            <Link key={it.id} href={it.href} className={`${link} ${it.show ? SHOW[it.show] : "inline-flex"}`} aria-current={here(it.href) ? "page" : undefined} onClick={close} onPointerEnter={(e) => enter(null, e)}>{it.label}</Link>
          ),
        )}
      </nav>

      <span className="ms-auto flex items-center gap-2 lg:ms-2">
        {children}
        <button type="button" aria-expanded={mobile} aria-controls="menu-mobile" onClick={() => { setMobile((v) => !v); setOpen(null); }}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-line px-3 hover:bg-paper-2 lg:hidden">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          <span className="sr-only sm:not-sr-only">{menuLabel}</span>
        </button>
      </span>

      {grp && (
        <div id={`menu-${grp.id}`} onPointerEnter={(e) => enter(grp.id, e)} onPointerLeave={release}
          className="menu-sheet absolute inset-x-0 top-full z-40 hidden border-b border-line bg-paper shadow-lg lg:block">
          <div className="mx-auto max-w-page px-4 py-5 sm:px-6 xl:px-12">
            {body(grp, grp.cols === 3 ? "grid-cols-3" : grp.cols === 5 ? "grid-cols-5" : grp.cols === 2 ? "grid-cols-2 max-w-3xl" : "max-w-sm")}
            {grp.footer && (
              <Link href={grp.footer.href} onClick={close} className="mt-3 inline-flex min-h-11 items-center text-note underline">{grp.footer.label}</Link>
            )}
          </div>
        </div>
      )}

      {mobile && (
        <div id="menu-mobile" className="menu-sheet absolute inset-x-0 top-full z-40 max-h-[80vh] overflow-y-auto border-b border-line bg-paper px-4 py-2 shadow-lg sm:px-6 lg:hidden">
          <ul className="divide-y divide-line">
            {items.filter((it) => isGroup(it) || !it.show).map((it) => (
              <li key={it.id}>
                {isGroup(it) ? (
                  <>
                    <button type="button" aria-expanded={open === it.id} onClick={() => setOpen(open === it.id ? null : it.id)}
                      className="flex min-h-12 w-full items-center justify-between text-start font-display text-xl font-bold">
                      {it.label}
                      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden className={`transition-transform ${open === it.id ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    {open === it.id && (
                      <div className="pb-3">
                        {body(it, it.cols >= 2 && it.sections.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}
                        {it.footer && <Link href={it.footer.href} onClick={close} className="mt-2 inline-flex min-h-11 items-center text-note underline">{it.footer.label}</Link>}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={it.href} onClick={close} className="flex min-h-12 items-center font-display text-xl font-bold">{it.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
