import { NextResponse } from "next/server";
import { allPlayers } from "@/lib/store";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

const BOARDS = {
  money: "money",
  kills: "kills",
  deaths: "deaths",
  shards: "shards",
  playtime: "playtimeDays",
  blocksplaced: "blocksPlaced",
  blocksbroken: "blocksBroken",
  mobskilled: "mobsKilled",
  shopspend: "shopSpend",
  sellearned: "sellEarned",
} as const;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ board: string }> }
) {
  const rl = rateLimit(clientKey(req, "api"), 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limit exceeded" }, {
      status: 429, headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const { board } = await params;
  const field = BOARDS[board as keyof typeof BOARDS] ?? "money";

  const rows = allPlayers()
    .sort((a, b) => b[field] - a[field])
    .map((p, i) => ({ rank: i + 1, name: p.name, value: p[field] }));

  return NextResponse.json(
    { data: rows, meta: { board, count: rows.length } },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}