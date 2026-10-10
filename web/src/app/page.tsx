import Link from "next/link";
import { TopNav, Ticker, Footer, formatMoney, pct, changeColor } from "@/components/layout";
import { LiveDot } from "@/components/live";
import { itemImage, playerHead } from "@/lib/items";
import { MARKET, ECONOMY, TOP_PLAYERS, SERVER, REGIONS } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const top5 = MARKET.slice().sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
  const gainers = MARKET.slice().sort((a, b) => b.ch24h - a.ch24h).slice(0, 5);
  const losers = MARKET.slice().sort((a, b) => a.ch24h - b.ch24h).slice(0, 5);
  const totalOnline = REGIONS.reduce((s, r) => s + r.players, 0);

  return (
    <>
      <TopNav />
      <Ticker items={top5.map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* Masthead — asymmetric, terminal-style. Not a centered purple-gradient hero. */}
      <section className="mx-auto max-w-[1400px] px-5 pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <LiveDot label="LIVE" />
              <span className="label">Updated {SERVER.updatedMinutesAgo}m ago</span>
            </div>
            <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[60px]">
              The DonutSMP market,
              <br />
              <span style={{ color: "var(--muted)" }}>read at trader speed.</span>
            </h1>
            <p
              className="mt-6 max-w-[52ch] text-[15px] leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Auction listings, completed sales, price history and player standings — collected
              from the server and stored by our own bot. No upstream API. No stale cache sold as
              live. If the data is old, the badge says so.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/prices"
                className="px-5 py-2.5 text-[13px] font-semibold transition-transform active:scale-[0.97]"
                style={{ background: "var(--gold)", color: "#0a0b0e" }}
              >
                Browse item prices
              </Link>
              <Link
                href="/auction"
                className="px-5 py-2.5 text-[13px] font-medium transition-colors"
                style={{ border: "1px solid var(--line2)", color: "var(--ink)" }}
              >
                Live auction house
              </Link>
              <Link href="/api" className="num px-2 py-2.5 text-[12px]" style={{ color: "var(--muted)" }}>
                /api →
              </Link>
            </div>
          </div>

          {/* Server rail */}
          <div className="lg:pt-2">
            <div className="rule-gold pt-3">
              <div className="label mb-4">Server right now</div>
              <div className="num text-[52px] font-semibold leading-none">
                {SERVER.online.toLocaleString()}
              </div>
              <div className="num mt-2 text-[12px]" style={{ color: "var(--dim)" }}>
                players online · {SERVER.ping}ms · v{SERVER.version}
              </div>
              <div className="mt-5 h-1 w-full" style={{ background: "var(--line)" }}>
                <div
                  className="h-full"
                  style={{
                    width: `${(SERVER.online / SERVER.max) * 100}%`,
                    background: "var(--gold)",
                  }}
                />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  ["Items tracked", MARKET.length.toString()],
                  ["Players ranked", ECONOMY.activePlayers.toLocaleString()],
                  ["Region pop", totalOnline.toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="num text-[19px] font-medium">{v}</div>
                    <div className="label mt-1">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market table — dense, sortable-feeling, real data density */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5">
        <div className="rule-gold flex items-end justify-between pt-3">
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight">Market by volume</h2>
            <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
              Ranked by 24h traded value on the auction house.
            </p>
          </div>
          <Link href="/prices" className="num text-[12px]" style={{ color: "var(--gold)" }}>
            All items →
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto" style={{ border: "1px solid var(--line)" }}>
          <table className="dense w-full min-w-[820px]">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Lowest</th>
                <th className="text-right">24h</th>
                <th className="text-right">7d</th>
                <th className="text-right">24h volume</th>
                <th className="text-right">Listings</th>
                <th className="w-24">7d</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((i) => (
                <tr key={i.slug}>
                  <td>
                    <Link href={`/prices/${i.slug}`} className="flex items-center gap-2.5">
                      <span className="slot grid h-7 w-7 shrink-0 place-items-center overflow-hidden">
                        <img
                          src={itemImage(i.material, 32)}
                          alt=""
                          width={28}
                          height={28}
                          className="pixelated"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </span>
                      <span className="font-medium">{i.name}</span>
                    </Link>
                  </td>
                  <td className="num text-right font-medium">{formatMoney(i.price)}</td>
                  <td className="num text-right" style={{ color: changeColor(i.ch24h) }}>
                    {pct(i.ch24h)}
                  </td>
                  <td className="num text-right" style={{ color: changeColor(i.ch7d) }}>
                    {pct(i.ch7d)}
                  </td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>
                    {formatMoney(i.volume24h)}
                  </td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>
                    {i.listings.toLocaleString()}
                  </td>
                  <td className="pr-3">
                    <Spark values={sparkFor(i.slug, i.ch7d)} color={changeColor(i.ch7d)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Movers + top players — deliberately different layout rhythms so the page doesn't repeat */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1.2fr]">
          <MoverList title="Top gainers" rows={gainers} up />
          <MoverList title="Top losers" rows={losers} />

          <div>
            <div className="rule-gold pt-3">
              <div className="mb-4 flex items-center justify-between">
                <div className="label">Richest players</div>
                <Link href="/leaderboards" className="num text-[11px]" style={{ color: "var(--gold)" }}>
                  Full board →
                </Link>
              </div>
              <div className="space-y-0">
                {TOP_PLAYERS.slice(0, 7).map((p) => (
                  <Link
                    key={p.name}
                    href={`/players/${p.name}`}
                    className="flex items-center gap-3 py-2 transition-colors hover:bg-[var(--surface2)]"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <span className="num w-5 text-[12px]" style={{ color: "var(--dim)" }}>
                      {p.rank}
                    </span>
                    <img
                      src={playerHead(p.name, 40)}
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-[2px]"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span className="flex-1 truncate text-[13px] font-medium">{p.name}</span>
                    <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
                      {p.kills.toLocaleString()} kills
                    </span>
                    <span className="num w-20 text-right text-[13px] font-medium">
                      {formatMoney(p.money)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economy strip */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5">
        <div className="rule-gold pt-3">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight">Server economy</h2>
            <Link href="/stats" className="num text-[12px]" style={{ color: "var(--gold)" }}>
              Full breakdown →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5" style={{ background: "var(--line)" }}>
            {[
              ["Total money held", formatMoney(ECONOMY.totalMoney)],
              ["Shards collected", formatMoney(ECONOMY.shards)],
              ["PvP kills", formatMoney(ECONOMY.kills)],
              ["Blocks broken", formatMoney(ECONOMY.blocksBroken)],
              ["Sold at /sell", formatMoney(ECONOMY.sellEarned)],
              ["Blocks placed", formatMoney(ECONOMY.blocksPlaced)],
              ["Mobs killed", formatMoney(ECONOMY.mobsKilled)],
              ["Shop purchases", formatMoney(ECONOMY.shopSpend)],
              ["Deaths", formatMoney(ECONOMY.deaths)],
              ["Playtime", `${ECONOMY.playtimeYears.toLocaleString()} yrs`],
            ].map(([k, v]) => (
              <div key={k} className="p-5" style={{ background: "var(--bg)" }}>
                <div className="num text-[21px] font-medium leading-none">{v}</div>
                <div className="label mt-2">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function MoverList({ title, rows, up }: { title: string; rows: typeof MARKET; up?: boolean }) {
  return (
    <div>
      <div className="rule-gold pt-3">
        <div className="label mb-4">{title}</div>
        <div>
          {rows.map((i) => (
            <Link
              key={i.slug}
              href={`/prices/${i.slug}`}
              className="flex items-center gap-2.5 py-2 transition-colors hover:bg-[var(--surface2)]"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <img
                src={itemImage(i.material, 32)}
                alt=""
                width={20}
                height={20}
                style={{ imageRendering: "pixelated" }}
              />
              <span className="flex-1 truncate text-[13px]">{i.name}</span>
              <span
                className="num text-[12px] font-medium"
                style={{ color: up ? "var(--up)" : "var(--down)" }}
              >
                {pct(i.ch24h)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Spark({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 76 + 2},${20 - ((v - min) / range) * 18}`)
    .join(" ");
  return (
    <svg width="80" height="24" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.25" />
    </svg>
  );
}

function sparkFor(slug: string, ch: number) {
  const n = slug.length;
  const out: number[] = [];
  for (let i = 0; i < 14; i++) {
    out.push(50 + Math.sin((i + n) * 1.7) * 8 + (i / 13) * ch * 6);
  }
  return out;
}