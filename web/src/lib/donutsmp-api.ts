// Official DonutSMP API client.
//
// Uses api.donutsmp.net (the official public API). Free, but requires a key
// created in-game with /api. Limit: 250 requests/min per key.
//
// Every response is mapped into the same shape the ingest endpoint accepts, so
// official data and bot-collected data land in exactly the same store and are
// validated by exactly the same rules.

const BASE = "https://api.donutsmp.net";

export type SyncResult = {
  ok: boolean;
  source: "official";
  pulled: Record<string, number>;
  errors: string[];
};

async function get<T>(path: string, key: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (res.status === 401 || res.status === 403)
    throw new Error(`auth rejected (${res.status}) — check DONUTSMP_API_KEY`);
  if (res.status === 429) throw new Error("rate limited — slow down");
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);

  return (await res.json()) as T;
}

const LEADERBOARDS: [string, string][] = [
  ["money", "money"],
  ["kills", "kills"],
  ["deaths", "deaths"],
  ["shards", "shards"],
  ["playtime", "playtime"],
  ["placedblocks", "blocksplaced"],
  ["brokenblocks", "blocksbroken"],
  ["mobskilled", "mobskilled"],
  ["shop", "shopspend"],
  ["sell", "sellearned"],
];

/** Auction listings across pages, reduced to the lowest price per item. */
export async function syncAuction(
  key: string,
  post: (payload: unknown) => Promise<unknown>,
  maxPages = 8
) {
  const lowest = new Map<
    string,
    { item: string; price: number; listings: number; name?: string }
  >();

  for (let page = 1; page <= maxPages; page++) {
    const body = await get<{
      status: string;
      result?: { items?: { item: any; price: number; seller: any }[] } | any[];
    }>(`/v1/auction/list/${page}`, key);

    const items = extractItems(body);
    if (!items.length) break;

    for (const raw of items) {
      const name = readItemName(raw.item);
      const price = toNumber(raw.price);
      if (!name || price === null || price <= 0) continue;

      const prev = lowest.get(name);
      if (!prev || price < prev.price) {
        lowest.set(name, {
          item: name,
          price,
          listings: 1,
          name: titleize(name),
        });
      } else {
        prev.listings++;
      }
    }
  }

  const items = [...lowest.values()].map((v) => ({
    item: v.item,
    name: v.name,
    material: v.item,
    price: v.price,
    listings: v.listings,
  }));

  const res = (await post({ type: "prices", items })) as { accepted?: number };
  return { accepted: res?.accepted ?? 0, distinct: items.length };
}

/** All ten leaderboards in one pass. */
export async function syncLeaderboards(
  key: string,
  post: (payload: unknown) => Promise<unknown>
) {
  let accepted = 0;

  for (const [endpoint, field] of LEADERBOARDS) {
    try {
      const body = await get<{ status: string; result?: any }>(
        `/v1/leaderboards/${endpoint}/1`,
        key
      );
      const rows = normaliseLeaderboard(body?.result);
      if (!rows.length) continue;

      const res = (await post({
        type: "players",
        players: rows.map((r) => ({
          name: r.name,
          money: 0,
          [field]: r.value,
        })),
      })) as { accepted?: number };
      accepted += res?.accepted ?? 0;
    } catch {
      // One board failing must not abort the whole sync.
    }
  }

  return { accepted };
}

/** Full stat line for one account. */
export async function syncPlayer(
  key: string,
  username: string,
  post: (payload: unknown) => Promise<unknown>
) {
  const body = await get<{ status: string; result?: any }>(
    `/v1/stats/${encodeURIComponent(username)}`,
    key
  );
  const r = body?.result ?? {};
  if (!r || typeof r !== "object") return { accepted: 0 };

  const res = (await post({
    type: "players",
    players: [
      {
        name: username,
        money: toNumber(r.money ?? r.balance ?? r.bank) ?? 0,
        kills: toNumber(r.kills) ?? 0,
        deaths: toNumber(r.deaths) ?? 0,
        shards: toNumber(r.shards) ?? 0,
        playtimeDays: Math.round((toNumber(r.playtime ?? r.played) ?? 0) / 86400),
        blocksPlaced: toNumber(r.placedblocks ?? r.blocksPlaced) ?? 0,
        blocksBroken: toNumber(r.brokenblocks ?? r.blocksBroken) ?? 0,
        mobsKilled: toNumber(r.mobskilled ?? r.mobsKilled) ?? 0,
        shopSpend: toNumber(r.shop ?? r.shopSpend) ?? 0,
        sellEarned: toNumber(r.sell ?? r.sellEarned) ?? 0,
      },
    ],
  })) as { accepted?: number };

  return { accepted: res?.accepted ?? 0 };
}

export async function runSync(
  post: (payload: unknown) => Promise<unknown>,
  opts: { maxPages?: number } = {}
): Promise<SyncResult> {
  const key = process.env.DONUTSMP_API_KEY;
  if (!key) return { ok: false, source: "official", pulled: {}, errors: ["DONUTSMP_API_KEY not set"] };

  const errors: string[] = [];
  const pulled: Record<string, number> = {};

  try {
    const a = await syncAuction(key, post, opts.maxPages ?? 8);
    pulled.auctionItems = a.distinct;
    pulled.auctionAccepted = a.accepted;
  } catch (e) {
    errors.push(`auction: ${(e as Error).message}`);
  }

  try {
    const l = await syncLeaderboards(key, post);
    pulled.leaderboardAccepted = l.accepted;
  } catch (e) {
    errors.push(`leaderboards: ${(e as Error).message}`);
  }

  return { ok: errors.length === 0, source: "official", pulled, errors };
}

/* ── response shape handling (the API nests results differently per call) ── */

function extractItems(body: any): any[] {
  const r = body?.result ?? body;
  if (Array.isArray(r)) return r;
  if (Array.isArray(r?.items)) return r.items;
  if (Array.isArray(r?.data)) return r.data;
  if (r?.items && typeof r.items === "object") return Object.values(r.items);
  return [];
}

function normaliseLeaderboard(result: any): { name: string; value: number }[] {
  const rows = Array.isArray(result) ? result : result?.items ?? result?.data ?? [];
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r: any) => {
      if (typeof r === "string") return null;
      const name =
        r?.username ?? r?.name ?? r?.player?.username ?? r?.player?.name ?? null;
      const value = toNumber(r?.value ?? r?.amount ?? r?.money ?? r?.kills ?? r?.score);
      if (!name || value === null) return null;
      return { name: String(name), value };
    })
    .filter(Boolean) as { name: string; value: number }[];
}

function readItemName(item: any): string | null {
  if (!item) return null;
  if (typeof item === "string") return item.toLowerCase().replace(/[^a-z0-9_]/g, "");
  const raw =
    item?.identifier ?? item?.material ?? item?.type ?? item?.name ?? item?.key ?? null;
  if (!raw || typeof raw !== "string") return null;
  return raw.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string") return null;
  // Handles "1,234", "$1.2K", "3.4M"
  const s = v.replace(/[$,]/g, "").trim();
  const m = s.match(/^(-?[\d.]+)\s*([KMB])?$/i);
  if (!m) return null;
  const base = Number(m[1]);
  if (!Number.isFinite(base)) return null;
  const mult = m[2]?.toUpperCase() === "K" ? 1e3 : m[2]?.toUpperCase() === "M" ? 1e6 : m[2]?.toUpperCase() === "B" ? 1e9 : 1;
  return base * mult;
}

function titleize(s: string) {
  return s.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}