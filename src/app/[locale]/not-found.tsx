import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <main>
      <PageHead crumbs={[{ label: "404" }]} title={t("nf.title")} lead={t("nf.lead")} />
      <ul className="mx-auto mt-8 flex max-w-page flex-wrap gap-2 px-4 sm:px-6 xl:px-12">
        {([["/", "crumb.home"], ["/currencies", "nav.currencies"], ["/gold", "nav.gold"], ["/convert", "nav.convert"], ["/guides", "nav.guides"]] as const).map(([h, k]) => (
          <li key={h}><Link href={href(h)} className="inline-flex min-h-11 items-center rounded-md border border-line px-4 hover:bg-paper-2">{t(k)}</Link></li>
        ))}
      </ul>
    </main>
  );
}
