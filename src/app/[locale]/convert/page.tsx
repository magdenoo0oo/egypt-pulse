import Link from "next/link";
import type { Metadata } from "next";
import { CurrencyMark } from "@/components/CurrencyMark";
import { MultiConverter } from "@/components/MultiConverter";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { Section } from "@/components/Section";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { CODES, CURRENCIES, getRows, unitOf } from "@/lib/rates";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("conv.meta.title"), description: t("conv.meta.desc"), alternates: altLinks(locale, "/convert") };
}

export default async function Convert() {
  const { t, f, href } = await getI18n();
  const rows = await getRows();
  const last = rows.at(-1)!;
  const options = [
    { code: "egp", name: t("conv.egp"), perOne: 1 },
    ...CODES.map((c) => ({ code: c, name: f.cname(c), perOne: last[c] / unitOf(c) })),
  ];
  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.convert") }]} title={t("conv.title")} lead={t("conv.lead", { n: CODES.length + 1, date: f.fmtDate(last.date) })} />
      <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-6 xl:px-12">
        <Panel vault title={t("conv.panel")} id="c"><MultiConverter options={options} /></Panel>
      </div>
      <Section id="pairs" title={t("conv.pairs.title")} lead={t("conv.pairs.lead")}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CODES.map((c) => (
            <li key={c} className="flex items-center gap-4 rounded-[10px] border border-line p-3">
              <CurrencyMark iso={CURRENCIES[c].iso} size={44} />
              <div className="flex-1">
                <p className="text-lg">{f.cname(c)}</p>
                <p className="text-sm text-mute">{t("val.egp", { v: f.fmt(last[c]) })}</p>
              </div>
              <div className="flex flex-col text-sm">
                <Link href={href(`/convert/${c}-to-egp`)} className="inline-flex min-h-9 items-center text-note underline">{t("conv.toEgpShort")}</Link>
                <Link href={href(`/convert/egp-to-${c}`)} className="inline-flex min-h-9 items-center text-note underline">{t("conv.fromEgpShort")}</Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
