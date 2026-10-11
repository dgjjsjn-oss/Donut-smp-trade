// ─────────────────────────────────────────────────────────────────────────────
// PLAYER DATA — sourced from donutstats.net, the DonutSMP community stats
// platform, using its public "most searched players" index (real usernames,
// real 30-day profile view counts).
//
// HONESTY RULE, enforced in the types below:
//   `views` is observed fact.
//   Every stat (money / kills / shards / …) is `null` until our collector bot
//   or the official api.donutsmp.net supplies a real value.
//
// We do NOT invent balances. A leaderboard full of plausible-looking fake
// numbers is worse than an empty one, because a trader cannot tell the
// difference at a glance and will act on it.
//
// Players absent from this list were removed: a shard-selling marketing site
// listed names that the actual DonutSMP stats platform does not recognise.
// ─────────────────────────────────────────────────────────────────────────────

export type Player = {
  name: string;
  /** Real 30-day profile views on donutstats.net. Observed fact. */
  views: number;
  /** True when donutstats lists the account in its featured/trending set. */
  featured: boolean;
  /** Null until the collector or official API supplies a real value. */
  money: number | null;
  kills: number | null;
  deaths: number | null;
  shards: number | null;
  blocksPlaced: number | null;
  blocksBroken: number | null;
  mobsKilled: number | null;
  shopSpend: number | null;
  sellEarned: number | null;
  playtimeDays: number | null;
  /** Real 24h change once known. */
  ch24h: number | null;
  online: boolean | null;
  seen: string;
};

type Seed = [name: string, views: number, featured: boolean];

// Real usernames + real view counts from donutstats.net/player-finder.
const SEEDS: Seed[] = [
  ["DrDonutt", 1800, true],
  ["Abuodee", 904, false],
  ["iditity", 733, true],
  ["Squintom", 530, false],
  ["jesticc", 426, true],
  ["Y0ruty", 386, false],
  ["Ikeacpvp", 385, false],
  ["Jettism", 362, false],
  ["Jeadox", 341, true],
  [".w00ky02", 333, false],
  ["Ehxy", 319, true],
  ["OsBro2010", 313, false],
  ["Wampiptiii0", 269, false],
  ["XCiaranbplaysX", 256, false],
  ["DonutUnc", 246, true],
  ["ItzDarkSlate", 222, false],
  ["RTKprime", 210, true],
  ["AndreBore12", 207, false],
  ["13v3", 189, false],
  ["Purrfectttt", 186, false],
  ["_vined", 182, false],
  ["Farex_x", 178, false],
  ["Wampiptiii01", 173, false],
  ["zKekss2", 167, false],
  ["NeeIsNee", 163, false],
  ["0823k", 160, false],
  ["Rhylm", 158, false],
  ["Milezz18819", 153, false],
  ["LoadFc", 151, true],
  ["KlingMC", 145, false],
  ["BC3500", 138, false],
  ["N1Kzzz", 135, false],
  ["dawzaz", 133, false],
  ["ilarpaspoor", 133, false],
  ["buygilded", 131, false],
  ["TobVi", 129, false],
  ["Leroxcpvp", 129, false],
  ["C_H_R_O_N_I_C", 126, false],
  ["Megabean_", 126, false],
  ["cutiewsp", 125, false],
  ["HaitchL", 125, false],
  ["hamster_cpvp", 124, false],
  ["Rodis17", 120, false],
  ["zM0spo", 119, false],
  ["Mushymoshh", 118, false],
  ["Pouday", 117, false],
  ["cayyyo", 117, false],
  ["Rinopete", 116, false],
  ["IcedDiamonds", 115, false],
  ["VoidView", 115, false],
  ["Cinnamooon01", 115, false],
  ["DonutGrandma", 112, false],
  ["stevenyang323", 111, false],
  ["W1zoX_", 111, false],
  ["Golbary", 105, false],
  ["AidansGamingYT", 104, true],
  ["itzdejvid", 104, false],
  ["cruell", 90, true],
  ["JM717R8", 90, false],
  ["FragaNaga", 89, false],
  ["AsianGPT", 89, false],
];

export const PLAYERS: Player[] = SEEDS.map(([name, views, featured]) => ({
  name,
  views,
  featured,
  money: null,
  kills: null,
  deaths: null,
  shards: null,
  blocksPlaced: null,
  blocksBroken: null,
  mobsKilled: null,
  shopSpend: null,
  sellEarned: null,
  playtimeDays: null,
  ch24h: null,
  online: null,
  seen: "unknown",
}));

export type BoardKey =
  | "views" | "money" | "kills" | "deaths" | "shards" | "playtime"
  | "blocksplaced" | "blocksbroken" | "mobskilled" | "shopspend" | "sellearned";

export const BOARDS: {
  key: BoardKey;
  label: string;
  /** true when the board has no real data until the collector reports. */
  pending?: boolean;
  desc: string;
}[] = [
  {
    key: "views",
    label: "Most Looked Up",
    desc: "Real profile views over the last 30 days. The only player board with observed data.",
  },
  { key: "money", label: "Money", pending: true, desc: "Highest net worth. Populates once the collector reports balances." },
  { key: "kills", label: "PvP Kills", pending: true, desc: "Most players eliminated. Populates once the collector reports." },
  { key: "deaths", label: "Deaths", pending: true, desc: "Lost the most duels. Populates once the collector reports." },
  { key: "shards", label: "Shards", pending: true, desc: "Premium currency held. Populates once the collector reports." },
  { key: "playtime", label: "Playtime", pending: true, desc: "Longest time connected. Populates once the collector reports." },
  { key: "blocksplaced", label: "Blocks Placed", pending: true, desc: "Built the most. Populates once the collector reports." },
  { key: "blocksbroken", label: "Blocks Broken", pending: true, desc: "Mined the most. Populates once the collector reports." },
  { key: "mobskilled", label: "Mobs Killed", pending: true, desc: "Best hunters. Populates once the collector reports." },
  { key: "shopspend", label: "Shop Spend", pending: true, desc: "Most spent in shops. Populates once the collector reports." },
  { key: "sellearned", label: "Sell Earnings", pending: true, desc: "Most earned at /sell. Populates once the collector reports." },
];

const FIELD: Record<BoardKey, keyof Player | null> = {
  views: "views",
  money: "money",
  kills: "kills",
  deaths: "deaths",
  shards: "shards",
  playtime: "playtimeDays",
  blocksplaced: "blocksPlaced",
  blocksbroken: "blocksBroken",
  mobskilled: "mobsKilled",
  shopspend: "shopSpend",
  sellearned: "sellEarned",
};

export function boardValue(p: Player, key: BoardKey): number | null {
  const f = FIELD[key];
  if (!f) return null;
  const v = p[f];
  return typeof v === "number" ? v : null;
}