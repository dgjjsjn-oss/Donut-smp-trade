"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { hasFlatTexture } from "@/lib/items";

type Kind = "item" | "player" | "page";
type Entry = { label: string; sub: string; href: string; kind: Kind; price?: number };
type Group = { kind: Kind; label: string; rows: Entry[] };

const RECENT_KEY = "dst_recent";
const MAX_RECENT = 6;

/**
 * Item thumbnail for search results. Blocks that exist only as 3D models have no
 * flat texture, so they render an empty inventory slot instead of firing a
 * request that would always 404.
 */
function itemThumb(material: string) {
  if (!hasFlatTexture(material)) {
    return <span className="slot grid h-5 w-5 shrink-0 place-items-center" aria-hidden />;
  }
  return (
    <img
      src={`/items/${material}.png`}
      alt=""
      width={20}
      height={20}
      className="px shrink-0"
      onError={(ev) => { (ev.target as HTMLImageElement).style.visibility = "hidden"; }}
    />
  );
}

const PAGES: Entry[] = [
  { label: "Item prices", sub: "all tracked items", href: "/prices", kind: "page" },
  { label: "Browse catalogue", sub: "600+ items A-Z", href: "/prices/browse", kind: "page" },
  { label: "Auction house", sub: "active listings", href: "/auction", kind: "page" },
  { label: "Completed sales", sub: "what buyers paid", href: "/transactions", kind: "page" },
  { label: "Leaderboards", sub: "10 boards", href: "/leaderboards", kind: "page" },
  { label: "Player finder", sub: "search accounts", href: "/players", kind: "page" },
  { label: "Server regions", sub: "live population", href: "/regions", kind: "page" },
  { label: "Server economy", sub: "lifetime totals", href: "/stats", kind: "page" },
  { label: "Server status", sub: "ping & uptime", href: "/server-status", kind: "page" },
  { label: "Trading tools", sub: "calculators", href: "/tools", kind: "page" },
  { label: "Public API", sub: "documentation", href: "/api", kind: "page" },
  { label: "Premium plans", sub: "pricing", href: "/premium", kind: "page" },
];

const KIND_LABEL: Record<Kind, string> = { item: "Items", player: "Players", page: "Pages" };

