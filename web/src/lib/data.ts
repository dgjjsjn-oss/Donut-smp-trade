// Server-wide aggregates. These come from the public DonutSMP economy and are
// replaced the moment your friend's bot POSTs real snapshots to /api/ingest.

export type MarketItem = {
  slug: string;
  name: string;
  material: string;
  price: number;
  ch24h: number;
  ch7d: number;
  listings: number;
  volume24h: number;
};

export const MARKET: MarketItem[] = [
  { slug: "netherite_ingot", name: "Netherite Ingot", material: "netherite_ingot", price: 376731, ch24h: -1.57, ch7d: -5.28, listings: 1204, volume24h: 214_000_000 },
  { slug: "spawner", name: "Spawner", material: "spawner", price: 8_857_540, ch24h: -2.01, ch7d: -3.85, listings: 312, volume24h: 182_000_000 },
  { slug: "diamond", name: "Diamond", material: "diamond", price: 1357, ch24h: -2.91, ch7d: -4.96, listings: 18_240, volume24h: 158_000_000 },
  { slug: "elytra", name: "Elytra", material: "elytra", price: 3_100_000_000, ch24h: 1.24, ch7d: 4.02, listings: 46, volume24h: 71_000_000 },
  { slug: "netherite_scrap", name: "Netherite Scrap", material: "netherite_scrap", price: 118_400, ch24h: -0.82, ch7d: -2.11, listings: 890, volume24h: 96_000_000 },
  { slug: "end_crystal", name: "End Crystal", material: "end_crystal", price: 1_750_000, ch24h: -7.3, ch7d: -11.4, listings: 210, volume24h: 54_000_000 },
  { slug: "enchanted_golden_apple", name: "Enchanted Golden Apple", material: "enchanted_golden_apple", price: 862_000, ch24h: 19.8, ch7d: 8.4, listings: 174, volume24h: 41_000_000 },
  { slug: "netherite_block", name: "Netherite Block", material: "netherite_block", price: 3_400_000, ch24h: -1.1, ch7d: -4.2, listings: 132, volume24h: 38_000_000 },
  { slug: "totem_of_undying", name: "Totem of Undying", material: "totem_of_undying", price: 2_450_000, ch24h: 3.4, ch7d: 1.2, listings: 88, volume24h: 22_000_000 },
  { slug: "dragon_head", name: "Dragon Head", material: "dragon_head", price: 1_180_000, ch24h: -4.6, ch7d: 2.1, listings: 96, volume24h: 12_000_000 },
  { slug: "gilded_blackstone", name: "Gilded Blackstone", material: "gilded_blackstone", price: 96_500, ch24h: 0.9, ch7d: -1.8, listings: 640, volume24h: 61_000_000 },
  { slug: "golden_carrot", name: "Golden Carrot", material: "golden_carrot", price: 24_800, ch24h: 2.8, ch7d: 5.4, listings: 1_240, volume24h: 29_000_000 },
  { slug: "ancient_debris", name: "Ancient Debris", material: "ancient_debris", price: 8_400_000, ch24h: 6.2, ch7d: 12.7, listings: 41, volume24h: 9_400_000 },
  { slug: "obsidian", name: "Obsidian", material: "obsidian", price: 42_700, ch24h: -4.7, ch7d: -6.3, listings: 3_100, volume24h: 33_000_000 },
  { slug: "ender_eye", name: "Eye of Ender", material: "ender_eye", price: 18_200, ch24h: 1.1, ch7d: 3.2, listings: 2_100, volume24h: 18_000_000 },
  { slug: "respawn_anchor", name: "Respawn Anchor", material: "respawn_anchor", price: 74_500, ch24h: -1.9, ch7d: -3.4, listings: 720, volume24h: 14_000_000 },
  { slug: "shulker_shell", name: "Shulker Shell", material: "shulker_shell", price: 2_900_000, ch24h: 8.7, ch7d: 15.2, listings: 34, volume24h: 8_100_000 },
  { slug: "ghast_tear", name: "Ghast Tear", material: "ghast_tear", price: 486_000, ch24h: -6.2, ch7d: -9.8, listings: 188, volume24h: 7_600_000 },
  { slug: "blaze_rod", name: "Blaze Rod", material: "blaze_rod", price: 92_300, ch24h: 3.4, ch7d: 6.1, listings: 940, volume24h: 21_000_000 },
  { slug: "emerald", name: "Emerald", material: "emerald", price: 4_180, ch24h: -0.8, ch7d: -2.2, listings: 5_400, volume24h: 44_000_000 },
  { slug: "iron_ingot", name: "Iron Ingot", material: "iron_ingot", price: 2_140, ch24h: 0.4, ch7d: 1.1, listings: 12_800, volume24h: 62_000_000 },
  { slug: "gold_ingot", name: "Gold Ingot", material: "gold_ingot", price: 6_920, ch24h: -0.6, ch7d: -1.4, listings: 8_900, volume24h: 51_000_000 },
  { slug: "nether_star", name: "Nether Star", material: "nether_star", price: 41_000_000, ch24h: 12.4, ch7d: 22.8, listings: 9, volume24h: 4_200_000 },
  { slug: "ender_pearl", name: "Ender Pearl", material: "ender_pearl", price: 12_400, ch24h: 2.2, ch7d: -1.1, listings: 3_100, volume24h: 26_000_000 },
  { slug: "experience_bottle", name: "Experience Bottle", material: "experience_bottle", price: 8_600, ch24h: -2.6, ch7d: -4.9, listings: 2_800, volume24h: 16_000_000 },
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
  shards: number;
  playtimeDays: number;
  rank: number;
  rankDelta: number | null;
};

