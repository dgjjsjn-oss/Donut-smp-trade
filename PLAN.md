# DonutSMP Trader — Full Build Plan v1.0

Project dir: `C:\Users\nasri\Desktop\Donutmptrade`
Repo: `https://github.com/dgjjsjn-oss/Donutsmptrade.git` (branch `main`)

---

## 0. Core Decision (the whole plan hangs on this)

**No API key. Data comes from a real Minecraft player bot that joins DonutSMP and reads the game.**

### Why this is the right call
`api.donutsmp.net` (official) needs an in-game `/api` key tied to a real account, and 3rd-party mirrors (`api.donutsmp.design`, `api.donutsmp-mc.com`) are unofficial wrappers that can vanish or lie. Competitors' site changes tomorrow and they're fine because they pay for data. We own our data pipeline — nobody can cut us off.

### How the bot actually gets data
| Data | Source in-game | Method |
|---|---|---|
| Auction listings | `/ah` GUI (chest menu) | Bot opens GUI, reads 54 slots, parses item name + price lore. Pages through. |
| Completed sales | `/ah` history tab / "Sold" page | Same GUI read |
| Player balance | `/bal <player>` chat response | Bot runs command, parses reply |
| Money LB | `/baltop` chat output | Bot runs command, parses lines |
| Kills / deaths / playtime / shards / blocks | `/stats <player>` | Command reply parsing |
| Global LB | `/lb` / `/top` | Command reply parsing |
| Player online list | Tab list | `bot.players` |
| Server population/ping | Server list ping | `bot._client` ping packet |
| Coordinates / region | Scoreboard sidebar | Scoreboard objective parse |
| Item images | Crafatar/mc-heads CDN by material | Public CDN, no key |

**Stack for the bot: `mineflayer` (Node.js)** — the standard headless MC client library. Supports 1.21.x, gives us `bot.chat()`, `bot.on('windowOpen')`, scoreboard events, tab list, ping.

### Honest technical risks (and mitigations) — read this before Phase 4
1. **Bot account needs a real DonutSMP account.** The server is whitelisted/paid. We need one account, dedicated, named e.g. `DonutPriceBot`. Anti-alt detection may kick it.
   → Mitigation: bot runs slow + randomized, never trades, stays in a safe AFK area, moves human-like, respects a strict cooldown. Configurable.
2. **Item price lore format can change** when the server updates its plugin.
   → Mitigation: the parser is a separate, versioned, unit-tested module with a fallback chain of regex patterns. Fails loud (alert) rather than writing garbage prices.
3. **Rate limits / anti-cheat kicks.** We never automate trading, only reading.
   → Mitigation: fixed configurable delay (default 8–20s randomized) between actions. Anti-cheat usually only cares about movement/actions, not chat commands.
4. **If the bot dies / gets stuck** → auto-rejoin with exponential backoff, never log in twice with the same account simultaneously.

> The plan assumes the bot account has legitimate access to the server. Everything below is engineered so that if the bot channel ever breaks, the site **degrades gracefully** (shows "last updated 4h ago", stale badge) instead of lying about live data. That honesty is also what separates us from AI-generated site spam.

---

## 1. Tech Stack (final decisions)

```
Frontend   Next.js 15 (App Router) + TypeScript + Tailwind v4
Charts     lightweight-charts (TradingView, free, no key)  ← NOT recharts (looks generic)
Data       Server Components + React Server Cache; client components only for charts
Backend    Next.js Route Handlers (public API) + Node services
Database   PostgreSQL (Neon free tier or Supabase) + Timescale-ish hypertables
Cache      Redis (Upstash free) for hot price cache + rate limiting
Bot        Node.js + mineflayer + node-schedule (separate process, NOT in Next.js)
Queue      Redis Streams or simple BullMQ-free cron worker (avoid heavy deps)
Auth       Auth.js v5 (for premium tiers later) OR simple Clerk-free custom JWT
Hosting    Vercel (web) + Railway / Fly.io (bot worker, needs 24/7 TCP egress)
Repo       GitHub `dgjjsjn-oss/Donutsmptrade`
CI         GitHub Actions: typecheck + lint + build + unit tests + auto-deploy
```

**Why Next.js full-stack:** one repo, one deploy for the site; the bot is a separate tiny deployable. Minimum moving parts.

---

## 2. Monorepo Layout

