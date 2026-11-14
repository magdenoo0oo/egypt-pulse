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
- Pages: `/`, `/currencies`, `/currency/[code]` (18), `/gold`, `/gold/[type]` (7), `/silver`, `/convert`, `/convert/[pair]` (36, `usd-to-egp` / `egp-to-usd`, see `src/lib/pairs.ts`), `/movers`, `/guides`, `/guides/[slug]` (7), `/glossary`, `/methodology`, `/developers`, plus `sitemap.ts`, `robots.ts`, `not-found.tsx`.
- Written content lives in `src/content/` (`guides.ts`, `glossary.ts`, `notes.ts`). It is evergreen and non-advisory by design: no invented statistics, hypothetical examples are labelled. `src/lib/insights.ts` generates the daily text reports from the data only.
- `src/proxy.ts` validates `/currency/:code`, `/gold/:type`, `/convert/:pair`, `/guides/:slug`; add new dynamic sections to its `VALID` map and `matcher`.
- Set `NEXT_PUBLIC_SITE_URL` on Vercel once the domain is final (sitemap, robots, metadataBase use it).
- API: `/currencies`, `/rates`, `/rates/:code?days=1..365`, `/convert?from&to&amount`, `/gold`, `/gold/:type`, `/silver` (unknown code 404, bad input 400).

## Design (decided, do not re-open the concept)
Concept C, "banknote x terminal" (owner chose it after seeing three options): the banknote identity stays as texture and brand, the page structure is a professional market terminal.
- Paper is the page; `.vault` (globals.css) is a dark engraved surface that re-points every colour token, so any component works on paper or inside a vault panel. Use `<Panel vault>` / `<Section vault>`.
- Tokens: paper #e6ede4, paper-2 #d8e2d4, ink #0f241c, mute #4d6358, note #1f5c46, gold #7d5c0d, up #1f6b4a, down #a63d28, line #b9c7bb, vault #0b1f17 (light is the default on every device; dark is opt-in via the header toggle, `data-theme="dark"` on <html>, stored in localStorage).
- Type: Reem Kufi (display, numbers), IBM Plex Sans Arabic (UI, tables), Amiri (long-form prose: guides, reports).
- The one memorable element: the home hero "time machine" (`TimeHero`, client). A split-flap rate display (rolling digits, transform only) over a one-year ribbon; on load the cursor runs from the first day to today, then the visitor drags (a transparent `input[type=range]` carries pointer, touch, keyboard and screen-reader access) to read any day; tabs switch USD/EUR/SAR/21k gold. The gold segment of the line is "what happened since that day". Reduced motion skips the intro. (The earlier banknote-rosette hero was replaced at the owner's request; do not bring it back.) Everything else stays quiet and structured. The ticker tape is the only other constant motion.
- A rising foreign price uses the warning tone (the pound buys less); heatmap, day strip and movers follow the same rule.
- Charts: interactive price charts use `lightweight-charts` v5 (`PriceChart`, `IndexChart`, theme read from CSS vars via `chartKit.ts`); they show the server SVG `Chart` until hydrated. Everything else (sparklines, `DayStrip`, `RangeBar`, bars) is server SVG/CSS. TradingView attribution must stay in the footer and methodology page.
- Layout: container is fluid up to 120rem (`max-w-page`, gutters 16/24/48px). Wide screens must not leave dead side space: hero is two columns (flaps + ribbon), reading pages use a 46rem text column plus an aside, long lists use columns. Vertical rhythm is tight on purpose (sections mt-14/16).
- Avoid generic SaaS cards, default gradients, fade-up-on-scroll, eyebrow labels. Accessibility beats style: focus rings, 44px targets, reduced motion, contrast.

## Status
Done and verified: lint and build pass; CI green; daily workflow ran successfully and made its own commit (`data: 2026-11-14`); all routes 200, unknown currencies 404 on first hit; checked visually at 1280px and 390px.

## i18n (11 locales)
- Locales: ar (default, unprefixed URLs), en, fr, es, de, tr, ru, zh, hi, pt, it (prefixed: `/en/...`). Config in `src/i18n/config.ts`; all routes live under `src/app/[locale]/`.
- `src/proxy.ts` rewrites unprefixed paths to `/ar/...`, redirects a visible `/ar/...` back, and 404s unknown ids. The layout reads the locale with `next/root-params`; Server Components call `await getI18n()` (`src/i18n/server.ts`) for `{ t, f, href, locale }`; Client Components use `useI18n()` and only receive the `c.*` slice of the dictionary.
- Dictionaries: `src/i18n/messages/<locale>.ts`, typed against the Arabic source `ar.ts` (add a key there first, then every locale). `npx tsx scripts/check-i18n.ts` verifies keys and `{placeholders}` for all locales; run it after any copy change.
- Numbers, dates, percents, currency names come from `makeFormat(locale)` (`src/i18n/format.ts`, Intl-based). Never hardcode digits or separators.
- Long-form content (guides, glossary, per-currency notes, methodology) exists in Arabic and English only (`src/content/`, `src/content/en/`); other locales read English and show a notice. Translating it further is a content job, not a code one.
- Link with `href("/path")` (adds the locale prefix); never write `/currency/usd` by hand in a page. Chart/converter strings live in the `c.*` keys.
- Layout is logical-property based so RTL/LTR flips with `dir`; check any new physical `left/right/ml/pl` use.

## Daily automation (what keeps the contribution graph green)
- `.github/workflows/daily.yml` runs 3x a day (03:17, 11:17, 19:17 UTC) plus manual dispatch. One dropped or late cron never costs a day.
- Every run is real work: `collect.ts --backfill 7` fetches the latest rates, heals days missed in the last week, and rewrites `data/meta.json` (`checkedAt`, `latestDate`, `days`, `status: ok | stale | unreachable`). Commit message `data: YYYY-MM-DD HH:MMZ`, so several a day are fine and distinct.
- If the source is down the collector never invents data: it keeps the stored history, records `status: "unreachable"` and exits 0, so the failed check is still an honest, committed fact. (`COLLECT_OFFLINE=1` simulates that.)
- Push step does `pull --rebase` and retries 3 times (the owner also pushes). A last step re-enables the schedule so GitHub does not pause it for inactivity.
- Commits count on the graph only with an email linked to the GitHub account and on the default branch: the workflow uses the noreply email; set the local git email to `195882873+magdenoo0oo@users.noreply.github.com` in this repo. Never backdate or add empty commits.
- CI (`ci.yml`) ignores `data/**` pushes; it runs lint, `scripts/check-i18n.ts` and the build.

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
- i18n is hand-rolled (no `next-intl`): see "i18n" below.

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
