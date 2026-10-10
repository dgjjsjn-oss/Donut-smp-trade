import Link from "next/link";

import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, ItemCell, Spark, Delta, formatMoney, formatNum, Panel } from "@/components/ui";
import { SERVER } from "@/lib/data";
import { marketItems, live } from "@/lib/read";
import { ITEMS, ALPHABET } from "@/lib/items";

export const instant = false;
export const metadata = {
  title: "DonutSMP Item Prices — Live Auction marketItems() | DonutSMP Trader",
  description: "Current DonutSMP auction prices per item: lowest listing, 24h and 7d change, volume, listing count.",
};
type Sort = "volume24h" | "ch24h" | "price" | "listings";
export default async function Prices({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  await live();
  const sp = await searchParams;
  const sort = (sp.sort ?? "volume24h") as Sort;
  const q = (sp.q ?? "").toLowerCase();
  let rows = marketItems().slice();
  if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.material.includes(q));
  const sorted = rows.sort((a, b) => {
    if (sort === "ch24h") return b.ch24h - a.ch24h;
    if (sort === "price") return b.price - a.price;
    if (sort === "listings") return b.listings - a.listings;
    return b.volume24h - a.volume24h;
  });
  const setSort = (s: Sort) => `/prices?sort=${s}${q ? `&q=${q}` : ""}`;
  const gainers = marketItems().filter((i) => i.ch24h > 0).length;
  const losers = marketItems().filter((i) => i.ch24h < 0).length;
  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${ITEMS.length} items tracked · updated ${SERVER.updatedMinutesAgo}m ago`}
          title="Item prices"
          lede="Lowest active listing per item. Asks, not sales."
          meta={
            <div className="flex gap-6">
              <div className="text-right">
                <div className="num text-[18px]" style={{ color: "var(--up)" }}>+{gainers}</div>
                <div className="label mt-1">Gaining</div>
              </div>
              <div className="text-right">
                <div className="num text-[18px]" style={{ color: "var(--down)" }}>{losers}</div>
                <div className="label mt-1">Falling</div>
              </div>
            </div>
          }
        />
        {/* Letter index */}
        <div className="mt-6 flex flex-wrap items-center gap-1">
          <Link
            href="/prices/browse"
            className="num px-2.5 py-1 text-[12px] transition-colors"
            style={{ color: "var(--muted)", border: "1px solid var(--line)" }}
          >
            All
          </Link>
          {ALPHABET.map((L) => (
            <Link
              key={L}
              href={`/prices/browse/${L}`}
              className="num px-2.5 py-1 text-[12px] transition-colors hover:border-[var(--line2)]"
              style={{ color: "var(--muted)", border: "1px solid var(--line)" }}
            >
              {L}
            </Link>
          ))}
        </div>
        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-lg p-px" style={{ background: "var(--line)" }}>
          <div style={{ background: "var(--bg)" }} className="overflow-x-auto">
            <table className="dense w-full min-w-[900px]">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">
                    <Link href={setSort("price")} className="transition-colors hover:text-[var(--ink)]">Lowest</Link>
                  </th>
                  <th className="text-right">
                    <Link href={setSort("ch24h")} className="transition-colors hover:text-[var(--ink)]">24h</Link>
                  </th>
                  <th className="text-right">7d</th>
                  <th className="text-right">
                    <Link href={setSort("volume24h")} className="transition-colors hover:text-[var(--ink)]">24h volume</Link>
                  </th>
                  <th className="text-right">
                    <Link href={setSort("listings")} className="transition-colors hover:text-[var(--ink)]">Listings</Link>
                  </th>
                  <th className="w-28 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((i) => (
                  <tr key={i.slug}>
                    <td><ItemCell slug={i.slug} name={i.name} material={i.material} /></td>
                    <td className="num text-right font-medium">{formatMoney(i.price)}</td>
                    <td className="text-right"><Delta v={i.ch24h} /></td>
                    <td className="text-right"><Delta v={i.ch7d} /></td>
                    <td className="num text-right" style={{ color: "var(--muted)" }}>
                      {formatMoney(i.volume24h)}
                    </td>
                    <td className="num text-right" style={{ color: "var(--muted)" }}>
                      {i.listings.toLocaleString()}
                    </td>
                    <td className="flex justify-end pr-3">
                      <Spark values={i.spark} color={i.ch7d >= 0 ? "var(--up)" : "var(--down)"} />
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center" style={{ color: "var(--dim)" }}>
                      No items match “{sp.q}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="num mt-4 text-[11px]" style={{ color: "var(--dim)" }}>
          Showing {sorted.length} of {marketItems().length} priced items · {ITEMS.length} in the full catalogue
        </p>
      </div>
      <Footer />
    </>
  );
}