```
Donutmptrade/
├─ apps/
│  ├─ web/                  # Next.js site (all public pages)
│  │  ├─ app/
│  │  │  ├─ (marketing)/    # /about /privacy /terms /advertise /blog
│  │  │  ├─ prices/         # /prices, /prices/[item], /prices/browse/[letter]
│  │  │  ├─ auction/        # /auction, /auction/[item], /transactions
│  │  │  ├─ players/        # /leaderboards/*, /player/[name], /player-finder
│  │  │  ├─ tools/          # spawner calc, stacking calc, profit calc
│  │  │  ├─ blog/
│  │  │  └─ api/            # route handlers: /api/prices, /api/auction, ...
│  │  ├─ components/        # ui primitives (no AI-slop default look)
│  │  └─ lib/
│  ├─ bot/                  # mineflayer collector (deploys separately)
│  │  ├─ src/
│  │  │  ├─ index.ts        # entry, reconnect supervisor
│  │  │  ├─ collectors/     # auction.ts, stats.ts, leaderboard.ts, players.ts
│  │  │  ├─ parsers/        # lore.ts, scoreboard.ts, chat.ts  (UNIT TESTED)
│  │  │  ├─ writer.ts       # DB upsert layer
│  │  │  └─ config.ts
│  │  └─ tests/
│  └─ shared/               # types, zod schemas, item metadata
├─ packages/
│  ├─ ui/                   # shared design system components
│  ├─ item-meta/            # full DonutSMP item catalogue + mc material ids
│  └─ config/               # eslint/ts/tailwind shared
├─ .github/workflows/
└─ docs/
```

---

## 3. Database Schema (PostgreSQL)

```sql
items (id, slug, display_name, material, mc_id, category, stack_size, icon_url, first_seen_at)

-- one row per item per snapshot -> drives charts
price_snapshots (
  id bigserial, item_id, price numeric, listings int, volume_24h numeric,
  captured_at timestamptz
) -- index (item_id, captured_at DESC), partition by month past 90d

auction_listings (
  id, item_id, seller, price, stack_size, enchantments jsonb, shard_price numeric,
  is_sold bool, created_at, captured_at
)

transactions (           -- completed sales, the real "what buyers paid"
  id, item_id, seller, buyer, price, stack_size, sold_at
)

players (
  uuid, name, first_seen, last_seen, money, shards, kills, deaths,
  playtime_min, blocks_placed, blocks_broken, mob_kills, shop_spend, sell_earned,
  is_online, last_coords jsonb, region text
)

player_snapshots (       -- history for "player growth" graphs
  player_uuid, captured_at, money, kills, deaths, playtime_min, shards
)

server_status (captured_at, online_players, max_players, ping_ms, version, region_hit jsonb)

bot_runs (id, started_at, ended_at, ok, items_scraped, error)  -- health page
collect_errors (id, collector, message, at)
```

Key indexes: `price_snapshots(item_id, captured_at desc)`, `players(money desc)`, full-text on `players(name)`.

**Data retention:** keep 1h-resolution for 30 days, then downsample to 1h/6h/daily. Never lose the long-term chart.

---

## 4. Bot Design (the important part)

### 4.1 Lifecycle
```
supervisor
 ├─ connect (with backoff 5s→5min, jitter)
 ├─ on spawn → wait 15s (anti-spawn-camp politeness)
 ├─ run collectors on independent schedules
 ├─ heartbeat every 5min (ping, online count, bot_runs row)
 └─ on disconnect/kick → log reason, backoff, reconnect
```

### 4.2 Collector: Auction (the money feature)
- `bot.chat('/ah')` → `windowOpen` event
- read `window.slots` (up to 54 per page)
- for each ItemStack: `item.name` (custom name = item) + `item.nbt` lore lines → price
- detect pagination arrow item in last slot → click it, read next page, until done or page cap (e.g. 40 pages/configurable)
- also `/ah search <item>` for per-item deep crawl (top N items only, on rotation, not every cycle — rate-limit safety)
- writes `auction_listings` + `price_snapshots`
- **Validation gate:** if a parsed price is 0, negative, or deviates >80% from last known → skip that item, log to `collect_errors`, never write garbage.

### 4.3 Collector: Stats & Leaderboards
- `/baltop`, `/stats <name>` etc. with rotation over known player names
- parse chat lines with strict regex per server message format, versioned in `parsers/`
- cache-friendly: only re-crawl a player if `last_crawl > 6h`

### 4.4 Collectors list
`auction-listing`, `auction-sold`, `price-snapshot`, `money-lb`, `kill-lb`, `playtime-lb`, `shard-lb`, `blocks-lb`, `shop-spend-lb`, `sell-earnings-lb`, `player-batch-stats`, `online-players`, `server-status`, `scoreboard-region`.

