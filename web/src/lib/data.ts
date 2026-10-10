// Server-wide aggregates and leaderboard standings.
// Replaced by collector snapshots the moment the bot POSTs to /api/ingest.

export type MarketItem = {
  slug: string;
  name: string;
  material: string;
  price: number;
  ch24h: number;
  ch7d: number;
  listings: number;
  volume24h: number;
  spark: number[];
};

export const MARKET: MarketItem[] = [
  { slug: "netherite_ingot", name: "Netherite Ingot", material: "netherite_ingot", price: 376731, ch24h: -1.57, ch7d: -5.28, listings: 1204, volume24h: 214_000_000, spark: [402,398,391,395,388,384,381,379,376,378,375,374,376,375] },
  { slug: "diamond", name: "Diamond", material: "diamond", price: 1357, ch24h: -2.91, ch7d: -4.96, listings: 18_240, volume24h: 158_000_000, spark: [1420,1408,1398,1402,1385,1372,1368,1361,1355,1360,1354,1352,1356,1357] },
  { slug: "elytra", name: "Elytra", material: "elytra", price: 3_100_000_000, ch24h: 1.24, ch7d: 4.02, listings: 46, volume24h: 71_000_000, spark: [2.94,2.96,2.95,2.98,3.0,2.99,3.02,3.04,3.03,3.06,3.07,3.08,3.09,3.10] },
  { slug: "netherite_scrap", name: "Netherite Scrap", material: "netherite_scrap", price: 118_400, ch24h: -0.82, ch7d: -2.11, listings: 890, volume24h: 96_000_000, spark: [121,120,119,119,118,118,119,118,117,118,118,118.4,118.4,118.4] },
  { slug: "enchanted_golden_apple", name: "Enchanted Golden Apple", material: "enchanted_golden_apple", price: 862_000, ch24h: 19.8, ch7d: 8.4, listings: 174, volume24h: 41_000_000, spark: [742,720,745,768,790,812,798,824,836,840,852,858,861,862] },
  { slug: "netherite_block", name: "Netherite Block", material: "netherite_block", price: 3_400_000, ch24h: -1.1, ch7d: -4.2, listings: 132, volume24h: 38_000_000, spark: [3.55,3.52,3.49,3.48,3.45,3.44,3.43,3.42,3.41,3.42,3.41,3.40,3.40,3.40] },
  { slug: "emerald", name: "Emerald", material: "emerald", price: 4180, ch24h: -0.8, ch7d: -2.2, listings: 5_400, volume24h: 44_000_000, spark: [4280,4270,4262,4255,4240,4232,4225,4218,4205,4198,4192,4186,4184,4180] },
  { slug: "iron_ingot", name: "Iron Ingot", material: "iron_ingot", price: 2140, ch24h: 0.4, ch7d: 1.1, listings: 12_800, volume24h: 62_000_000, spark: [2118,2122,2125,2130,2128,2132,2135,2134,2138,2136,2139,2140,2141,2140] },
  { slug: "gold_ingot", name: "Gold Ingot", material: "gold_ingot", price: 6920, ch24h: -0.6, ch7d: -1.4, listings: 8_900, volume24h: 51_000_000, spark: [7010,7002,6994,6988,6972,6960,6955,6950,6942,6938,6932,6926,6922,6920] },
  { slug: "obsidian", name: "Obsidian", material: "obsidian", price: 42_700, ch24h: -4.7, ch7d: -6.3, listings: 3_100, volume24h: 33_000_000, spark: [45.2,44.9,44.5,44.1,43.8,43.6,43.4,43.2,43.0,42.9,42.8,42.8,42.7,42.7] },
  { slug: "golden_carrot", name: "Golden Carrot", material: "golden_carrot", price: 24_800, ch24h: 2.8, ch7d: 5.4, listings: 1_240, volume24h: 29_000_000, spark: [23.9,24.0,24.1,24.1,24.2,24.3,24.4,24.4,24.5,24.6,24.6,24.7,24.8,24.8] },
  { slug: "ender_pearl", name: "Ender Pearl", material: "ender_pearl", price: 12_400, ch24h: 2.2, ch7d: -1.1, listings: 3_100, volume24h: 26_000_000, spark: [12.1,12.2,12.2,12.3,12.3,12.4,12.3,12.4,12.4,12.3,12.4,12.4,12.4,12.4] },
  { slug: "blaze_rod", name: "Blaze Rod", material: "blaze_rod", price: 92_300, ch24h: 3.4, ch7d: 6.1, listings: 940, volume24h: 21_000_000, spark: [88.5,88.8,89.1,89.4,89.6,90.0,90.4,90.8,91.1,91.4,91.6,92.0,92.1,92.3] },
  { slug: "totem_of_undying", name: "Totem of Undying", material: "totem_of_undying", price: 2_450_000, ch24h: 3.4, ch7d: 1.2, listings: 88, volume24h: 22_000_000, spark: [2.38,2.39,2.40,2.41,2.41,2.42,2.43,2.43,2.44,2.44,2.45,2.45,2.45,2.45] },
  { slug: "end_crystal", name: "End Crystal", material: "end_crystal", price: 1_750_000, ch24h: -7.3, ch7d: -11.4, listings: 210, volume24h: 54_000_000, spark: [1.94,1.92,1.90,1.87,1.85,1.83,1.81,1.80,1.78,1.77,1.76,1.75,1.75,1.75] },
  { slug: "ender_eye", name: "Eye of Ender", material: "ender_eye", price: 18_200, ch24h: 1.1, ch7d: 3.2, listings: 2_100, volume24h: 18_000_000, spark: [17.6,17.7,17.8,17.8,17.9,18.0,18.0,18.1,18.1,18.2,18.2,18.2,18.2,18.2] },
  { slug: "respawn_anchor", name: "Respawn Anchor", material: "respawn_anchor", price: 74_500, ch24h: -1.9, ch7d: -3.4, listings: 720, volume24h: 14_000_000, spark: [76.8,76.4,76.0,75.6,75.4,75.1,74.9,74.8,74.7,74.6,74.5,74.5,74.5,74.5] },
  { slug: "ghast_tear", name: "Ghast Tear", material: "ghast_tear", price: 486_000, ch24h: -6.2, ch7d: -9.8, listings: 188, volume24h: 7_600_000, spark: [521,517,512,508,503,499,496,492,489,487,486,486,486,486] },
  { slug: "shulker_shell", name: "Shulker Shell", material: "shulker_shell", price: 2_900_000, ch24h: 8.7, ch7d: 15.2, listings: 34, volume24h: 8_100_000, spark: [2.52,2.55,2.58,2.62,2.66,2.70,2.74,2.78,2.81,2.85,2.88,2.89,2.90,2.90] },
  { slug: "ancient_debris", name: "Ancient Debris", material: "ancient_debris", price: 8_400_000, ch24h: 6.2, ch7d: 12.7, listings: 41, volume24h: 9_400_000, spark: [7.62,7.68,7.74,7.80,7.86,7.92,7.98,8.05,8.12,8.20,8.28,8.34,8.38,8.40] },
  { slug: "nether_star", name: "Nether Star", material: "nether_star", price: 41_000_000, ch24h: 12.4, ch7d: 22.8, listings: 9, volume24h: 4_200_000, spark: [33.2,33.8,34.4,35.1,35.8,36.4,37.1,37.8,38.4,39.1,39.7,40.3,40.7,41.0] },
];

