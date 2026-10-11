import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, PlayerCell, formatNum } from "@/components/ui";
import { rankedPlayers, marketItems, live } from "@/lib/read";

export const instant = false;

export const metadata = {
  title: "Player Finder — Search DonutSMP Players",
  description: "Search tracked DonutSMP accounts by username.",
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await live();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();

  const all = rankedPlayers();
  const hits = q
    ? all.filter((p) => p.name.toLowerCase().includes(q))
    : all.slice().sort((a, b) => b.views - a.views);

  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1560px] px-4 pt-10">
        <PageHead
          eyebrow={`${all.length} tracked`}
          title="Player finder"
          lede="Search by exact username."
        />

        <form action="/players" className="mt-6 flex max-w-md gap-2">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Username"
            aria-label="Search players"
            className="num flex-1 px-3 py-2.5 text-[13px] outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--line2)", color: "var(--ink)" }}
          />
          <button
            type="submit"
            className="btn px-5 text-[13px] font-medium"
            style={{ background: "var(--gold)", color: "#0a0b0e" }}
          >
            Search
          </button>
        </form>

        <div className="mt-8 border" style={{ borderColor: "var(--line)" }}>
          <table className="dense w-full">
            <thead>
              <tr>
                <th>Player</th>
                <th className="text-right">30d views</th>
                <th className="text-right">Money</th>
                <th className="text-right">Kills</th>
                <th className="text-right">Shards</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((p) => (
                <tr key={p.name}>
                  <td><PlayerCell name={p.name} /></td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>
                    {formatNum(p.views)}
                  </td>
                  <td className="num text-right">{formatNum(p.money)}</td>
                  <td className="num text-right">{formatNum(p.kills)}</td>
                  <td className="num text-right">{formatNum(p.shards)}</td>
                </tr>
              ))}
              {hits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="num py-12 text-center" style={{ color: "var(--dim)" }}>
                    No player matches “{sp.q}”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="num mt-4 text-[10.5px]" style={{ color: "var(--dim)" }}>
          A dash means no observed value yet. Those cells fill in when the collector reports.
        </p>
      </div>

      <Footer />
    </>
  );
}