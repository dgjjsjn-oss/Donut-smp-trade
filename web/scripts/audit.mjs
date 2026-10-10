// Full-site audit: crawls every internal link, checks status, counts images,
// buttons and dead handlers. Run against a running server.
//   node scripts/audit.mjs http://localhost:3100

const BASE = process.argv[2] ?? "http://localhost:3100";

const seen = new Map();
const problems = [];
const assetFails = [];
let buttonCount = 0;
let imgCount = 0;
let noAlt = 0;

async function get(url) {
  const res = await fetch(url, { redirect: "follow" });
  const text = res.status === 200 ? await res.text() : "";
  return { status: res.status, text };
}

function auditImages(html, page) {
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  imgCount += imgs.length;
  for (const m of imgs) {
    const tag = m[0];
    if (!/\balt=/i.test(tag)) noAlt++;
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!src) continue;
    if (src.startsWith("/")) {
      const p = src.split("?")[0];
      assetFails.push({ page, src: p });
    }
  }
}

async function crawl(url, depth = 0) {
  if (seen.has(url) || depth > 4) return;
  seen.set(url, true);

  let r;
  try {
    r = await get(url);
  } catch (e) {
    problems.push({ url, issue: `fetch failed: ${e.message}` });
    return;
  }

  if (r.status !== 200) {
    problems.push({ url, issue: `HTTP ${r.status}` });
    return;
  }

  auditImages(r.text, url);

  const buttons = [...r.text.matchAll(/<button\b[^>]*>/gi)];
  buttonCount += buttons.length;

  // Buttons with neither onClick, type=submit inside a form, nor a real href
  for (const m of buttons) {
    const tag = m[0];
    const hasHandler = /onClick|onKeyDown|form=|type="submit"|aria-label|data-href/i.test(tag);
    const body = r.text.slice(m.index, m.index + 400);
    const hasContent = />[^<\s]{2,}/.test(body.slice(0, tag.length + 200));
    if (!hasHandler && !hasContent) {
      problems.push({ url, issue: `button with no handler or label: ${tag.slice(0, 90)}` });
    }
  }

  // Internal links
  const links = [...r.text.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const l of new Set(links)) {
    if (l.startsWith("/_next") || l.startsWith("/items/") || l.endsWith(".xml") || l.endsWith(".txt")) continue;
    const abs = BASE + l;
    await crawl(abs, depth + 1);
  }
}

const start = BASE + "/";
await crawl(start);

// Verify local assets resolve
const assetSet = [...new Set(assetFails.map((a) => a.src))];
const badAssets = [];
for (const a of assetSet) {
  try {
    const res = await fetch(BASE + a, { method: "HEAD" });
    if (!res.ok) badAssets.push({ asset: a, status: res.status });
  } catch (e) {
    badAssets.push({ asset: a, status: "ERR" });
  }
}

console.log("════════ AUDIT ════════\n");
console.log(`pages crawled : ${seen.size}`);
console.log(`images        : ${imgCount} (${noAlt} missing alt)`);
console.log(`buttons       : ${buttonCount}`);
console.log(`local assets  : ${assetSet.length} checked, ${badAssets.length} broken`);
console.log(`page problems : ${problems.length}\n`);

if (badAssets.length) {
  console.log("── BROKEN ASSETS ──");
  badAssets.slice(0, 30).forEach((b) => console.log(`  ${b.status}  ${b.asset}`));
  console.log("");
}
if (problems.length) {
  console.log("── PAGE PROBLEMS ──");
  const uniq = [...new Map(problems.map((p) => [p.url + p.issue, p])).values()];
  uniq.slice(0, 40).forEach((p) => console.log(`  ${p.issue}  <-  ${p.url}`));
  console.log("");
} else {
  console.log("── no page problems ──");
}

// Crawl coverage
console.log("── PAGES ──");
console.log([...seen.keys()].map((u) => "  " + u.replace(BASE, "")).sort().join("\n"));