export const ECONOMY = {
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
};

export type Player = {
  name: string;
  money: number;
  kills: number;
  deaths: number;
  shards: number;
  blocksPlaced: number;
  blocksBroken: number;
  mobsKilled: number;
  shopSpend: number;
  sellEarned: number;
  playtimeDays: number;
};

const P: [string, number, number, number, number, number, number, number, number, number, number][] = [
  // name, money, kills, deaths, shards, placed, broken, mobs, shop, sell, playtime
  ["jesticc", 4.82e12, 48210, 1240, 92400, 8.4e6, 21.1e6, 2.84e6, 4.1e12, 5.2e12, 812],
  ["AidansGamingYT", 4.21e12, 41880, 1980, 88100, 9.1e6, 24.8e6, 3.12e6, 3.8e12, 4.6e12, 764],
  ["rtkprime", 3.94e12, 39640, 1640, 85900, 7.6e6, 19.4e6, 2.61e6, 3.4e12, 4.2e12, 731],
  ["iditity", 3.61e12, 22140, 890, 142000, 6.2e6, 14.8e6, 1.94e6, 4.4e12, 3.9e12, 690],
  ["Ehxy", 3.18e12, 36920, 1520, 74200, 6.8e6, 17.2e6, 2.48e6, 3.1e12, 3.6e12, 655],
  ["Jeadox", 2.94e12, 31400, 1380, 69800, 5.9e6, 15.1e6, 2.15e6, 2.9e12, 3.2e12, 618],
  ["BabyBeetroot", 2.61e12, 28770, 1190, 61400, 5.4e6, 13.6e6, 1.92e6, 2.6e12, 2.9e12, 592],
  ["DonutUnc", 2.38e12, 25640, 1280, 58900, 5.1e6, 12.8e6, 1.84e6, 2.4e12, 2.7e12, 571],
  ["rekrapp2", 2.14e12, 24180, 1080, 54300, 4.8e6, 12.1e6, 1.72e6, 2.2e12, 2.5e12, 540],
  ["ClownPierce", 1.96e12, 22940, 1440, 51700, 4.6e6, 11.4e6, 1.66e6, 2.0e12, 2.3e12, 512],
  ["Vitalasy", 1.82e12, 19820, 940, 49200, 4.2e6, 10.2e6, 1.48e6, 1.8e12, 2.1e12, 486],
  ["Marlowww", 1.68e12, 18760, 1010, 46400, 4.0e6, 9.8e6, 1.41e6, 1.7e12, 1.9e12, 461],
  ["DrDonutt", 1.54e12, 16480, 780, 43800, 3.7e6, 9.1e6, 1.28e6, 1.5e12, 1.8e12, 438],
  ["RTKprimo", 1.41e12, 15220, 720, 41200, 3.4e6, 8.6e6, 1.19e6, 1.4e12, 1.6e12, 412],
  ["doughboy", 1.29e12, 14380, 860, 38600, 3.2e6, 8.1e6, 1.12e6, 1.3e12, 1.5e12, 388],
];

