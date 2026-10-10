"use client";
import { useEffect, useState } from "react";

/** Live status — a pill, because it reports state. Shape says "read me". */
export function LiveDot({ label }: { label?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="badge badge-live">
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        {on ? (
          <span
            className="absolute inline-flex h-full w-full animate-ping opacity-60"
            style={{ background: "var(--up)" }}
          />
        ) : null}
        <span className="relative inline-flex h-1.5 w-1.5" style={{ background: "var(--up)" }} />
      </span>
      {label ?? "Live"}
    </span>
  );
}

/** Freshness pill. Turns red past 30 minutes — honest about stale data. */
export function Freshness({ minutes }: { minutes: number }) {
  const stale = minutes > 30;
  return (
    <span className={stale ? "badge badge-stale" : "badge"} style={
      stale ? undefined : { color: "var(--dim)", border: "1px solid var(--line)" }
    }>
      {minutes < 1 ? "just now" : `${minutes}m ago`}
    </span>
  );
}