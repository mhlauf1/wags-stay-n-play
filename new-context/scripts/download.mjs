#!/usr/bin/env node
// download.mjs — pulls all assets in manifest.json
// Usage:  node download.mjs [--include-stock]
//   --include-stock   also download Wix stock images (default skip)
//
// Output:  ./assets/{category}/{filename}
//
// Requires: Node 20+ (uses native fetch)

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("./assets");
const INCLUDE_STOCK = process.argv.includes("--include-stock");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function downloadOne(url, outPath, label) {
  if (existsSync(outPath)) {
    console.log(`  skip (exists): ${label}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    const kb = (buf.length / 1024).toFixed(1);
    console.log(`  ✓ ${label} (${kb} KB)`);
    return { ok: true };
  } catch (err) {
    console.log(`  ✗ ${label} — ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  const manifest = JSON.parse(await readFile("./manifest.json", "utf8"));

  console.log(`\nDownloading assets for: ${manifest.site}\n`);

  let ok = 0, fail = 0, skip = 0;
  const failures = [];

  // Priority images
  console.log("→ Priority images (uploaded by client):");
  for (const img of manifest.images_priority) {
    const out = path.join(ROOT, img.category, img.filename);
    const r = await downloadOne(img.url, out, `${img.category}/${img.filename}`);
    if (r.ok && r.skipped) skip++;
    else if (r.ok) ok++;
    else { fail++; failures.push({ url: img.url, error: r.error }); }
  }

  // Documents (PDFs/DOCXs)
  console.log("\n→ Documents:");
  for (const doc of manifest.documents) {
    const out = path.join(ROOT, "documents", doc.filename);
    const r = await downloadOne(doc.url, out, `documents/${doc.filename}`);
    if (r.ok && r.skipped) skip++;
    else if (r.ok) ok++;
    else { fail++; failures.push({ url: doc.url, error: r.error }); }
  }

  // Stock (optional)
  if (INCLUDE_STOCK) {
    console.log("\n→ Wix stock images:");
    for (const [i, img] of manifest.images_stock_skip.entries()) {
      const ext = (img.url.match(/\.([a-z]+)(?:\?|$)/i)?.[1] || "jpg").toLowerCase();
      const filename = `stock-${String(i + 1).padStart(2, "0")}.${ext}`;
      const out = path.join(ROOT, "stock", filename);
      const r = await downloadOne(img.url, out, `stock/${filename}`);
      if (r.ok && r.skipped) skip++;
      else if (r.ok) ok++;
      else { fail++; failures.push({ url: img.url, error: r.error }); }
    }
  } else {
    console.log(`\n→ Skipped ${manifest.images_stock_skip.length} Wix stock images (use --include-stock to download).`);
  }

  console.log(`\nDone. ${ok} downloaded, ${skip} already present, ${fail} failed.`);
  if (failures.length) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  ${f.url}\n    ${f.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
