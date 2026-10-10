import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { LiveDot } from "@/components/live";
import { Panel, Spark, Delta, formatMoney, Meter } from "@/components/ui";
import { ItemIcon } from "@/components/itemicon";
import { MARKET, PLAYERS, SERVER, REGIONS } from "@/lib/data";
import { playerHead } from "@/lib/items";

export const metadata = {
  title: "DonutSMP Trader - Live Auction Prices",
  description:
    "Live DonutSMP auction prices, completed sales and player stats. Collected by our own bot.",
};

export default function Home() {
  const top = MARKET.slice().sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
  const gainers = MARKET.slice().sort((a, b) => b.ch24h - a.ch24h).slice(0, 5);
  const losers = MARKET.slice().sort((a, b) => a.ch24h - b.ch24h).slice(0, 5);
  const maxRegion = Math.max(...REGIONS.map((r) => r.players));

  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* ── HERO: item sprites first, almost no words ── */}
      <section className="mx-auto max-w-[1560px] px-4 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div>
            <div className="num mb-6 flex flex-wrap items-center gap-x-4 text-[10.5px]">
              <LiveDot label="LIVE" />
              <span className="label">{SERVER.updatedMinutesAgo}m ago</span>
            </div>

            {/* Hero item strip — big real Minecraft art */}
            <div className="flex flex-wrap items-start gap-3 sm:gap-4">
              {top.slice(0, 4).map((i, idx) => (
                <Link
                  key={i.slug}
                  href={`/prices/${i.slug}`}
                  className="group"
                  style={{ transform: `translateY(${idx % 2 ? 26 : 0}px)` }}
                >
                  <ItemIcon
                    material={i.material}
                    name={i.name}
                    size={idx === 0 ? 88 : 68}
                  />
                </Link>
              ))}
            </div>

            <h1 className="macro pixel mt-8" style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.6rem)" }}>MARKET</h1>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href="/prices"
                className="px-5 py-2.5 text-[12.5px] font-semibold transition-transform active:scale-[0.98]"
                style={{ background: "var(--gold)", color: "#0a0b0e" }}
              >
                All prices
              </Link>
              <Link
                href="/auction"
                className="num border px-5 py-2.5 text-[12px] transition-colors hover:border-[var(--line2)]"
                style={{ borderColor: "var(--line2)" }}
              >
                Auction
              </Link>
              <Link href="/leaderboards" className="num px-2 py-2.5 text-[11.5px]" style={{ color: "var(--dim)" }}>
                Boards →
              </Link>
            </div>
          </div>

          {/* Telemetry rail — numbers only */}
          <Panel title="Server">
            <div className="num text-[46px] font-semibold leading-none">
              {SERVER.online.toLocaleString()}
            </div>
            <div className="num mt-2 text-[10.5px]" style={{ color: "var(--dim)" }}>
              online // {SERVER.ping}ms // v{SERVER.version}
            </div>
            <div className="mt-4 h-1 w-full" style={{ background: "var(--line)" }}>
              <div className="h-full" style={{
                width: `${(SERVER.online / SERVER.max) * 100}%`, background: "var(--gold)",
              }} />
            </div>
            <div className="mt-5 space-y-2.5">
              {REGIONS.slice(0, 4).map((r) => (
                <Meter key={r.id} label={r.short} value={r.players}
                  display={r.players.toLocaleString()} max={maxRegion} color="var(--blue)" />
              ))}
            </div>
          </Panel>
        </div>
      </section>

      {/* ── MARKET TABLE ── */}
      <section className="mx-auto mt-14 max-w-[1560px] px-4">
        <div className="compartment flex items-end justify-between pt-3">
          <span className="label" style={{ color: "var(--gold)" }}>[ By volume ]</span>
          <Link href="/prices" className="num text-[11px]" style={{ color: "var(--muted)" }}>
            All →
          </Link>
        </div>
        <Panel flush className="mt-3">
          <div className="overflow-x-auto">
            <table className="dense min-w-[820px]">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">24h</th>
                  <th className="text-right">7d</th>
                  <th className="text-right">Vol</th>
                  <th className="w-24 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {top.map((i) => (
                  <tr key={i.slug}>
                    <td>
                      <Link href={`/prices/${i.slug}`} className="flex items-center gap-2.5">
                        <ItemIcon material={i.material} name={i.name} size={26} />
                        <span className="row-ref truncate text-[12.5px] font-medium">{i.name}</span>
                      </Link>
                    </td>
                    <td className="num text-right font-medium">{formatMoney(i.price)}</td>
                    <td className="text-right"><Delta v={i.ch24h} /></td>
                    <td className="text-right"><Delta v={i.ch7d} /></td>
                    <td className="num text-right" style={{ color: "var(--muted)" }}>
                      {formatMoney(i.volume24h)}
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

      {/* ── MOVERS + PLAYERS ── */}
      <section className="mx-auto mt-14 max-w-[1560px] px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <Movers title="Gainers" rows={gainers} up />
          <Movers title="Losers" rows={losers} />

          <div>
            <div className="compartment flex items-center justify-between pt-3">
              <span className="label" style={{ color: "var(--gold)" }}>[ Richest ]</span>
              <Link href="/leaderboards" className="num text-[10.5px]" style={{ color: "var(--muted)" }}>
                All →
              </Link>
            </div>
            <Panel flush className="mt-3">
              <table className="dense">
                <tbody>
                  {PLAYERS.slice(0, 6).map((p, i) => (
                    <tr key={p.name}>
                      <td className="num w-7 text-right" style={{ color: i < 3 ? "var(--gold)" : "var(--dim)" }}>
                        {i + 1}
                      </td>
                      <td>
                        <Link href={`/players/${p.name}`} className="flex items-center gap-2.5">
                          <img src={playerHead(p.name, 40)} alt="" width={20} height={20} className="px" />
                          <span className="row-ref truncate text-[12.5px] font-medium">{p.name}</span>
                        </Link>
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

      <Footer />
    </>
  );
}

function Movers({ title, rows, up }: { title: string; rows: typeof MARKET; up?: boolean }) {
  return (
    <div>
      <div className="compartment pt-3">
        <span className="label" style={{ color: up ? "var(--up)" : "var(--down)" }}>[ {title} ]</span>
      </div>
      <Panel flush className="mt-3">
        <table className="dense">
          <tbody>
            {rows.map((i) => (
              <tr key={i.slug}>
                <td>
                  <Link href={`/prices/${i.slug}`} className="flex items-center gap-2.5">
                    <ItemIcon material={i.material} name={i.name} size={18} />
                    <span className="row-ref truncate text-[12.5px]">{i.name}</span>
                  </Link>
                </td>
                <td className="num text-right" style={{ color: "var(--muted)" }}>
                  {formatMoney(i.price)}
                </td>
                <td className="num w-14 text-right font-medium" style={{ color: up ? "var(--up)" : "var(--down)" }}>
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