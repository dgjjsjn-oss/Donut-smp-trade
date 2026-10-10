// Full DonutSMP catalogue — matches the exact item list the collector bot reports.
// material = the exact key the bot sends. Images are real rendered Minecraft
// textures via the mc-heads CDN, so every item shows its true in-game look.

export type Item = {
  slug: string;
  name: string;
  material: string;
  category: Category;
  stack: number;
};

export type Category =
  | "ores"
  | "blocks"
  | "stone"
  | "wood"
  | "nature"
  | "functional"
  | "redstone"
  | "transport"
  | "tools"
  | "armor"
  | "combat"
  | "utility"
  | "books"
  | "food"
  | "mobs"
  | "nether"
  | "end"
  | "potions"
  | "discs"
  | "dyes"
  | "wool"
  | "concrete"
  | "decor";

export const CATEGORY_LABEL: Record<Category, string> = {
  ores: "Ores & Minerals",
  blocks: "Mineral Blocks",
  stone: "Stone Types",
  wood: "Wood",
  nature: "Nature & Organic",
  functional: "Functional Blocks",
  redstone: "Redstone",
  transport: "Transport",
  tools: "Tools",
  armor: "Armor",
  combat: "Combat & Ranged",
  utility: "Utility",
  books: "Books",
  food: "Food",
  mobs: "Mob Drops",
  nether: "Nether",
  end: "The End",
  potions: "Potions",
  discs: "Music Discs",
  dyes: "Dyes",
  wool: "Wool",
  concrete: "Concrete",
  decor: "Decorative",
};

