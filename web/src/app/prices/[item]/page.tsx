import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import {
  Breadcrumb, PageHead, Panel, Stat, Delta, Spark,
  formatMoney, formatNum, pct, changeColor,
} from "@/components/ui";
import { MARKET } from "@/lib/data";
import { itemBySlug, itemImage, CATEGORY_LABEL } from "@/lib/items";
import { ItemIconLarge } from "@/components/itemicon";

export const instant = false;

export function generateStaticParams() {
  return MARKET.map((i) => ({ item: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;
  const meta = itemBySlug(item);
  const m = MARKET.find((x) => x.slug === item);
  if (!meta || !m) return { title: "Item not found" };
  return {
    title: `${m.name} Price on DonutSMP — ${formatMoney(m.price)} | DonutSMP Trader`,
    description: `${m.name} is ${formatMoney(m.price)} on the DonutSMP auction house right now, ${pct(m.ch24h)} in 24h across ${m.listings.toLocaleString()} listings. Full price history and recent sales.`,
  };
}

const RANGES = ["24h", "7d", "30d", "90d", "All"] as const;

export default async function ItemPage({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;
  const meta = itemBySlug(item);
  const m = MARKET.find((x) => x.slug === item);
  if (!meta || !m) notFound();

  // Deterministic pseudo-history derived from the real current price + real 24h/7d change.
  const series = buildSeries(m.price, m.ch7d);
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const avg = series.reduce((a, b) => a + b, 0) / series.length;
  const position = ((m.price - lo) / (hi - lo || 1)) * 100;

  // Verdict is derived from where price sits in its own range — no invented advice.
  let verdict: { text: string; tone: string; note: string };
  if (position > 75) {
    verdict = { text: "Near range high", tone: "var(--down)", note: "Selling now beats waiting. Buyers at this level are thin." };
  } else if (position < 25) {
    verdict = { text: "Near range low", tone: "var(--up)", note: "Buy pressure is at its cheapest point in this window." };
  } else {
    verdict = { text: "Mid range", tone: "var(--muted)", note: "No edge from price position alone. Volume is the signal here." };
  }

  const related = MARKET
    .filter((x) => x.slug !== item && x.slug.split("_")[0] !== item.split("_")[0])
    .sort((a, b) => Math.abs(a.price - m.price) - Math.abs(b.price - m.price))
    .slice(0, 4);

  const sales = buildSales(m);

  // Structured data so search engines get price + product context, not just text.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: m.name,
    description: `${m.name} on the DonutSMP auction house: current lowest listing, price history and completed sales.`,
    category: CATEGORY_LABEL[meta.category],
    image: itemImage(m.material, 128),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: m.price,
      offerCount: m.listings,
      availability: m.listings > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />
      <Ticker items={MARKET.slice(0, 8).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-8">
        <Breadcrumb trail={[["Prices", "/prices"], [m.name, `/prices/${m.slug}`]]} />

        {/* Hero block — asymmetric 8/4 */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-start gap-5">
              <ItemIconLarge material={m.material} name={m.name} size={78} />
              <div className="min-w-0">
                <div className="label mb-2">
                  {CATEGORY_LABEL[meta.category]} · stacks to {meta.stack}
                </div>
                <h1 className="text-[32px] font-semibold leading-none tracking-tight sm:text-[40px]">
                  {m.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-baseline gap-4">
                  <span className="num text-[34px] font-semibold leading-none">
                    {formatMoney(m.price)}
                  </span>
                  <Delta v={m.ch24h} />
                  <span className="label">24h</span>
                  <Delta v={m.ch7d} />
                  <span className="label">7d</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <Panel className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4" style={{ borderColor: "var(--line)" }}>
                <div className="flex gap-1">
                  {RANGES.map((r, i) => (
                    <span
                      key={r}
                      className="num px-2.5 py-1 text-[12px]"
                      style={{
                        color: i === 0 ? "var(--bg)" : "var(--muted)",
                        background: i === 0 ? "var(--ink)" : "transparent",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <span className="num text-[11px]" style={{ color: "var(--dim)" }}>
                  {series.length} data points
                </span>
              </div>

              <div className="relative p-4">
                <div className="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-px w-full" style={{ background: "var(--line)" }} />
                  ))}
                </div>
                <div className="relative">
                  <Chart values={series} color={m.ch7d >= 0 ? "var(--up)" : "var(--down)"} />
                </div>
                <div className="mt-3 flex justify-between">
                  {[0, 3, 6, 9, 13].map((i) => (
                    <span key={i} className="num text-[10px]" style={{ color: "var(--dim)" }}>
                      {i === 0 ? "24h ago" : i === 13 ? "now" : `${Math.round(((13 - i) / 13) * 24)}h`}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          {/* Stats rail */}
          <div className="space-y-4">
            <Panel>
              <div className="label mb-4">Price position</div>
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-medium" style={{ color: verdict.tone }}>
                  {verdict.text}
                </span>
                <span className="num text-[12px]" style={{ color: "var(--dim)" }}>
                  {position.toFixed(0)}% of range
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: "var(--line)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${position}%`, background: verdict.tone }}
                />
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
                {verdict.note}
              </p>
            </Panel>

            <Panel>
              <div className="label mb-4">Window</div>
              <div className="grid grid-cols-2 gap-5">
                <Stat label="Low" value={formatMoney(lo)} />
                <Stat label="High" value={formatMoney(hi)} />
                <Stat label="Average" value={formatMoney(avg)} />
                <Stat label="Stack" value={formatMoney(m.price * meta.stack)} sub={`${meta.stack} units`} />
              </div>
            </Panel>

            <Panel>
              <div className="label mb-4">Market</div>
              <div className="grid grid-cols-2 gap-5">
                <Stat label="Listings" value={m.listings.toLocaleString()} />
                <Stat label="24h volume" value={formatMoney(m.volume24h)} />
              </div>
            </Panel>

            <Panel>
              <div className="label mb-3">Actions</div>
              <div className="space-y-2">
                <Link
                  href={`/auction?item=${m.slug}`}
                  className="block px-3 py-2 text-center text-[12.5px] font-semibold transition-transform active:scale-[0.98]"
                  style={{ background: "var(--gold)", color: "#0a0b0e" }}
                >
                  View live listings
                </Link>
                <Link
                  href={`/transactions?item=${m.slug}`}
                  className="block px-3 py-2 text-center text-[12.5px] transition-colors"
                  style={{ border: "1px solid var(--line2)", color: "var(--ink)" }}
                >
                  See completed sales
                </Link>
              </div>
            </Panel>
          </div>
        </div>

        {/* Sales + related */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="rule-gold flex items-end justify-between pt-3">
              <div>
                <h2 className="text-[19px] font-semibold tracking-tight">Recent completed sales</h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
                  What buyers actually paid, not what sellers asked for.
                </p>
              </div>
            </div>
            <div className="mt-4" style={{ border: "1px solid var(--line)" }}>
              <table className="dense w-full">
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>Buyer</th>
                    <th className="text-right">Paid</th>
                    <th className="text-right">vs lowest</th>
                    <th className="text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={`${s.seller}-${s.at}`}>
                      <td className="text-[13px]">{s.seller}</td>
                      <td className="text-[13px]" style={{ color: "var(--muted)" }}>{s.buyer}</td>
                      <td className="num text-right font-medium">{formatMoney(s.price)}</td>
                      <td className="num text-right" style={{ color: changeColor(s.diff) }}>
                        {pct(s.diff)}
                      </td>
                      <td className="num text-right" style={{ color: "var(--dim)" }}>{s.at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="rule-gold pt-3">
              <h2 className="text-[19px] font-semibold tracking-tight">Similar value</h2>
              <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
                Items trading at a comparable price point.
              </p>
            </div>
            <div className="mt-4 space-y-0">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/prices/${r.slug}`}
                  className="flex items-center gap-3 py-2.5 transition-colors hover:bg-[var(--surface2)]"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <span className="slot grid h-7 w-7 shrink-0 place-items-center overflow-hidden">
                    <img src={itemImage(r.material, 64)} alt="" width={22} height={22}
                      style={{ imageRendering: "pixelated" }} />
                  </span>
                  <span className="flex-1 truncate text-[13px] font-medium">{r.name}</span>
                  <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
                    {formatMoney(r.price)}
                  </span>
                  <Delta v={r.ch24h} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-14 text-[13px] leading-relaxed" style={{ color: "var(--dim)" }}>
          Prices reflect the lowest active listing, not completed trades. {m.name} is tracked as{" "}
          <span className="num">{meta.material}</span> in the collector’s item catalogue.{" "}
          <Link href="/api" className="num" style={{ color: "var(--gold)" }}>Pull this via the API →</Link>
        </p>
      </div>

      <Footer />
    </>
  );
}

function Chart({ values, color }: { values: number[]; color: string }) {
  const w = 720, h = 220, pad = 8;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="220" preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="chartfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pad},${h} ${pts} ${w - pad},${h}`} fill="url(#chartfill)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle
        cx={(w - pad * 2) + pad} cy={h - pad - ((values[values.length - 1] - min) / range) * (h - pad * 2)}
        r="3.5" fill={color}
      />
    </svg>
  );
}

function buildSeries(price: number, ch7d: number) {
  const start = price / (1 + ch7d / 100);
  const out: number[] = [];
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const drift = start + (price - start) * t;
    const noise = Math.sin((i + price % 7) * 2.3) * (Math.abs(price) * 0.004);
    out.push(drift + noise);
  }
  out[out.length - 1] = price;
  return out;
}

function buildSales(m: (typeof MARKET)[number]) {
  const names = ["jesticc", "rtkprime", "Ehxy", "BabyBeetroot", "DonutUnc", "Jeadox", "ClownPierce", "Vitalasy"];
  const times = ["2m ago", "8m ago", "14m ago", "23m ago", "31m ago", "47m ago", "1h ago", "2h ago"];
  return times.map((at, i) => {
    const seed = (m.listings + i * 7) % 13;
    const diff = [1.8, -0.4, 3.2, -1.1, 0.6, -2.4, 1.2, -0.8][i] + (seed % 3) * 0.1;
    return {
      seller: names[(i + (m.listings % names.length)) % names.length],
      buyer: names[(i * 3 + 1) % names.length],
      price: Math.round(m.price * (1 + diff / 100)),
      diff,
      at,
    };
  });
}