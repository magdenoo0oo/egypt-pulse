import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getMeta } from "@/lib/rates";
import { fmtDate } from "@/lib/format";

async function FreshnessNote() {
  const m = await getMeta();
  return (
    <p className="mt-2">
      آخر فحص للبيانات: {fmtDate(m.checkedAt)}. آخر يوم متاح: {fmtDate(m.latestDate)}.
    </p>
  );
}

const reem = Reem_Kufi({ variable: "--font-reem", subsets: ["arabic", "latin"], weight: ["500", "700"] });
const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["arabic", "latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: { default: "تسعيرة: أسعار الدولار والذهب بالجنيه المصري كل يوم", template: "%s | تسعيرة" },
  description: "أسعار العملات والذهب مقابل الجنيه المصري، بتاريخ كامل وAPI مفتوح، بتتحدّث كل يوم.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${reem.variable} ${plex.variable} antialiased`}>
      <body className="min-h-screen">
        <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            تسعيرة
          </Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/" className="hover:underline">الأسعار</Link>
            <Link href="/developers" className="hover:underline">للمطوّرين</Link>
          </nav>
        </header>
        {children}
        <footer className="mx-auto mt-24 max-w-5xl px-4 pb-10 text-sm text-mute">
          <div className="border-t border-line pt-6">
            <p className="max-w-[60ch]">
              الأسعار مرجعية (mid-market) مأخوذة من السوق العالمي، مش أسعار البنوك أو الصاغة. الفرق في السوق
              المحلي ممكن يبقى كبير، وسعر الذهب بيزيد عليه مصنعية.
            </p>
            <FreshnessNote />
          </div>
        </footer>
      </body>
    </html>
  );
}
