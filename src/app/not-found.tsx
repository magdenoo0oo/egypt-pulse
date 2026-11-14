import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="font-display text-7xl font-bold text-mute">٤٠٤</p>
      <h1 className="mt-4 font-display text-3xl font-bold">الصفحة دي مش موجودة</h1>
      <p className="mt-3 text-mute">يمكن العملة أو الصفحة اللي بتدوّر عليها لسه مضافتش.</p>
      <ul className="mt-8 flex flex-wrap gap-2">
        {[["/", "الرئيسية"], ["/currencies", "كل العملات"], ["/gold", "الذهب"], ["/convert", "المحوّل"]].map(([h, l]) => (
          <li key={h}>
            <Link href={h} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper-2">{l}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
