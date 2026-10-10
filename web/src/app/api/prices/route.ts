import { NextResponse } from "next/server";
import { allPrices, serverState } from "@/lib/store";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

export async function GET(req: Request) {
  const rl = rateLimit(clientKey(req, "api"), 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const url = new URL(req.url);
  const limit = Math.min(500, Number(url.searchParams.get("limit") ?? 100) || 100);
  const sort = url.searchParams.get("sort") ?? "volume24h";

  const rows = allPrices().sort((a, b) => {
    if (sort === "price") return b.price - a.price;
    if (sort === "ch24h") return b.ch24h - a.ch24h;
    if (sort === "listings") return b.listings - a.listings;
    return b.volume24h - a.volume24h;
  });

  return NextResponse.json(
    {
      data: rows.slice(0, limit),
      meta: {
        total: rows.length,
        sort,
        server: serverState(),
        generatedAt: new Date().toISOString(),
      },
    },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}