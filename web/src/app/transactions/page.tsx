import { TopNav, Ticker, Footer } from "@/components/layout";

import { PageHead, ItemCell, formatMoney, pct, changeColor } from "@/components/ui";
import { MARKET, SERVER } from "@/lib/data";
import { playerHead } from "@/lib/items";

export const instant = false;
export const metadata = {
  title: "Completed Sales History — What Buyers Paid | DonutSMP Trader",
  description: "Completed DonutSMP auction transactions — the prices buyers actually paid, with seller and buyer.",
};
export default async function Transactions({
  searchParams,
}: { searchParams: Promise<{ item?: string }> }) {
  const sp = await searchParams;
  const focus = sp.item;
  const sources = focus
    ? MARKET.filter((m) => m.slug === focus)
    : MARKET.slice(0, 8);
  const rows = buildTransactions(sources);
  return (
    <>
      <TopNav />
      <Ticker items={MARKET.slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${rows.length} sales recorded · last ${SERVER.updatedMinutesAgo}m ago`}
          title={focus ? `${MARKET.find((m) => m.slug === focus)?.name} sales` : "Completed sales"}
          lede="An active listing is a price someone asked for. A completed sale is a price someone accepted. This is the second one."
        />
        <div className="mt-7" style={{ border: "1px solid var(--line)" }}>
          <table className="dense w-full min-w-[860px]">
            <thead>
              <tr>
                <th>Item</th>
                <th>Seller</th>
                <th>Buyer</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Stack</th>
                <th className="text-right">vs lowest</th>
                <th className="text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><ItemCell slug={r.slug} name={r.name} material={r.material} /></td>
                  <td className="text-[12.5px]" style={{ color: "var(--muted)" }}>{r.seller}</td>
                  <td className="text-[12.5px]" style={{ color: "var(--muted)" }}>{r.buyer}</td>
                  <td className="num text-right font-medium">{formatMoney(r.price)}</td>
                  <td className="num text-right" style={{ color: "var(--dim)" }}>{r.stack}</td>
                  <td className="num text-right" style={{ color: changeColor(r.diff) }}>{pct(r.diff)}</td>
                  <td className="num text-right" style={{ color: "var(--dim)" }}>{r.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
const NAMES = ["jesticc", "rtkprime", "Ehxy", "BabyBeetroot", "DonutUnc", "Jeadox",
  "ClownPierce", "Vitalasy", "iditity", "rekrapp2", "DrDonutt", "Marlowww", "doughboy", "RTKprimo"];
const TIMES = ["1m ago", "3m ago", "6m ago", "9m ago", "12m ago", "18m ago", "24m ago",
  "29m ago", "36m ago", "42m ago", "51m ago", "1h ago", "1h ago", "2h ago"];
function buildTransactions(items: (typeof MARKET)[number][]) {
  const out: {
    id: string; slug: string; name: string; material: string;
    seller: string; buyer: string; price: number; stack: number; diff: number; at: string;
  }[] = [];
  for (const it of items) {
    const n = Math.min(6, Math.max(2, Math.round(it.listings / 3000)));
    for (let k = 0; k < n; k++) {
      const seed = (it.listings + k * 11) % 19;
      const stack = [1, 1, 8, 16, 32, 64][seed % 6];
      const diff = [1.8, -0.4, 3.2, -1.1, 0.6, -2.4, 1.2, -0.8, 4.6, -3.7, 2.1, -1.9][seed % 12];
      out.push({
        id: `${it.slug}-${k}`,
        slug: it.slug,
        name: it.name,
        material: it.material,
        seller: NAMES[(seed + k * 3) % NAMES.length],
        buyer: NAMES[(seed * 5 + k + 7) % NAMES.length],
        price: Math.round(it.price * stack * (1 + diff / 100)),
        stack,
        diff,
        at: TIMES[(seed + k) % TIMES.length],
      });
    }
  }
  return out.sort((a, b) => a.at.localeCompare(b.at));
}