import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, formatNum } from "@/components/ui";
import { playerHead } from "@/lib/items";
import { BOARDS, PLAYERS, marketItems, live } from "@/lib/read";

export const instant = false;

export const metadata = {
  title: "DonutSMP Leaderboards — Most Looked Up, Money, Kills",
  description:
    "DonutSMP player leaderboards. Real 30-day profile views, plus money, kills, shards and playtime as the collector reports them.",
};

export default async function Leaderboards() {
  await live();

  const top = PLAYERS.slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  const pendingBoards = BOARDS.filter((b) => b.pending);

  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1560px] px-4 pt-10">
        <PageHead
          eyebrow={`${PLAYERS.length} tracked accounts`}
          title="Leaderboards"
          lede="One board has observed data. The rest fill in as the collector reports."
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Real data */}
          <div>
            <div className="compartment pt-3">
              <span className="label" style={{ color: "var(--gold)" }}>
                [ Most looked up · 30 days ]
              </span>
            </div>
            <div className="mt-3 border" style={{ borderColor: "var(--line)" }}>
              {top.map((p, i) => (
                <Link
                  key={p.name}
                  href={`/players/${p.name}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--surface2)]"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <span className="num w-7 shrink-0 text-right text-[12px]" style={{ color: "var(--dim)" }}>
                    {i + 1}
                  </span>
                  <img src={playerHead(p.name, 40)} alt={`${p.name} player head`} width={24} height={24} className="px shrink-0" loading="lazy" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{p.name}</span>
                  {p.featured ? (
                    <span className="badge" style={{ color: "var(--gold)", border: "1px solid var(--line)" }}>
                      Featured
                    </span>
                  ) : null}
                  <span className="num w-16 shrink-0 text-right text-[12px] text-[var(--muted)]">
                    {formatNum(p.views)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pending boards, honest */}
          <div>
            <div className="compartment pt-3">
              <span className="label" style={{ color: "var(--dim)" }}>[ Awaiting collector ]</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {pendingBoards.map((b) => (
                <Link
                  key={b.key}
                  href={`/leaderboards/${b.key}`}
                  className="group border p-3 transition-colors hover:border-[var(--line2)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] transition-colors group-hover:text-[var(--gold)]">
                      {b.label}
                    </span>
                    <span className="num text-[10px]" style={{ color: "var(--dim)" }}>
                      —
                    </span>
                  </div>
                  <div className="num mt-1 text-[10px]" style={{ color: "var(--dim)" }}>
                    no data yet
                  </div>
                </Link>
              ))}
            </div>

            <Panel className="mt-4">
              <div className="label mb-3">Why some boards are empty</div>
              <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
                Balances, kills and playtime require a live connection to the server. We would
                rather show an honest blank than a plausible fake — a trader cannot tell a
                fabricated balance from a real one at a glance, and will trade on it.
              </p>
            </Panel>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}