import { NextResponse } from "next/server";
import { BOARDS, boardValue } from "@/lib/players";
import { rankedPlayers } from "@/lib/read";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

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
  if (!BOARDS.some((b) => b.key === board)) {
    return NextResponse.json({ error: "unknown board" }, { status: 404 });
  }

  const rows = rankedPlayers()
    .map((p) => ({ name: p.name, value: boardValue(p, board as never) }))
    .filter((r): r is { name: string; value: number } => r.value !== null)
    .sort((a, b) => b.value - a.value)
    .map((r, i) => ({ rank: i + 1, ...r }));

  return NextResponse.json(
    { data: rows, meta: { board, count: rows.length } },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}