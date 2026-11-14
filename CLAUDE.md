@AGENTS.md

# Tas3era (تسعيرة): project report and working notes

Arabic-first (RTL) dashboard and open API for the Egyptian pound: 18 currencies, gold (24/21/18/14k, gold pound, half pound, ounce) and silver, 1 year of history.
It is the owner's showcase as a senior full-stack developer, and its daily automated commits keep their GitHub contribution graph green. Both goals matter. Commits must come from real work (the daily data pipeline), never empty filler commits.

- Repo: https://github.com/magdenoo0oo/egypt-pulse (public; rename to tas3era pending, owner does it on GitHub/Vercel), branch `main`
- Commit email (makes commits count in the graph): 195882873+magdenoo0oo@users.noreply.github.com

## Stack
Next.js 16.4.6 (App Router, Turbopack, `cacheComponents: true`, `partialPrefetching: true`), React 19, TypeScript, Tailwind v4.
API: Hono (`hono/vercel`) + Zod. Data: git-tracked CSV. Fonts: Reem Kufi (display/numbers) + IBM Plex Sans Arabic (body).
CI: `.github/workflows/ci.yml` (lint + build). Daily job: `.github/workflows/daily.yml` (09:17 UTC, commits `data/`).

## Structure
- `data/rates.csv`: `date,<18 currency codes>,gold24,silver`. Columns come from `src/lib/currencies.ts` (single catalogue shared by app, API, collector). Values are EGP per `unit` (JPY and INR per 100); `gold24`/`silver` are EGP per gram of pure metal. Source of truth for now. One source day (2025-12-10) is missing; the methodology page says gaps can happen.
- `data/meta.json`: `{checkedAt, latestDate, days}`, rewritten on every successful collector run. The source sometimes lags a day, so this guarantees a real change and commit daily, and the footer shows it.
- `scripts/collect.ts`: fetches fawazahmed0/currency-api (jsdelivr, fallback currency-api.pages.dev). Gold = egp / xau / 31.1034768. Run `npx tsx scripts/collect.ts [--backfill N]` (re-fetches days that are missing or incomplete).
- `src/lib/rates.ts`: loader (`loadRows` plain; `getRows`/`getMeta` use `"use cache"` + `cacheLife("hours")`), helpers `series/change/range/karats`. This is the seam for a future database.
- `src/lib/format.ts`: `ar-EG` formatters (Arabic-Indic digits).
- `src/proxy.ts`: real 404 for unknown `/currency/:code`.
- `src/components`: `Guilloche` (banknote rosette SVG, draws once, honors reduced motion), `Sparkline`, `Chart` (server SVG), `Converter` (client).
- Pages: `/`, `/currencies`, `/currency/[code]` (18), `/gold`, `/gold/[type]` (7), `/silver`, `/convert`, `/movers`, `/methodology`, `/developers`, plus `sitemap.ts`, `robots.ts`, `not-found.tsx`.
- `src/proxy.ts` validates `/currency/:code` and `/gold/:type`; add new dynamic sections to its `VALID` map.
- Set `NEXT_PUBLIC_SITE_URL` on Vercel once the domain is final (sitemap, robots, metadataBase use it).
- API: `/currencies`, `/rates`, `/rates/:code?days=1..365`, `/convert?from&to&amount`, `/gold`, `/gold/:type`, `/silver` (unknown code 404, bad input 400).

## Design (decided, do not re-open the concept)
Concept: Egyptian banknote. Tokens are CSS variables in `src/app/globals.css`, with dark mode:
paper #e6ede4, paper-2 #d8e2d4, ink #0f241c, mute #4d6358, note #1f5c46, gold #7d5c0d, up #1f6b4a, down #a63d28, line #b9c7bb.
A rising foreign currency uses the warning tone (the pound buys less). The one memorable element is the hero number over the rosette; keep everything else quiet. Avoid generic SaaS cards, default gradients, fade-up-on-scroll. Accessibility beats style: focus rings, 44px targets, reduced motion, contrast.

## Status
Done and verified: lint and build pass; CI green; daily workflow ran successfully and made its own commit (`data: 2026-11-14`); all routes 200, unknown currencies 404 on first hit; checked visually at 1280px and 390px.

## Gotchas (do not rediscover)
1. This Next.js version differs from training data. Read `node_modules/next/dist/docs/` before coding (see AGENTS.md). `params` is a Promise; use the global `PageProps<"/route">` and `LayoutProps` types (generated at build, so plain `tsc` before the first build shows false errors).
2. `export const dynamicParams` is not allowed with `cacheComponents`. Unlisted dynamic paths return 200 on the first hit, which is why `src/proxy.ts` exists.
3. SVG elements don't accept `dir`; wrap in a div.
4. `git pull --rebase` before every push: the daily Action commits to `main`.
5. The `gh` token has `workflow` scope (needed to push `.github/workflows`).
6. Screenshots with Playwright: the newest npm version wants a browser build that isn't installed. Launch with `executablePath` pointing at `~/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell`.
7. Prices are mid-market and gold is derived from the international spot. They are NOT bank or jeweller prices (no premium or making charges). Keep that disclaimer wherever numbers appear (footer, API, README).

## Deviations from the original plan
- No Postgres/Drizzle yet (data lives in git CSV; put a DB behind `src/lib/rates.ts` without changing the UI).
- Arabic only, no `next-intl` yet.

## Pending (ask the owner, don't assume)
1. Deployment: Vercel or Cloudflare. The site is NOT deployed yet. After deploy, each daily data commit should redeploy it.
2. Delete the old unused folder `~/Developer/tools/egp-rates` (never published, superseded).
3. Next feature, suggested order: Telegram price alerts, shareable daily rate cards (OG images, for the owner's TikTok), Postgres + Drizzle, English locale.

## Owner preferences
- Respect the existing stack, i18n and RTL. Ask before adding a major animation or 3D library.
- Motion must have purpose; animate transform/opacity only; honor `prefers-reduced-motion`.
- Be honest in the UI and README: commits are made by automation and the README says so.
- Verify before claiming: run lint, build and the routes.
- Ask before publishing or pushing anything outward-facing.

## Phase 1 expansion (done, not yet pushed at time of writing)
Data and pages above. Real bank/sagha/black-market prices are NOT included: no open API exists, scraping needs a per-source terms check first.
Next phases, in order: (2) Postgres + Drizzle behind `src/lib/rates.ts`, (3) bank and CBE official rates, sagha prices if a legal source is found, (4) OG share cards (needs an Arabic font for `ImageResponse`), Telegram alerts, English locale.
