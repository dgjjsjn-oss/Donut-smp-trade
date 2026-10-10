// Exhaustive texture fetch. Minecraft blocks and models do not all live at
// item/<id>.png — many are block/<id>_top.png, block/<id>_side.png,
// block/<id>_front.png, or only exist as a rendered model. This sweeps every
// known naming pattern until one resolves.
//
//   node scripts/fetch-missing.mjs

import { mkdir, writeFile, access, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "items");
const BASES = [
  "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures",
];

const SUFFIXES = [
  "", "_top", "_side", "_front", "_bottom", "_north", "_east",
  "_inner", "_outer", "_particle", "_0", "_1", "_2",
];

const DIRS = ["item", "block", "entity/chest", "entity/shulker_box"];

const ids = process.argv.slice(2);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchBuf(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(12_000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 60 ? buf : null;
  } catch {
    return null;
  }
}

await mkdir(OUT, { recursive: true });

const failures = [];
const results = [];
const queue = [...ids];
const CONCURRENT = 10;

async function worker() {
  while (queue.length) {
    const id = queue.pop();
    const target = join(OUT, `${id}.png`);
    if (await exists(target)) { results.push(id); continue; }

    let got = null;
    outer: for (const base of BASES) {
      for (const dir of DIRS) {
        for (const suf of SUFFIXES) {
          const buf = await fetchBuf(`${base}/${dir}/${id}${suf}.png`);
          if (buf) {
            got = { buf, from: `${dir}/${id}${suf}.png` };
            break outer;
          }
        }
      }
    }

    if (got) {
      await writeFile(target, got.buf);
      results.push(id);
      console.log(`  OK   ${id}  <- ${got.from}`);
    } else {
      failures.push(id);
      console.log(`  FAIL ${id}  (no flat texture — rendered model)`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENT }, worker));

const have = new Set(await readdir(OUT).then((f) => f.map((x) => x.replace(/\.png$/, ""))));

console.log(`\nresolved ${results.length}, still missing ${failures.length}`);
console.log(`total local textures: ${have.size}`);

await writeFile(
  join(__dirname, "item-fallbacks.json"),
  JSON.stringify(failures.sort(), null, 0)
);
console.log(`wrote scripts/item-fallbacks.json (${failures.length} ids with no flat texture)`);