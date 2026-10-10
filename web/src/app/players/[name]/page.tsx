import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { Breadcrumb, PageHead, Panel, Stat, formatMoney, formatNum } from "@/components/ui";
import { PLAYERS, MARKET, REGIONS } from "@/lib/data";
import { playerHead, itemImage } from "@/lib/items";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ name: p.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return {
    title: `${name} — DonutSMP Stats, Money, Kills & Playtime`,
    description: `Full statistics for ${name} on DonutSMP: balance, kills, deaths, shards, playtime and trade history.`,
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const p = PLAYERS.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!p) notFound();

  const kd = (p.kills / Math.max(1, p.deaths)).toFixed(2);
  const rank = PLAYERS.slice().sort((a, b) => b.money - a.money).findIndex((x) => x.name === p.name) + 1;
  const held = MARKET.slice(0, 6).map((m) => ({ m, worth: m.price * 4 }));

  return (
    <>
      <TopNav />
      <Ticker items={PLAYERS.slice(0, 8).map((x) => ({ name: x.name, price: x.money, ch: 0 }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-8">
        <Breadcrumb trail={[["Players", "/players"], [p.name, `/players/${p.name}`]]} />

        {/* Profile header — real skin, not an avatar circle */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src={playerHead(p.name, 160)}
            alt="" width={96} height={96}
            className="shrink-0 rounded"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="min-w-0">
            <h1 className="text-[32px] font-semibold leading-none tracking-tight sm:text-[40px]">
              {p.name}
            </h1>
            <div className="num mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px]" style={{ color: "var(--dim)" }}>
              <span>Rank #{rank} by money</span>
              <span>{p.playtimeDays.toLocaleString()} days played</span>
              <span>{kd} K/D</span>
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Panel>
            <div className="label mb-5">Wealth</div>
            <div className="num text-[40px] font-semibold leading-none">{formatMoney(p.money)}</div>
            <div className="label mt-2">Current balance</div>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Stat label="Earned from /sell" value={formatMoney(p.sellEarned)} />
              <Stat label="Spent in shops" value={formatMoney(p.shopSpend)} />
              <Stat label="Shards" value={formatNum(p.shards)} />
            </div>
          </Panel>

          <Panel>
            <div className="label mb-5">Combat</div>
            <div className="grid grid-cols-2 gap-6">
              <Stat label="Kills" value={p.kills.toLocaleString()} tone="var(--up)" />
              <Stat label="Deaths" value={p.deaths.toLocaleString()} tone="var(--down)" />
              <Stat label="Mobs killed" value={formatNum(p.mobsKilled)} />
              <Stat label="K/D ratio" value={kd} />
            </div>
          </Panel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel>
            <div className="label mb-5">Building</div>
            <div className="grid grid-cols-2 gap-6">
              <Stat label="Blocks placed" value={formatNum(p.blocksPlaced)} />
              <Stat label="Blocks broken" value={formatNum(p.blocksBroken)} />
            </div>
            <div className="mt-6 h-1 w-full" style={{ background: "var(--line)" }}>
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, (p.blocksPlaced / p.blocksBroken) * 100)}%`,
                  background: "var(--gold)",
                }}
              />
            </div>
            <p className="num mt-2 text-[11px]" style={{ color: "var(--dim)" }}>
              Placed {(p.blocksPlaced / Math.max(1, p.blocksBroken) * 100).toFixed(0)}% as many blocks as broken
            </p>
          </Panel>

          <Panel>
            <div className="label mb-4">What this balance is worth</div>
            <div className="space-y-0">
              {held.map(({ m, worth }) => (
                <div key={m.slug} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: "1px solid var(--line)" }}>
                  <span className="slot grid h-6 w-6 shrink-0 place-items-center overflow-hidden">
                    <img src={itemImage(m.material, 64)} alt="" width={18} height={18}
                      style={{ imageRendering: "pixelated" }} />
                  </span>
                  <span className="flex-1 truncate text-[12.5px]" style={{ color: "var(--muted)" }}>
                    {worth.toLocaleString()}× {m.name}
                  </span>
                  <span className="num text-[12px]">{formatMoney(m.price * 4)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <p className="mt-10 text-[13px] leading-relaxed" style={{ color: "var(--dim)" }}>
          Statistics are read from the server by our collector. We never trade on any account and
          never touch player inventories.
        </p>
      </div>

      <Footer />
    </>
  );
}