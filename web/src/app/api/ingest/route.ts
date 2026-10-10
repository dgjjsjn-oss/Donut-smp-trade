import { NextResponse } from "next/server";
import { ingest } from "@/lib/store";
import { rateLimit } from "@/lib/ratelimit";

export const instant = false;

// Collector -> site write endpoint.
// Auth: shared secret header, compared in constant time.
// If INGEST_SECRET is unset the endpoint refuses all writes rather than
// running wide open on a public deployment.

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const rl = rateLimit(`ingest:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "ingest disabled: INGEST_SECRET not configured" },
      { status: 503 }
    );
  }

  const provided =
    req.headers.get("x-ingest-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  const result = ingest(payload);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}