import { TopNav, Footer } from "@/components/layout";
import { PageHead, Panel } from "@/components/ui";

export const metadata = { title: "Premium — DonutSMP Trader" };

export default function Premium() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      note: "Everything the site gives you today.",
      features: ["All item prices and history", "Live auction listings", "All 10 leaderboards", "Full player profiles", "Public API access"],
      cta: "Current plan",
    },
    {
      name: "Trader",
      price: "$3",
      cadence: "per month",
      note: "For players who check prices daily.",
      features: ["Everything in Free", "Price alerts by email", "Personal watchlist", "Stack & profit calculators", "Listing history per item"],
      cta: "Join waitlist",
      featured: true,
    },
    {
      name: "Syndicate",
      price: "$9",
      cadence: "per month",
      note: "For guilds and content creators.",
      features: ["Everything in Trader", "Unlimited API calls", "Embed generator", "Server-role pricing", "Early data access"],
      cta: "Join waitlist",
    },
  ];

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow="Not launched yet"
          title="Premium"
          lede="The free site is not going away. Paid tiers exist for people who want alerts and deeper data, not to put the basics behind a wall."
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-lg p-px"
              style={{ background: t.featured ? "var(--gold)" : "var(--line)" }}>
              <div className="h-full rounded-[7px] p-6" style={{ background: "var(--bg)" }}>
                {t.featured ? (
                  <div className="num mb-3 inline-block px-2 py-0.5 text-[10px] tracking-wider"
                    style={{ background: "var(--gold)", color: "#0a0b0e" }}>
                    MOST CHOSEN
                  </div>
                ) : null}
                <div className="text-[15px] font-semibold">{t.name}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="num text-[34px] font-semibold leading-none">{t.price}</span>
                  <span className="text-[12px]" style={{ color: "var(--dim)" }}>{t.cadence}</span>
                </div>
                <p className="mt-3 text-[12.5px]" style={{ color: "var(--muted)" }}>{t.note}</p>
                <ul className="mt-5 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[12.5px]" style={{ color: "var(--muted)" }}>
                      <span style={{ color: "var(--gold)" }}>—</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-6 w-full px-4 py-2.5 text-[13px] font-semibold transition-transform active:scale-[0.98]"
                  style={t.featured
                    ? { background: "var(--gold)", color: "#0a0b0e" }
                    : { border: "1px solid var(--line2)", color: "var(--ink)" }}
                >
                  {t.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Panel className="mt-6">
          <div className="label mb-3">How this stays honest</div>
          <p className="max-w-[74ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            Our data comes from our own collector, so there is no API bill to pass on. Paid tiers
            fund hosting for the bot and the database. If the site ever makes money, the free tier
            keeps every page that already exists.
          </p>
        </Panel>
      </div>
      <Footer />
    </>
  );
}