// Downloads real Minecraft item + block textures into public/items so the site
// never depends on a third-party image CDN. mc-heads.net/item is currently 404,
// which is why every item image on the site was broken.
//
// Run once: node scripts/fetch-items.mjs

import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "items");

const VERSION = "1.20.4";
const ITEM_DIR = `assets/minecraft/textures/item`;
const BLOCK_DIR = `assets/minecraft/textures/block`;

// Items whose texture lives in the block folder, or which are rendered models.
const IN_BLOCK_DIR = new Set([
  "elytra", "spawner", "hopper", "chest", "ender_chest", "barrel", "anvil",
  "chipped_anvil", "damaged_anvil", "beacon", "conduit", "brewing_stand",
  "enchanting_table", "furnace", "blast_furnace", "smoker", "cauldron",
  "piston", "sticky_piston", "observer", "dispenser", "dropper", "note_block",
  "jukebox", "comparator", "repeater", "redstone_torch", "redstone_lamp",
  "lever", "target", "bell", "lodestone", "lectern", "loom", "grindstone",
  "stonecutter", "smithing_table", "cartography_table", "fletching_table",
  "composter", "crafter", "respawn_anchor", "daylight_detector",
  "shield", "crossbow", "trident", "fishing_rod", "spyglass",
  "tripwire_hook", "lantern", "soul_lantern", "scaffolding", "flower_pot",
  "item_frame", "glow_item_frame", "painting", "armor_stand", "chiseled_bookshelf",
  "recovery_compass", "clock", "compass", "name_tag", "bundle",
  "tipped_arrow", "spectral_arrow", "knowledge_book", "written_book",
  "writable_book", "enchanted_book", "potion", "splash_potion", "lingering_potion",
  "firework_rocket", "filled_map", "milk_bucket", "powder_snow_bucket",
  "decorated_pot", "mace", "wind_charge", "trial_key", "ominous_trial_key",
]);

const BASES = [
  `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/${VERSION}`,
  `https://raw.githubusercontent.com/misode/mcmeta-assets/${VERSION}/assets/minecraft`,
];

const list = process.argv.slice(2);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function tryDirs(name, dirs) {
  for (const base of BASES) {
    for (const d of dirs) {
      const url = `${base}/${d}/${name}.png`;
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 60) return buf;
        }
      } catch {}
    }
  }
  return null;
}

await mkdir(OUT, { recursive: true });

const manifest = [];
let ok = 0;
let fail = 0;

const CONCURRENT = 12;

async function worker(queue) {
  while (queue.length) {
    const name = queue.pop();
    const target = join(OUT, `${name}.png`);
    if (await exists(target)) { ok++; manifest.push(name); continue; }

    const dirs = IN_BLOCK_DIR.has(name) ? [BLOCK_DIR, ITEM_DIR] : [ITEM_DIR, BLOCK_DIR];
    const buf = await tryDirs(name, dirs);
    if (buf) {
      await writeFile(target, buf);
      ok++;
      manifest.push(name);
    } else {
      fail++;
    }
    if ((ok + fail) % 25 === 0) process.stdout.write(`  ${ok} ok / ${fail} miss\n`);
  }
}

const queue = [...list];
await Promise.all(Array.from({ length: CONCURRENT }, () => worker(queue)));

console.log(`\nDone. ${ok} textures saved, ${fail} not found.`);
console.log(`Serving from /items/<id>.png`);

// Record which ones we have so the UI can avoid rendering broken images.
await writeFile(
  join(__dirname, "item-manifest.json"),
  JSON.stringify([...new Set(manifest)].sort(), null, 0)
);
console.log(`Manifest written: scripts/item-manifest.json (${manifest.length} ids)`);