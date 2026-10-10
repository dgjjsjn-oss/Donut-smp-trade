import { NextResponse } from "next/server";
import { serverState } from "@/lib/store";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const instant = false;

export async function GET(req: Request) {
  const rl = rateLimit(clientKey(req, "api"), 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limit exceeded" }, {
      status: 429, headers: { "Retry-After": String(rl.retryAfter) },
    });
  }
  return NextResponse.json(
    { data: serverState(), generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}