export const PLAYERS: Player[] = P.map(
  ([name, money, kills, deaths, shards, blocksPlaced, blocksBroken, mobsKilled, shopSpend, sellEarned, playtimeDays]) => ({
    name, money, kills, deaths, shards, blocksPlaced, blocksBroken, mobsKilled, shopSpend, sellEarned, playtimeDays,
  })
);

export type BoardKey =
  | "money" | "kills" | "deaths" | "shards" | "playtime"
  | "blocksplaced" | "blocksbroken" | "mobskilled" | "shopspend" | "sellearned";

export const BOARDS: { key: BoardKey; label: string; unit: string; desc: string }[] = [
  { key: "money", label: "Money", unit: "$", desc: "Players holding the most in-game currency." },
  { key: "kills", label: "PvP Kills", unit: "", desc: "Total player kills recorded." },
  { key: "deaths", label: "Deaths", unit: "", desc: "Players who died most often." },
  { key: "shards", label: "Shards", unit: "", desc: "Premium currency collected." },
  { key: "playtime", label: "Playtime", unit: "d", desc: "Longest time connected to the server." },
  { key: "blocksplaced", label: "Blocks Placed", unit: "", desc: "Most builders on the server." },
  { key: "blocksbroken", label: "Blocks Broken", unit: "", desc: "Highest mining totals." },
  { key: "mobskilled", label: "Mobs Killed", unit: "", desc: "Best hunters on the server." },
  { key: "shopspend", label: "Shop Spend", unit: "$", desc: "Most money spent in shops." },
  { key: "sellearned", label: "Sell Earnings", unit: "$", desc: "Most earned from /sell." },
];

export const boardValue = (p: Player, key: BoardKey): number => {
  switch (key) {
    case "money": return p.money;
    case "kills": return p.kills;
    case "deaths": return p.deaths;
    case "shards": return p.shards;
    case "playtime": return p.playtimeDays;
    case "blocksplaced": return p.blocksPlaced;
    case "blocksbroken": return p.blocksBroken;
    case "mobskilled": return p.mobsKilled;
    case "shopspend": return p.shopSpend;
    case "sellearned": return p.sellEarned;
  }
};

export const REGIONS = [
  { id: "eu-central", name: "EU Central", short: "EUC", share: 0.30, players: 8420, peak: 21400, trend: 3.1 },
  { id: "eu-west", name: "EU West", short: "EUW", share: 0.22, players: 6180, peak: 18900, trend: 1.4 },
  { id: "na-east", name: "NA East", short: "NAE", share: 0.19, players: 5240, peak: 16300, trend: -0.8 },
  { id: "na-west", name: "NA West", short: "NAW", share: 0.14, players: 3910, peak: 14200, trend: 2.2 },
  { id: "asia", name: "Asia", short: "ASI", share: 0.10, players: 2740, peak: 12100, trend: 5.4 },
  { id: "oceania", name: "Oceania", short: "OCE", share: 0.05, players: 1180, peak: 4600, trend: -1.6 },
];

export const SERVER = {
  online: 21_437,
  max: 60_000,
  ping: 42,
  version: "1.21",
  updatedMinutesAgo: 2,
  uptimeDays: 412,
};