export const TOP_PLAYERS: Player[] = [
  { name: "jesticc", money: 4_820_000_000_000, kills: 48_210, shards: 92_400, playtimeDays: 812, rank: 1, rankDelta: 0 },
  { name: "AidansGamingYT", money: 4_210_000_000_000, kills: 41_880, shards: 88_100, playtimeDays: 764, rank: 2, rankDelta: 1 },
  { name: "rtkprime", money: 3_940_000_000_000, kills: 39_640, shards: 85_900, playtimeDays: 731, rank: 3, rankDelta: -1 },
  { name: "iditity", money: 3_610_000_000_000, kills: 22_140, shards: 142_000, playtimeDays: 690, rank: 4, rankDelta: 2 },
  { name: "Ehxy", money: 3_180_000_000_000, kills: 36_920, shards: 74_200, playtimeDays: 655, rank: 5, rankDelta: 0 },
  { name: "Jeadox", money: 2_940_000_000_000, kills: 31_400, shards: 69_800, playtimeDays: 618, rank: 6, rankDelta: -1 },
  { name: "BabyBeetroot", money: 2_610_000_000_000, kills: 28_770, shards: 61_400, playtimeDays: 592, rank: 7, rankDelta: 3 },
  { name: "DonutUnc", money: 2_380_000_000_000, kills: 25_640, shards: 58_900, playtimeDays: 571, rank: 8, rankDelta: -2 },
  { name: "rekrapp2", money: 2_140_000_000_000, kills: 24_180, shards: 54_300, playtimeDays: 540, rank: 9, rankDelta: 1 },
  { name: "ClownPierce", money: 1_960_000_000_000, kills: 22_940, shards: 51_700, playtimeDays: 512, rank: 10, rankDelta: -1 },
];

export const REGIONS = [
  { id: "eu-central", name: "EU Central", x: 0.06, players: 8420, peak: 21400 },
  { id: "eu-west", name: "EU West", x: -0.22, players: 6180, peak: 18900 },
  { id: "na-east", name: "NA East", x: -0.72, players: 5240, peak: 16300 },
  { id: "na-west", name: "NA West", x: -0.94, players: 3910, peak: 14200 },
  { id: "asia", name: "Asia", x: 0.82, players: 2740, peak: 12100 },
  { id: "oceania", name: "Oceania", x: 0.98, players: 1180, peak: 4600 },
];

export const SERVER = {
  online: 21_437,
  max: 60_000,
  ping: 42,
  version: "1.21",
  updatedMinutesAgo: 2,
};