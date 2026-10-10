"use client";
import { useEffect, useState } from "react";

/** Live status pulse — the only perpetual motion on the site. */
export function LiveDot({ label }: { label?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="num inline-flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        {on ? (
          <span className="absolute inline-flex h-full w-full animate-ping opacity-60"
            style={{ background: "var(--up)" }} />
        ) : null}
        <span className="relative inline-flex h-1.5 w-1.5" style={{ background: "var(--up)" }} />
      </span>
      {label ? (
        <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--up)" }}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

/** Freshness badge. Turns red past 30 minutes — honest about stale data. */
export function Freshness({ minutes }: { minutes: number }) {
  const stale = minutes > 30;
  return (
    <span className="num text-[10px] uppercase tracking-[0.12em]"
      style={{ color: stale ? "var(--down)" : "var(--muted)" }}>
      {minutes < 1 ? "just now" : `updated ${minutes}m ago`}
    </span>
  );
}