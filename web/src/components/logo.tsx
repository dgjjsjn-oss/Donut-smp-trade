// DonutSMP Trader brand mark.
// Donut ring in glaze gold on near-black. Reads at 16px, scales to OG image.

export function DonutMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  const id = `dm${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}
      role="img" aria-label="DonutSMP Trader">
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f2c96b" />
          <stop offset="62%" stopColor="#e8b44a" />
          <stop offset="100%" stopColor="#b8862a" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill={`url(#${id})`} />
      <path d="M32 3 L32 15 A11 11 0 0 1 22.9 6.2 Z" fill="#0a0b0e" />
      <circle cx="16" cy="16" r="5.2" fill="#0a0b0e" />
      <path d="M6.6 12.2 A10.6 10.6 0 0 1 16 5.4" fill="none"
        stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round" />
      <g fill="rgba(20,16,8,0.45)">
        <rect x="9" y="9" width="2.1" height="1" rx="0.5" transform="rotate(28 10 9.5)" />
        <rect x="20" y="13" width="2.1" height="1" rx="0.5" transform="rotate(-14 21 13.5)" />
        <rect x="12" y="22" width="2.1" height="1" rx="0.5" transform="rotate(-32 13 22.5)" />
      </g>
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <DonutMark size={compact ? 20 : 24} />
      <span className="text-[13px] font-semibold tracking-tight">
        DonutSMP<span style={{ color: "var(--gold)" }}>Trader</span>
      </span>
    </span>
  );
}