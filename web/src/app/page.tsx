import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { LiveDot } from "@/components/live";
import { Panel, Spark, Delta, formatMoney, Meter } from "@/components/ui";
import { MARKET, ECONOMY, PLAYERS, SERVER, REGIONS } from "@/lib/data";
import { itemImage, playerHead } from "@/lib/items";

export const metadata = {
  title: "DonutSMP Trader — Live Auction Prices, Sales & Player Stats",
  description:
    "Live DonutSMP auction prices, completed sales, price history, leaderboards and server stats — collected by our own bot, not a third-party API.",
};

export default function Home() {
  const top6 = MARKET.slice().sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
  const gainers = MARKET.slice().sort((a, b) => b.ch24h - a.ch24h).slice(0, 5);
  const losers = MARKET.slice().sort((a, b) => a.ch24h - b.ch24h).slice(0, 5);
  const totalRegional = REGIONS.reduce((s, r) => s + r.players, 0);
  const up = MARKET.filter((i) => i.ch24h > 0).length;
  const down = MARKET.filter((i) => i.ch24h < 0).length;

  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* ── MASTHEAD: asymmetric 2fr/1fr, macro typography, no centred hero ── */}
      <section className="mx-auto max-w-[1560px] px-4 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.75fr_1fr]">
          <div>
            <div className="num mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
              <LiveDot label="LIVE FEED" />
              <span className="label">snapshot {SERVER.updatedMinutesAgo}m ago</span>
              <span className="label" style={{ color: "var(--dim)" }}>collector online</span>
            </div>

            <h1 className="macro">
              The DonutSMP<br />
              <span style={{ color: "var(--dim)" }}>market, read</span> at<br />
              trader speed.
            </h1>

            <p
              className="mt-7 max-w-[54ch] text-[14px] leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Auction listings, completed sales, price history and player standings — collected
              from the server by our own bot. No upstream API. No paid provider that can throttle
              us. When the data is old the badge says so.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link
                href="/prices"
                className="px-5 py-2.5 text-[12.5px] font-semibold transition-transform active:scale-[0.98]"
                style={{ background: "var(--gold)", color: "#0a0b0e" }}
              >
                Browse item prices
              </Link>
              <Link
                href="/transactions"
                className="num border px-5 py-2.5 text-[12.5px] transition-colors hover:border-[var(--line2)]"
                style={{ borderColor: "var(--line2)" }}
              >
                Completed sales
              </Link>
              <Link href="/api" className="num px-2 py-2.5 text-[11.5px]" style={{ color: "var(--dim)" }}>
                /api →
              </Link>
            </div>
          </div>

          {/* ── TELEMETRY RAIL ── */}
          <div>
            <Panel title="Server telemetry">
              <div className="num text-[44px] font-semibold leading-none">
                {SERVER.online.toLocaleString()}
              </div>
              <div className="num mt-2 text-[11px]" style={{ color: "var(--dim)" }}>
                players online // {SERVER.ping}ms // v{SERVER.version}
              </div>

              <div className="mt-4 h-1 w-full" style={{ background: "var(--line)" }}>
                <div className="h-full" style={{
                  width: `${(SERVER.online / SERVER.max) * 100}%`, background: "var(--gold)",
                }} />
              </div>

              <div className="gridline mt-5 grid grid-cols-2">
                {[
                  ["Items priced", String(MARKET.length)],
                  ["Catalogue", "600+"],
                  ["Rising 24h", `+${up}`],
                  ["Falling 24h", String(down)],
                ].map(([k, v]) => (
                  <div key={k} className="px-3 py-2.5">
                    <div className="num text-[16px] font-medium leading-none">{v}</div>
                    <div className="label mt-1.5">{k}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2.5">
                {REGIONS.slice(0, 4).map((r) => (
                  <Meter
                    key={r.id}
                    label={r.name}
                    value={r.players}
                    display={r.players.toLocaleString()}
                    max={Math.max(...REGIONS.map((x) => x.players))}
                    color="var(--blue)"
                  />
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* ── MARKET TABLE ── */}
      <section className="mx-auto mt-16 max-w-[1560px] px-4">
        <div className="compartment flex flex-wrap items-end justify-between gap-3 pt-3">
          <div>
            <span className="label" style={{ color: "var(--gold)" }}>[ Market by traded volume ]</span>
            <h2 className="h-sec mt-2">Highest turnover</h2>
          </div>
          <Link href="/prices" className="num text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--gold)" }}>
            All items →
          </Link>
        </div>

        <Panel flush className="mt-4">
          <div className="overflow-x-auto">
            <table className="dense min-w-[880px]">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Lowest</th>
                  <th className="text-right">24h</th>
                  <th className="text-right">7d</th>
                  <th className="text-right">24h volume</th>
                  <th className="text-right">Listings</th>
                  <th className="w-28 text-right">7d trend</th>
                </tr>
              </thead>
              <tbody>
                {top6.map((i) => (
                  <tr key={i.slug}>
                    <td>
                      <Link href={`/prices/${i.slug}`} className="flex min-w-0 items-center gap-2.5">
                        <span className="slot grid h-7 w-7 shrink-0 place-items-center overflow-hidden">
                          <img src={itemImage(i.material, 64)} alt="" width={24} height={24} className="px" />
                        </span>
                        <span className="row-ref truncate text-[12.5px] font-medium">{i.name}</span>
                      </Link>
                    </td>
                    <td className="num text-right font-medium">{formatMoney(i.price)}</td>
                    <td className="text-right"><Delta v={i.ch24h} /></td>
                    <td className="text-right"><Delta v={i.ch7d} /></td>
                    <td className="num text-right" style={{ color: "var(--muted)" }}>
                      {formatMoney(i.volume24h)}
                    </td>
                    <td className="num text-right" style={{ color: "var(--muted)" }}>
                      {i.listings.toLocaleString()}
                    </td>
                    <td className="flex justify-end pr-3">
                      <Spark values={i.spark} color={i.ch7d >= 0 ? "var(--up)" : "var(--down)"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      {/* ── MOVERS + BOARD — deliberately different rhythm ── */}
      <section className="mx-auto mt-16 max-w-[1560px] px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1.15fr]">
          <MoverColumn title="Top gainers" hint="24h" rows={gainers} up />
          <MoverColumn title="Top losers" hint="24h" rows={losers} />

          <div>
            <div className="compartment flex items-center justify-between pt-3">
              <span className="label" style={{ color: "var(--gold)" }}>[ Richest players ]</span>
              <Link href="/leaderboards" className="num text-[10.5px] uppercase tracking-[0.1em]"
                style={{ color: "var(--muted)" }}>
                Full board →
              </Link>
            </div>
            <Panel flush className="mt-3">
              <table className="dense">
                <tbody>
                  {PLAYERS.slice(0, 7).map((p, i) => (
                    <tr key={p.name}>
                      <td className="num w-8 text-right" style={{ color: i < 3 ? "var(--gold)" : "var(--dim)" }}>
                        {i + 1}
                      </td>
                      <td>
                        <Link href={`/players/${p.name}`} className="flex min-w-0 items-center gap-2.5">
                          <img src={playerHead(p.name, 40)} alt="" width={22} height={22} className="px shrink-0" />
                          <span className="row-ref truncate text-[12.5px] font-medium">{p.name}</span>
                        </Link>
                      </td>
                      <td className="num text-right" style={{ color: "var(--dim)" }}>
                        {p.kills.toLocaleString()}k
                      </td>
                      <td className="num text-right font-medium">{formatMoney(p.money)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        </div>
      </section>

      {/* ── ECONOMY GRID — 1px razor dividers, no cards ── */}
      <section className="mx-auto mt-16 max-w-[1560px] px-4">
        <div className="compartment flex flex-wrap items-end justify-between gap-3 pt-3">
          <div>
            <span className="label" style={{ color: "var(--gold)" }}>[ Server economy ]</span>
            <h2 className="h-sec mt-2">Lifetime totals</h2>
          </div>
          <Link href="/stats" className="num text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--gold)" }}>
            Breakdown →
          </Link>
        </div>

        <div className="gridline mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
            <div key={k} className="px-4 py-5">
              <div className="num text-[19px] font-medium leading-none">{v}</div>
              <div className="label mt-2.5">{k}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

function MoverColumn({ title, hint, rows, up }: {
  title: string; hint: string; rows: typeof MARKET; up?: boolean;
}) {
  return (
    <div>
      <div className="compartment pt-3">
        <div className="flex items-baseline justify-between">
          <span className="label" style={{ color: "var(--gold)" }}>[ {title} ]</span>
          <span className="label">{hint}</span>
        </div>
      </div>
      <Panel flush className="mt-3">
        <table className="dense">
          <tbody>
            {rows.map((i) => (
              <tr key={i.slug}>
                <td>
                  <Link href={`/prices/${i.slug}`} className="flex min-w-0 items-center gap-2.5">
                    <img src={itemImage(i.material, 64)} alt="" width={18} height={18} className="px shrink-0" />
                    <span className="row-ref truncate text-[12.5px]">{i.name}</span>
                  </Link>
                </td>
                <td className="num text-right" style={{ color: "var(--muted)" }}>
                  {formatMoney(i.price)}
                </td>
                <td className="num w-16 text-right font-medium" style={{ color: up ? "var(--up)" : "var(--down)" }}>
                  {i.ch24h > 0 ? "+" : ""}{i.ch24h.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}