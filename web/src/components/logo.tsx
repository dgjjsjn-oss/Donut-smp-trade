// DonutSMP Trader brand mark.
// A donut ring built from the same palette as the site: glaze gold on near-black,
// with a bite taken out — it reads at 16px and scales to the OG image.

export function DonutMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const id = `dm-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="DonutSMP Trader"
    >
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f2c96b" />
          <stop offset="62%" stopColor="#e8b44a" />
          <stop offset="100%" stopColor="#b8862a" />
        </radialGradient>
      </defs>
      {/* dough ring */}
      <circle cx="16" cy="16" r="14" fill="url(#${id})" />
      {/* bite */}
      <path d="M32 4 L32 15 A11 11 0 0 1 23.2 6.6 Z" fill="#0a0b0e" />
      {/* hole */}
      <circle cx="16" cy="16" r="5.2" fill="#0a0b0e" />
      {/* glaze sheen */}
      <path
        d="M6.6 12.2 A10.6 10.6 0 0 1 16 5.4"
        fill="none"
        stroke="rgba(255,255,255,0.34)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* sprinkles */}
      <g fill="rgba(20,16,8,0.42)">
        <rect x="9" y="9" width="2.1" height="1" rx="0.5" transform="rotate(28 10 9.5)" />
        <rect x="20" y="13" width="2.1" height="1" rx="0.5" transform="rotate(-14 21 13.5)" />
        <rect x="12" y="22" width="2.1" height="1" rx="0.5" transform="rotate(-32 13 22.5)" />
        <rect x="6.5" y="18" width="2.1" height="1" rx="0.5" transform="rotate(48 7.5 18.5)" />
      </g>
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <DonutMark size={compact ? 22 : 26} />
      <span className="text-[15px] font-semibold tracking-tight">
        DonutSMP<span style={{ color: "var(--gold)" }}>Trader</span>
      </span>
    </span>
  );
}