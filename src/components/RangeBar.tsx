import { getI18n } from "@/i18n/server";

/** Where a value sits between a low and a high. Marker position is also stated in text for assistive tech. */
export async function RangeBar({ min, max, value, lo, hi, label }: { min: number; max: number; value: number; lo: string; hi: string; label: string }) {
  const { t, f } = await getI18n();
  const p = max === min ? 50 : ((value - min) / (max - min)) * 100;
  return (
    <div role="img" aria-label={t("range.aria", { label, p: f.fmtPctPlain(p), lo, hi })}>
      <div className="relative h-8">
        <div aria-hidden className="engrave absolute inset-x-0 top-3 h-2 rounded-full border border-line" />
        <div aria-hidden className="absolute top-0 h-8 w-0.5 bg-note" style={{ insetInlineStart: `${p}%` }} />
        <div aria-hidden className="absolute -top-0.5 size-3 -translate-x-1/2 rotate-45 bg-note rtl:translate-x-1/2" style={{ insetInlineStart: `${p}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-sm text-mute">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}
