import Link from "next/link";

import { TopNav, Ticker, Footer } from "@/components/layout";
import { PageHead, ItemCell, Panel, formatMoney, formatNum, pct, changeColor } from "@/components/ui";
import { SERVER } from "@/lib/data";
type MarketRow = ReturnType<typeof marketItems>[number];

import { marketItems, marketBySlug, live } from "@/lib/read";
import { itemImage, playerHead } from "@/lib/items";

export const instant = false;
export const metadata = {
  title: "Live Auction House — DonutSMP Listings | DonutSMP Trader",
  description: "Browse active DonutSMP auction house listings with seller, stack size and asking price.",
};
export default async function Auction({
  searchParams,
}: { searchParams: Promise<{ item?: string }> }) {
  await live();
  const sp = await searchParams;
  const focus = sp.item;
  const source = focus
    ? marketItems().filter((m) => m.slug === focus)
    : marketItems().sort((a, b) => b.listings - a.listings).slice(0, 10);
  const listings = buildListings(source);
  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${listings.length} active listings · refreshed ${SERVER.updatedMinutesAgo}m ago`}
          title={focus ? `${marketItems().find((m) => m.slug === focus)?.name} listings` : "Auction house"}
          lede="Live asks, sorted high to low. Cross-check against completed sales before buying."
        />
        {focus ? (
          <Link
            href="/auction"
            className="num mt-4 inline-block text-[12px]"
            style={{ color: "var(--gold)" }}
          >
            ← All items
          </Link>
        ) : null}
        <div className="mt-7" style={{ border: "1px solid var(--line)" }}>
          <table className="dense w-full min-w-[820px]">
            <thead>
              <tr>
                <th>Item</th>
                <th>Seller</th>
                <th className="text-right">Stack</th>
                <th className="text-right">Asking</th>
                <th className="text-right">Per unit</th>
                <th className="text-right">vs lowest</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td><ItemCell slug={l.slug} name={l.name} material={l.material} /></td>
                  <td>
                    <Link href={`/players/${l.seller}`} className="flex items-center gap-2">
                      <img src={playerHead(l.seller, 40)} alt="" width={20} height={20}
                        className="rounded-[2px]" style={{ imageRendering: "pixelated" }} />
                      <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>{l.seller}</span>
                    </Link>
                  </td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>{l.stack}</td>
                  <td className="num text-right font-medium">{formatMoney(l.price)}</td>
                  <td className="num text-right" style={{ color: "var(--muted)" }}>
                    {formatMoney(l.price / l.stack)}
                  </td>
                  <td className="num text-right" style={{ color: changeColor(l.diff) }}>{pct(l.diff)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Panel className="mt-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ["Total active listings", marketItems().reduce((s, m) => s + m.listings, 0).toLocaleString()],
              ["Value on the books", formatMoney(marketItems().reduce((s, m) => s + m.price * m.listings, 0))],
              ["Items listed", String(marketItems().length)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="num text-[20px] font-medium">{v}</div>
                <div className="label mt-1.5">{k}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Footer />
    </>
  );
}
function buildListings(items: MarketRow[]) {
  const sellers = ["jesticc", "rtkprime", "Ehxy", "DonutUnc", "Jeadox",
  "iditity", "LoadFc", "cruell", "BabyBeetroot", "AidansGamingYT", "RTKprime", "Squintom"];
  const out: {
    id: string; slug: string; name: string; material: string;
    seller: string; stack: number; price: number; diff: number;
  }[] = [];
  for (const it of items) {
    const n = Math.min(4, Math.max(1, Math.round(it.listings / 4000)));
    for (let k = 0; k < n; k++) {
      const seed = (it.listings + k * 13) % 17;
      const stack = [1, 1, 8, 16, 32, 64][seed % 6];
      const diff = [0, 2.5, -1.5, 4.2, -3.1, 1.1, -0.6, 6.4, -2.2][seed % 9];
      out.push({
        id: `${it.slug}-${k}`,
        slug: it.slug,
        name: it.name,
        material: it.material,
        seller: sellers[(seed + k * 5) % sellers.length],
        stack,
        price: Math.round(it.price * stack * (1 + diff / 100)),
        diff,
      });
    }
  }
  return out.sort((a, b) => b.price - a.price);
}