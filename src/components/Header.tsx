import Link from "next/link";
import { getContent } from "@/content";
import { getI18n } from "@/i18n/server";
import { CODES, CURRENCIES, GOLD_TYPES, type Group } from "@/lib/currencies";
import { HeaderNav, type NavItem } from "./HeaderNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const GROUP_ORDER: Group[] = ["main", "gulf", "world"];

export async function Header() {
  const { t, f, href, locale } = await getI18n();
  const { guides } = getContent(locale);

  const items: NavItem[] = [
    {
      id: "currencies", label: t("nav.currencies"), cols: 3,
      sections: GROUP_ORDER.map((g) => ({
        title: t(`group.${g}` as "group.main"),
        links: CODES.filter((c) => CURRENCIES[c].group === g).map((c) => ({ label: f.cname(c), href: href(`/currency/${c}`), hint: CURRENCIES[c].iso })),
      })),
      footer: { label: `${t("nav.allCurrencies")} ←`, href: href("/currencies") },
    },
    ...(["usd", "eur", "sar"] as const).map((c, i) => ({ id: `q-${c}`, label: f.cshort(c), href: href(`/currency/${c}`), show: (i < 2 ? "xl" : "2xl") as "xl" | "2xl" })),
    {
      id: "gold", label: t("footer.goldSilver"), cols: 2,
      sections: [
        { title: t("nav.gold"), links: GOLD_TYPES.map((g) => ({ label: t(`gold.${g}` as "gold.24"), href: href(`/gold/${g}`) })) },
        { title: t("nav.silver"), links: [{ label: t("nav.allGold"), href: href("/gold") }, { label: t("nav.silver"), href: href("/silver") }] },
      ],
    },
    { id: "q-g21", label: `${t("nav.gold")} ${t("gold.21")}`, href: href("/gold/21"), show: "xl" as const },
    { id: "q-pound", label: t("gold.pound"), href: href("/gold/pound"), show: "3xl" as const },
    { id: "q-silver", label: t("nav.silver"), href: href("/silver"), show: "2xl" as const },
    {
      id: "tools", label: t("footer.tools"), cols: 1,
      sections: [{ links: [{ label: t("nav.convert"), href: href("/convert") }, { label: t("nav.movers"), href: href("/movers") }] }],
    },
    {
      id: "explore", label: t("nav.explore"), cols: 5,
      sections: ([["/race", "rc"], ["/map", "mp"], ["/matrix", "mx"], ["/volatility", "vl"], ["/day", "day.idx"]] as const).map(([h, k]) => ({
        links: [{ label: t(`${k}.title` as "rc.title"), href: href(h), hint: t(`${k}.lead` as "rc.lead") }],
      })),
    },
    { id: "q-race", label: t("nav.race"), href: href("/race"), show: "3xl" as const },
    { id: "q-map", label: t("nav.map"), href: href("/map"), show: "3xl" as const },
    { id: "q-matrix", label: t("nav.matrix"), href: href("/matrix"), show: "3xl" as const },
    {
      id: "guides", label: t("nav.guides"), cols: 1,
      sections: [{
        links: [
          ...guides.map((g) => ({ label: g.title, href: href(`/guides/${g.slug}`) })),
          { label: t("footer.glossary"), href: href("/glossary") },
          { label: t("footer.methodology"), href: href("/methodology") },
        ],
      }],
      footer: { label: `${t("nav.guides")} ←`, href: href("/guides") },
    },
    { id: "api", label: t("nav.api"), href: href("/developers") },
  ];

  return (
    <header className="relative z-30 border-b border-line bg-paper">
      <div className="mx-auto flex max-w-page items-center gap-x-4 px-4 py-3 sm:px-6 lg:py-4 xl:gap-x-6 xl:px-12">
        <Link href={href("/")} className="inline-flex min-h-11 shrink-0 items-center gap-3" aria-label={t("site.homeAria", { name: t("brand") })}>
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
        <HeaderNav items={items} menuLabel={t("nav.menu")} navLabel={t("nav.main")}>
          <ThemeToggle />
          <LanguageSwitcher />
        </HeaderNav>
      </div>
    </header>
  );
}
