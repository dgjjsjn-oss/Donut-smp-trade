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
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "var(--bg)" }}>
      <div className="mx-auto flex h-12 max-w-[1560px] items-center gap-5 px-4">
        <Link href="/" className="shrink-0"><Wordmark /></Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map(([icon, label, href]) => (
            <Link
              key={href}
              href={href}
              className="pill group flex items-center gap-1.5 py-1 transition-colors"
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
                style={{ color: "var(--muted)" }}
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

// Every destination gets a real Minecraft texture as its marker, so the footer
// reads as a visual index instead of three columns of grey text.
const FOOTER_GROUPS: { title: string; links: [string, string, string][] }[] = [
  {
    title: "Market",
    links: [
      ["diamond", "Prices", "/prices"],
      ["emerald", "Auction", "/auction"],
      ["gold_ingot", "Completed sales", "/transactions"],
      ["netherite_ingot", "Browse all", "/prices/browse"],
    ],
  },
  {
    title: "Community",
    links: [
      ["totem_of_undying", "Leaderboards", "/leaderboards"],
      ["skeleton_skull", "Player finder", "/players"],
      ["beacon", "Server status", "/server-status"],
      ["map", "Regions", "/regions"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["barrel", "Economy", "/stats"],
      ["crafting_table", "Tools", "/tools"],
      ["enchanting_table", "API", "/api"],
      ["nether_star", "Premium", "/premium"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t" style={{ borderColor: "var(--line)" }}>
      {/* Real block-texture ground running under the footer */}
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
        {/* Brand block */}
        <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Wordmark />
            <p className="num mt-4 max-w-[32ch] text-[11.5px] leading-relaxed" style={{ color: "var(--dim)" }}>
              Independent community stats for DonutSMP. Collected by our own bot. Not affiliated
              with the DonutSMP team.
            </p>
            <div className="mt-5 flex gap-1.5">
              {["diamond", "netherite_ingot", "elytra", "ancient_debris"].map((b) => (
                <span key={b} className="slot grid h-8 w-8 place-items-center overflow-hidden">
                  <img src={`/items/${b}.png`} alt="" width={20} height={20} className="px" />
                </span>
              ))}
            </div>
          </div>

          {/* Visual link index */}
          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="label mb-4">{g.title}</div>
                <ul className="space-y-1.5">
                  {g.links.map(([icon, label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="pill group flex items-center gap-2.5 py-1 transition-colors"
                      >
                        <span className="slot grid h-6 w-6 shrink-0 place-items-center overflow-hidden transition-colors group-hover:border-[var(--gold)]">
                          <img
                            src={`/items/${icon}.png`}
                            alt=""
                            width={16}
                            height={16}
                            className="px"
                            loading="lazy"
                          />
                        </span>
                        <span
                          className="text-[12px] transition-colors group-hover:text-[var(--gold)]"
                          style={{ color: "var(--muted)" }}
                        >
                          {label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Texture marquee — the footer's closing image */}
        <div className="mt-12 flex gap-1 overflow-hidden" aria-hidden>
          {["deepslate", "tuff", "andesite", "granite", "diorite", "calcite",
            "dripstone_block", "smooth_basalt", "polished_blackstone", "blackstone",
            "cobbled_deepslate", "polished_deepslate"].map((b, i) => (
            <img
              key={i}
              src={`/items/${b}.png`}
              alt=""
              width={26}
              height={26}
              className="px shrink-0 opacity-30"
              loading="lazy"
            />
          ))}
        </div>

        <div
          className="num mt-8 flex flex-col gap-3 border-t pt-5 text-[10.5px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--line)", color: "var(--dim)" }}
        >
          <span>© 2026 DonutSMP Trader</span>
          <span className="flex gap-5">
            <Link href="/about" className="transition-colors hover:text-[var(--ink)]">About</Link>
            <Link href="/about#privacy" className="transition-colors hover:text-[var(--ink)]">Privacy</Link>
            <Link href="/about#terms" className="transition-colors hover:text-[var(--ink)]">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}