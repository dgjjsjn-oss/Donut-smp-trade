import Link from "next/link";

import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, PlayerCell, formatMoney } from "@/components/ui";
import { PLAYERS, BOARDS, boardValue, SERVER } from "@/lib/data";

export const instant = false;
export const metadata = {
  title: "Player Finder — Search DonutSMP Players",
  description: "Search DonutSMP players and view money, kills, shards and playtime for any tracked account.",
};
export default async function Players({
  searchParams,
}: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const hits = q ? PLAYERS.filter((p) => p.name.toLowerCase().includes(q)) : PLAYERS;
  return (
    <>
      <TopNav />
      <Ticker items={PLAYERS.slice(0, 8).map((p) => ({ name: p.name, price: p.money, ch: 0 }))} />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${PLAYERS.length} tracked · updated ${SERVER.updatedMinutesAgo}m ago`}
          title="Player finder"
          lede="Every tracked account with its full stat line. Search by name, or browse the boards to find who leads what."
        />
        <form action="/players" className="mt-6 flex max-w-md gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search a player…"
            className="num flex-1 px-3 py-2.5 text-[13px] outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--line2)", color: "var(--ink)" }}
          />
          <button
            type="submit"
            className="num px-4 text-[13px] font-medium transition-transform active:scale-95"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Search
          </button>
        </form>
        <div className="mt-8" style={{ border: "1px solid var(--line)" }}>
          <table className="dense w-full min-w-[860px]">
            <thead>
              <tr>
                <th>Player</th>
                <th className="text-right">Money</th>
                <th className="text-right">Kills</th>
                <th className="text-right">Shards</th>
                <th className="text-right">Playtime</th>
                <th className="text-right">Deaths</th>
                <th className="text-right">Sold</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((p) => (
                <tr key={p.name}>
                  <td><PlayerCell name={p.name} /></td>
                  <td className="num text-right font-medium">{formatMoney(p.money)}</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{p.kills.toLocaleString()}</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{p.shards.toLocaleString()}</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{p.playtimeDays}d</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{p.deaths.toLocaleString()}</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{formatMoney(p.sellEarned)}</td>
                </tr>
              ))}
              {hits.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center" style={{ color: "var(--dim)" }}>
                    No player matches “{sp.q}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}