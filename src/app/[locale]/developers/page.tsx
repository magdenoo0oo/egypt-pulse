import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Panel } from "@/components/Panel";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { CODES, GOLD_TYPES } from "@/lib/currencies";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return { title: t("dev.meta.title"), description: t("dev.meta.desc"), alternates: altLinks(locale, "/developers") };
}

export default async function Developers() {
  const { t } = await getI18n();
  const endpoints = [
    ["GET /api/v1/currencies", t("dev.ep1")],
    ["GET /api/v1/rates", t("dev.ep2")],
    ["GET /api/v1/rates/usd?days=30", t("dev.ep3")],
    ["GET /api/v1/convert?from=usd&to=egp&amount=100", t("dev.ep4")],
    ["GET /api/v1/gold", t("dev.ep5")],
    ["GET /api/v1/gold/21?days=90", t("dev.ep6", { types: GOLD_TYPES.join(", ") })],
    ["GET /api/v1/silver", t("dev.ep7")],
  ];
  return (
    <main>
      <PageHead crumbs={[{ label: t("nav.api") }]} title={t("dev.title")} lead={t("dev.lead")} />
      <div className="mx-auto mt-6 grid max-w-page gap-4 px-4 sm:px-6 xl:px-12 lg:grid-cols-[1.4fr_1fr]">
        <Panel title={t("dev.endpoints")} id="ep">
          <ul className="divide-y divide-line">
            {endpoints.map(([path, desc]) => (
              <li key={path} className="py-4">
                <code dir="ltr" className="block overflow-x-auto text-start font-mono text-base text-note">{path}</code>
                <p className="mt-1 text-mute">{desc}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <Panel vault title={t("dev.example")} id="ex">
            <pre dir="ltr" className="overflow-x-auto text-start text-sm leading-7">
{`curl "https://YOUR-DOMAIN/api/v1/convert?from=usd&to=egp&amount=100"

{
  "from": "USD",
  "to": "EGP",
  "amount": 100,
  "rate": 53.4356,
  "result": 5343.56
}`}
            </pre>
          </Panel>
          <Panel title={t("dev.codes")} id="codes">
            <p dir="ltr" className="text-start font-mono text-sm leading-7">egp, {CODES.join(", ")}</p>
            <p className="mt-3 text-sm text-mute">{t("dev.codesNote")}</p>
          </Panel>
        </div>
      </div>
    </main>
  );
}
