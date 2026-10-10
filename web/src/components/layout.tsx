import Link from "next/link";
import { Wordmark } from "./logo";
import { Search } from "./search";
import { ITEMS } from "@/lib/items";
import { PLAYERS, MARKET } from "@/lib/data";

const SEARCH_ITEMS: [string, string][] = ITEMS.map((i) => [i.slug, i.name]);
const SEARCH_PLAYERS: [string, string][] = PLAYERS.map((p) => [p.name.toLowerCase(), p.name]);
const SEARCH_PRICES: Record<string, number> = Object.fromEntries(
  MARKET.map((m) => [m.slug, m.price])
);

const NAV = [
  { href: "/prices", label: "Prices" },
  { href: "/auction", label: "Auction" },
  { href: "/transactions", label: "Sales" },
  { href: "/leaderboards", label: "Boards" },
  { href: "/players", label: "Players" },
  { href: "/regions", label: "Regions" },
  { href: "/stats", label: "Economy" },
  { href: "/tools", label: "Tools" },
  { href: "/server-status", label: "Status" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "var(--bg)" }}>
      <div className="mx-auto flex h-12 max-w-[1560px] items-center gap-6 px-4">
        <Link href="/" className="shrink-0"><Wordmark /></Link>

        <nav className="hidden flex-1 items-center gap-4 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="num text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-[var(--gold)]"
              style={{ color: "var(--muted)" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Search items={SEARCH_ITEMS} players={SEARCH_PLAYERS} prices={SEARCH_PRICES} />
          <Link
            href="/api"
            className="num border px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] transition-colors"
            style={{ color: "var(--muted)", borderColor: "var(--line)" }}
          >
            API
          </Link>
          <Link
            href="/premium"
            className="num px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] transition-transform active:scale-95"
            style={{ background: "var(--gold)", color: "#0a0b0e" }}
          >
            Premium
          </Link>
        </div>
      </div>

      {/* Mobile nav strip */}
      <nav
        className="flex gap-4 overflow-x-auto border-t px-4 py-2 lg:hidden"
        style={{ borderColor: "var(--line)" }}
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="num shrink-0 text-[10.5px] uppercase tracking-[0.1em]"
            style={{ color: "var(--muted)" }}
          >
            {n.label}
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

export function Footer() {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-[1560px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark compact />
            <p className="num mt-3 max-w-[30ch] text-[11px] leading-relaxed" style={{ color: "var(--dim)" }}>
              Independent community stats platform for DonutSMP. Not affiliated with the DonutSMP team.
            </p>
          </div>
          {[
            { t: "Market", l: [["Prices", "/prices"], ["Auction", "/auction"], ["Completed Sales", "/transactions"], ["Browse all", "/prices/browse"]] },
            { t: "Community", l: [["Leaderboards", "/leaderboards"], ["Player Finder", "/players"], ["Server Status", "/server-status"], ["Regions", "/regions"]] },
            { t: "Platform", l: [["Economy", "/stats"], ["Tools", "/tools"], ["API", "/api"], ["Premium", "/premium"]] },
          ].map((col) => (
            <div key={col.t}>
              <div className="label mb-3">{col.t}</div>
              <ul className="space-y-2">
                {col.l.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="num text-[11.5px] transition-colors hover:text-[var(--gold)]"
                      style={{ color: "var(--muted)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="num mt-10 flex flex-col gap-2 border-t pt-5 text-[10px] sm:flex-row sm:items-center sm:justify-between"
          style={{ color: "var(--dim)" }}
        >
          <span>© 2026 DonutSMP Trader // community stats platform</span>
          <span className="flex gap-4">
            <Link href="/about" className="hover:text-[var(--ink)]">About</Link>
            <Link href="/about#privacy" className="hover:text-[var(--ink)]">Privacy</Link>
            <Link href="/about#terms" className="hover:text-[var(--ink)]">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}