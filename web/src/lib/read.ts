// Server-side read helpers.
//
// Pages read through here so a snapshot pushed to /api/ingest or /api/sync
// immediately changes what the site shows — instead of pages being frozen on
// the seed dataset compiled at build time.
//
// `connection()` marks these routes dynamic so Next re-renders them per
// request. Without it Next treats a module-level Map as static and serves the
// build-time snapshot forever, which is exactly the "bot pushes but the site
// never changes" bug.

import { connection } from "next/server";
import { allPrices, allPlayers, priceFor, playerFor, serverState } from "./store";
import { MARKET, SERVER, REGIONS, ECONOMY } from "./data";
import { PLAYERS, BOARDS, boardValue, type Player, type BoardKey } from "./players";

/** Call before reading live data in any page that must reflect bot pushes. */
export async function live() {
  await connection();
}

export function marketItems() {
  const live = allPrices();
  return live.length ? live : MARKET;
}

export function marketBySlug(slug: string) {
  return priceFor(slug) ?? MARKET.find((m) => m.slug === slug) ?? null;
}

/** Real known players, upgraded with any real stats the collector has sent. */
export function rankedPlayers(): Player[] {
  const known = new Map(PLAYERS.map((p) => [p.name.toLowerCase(), { ...p }]));

  for (const p of allPlayers()) {
    const key = p.name.toLowerCase();
    const prev = known.get(key);
    if (prev) Object.assign(prev, p);
    else
      known.set(key, {
        ...(PLAYERS[0] as Player),
        ...p,
        name: p.name,
        views: 0,
        featured: false,
      });
  }

  return [...known.values()];
}

export function rankedPlayer(name: string): Player | null {
  return (
    rankedPlayers().find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null
  );
}

/**
 * Ranked rows for a board. Boards other than "views" return null values until
 * the collector reports real stats — the UI renders an explicit pending state
 * rather than inventing numbers.
 */
export function boardRows(board: string) {
  const key = board as BoardKey;
  if (!BOARDS.some((b) => b.key === key))
    return { rows: [] as { p: Player; value: number; rank: number }[], pending: true };

  const rows = rankedPlayers()
    .map((p) => ({ p, value: boardValue(p, key) }))
    .filter((r): r is { p: Player; value: number } => r.value !== null)
    .sort((a, b) => b.value - a.value)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return { rows, pending: rows.length === 0 };
}

/** Live snapshot freshness in minutes, or null before the first push. */
export function dataAgeMinutes() {
  return serverState().dataAgeMinutes;
}

export function lastSnapshotAt() {
  return serverState().lastSnapshot;
}

export { SERVER, REGIONS, ECONOMY, BOARDS, PLAYERS, boardValue };
export type { Player, BoardKey };
export { serverState };