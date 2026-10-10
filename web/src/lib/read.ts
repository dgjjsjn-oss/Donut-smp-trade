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
import { MARKET, PLAYERS, SERVER, REGIONS, ECONOMY, BOARDS, boardValue } from "./data";
import type { BoardKey } from "./data";

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

export function rankedPlayers() {
  const live = allPlayers();
  return live.length ? live : PLAYERS;
}

export function rankedPlayer(name: string) {
  return (
    playerFor(name) ??
    PLAYERS.find((p) => p.name.toLowerCase() === name.toLowerCase()) ??
    null
  );
}

export function boardRows(board: string) {
  const key = board as BoardKey;
  if (!BOARDS.some((b) => b.key === key)) return [];
  return rankedPlayers()
    .slice()
    .sort((a, b) => boardValue(b, key) - boardValue(a, key))
    .map((p, i) => ({ p, rank: i + 1, value: boardValue(p, key) }));
}

/** Live snapshot freshness in minutes, or null before the first push. */
export function dataAgeMinutes() {
  const s = serverState();
  return s.dataAgeMinutes;
}

/** Latest snapshot time, used for the freshness badge. */
export function lastSnapshotAt() {
  return serverState().lastSnapshot;
}

export { SERVER, REGIONS, ECONOMY, BOARDS };
export { serverState };