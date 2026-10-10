import { NextResponse } from "next/server";
import { playerFor } from "@/lib/store";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const rl = rateLimit(clientKey(req, "api"), 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limit exceeded" }, {
      status: 429, headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const { name } = await params;
  const p = playerFor(name);
  if (!p) return NextResponse.json({ error: "unknown player" }, { status: 404 });

  return NextResponse.json(
    { data: p, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}