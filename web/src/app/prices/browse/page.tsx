import Link from "next/link";
import { TopNav, Footer } from "@/components/layout";
import { PageHead, ItemCell, formatMoney } from "@/components/ui";
import { MARKET } from "@/lib/data";
import { ITEMS, CATEGORY_LABEL, type Category } from "@/lib/items";

export const instant = false;

export const metadata = {
  title: "All DonutSMP Items A-Z — Full Catalogue",
  description: "Every item the DonutSMP collector tracks, organised A-Z and by category.",
};

export default function BrowsePage() {
  const priced = MARKET.map((m) => m.slug);
  const cats = Array.from(new Set(ITEMS.map((i) => i.category))) as Category[];

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1400px] px-5 pt-10">
        <PageHead
          eyebrow={`${ITEMS.length} items in the catalogue`}
          title="Browse everything"
          lede="Full collector catalogue. Priced items only show a value."
        />

        {cats.map((c) => {
          const items = ITEMS.filter((i) => i.category === c);
          return (
            <section key={c} className="mt-10">
              <div className="rule-gold flex items-baseline justify-between pt-3">
                <h2 className="text-[17px] font-semibold tracking-tight">{CATEGORY_LABEL[c]}</h2>
                <span className="num text-[11px]" style={{ color: "var(--dim)" }}>{items.length}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
                {items.map((i) => {
                  const m = MARKET.find((x) => x.slug === i.slug);
                  return m ? (
                    <Link key={i.slug} href={`/prices/${i.slug}`}
                      className="num text-[12px] transition-colors hover:text-[var(--gold)]"
                      style={{ color: "var(--muted)" }}>
                      {m.name} <span style={{ color: "var(--dim)" }}>{formatMoney(m.price)}</span>
                    </Link>
                  ) : (
                    <span key={i.slug} className="num text-[12px]" style={{ color: "var(--dim)" }}>
                      {i.name}
                    </span>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <Footer />
    </>
  );
}