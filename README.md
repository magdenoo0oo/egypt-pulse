# تسعيرة · Tas3era

Arabic-first dashboard and open API for the Egyptian pound: 18 currencies, gold (24k/21k/18k/14k, gold pound, ounce) and silver, with one year of history.

- **App:** Next.js 16 (App Router, Cache Components, partial prerendering), React 19, TypeScript, Tailwind v4. Terminal-style data panels on a banknote-inspired identity, interactive charts ([TradingView Lightweight Charts](https://www.tradingview.com/)), guides and a glossary, in 11 languages (Arabic default, English, French, Spanish, German, Turkish, Russian, Chinese, Hindi, Portuguese, Italian). RTL for Arabic, LTR otherwise; Arabic-Indic digits in Arabic. Light theme by default with an icon toggle for dark; `prefers-reduced-motion` respected.
- **API:** [Hono](https://hono.dev) at `/api/v1/*` with Zod validation. No key needed.
  - `GET /api/v1/currencies`, `GET /api/v1/rates`, `GET /api/v1/rates/:code?days=30`
  - `GET /api/v1/convert?from=usd&to=egp&amount=100`
  - `GET /api/v1/gold`, `GET /api/v1/gold/:type?days=90`, `GET /api/v1/silver`
- **Data pipeline:** `scripts/collect.ts` fetches daily reference rates, `.github/workflows/daily.yml` runs it every four hours, fills any missed day and commits `data/` (including a status record of every check). The dataset in git is the source of truth. Commits come from automation.
- **Source:** [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api). Prices are mid-market and derived from the international gold spot price, not bank or jeweller prices.

## Run

```bash
npm install
npx tsx scripts/collect.ts --backfill 365   # optional: rebuild history
npm run dev
```

## Roadmap

- Postgres + Drizzle store behind the same data layer
- Telegram price alerts
- Shareable daily rate cards (OG images)
