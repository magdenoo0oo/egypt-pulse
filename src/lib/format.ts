const num = (d: number) =>
  new Intl.NumberFormat("ar-EG", { minimumFractionDigits: d, maximumFractionDigits: d });
const n2 = num(2);
/** Arabic letter mark: keeps +/− on the reading-start side of an Arabic number inside RTL text. */
const ALM = "\u061C";
const n0 = num(0);

export const fmt = (n: number) => n2.format(n);
export const fmtInt = (n: number) => n0.format(n);
export const fmtSigned = (n: number) => `${n === 0 ? "" : ALM}${n > 0 ? "+" : n < 0 ? "−" : ""}${n2.format(Math.abs(n))}`;
export const fmtPct = (n: number) => `${n === 0 ? "" : ALM}${n > 0 ? "+" : n < 0 ? "−" : ""}${n2.format(Math.abs(n))}٪`;
export const fmtDate = (iso: string, style: "long" | "short" = "long") =>
  new Intl.DateTimeFormat("ar-EG", {
    timeZone: "UTC",
    ...(style === "long" ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short" }),
  }).format(new Date(iso));

/** Large or small rates need more digits to stay meaningful (e.g. 0.0318). */
export const fmtRate = (n: number) =>
  new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: n < 1 ? 4 : 2 }).format(n);

export const fmtCompact = (n: number) => new Intl.NumberFormat("ar-EG", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("ar-EG", { timeZone: "Africa/Cairo", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
