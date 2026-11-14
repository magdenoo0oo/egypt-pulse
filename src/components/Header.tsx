import Link from "next/link";
import { SITE } from "@/lib/currencies";

const NAV = [
  ["/currencies", "العملات"],
  ["/gold", "الذهب"],
  ["/silver", "الفضة"],
  ["/convert", "المحوّل"],
  ["/movers", "الحركة"],
  ["/guides", "الأدلة"],
  ["/developers", "API"],
] as const;

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-page flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="inline-flex min-h-11 items-center gap-3" aria-label={`${SITE.name}، الرئيسية`}>
          <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="text-note">
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <g fill="none" stroke="currentColor" strokeWidth="0.9">
              {[0, 30, 60, 90, 120, 150].map((a) => (
                <ellipse key={a} cx="20" cy="20" rx="14" ry="5.5" transform={`rotate(${a} 20 20)`} />
              ))}
            </g>
            <circle cx="20" cy="20" r="3" fill="var(--gold)" />
          </svg>
          <span className="font-display text-3xl font-bold leading-none tracking-tight">{SITE.name}</span>
        </Link>
        <nav aria-label="التنقل الرئيسي" className="flex flex-wrap gap-x-1">
          {NAV.map(([h, l]) => (
            <Link key={h} href={h} className="inline-flex min-h-11 items-center rounded-md px-3 hover:bg-paper-2">
              {l}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
