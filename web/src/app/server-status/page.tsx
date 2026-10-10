import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, Stat, formatNum } from "@/components/ui";
import { SERVER, REGIONS, MARKET } from "@/lib/data";

export const instant = false;

export const metadata = {
  title: "DonutSMP Server Status — Is DonutSMP Online?",
  description: "Live DonutSMP server status: player count, ping, version, uptime and regional population.",
};

export default function ServerStatus() {
  const total = REGIONS.reduce((s, r) => s + r.players, 0);
  const online = true;

  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`checked ${SERVER.updatedMinutesAgo}m ago`}
          title="Server status"
          lede="Last reading from the collector."
          meta={
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: online ? "var(--up)" : "var(--down)" }}
              />
              <span
                className="num text-[13px] font-medium"
                style={{ color: online ? "var(--up)" : "var(--down)" }}
              >
                {online ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          }
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Panel><Stat label="Players online" value={SERVER.online.toLocaleString()} sub={`of ${SERVER.max.toLocaleString()} slots`} /></Panel>
          <Panel><Stat label="Ping" value={`${SERVER.ping}ms`} tone={SERVER.ping < 80 ? "var(--up)" : "var(--down)"} /></Panel>
          <Panel><Stat label="Version" value={`v${SERVER.version}`} /></Panel>
          <Panel><Stat label="Uptime" value={`${SERVER.uptimeDays} days`} /></Panel>
        </div>

        <Panel className="mt-4">
          <div className="label mb-5">Capacity</div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
            <div className="h-full rounded-full"
              style={{ width: `${(SERVER.online / SERVER.max) * 100}%`, background: "var(--gold)" }} />
          </div>
          <div className="num mt-2 flex justify-between text-[11px]" style={{ color: "var(--dim)" }}>
            <span>{SERVER.online.toLocaleString()} online</span>
            <span>{((SERVER.online / SERVER.max) * 100).toFixed(1)}% full</span>
          </div>
        </Panel>

        <Panel className="mt-4">
          <div className="label mb-5">Regional population — {total.toLocaleString()} tracked</div>
          <div className="space-y-3.5">
            {REGIONS.map((r) => (
              <div key={r.id}>
                <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
                  <span>{r.name}</span>
                  <span className="num" style={{ color: "var(--muted)" }}>
                    {r.players.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${(r.players / Math.max(...REGIONS.map((x) => x.players))) * 100}%`,
                      background: "var(--blue)" }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Footer />
    </>
  );
}