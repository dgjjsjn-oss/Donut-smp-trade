// Real DonutSMP item catalogue.
// Images come from mc-heads.net CDN which renders actual Minecraft item textures —
// real assets, not drawn icons. material = the mineflayer/mc item id the bot reports.

export type Item = {
  slug: string;
  name: string;
  material: string;
  category: "resource" | "farm" | "combat" | "farming" | "utility" | "misc";
  stack: number;
  blurb: string;
};

export const ITEMS: Item[] = [
  { slug: "elytra", name: "Elytra", material: "elytra", category: "combat", stack: 1, blurb: "The flight item. Highest single-unit value on the server." },
  { slug: "spawner", name: "Spawner", material: "spawner", category: "utility", stack: 64, blurb: "Mob farm multiplier. The endgame tradable." },
  { slug: "netherite_ingot", name: "Netherite Ingot", material: "netherite_ingot", category: "resource", stack: 64, blurb: "Deepest ore-tier material, still the bench for netherite gear." },
  { slug: "netherite_block", name: "Netherite Block", material: "netherite_block", category: "resource", stack: 64, blurb: "Nine ingots, compressed. Big-ticket block trades." },
  { slug: "netherite_scrap", name: "Netherite Scrap", material: "netherite_scrap", category: "resource", stack: 64, blurb: "Raw scrap from bastions, refined into ingots." },
  { slug: "diamond", name: "Diamond", material: "diamond", category: "resource", stack: 64, blurb: "Base currency of gear crafting. The most-traded item on the AH." },
  { slug: "emerald", name: "Emerald", material: "emerald", category: "resource", stack: 64, blurb: "Villager trades and the mid-tier crafting input." },
  { slug: "gold_ingot", name: "Gold Ingot", material: "gold_ingot", category: "resource", stack: 64, blurb: "Cheap currency unit, heavy volume." },
  { slug: "iron_ingot", name: "Iron Ingot", material: "iron_ingot", category: "resource", stack: 64, blurb: "Volume baseline for armour and tool trades." },
  { slug: "coal", name: "Coal", material: "coal", category: "resource", stack: 64, blurb: "Fuel and steel-adjacent input. Constantly in demand." },
  { slug: "redstone", name: "Redstone Dust", material: "redstone", category: "resource", stack: 64, blurb: "Redstone dust. Wiring, and a solid low-tier trade." },
  { slug: "lapis_lazuli", name: "Lapis Lazuli", material: "lapis_lazuli", category: "resource", stack: 64, blurb: "Dyed wool and enchantment tables." },
  { slug: "gilded_blackstone", name: "Gilded Blackstone", material: "gilded_blackstone", category: "misc", stack: 64, blurb: "Basalt delighter — high value, thin supply." },
  { slug: "enchanted_golden_apple", name: "Enchanted Golden Apple", material: "enchanted_golden_apple", category: "combat", stack: 64, blurb: "The PvP consumable everyone hoards." },
  { slug: "totem_of_undying", name: "Totem of Undying", material: "totem_of_undying", category: "combat", stack: 1, blurb: "Death insurance. Very high unit value." },
  { slug: "respawn_anchor", name: "Respawn Anchor", material: "respawn_anchor", category: "combat", stack: 64, blurb: "Nether coordinate insurance, cheap and always wanted." },
  { slug: "end_crystal", name: "End Crystal", material: "end_crystal", category: "combat", stack: 64, blurb: "Bedrock-breaking item. Endgame raid currency." },
  { slug: "dragon_head", name: "Dragon Head", material: "dragon_head", category: "misc", stack: 64, blurb: "Collector item from the End boss." },
  { slug: "skeleton_skull", name: "Skeleton Skull", material: "skeleton_skull", category: "misc", stack: 64, blurb: "Mob-head collection staple." },
  { slug: "bone", name: "Bone", material: "bone", category: "farm", stack: 64, blurb: "Fertiliser and skeleton spawner fuel." },
  { slug: "bone_block", name: "Bone Block", material: "bone_block", category: "farm", stack: 64, blurb: "Nine bones. Storage-friendly." },
  { slug: "ender_pearl", name: "Ender Pearl", material: "ender_pearl", category: "farm", stack: 16, blurb: "Enderman farm staple and throw weapon." },
  { slug: "blaze_rod", name: "Blaze Rod", material: "blaze_rod", category: "farm", stack: 64, blurb: "Brewing fuel, high demand for potions." },
  { slug: "ender_eye", name: "Eye of Ender", material: "ender_eye", category: "farm", stack: 64, blurb: "Fortress-access cost, steady volume." },
  { slug: "ghast_tear", name: "Ghast Tear", material: "ghast_tear", category: "farm", stack: 64, blurb: "Brewing ingredient, expensive." },
  { slug: "slime_ball", name: "Slimeball", material: "slime_ball", category: "farm", stack: 64, blurb: "Lead-making input, mid-tier value." },
  { slug: "experience_bottle", name: "Experience Bottle", material: "experience_bottle", category: "utility", stack: 64, blurb: "Instant XP, always liquid." },
  { slug: "nether_wart", name: "Nether Wart", material: "nether_wart", category: "farming", stack: 64, blurb: "Brewing base. Reliable trade." },
  { slug: "golden_carrot", name: "Golden Carrot", material: "golden_carrot", category: "farming", stack: 64, blurb: "Potion input, moves in stacks." },
  { slug: "sugar_cane", name: "Sugar Cane", material: "sugar_cane", category: "farming", stack: 64, blurb: "Paper and brewing chain input." },
  { slug: "wheat", name: "Wheat", material: "wheat", category: "farming", stack: 64, blurb: "Village-trade food input." },
  { slug: "carrot", name: "Carrot", material: "carrot", category: "farming", stack: 64, blurb: "Farm bulk, thin margins." },
  { slug: "potato", name: "Potato", material: "potato", category: "farming", stack: 64, blurb: "Farm bulk, thin margins." },
  { slug: "obsidian", name: "Obsidian", material: "obsidian", category: "resource", stack: 64, blurb: "Ender chest and nether portal core." },
  { slug: "ancient_debris", name: "Ancient Debris", material: "ancient_debris", category: "resource", stack: 64, blurb: "Rare netherite source block." },
  { slug: "hopper", name: "Hopper", material: "hopper", category: "utility", stack: 64, blurb: "Automation component — the classic hopper order." },
  { slug: "chest", name: "Chest", material: "chest", category: "utility", stack: 64, blurb: "Storage staple for every base." },
  { slug: "ender_chest", name: "Ender Chest", material: "ender_chest", category: "utility", stack: 64, blurb: "Portable storage, obsidian-heavy." },
  { slug: "shulker_box", name: "Shulker Box", material: "shulker_box", category: "utility", stack: 1, blurb: "Portable storage — the item hoarding war is about." },
  { slug: "anvil", name: "Anvil", material: "anvil", category: "utility", stack: 1, blurb: "Repair and enchant station." },
  { slug: "enchanting_table", name: "Enchanting Table", material: "enchanting_table", category: "utility", stack: 1, blurb: "Enchants gear. Book-heavy input." },
  { slug: "beacon", name: "Beacon", material: "beacon", category: "utility", stack: 1, blurb: "Endgame utility block." },
  { slug: "dragon_breath", name: "Dragon's Breath", material: "dragon_breath", category: "combat", stack: 64, blurb: "Resurrection potion input from the End." },
  { slug: "shulker_shell", name: "Shulker Shell", material: "shulker_shell", category: "combat", stack: 64, blurb: "Rare End drop, thin supply." },
  { slug: "totem_of_undying_fragment", name: "Nether Star", material: "nether_star", category: "misc", stack: 64, blurb: "Wither boss drop, the rarest tradable." },
];

export const itemBySlug = (slug: string) => ITEMS.find((i) => i.slug === slug);

// Real rendered Minecraft item textures from the mc-heads CDN.
export const itemImage = (material: string, size = 32) =>
  `https://mc-heads.net/item/${material}/${size}`;

export const playerHead = (name: string, size = 40) =>
  `https://mc-heads.net/avatar/${encodeURIComponent(name)}/${size}`;