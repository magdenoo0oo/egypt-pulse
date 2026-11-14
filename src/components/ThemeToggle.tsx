"use client";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const snapshot = () => document.documentElement.dataset.theme === "dark";

/** Icon button. Light by default; dark is stored in localStorage and applied before paint by the layout's inline script. */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  const label = dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن";
  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={label}
      title={label}
      onClick={() => {
        const next = !dark;
        if (next) document.documentElement.dataset.theme = "dark";
        else delete document.documentElement.dataset.theme;
        try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
      }}
      className="inline-flex size-11 items-center justify-center rounded-md border border-line hover:bg-paper-2"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </>
        ) : (
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        )}
      </svg>
    </button>
  );
}
