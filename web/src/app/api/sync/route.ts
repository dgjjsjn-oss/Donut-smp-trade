import { NextResponse } from "next/server";
import { ingest, db } from "@/lib/store";
import { runSync, syncPlayer } from "@/lib/donutsmp-api";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

// Pulls from the official api.donutsmp.net and writes through the same
// validated ingest path the collector bot uses, so official and bot data are
// filtered by identical rules.
//
// Requires DONUTSMP_API_KEY (create in-game with /api).
// Cron it from Render or an external pinger to keep prices fresh.

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  const rl = rateLimit(`sync:${clientKey(req, "sync")}`, 6, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limit exceeded" }, {
      status: 429, headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const secret = process.env.INGEST_SECRET;
  if (secret) {
    const provided =
      req.headers.get("x-ingest-secret") ??
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
      "";
    if (!safeEqual(provided, secret)) {
      return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
    }
  }

  const url = new URL(req.url);
  const player = url.searchParams.get("player");

  const post = async (payload: unknown) => ingest(payload);

  if (player) {
    try {
      const r = await syncPlayer(process.env.DONUTSMP_API_KEY ?? "", player, post);
      return NextResponse.json({ ok: true, player, accepted: r.accepted });
    } catch (e) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
    }
  }

  const result = await runSync(post, { maxPages: 10 });

  return NextResponse.json(
    { ...result, itemsInStore: db().prices.size, ranAt: new Date().toISOString() },
    { status: result.ok ? 200 : 207, headers: { "Cache-Control": "no-store" } }
  );
}

/** Manual trigger from a browser: GET /api/sync  (same auth as POST). */
export async function GET(req: Request) {
  const secret = process.env.INGEST_SECRET;
  const provided =
    req.headers.get("x-ingest-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  if (!secret || !safeEqual(provided, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }
  return POST(req);
}