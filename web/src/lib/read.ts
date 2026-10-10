// Server-side read helpers.
//
// Pages read through here so a snapshot pushed to /api/ingest or /api/sync
// immediately changes what the site shows — instead of pages being frozen on
// the seed dataset compiled at build time.

import { allPrices, allPlayers, priceFor, playerFor, serverState } from "./store";
import { MARKET, PLAYERS, SERVER, REGIONS, ECONOMY, BOARDS, boardValue } from "./data";
import type { BoardKey } from "./data";

export function marketItems() {
  const live = allPrices();
  // Fall back to the seed catalogue so first boot with zero snapshots still works.
  if (!live.length) return MARKET;
  return live;
}

export function marketBySlug(slug: string) {
  return priceFor(slug) ?? MARKET.find((m) => m.slug === slug) ?? null;
}

export function rankedPlayers() {
  const live = allPlayers();
  return live.length ? live : PLAYERS;
}

export function rankedPlayer(name: string) {
  return playerFor(name) ?? PLAYERS.find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export function boardRows(board: string) {
  const key = board as BoardKey;
  const valid = BOARDS.some((b) => b.key === key);
  if (!valid) return [];
  return rankedPlayers()
    .slice()
    .sort((a, b) => boardValue(b, key) - boardValue(a, key))
    .map((p, i) => ({ p, rank: i + 1, value: boardValue(p, key) }));
}

export { SERVER, REGIONS, ECONOMY, BOARDS };
export { serverState };