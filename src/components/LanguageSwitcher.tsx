"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, href } from "@/i18n/config";

/** Globe icon button with a menu of all locales. Switching keeps the current page. */
export function LanguageSwitcher() {
  const { t, locale } = useI18n();
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Path without any locale prefix, so each link points at the same page in another language.
  const first = path.split("/")[1];
  const bare = first && (LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE ? path.slice(first.length + 1) || "/" : path;

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("c.lang.label")}
        title={t("c.lang.label")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-1 rounded-md border border-line px-2.5 hover:bg-paper-2"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9.2" />
          <path d="M2.8 12h18.4M12 2.8c2.6 2.6 3.9 5.7 3.9 9.2s-1.3 6.6-3.9 9.2c-2.6-2.6-3.9-5.7-3.9-9.2S9.4 5.4 12 2.8Z" />
        </svg>
        <span className="text-sm font-semibold uppercase" aria-hidden>{locale}</span>
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-50 mt-2 grid w-64 grid-cols-2 gap-1 rounded-[10px] border border-line bg-paper p-2 shadow-lg">
          {LOCALES.map((l) => (
            <li key={l}>
              <Link
                href={href(l, bare)}
                hrefLang={l}
                lang={l}
                dir={LOCALE_META[l].dir}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-paper-2 aria-[current=true]:bg-ink aria-[current=true]:text-paper"
              >
                {LOCALE_META[l].name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
