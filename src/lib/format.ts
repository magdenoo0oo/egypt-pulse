const num = (d: number) =>
  new Intl.NumberFormat("ar-EG", { minimumFractionDigits: d, maximumFractionDigits: d });
const n2 = num(2);
const n0 = num(0);

export const fmt = (n: number) => n2.format(n);
export const fmtInt = (n: number) => n0.format(n);
export const fmtSigned = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${n2.format(Math.abs(n))}`;
export const fmtPct = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${n2.format(Math.abs(n))}٪`;
export const fmtDate = (iso: string, style: "long" | "short" = "long") =>
  new Intl.DateTimeFormat("ar-EG", {
    timeZone: "UTC",
    ...(style === "long" ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short" }),
  }).format(new Date(iso));
