import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Amiri, Reem_Kufi } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { I18nProvider } from "@/i18n/client";
import { LOCALES } from "@/i18n/config";
import { altLinks } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { SITE } from "@/lib/currencies";
import { getRows } from "@/lib/rates";
import "../globals.css";

const reem = Reem_Kufi({ variable: "--font-reem", subsets: ["arabic", "latin"], weight: ["500", "700"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic", "latin"], weight: ["400", "700"], preload: false });
const plex = IBM_Plex_Sans_Arabic({ variable: "--font-plex", subsets: ["arabic", "latin"], weight: ["400", "600"] });
// Cyrillic and extended-Latin glyphs, loaded only when a page actually needs them.
const plexLatin = IBM_Plex_Sans({ variable: "--font-plex-latin", subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "600"], preload: false });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("meta.title"), template: `%s | ${t("brand")}` },
    description: t("meta.description"),
    alternates: altLinks(locale, "/"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const { locale, f, messages } = await getI18n();
  const rows = await getRows();
  const client = Object.fromEntries(Object.entries(messages).filter(([k]) => k.startsWith("c.")));
  return (
    <html
      lang={locale}
      dir={f.dir}
      suppressHydrationWarning
      className={`${reem.variable} ${plex.variable} ${plexLatin.variable} ${amiri.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}` }} />
      </head>
      <body className="min-h-screen">
        <I18nProvider locale={locale} messages={client}>
          <Ticker rows={rows} />
          <Header />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
