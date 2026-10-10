import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, formatNum } from "@/components/ui";
import { BOARDS, PLAYERS, SERVER } from "@/lib/data";
import { playerHead } from "@/lib/items";

export const instant = false;

export const metadata = {
  title: "DonutSMP Leaderboards — Money, Kills, Playtime & More",
  description:
    "Top DonutSMP players by money, kills, deaths, shards, playtime, blocks placed and broken, mobs killed, shop spend and sell earnings.",
};

export default function Leaderboards() {
  return (
    <>
      <TopNav />
      <Ticker items={PLAYERS.slice(0, 8).map((p) => ({ name: p.name, price: p.money, ch: 0 }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`updated ${SERVER.updatedMinutesAgo}m ago`}
          title="Leaderboards"
          lede="Ten ways to rank a server. Money measures capital, kills measure PvP, playtime measures commitment, and sell earnings measure who actually understands the economy."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARDS.map((b) => (
            <Link
              key={b.key}
              href={`/leaderboards/${b.key}`}
              className="group rounded-lg p-px transition-transform duration-200 active:scale-[0.99]"
              style={{ background: "var(--line)" }}
            >
              <div className="h-full rounded-[7px] p-5 transition-colors group-hover:bg-[var(--surface2)]">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-medium transition-colors group-hover:text-[var(--gold)]">
                    {b.label}
                  </span>
                  <span className="num text-[11px]" style={{ color: "var(--dim)" }}>
                    top 100
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {b.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Panel className="mt-10">
          <div className="label mb-4">Current top 5 by money</div>
          <div className="grid gap-4 sm:grid-cols-5">
            {PLAYERS.slice(0, 5).map((p, i) => (
              <Link key={p.name} href={`/players/${p.name}`} className="min-w-0">
                <img
                  src={playerHead(p.name, 80)}
                  alt="" width={1000} height={220}
                  className="w-full rounded"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="num mt-2 text-[11px]" style={{ color: "var(--dim)" }}>#{i + 1}</div>
                <div className="truncate text-[13px] font-medium">{p.name}</div>
                <div className="num text-[12px]" style={{ color: "var(--muted)" }}>
                  {formatNum(p.money)}
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Footer />
    </>
  );
}