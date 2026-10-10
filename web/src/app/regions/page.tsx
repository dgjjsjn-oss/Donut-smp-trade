import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, formatNum } from "@/components/ui";
import { REGIONS, SERVER } from "@/lib/data";

export const metadata = {
  title: "DonutSMP Server Regions — Live Population Map",
  description: "Live player population across all six DonutSMP server regions: EU Central, EU West, NA East, NA West, Asia and Oceania.",
};

export default function RegionsPage() {
  const total = REGIONS.reduce((s, r) => s + r.players, 0);

  return (
    <>
      <TopNav />
      <Ticker items={REGIONS.map((r) => ({ name: r.name, price: r.players, ch: r.trend }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${formatNum(total)} players distributed · updated ${SERVER.updatedMinutesAgo}m ago`}
          title="Server regions"
          lede="DonutSMP splits its world across six regions. Where your friends are decides your ping, and where the population is decides what you can trade."
        />

        {/* Map — a real proportion bar, not a decorative fake map */}
        <Panel className="mt-8">
          <div className="label mb-4">Population share</div>
          <div className="flex h-9 w-full overflow-hidden rounded" style={{ background: "var(--line)" }}>
            {REGIONS.map((r, i) => {
              const shades = ["var(--gold)", "var(--blue)", "var(--up)", "var(--down)", "var(--gold)", "var(--blue)"];
              return (
                <div
                  key={r.id}
                  className="group relative flex items-center justify-center"
                  style={{ width: `${r.share * 100}%`, background: shades[i], opacity: 0.28 + i * 0.1 }}
                >
                  <span className="num text-[11px] font-medium" style={{ color: "var(--bg)" }}>
                    {r.short}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONS.map((r) => (
              <div key={r.id} style={{ borderTop: "1px solid var(--line)" }} className="pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-medium">{r.name}</span>
                  <span
                    className="num text-[12px]"
                    style={{ color: r.trend >= 0 ? "var(--up)" : "var(--down)" }}
                  >
                    {r.trend >= 0 ? "+" : ""}{r.trend}%
                  </span>
                </div>
                <div className="num mt-2 text-[22px] font-medium leading-none">
                  {r.players.toLocaleString()}
                </div>
                <div className="label mt-1.5">online now</div>
                <div className="num mt-3 text-[11px]" style={{ color: "var(--dim)" }}>
                  {(r.share * 100).toFixed(0)}% of server · peak {formatNum(r.peak)}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="mt-4">
          <div className="label mb-3">Why region matters</div>
          <p className="max-w-[70ch] text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
            Trading works over chat, but farming does not. Spawner profit per hour depends on your
            tick rate, and tick rate depends on region. EU Central carries the largest share of the
            population, which means the deepest auction — and the most competition on undercut.
            Oceania has the thinnest market and the quietest prices.
          </p>
        </Panel>
      </div>

      <Footer />
    </>
  );
}