"use client";
import { useEffect, useState } from "react";

export function LiveDot({ label }: { label?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="relative flex h-2 w-2"
        aria-hidden
      >
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-70"
          style={{
            background: "var(--up)",
            animation: on ? "none" : "pulse 1.6s ease-in-out infinite",
          }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: "var(--up)" }}
        />
      </span>
      {label ? (
        <span className="label" style={{ color: "var(--up)" }}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

export function Freshness({ minutes }: { minutes: number }) {
  const stale = minutes > 30;
  return (
    <span className="num text-xs" style={{ color: stale ? "var(--down)" : "var(--muted)" }}>
      {minutes < 1 ? "just now" : `${minutes}m ago`}
    </span>
  );
}