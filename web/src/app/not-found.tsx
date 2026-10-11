import Link from "next/link";
import { TopNav, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1560px] px-4 py-24">
        <div className="compartment pt-3">
          <span className="label" style={{ color: "var(--gold)" }}>[ 404 // route not resolved ]</span>
          <h1 className="macro mt-4">Nothing<br />trades here.</h1>
          <p className="mt-6 max-w-[46ch] text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
            That page does not exist. The market lives under prices — try the search, or jump
            straight to the items traders actually watch.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/prices" className="px-5 py-2.5 text-[12.5px] font-semibold transition-transform active:scale-[0.98]"
              style={{ background: "var(--gold)", color: "var(--bg)" }}>
              Browse item prices
            </Link>
            <Link href="/" className="num border px-5 py-2.5 text-[12.5px]"
              style={{ borderColor: "var(--line2)" }}>
              Back to market
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
            {["diamond","netherite_ingot","elytra","totem_of_undying","end_crystal","ancient_debris"].map((s) => (
              <Link key={s} href={`/prices/${s}`} className="num text-[12px] transition-colors hover:text-[var(--gold)]"
                style={{ color: "var(--muted)" }}>
                {s.replace(/_/g, " ")} →
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}