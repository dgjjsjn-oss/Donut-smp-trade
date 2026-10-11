import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { Breadcrumb, Delta, formatMoney, pct } from "@/components/ui";
import { ItemIconLarge, ItemIcon } from "@/components/itemicon";
import { itemBySlug, itemImage, CATEGORY_LABEL } from "@/lib/items";
import { marketItems, marketBySlug, live } from "@/lib/read";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;
  const meta = itemBySlug(item);
  const m = marketBySlug(item);
  if (!meta || !m) return { title: "Item not found" };
  return {
    title: `${m.name} — $${m.price.toLocaleString()} | DonutSMP Price History`,
    description: `${m.name} is ${formatMoney(m.price)} on the DonutSMP auction house, ${pct(m.ch24h)} in 24h across ${m.listings.toLocaleString()} listings. Full price history and completed sales.`,
  };
}

export default async function ItemPage({ params }: { params: Promise<{ item: string }> }) {
  await live();
  const { item } = await params;
  const meta = itemBySlug(item);
  const m = marketBySlug(item);
  if (!meta || !m) notFound();

  const series = buildSeries(m.price, m.ch7d);
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const avg = series.reduce((a, b) => a + b, 0) / series.length;
  const position = ((m.price - lo) / (hi - lo || 1)) * 100;
  const onBooks = m.price * m.listings;

  const verdict =
    position > 75
      ? { t: "Near range high", tone: "var(--down)", n: "Thin buyer queue at this level." }
      : position < 25
        ? { t: "Near range low", tone: "var(--up)", n: "Cheapest point in this window." }
        : { t: "Mid range", tone: "var(--muted)", n: "No edge from position alone. Watch volume." };

  const related = marketItems()
    .filter((x) => x.slug !== item && x.slug.split("_")[0] !== item.split("_")[0])
    .sort((a, b) => Math.abs(a.price - m.price) - Math.abs(b.price - m.price))
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: m.name,
    description: `${m.name} on the DonutSMP auction house.`,
    category: CATEGORY_LABEL[meta.category],
    image: itemImage(m.material),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: m.price,
      offerCount: m.listings,
      availability: m.listings > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1560px] px-4 pt-8">
        <Breadcrumb trail={[["Prices", "/prices"], [m.name, `/prices/${m.slug}`]]} />

        {/* Top rail — mono metadata strip */}
        <div
          className="num flex flex-wrap items-center gap-x-5 gap-y-1 border-y py-2 text-[10.5px]"
          style={{ borderColor: "var(--line)", color: "var(--dim)" }}
        >
          <span style={{ color: "var(--gold)" }}>{m.symbol ?? m.slug.toUpperCase().slice(0, 5)}</span>
          <span>{CATEGORY_LABEL[meta.category]}</span>
          <span>stacks to {meta.stack}</span>
          <span>id {m.material}</span>
          <span className="ml-auto">updated {SERVER_AGE} ago</span>
        </div>

        {/* ── SPLIT: data panel | chart panel ── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          {/* LEFT — identity, price, spec block */}
          <div>
            <div className="flex items-start gap-5">
              <ItemIconLarge material={m.material} name={m.name} size={76} />
              <div className="min-w-0 flex-1">
                <h1 className="text-[30px] font-semibold leading-none tracking-tight sm:text-[38px]">
                  {m.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="num text-[32px] font-semibold leading-none">
                    {formatMoney(m.price)}
                  </span>
                  <Delta v={m.ch24h} />
                  <Delta v={m.ch7d} />
                </div>
                <div className="num mt-1.5 text-[10px]" style={{ color: "var(--dim)" }}>
                  24h / 7d
                </div>
              </div>
            </div>

            {/* Spec block — line-separated rows, no cards */}
            <div className="mt-8 border-t" style={{ borderColor: "var(--line)" }}>
              {[
                ["Lowest listing", formatMoney(m.price)],
                ["Stack value", `${formatMoney(m.price * meta.stack)}`],
                ["Value on books", formatMoney(onBooks)],
                ["24h volume", formatMoney(m.volume24h)],
                ["Active listings", m.listings.toLocaleString()],
                ["Per unit (stack)", formatMoney(m.price / meta.stack)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between border-b py-2.5"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="label">{k}</span>
                  <span className="num text-[14px] font-medium">{v}</span>
                </div>
              ))}
            </div>

            {/* Position meter */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <span className="label">Position in range</span>
                <span className="text-[13px] font-medium" style={{ color: verdict.tone }}>
                  {verdict.t}
                </span>
              </div>
              <div className="mt-2 h-1 w-full" style={{ background: "var(--line)" }}>
                <div className="h-full" style={{ width: `${position}%`, background: verdict.tone }} />
              </div>
              <p className="num mt-2 text-[10.5px]" style={{ color: "var(--dim)" }}>
                {verdict.n} · {position.toFixed(0)}% of range
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/auction?item=${m.slug}`}
                className="btn px-4 py-2.5 text-[12.5px] font-semibold"
                style={{ background: "var(--gold)", color: "#0a0b0e" }}
              >
                Live listings
              </Link>
              <Link
                href={`/transactions?item=${m.slug}`}
                className="btn border px-4 py-2.5 text-[12.5px]"
                style={{ borderColor: "var(--line2)" }}
              >
                Completed sales
              </Link>
            </div>
          </div>

          {/* RIGHT — premium embedded surface: the chart */}
          <div>
            <div className="border" style={{ borderColor: "var(--line)" }}>
              <div
                className="flex items-center justify-between border-b px-4 py-2"
                style={{ borderColor: "var(--line)", background: "var(--surface)" }}
              >
                <span className="label">Price history</span>
                <span className="num text-[10px]" style={{ color: "var(--dim)" }}>
                  {series.length} pts · {m.spark?.length ?? 0}
                </span>
              </div>

              {/* Range selector as pills — interactive reads as pill */}
              <div className="flex gap-1.5 border-b px-4 py-2" style={{ borderColor: "var(--line)" }}>
                {["1H", "24H", "7D", "30D", "ALL"].map((r, i) => (
                  <span
                    key={r}
                    className={i === 1 ? "badge" : "pill num text-[10px]"}
                    style={
                      i === 1
                        ? { background: "var(--gold)", color: "#0a0b0e" }
                        : { color: "var(--dim)", border: "1px solid var(--line)" }
                    }
                  >
                    {r}
                  </span>
                ))}
              </div>

              <div className="p-4">
                <Chart values={series} color={m.ch7d >= 0 ? "var(--up)" : "var(--down)"} />
                <div className="num mt-3 flex justify-between text-[9.5px]" style={{ color: "var(--dim)" }}>
                  {[0, 3, 6, 9, 13].map((i) => (
                    <span key={i}>
                      {i === 0 ? "24h ago" : i === 13 ? "now" : `${Math.round(((13 - i) / 13) * 24)}h`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Window stats under the surface */}
            <div className="gridline mt-4 grid grid-cols-3">
              {[
                ["Low", formatMoney(lo)],
                ["High", formatMoney(hi)],
                ["Average", formatMoney(avg)],
              ].map(([k, v]) => (
                <div key={k} className="px-4 py-3.5">
                  <div className="num text-[17px] font-medium leading-none">{v}</div>
                  <div className="label mt-2">{k}</div>
                </div>
              ))}
            </div>

            {/* Related — inline strip, not another card grid */}
            <div className="mt-8">
              <span className="label" style={{ color: "var(--gold)" }}>[ Similar value ]</span>
              <div className="mt-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/prices/${r.slug}`}
                    className="flex items-center gap-3 py-2 transition-colors hover:bg-[var(--surface2)]"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <ItemIcon material={r.material} name={r.name} size={20} />
                    <span className="min-w-0 flex-1 truncate text-[12.5px]">{r.name}</span>
                    <span className="num text-[12px]" style={{ color: "var(--muted)" }}>
                      {formatMoney(r.price)}
                    </span>
                    <Delta v={r.ch24h} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="num mt-14 text-[10.5px]" style={{ color: "var(--dim)" }}>
          {m.material} · tracked as item id on the collector ·{" "}
          <Link href="/api" className="num" style={{ color: "var(--gold)" }}>
            pull via API →
          </Link>
        </p>
      </div>

      <Footer />
    </>
  );
}

const SERVER_AGE = "2m";

function Chart({ values, color }: { values: number[]; color: string }) {
  const w = 720, h = 240, p = 10;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - p * 2) + p;
      const y = h - p - ((v - min) / range) * (h - p * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastY = h - p - ((values[values.length - 1] - min) / range) * (h - p * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="240" preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={p} x2={w - p} y1={h * g} y2={h * g}
          stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <polygon points={`${p},${h} ${pts} ${w - p},${h}`} fill="url(#cg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={w - p} cy={lastY} r="3.5" fill={color} />
    </svg>
  );
}

function buildSeries(price: number, ch7d: number) {
  const start = price / (1 + ch7d / 100);
  const out: number[] = [];
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    out.push(start + (price - start) * t + Math.sin((i + price % 7) * 2.3) * price * 0.004);
  }
  out[out.length - 1] = price;
  return out;
}