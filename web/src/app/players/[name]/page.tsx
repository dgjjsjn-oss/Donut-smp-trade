import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { Breadcrumb, PageHead, Panel, Stat, formatNum } from "@/components/ui";
import { ItemIcon } from "@/components/itemicon";
import { playerRender, itemImage } from "@/lib/items";
import { rankedPlayer, marketItems, live } from "@/lib/read";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return {
    title: `${name} — DonutSMP Stats`,
    description: `Tracked statistics for ${name} on DonutSMP.`,
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ name: string }> }) {
  await live();
  const { name } = await params;
  const p = rankedPlayer(name);
  if (!p) notFound();

  const kd =
    p.kills !== null && p.deaths
      ? (p.kills / Math.max(1, p.deaths)).toFixed(2)
      : null;

  const held = marketItems().slice(0, 6).map((m) => ({ m, worth: m.price * 4 }));

  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1560px] px-4 pt-8">
        <Breadcrumb trail={[["Players", "/players"], [p.name, `/players/${p.name}`]]} />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src={playerRender(p.name, 400)}
            alt={`${p.name} Minecraft skin`}
            width={180} height={300}
            className="px w-[150px] shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-[32px] font-semibold leading-none tracking-tight sm:text-[40px]">
              {p.name}
            </h1>
            <div className="num mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px]" style={{ color: "var(--dim)" }}>
              <span>{formatNum(p.views)} profile views · 30d</span>
              {p.featured ? <span style={{ color: "var(--gold)" }}>Featured</span> : null}
              {kd ? <span>{kd} K/D</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Panel>
            <div className="label mb-5">Wealth</div>
            <div className="num text-[38px] font-semibold leading-none">{formatNum(p.money)}</div>
            <div className="num mt-2 text-[10.5px]" style={{ color: "var(--dim)" }}>
              {p.money === null ? "balance not reported yet" : "current balance"}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Stat label="Earned at /sell" value={formatNum(p.sellEarned)} />
              <Stat label="Spent in shops" value={formatNum(p.shopSpend)} />
              <Stat label="Shards" value={formatNum(p.shards)} />
            </div>
          </Panel>

          <Panel>
            <div className="label mb-5">Combat</div>
            <div className="grid grid-cols-2 gap-6">
              <Stat label="Kills" value={formatNum(p.kills)} tone="var(--up)" />
              <Stat label="Deaths" value={formatNum(p.deaths)} tone="var(--down)" />
              <Stat label="Mobs killed" value={formatNum(p.mobsKilled)} />
              <Stat label="K/D" value={kd ?? "—"} />
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
            {p.blocksPlaced !== null && p.blocksBroken ? (
              <>
                <div className="mt-6 h-1 w-full" style={{ background: "var(--line)" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, (p.blocksPlaced / p.blocksBroken) * 100)}%`,
                      background: "var(--gold)",
                    }}
                  />
                </div>
                <p className="num mt-2 text-[10.5px]" style={{ color: "var(--dim)" }}>
                  Placed {((p.blocksPlaced / p.blocksBroken) * 100).toFixed(0)}% as many as broken
                </p>
              </>
            ) : null}
          </Panel>

          <Panel>
            <div className="label mb-4">What this balance would buy</div>
            <div>
              {held.map(({ m, worth }) => (
                <Link
                  key={m.slug}
                  href={`/prices/${m.slug}`}
                  className="flex items-center gap-3 py-2 transition-colors hover:bg-[var(--surface2)]"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <ItemIcon material={m.material} name={m.name} size={18} />
                  <span className="flex-1 truncate text-[12.5px]" style={{ color: "var(--muted)" }}>
                    4× {m.name}
                  </span>
                  <span className="num text-[12px]">{formatNum(worth)}</span>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <p className="mt-10 text-[12.5px] leading-relaxed" style={{ color: "var(--dim)" }}>
          A dash means no observed value yet. We never fill a cell with a plausible number.
        </p>
      </div>

      <Footer />
    </>
  );
}