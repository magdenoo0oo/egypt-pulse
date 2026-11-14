import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/currencies";

export type Crumb = { href?: string; label: string };

/** Breadcrumbs (with structured data), title, lead and an optional right-hand slot. */
export function PageHead({ crumbs, title, lead, icon, children }: { crumbs: Crumb[]; title: string; lead?: string; icon?: ReactNode; children?: ReactNode }) {
  const all = [{ href: "/", label: "الرئيسية" }, ...crumbs];
  return (
    <header className="mx-auto max-w-page px-4 pt-5 sm:px-6 xl:px-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE.url}${c.href === "/" ? "" : c.href}` } : {}) })),
        }}
      />
      <nav aria-label="مسار الصفحة" className="text-sm text-mute">
        <ol className="flex flex-wrap items-center gap-x-2">
          {all.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {c.href ? <Link href={c.href} className="inline-flex min-h-11 items-center hover:underline">{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              {i < all.length - 1 && <span aria-hidden>‹</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
            {lead && <p className="mt-2 max-w-[62ch] text-lg text-mute">{lead}</p>}
          </div>
        </div>
        {children}
      </div>
      <div aria-hidden className="engrave mt-5 h-3 border-y border-line" />
    </header>
  );
}
