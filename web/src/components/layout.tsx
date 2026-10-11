"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./logo";
import { Search } from "./search";
import { ITEMS } from "@/lib/items";
import { MARKET } from "@/lib/data";
import { PLAYERS } from "@/lib/players";

const SEARCH_ITEMS: [string, string][] = ITEMS.map((i) => [i.slug, i.name]);
const SEARCH_PLAYERS: [string, string][] = PLAYERS.map((p) => [p.name.toLowerCase(), p.name]);
const SEARCH_PRICES: Record<string, number> = Object.fromEntries(
  MARKET.map((m) => [m.slug, m.price])
);

const NAV: [string, string, string][] = [
  ["diamond", "Prices", "/prices"],
  ["emerald", "Auction", "/auction"],
  ["gold_ingot", "Sales", "/transactions"],
  ["totem_of_undying", "Boards", "/leaderboards"],
  ["skeleton_skull", "Players", "/players"],
  ["map", "Regions", "/regions"],
  ["netherite_ingot", "Economy", "/stats"],
  ["crafting_table", "Tools", "/tools"],
  ["beacon", "Status", "/server-status"],
];

export function TopNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "var(--bg)" }}>
      <div className="mx-auto flex h-12 max-w-[1560px] items-center gap-5 px-4">
        <Link href="/" className="shrink-0"><Wordmark /></Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map(([icon, label, href]) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "pill group flex items-center gap-1.5 py-1" : "pill group flex items-center gap-1.5 py-1"}
              title={label}
            >
              <img
                src={`/items/${icon}.png`}
                alt=""
                width={16}
                height={16}
                className="px opacity-60 transition-opacity group-hover:opacity-100"
              />
              <span
                className="num text-[11px] uppercase tracking-[0.08em] transition-colors group-hover:text-[var(--gold)]"
                style={{ color: isActive(href) ? "var(--gold)" : "var(--muted)" }}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Search items={SEARCH_ITEMS} players={SEARCH_PLAYERS} prices={SEARCH_PRICES} />
          <Link
            href="/api"
            className="pill num hidden border text-[10.5px] uppercase tracking-[0.08em] sm:block"
            style={{ color: "var(--muted)", borderColor: "var(--line)" }}
          >
            API
          </Link>
          <Link
            href="/premium"
            className="btn px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
            style={{ background: "var(--gold)", color: "#0a0b0e" }}
          >
            Premium
          </Link>
        </div>
      </div>

      {/* Mobile nav strip */}
      <nav
        className="flex gap-3 overflow-x-auto border-t px-4 py-2 lg:hidden"
        style={{ borderColor: "var(--line)" }}
      >
        {NAV.map(([icon, label, href]) => (
          <Link
            key={href}
            href={href}
            className="pill flex shrink-0 items-center gap-1.5"
          >
            <img src={`/items/${icon}.png`} alt="" width={14} height={14} className="px opacity-60" />
            <span className="num text-[10.5px] uppercase tracking-[0.08em]" style={{ color: "var(--muted)" }}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Ticker({ items }: { items: { name: string; price: number; ch: number }[] }) {
  const line = items.map(
    (i) => `${i.name} ${money(i.price)} ${i.ch > 0 ? "+" : ""}${i.ch.toFixed(2)}%`
  );
  return (
    <div className="w-full overflow-hidden border-b" style={{ background: "var(--surface)" }}>
      <div
        className="num flex w-max gap-8 px-4 py-1.5 text-[10.5px] whitespace-nowrap"
        style={{ animation: "ticker 60s linear infinite", color: "var(--muted)" }}
      >
        {[...line, ...line].map((t, i) => (
          <span key={i}>
            {t.split(" ").map((part, j) =>
              part.endsWith("%") ? (
                <span key={j} style={{
                  color: part.startsWith("+") ? "var(--up)" : "var(--down)",
                }}>{part} </span>
              ) : <span key={j}>{part} </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function money(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

// Footer is deliberately short. Twelve grey links across three columns reads as
// filler; six links with a real texture beside each does not.
const FOOTER_LINKS: [string, string, string][] = [
  ["diamond", "Prices", "/prices"],
  ["emerald", "Auction", "/auction"],
  ["gold_ingot", "Completed sales", "/transactions"],
  ["netherite_ingot", "Browse all", "/prices/browse"],
  ["totem_of_undying", "Leaderboards", "/leaderboards"],
  ["skeleton_skull", "Players", "/players"],
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t" style={{ borderColor: "var(--line)" }}>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.07]"
        style={{
          backgroundImage: "url(/items/deepslate.png)",
          backgroundSize: "56px 56px",
          imageRendering: "pixelated",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1560px] px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <Wordmark />
            <p className="num mt-4 max-w-[34ch] text-[11.5px] leading-relaxed" style={{ color: "var(--dim)" }}>
              Community stats for DonutSMP. Not affiliated with the DonutSMP team.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-6 gap-y-1 self-start">
            {FOOTER_LINKS.map(([icon, label, href]) => (
              <Link key={href} href={href} className="pill group flex items-center gap-2.5 py-1.5">
                <span className="slot grid h-6 w-6 shrink-0 place-items-center overflow-hidden transition-colors group-hover:border-[var(--gold)]">
                  <img src={`/items/${icon}.png`} alt="" width={16} height={16} className="px" loading="lazy" />
                </span>
                <span className="text-[12px] transition-colors group-hover:text-[var(--gold)]" style={{ color: "var(--muted)" }}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="num mt-10 flex flex-col gap-3 border-t pt-5 text-[10.5px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--line)", color: "var(--dim)" }}
        >
          <span>© 2026 DonutSMP Trader</span>
          <span className="flex gap-5">
            <Link href="/api" className="transition-colors hover:text-[var(--ink)]">API</Link>
            <Link href="/stats" className="transition-colors hover:text-[var(--ink)]">Economy</Link>
            <Link href="/about" className="transition-colors hover:text-[var(--ink)]">About</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}