### 4.5 Safety knobs (config)
```yaml
JOIN_DELAY_MIN: 90        # seconds off-server cooldown between sessions
ACTION_COOLDOWN: [8000, 20000]  # random ms between in-game actions
MAX_AH_PAGES_PER_RUN: 40
DAILY_BUDGET: { commands: 4000, logins: 40 }
```

---

## 5. Website Feature Map (everything from all 3 competitor sites, plus our own)

### 5.1 Pages we ship
**Prices**
- `/prices` — searchable/filterable table: item, live lowest price, 1h/24h/7d/30d %, 24h volume, listing count, sparkline
- `/prices/[item]` — full price history chart (1h/24h/7d/30d/90d/All), current listings, recent completed sales, high/low/average stats, "is it a good buy right now" verdict, stacking calculator embed, related items, FAQ block
- `/prices/browse` + `/prices/browse/[a-z]` — A–Z index
- `/prices/trending` — top gainers/losers
- `/prices/compare?items=a,b,c` — side-by-side normalized chart

**Auction**
- `/auction` — live listings feed, sortable, filters (item, price range, enchanted, seller)
- `/auction/transactions` — completed sales history ("what buyers actually paid")
- `/auction/item/[item]` — per-item listings + sales

**Players**
- `/leaderboards` — 10 boards: money, kills, deaths, playtime, shards, blocks placed, blocks broken, mob kills, shop spend, sell earnings
- `/leaderboards/[board]` — top 100 + pagination + "your rank" lookup
- `/player/[name]` — full profile: skin (mc-heads.net), money, all stats, join date, last seen, price-alert signup, rank history
- `/player-finder` — search by name/uuid/partial
- `/all-time-best` — historic peaks

**Tools**
- `/tools/spawner-calculator` — profit math for spawner grinding
- `/tools/stacking-calculator` — stack price conversion
- `/tools/flip-finder` — cheapest-listing vs highest-avg-profit items
- `/tools/profit-calculator`

**Server**
- `/server-status` — live ping, player count, uptime, version, regions hit (live)
- `/regions` — region map (EU Central / EU West / NA East / NA West / Asia / Oceania) with live population heat from scoreboard coords
- `/flood-tracker` — where players are flooding, heatmap
- `/rtp-heatmap` — RTP activity heat

**Content / SEO**
- `/blog` + `/blog/[slug]` — real guides: auction house guide, economy guide, price history guide, leaderboards guide, best items to trade, region guide
- `/donutsmp`, `/donutsmp-auction-house`, `/donutsmp-price-history`, `/donutsmp-leaderboards`, `/donutsmp-server-status` — keyword landing pages (like donutstats.net does)

**Business / pages**
- `/premium` — premium tiers (multiplier, item alerts, API access, early data)
- `/advertisement` — ad slots & packages
- `/discord-bot` — our own Discord bot pitch page
- `/about`, `/privacy-policy`, `/terms-of-service`, `/contact`
- `/api` — our public read-only API docs (this is our moat vs competitors)

**System**
- `/404`, `/loading`, `/error`, `/offline` (data stale state)
- `/status` — our own data pipeline health (bot online, last successful scrape)

### 5.2 Cross-cutting features
- **Live search** with keyboard nav (`/` shortcut) — instant item/player search
- **Watchlist / price alerts** (email or Discord webhook) — "tell me when elytra < 3B"
- **Price ticker bar** on all pages
- **Dark + light theme**, default dark (matches competitor aesthetic, done properly)
- **Command palette** (⌘K) — jump anywhere
- **Embed generator** — generate a Discord embed of an item price (like competitors do)
- **SEO**: full OG images (dynamic `@vercel/og`), JSON-LD, sitemap, robots, item pages prerendered + ISR
- **Analytics**: privacy-light, Plausible or umami (self-hostable), no Google bloat

---

## 6. Anti-AI-Slop Design System (this is a first-class requirement)

### 6.1 What we explicitly refuse to ship
- ❌ Purple/indigo gradient hero with centered text
- ❌ "Trusted by 10,000+ traders" fake logo strip
- ❌ 3 identical feature cards with lucide icons in circles
- ❌ Inter font + `rounded-2xl` + `shadow-lg` on every surface
- ❌ Emoji in headings, `✨` sprinkled everywhere
- ❌ Generic copy: "Track the market like a pro", "Your ultimate trading companion"
- ❌ Same component rhythm repeated 6× down the page

