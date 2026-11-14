import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";
import { SITE } from "@/lib/currencies";
import "./globals.css";
import { getRows } from "@/lib/rates";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";

const reem = Reem_Kufi({ variable: "--font-reem", subsets: ["arabic", "latin"], weight: ["500", "700"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic", "latin"], weight: ["400", "700"] });
const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["arabic", "latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "تسعيرة: أسعار الدولار والذهب بالجنيه المصري كل يوم", template: "%s | تسعيرة" },
  description: "أسعار العملات والذهب مقابل الجنيه المصري، بتاريخ كامل وAPI مفتوح، بتتحدّث كل يوم.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const rows = await getRows();
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${reem.variable} ${plex.variable} ${amiri.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}` }} />
      </head>
      <body className="min-h-screen">
        <Ticker rows={rows} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