export function Search({
  items,
  players,
  prices,
}: {
  items: [string, string][];
  players: [string, string][];
  prices: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const groups = useMemo(() => search(q, items, players, prices, recent), [q, items, players, prices, recent]);
  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups]);
  const total = flat.length;

  useEffect(() => { setCursor(0); }, [q]);

  function remember(href: string, label: string) {
    try {
      const next = [label, ...recent.filter((r) => r !== label)].slice(0, MAX_RECENT);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }

  function go(e: Entry) {
    remember(e.href, e.label);
    setOpen(false);
    router.push(e.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, total - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter" && flat[cursor]) { e.preventDefault(); go(flat[cursor]); }
    else if (e.key === "Backspace" && !q && recent.length) {
      setRecent((r) => {
        const next = r.slice(1);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        return next;
      });
    }
  }

  let idx = -1;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="pill num flex items-center gap-2 border text-[10.5px] uppercase tracking-[0.08em] hover:border-[var(--line2)]"
        style={{ color: "var(--dim)", borderColor: "var(--line)" }}
        aria-label="Open search"
        aria-keyshortcuts="Control+K"
      >
        <span>Search</span>
        <kbd className="num border px-1 text-[9px]" style={{ borderColor: "var(--line2)" }}>Ctrl K</kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
          style={{ background: "rgba(5,6,9,0.84)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search site"
        >
          <div
            className="w-full max-w-[580px] border"
            style={{ borderColor: "var(--line2)", background: "var(--bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-2.5 border-b px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
              <span className="num text-[11px]" style={{ color: "var(--gold)" }}>&gt;</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search 600+ items, players and pages"
                aria-label="Search query"
                aria-autocomplete="list"
                className="num flex-1 bg-transparent text-[13px] outline-none"
              />
              {q ? (
                <button
                  onClick={() => { setQ(""); inputRef.current?.focus(); }}
                  className="num px-1.5 text-[11px]"
                  style={{ color: "var(--dim)" }}
                  aria-label="Clear search"
                >
                  CLR
                </button>
              ) : null}
              <kbd className="num border px-1 text-[9px]" style={{ borderColor: "var(--line2)", color: "var(--dim)" }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[54vh] overflow-y-auto">
              {total === 0 ? (
                <ZeroResults q={q} />
              ) : (
                groups.map((g) => (
                  <div key={g.kind}>
                    <div
                      className="num sticky top-0 px-3 py-1 text-[9px] uppercase tracking-[0.14em]"
                      style={{ background: "var(--surface)", color: "var(--dim)" }}
                    >
                      {g.label} · {g.rows.length}
                    </div>
                    {g.rows.map((r) => {
                      idx++;
                      const i = idx;
                      return (
                        <button
                          key={r.href}
                          onClick={() => go(r)}
                          onMouseEnter={() => setCursor(i)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                          style={{ background: i === cursor ? "var(--surface2)" : "transparent" }}
                        >
                          {r.kind === "item" ? itemThumb(r.sub) : r.kind === "player" ? (
                            <img
                              src={`https://mc-heads.net/avatar/${encodeURIComponent(r.label)}/40`}
                              alt=""
                              width={20}
                              height={20}
                              className="px shrink-0"
                            />
                          ) : (
                            <span className="num w-5 shrink-0 text-[10px]" style={{ color: "var(--gold)" }}>/</span>
                          )}

                          <span className="min-w-0 flex-1 truncate text-[12.5px]">
                            <Highlight text={r.label} term={q} />
                          </span>

                          {r.price !== undefined ? (
                            <span className="num shrink-0 text-[11px]" style={{ color: "var(--muted)" }}>
                              {money(r.price)}
                            </span>
                          ) : (
                            <span className="num shrink-0 truncate text-[10px]" style={{ color: "var(--dim)" }}>
                              {r.sub}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              className="num flex items-center justify-between border-t px-3 py-1.5 text-[9.5px]"
              style={{ borderColor: "var(--line)", color: "var(--dim)" }}
            >
              <span>{total} result{total === 1 ? "" : "s"}</span>
              <span>↑↓ move · ↵ open · / to search</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ── zero results is a retention moment, not a dead end ── */
function ZeroResults({ q }: { q: string }) {
  const guesses = suggest(q);
  return (
    <div className="px-4 py-8 text-center">
      <p className="num text-[12px]" style={{ color: "var(--muted)" }}>
        No results for <span style={{ color: "var(--ink)" }}>“{q}”</span>
      </p>
      {guesses.length > 0 ? (
        <>
          <p className="num mt-4 text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--dim)" }}>
            Did you mean
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {guesses.map((g) => (
              <span
                key={g}
                className="num border px-2 py-0.5 text-[11px]"
                style={{ borderColor: "var(--line2)", color: "var(--muted)" }}
              >
                {g}
              </span>
            ))}
          </div>
        </>
      ) : null}
      <p className="num mt-5 text-[10.5px]" style={{ color: "var(--dim)" }}>
        Try an item name like <span style={{ color: "var(--gold)" }}>diamond</span>, or browse{" "}
        <span style={{ color: "var(--gold)" }}>all prices</span>.
      </p>
    </div>
  );
}

/** Highlights the matched run so the user sees why a row matched. */
function Highlight({ text, term }: { text: string; term: string }) {
  const t = term.trim().toLowerCase();
  if (!t) return <>{text}</>;
  const i = text.toLowerCase().indexOf(t);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: "transparent", color: "var(--gold)" }}>
        {text.slice(i, i + t.length)}
      </mark>
      {text.slice(i + t.length)}
    </>
  );
}

/* ── ranking ── */
function search(
  q: string,
  items: [string, string][],
  players: [string, string][],
  prices: Record<string, number>,
  recent: string[]
): Group[] {
  const term = q.trim().toLowerCase();
  const out: Group[] = [];

  // Empty query: recent first, then trending, then pages.
  if (!term) {
    if (recent.length) {
      const rows = recent
        .map((label) => {
          const item = items.find(([, n]) => n.toLowerCase() === label.toLowerCase());
          if (item) return { label: item[1], sub: item[0], href: `/prices/${item[0]}`, kind: "item" as Kind, price: prices[item[0]] };
          const p = players.find(([, n]) => n.toLowerCase() === label.toLowerCase());
          if (p) return { label: p[1], sub: "player", href: `/players/${p[1]}`, kind: "player" as Kind };
          return null;
        })
        .filter(Boolean) as Entry[];
      if (rows.length) out.push({ kind: "item", label: "Recent", rows });
    }
    const trending = Object.entries(prices)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([slug, price]) => ({
        label: items.find(([s]) => s === slug)?.[1] ?? slug,
        sub: slug,
        href: `/prices/${slug}`,
        kind: "item" as Kind,
        price,
      }));
    out.push({ kind: "item", label: "Trending", rows: trending });
    out.push({ kind: "page", label: "Pages", rows: PAGES.slice(0, 5) });
    return out;
  }

  // Prefix matches rank above substring matches.
  const score = (label: string) => {
    const l = label.toLowerCase();
    if (l.startsWith(term)) return 0;
    if (l.split("_").some((w) => w.startsWith(term))) return 1;
    if (l.includes(term)) return 2;
    return -1;
  };

  const itemRows: Entry[] = items
    .map(([slug, name]) => ({ name, slug, s: Math.min(score(name), score(slug)) }))
    .filter((r) => r.s >= 0)
    .sort((a, b) => a.s - b.s || (prices[b.slug] ?? 0) - (prices[a.slug] ?? 0))
    .slice(0, 8)
    .map((r) => ({ label: r.name, sub: r.slug, href: `/prices/${r.slug}`, kind: "item" as Kind, price: prices[r.slug] }));

  const playerRows: Entry[] = players
    .map(([slug, name]) => ({ name, s: score(name) }))
    .filter((r) => r.s >= 0)
    .sort((a, b) => a.s - b.s)
    .slice(0, 5)
    .map((r) => ({ label: r.name, sub: "player", href: `/players/${r.name}`, kind: "player" as Kind }));

  const pageRows = PAGES.filter((p) => p.label.toLowerCase().includes(term)).slice(0, 4);

  if (itemRows.length) out.push({ kind: "item", label: KIND_LABEL.item, rows: itemRows });
  if (playerRows.length) out.push({ kind: "player", label: KIND_LABEL.player, rows: playerRows });
  if (pageRows.length) out.push({ kind: "page", label: KIND_LABEL.page, rows: pageRows });

  return out;
}

/** Cheap typo tolerance: drop a vowel / trailing char, plus close catalogue names. */
function suggest(q: string): string[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const base = ["diamond", "elytra", "netherite_ingot", "spawner", "totem_of_undying"];
  const near = base.filter(
    (b) => levenshtein(b, t) <= Math.max(1, Math.floor(t.length / 3))
  );
  const v = t.replace(/[aeiou]/g, "");
  const vowelled = base.find((b) => b.replace(/[aeiou]/g, "").startsWith(v) && v.length > 2);
  return Array.from(new Set([...near, ...(vowelled ? [vowelled] : [])])).slice(0, 4);
}

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[m][n];
}

function money(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}