### 6.1 The actual design direction — "Trading Terminal"
**Concept:** a Bloomberg-terminal-meets-Minecraft-marketplace. Dense, monospaced numerals, tabular data, keyboard-first. It looks *built by traders*, not *designed by a template*.

**Tokens:**
```
--bg:        #0A0B0E   (near-black, slightly blue)
--surface:   #111318
--surface-2: #171A20
--line:      #23262E
--text:      #E6E8EE
--muted:     #8B91A0
--up:        #3FB950    (green)
--down:      #F85149    (red)
--accent:    #E8B44A    (donut glaze gold)
--accent-2:  #5B8DEF    (cool blue, secondary data)
```
Font: **Space Grotesk** (display/headings) + **JetBrains Mono** (all numbers, tabular) + **Inter** (body only, if needed). Numbers ALWAYS mono + `font-variant-numeric: tabular-nums`. No emoji.

**Signature moves (unique to us):**
1. **Glaze-gold hairline** — a 1px accent line that traces section boundaries, not filled cards.
2. **Live tick flash** — price cells flash green/red for 400ms on update (real data streaming, real feel).
3. **Dense data tables** — sortable, sticky header, zebra hairline rows, monospace, keyboard sortable. Feels like a terminal.
4. **Asymmetric layout** — chart 8 cols, stats rail 4 cols, on item pages. Never 50/50 hero split.
5. **Item identity via material icon** in a square "slot" frame (Minecraft inventory slot bevel) — instantly reads as Minecraft without being cheesy.
6. **Right-edge fixed watchlist drawer** on desktop (traders love a watchlist), collapsible.
7. **Dark-first with a real light mode** (not inverted-dark = broken light mode).

### 6.2 The AI-Vibe Check Skill (mandatory gate before any ship)
A skill + CI check that scores every PR. Automated + agent-reviewed.

**Automated checks (`pnpm ai-slop`):**
- `no-purple-gradient`: fails on `#6366f1`/`#8b5cf6`/`indigo-500` hero gradients
- `no-emoji-in-copy`: scans JSX text nodes for emoji
- `no-round-2xl-everywhere`: fails if >40% of cards share the same radius token
- `no-lucide-in-circle`: fails the "icon in a colored circle" pattern
- `no-inter-only`: fails if heading font-family is Inter
- `no-fake-logos`: fails on placeholder logo images / "Trusted by" strips with no real data
- `copy-lint`: bans phrases: "game-changer", "revolutionize", "unlock the power", "seamless", "effortlessly", "in today's fast-paced", "dive in", "unleash", "seamlessly"
- `layout-diversity`: page-level check — no more than 2 identical section templates in a row
- `ai-marker-scan`: bans "As an AI", "Certainly!", "Here's the", "In conclusion", "Moreover"
- `contrast-check`: WCAG AA on all text tokens
- `motion-check`: no gratuitous fade-in-up on every element (banned pattern)

**Agent review pass (skill: `audit-ai-design-slop` + `human-look`):** on every PR, a reviewer agent screenshots the built page and scores:
- Originality (vs. the 3 competitor sites — must NOT look like donutstats.net)
- Human-authored copy feel
- Density / information value
- Typography discipline
- Motion restraint

**Scoring:** PR cannot merge below 8/10 average across the automated gates. Failures print exactly what to fix.

---

## 7. Security Plan

| Area | Control |
|---|---|
| Bot credentials | Never in git. `.env` locally, Railway secrets in prod. `MICROSOFT`/`EMAIL` creds in a secrets manager. |
| Bot account | Dedicated throwaway account, 2FA on the email, never used manually. |
| DB access | Pooled connection string, RLS off (server-only), no public endpoint. |
| Public API | Read-only, rate-limited (token bucket in Redis), optional API keys for higher limits, cursor pagination, cached responses. |
| Bot → site channel | Internal signed webhook (HMAC-SHA256 with shared secret) + timestamp check to prevent replay. |
| Webhooks (alerts) | Outbound URL allowlist is user's own URL; we POST **no** user data, no cookies, no auth. |
| User accounts | bcrypt/argon2, httpOnly cookies, CSRF protection, rate-limited login. |
| Uploads | None. No file inputs anywhere. |
| XSS | React default escaping; no `dangerouslySetInnerHTML` except our own sanitized blog MDX. |
| Supply chain | Dependabot + `npm audit` in CI, lockfile committed, `pnpm` only. |
| Headers | CSP (strict), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. |
| Rate limiting | Redis token bucket on every API route + every bot write endpoint. |
| Privacy | No third-party trackers, no selling data, DSAR/export/delete endpoints (GDPR-lite), privacy policy page. |
| Legal/ToS | Site is a **read-only community stats viewer**. We never trade, never automate purchases, never touch player accounts. Disclaimer in footer + about page. This is the thing that keeps us safe *and* it's also honest copy. |

