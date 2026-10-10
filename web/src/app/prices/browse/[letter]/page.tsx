import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Footer } from "@/components/layout";
import { Breadcrumb, ItemCell, PageHead, formatMoney } from "@/components/ui";
import { ItemIcon } from "@/components/itemicon";
import { ALPHABET, ITEMS, itemsByLetter } from "@/lib/items";
import { live } from "@/lib/read";
import { MARKET } from "@/lib/data";

export function generateStaticParams() {
  return ALPHABET.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const L = letter.toUpperCase();
  const n = itemsByLetter(L).length;
  return {
    title: `DonutSMP Items Starting With ${L} — Prices A-Z`,
    description: `All ${n} DonutSMP items starting with ${L}, with current auction prices where tracked.`,
  };
}

export const instant = false;

export default async function BrowseLetter({ params }: { params: Promise<{ letter: string }> }) {
  await live();
  const { letter } = await params;
  const L = letter.toUpperCase();
  if (!ALPHABET.includes(L)) notFound();

  const items = itemsByLetter(L);
  const priced = items.filter((i) => MARKET.some((m) => m.slug === i.slug));

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1560px] px-4 pt-8">
        <Breadcrumb
          trail={[["Prices", "/prices"], ["Browse", "/prices/browse"], [L, `/prices/browse/${L}`]]}
        />

        <PageHead
          eyebrow={`${items.length} items · ${priced.length} priced`}
          title={`Items starting with ${L}`}
          lede={priced.length ? undefined : "No prices recorded for these yet. They appear as soon as the collector reports a listing."}
        />

        {/* A-Z rail */}
        <div className="mt-6 flex flex-wrap gap-1">
          <Link href="/prices/browse"
            className="num px-2.5 py-1 text-[12px]"
            style={{ color: "var(--muted)", border: "1px solid var(--line)" }}>
            All
          </Link>
          {ALPHABET.map((X) => (
            <Link
              key={X}
              href={`/prices/browse/${X}`}
              className="num px-2.5 py-1 text-[12px] transition-colors"
              style={{
                color: X === L ? "var(--bg)" : "var(--muted)",
                background: X === L ? "var(--gold)" : "transparent",
                border: "1px solid var(--line)",
              }}
            >
              {X}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="num mt-10 text-[12px]" style={{ color: "var(--dim)" }}>
            Nothing in the catalogue starts with {L}.
          </p>
        ) : (
          <>
            {/* Priced items as a table */}
            {priced.length > 0 ? (
              <div className="mt-6 border" style={{ borderColor: "var(--line)" }}>
                <table className="dense w-full">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Lowest</th>
                      <th className="text-right">Listings</th>
                      <th className="w-16" />
                    </tr>
                  </thead>
                  <tbody>
                    {priced.map((i) => {
                      const m = MARKET.find((x) => x.slug === i.slug)!;
                      return (
                        <tr key={i.slug}>
                          <td><ItemCell slug={i.slug} name={m.name} material={m.material} /></td>
                          <td className="num text-right font-medium">{formatMoney(m.price)}</td>
                          <td className="num text-right" style={{ color: "var(--muted)" }}>
                            {m.listings.toLocaleString()}
                          </td>
                          <td className="pr-3">
                            <Link href={`/prices/${i.slug}`} className="num text-[11px]" style={{ color: "var(--gold)" }}>
                              View →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* Unpriced items as a sprite grid */}
            {items.length > priced.length ? (
              <div className="mt-10">
                <span className="label" style={{ color: "var(--gold)" }}>
                  [ Tracked, awaiting price ]
                </span>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {items
                    .filter((i) => !MARKET.some((m) => m.slug === i.slug))
                    .map((i) => (
                      <Link
                        key={i.slug}
                        href="/prices/browse"
                        className="flex flex-col items-center gap-1.5 p-2 transition-colors hover:bg-[var(--surface2)]"
                        title={i.name}
                      >
                        <ItemIcon material={i.material} name={i.name} size={32} />
                        <span className="num truncate text-[9px]" style={{ color: "var(--dim)" }}>
                          {i.name}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}