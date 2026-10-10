import type { MetadataRoute } from "next";
import { ITEMS } from "@/lib/items";
import { PLAYERS, MARKET } from "@/lib/data";

const BASE = process.env.SITE_URL ?? "https://donut-smp-trade.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = [
    "", "/prices", "/auction", "/transactions", "/leaderboards",
    "/players", "/regions", "/stats", "/server-status", "/tools",
    "/api", "/premium", "/about", "/prices/browse",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const boards = ["money","kills","deaths","shards","playtime",
    "blocksplaced","blocksbroken","mobskilled","shopspend","sellearned"]
    .map((b) => ({
      url: `${BASE}/leaderboards/${b}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

  const items = MARKET.map((m) => ({
    url: `${BASE}/prices/${m.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  const players = PLAYERS.map((p) => ({
    url: `${BASE}/players/${p.name}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [...statics, ...boards, ...items, ...players];
}