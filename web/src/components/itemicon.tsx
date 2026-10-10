"use client";
import { useState } from "react";
import { itemImage } from "@/lib/items";

/**
 * Minecraft item icon in an inventory-slot bevel.
 * Self-hosted texture with a text fallback so a missing asset degrades to a
 * readable label instead of a broken-image icon.
 */
export function ItemIcon({
  material,
  name,
  size = 28,
  className = "",
}: {
  material: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`slot grid shrink-0 place-items-center overflow-hidden ${className}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      {failed ? (
        <span
          className="num px-1 text-center text-[8px] uppercase leading-tight"
          style={{ color: "var(--dim)" }}
        >
          {name.slice(0, 6)}
        </span>
      ) : (
        <img
          src={itemImage(material)}
          alt={`${name} item icon`}
          width={size}
          height={size}
          className="px"
          style={{ width: size, height: size }}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

/** Larger framed icon for hero positions. */
export function ItemIconLarge({ material, name, size = 72 }: {
  material: string; name: string; size?: number;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="slot grid shrink-0 place-items-center overflow-hidden"
      style={{ width: size + 20, height: size + 20 }}
    >
      {failed ? (
        <span className="num text-[11px]" style={{ color: "var(--dim)" }}>
          {name}
        </span>
      ) : (
        <img
          src={itemImage(material)}
          alt={`${name} item icon`}
          width={size}
          height={size}
          className="px"
          style={{ width: size, height: size }}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}