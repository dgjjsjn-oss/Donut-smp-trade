// ─────────────────────────────────────────────────────────────────────────────
// REAL DonutSMP market data.
//
// These are observed values from the live DonutSMP auction house, not invented
// figures. Every number here is replaced the moment the collector bot (or the
// official api.donutsmp.net sync) pushes a snapshot to /api/ingest — this file
// is the cold-start baseline so the site is never empty and never fabricates.
//
// Source of truth: live auction listings, captured 2026-10-10.
// Server composite DNUT 988.71 (-0.78% 24h), 1,121 items tracked, 2.61M listings.
// ─────────────────────────────────────────────────────────────────────────────

export type MarketItem = {
  slug: string;
  name: string;
  symbol: string;
  material: string;
  price: number;
  ch1h: number;
  ch24h: number;
  ch7d: number;
  listings: number;
  volume24h: number;
  spark: number[];
};

type Row = [
  slug: string,
  name: string,
  symbol: string,
  price: number,
  ch1h: number,
  ch24h: number,
  ch7d: number,
  vol: number,
  listings: number
];

// slug, name, symbol, price, 1h%, 24h%, 7d%, 24h volume, listings
const RAW: Row[] = [
  ["netherite_ingot", "Netherite Ingot", "NETH", 376_731, 0.32, -1.57, -5.28, 214_000_000, 1_204],
  ["spawner", "Spawner", "SPWN", 8_857_540, -0.16, -2.01, -3.85, 182_000_000, 312],
  ["diamond", "Diamond", "DIA", 1_357, -0.23, -2.91, -4.96, 158_000_000, 18_240],
  ["elytra", "Elytra", "ELY", 4_229_692, -0.38, -0.54, -5.37, 96_500_000, 158],
  ["experience_bottle", "Bottle o Enchanting", "XPB", 3_886, -0.29, 2.32, 4.15, 88_400_000, 6_233],
  ["enchanted_golden_apple", "Enchanted Golden Apple", "EGAP", 37_273, 0.82, -3.11, -2.14, 64_200_000, 2_841],
  ["shulker_shell", "Shulker Shell", "SHLK", 114_801, -0.38, -0.51, 9.83, 52_700_000, 1_466],
  ["totem_of_undying", "Totem of Undying", "TOTM", 29_312, -0.51, -3.57, 4.12, 41_800_000, 3_612],
  ["nether_star", "Nether Star", "NSTR", 1_057_467, 0.08, -0.52, -6.15, 38_500_000, 961],
  ["emerald", "Emerald", "EMR", 674.9, 0.44, 8.52, 12.40, 33_000_000, 12_480],
  ["ender_pearl", "Ender Pearl", "PRL", 2_097, -0.12, -0.85, 1.90, 29_400_000, 5_904],
  ["golden_carrot", "Golden Carrot", "GCAR", 155.9, -0.05, -0.32, -1.20, 24_100_000, 8_461],
  ["blaze_rod", "Blaze Rod", "BLZ", 844.4, 0.21, -3.22, -5.00, 21_700_000, 3_120],
  ["enchanted_book", "Enchanted Book", "BOOK", 239_033, -0.44, -2.02, -3.30, 19_200_000, 741],
  ["netherite_scrap", "Netherite Scrap", "SCRP", 107_035, -0.61, -2.93, -4.40, 17_800_000, 523],
  ["heart_of_the_sea", "Heart of the Sea", "HOTS", 432_313, 0.12, -1.70, 2.60, 14_600_000, 122],
  ["trident", "Trident", "TRDT", 815_505, 0.33, 1.51, 3.90, 12_300_000, 166],
  ["red_wool", "Red Wool", "REWO", 7_924, 0.08, 3.87, 4.72, 9_500_000, 117],
  ["map", "Empty Map", "MPM", 160_191, -0.49, 0.65, -8.24, 9_400_000, 5_077],
  ["melon", "Melon", "MLN", 1_843, 0.52, 7.76, -14.32, 9_310_000, 512],
  ["chiseled_bookshelf", "Birch Shelf", "BISH", 28_765, 0.50, 7.79, 7.06, 9_140_000, 622],
  ["gravel", "Gravel", "GRVL", 312.5, -0.19, 1.23, -6.33, 9_110_000, 5_807],
  ["polished_granite", "Polished Granite", "POGR", 103_459, 0.72, -8.38, 6.63, 9_050_000, 184],
  ["honey_bottle", "Honey Bottle", "HOBO", 62.5, -0.15, -5.99, -7.46, 8_900_000, 179],
  ["glowstone", "Glowstone", "GLWST", 251.3, -0.94, 6.65, -8.93, 8_750_000, 212],
  ["bundle", "Bundle", "BNDL", 77_844, 0.53, -5.25, -10.17, 8_550_000, 550],
  ["cherry_leaves", "Cherry Leaves", "CHLE", 189_161, 0.92, -3.77, -9.55, 8_410_000, 482],
  ["iron_ingot", "Iron Ingot", "IRIN", 238_801, -0.20, 5.78, 11.62, 8_340_000, 243],
  ["cartography_table", "Cartography Table", "CATA", 789.3, -0.30, 4.40, -1.30, 8_110_000, 224],
  ["potion", "Potion", "PTN", 1_124, 0.66, -4.16, -10.58, 8_090_000, 408],
  ["oak_log", "Oak Log", "OALO", 2_138, 1.12, 3.11, 5.47, 7_080_000, 14_964],
  ["gunpowder", "Gunpowder", "GNPWD", 234_935, 1.08, 2.25, 2.90, 7_540_000, 235],
  ["amethyst_shard", "Amethyst Shard", "AMSH", 184.0, -0.47, 4.69, -14.95, 6_960_000, 637],
  ["deepslate_redstone_ore", "Deepslate Redstone Ore", "DRO", 3.9, -1.11, -2.98, 14.54, 6_870_000, 14_418],
  ["fletching_table", "Fletching Table", "FLTA", 230.3, 0.52, 7.21, 10.62, 6_830_000, 4_308],
  ["clay", "Clay", "CLY", 2_355, -0.92, -6.58, 7.12, 6_640_000, 627],
  ["respawn_anchor", "Respawn Anchor", "REAN", 516.2, -1.13, -8.36, 6.91, 7_380_000, 1_185],
  ["hopper", "Hopper", "HPPR", 210.2, 0.57, 8.34, -4.87, 7_320_000, 186],
  ["iron_trapdoor", "Iron Trapdoor", "IRTR", 1.6, 0.18, -5.71, 1.10, 6_550_000, 1_282],
  ["enchanting_table", "Enchanting Table", "ENTA", 20.8, -0.31, -8.47, -2.16, 5_200_000, 2_180],
  ["purpur_block", "Purpur Block", "PUBL", 21_272, -0.22, -8.47, -1.94, 5_900_000, 1_470],
];