const RAW: [string, Category, number][] = [
  // Ores & minerals
  ["coal","ores",64],["raw_iron","ores",64],["raw_gold","ores",64],["raw_copper","ores",64],
  ["iron_ingot","ores",64],["gold_ingot","ores",64],["copper_ingot","ores",64],
  ["netherite_ingot","ores",64],["netherite_scrap","ores",64],["ancient_debris","ores",64],
  ["diamond","ores",64],["emerald","ores",64],["lapis_lazuli","ores",64],["redstone","ores",64],
  ["quartz","ores",64],["glowstone_dust","ores",64],["amethyst_shard","ores",64],

  // Mineral blocks
  ["iron_block","blocks",64],["gold_block","blocks",64],["diamond_block","blocks",64],
  ["emerald_block","blocks",64],["lapis_block","blocks",64],["redstone_block","blocks",64],
  ["coal_block","blocks",64],["netherite_block","blocks",64],["copper_block","blocks",64],
  ["raw_iron_block","blocks",64],["raw_gold_block","blocks",64],["raw_copper_block","blocks",64],
  ["quartz_block","blocks",64],["amethyst_block","blocks",64],

  // Stone types
  ["stone","stone",64],["cobblestone","stone",64],["deepslate","stone",64],
  ["cobbled_deepslate","stone",64],["polished_deepslate","stone",64],["granite","stone",64],
  ["diorite","stone",64],["andesite","stone",64],["tuff","stone",64],["calcite","stone",64],
  ["dripstone_block","stone",64],["basalt","stone",64],["smooth_basalt","stone",64],
  ["blackstone","stone",64],["polished_blackstone","stone",64],["obsidian","stone",64],
  ["crying_obsidian","stone",64],["bedrock","stone",64],["end_stone","stone",64],
  ["purpur_block","stone",64],["prismarine","stone",64],["dark_prismarine","stone",64],
  ["sea_lantern","stone",64],

  // Wood
  ["oak_log","wood",64],["oak_planks","wood",64],["spruce_log","wood",64],["spruce_planks","wood",64],
  ["birch_log","wood",64],["birch_planks","wood",64],["jungle_log","wood",64],["jungle_planks","wood",64],
  ["acacia_log","wood",64],["acacia_planks","wood",64],["dark_oak_log","wood",64],
  ["dark_oak_planks","wood",64],["mangrove_log","wood",64],["mangrove_planks","wood",64],
  ["cherry_log","wood",64],["cherry_planks","wood",64],["crimson_stem","wood",64],
  ["crimson_planks","wood",64],["warped_stem","wood",64],["warped_planks","wood",64],
  ["bamboo_planks","wood",64],

  // Nature
  ["dirt","nature",64],["grass_block","nature",64],["sand","nature",64],["red_sand","nature",64],
  ["gravel","nature",64],["clay","nature",64],["clay_ball","nature",64],["snowball","nature",16],
  ["snow_block","nature",64],["ice","nature",64],["packed_ice","nature",64],["blue_ice","nature",64],
  ["moss_block","nature",64],["mud","nature",64],["mud_bricks","nature",64],["packed_mud","nature",64],

  // Functional blocks
  ["crafting_table","functional",64],["furnace","functional",64],["blast_furnace","functional",64],
  ["smoker","functional",64],["chest","functional",64],["trapped_chest","functional",64],
  ["ender_chest","functional",64],["barrel","functional",64],["hopper","functional",64],
  ["dropper","functional",64],["dispenser","functional",64],["anvil","functional",1],
  ["chipped_anvil","functional",1],["damaged_anvil","functional",1],["enchanting_table","functional",1],
  ["brewing_stand","functional",64],["cauldron","functional",64],["composter","functional",64],
  ["lectern","functional",64],["loom","functional",64],["stonecutter","functional",64],
  ["grindstone","functional",64],["smithing_table","functional",64],["cartography_table","functional",64],
  ["fletching_table","functional",64],["bookshelf","functional",64],["chiseled_bookshelf","functional",64],
  ["beacon","functional",1],["conduit","functional",64],["lodestone","functional",64],
  ["respawn_anchor","functional",64],["bell","functional",64],

  // Redstone
  ["observer","redstone",64],["piston","redstone",64],["sticky_piston","redstone",64],
  ["redstone_torch","redstone",64],["redstone_lamp","redstone",64],["repeater","redstone",64],
  ["comparator","redstone",64],["tripwire_hook","redstone",64],["target","redstone",64],
  ["lever","redstone",64],["tnt","redstone",64],["daylight_detector","redstone",64],
  ["note_block","redstone",64],["jukebox","redstone",64],

  // Transport
  ["rail","transport",64],["powered_rail","transport",64],["detector_rail","transport",64],
  ["activator_rail","transport",64],["minecart","transport",64],["chest_minecart","transport",64],
  ["furnace_minecart","transport",64],["tnt_minecart","transport",64],
  ["hopper_minecart","transport",64],["command_block_minecart","transport",1],["boat","transport",64],
  ["oak_boat","transport",64],["chest_boat","transport",64],["saddle","transport",64],
  ["lead","transport",64],["horse_armor","transport",64],["carpet","transport",64],

  // Tools
  ["wooden_sword","tools",1],["wooden_axe","tools",1],["wooden_pickaxe","tools",1],
  ["wooden_shovel","tools",1],["wooden_hoe","tools",1],["stone_sword","tools",1],
  ["stone_axe","tools",1],["stone_pickaxe","tools",1],["stone_shovel","tools",1],
  ["stone_hoe","tools",1],["iron_sword","tools",1],["iron_axe","tools",1],
  ["iron_pickaxe","tools",1],["iron_shovel","tools",1],["iron_hoe","tools",1],
  ["golden_sword","tools",1],["golden_axe","tools",1],["golden_pickaxe","tools",1],
  ["golden_shovel","tools",1],["golden_hoe","tools",1],["diamond_sword","tools",1],
  ["diamond_axe","tools",1],["diamond_pickaxe","tools",1],["diamond_shovel","tools",1],
  ["diamond_hoe","tools",1],["netherite_sword","tools",1],["netherite_axe","tools",1],
  ["netherite_pickaxe","tools",1],["netherite_shovel","tools",1],["netherite_hoe","tools",1],

  // Armor
  ["leather_helmet","armor",1],["leather_chestplate","armor",1],["leather_leggings","armor",1],
  ["leather_boots","armor",1],["chainmail_helmet","armor",1],["chainmail_chestplate","armor",1],
  ["chainmail_leggings","armor",1],["chainmail_boots","armor",1],["iron_helmet","armor",1],
  ["iron_chestplate","armor",1],["iron_leggings","armor",1],["iron_boots","armor",1],
  ["golden_helmet","armor",1],["golden_chestplate","armor",1],["golden_leggings","armor",1],
  ["golden_boots","armor",1],["diamond_helmet","armor",1],["diamond_chestplate","armor",1],
  ["diamond_leggings","armor",1],["diamond_boots","armor",1],["netherite_helmet","armor",1],
  ["netherite_chestplate","armor",1],["netherite_leggings","armor",1],["netherite_boots","armor",1],
  ["turtle_helmet","armor",1],["shield","armor",1],

  // Combat
  ["bow","combat",1],["crossbow","combat",1],["arrow","combat",64],["spectral_arrow","combat",64],
  ["tipped_arrow","combat",64],["trident","combat",1],["totem_of_undying","combat",1],

  // Utility
  ["shears","utility",1],["flint_and_steel","utility",1],["fishing_rod","utility",1],
  ["compass","utility",1],["recovery_compass","utility",1],["clock","utility",1],
  ["map","utility",1],["empty_map","utility",1],["spyglass","utility",1],["name_tag","utility",1],
  ["bucket","utility",16],["water_bucket","utility",1],["lava_bucket","utility",1],
  ["milk_bucket","utility",1],["powder_snow_bucket","utility",1],["glass_bottle","utility",64],
  ["bundle","utility",64],

  // Books
  ["book","books",64],["enchanted_book","books",1],["writable_book","books",1],
  ["written_book","books",16],["knowledge_book","books",1],

  // Food
  ["apple","food",64],["golden_apple","food",64],["enchanted_golden_apple","food",64],
  ["bread","food",64],["cake","food",1],["cookie","food",64],["pumpkin_pie","food",64],
  ["mushroom_stew","food",1],["rabbit_stew","food",1],["beetroot_soup","food",1],
  ["suspicious_stew","food",1],["carrot","food",64],["golden_carrot","food",64],
  ["potato","food",64],["baked_potato","food",64],["poisonous_potato","food",64],
  ["beetroot","food",64],["melon_slice","food",64],["glow_berries","food",64],
  ["sweet_berries","food",64],["chorus_fruit","food",64],["popped_chorus_fruit","food",64],
  ["dried_kelp","food",64],["kelp","food",64],["honey_bottle","food",64],["honeycomb","food",64],

  // Raw / cooked
  ["beef","food",64],["cooked_beef","food",64],["porkchop","food",64],["cooked_porkchop","food",64],
  ["chicken","food",64],["cooked_chicken","food",64],["mutton","food",64],["cooked_mutton","food",64],
  ["rabbit","food",64],["cooked_rabbit","food",64],["cod","food",64],["cooked_cod","food",64],
  ["salmon","food",64],["cooked_salmon","food",64],["tropical_fish","food",64],["pufferfish","food",64],

  // Mob drops
  ["bone","mobs",64],["bone_block","mobs",64],["bone_meal","mobs",64],["string","mobs",64],
  ["spider_eye","mobs",64],["fermented_spider_eye","mobs",64],["gunpowder","mobs",64],
  ["slime_ball","mobs",64],["magma_cream","mobs",64],["ghast_tear","mobs",64],
  ["blaze_rod","mobs",64],["blaze_powder","mobs",64],["ender_pearl","mobs",64],
  ["ender_eye","mobs",64],["shulker_shell","mobs",64],["phantom_membrane","mobs",64],
  ["rabbit_foot","mobs",64],["rabbit_hide","mobs",64],["leather","mobs",64],
  ["feather","mobs",64],["egg","mobs",16],["ink_sac","mobs",64],["glow_ink_sac","mobs",64],
  ["turtle_scute","mobs",64],["nautilus_shell","mobs",64],["heart_of_the_sea","mobs",64],

  // Nether
  ["nether_wart","nether",64],["nether_brick","nether",64],["nether_bricks","nether",64],
  ["netherrack","nether",64],["soul_sand","nether",64],["soul_soil","nether",64],
  ["magma_block","nether",64],["glowstone","nether",64],["quartz_ore","nether",64],
  ["nether_gold_ore","nether",64],["warped_fungus","nether",64],["crimson_fungus","nether",64],
  ["shroomlight","nether",64],["weeping_vines","nether",64],["twisting_vines","nether",64],

  // End
  ["dragon_egg","end",1],["dragon_head","end",64],["nether_star","end",64],
  ["end_crystal","end",64],["end_rod","end",64],["chorus_flower","end",64],
  ["chorus_plant","end",64],["shulker_box","end",1],["elytra","end",1],

  // Potions
  ["potion","potions",1],["splash_potion","potions",1],["lingering_potion","potions",1],

  // Music discs
  ["music_disc_13","discs",1],["music_disc_cat","discs",1],["music_disc_blocks","discs",1],
  ["music_disc_chirp","discs",1],["music_disc_far","discs",1],["music_disc_mall","discs",1],
  ["music_disc_mellohi","discs",1],["music_disc_stal","discs",1],["music_disc_strad","discs",1],
  ["music_disc_ward","discs",1],["music_disc_11","discs",1],["music_disc_wait","discs",1],
  ["music_disc_otherside","discs",1],["music_disc_pigstep","discs",1],["music_disc_5","discs",1],
  ["music_disc_relic","discs",1],["disc_fragment_5","discs",1],

  // Dyes
  ["white_dye","dyes",64],["orange_dye","dyes",64],["magenta_dye","dyes",64],
  ["light_blue_dye","dyes",64],["yellow_dye","dyes",64],["lime_dye","dyes",64],
  ["pink_dye","dyes",64],["gray_dye","dyes",64],["light_gray_dye","dyes",64],
  ["cyan_dye","dyes",64],["purple_dye","dyes",64],["blue_dye","dyes",64],
  ["brown_dye","dyes",64],["green_dye","dyes",64],["red_dye","dyes",64],["black_dye","dyes",64],

  // Wool
  ["white_wool","wool",64],["orange_wool","wool",64],["magenta_wool","wool",64],
  ["light_blue_wool","wool",64],["yellow_wool","wool",64],["lime_wool","wool",64],
  ["pink_wool","wool",64],["gray_wool","wool",64],["light_gray_wool","wool",64],
  ["cyan_wool","wool",64],["purple_wool","wool",64],["blue_wool","wool",64],
  ["brown_wool","wool",64],["green_wool","wool",64],["red_wool","wool",64],["black_wool","wool",64],

  // Concrete
  ["white_concrete","concrete",64],["orange_concrete","concrete",64],["red_concrete","concrete",64],
  ["blue_concrete","concrete",64],["green_concrete","concrete",64],["black_concrete","concrete",64],
  ["yellow_concrete","concrete",64],["purple_concrete","concrete",64],

  // Decorative
  ["torch","decor",64],["soul_torch","decor",64],["lantern","decor",64],["soul_lantern","decor",64],
  ["glass","decor",64],["glass_pane","decor",64],["stained_glass","decor",64],
  ["tinted_glass","decor",64],["ladder","decor",64],["scaffolding","decor",64],
  ["flower_pot","decor",64],["item_frame","decor",64],["glow_item_frame","decor",64],
  ["painting","decor",64],["armor_stand","decor",64],["decorated_pot","decor",64],

  // 1.21+ trial chambers
  ["trial_key","decor",64],["ominous_trial_key","decor",64],["wind_charge","combat",64],
  ["mace","combat",1],["heavy_core","combat",64],["breeze_rod","combat",64],
];

function titleCase(s: string) {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const ITEMS: Item[] = RAW.map(([material, category, stack]) => ({
  slug: material,
  name: titleCase(material),
  material,
  category,
  stack,
}));

export const itemBySlug = (slug: string) => ITEMS.find((i) => i.slug === slug);

// Real rendered Minecraft textures — no drawn stand-ins.
export const itemImage = (material: string, size = 32) =>
  `https://mc-heads.net/item/${material}/${size}`;

export const playerHead = (name: string, size = 40) =>
  `https://mc-heads.net/avatar/${encodeURIComponent(name)}/${size}`;

export const letterOf = (s: string) => s.charAt(0).toUpperCase();

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function itemsByLetter(letter: string) {
  return ITEMS.filter((i) => letterOf(i.name) === letter).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}