import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { LiveDot } from "@/components/live";
import { Spark, Delta, formatMoney, Meter, changeColor } from "@/components/ui";
import { ItemIcon } from "@/components/itemicon";
import { BlockGround, OreVeins, SkyGlow, VoxelStack } from "@/components/world";
import { SERVER, REGIONS } from "@/lib/data";
import { marketItems, rankedPlayers, live } from "@/lib/read";
import { playerHead } from "@/lib/items";

type MarketRow = ReturnType<typeof marketItems>[number];

export const instant = false;

export const metadata = {
  title: "DonutSMP Trader - Live Auction Prices",
  description:
    "Live DonutSMP auction prices, completed sales and player stats. Collected by our own bot.",
};

export default async function Home() {
  await live();
  const top = marketItems().slice().sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
  const gainers = marketItems().slice().sort((a, b) => b.ch24h - a.ch24h).slice(0, 5);
  const losers = marketItems().slice().sort((a, b) => a.ch24h - b.ch24h).slice(0, 5);
  const maxRegion = Math.max(...REGIONS.map((r) => r.players));

  // Real market structure, derived from the live store.
  const onBooks = marketItems().reduce((s, m) => s + m.price * m.listings, 0);
  const volume24 = marketItems().reduce((s, m) => s + m.volume24h, 0);
  const listings = marketItems().reduce((s, m) => s + m.listings, 0);
  const biggestMove = marketItems().reduce((a, b) => (Math.abs(b.ch24h) > Math.abs(a.ch24h) ? b : a));
  const thinnest = marketItems().reduce((a, b) => (b.listings < a.listings ? b : a));
  const dearest = marketItems().reduce((a, b) => (b.price > a.price ? b : a));

  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* ── HERO: real voxel world ── */}
      <section className="relative overflow-hidden">
        <SkyGlow />
        <OreVeins />
        <BlockGround top="grass_block" side="dirt" height={150} />

        <div className="relative mx-auto max-w-[1560px] px-4 pb-24 pt-12">
          <div className="grid items-end gap-10 lg:grid-cols-[1.7fr_1fr]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <LiveDot label="Live" />
                <span className="badge" style={{ color: "var(--dim)", border: "1px solid var(--line)" }}>
                  {SERVER.updatedMinutesAgo}m ago
                </span>
              </div>

              <h1
                className="pixel"
                style={{
                  fontSize: "clamp(2.1rem, 6.2vw, 4.4rem)",
                  lineHeight: 1.05,
                  textShadow: "0 4px 0 rgba(0,0,0,0.55)",
                }}
              >
                DONUTSMP<br />marketItems()
              </h1>

              {/* Real marketItems() briefing — four facts a trader can act on */}
              <div className="mt-8 grid max-w-[640px] grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
                <Brief
                  label="On the books"
                  value={formatMoney(onBooks)}
                  sub={`${listings.toLocaleString()} listings`}
                />
                <Brief
                  label="24h volume"
                  value={formatMoney(volume24)}
                  sub="traded value"
                />
                <Brief
                  label="Biggest move"
                  value={pctText(biggestMove.ch24h)}
                  sub={biggestMove.name}
                  tone={changeColor(biggestMove.ch24h)}
                />
                <Brief
                  label="Thinnest book"
                  value={String(thinnest.listings)}
                  sub={thinnest.name}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <Link href="/prices" className="btn px-5 py-2.5 text-[12.5px] font-semibold"
                  style={{ background: "var(--gold)", color: "#0a0b0e" }}>
                  All prices
                </Link>
                <Link href="/auction" className="btn num border px-5 py-2.5 text-[12px] hover:border-[var(--line2)]"
                  style={{ borderColor: "var(--line2)" }}>
                  Auction
                </Link>
                <span className="num ml-1 text-[11px]" style={{ color: "var(--dim)" }}>
                  dearest: {dearest.name} {formatMoney(dearest.price)}
                </span>
              </div>
            </div>

            {/* Floating hero items, staggered like an inventory */}
            <div className="flex items-end justify-start gap-3 lg:justify-end">
              {top.slice(0, 4).map((i, idx) => (
                <Link
                  key={i.slug}
                  href={`/prices/${i.slug}`}
                  className="transition-transform hover:-translate-y-1"
                  style={{ marginBottom: idx % 2 ? 34 : 0 }}
                >
                  <ItemIcon material={i.material} name={i.name} size={idx === 0 ? 80 : 58} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VOXEL MARQUEE: real blocks as a divider ── */}
      <section className="relative mx-auto max-w-[1560px] px-4">
        <div className="flex items-center gap-0 overflow-hidden py-3" aria-hidden>
          {["diamond_block", "netherite_block", "gold_block", "emerald_block", "coal_block",
            "iron_block", "lapis_block", "copper_block", "amethyst_block", "quartz_block"].map((b, i) => (
            <img
              key={i}
              src={`/items/${b}.png`}
              alt=""
              width={38}
              height={38}
              className="px shrink-0 opacity-45"
            />
          ))}
        </div>
      </section>

      {/* ── marketItems() ── */}
      <section className="mx-auto mt-8 max-w-[1560px] px-4">
        <div className="flex items-end justify-between">
          <span className="label" style={{ color: "var(--gold)" }}>[ By volume ]</span>
          <Link href="/prices" className="num text-[11px]" style={{ color: "var(--muted)" }}>All →</Link>
        </div>
        <div className="mt-3 border" style={{ borderColor: "var(--line)" }}>
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
                    <td className="num text-right" style={{ color: "var(--muted)" }}>{formatMoney(i.volume24h)}</td>
                    <td className="flex justify-end pr-3">
                      <Spark values={i.spark} color={i.ch7d >= 0 ? "var(--up)" : "var(--down)"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MOVERS — no panel chrome, different rhythm ── */}
      <section className="mx-auto mt-14 max-w-[1560px] px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Movers title="Gainers" rows={gainers} tone="var(--up)" />
          <Movers title="Losers" rows={losers} tone="var(--down)" />
        </div>
      </section>

      {/* ── SERVERS + rankedPlayers() — asymmetric ── */}
      <section className="mx-auto mt-16 max-w-[1560px] px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="label" style={{ color: "var(--gold)" }}>[ Server ]</span>
            <div className="num mt-4 text-[52px] font-semibold leading-none">
              {SERVER.online.toLocaleString()}
            </div>
            <div className="num mt-2 text-[10.5px]" style={{ color: "var(--dim)" }}>
              online // {SERVER.ping}ms // v{SERVER.version}
            </div>
            <div className="mt-5 h-1 w-full" style={{ background: "var(--line)" }}>
              <div className="h-full" style={{ width: `${(SERVER.online / SERVER.max) * 100}%`, background: "var(--gold)" }} />
            </div>
            <div className="mt-6 space-y-3">
              {REGIONS.map((r) => (
                <Meter key={r.id} label={r.name} value={r.players}
                  display={r.players.toLocaleString()} max={maxRegion} color="var(--blue)" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <span className="label" style={{ color: "var(--gold)" }}>[ Richest ]</span>
              <Link href="/leaderboards" className="num text-[11px]" style={{ color: "var(--muted)" }}>All →</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rankedPlayers().slice(0, 6).map((p, i) => (
                <Link
                  key={p.name}
                  href={`/rankedPlayers()/${p.name}`}
                  className="group border p-3 transition-colors hover:border-[var(--line2)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <img
                    src={`https://mc-heads.net/body/${encodeURIComponent(p.name)}/300`}
                    alt={`${p.name} skin`}
                    width={300}
                    height={500}
                    className="px h-24 w-full object-contain object-bottom"
                    loading="lazy"
                  />
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="num text-[10px]" style={{ color: i < 3 ? "var(--gold)" : "var(--dim)" }}>
                      #{i + 1}
                    </span>
                    <span className="row-ref truncate text-[12px] font-medium">{p.name}</span>
                  </div>
                  <div className="num mt-1 text-[12px]" style={{ color: "var(--muted)" }}>
                    {formatMoney(p.money)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/** One real marketItems() fact. Number first, context second. No adjectives. */
function Brief({ label, value, sub, tone }: {
  label: string; value: string; sub: string; tone?: string;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      <div
        className="num mt-1.5 text-[19px] font-medium leading-none"
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </div>
      <div className="num mt-1 truncate text-[10.5px]" style={{ color: "var(--dim)" }}>
        {sub}
      </div>
    </div>
  );
}

function pctText(n: number) {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function Movers({ title, rows, tone }: { title: string; rows: MarketRow[]; tone: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="label" style={{ color: tone }}>[ {title} ]</span>
        <span className="h-px flex-1" style={{ background: "var(--line)" }} />
      </div>
      <div className="mt-4">
        {rows.map((i) => (
          <Link
            key={i.slug}
            href={`/prices/${i.slug}`}
            className="flex items-center gap-3 py-2.5 transition-colors hover:bg-[var(--surface2)]"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <ItemIcon material={i.material} name={i.name} size={22} />
            <span className="flex-1 truncate text-[12.5px]">{i.name}</span>
            <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
              {formatMoney(i.price)}
            </span>
            <span className="num w-16 text-right font-medium" style={{ color: tone }}>
              {i.ch24h > 0 ? "+" : ""}{i.ch24h.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