**Critical safety principle:** the bot account must NEVER buy, sell, or place orders. Read-only, forever. Enforced in code — no chat command whitelist bypass.

---

## 8. Phase Plan (build order)

**Phase 0 — Repo & foundation** (half day)
- init monorepo, pnpm workspaces, tsconfig strict, ESLint, Prettier, CI
- `.env.example`, README, CONTRIBUTING
- push to GitHub, set up the remote + branch

**Phase 1 — Data layer** (1 day)
- DB schema + migrations (Drizzle ORM, typed)
- seed item catalogue (full DonutSMP item list from `packages/item-meta`)
- Redis cache layer + rate limiter
- shared types package

**Phase 2 — The bot** (3–4 days) ⭐ highest risk, do early
- mineflayer connect + reconnect supervisor
- AH GUI parser + unit tests with saved fixtures
- stats/leaderboard parsers + fixtures
- writers with validation gate
- health endpoint + `/status` page

**Phase 3 — Core site** (4–5 days)
- design system + tokens (per §6)
- `/prices`, `/prices/[item]`, `/auction`, `/transactions`
- API routes + caching
- layouts: top nav, ticker, footer, theme

**Phase 4 — Players & tools** (3 days)
- leaderboards ×10, player profile, player finder
- calculators, flip finder
- server status, regions, heatmaps

**Phase 5 — Content & SEO** (2 days)
- blog with 6 real long-form guides (written by us, not AI slop)
- keyword landing pages, JSON-LD, sitemap, OG images

**Phase 6 — Monetization & community** (2 days)
- premium page + tier gating (start with "premium soon" + waitlist)
- watchlist + price alerts
- Discord bot (real one, separate module) + `/discord-bot` page
- advertise page

**Phase 7 — Anti-slop gate + hardening** (2 days)
- implement the full `ai-slop` checker skill + CI
- security headers, rate limits, CSP
- cross-device QA (mobile/tablet/desktop), Lighthouse ≥95 perf, a11y AA

**Phase 8 — Deploy & launch** (1 day)
- Vercel deploy (web) + Railway (bot, 24/7)
- custom domain, DNS, SSL
- production smoke test, monitor, write launch post

**Total: ~3 weeks of focused work.**

---

## 9. What We Get That They Don't (positioning)
1. **We own the data.** No API key, no upstream dependency, no risk of a competitor's provider vanishing.
2. **Server regions + live population heat** (from scoreboard/tab) — nobody's showing real live regional data.
3. **Price alerts + watchlist + flip finder** — the actual trader tools, not just pretty charts.
4. **Real completed-sale data** ("what buyers actually paid") not just active listings.
5. **Honest freshness badge everywhere.** If data is 3h old we say 3h. Trust as a feature.
6. **Public API** for the community — free tier, builds ecosystem + SEO.

---

## 10. Naming & Branding (proposal — will finalize in Phase 0)
- Name: **DonutSMP Trader** (working) — alternatives: `donutsmp.trade`, `donutexchange`, `donutmarket`
- Domain suggestions: `donutstrade.gg` / `donutsmp.trader` / `thedonutexchange.com`
- Voice: plain, trader-first, numbers-first. No hype. Short sentences. "Diamond is down 12% this week. 14 listings. That's the buy window."

---

## 11. Decisions I'm Making (will change if you say otherwise)
| # | Decision | Default I picked |
|---|---|---|
| 1 | Framework | Next.js 15 App Router + TS |
| 2 | DB | PostgreSQL (Neon free) via Drizzle |
| 3 | Bot lib | mineflayer |
| 4 | Charts | lightweight-charts (TradingView) |
| 5 | Design | Dark-first "Trading Terminal", gold accent, mono numerals |
| 6 | Monetization | Free site + premium tier later + ad slots |
| 7 | Bot hosting | Railway (needs 24/7) |
| 8 | Domain | TBD in Phase 0 |
| 9 | First launch scope | Phases 0–4 live, 5–8 follow |
| 10 | Bot account | Need 1 real DonutSMP account to dedicate |

---

## Next step
Confirm the plan (or the 10 decisions above), and I'll start **Phase 0** immediately: repo init, GitHub remote, CI, monorepo scaffold, then straight into the bot since it's the riskiest piece.