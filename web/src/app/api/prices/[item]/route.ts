import { NextResponse } from "next/server";
import { priceFor } from "@/lib/store";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ item: string }> }
) {
  const rl = rateLimit(clientKey(req, "api"), 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limit exceeded" }, {
      status: 429, headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const { item } = await params;
  const row = priceFor(item);
  if (!row) return NextResponse.json({ error: "unknown item" }, { status: 404 });

  return NextResponse.json(
    { data: row, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}