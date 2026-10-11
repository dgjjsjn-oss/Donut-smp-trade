import Link from "next/link";
import { playerHead } from "@/lib/items";
import { ItemIcon } from "@/components/itemicon";

export function formatMoney(n: number | null): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatNum(n: number | null): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export function pct(n: number | null) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function changeColor(n: number | null) {
  if (n === null || n === undefined) return "var(--dim)";
  return n > 0 ? "var(--up)" : n < 0 ? "var(--down)" : "var(--muted)";
}

export function Delta({ v }: { v: number }) {
  return <span className="num" style={{ color: changeColor(v) }}>{pct(v)}</span>;
}

/** Real Minecraft texture in an inventory slot bevel. */
export function ItemCell({ slug, name, material, sub }: {
  slug: string; name: string; material: string; sub?: string;
}) {
  return (
    <Link href={`/prices/${slug}`} className="group flex min-w-0 items-center gap-2.5">
      <ItemIcon material={material} name={name} size={26} />
      <span className="min-w-0">
        <span className="row-ref block truncate text-[12.5px] font-medium">{name}</span>
        {sub ? <span className="num block text-[10px]" style={{ color: "var(--dim)" }}>{sub}</span> : null}
      </span>
    </Link>
  );
}

export function PlayerCell({ name, sub }: { name: string; sub?: string }) {
  return (
    <Link href={`/players/${name}`} className="group flex min-w-0 items-center gap-2.5">
      <img src={playerHead(name, 40)} alt={`${name} player head`} width={22} height={22} className="px shrink-0" loading="lazy" />
      <span className="min-w-0">
        <span className="row-ref block truncate text-[12.5px] font-medium">{name}</span>
        {sub ? <span className="num block text-[10px]" style={{ color: "var(--dim)" }}>{sub}</span> : null}
      </span>
    </Link>
  );
}

/** Inline sparkline from the item's own real series. */
export function Spark({ values, color, w = 88, h = 22 }: {
  values: number[]; color: string; w?: number; h?: number;
}) {
  if (!values?.length) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const p = 2;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - p * 2) + p;
    const y = h - p - ((v - min) / range) * (h - p * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} aria-hidden style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Terminal-style page header. Asymmetric, bracketed, never centered. */
export function PageHead({ eyebrow, title, lede, meta }: {
  eyebrow?: string; title: string; lede?: string; meta?: React.ReactNode;
}) {
  return (
    <div className="compartment pt-3">
      {eyebrow ? (
        <div className="label mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span style={{ color: "var(--gold)" }}>[ {eyebrow} ]</span>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h-sec">{title}</h1>
          {lede ? (
            <p className="mt-3 max-w-[64ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
              {lede}
            </p>
          ) : null}
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
    </div>
  );
}

/** Framed compartment. No rounded corners, no shadow — 1px structure only. */
export function Panel({ children, className = "", flush = false, title }: {
  children: React.ReactNode; className?: string; flush?: boolean; title?: string;
}) {
  return (
    <section className={className}>
      {title ? (
        <div className="border-b px-4 py-2" style={{ background: "var(--surface)" }}>
          <span className="label">{title}</span>
        </div>
      ) : null}
      <div className="border border-t-0" style={title ? undefined : { borderTop: undefined }}>
        {flush ? children : <div className="p-4">{children}</div>}
      </div>
    </section>
  );
}

export function Stat({ label, value, sub, tone }: {
  label: string; value: React.ReactNode; sub?: string; tone?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="num truncate text-[20px] font-medium leading-none" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      <div className="label mt-2">{label}</div>
      {sub ? <div className="num mt-1 text-[10px]" style={{ color: "var(--dim)" }}>{sub}</div> : null}
    </div>
  );
}

/** Zero-radius meters. Bar height fixed, value mono. */
export function Meter({ label, value, display, max, color, sub }: {
  label: string; value: number; display: string; max: number; color: string; sub?: string;
}) {
  const w = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-[11.5px]" style={{ color: "var(--muted)" }}>{label}</span>
        <span className="num shrink-0 text-[11.5px]">{display}</span>
      </div>
      <div className="h-1 w-full" style={{ background: "var(--line)" }}>
        <div className="h-full" style={{ width: `${w}%`, background: color }} />
      </div>
      {sub ? <div className="num mt-1 text-[9.5px]" style={{ color: "var(--dim)" }}>{sub}</div> : null}
    </div>
  );
}

export function Breadcrumb({ trail }: { trail: [string, string][] }) {
  return (
    <nav className="num mb-5 flex flex-wrap items-center gap-1.5 text-[11px]" style={{ color: "var(--dim)" }}>
      {trail.map(([label, href], i) => (
        <span key={href} className="flex items-center gap-1.5">
          {i > 0 && <span style={{ color: "var(--line2)" }}>///</span>}
          {i === trail.length - 1
            ? <span style={{ color: "var(--muted)" }}>{label}</span>
            : <Link href={href} className="transition-colors hover:text-[var(--ink)]">{label}</Link>}
        </span>
      ))}
    </nav>
  );
}