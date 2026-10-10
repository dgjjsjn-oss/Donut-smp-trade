import Link from "next/link";
import { itemImage, playerHead } from "@/lib/items";

export function formatMoney(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export function pct(n: number) {
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function changeColor(n: number) {
  return n > 0 ? "var(--up)" : n < 0 ? "var(--down)" : "var(--muted)";
}

/** Item row with real rendered texture in a bevelled inventory slot. */
export function ItemCell({
  slug, name, material, sub,
}: { slug: string; name: string; material: string; sub?: string }) {
  return (
    <Link href={`/prices/${slug}`} className="flex items-center gap-3 min-w-0 group">
      <span className="slot grid h-8 w-8 shrink-0 place-items-center overflow-hidden">
        <img
          src={itemImage(material, 64)}
          alt="" width={30} height={30}
          style={{ imageRendering: "pixelated" }}
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium transition-colors group-hover:text-[var(--gold)]">
          {name}
        </span>
        {sub ? <span className="num block text-[11px]" style={{ color: "var(--dim)" }}>{sub}</span> : null}
      </span>
    </Link>
  );
}

export function PlayerCell({ name, sub }: { name: string; sub?: string }) {
  return (
    <Link href={`/players/${name}`} className="flex items-center gap-3 min-w-0 group">
      <img
        src={playerHead(name, 40)} alt="" width={26} height={26}
        className="shrink-0 rounded-[2px]"
        style={{ imageRendering: "pixelated" }}
      />
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium transition-colors group-hover:text-[var(--gold)]">
          {name}
        </span>
        {sub ? <span className="num block text-[11px]" style={{ color: "var(--dim)" }}>{sub}</span> : null}
      </span>
    </Link>
  );
}

/** Inline price sparkline — real shape from the item's own series. */
export function Spark({
  values, color, w = 96, h = 26,
}: { values: number[]; color: string; w?: number; h?: number }) {
  if (!values?.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 3;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - pad * 2) + pad;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${pad},${h} ${pts} ${w - pad},${h}`;
  const id = `sg-${color.replace(/[^a-z0-9]/gi, "")}-${w}`;
  return (
    <svg width={w} height={h} aria-hidden style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Page header — asymmetric, editorial, no centered hero. */
export function PageHead({
  eyebrow, title, lede, meta,
}: { eyebrow?: string; title: string; lede?: string; meta?: React.ReactNode }) {
  return (
    <div className="rule-gold pt-3">
      {eyebrow ? <div className="label mb-3">{eyebrow}</div> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-tight tracking-tight sm:text-[36px]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
              {lede}
            </p>
          ) : null}
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
    </div>
  );
}

/** Framed data panel — the double-bezel shell used site-wide. */
export function Panel({
  children, className = "", flush = false,
}: { children: React.ReactNode; className?: string; flush?: boolean }) {
  return (
    <div
      className={`rounded-lg p-px ${className}`}
      style={{ background: "var(--line)" }}
    >
      <div className="rounded-[7px]" style={{ background: "var(--bg)" }}>
        {flush ? children : <div className="p-5">{children}</div>}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, tone }: {
  label: string; value: React.ReactNode; sub?: string; tone?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="num truncate text-[22px] font-medium leading-none" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      <div className="label mt-2">{label}</div>
      {sub ? <div className="num mt-1 text-[11px]" style={{ color: "var(--dim)" }}>{sub}</div> : null}
    </div>
  );
}

export function Delta({ v }: { v: number }) {
  return (
    <span className="num" style={{ color: changeColor(v) }}>
      {pct(v)}
    </span>
  );
}

export function Breadcrumb({ trail }: { trail: [string, string][] }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px]" style={{ color: "var(--dim)" }}>
      {trail.map(([label, href], i) => (
        <span key={href} className="flex items-center gap-1.5">
          {i > 0 && <span style={{ color: "var(--line2)" }}>/</span>}
          {i === trail.length - 1 ? (
            <span style={{ color: "var(--muted)" }}>{label}</span>
          ) : (
            <Link href={href} className="transition-colors hover:text-[var(--ink)]">{label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}