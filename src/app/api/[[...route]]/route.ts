import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { CODES, CURRENCIES, GOLD, GOLD_TYPES, change, cross, goldPrice, isCode, isGoldType, loadRows, unitOf } from "@/lib/rates";

const app = new Hono().basePath("/api/v1");
const round4 = (n: number) => Math.round(n * 10000) / 10000;
const NOTE = "Mid-market reference rates derived from international markets, not bank or jeweller prices.";

app.get("/currencies", (c) =>
  c.json(CODES.map((k) => ({ code: CURRENCIES[k].iso, name: CURRENCIES[k].name, unit: CURRENCIES[k].unit }))),
);

app.get("/rates", async (c) => {
  const rows = await loadRows();
  const last = rows.at(-1)!;
  return c.json({
    date: last.date,
    base: "EGP",
    note: NOTE,
    rates: Object.fromEntries(
      CODES.map((k) => [
        CURRENCIES[k].iso,
        { egp: last[k], per_units: unitOf(k), change_1d: round4(change(rows, k).abs), change_30d_pct: round4(change(rows, k, 30).pct) },
      ]),
    ),
  });
});

const days = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) });

app.get("/rates/:code", async (c) => {
  const code = c.req.param("code").toLowerCase();
  if (!isCode(code)) return c.json({ error: `Unknown currency. Use one of: ${CODES.join(", ")}` }, 404);
  const parsed = days.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "days must be an integer between 1 and 365" }, 400);
  const rows = (await loadRows()).slice(-parsed.data.days);
  return c.json({
    currency: CURRENCIES[code].iso,
    unit: "EGP",
    per_units: unitOf(code),
    history: rows.map((r) => ({ date: r.date, egp: r[code] })),
  });
});

const conv = z.object({
  from: z.string().transform((s) => s.toLowerCase()),
  to: z.string().transform((s) => s.toLowerCase()),
  amount: z.coerce.number().positive().max(1e12).default(1),
});

app.get("/convert", async (c) => {
  const parsed = conv.safeParse(c.req.query());
  const ok = (s: string) => s === "egp" || isCode(s);
  if (!parsed.success || !ok(parsed.data.from) || !ok(parsed.data.to)) {
    return c.json({ error: "Use ?from=usd&to=egp&amount=100 (codes: egp, " + CODES.join(", ") + ")" }, 400);
  }
  const { from, to, amount } = parsed.data;
  const last = (await loadRows()).at(-1)!;
  const rate = cross(last, from as never, to as never);
  return c.json({ date: last.date, from: from.toUpperCase(), to: to.toUpperCase(), amount, rate: round4(rate), result: round4(amount * rate), note: NOTE });
});

app.get("/gold", async (c) => {
  const rows = await loadRows();
  const last = rows.at(-1)!;
  return c.json({
    date: last.date,
    unit: "EGP",
    note: "Derived from the international spot price. Retail prices add a premium and making charges.",
    per_gram: { k24: goldPrice(last.gold24, "24"), k21: goldPrice(last.gold24, "21"), k18: goldPrice(last.gold24, "18"), k14: goldPrice(last.gold24, "14") },
    gold_pound: goldPrice(last.gold24, "pound"),
    half_gold_pound: goldPrice(last.gold24, "half-pound"),
    ounce_24k: goldPrice(last.gold24, "ounce"),
    change_30d_pct: round4(change(rows, "gold24", 30).pct),
  });
});

app.get("/gold/:type", async (c) => {
  const type = c.req.param("type");
  if (!isGoldType(type)) return c.json({ error: `Unknown product. Use one of: ${GOLD_TYPES.join(", ")}` }, 404);
  const parsed = days.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "days must be an integer between 1 and 365" }, 400);
  const rows = (await loadRows()).slice(-parsed.data.days);
  return c.json({ product: type, name: GOLD[type].name, unit: "EGP", history: rows.map((r) => ({ date: r.date, egp: goldPrice(r.gold24, type) })) });
});

app.get("/silver", async (c) => {
  const rows = await loadRows();
  const last = rows.at(-1)!;
  return c.json({ date: last.date, unit: "EGP", note: NOTE, per_gram_999: last.silver, per_gram_925: round4(last.silver * 0.925), change_30d_pct: round4(change(rows, "silver", 30).pct) });
});

app.notFound((c) => c.json({ error: "Not found", docs: "/developers" }, 404));

export const GET = handle(app);
