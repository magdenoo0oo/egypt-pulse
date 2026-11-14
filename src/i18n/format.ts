import { CURRENCIES, type Code } from "@/lib/currencies";
import { LOCALE_META, type Locale } from "./config";

/** Everything number/date/name related, bound to one locale. Pure and isomorphic (server and client). */
export function makeFormat(locale: Locale) {
  const { tag, dir } = LOCALE_META[locale];
  const rtl = dir === "rtl";
  const nf = (min: number, max: number) => new Intl.NumberFormat(tag, { minimumFractionDigits: min, maximumFractionDigits: max });
  const n2 = nf(2, 2), n0 = nf(0, 0), nUp4 = nf(2, 4);
  /** Arabic letter mark keeps +/− on the reading-start side of an Arabic number inside RTL text. */
  const mark = rtl ? "؜" : "";
  const pctSign = new Intl.NumberFormat(tag, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pctPlain = new Intl.NumberFormat(tag, { style: "percent", maximumFractionDigits: 0 });
  const digits = Array.from({ length: 10 }, (_, i) => new Intl.NumberFormat(tag, { useGrouping: false }).format(i)).join("");
  const dn = new Intl.DisplayNames(tag, { type: "currency" });
  const date = {
    long: new Intl.DateTimeFormat(tag, { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }),
    short: new Intl.DateTimeFormat(tag, { timeZone: "UTC", day: "numeric", month: "short" }),
    month: new Intl.DateTimeFormat(tag, { timeZone: "UTC", month: "short" }),
    monthYear: new Intl.DateTimeFormat(tag, { timeZone: "UTC", month: "short", year: "2-digit" }),
  };
  const dateTime = new Intl.DateTimeFormat(tag, { timeZone: "Africa/Cairo", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
  const sgn = (n: number) => (n === 0 ? "" : mark) + (n > 0 ? "+" : n < 0 ? "−" : "");

  return {
    locale, tag, dir, rtl, digits,
    fmt: (n: number) => n2.format(n),
    fmtInt: (n: number) => n0.format(n),
    /** Plain number with at most `max` decimals. */
    fmtNum: (n: number, max = 2) => nf(0, max).format(n),
    fmtSigned: (n: number) => `${sgn(n)}${n2.format(Math.abs(n))}`,
    fmtPct: (n: number) => `${sgn(n)}${pctSign.format(Math.abs(n) / 100)}`,
    /** Unsigned whole percent from a 0-100 value. */
    fmtPctPlain: (n: number) => pctPlain.format(n / 100),
    /** Unsigned percent from a signed percent value (for "rose 0.22%" sentences). */
    fmtPctAbs: (n: number) => pctSign.format(Math.abs(n) / 100),
    fmtRate: (n: number) => (n < 1 ? nUp4.format(n) : n2.format(n)),
    fmtDate: (iso: string, style: "long" | "short" = "long") => date[style].format(new Date(`${iso}T00:00:00Z`)),
    fmtMonth: (iso: string) => date.month.format(new Date(`${iso}T00:00:00Z`)),
    fmtMonthYear: (iso: string) => date.monthYear.format(new Date(`${iso}T00:00:00Z`)),
    fmtDateTime: (iso: string) => dateTime.format(new Date(iso)),
    /** Signed number with the direction mark, for custom strings. */
    sign: sgn,
    /** Currency name: the curated Arabic names for `ar`, the platform's localized names elsewhere. */
    cname: (c: Code) => (locale === "ar" ? CURRENCIES[c].name : dn.of(CURRENCIES[c].iso) ?? CURRENCIES[c].iso),
    /** Short unit label used in sentences ("per dollar"): curated Arabic, the ISO code elsewhere. */
    cshort: (c: Code) => (locale === "ar" ? CURRENCIES[c].short : CURRENCIES[c].iso),
  };
}
export type Format = ReturnType<typeof makeFormat>;
