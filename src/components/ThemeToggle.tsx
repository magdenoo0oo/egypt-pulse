"use client";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const snapshot = () => document.documentElement.dataset.theme === "dark";

/** Light by default; dark is stored in localStorage and applied before paint by the inline script in the layout. */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      type="button"
      aria-pressed={dark}
      onClick={() => {
        const next = !dark;
        if (next) document.documentElement.dataset.theme = "dark";
        else delete document.documentElement.dataset.theme;
        try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
      }}
      className="inline-flex min-h-11 items-center rounded-md border border-line px-3 hover:bg-paper-2"
    >
      {dark ? "الوضع الفاتح" : "الوضع الداكن"}
    </button>
  );
}
