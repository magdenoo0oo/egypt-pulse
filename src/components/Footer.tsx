import Link from "next/link";
import { getContent } from "@/content";
import { CODES, GOLD_TYPES } from "@/lib/currencies";
import { getMeta } from "@/lib/rates";
import { getI18n } from "@/i18n/server";

const link = "inline-flex min-h-9 items-center hover:underline";

export async function Footer() {
  const { t, f, href, locale } = await getI18n();
  const m = await getMeta();
  const { guides } = getContent(locale);
  return (
    <footer className="vault mt-16">
      <div aria-hidden className="engrave h-3 border-b border-line" />
      <div className="mx-auto grid max-w-page gap-10 px-4 py-10 sm:px-6 xl:px-12 md:grid-cols-[1.3fr_1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-bold">{t("brand")}</p>
          <p className="mt-3 max-w-[38ch] text-mute">{t("footer.tagline")}</p>
          <p className="mt-4 max-w-[38ch] text-sm text-mute">{t("footer.disclaimer")}</p>
        </div>
        <nav aria-label={t("footer.currencies")}>
          <h2 className="font-display text-xl font-bold">{t("footer.currencies")}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4">
            {CODES.map((c) => (
              <li key={c}><Link href={href(`/currency/${c}`)} className={link}>{f.cname(c)}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("footer.goldSilver")}>
          <h2 className="font-display text-xl font-bold">{t("footer.goldSilver")}</h2>
          <ul className="mt-3">
            {GOLD_TYPES.map((g) => (
              <li key={g}><Link href={href(`/gold/${g}`)} className={link}>{t(`gold.${g}` as "gold.24")}</Link></li>
            ))}
            <li><Link href={href("/silver")} className={link}>{t("nav.silver")}</Link></li>
          </ul>
          <h2 className="mt-6 font-display text-xl font-bold">{t("footer.tools")}</h2>
          <ul className="mt-3">
            <li><Link href={href("/convert")} className={link}>{t("nav.convert")}</Link></li>
            <li><Link href={href("/movers")} className={link}>{t("nav.movers")}</Link></li>
            {([["/race", "nav.race"], ["/map", "nav.map"], ["/matrix", "nav.matrix"], ["/volatility", "nav.volatility"], ["/day", "nav.archive"]] as const).map(([h, k]) => (
              <li key={h}><Link href={href(h)} className={link}>{t(k)}</Link></li>
            ))}
            <li><Link href={href("/developers")} className={link}>{t("footer.api")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("footer.guides")}>
          <h2 className="font-display text-xl font-bold">{t("footer.guides")}</h2>
          <ul className="mt-3">
            {guides.map((g) => (
              <li key={g.slug}><Link href={href(`/guides/${g.slug}`)} className={link}>{g.title}</Link></li>
            ))}
            <li><Link href={href("/glossary")} className={link}>{t("footer.glossary")}</Link></li>
            <li><Link href={href("/methodology")} className={link}>{t("footer.methodology")}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm text-mute sm:px-6 xl:px-12">
          <p>{t("footer.checked", { date: f.fmtDateTime(m.checkedAt) })}</p>
          <p>
            {t("footer.charts")}{" "}
            <a href="https://www.tradingview.com/" className="underline" rel="noopener">TradingView Lightweight Charts™</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
