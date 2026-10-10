import { TopNav, Footer } from "@/components/layout";
import { PageHead, Panel } from "@/components/ui";

export const metadata = {
  title: "DonutSMP Trader — About, Privacy, Terms",
  description: "What DonutSMP Trader is, how data is collected, and the terms of use.",
};

export default function About() {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1400px] px-5 py-12">
        <PageHead
          eyebrow="Independent community project"
          title="What this is"
          lede="DonutSMP Trader is a read-only statistics site for the DonutSMP server. We are not affiliated with, endorsed by, or operated by the DonutSMP team."
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          <Panel>
            <div className="label mb-3">How we get data</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
              A collector account joins the server and reads public information: auction listings,
              completed sales, leaderboard standings and player stats. It never trades, never buys,
              never sells, and never touches an inventory. Those commands do not exist in the
              collector code.
            </p>
          </Panel>
          <Panel>
            <div className="label mb-3">Why own the pipeline</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Sites that rely on a paid API can be rate-limited, repriced or shut off. Owning the
              collection means the data is ours, the freshness is known, and the site keeps working
              when an upstream provider disappears.
            </p>
          </Panel>
          <Panel>
            <div className="label mb-3">Freshness over hype</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Every page shows how old its data is. If the collector stops, the site says so instead
              of serving stale numbers as if they were live. A stale price with a warning is more
              useful than a fresh-looking lie.
            </p>
          </Panel>
        </div>

        <Panel className="mt-4">
          <div className="label mb-3">Privacy</div>
          <p className="max-w-[74ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            We store public server statistics: prices, listing counts, leaderboard values and
            public profile data. We do not collect passwords, session tokens or inventory contents.
            We do not run third-party advertising trackers. If you create an account for price
            alerts, we store only your email address and it is never sold or shared.
          </p>
        </Panel>

        <Panel className="mt-4">
          <div className="label mb-3">Terms</div>
          <p className="max-w-[74ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            DonutSMP Trader is provided as-is for informational purposes. In-game prices change
            constantly and nothing here is financial advice. Player names and statistics belong to
            their respective owners and are displayed for community reference. DonutSMP is a
            separate project with its own rules; using this site does not grant access to the server.
          </p>
        </Panel>
      </div>
      <Footer />
    </>
  );
}