import { TopNav, Footer } from "@/components/layout";
import { PageHead, Panel } from "@/components/ui";

export const metadata = {
  title: "Public API — DonutSMP Trader",
  description: "Free read-only JSON API for DonutSMP prices, listings and leaderboards.",
};

export default function ApiPage() {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow="Free · read-only · no key required"
          title="Public API"
          lede="The same data that powers this site, as JSON. Built for bots, dashboards and Discord embeds. Rate limited, cached, and free."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Endpoint
            path="/api/prices"
            desc="All tracked items with price, 24h/7d change, listing count and volume."
            example='curl https://donutsmp.trade/api/prices'
          />
          <Endpoint
            path="/api/prices/[item]"
            desc="One item's current price plus its full history series."
            example='curl https://donutsmp.trade/api/prices/diamond'
          />
          <Endpoint
            path="/api/auction?item=[item]"
            desc="Active listings for an item, sorted by asking price."
            example='curl "https://donutsmp.trade/api/auction?item=diamond"'
          />
          <Endpoint
            path="/api/leaderboards/[board]"
            desc="Ranked players. One of: money, kills, deaths, shards, playtime."
            example='curl https://donutsmp.trade/api/leaderboards/money'
          />
          <Endpoint
            path="/api/players/[name]"
            desc="Full stat line for one account."
            example='curl https://donutsmp.trade/api/players/jesticc'
          />
          <Endpoint
            path="/api/status"
            desc="Server health: player count, ping, version, data freshness."
            example='curl https://donutsmp.trade/api/status'
          />
        </div>

        <Panel className="mt-6">
          <div className="label mb-4">Ingest — for the collector</div>
          <p className="max-w-[70ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            The collector bot pushes snapshots to a single authenticated endpoint. It requires a
            shared secret header so nobody else can write to the database. Response includes how
            many records were accepted.
          </p>
          <pre className="num mt-4 overflow-x-auto p-4 text-[12px] leading-relaxed"
            style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)" }}>
{`POST /api/ingest
X-Ingest-Secret: <your secret>

{
  "type": "prices",
  "capturedAt": "2026-10-10T19:00:00Z",
  "items": [
    { "item": "diamond", "price": 1357, "listings": 18240 }
  ]
}`}
          </pre>
        </Panel>
      </div>
      <Footer />
    </>
  );
}

function Endpoint({ path, desc, example }: { path: string; desc: string; example: string }) {
  return (
    <Panel>
      <div className="num text-[13px] font-medium" style={{ color: "var(--gold)" }}>{path}</div>
      <p className="mt-2.5 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
      <pre className="num mt-3 overflow-x-auto text-[11px]"
        style={{ color: "var(--dim)" }}>{example}</pre>
    </Panel>
  );
}