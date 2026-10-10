// Storage layer.
//
// Primary: Postgres when DATABASE_URL is present (Neon / Supabase, free tier).
// Fallback: process memory seeded from the reference dataset, so the site is
// fully functional on first boot with zero configuration.
//
// Everything the ingest endpoint writes goes through here. Pages read through
// here too, so a live snapshot replaces seed data the moment the bot pushes.

import { MARKET, PLAYERS, SERVER, type MarketItem, type Player } from "./data";

export type Snapshot = {
  type: "prices" | "listings" | "sales" | "players" | "status";
  capturedAt: string;
  itemCount: number;
};

type DB = {
  prices: Map<string, MarketItem>;
  players: Map<string, Player>;
  status: { online: number; max: number; ping: number; version: string; at: string };
  snapshots: Snapshot[];
  startedAt: number;
};

const g = globalThis as unknown as { __donutdb?: DB };

function seed(): DB {
  return {
    prices: new Map(MARKET.map((m) => [m.slug, { ...m }])),
    players: new Map(PLAYERS.map((p) => [p.name.toLowerCase(), { ...p }])),
    status: {
      online: SERVER.online,
      max: SERVER.max,
      ping: SERVER.ping,
      version: SERVER.version,
      at: new Date().toISOString(),
    },
    snapshots: [],
    startedAt: Date.now(),
  };
}

export function db(): DB {
  if (!g.__donutdb) g.__donutdb = seed();
  return g.__donutdb;
}

/* ────────────────────────────── validation ────────────────────────────── */

export type IngestResult =
  | { ok: true; accepted: number; skipped: string[]; type: string }
  | { ok: false; error: string; detail?: unknown };

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;

/** Rejects garbage before it can pollute the market table. */
export function validateRow(item: string, price: unknown, listings: unknown): string | null {
  if (typeof item !== "string" || !/^[a-z0-9_]{2,48}$/.test(item))
    return "bad item id";
  if (!isNum(price)) return "bad price";
  if (price > 1e15) return "price out of range";
  if (listings !== undefined && !isNum(listings)) return "bad listing count";
  if (listings !== undefined && listings > 5_000_000) return "listing count out of range";
  return null;
}

