import { ColorType, CrosshairMode, type ChartOptions, type DeepPartial, type Time } from "lightweight-charts";

export type Pt = { date: string; v: number };
export type Token = "note" | "gold" | "down" | "up" | "mute" | "ink";

export const num = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });
const monthDay = new Intl.DateTimeFormat("ar-EG", { timeZone: "UTC", day: "numeric", month: "short" });
const monthYear = new Intl.DateTimeFormat("ar-EG", { timeZone: "UTC", month: "short", year: "2-digit" });
const full = new Intl.DateTimeFormat("ar-EG", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });

/** lightweight-charts hands back strings, business-day objects or unix seconds depending on input. */
export function toDate(t: Time): Date {
  if (typeof t === "string") return new Date(`${t}T00:00:00Z`);
  if (typeof t === "number") return new Date(t * 1000);
  return new Date(Date.UTC(t.year, t.month - 1, t.day));
}
export const fmtFull = (t: Time) => full.format(toDate(t));

/** Resolve a CSS colour token on the element (so charts inside `.vault` pick up vault colours). */
export function token(el: Element, name: Token | "line" | "paper"): string {
  return getComputedStyle(el).getPropertyValue(`--${name}`).trim() || "#888";
}

export function alpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${a})`;
}

export function baseOptions(el: Element): DeepPartial<ChartOptions> {
  return {
    autoSize: true,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: token(el, "mute"),
      fontFamily: "var(--font-plex), system-ui, sans-serif",
      fontSize: 12,
    },
    grid: { vertLines: { visible: false }, horzLines: { color: alpha(token(el, "line"), 0.7) } },
    rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.12, bottom: 0.08 } },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
      tickMarkFormatter: (t: Time, type: number) => (type <= 1 ? monthYear.format(toDate(t)) : monthDay.format(toDate(t))),
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      vertLine: { color: token(el, "mute"), labelBackgroundColor: token(el, "note") },
      horzLine: { color: token(el, "mute"), labelBackgroundColor: token(el, "note") },
    },
    localization: { locale: "ar-EG", priceFormatter: (p: number) => num.format(p), timeFormatter: (t: Time) => fmtFull(t) },
    handleScale: { mouseWheel: false },
    handleScroll: { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
  };
}

/** Calls `cb` when the page theme flips (the header toggle sets `data-theme` on <html>). Returns an unsubscribe. */
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
