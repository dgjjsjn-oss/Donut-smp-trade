// Comprehensive self-audit. Reports concrete defects with file:line.
//   node scripts/qa.mjs

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("../src/", import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx|ts|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = await walk(ROOT);
const issues = { critical: [], visual: [], a11y: [], content: [] };

for (const f of files) {
  const src = await readFile(f, "utf8");
  const rel = relative(ROOT, f);
  const lines = src.split("\n");

  const lineOf = (re) => {
    const i = lines.findIndex((l) => re.test(l));
    return i >= 0 ? i + 1 : 0;
  };

  // ── duplicate imports of the same symbol ──
  const importBlocks = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*"([^"]+)";/g)];
  const seen = new Map();
  for (const m of importBlocks) {
    for (const raw of m[1].split(",")) {
      const name = raw.trim();
      if (!name) continue;
      if (seen.has(name)) {
        issues.critical.push(`${rel}: duplicate import '${name}' (lines ${seen.get(name)} and ${lineOf(new RegExp(`import[^}]*\\b${name}\\b`))})`);
      }
      seen.set(name, lineOf(new RegExp(`import[^}]*\\b${name}\\b`)));
    }
  }

  // ── used-but-not-imported component helpers ──
  for (const helper of ["ItemIcon", "ItemIconLarge", "Brief", "Pixel", "Meter", "Panel", "Spark", "Delta", "Breadcrumb", "Freshness", "LiveDot"]) {
    const used = new RegExp(`<${helper}\\b`).test(src);
    const definedLocally = new RegExp(`(function|const)\\s+${helper}\\b`).test(src);
    if (used && !definedLocally && !new RegExp(`import[^}]*\\b${helper}\\b`).test(src)) {
      issues.critical.push(`${rel}: uses <${helper}> but never imports it (line ${lineOf(new RegExp(`<${helper}\\b`))})`);
    }
  }

  // ── dead props: destructured but never referenced in that function's own body ──
  // Scoping matters: a prop name reused by a *different* function is not a use of this one.
  for (const m of src.matchAll(/(?:function\s+(\w+)\s*\(\s*\{([^}]+)\}|(\w+)\s*=\s*\(\s*\{([^}]+)\}\s*)\s*(?::[^=]*)?=>/g)) {
    const name = m[1] || m[3];
    const props = m[2] || m[4];
    const start = m.index + m[0].length;
    // body runs to the next top-level `function|const|export` declaration
    const rest = src.slice(start);
    const nextDecl = rest.search(/\n(?:export\s+)?(?:function|const|let)\s/);
    const body = nextDecl === -1 ? rest : rest.slice(0, nextDecl);
    for (const raw of props.split(",")) {
      const p = raw.trim().split(":")[0].split("=")[0].trim();
      if (!p || p.startsWith("...") || !/^[A-Za-z_$][\w$]*$/.test(p)) continue;
      const uses = (body.match(new RegExp(`\\b${p}\\b`, "g")) ?? []).length;
      if (uses === 0) issues.visual.push(`${rel}: prop '${p}' of ${name}() is destructured but never used in its body`);
    }
  }

  // ── accessibility ──
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) issues.a11y.push(`${rel}: <img> with no alt attribute`);
  }
  if (/<button\b(?![^>]*aria-label)[^>]*>\s*<\/button>/.test(src)) {
    issues.a11y.push(`${rel}: icon-only <button> without aria-label`);
  }
  if (/\btarget="_blank"/.test(src) && !/rel="noopener/.test(src)) {
    issues.a11y.push(`${rel}: target="_blank" without rel="noopener noreferrer"`);
  }

  // ── inline style colour literals instead of tokens ──
  const rawHex = [...src.matchAll(/#[0-9a-fA-F]{6}\b/g)];
  // globals.css is the token source itself; logo.tsx holds SVG gradient stops.
  const exempt = /(globals\.css|icon\.svg|components[\\/]logo\.tsx)$/.test(rel);
  const outsideGlobals = exempt ? [] : rawHex;
  if (outsideGlobals.length) {
    issues.visual.push(`${rel}: ${outsideGlobals.length} raw hex literal(s) — use design tokens`);
  }

  // ── className with a raw tailwind colour ──
  for (const m of src.matchAll(/className="[^"]*(?:bg-|text-|border-)(red|blue|green|purple|indigo|yellow|pink|gray|slate|zinc)-\d{2,3}[^"]*"/g)) {
    issues.visual.push(`${rel}: default tailwind colour in className — "${m[0].slice(0, 60)}"`);
  }

  // ── generic radius (we enforce the 2px/999px split) ──
  for (const m of src.matchAll(/rounded-(sm|md|lg|xl|2xl|3xl)\b/g)) {
    issues.visual.push(`${rel}: rounded-${m[1].replace(/rounded-/, "")} breaks the tile/pill radius split`);
  }

  // ── AI copy clichés ──
  for (const c of ["game-changer","seamless","effortless","unlock","elevate","delve","unleash","next-gen","revolutionize","cutting-edge","state-of-the-art","foster","tapestry","leverage","empower","stunning","seamlessly"]) {
    if (src.toLowerCase().includes(c)) issues.content.push(`${rel}: AI cliché "${c}"`);
  }

  // ── Title Case headings ──
  for (const m of src.matchAll(/>\s*([A-Z][a-z]+(?: [A-Z][a-z]+){1,4})\s*</g)) {
    issues.content.push(`${rel}: Title Case heading "${m[1]}" — use sentence case`);
  }

  // ── 100vh ──
  if (/\b100vh\b|h-screen\b/.test(src)) issues.visual.push(`${rel}: 100vh/h-screen — use min-h-[100dvh]`);

  // ── transition-all (banned by motion discipline) ──
  for (const m of src.matchAll(/transition-all\b/g)) issues.visual.push(`${rel}: transition-all — animate transform/opacity only`);
}

const order = ["critical", "visual", "a11y", "content"];
const title = {
  critical: "CRITICAL BUGS",
  visual: "VISUAL WEAKNESSES",
  a11y: "ACCESSIBILITY",
  content: "CONTENT",
};

console.log("\n═══════ QA AUDIT ═══════\n");
for (const k of order) {
  const list = [...new Set(issues[k])];
  console.log(`## ${title[k]} (${list.length})`);
  if (!list.length) console.log("  clean\n");
  else list.slice(0, 30).forEach((i) => console.log(`  ${i}`)), console.log("");
}

console.log(`\nfiles scanned: ${files.length}`);
console.log(`total findings: ${Object.values(issues).reduce((s, a) => s + new Set(a).size, 0)}`);