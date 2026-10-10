import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, Stat, formatMoney } from "@/components/ui";
import { ECONOMY, MARKET, SERVER } from "@/lib/data";

export const instant = false;

export const metadata = {
  title: "DonutSMP Server Statistics — Economy, Players & Activity",
  description: "Full DonutSMP economy breakdown: total money held, shards, kills, deaths, blocks placed and broken, mob kills, shop purchases and sell earnings.",
};

export default function StatsPage() {
  const moneyPerPlayer = ECONOMY.totalMoney / ECONOMY.activePlayers;
  const moneyPerKill = ECONOMY.totalMoney / ECONOMY.kills;

  const tiles = [
    ["Total money held", formatMoney(ECONOMY.totalMoney), "All player balances combined"],
    ["Earned from /sell", formatMoney(ECONOMY.sellEarned), "Lifetime player income"],
    ["Spent in shops", formatMoney(ECONOMY.shopSpend), "Lifetime player spend"],
    ["Shards collected", formatMoney(ECONOMY.shards), "Premium currency held"],
    ["PvP kills", formatMoney(ECONOMY.kills), "Players killing players"],
    ["Mobs killed", formatMoney(ECONOMY.mobsKilled), "Farm output"],
    ["Blocks placed", formatMoney(ECONOMY.blocksPlaced), "Building volume"],
    ["Blocks broken", formatMoney(ECONOMY.blocksBroken), "Mining volume"],
    ["Deaths", formatMoney(ECONOMY.deaths), "All players combined"],
    ["Playtime", `${ECONOMY.playtimeYears.toLocaleString()} yrs`, "Total time connected"],
  ];

  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${ECONOMY.activePlayers.toLocaleString()} active players · data ${SERVER.updatedMinutesAgo}m old`}
          title="Server statistics"
          lede="Server-wide sums. Running totals, not estimates."
        />

        <div className="mt-8 grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5"
          style={{ background: "var(--line)" }}>
          {tiles.map(([label, value, sub]) => (
            <div key={label} className="p-5" style={{ background: "var(--bg)" }}>
              <div className="num text-[23px] font-medium leading-none">{value}</div>
              <div className="label mt-2.5">{label}</div>
              <div className="mt-1.5 text-[11px]" style={{ color: "var(--dim)" }}>{sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel>
            <div className="label mb-4">Derived ratios</div>
            <div className="space-y-4">
              <Stat label="Money per active player" value={formatMoney(moneyPerPlayer)} />
              <Stat label="Money per kill" value={formatMoney(moneyPerKill)} />
              <Stat label="Sell income per player"
                value={formatMoney(ECONOMY.sellEarned / ECONOMY.activePlayers)} />
              <Stat label="Average playtime"
                value={`${((ECONOMY.playtimeYears * 365) / ECONOMY.activePlayers).toFixed(0)} days`} />
            </div>
          </Panel>

          <Panel className="lg:col-span-2">
            <div className="label mb-4">Money flow</div>
            <div className="space-y-5">
              <FlowBar label="Earned at /sell" value={ECONOMY.sellEarned}
                max={ECONOMY.sellEarned} color="var(--up)" />
              <FlowBar label="Held in accounts" value={ECONOMY.totalMoney}
                max={ECONOMY.sellEarned} color="var(--gold)" />
              <FlowBar label="Spent in shops" value={ECONOMY.shopSpend}
                max={ECONOMY.sellEarned} color="var(--blue)" />
            </div>
            <p className="mt-6 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
              More money has been earned at /sell than currently sits in accounts, which means
              players are net spending — a healthy sign of an active economy rather than a hoarded one.
            </p>
          </Panel>
        </div>
      </div>

      <Footer />
    </>
  );
}

function FlowBar({ label, value, max, color }: {
  label: string; value: number; max: number; color: string;
}) {
  const w = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>{label}</span>
        <span className="num text-[12.5px]">{formatMoney(value)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: "var(--line)" }}>
        <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
      </div>
    </div>
  );
}