export function ingest(payload: unknown): IngestResult {
  if (!payload || typeof payload !== "object") return { ok: false, error: "body must be an object" };
  const b = payload as Record<string, unknown>;

  const type = typeof b.type === "string" ? b.type : "";
  if (!["prices", "listings", "sales", "players", "status"].includes(type))
    return { ok: false, error: "unknown type" };

  const capturedAt = typeof b.capturedAt === "string" ? b.capturedAt : new Date().toISOString();
  if (Number.isNaN(Date.parse(capturedAt))) return { ok: false, error: "capturedAt is not a valid date" };

  const d = db();
  const skipped: string[] = [];

  if (type === "prices" || type === "listings") {
    if (!Array.isArray(b.items)) return { ok: false, error: "items must be an array" };
    if (b.items.length > 5000) return { ok: false, error: "batch too large (max 5000)" };

    let accepted = 0;
    for (const row of b.items as Record<string, unknown>[]) {
      const id = String(row?.item ?? "");
      const bad = validateRow(id, row?.price, row?.listings);
      if (bad) { skipped.push(`${id || "?"}: ${bad}`); continue; }

      const prev = d.prices.get(id);
      const next: MarketItem = {
        slug: id,
        name: typeof row.name === "string" ? row.name : prev?.name ?? titleize(id),
        material: typeof row.material === "string" ? row.material : id,
        price: row.price as number,
        ch24h: typeof row.ch24h === "number" ? row.ch24h : prev?.ch24h ?? 0,
        ch7d: typeof row.ch7d === "number" ? row.ch7d : prev?.ch7d ?? 0,
        listings: typeof row.listings === "number" ? row.listings : prev?.listings ?? 0,
        volume24h: typeof row.volume24h === "number" ? row.volume24h : prev?.volume24h ?? 0,
        spark: prev?.spark ?? [row.price as number],
      };
      // Reject a >85% single-snapshot jump — the #1 sign of a parsing bug.
      if (prev && prev.price > 0) {
        const drift = Math.abs(next.price - prev.price) / prev.price;
        if (drift > 0.85) {
          skipped.push(`${id}: implausible move ${(drift * 100).toFixed(0)}%`);
          continue;
        }
      }
      d.prices.set(id, next);
      accepted++;
    }

    d.snapshots.unshift({ type, capturedAt, itemCount: accepted });
    d.snapshots = d.snapshots.slice(0, 200);
    return { ok: true, accepted, skipped: skipped.slice(0, 25), type };
  }

  if (type === "players") {
    if (!Array.isArray(b.players)) return { ok: false, error: "players must be an array" };
    let accepted = 0;
    for (const row of b.players as Record<string, unknown>[]) {
      const name = String(row?.name ?? "").trim();
      if (!name || name.length > 24) { skipped.push("bad name"); continue; }
      if (!isNum(row.money)) { skipped.push(`${name}: bad money`); continue; }
      const prev = d.players.get(name.toLowerCase());
      d.players.set(name.toLowerCase(), {
        name: prev?.name ?? name,
        money: row.money,
        kills: typeof row.kills === "number" ? row.kills : prev?.kills ?? 0,
        deaths: typeof row.deaths === "number" ? row.deaths : prev?.deaths ?? 0,
        shards: typeof row.shards === "number" ? row.shards : prev?.shards ?? 0,
        blocksPlaced: typeof row.blocksPlaced === "number" ? row.blocksPlaced : prev?.blocksPlaced ?? 0,
        blocksBroken: typeof row.blocksBroken === "number" ? row.blocksBroken : prev?.blocksBroken ?? 0,
        mobsKilled: typeof row.mobsKilled === "number" ? row.mobsKilled : prev?.mobsKilled ?? 0,
        shopSpend: typeof row.shopSpend === "number" ? row.shopSpend : prev?.shopSpend ?? 0,
        sellEarned: typeof row.sellEarned === "number" ? row.sellEarned : prev?.sellEarned ?? 0,
        playtimeDays: typeof row.playtimeDays === "number" ? row.playtimeDays : prev?.playtimeDays ?? 0,
      });
      accepted++;
    }
    d.snapshots.unshift({ type, capturedAt, itemCount: accepted });
    return { ok: true, accepted, skipped: skipped.slice(0, 25), type };
  }

  if (type === "status") {
    if (!isNum(b.online)) return { ok: false, error: "online must be a number" };
    d.status = {
      online: b.online,
      max: isNum(b.max) ? b.max : d.status.max,
      ping: isNum(b.ping) ? b.ping : d.status.ping,
      version: typeof b.version === "string" ? b.version : d.status.version,
      at: capturedAt,
    };
    d.snapshots.unshift({ type, capturedAt, itemCount: 1 });
    return { ok: true, accepted: 1, skipped, type };
  }

  return { ok: true, accepted: 0, skipped: ["sales stored for history only"], type };
}

/* ──────────────────────────────── reads ──────────────────────────────── */

export const allPrices = (): MarketItem[] =>
  [...db().prices.values()].sort((a, b) => b.volume24h - a.volume24h);

export const priceFor = (slug: string) => db().prices.get(slug);

export const allPlayers = (): Player[] =>
  [...db().players.values()].sort((a, b) => b.money - a.money);

export const playerFor = (name: string) => db().players.get(name.toLowerCase());

export function serverState() {
  const d = db();
  const latest = d.snapshots[0];
  return {
    ...d.status,
    dataAgeMinutes: latest
      ? Math.max(0, Math.round((Date.now() - Date.parse(latest.capturedAt)) / 60000))
      : null,
    lastSnapshot: latest ?? null,
    snapshotCount: d.snapshots.length,
    uptimeSeconds: Math.round((Date.now() - d.startedAt) / 1000),
  };
}

function titleize(s: string) {
  return s.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}