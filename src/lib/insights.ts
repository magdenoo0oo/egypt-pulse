import type { Format } from "@/i18n/format";
import type { T } from "@/i18n/messages";
import { CODES, CURRENCIES, GOLD, change, range, type Code, type Key, type Row } from "./rates";

type L = { t: T; f: Format };

/** Standard deviation of daily % moves, a plain measure of how jumpy a price has been. */
export function volatility(rows: Row[], key: Key, days = 30) {
  const v = rows.slice(-(days + 1)).map((r) => r[key]);
  const rets = v.slice(1).map((x, i) => ((x - v[i]) / v[i]) * 100);
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  return Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length);
}

/** Where today sits inside the period's low-high band, 0 = at the low, 1 = at the high. */
export function position(rows: Row[], key: Key, days = 365) {
  const { min, max } = range(rows, key, days);
  return max === min ? 0.5 : (rows.at(-1)![key] - min) / (max - min);
}

export function dailyChanges(rows: Row[], key: Key, days = 365) {
  const r = rows.slice(-(days + 1));
  return r.slice(1).map((x, i) => ({ date: x.date, pct: ((x[key] - r[i][key]) / r[i][key]) * 100 }));
}

/** Series rebased to 100 at the start, so unlike things can share one chart. */
export function indexed(rows: Row[], key: Key, days = 365) {
  const r = rows.slice(-days);
  const base = r[0][key];
  return r.map((x) => ({ date: x.date, v: (x[key] / base) * 100 }));
}

/** `path` is locale-free ("/currency/usd"); callers wrap it with their `href()`. */
export type Mover = { key: Key; name: string; path: string; pct: number };

export function movers(rows: Row[], { t, f }: L, days = 30): Mover[] {
  const items: Mover[] = CODES.map((c) => ({ key: c, name: f.cname(c), path: `/currency/${c}`, pct: change(rows, c, days).pct }));
  items.push({ key: "gold24", name: t("mv.gold24"), path: "/gold", pct: change(rows, "gold24", days).pct });
  items.push({ key: "silver", name: t("mv.silver"), path: "/silver", pct: change(rows, "silver", days).pct });
  return items.sort((a, b) => b.pct - a.pct);
}

/** Short written read of the market, built only from the stored data. */
export function marketReport(rows: Row[], i: L): string[] {
  const { t, f } = i;
  const last = rows.at(-1)!;
  const usd = change(rows, "usd"), usd30 = change(rows, "usd", 30), usd90 = change(rows, "usd", 90);
  const m = movers(rows, i, 30);
  const up = m[0], down = m.at(-1)!;
  const r = range(rows, "usd", 30);
  const gold30 = change(rows, "gold24", 30);
  const dir = (n: number) => t(n > 0 ? "rep.up" : n < 0 ? "rep.down" : "rep.flat");
  return [
    t("rep.m1", { price: f.fmt(last.usd), date: f.fmtDate(last.date), dir: dir(usd.abs), pct: f.fmtPctAbs(usd.pct), min: f.fmt(r.min), max: f.fmt(r.max), c30: f.fmtPct(usd30.pct), c90: f.fmtPct(usd90.pct) }),
    t("rep.m2", { up: up.name, upPct: f.fmtPctAbs(up.pct), down: down.name, downPct: f.fmtPctAbs(down.pct), goldDir: dir(gold30.abs), goldPct: f.fmtPctAbs(gold30.pct) }),
    t("rep.m3"),
  ];
}

export function currencyReport(rows: Row[], code: Code, i: L): string[] {
  const { t, f } = i;
  const k = code, last = rows.at(-1)!;
  const d1 = change(rows, k), d30 = change(rows, k, 30), d365 = change(rows, k, Math.min(365, rows.length - 1));
  const r30 = range(rows, k, 30), r365 = range(rows, k, 365);
  const pos = position(rows, k);
  const vol = volatility(rows, k);
  const dir = (n: number) => t(n > 0 ? "rep.cUp" : n < 0 ? "rep.cDown" : "rep.cFlat");
  const where = t(pos > 0.8 ? "rep.whereHigh" : pos < 0.2 ? "rep.whereLow" : "rep.whereMid");
  const calm = t(vol < 0.25 ? "rep.calmLow" : vol < 0.6 ? "rep.calmMid" : "rep.calmHigh");
  const name = f.cname(code);
  const unitNote = CURRENCIES[code].unit > 1 ? t("rep.unitNote", { unit: CURRENCIES[code].unit }) : "";
  return [
    t("rep.c1", { name, price: f.fmt(last[k]), unitNote, dir1: dir(d1.abs), pct1: f.fmtPctAbs(d1.pct), dir30: dir(d30.abs), pct30: f.fmtPctAbs(d30.pct) }),
    t("rep.c2", { min: f.fmt(r365.min), max: f.fmt(r365.max), avg: f.fmt(r365.avg), where, min30: f.fmt(r30.min), max30: f.fmt(r30.max), pct365: f.fmtPct(d365.pct) }),
    t("rep.c3", { calm, vol: f.fmtNum(vol) + "%" }),
  ];
}

export function goldReport(rows: Row[], i: L): string[] {
  const { t, f } = i;
  const last = rows.at(-1)!;
  const g30 = change(rows, "gold24", 30), g365 = change(rows, "gold24", Math.min(365, rows.length - 1));
  const u30 = change(rows, "usd", 30);
  const r = range(rows, "gold24", 365);
  const k21 = (last.gold24 * GOLD["21"].karat) / 24;
  return [
    t("rep.g1", { g24: f.fmt(last.gold24), g21: f.fmt(k21), c30: f.fmtPct(g30.pct), c365: f.fmtPct(g365.pct) }),
    t("rep.g2", { usd30: f.fmtPct(u30.pct) }),
    t("rep.g3", { min: f.fmt(r.min), max: f.fmt(r.max) }),
  ];
}
