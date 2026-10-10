"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = { label: string; sub: string; href: string; kind: "item" | "player" | "page" };

const PAGES: Entry[] = [
  { label: "Item prices", sub: "All tracked items", href: "/prices", kind: "page" },
  { label: "Browse catalogue A–Z", sub: "Every item", href: "/prices/browse", kind: "page" },
  { label: "Auction house", sub: "Active listings", href: "/auction", kind: "page" },
  { label: "Completed sales", sub: "What buyers paid", href: "/transactions", kind: "page" },
  { label: "Leaderboards", sub: "10 boards", href: "/leaderboards", kind: "page" },
  { label: "Player finder", sub: "Search accounts", href: "/players", kind: "page" },
  { label: "Server regions", sub: "Live population", href: "/regions", kind: "page" },
  { label: "Server economy", sub: "Lifetime totals", href: "/stats", kind: "page" },
  { label: "Server status", sub: "Ping & uptime", href: "/server-status", kind: "page" },
  { label: "Trading tools", sub: "Calculators", href: "/tools", kind: "page" },
  { label: "Public API", sub: "Docs", href: "/api", kind: "page" },
  { label: "Premium", sub: "Plans", href: "/premium", kind: "page" },
];

export function Search({ items, players }: { items: [string, string][]; players: [string, string][] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
          e.preventDefault();
          setOpen(true);
        }
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = buildResults(q, items, players);

  useEffect(() => { setSel(0); }, [q]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel].href); }
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="num flex items-center gap-2 border px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] transition-colors hover:border-[var(--line2)]"
        style={{ color: "var(--dim)", borderColor: "var(--line)" }}
        aria-label="Open search"
      >
        <span>Search</span>
        <kbd className="num border px-1 text-[9px]" style={{ borderColor: "var(--line2)" }}>Ctrl K</kbd>
      </button>

      {/* Overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          style={{ background: "rgba(5,6,9,0.82)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div
            className="w-full max-w-[560px] border"
            style={{ borderColor: "var(--line2)", background: "var(--bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
              <span className="num text-[11px]" style={{ color: "var(--dim)" }}>&gt;</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search 600+ items and players…"
                className="num flex-1 bg-transparent text-[13px] outline-none"
                style={{ color: "var(--ink)" }}
              />
              <kbd className="num border px-1 text-[9px]" style={{ borderColor: "var(--line2)", color: "var(--dim)" }}>
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="num px-3 py-8 text-center text-[11.5px]" style={{ color: "var(--dim)" }}>
                  No match for “{q}”
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={r.href}
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setSel(i)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                    style={{ background: i === sel ? "var(--surface2)" : "transparent" }}
                  >
                    <span
                      className="num w-14 shrink-0 text-[9px] uppercase tracking-[0.1em]"
                      style={{ color: r.kind === "item" ? "var(--gold)" : r.kind === "player" ? "var(--blue)" : "var(--dim)" }}
                    >
                      {r.kind}
                    </span>
                    <span className="flex-1 truncate text-[12.5px]">{r.label}</span>
                    <span className="num truncate text-[10px]" style={{ color: "var(--dim)" }}>{r.sub}</span>
                  </button>
                ))
              )}
            </div>

            <div
              className="num flex items-center justify-between border-t px-3 py-1.5 text-[9.5px]"
              style={{ borderColor: "var(--line)", color: "var(--dim)" }}
            >
              <span>{results.length} results</span>
              <span>↑↓ navigate · ↵ open</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function buildResults(q: string, items: [string, string][], players: [string, string][]): Entry[] {
  const term = q.trim().toLowerCase();
  if (!term) return PAGES.slice(0, 8);

  const out: Entry[] = [];

  for (const [slug, name] of items) {
    const n = name.toLowerCase();
    if (n.startsWith(term)) { out.push({ label: name, sub: slug, href: `/prices/${slug}`, kind: "item" }); }
    else if (n.includes(term)) { out.push({ label: name, sub: slug, href: `/prices/${slug}`, kind: "item" }); }
    if (out.length >= 8) break;
  }

  for (const [slug, name] of players) {
    if (name.toLowerCase().startsWith(term)) {
      out.push({ label: name, sub: "player", href: `/players/${name}`, kind: "player" });
    }
    if (out.length >= 12) break;
  }

  for (const p of PAGES) {
    if (p.label.toLowerCase().includes(term)) out.push(p);
  }

  return out.slice(0, 14);
}