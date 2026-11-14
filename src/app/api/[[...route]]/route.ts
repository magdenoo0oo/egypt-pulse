import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { CODES, CURRENCIES, change, isCode, karats, loadRows } from "@/lib/rates";

const app = new Hono().basePath("/api/v1");

app.get("/rates", async (c) => {
  const rows = await loadRows();
  const last = rows.at(-1)!;
  return c.json({
    date: last.date,
    base: "EGP",
    note: "Mid-market reference rates, not bank buy/sell prices.",
    rates: Object.fromEntries(
      CODES.map((k) => [CURRENCIES[k].iso, { egp: last[k], change_1d: Math.round(change(rows, k).abs * 10000) / 10000 }]),
    ),
  });
});

const q = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) });

app.get("/rates/:code", async (c) => {
  const code = c.req.param("code").toLowerCase();
  if (!isCode(code)) return c.json({ error: `Unknown currency. Use one of: ${CODES.join(", ")}` }, 404);
  const parsed = q.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "days must be an integer between 1 and 365" }, 400);
  const rows = (await loadRows()).slice(-parsed.data.days);
  return c.json({
    currency: CURRENCIES[code].iso,
    unit: "EGP",
    history: rows.map((r) => ({ date: r.date, egp: r[code] })),
  });
});

app.get("/gold", async (c) => {
  const rows = await loadRows();
  const last = rows.at(-1)!;
  const k = karats(last.gold24);
  return c.json({
    date: last.date,
    unit: "EGP",
    note: "Derived from the international spot price. Retail prices add a premium and making charges.",
    per_gram: { k24: k.k24, k21: k.k21, k18: k.k18 },
    gold_pound: k.pound,
  });
});

app.notFound((c) => c.json({ error: "Not found", docs: "/developers" }, 404));

export const GET = handle(app);
