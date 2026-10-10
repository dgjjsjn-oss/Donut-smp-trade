// Real voxel scenery built from actual Minecraft block textures.
// Everything here uses files in /public/items — the same textures the game uses,
// so the scene reads as Minecraft without importing a single stock photo.

const B = (n: string) => `/items/${n}.png`;

/** Tiled block ground plane. */
export function BlockGround({
  top = "grass_block",
  side = "dirt",
  depth = 3,
  height = 120,
}: {
  top?: string;
  side?: string;
  depth?: number;
  height?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${B(top)})`,
          backgroundSize: "48px 48px",
          imageRendering: "pixelated",
          opacity: 0.5,
        }}
      />
      {Array.from({ length: depth }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={{
            bottom: i * 14,
            height: 16,
            backgroundImage: `url(${B(side)})`,
            backgroundSize: "48px 16px",
            imageRendering: "pixelated",
            opacity: 0.55 - i * 0.14,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, var(--bg) 0%, transparent 38%, transparent 62%, var(--bg) 100%)",
        }}
      />
    </div>
  );
}

/** Isometric voxel stack — CSS 3D, real block textures on every face. */
export function VoxelStack({
  blocks,
  size = 56,
  className = "",
}: {
  blocks: string[];
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, perspective: 700, transformStyle: "preserve-3d" }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          transform: "rotateX(28deg) rotateZ(45deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {blocks.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: size,
              height: size,
              transform: `translateZ(${(i - (blocks.length - 1) / 2) * (size / 1.4)}px)`,
              backgroundImage: `url(${B(b)})`,
              backgroundSize: "100% 100%",
              imageRendering: "pixelated",
              filter: "brightness(0.62)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Ore-vein speckle overlay — real ore textures, subtle. */
export function OreVeins() {
  const ores = ["diamond", "netherite_ingot", "gold_ingot", "iron_ingot", "emerald", "coal"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ores.map((o, i) => (
        <img
          key={o}
          src={B(o)}
          alt=""
          className="px absolute opacity-[0.07]"
          style={{
            width: 34 + i * 6,
            height: 34 + i * 6,
            left: `${7 + i * 15}%`,
            top: `${12 + (i % 3) * 26}%`,
            transform: `rotate(${i * 17}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Pixel sun/sky glow behind the hero — reads as the game's own sky. */
export function SkyGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(900px 380px at 78% -6%, rgba(232,180,74,0.16), transparent 62%)," +
          "radial-gradient(700px 320px at 12% 4%, rgba(91,141,239,0.11), transparent 60%)",
      }}
    />
  );
}