import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  ["/currencies", "nav.currencies"],
  ["/gold", "nav.gold"],
  ["/silver", "nav.silver"],
  ["/convert", "nav.convert"],
  ["/movers", "nav.movers"],
  ["/guides", "nav.guides"],
  ["/developers", "nav.api"],
] as const;

export async function Header() {
  const { t, href } = await getI18n();
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-page flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:px-12">
        <Link href={href("/")} className="inline-flex min-h-11 items-center gap-3" aria-label={t("site.homeAria", { name: t("brand") })}>
          <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="text-note">
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <g fill="none" stroke="currentColor" strokeWidth="0.9">
              {[0, 30, 60, 90, 120, 150].map((a) => (
                <ellipse key={a} cx="20" cy="20" rx="14" ry="5.5" transform={`rotate(${a} 20 20)`} />
              ))}
            </g>
            <circle cx="20" cy="20" r="3" fill="var(--gold)" />
          </svg>
          <span className="font-display text-3xl font-bold leading-none tracking-tight">{t("brand")}</span>
        </Link>
        <nav aria-label={t("nav.main")} className="flex flex-wrap items-center gap-x-1">
          {NAV.map(([h, k]) => (
            <Link key={h} href={href(h)} className="inline-flex min-h-11 items-center rounded-md px-3 hover:bg-paper-2">
              {t(k)}
            </Link>
          ))}
          <span className="ms-2 flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </span>
        </nav>
      </div>
    </header>
  );
}
