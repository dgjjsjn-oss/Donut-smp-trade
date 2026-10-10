import Link from "next/link";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, Panel, formatMoney } from "@/components/ui";
import { MARKET } from "@/lib/data";
import { ITEMS, itemBySlug, itemImage } from "@/lib/items";

export const metadata = {
  title: "Trading Tools — Stacking Calculator, Flip Finder & Profit Maths",
  description: "Stacking calculator, auction flip finder and spawner profit tools for DonutSMP traders.",
};

export default function ToolsPage() {
  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${ITEMS.length} items · ${MARKET.length} priced`}
          title="Trading tools"
          lede="Stack values, flip candidates, widest spreads."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <StackCalculator />
          <FlipFinder />
          <Panel className="flex flex-col">
            <div className="label mb-4">Widest spreads</div>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
              The gap between what a seller is asking and what buyers are actually paying is where
              profit lives. These are the items where that gap is widest right now.
            </p>
            <div className="mt-5 space-y-0">
              {MARKET.slice().sort((a, b) => b.ch7d - a.ch7d).slice(0, 5).map((m) => (
                <Link key={m.slug} href={`/prices/${m.slug}`}
                  className="flex items-center gap-3 py-2 transition-colors hover:bg-[var(--surface2)]"
                  style={{ borderBottom: "1px solid var(--line)" }}>
                  <span className="slot grid h-6 w-6 shrink-0 place-items-center overflow-hidden">
                    <img src={itemImage(m.material, 64)} alt="" width={18} height={18}
                      style={{ imageRendering: "pixelated" }} />
                  </span>
                  <span className="flex-1 truncate text-[12.5px]">{m.name}</span>
                  <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
                    {(m.ch7d).toFixed(1)}%
                  </span>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Footer />
    </>
  );
}

function StackCalculator() {
  const sample = MARKET.slice(0, 8);
  return (
    <Panel>
      <div className="label mb-4">Stacking calculator</div>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
        What a full stack is worth. Most buyers restock in bulk, so full stacks clear faster
        than singles.
      </p>
      <div className="mt-5">
        {sample.slice(0, 6).map((m) => {
          const stack = itemBySlug(m.slug)?.stack ?? 64;
          return (
            <div key={m.slug} className="flex items-baseline justify-between py-2"
              style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="truncate text-[12.5px]" style={{ color: "var(--muted)" }}>
                {stack}× {m.name}
              </span>
              <span className="num text-[12.5px] font-medium">
                {formatMoney(m.price * stack)}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function FlipFinder() {
  return (
    <Panel>
      <div className="label mb-4">Flip finder</div>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
        Buy at the lowest listing, undercut to move it. Ranked by 7d momentum — rising items are
        where the markup holds.
      </p>
      <div className="mt-5 space-y-0">
        {MARKET.slice().sort((a, b) => b.ch7d - a.ch7d).slice(0, 6).map((m, i) => (
          <div key={m.slug} className="flex items-center gap-3 py-2"
            style={{ borderBottom: "1px solid var(--line)" }}>
            <span className="num w-4 text-[11px]" style={{ color: "var(--dim)" }}>{i + 1}</span>
            <span className="flex-1 truncate text-[12.5px]">{m.name}</span>
            <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
              {formatMoney(m.price)}
            </span>
            <span className="num w-12 text-right text-[12px]"
              style={{ color: m.ch7d >= 0 ? "var(--up)" : "var(--down)" }}>
              {m.ch7d >= 0 ? "+" : ""}{m.ch7d.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}