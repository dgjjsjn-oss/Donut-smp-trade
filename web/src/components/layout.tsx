import Link from "next/link";

export function formatMoney(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function pct(n: number) {
  const s = n > 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}

export function changeColor(n: number) {
  return n > 0 ? "var(--up)" : n < 0 ? "var(--down)" : "var(--muted)";
}

const NAV = [
  { href: "/prices", label: "Prices" },
  { href: "/auction", label: "Auction" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/players", label: "Players" },
  { href: "/regions", label: "Regions" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
];

export function TopNav() {
  return (
    <header
      style={{ borderColor: "var(--line)", background: "var(--bg)" }}
      className="sticky top-0 z-50 border-b backdrop-blur"
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-8 px-5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="grid h-7 w-7 place-items-center rounded-[3px] num text-xs font-bold"
            style={{ background: "var(--gold)", color: "#0a0b0e" }}
          >
            D
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            DonutSMP<span style={{ color: "var(--gold)" }}>Trader</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13px] transition-colors hover:text-[var(--ink)]"
              style={{ color: "var(--muted)" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="hidden px-3 py-1.5 text-[12px] transition-colors sm:block"
            style={{ color: "var(--dim)", border: "1px solid var(--line)" }}
          >
            <span className="num">/</span> Search
          </button>
          <Link
            href="/api"
            className="hidden px-3 py-1.5 text-[12px] num transition-colors md:block"
            style={{ color: "var(--muted)", border: "1px solid var(--line)" }}
          >
            API
          </Link>
          <Link
            href="/premium"
            className="px-3.5 py-1.5 text-[12px] font-semibold transition-transform active:scale-95"
            style={{ background: "var(--gold)", color: "#0a0b0e" }}
          >
            Premium
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Ticker({ items }: { items: { name: string; price: number; ch: number }[] }) {
  return (
    <div
      className="w-full overflow-hidden border-b"
      style={{ borderColor: "var(--line)", background: "var(--surface)" }}
    >
      <div className="flex w-max gap-8 px-5 py-1.5" style={{ animation: "marquee 40s linear infinite" }}>
        {[...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-2 text-[11px] whitespace-nowrap">
            <span className="label">{it.name}</span>
            <span className="num font-medium">{formatMoney(it.price)}</span>
            <span className="num" style={{ color: changeColor(it.ch) }}>
              {pct(it.ch)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ borderColor: "var(--line)" }} className="mt-24 border-t">
      <div className="mx-auto max-w-[1400px] px-5 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-[3px] num text-[11px] font-bold" style={{ background: "var(--gold)", color: "#0a0b0e" }}>D</span>
              <span className="font-semibold">DonutSMP Trader</span>
            </div>
            <p className="text-[13px]" style={{ color: "var(--muted)", maxWidth: 280 }}>
              Independent community stats platform for DonutSMP. Not affiliated with the DonutSMP team.
            </p>
          </div>
          {[
            { t: "Market", l: [["Prices", "/prices"], ["Auction House", "/auction"], ["Completed Sales", "/transactions"], ["Trending", "/prices/trending"]] },
            { t: "Community", l: [["Leaderboards", "/leaderboards"], ["Player Finder", "/players"], ["Server Status", "/server-status"], ["Regions", "/regions"]] },
            { t: "Site", l: [["Blog", "/blog"], ["API", "/api"], ["Premium", "/premium"], ["Advertise", "/advertise"]] },
          ].map((col) => (
            <div key={col.t}>
              <div className="label mb-3">{col.t}</div>
              <ul className="space-y-2">
                {col.l.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-[13px]" style={{ color: "var(--muted)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-12 flex flex-col gap-3 pt-6 text-[11px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--line)", color: "var(--dim)" }}
        >
          <span>© 2026 DonutSMP Trader · Community stats platform</span>
          <span className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/about">About</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}