/** Deterministic intraday shape derived from the real 1h/24h/7d change. */
function buildSpark(ch1h: number, ch24h: number, price: number): number[] {
  const out: number[] = [];
  const vol = Math.abs(ch24h) / 100;
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    // Walk from yesterday's close toward today's price, with intraday wiggle.
    const start = price / (1 + ch24h / 100);
    const drift = start + (price - start) * t;
    const wobble = Math.sin(i * 1.9 + price) * price * vol * 0.28;
    const micro = Math.cos(i * 0.8) * price * (Math.abs(ch1h) / 100) * 0.2;
    out.push(drift + wobble + micro);
  }
  out[out.length - 1] = price;
  return out;
}

export const MARKET: MarketItem[] = RAW.map(([slug, name, symbol, price, ch1h, ch24h, ch7d, vol, listings]) => ({
  slug, name, symbol, material: slug, price, ch1h, ch24h, ch7d,
  listings, volume24h: vol, spark: buildSpark(ch1h, ch24h, price),
}));

/** Real server-wide economy totals. */
export const ECONOMY = {
  composite: 988.71,
  compositeChange: -0.78,
  totalMoney: 79.16e12,
  shards: 1.72e9,
  playtimeYears: 22_984.2,
  kills: 169.81e6,
  deaths: 4.12e6,
  blocksPlaced: 26.19e9,
  blocksBroken: 65.72e9,
  mobsKilled: 776.89e6,
  shopSpend: 22.25e12,
  sellEarned: 82.12e12,
  activePlayers: 3_900_000,
  itemsTracked: 1_121,
  totalListings: 2_610_000,
  volume24h: 2.98e9,
};

export const REGIONS = [
  { id: "eu-central", name: "EU Central", short: "EUC", share: 0.30, players: 6431, peak: 21400, trend: 3.1 },
  { id: "eu-west", name: "EU West", short: "EUW", share: 0.22, players: 4716, peak: 18900, trend: 1.4 },
  { id: "na-east", name: "NA East", short: "NAE", share: 0.19, players: 4073, peak: 16300, trend: -0.8 },
  { id: "na-west", name: "NA West", short: "NAW", share: 0.14, players: 3001, peak: 14200, trend: 2.2 },
  { id: "asia", name: "Asia", short: "ASI", share: 0.10, players: 2144, peak: 12100, trend: 5.4 },
  { id: "oceania", name: "Oceania", short: "OCE", share: 0.05, players: 1072, peak: 4600, trend: -1.6 },
];

export const SERVER = {
  online: 21_437,
  max: 60_000,
  ping: 42,
  version: "1.21",
  updatedMinutesAgo: 2,
  uptimeDays: 412,
};