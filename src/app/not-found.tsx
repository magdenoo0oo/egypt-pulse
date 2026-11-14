import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export default function NotFound() {
  return (
    <main>
      <PageHead crumbs={[{ label: "٤٠٤" }]} title="الصفحة دي مش موجودة" lead="يمكن العملة أو الصفحة اللي بتدوّر عليها لسه مضافتش، أو الرابط فيه غلطة." />
      <ul className="mx-auto mt-10 flex max-w-page flex-wrap gap-2 px-4 sm:px-6">
        {[["/", "الرئيسية"], ["/currencies", "كل العملات"], ["/gold", "الذهب"], ["/convert", "المحوّل"], ["/guides", "الأدلة"]].map(([h, l]) => (
          <li key={h}><Link href={h} className="inline-flex min-h-11 items-center rounded-md border border-line px-4 hover:bg-paper-2">{l}</Link></li>
        ))}
      </ul>
    </main>
  );
}
