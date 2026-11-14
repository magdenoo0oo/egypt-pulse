import { CODES, CURRENCIES, GOLD, change, range, type Key, type Row } from "./rates";
import { fmt, fmtDate, fmtPct } from "./format";

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

export type Mover = { key: Key; name: string; href: string; pct: number };

export function movers(rows: Row[], days = 30): Mover[] {
  const items: Mover[] = CODES.map((c) => ({ key: c, name: CURRENCIES[c].name, href: `/currency/${c}`, pct: change(rows, c, days).pct }));
  items.push({ key: "gold24", name: "الذهب عيار ٢٤", href: "/gold", pct: change(rows, "gold24", days).pct });
  items.push({ key: "silver", name: "الفضة", href: "/silver", pct: change(rows, "silver", days).pct });
  return items.sort((a, b) => b.pct - a.pct);
}

/** Short written read of the market, built only from the stored data. */
export function marketReport(rows: Row[]): string[] {
  const last = rows.at(-1)!;
  const usd = change(rows, "usd"), usd30 = change(rows, "usd", 30), usd90 = change(rows, "usd", 90);
  const m = movers(rows, 30);
  const up = m[0], down = m.at(-1)!;
  const r = range(rows, "usd", 30);
  const gold30 = change(rows, "gold24", 30);
  const dir = (n: number) => (n > 0 ? "ارتفع" : n < 0 ? "انخفض" : "ثبت");
  return [
    `سجّل الدولار ${fmt(last.usd)} جنيه في ${fmtDate(last.date)}، و${dir(usd.abs)} ${fmtPct(Math.abs(usd.pct))} عن آخر يوم قبله. خلال آخر ٣٠ يوم اتحرك بين ${fmt(r.min)} و${fmt(r.max)}، وتغيّر ${fmtPct(usd30.pct)} على الشهر و${fmtPct(usd90.pct)} على ٣ شهور.`,
    `على مستوى الشهر، أكتر الأصول ارتفاعًا مقابل الجنيه هو ${up.name} بنسبة ${fmtPct(up.pct)}، وأكترها انخفاضًا ${down.name} بنسبة ${fmtPct(down.pct)}. الذهب عيار ٢٤ ${dir(gold30.abs)} ${fmtPct(Math.abs(gold30.pct))} خلال نفس الفترة، وبيتحرك مع سعر الأوقية العالمي وسعر الدولار مع بعض.`,
    `الأرقام دي مرجعية من السوق العالمي. سعر البنك أو الصراف أو الصايغ بيختلف عنها، فاستخدمها للمقارنة ومتابعة الاتجاه.`,
  ];
}

export function currencyReport(rows: Row[], code: keyof typeof CURRENCIES): string[] {
  const k = code, last = rows.at(-1)!;
  const m = CURRENCIES[code];
  const d1 = change(rows, k), d30 = change(rows, k, 30), d365 = rows.length > 365 ? change(rows, k, 365) : change(rows, k, rows.length - 1);
  const r30 = range(rows, k, 30), r365 = range(rows, k, 365);
  const pos = position(rows, k);
  const vol = volatility(rows, k);
  const dir = (n: number) => (n > 0 ? "زاد" : n < 0 ? "قلّ" : "ثبت");
  const where = pos > 0.8 ? "قريب جدًا من أعلى مستوى" : pos < 0.2 ? "قريب جدًا من أدنى مستوى" : "في منتصف النطاق";
  const calm = vol < 0.25 ? "هادئة نسبيًا" : vol < 0.6 ? "متوسطة" : "عالية";
  return [
    `سعر ${m.name} النهارده ${fmt(last[k])} جنيه${m.unit > 1 ? ` لكل ${m.unit} وحدة` : ""}. السعر ${dir(d1.abs)} ${fmtPct(Math.abs(d1.pct))} عن آخر تسجيل قبله، و${dir(d30.abs)} ${fmtPct(Math.abs(d30.pct))} خلال ٣٠ يوم.`,
    `على مدار آخر سنة اتحرك السعر بين ${fmt(r365.min)} و${fmt(r365.max)}، ومتوسطه ${fmt(r365.avg)}. السعر الحالي ${where} في السنة، وفي آخر ٣٠ يوم كان بين ${fmt(r30.min)} و${fmt(r30.max)}. التغيّر على السنة كلها ${fmtPct(d365.pct)}.`,
    `التذبذب اليومي خلال الشهر ${calm}: متوسط الحركة اليومية حوالي ${fmt(vol)}٪. كل ما كانت النسبة أعلى، الحركة من يوم للتاني أحدّ.`,
  ];
}

export function goldReport(rows: Row[]): string[] {
  const last = rows.at(-1)!;
  const g30 = change(rows, "gold24", 30), g365 = change(rows, "gold24", Math.min(365, rows.length - 1));
  const u30 = change(rows, "usd", 30);
  const r = range(rows, "gold24", 365);
  const k21 = (last.gold24 * GOLD["21"].karat) / 24;
  return [
    `جرام الذهب عيار ٢٤ عند ${fmt(last.gold24)} جنيه، وعيار ٢١ (الأكتر تداولًا في مصر) عند ${fmt(k21)} جنيه. على الشهر تغيّر ${fmtPct(g30.pct)}، وعلى السنة ${fmtPct(g365.pct)}.`,
    `سعر الذهب بالجنيه بيتحرك بعاملين: السعر العالمي للأوقية بالدولار، وسعر الدولار قصاد الجنيه. الدولار نفسه تغيّر ${fmtPct(u30.pct)} خلال ٣٠ يوم، يعني جزء من حركة الذهب بالجنيه سببه العملة مش المعدن.`,
    `خلال آخر سنة اتحرك جرام عيار ٢٤ بين ${fmt(r.min)} و${fmt(r.max)}. اللي بتدفعه في المحل أعلى: المصنعية والدمغة وهامش الصايغ بيتضافوا على الأرقام دي.`,
  ];
}
