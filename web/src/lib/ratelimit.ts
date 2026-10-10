// Fixed-window in-memory rate limiter. Enough for a single-instance public API
// on Render. Swap for Upstash Redis when running more than one instance.

type Bucket = { count: number; resetAt: number };

const g = globalThis as unknown as {
  __rl?: Map<string, Bucket>;
  __rlSweeper?: ReturnType<typeof setInterval>;
};
const buckets = (g.__rl ??= new Map<string, Bucket>());

// Bound memory: drop expired buckets periodically.
if (!g.__rlSweeper) {
  const t = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }, 60_000);
  if (typeof t.unref === "function") t.unref();
  g.__rlSweeper = t;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  b.count++;
  if (b.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((b.resetAt - now) / 1000),
    };
  }
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

export function clientKey(req: Request, scope: string) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  return `${scope}:${ip}`;
}