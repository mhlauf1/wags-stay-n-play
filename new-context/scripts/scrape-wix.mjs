#!/usr/bin/env node
// scrape-wix.mjs — zero-dep Wix site scraper
//
// Crawls a Wix site (or any site), saves HTML + extracts asset URLs,
// rewrites Wix CDN URLs to originals, and downloads everything.
//
// Usage:
//   node scrape-wix.mjs https://www.example.com
//   node scrape-wix.mjs https://www.example.com --out ./out --max-pages 50 --no-download
//
// Flags:
//   --out <dir>          output directory (default: ./scrape-output)
//   --max-pages <n>      cap pages crawled (default: 100)
//   --no-download        skip asset downloads, just produce manifest.json
//   --include-stock      download Wix stock images too (prefix 11062b_ etc.)
//   --delay <ms>         throttle between requests (default: 250)
//
// Output layout:
//   <out>/html/<slug>.html       raw HTML per page
//   <out>/content/<slug>.md      extracted text (best-effort)
//   <out>/assets/...             downloaded originals
//   <out>/manifest.json          everything found
//
// Requires: Node 20+ (native fetch).

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// ---------- args ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const getFlag = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const ENTRY = args.find((a) => /^https?:\/\//.test(a));
if (!ENTRY) {
  console.error("Usage: node scrape-wix.mjs <url> [--out dir] [--max-pages n] [--no-download] [--include-stock] [--delay ms]");
  process.exit(1);
}
const OUT = path.resolve(getFlag("--out", "./scrape-output"));
const MAX_PAGES = parseInt(getFlag("--max-pages", "100"), 10);
const DO_DOWNLOAD = !flag("--no-download");
const INCLUDE_STOCK = flag("--include-stock");
const DELAY = parseInt(getFlag("--delay", "250"), 10);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- url helpers ----------
function slugify(urlStr) {
  const u = new URL(urlStr);
  const p = u.pathname === "/" ? "index" : u.pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
  return p || "index";
}

// Convert a Wix CDN URL with transformation params into the original asset URL.
// Pattern: static.wixstatic.com/media/<asset>/v1/<transform>/<derived-name>
// The original is everything up to (but not including) "/v1/".
function wixOriginal(urlStr) {
  if (!/static\.wixstatic\.com\/media\//.test(urlStr)) return urlStr;
  const idx = urlStr.indexOf("/v1/");
  return idx === -1 ? urlStr : urlStr.slice(0, idx);
}

function isWixStock(urlStr) {
  // a585ce_ prefix is a site-specific upload bucket.
  // 11062b_ prefix and no-prefix bare hashes are usually Wix stock library.
  const m = urlStr.match(/static\.wixstatic\.com\/media\/([^/]+)/);
  if (!m) return false;
  const filename = m[1];
  return !filename.startsWith("a585ce_") && !filename.startsWith("11062b_") || filename.startsWith("11062b_");
}

// ---------- html parsing (zero-dep, attribute-level) ----------
function extractAttributes(html, tag, attrs) {
  const out = [];
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  let m;
  while ((m = re.exec(html))) {
    const open = m[0];
    const row = {};
    for (const a of attrs) {
      const ar = new RegExp(`\\b${a}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
      const am = open.match(ar);
      if (am) row[a] = am[2] ?? am[3] ?? am[4] ?? "";
    }
    out.push(row);
  }
  return out;
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
}
function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)\\s*=\\s*["']${name}["'][^>]*>`, "i");
  const m = html.match(re);
  return m ? m[0].match(/content\s*=\s*["']([^"']*)["']/i)?.[1] ?? "" : "";
}

// Best-effort markdown extraction — strip tags, collapse whitespace.
function htmlToMarkdown(html) {
  let body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
  body = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  // headers
  body = body.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${"#".repeat(+n)} ${t.replace(/<[^>]+>/g, "").trim()}\n\n`);
  // paragraphs / breaks
  body = body.replace(/<\/p>/gi, "\n\n");
  body = body.replace(/<br[^>]*>/gi, "\n");
  // links
  body = body.replace(/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => `[${t.replace(/<[^>]+>/g, "").trim()}](${href})`);
  // strip the rest
  body = body.replace(/<[^>]+>/g, " ");
  // entities (minimal)
  body = body.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  // squeeze
  body = body.replace(/[ \t]+/g, " ").replace(/\n\s+\n/g, "\n\n").replace(/\n{3,}/g, "\n\n").trim();
  return body;
}

// ---------- fetcher ----------
async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return await res.text();
}
async function fetchBinary(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------- crawler ----------
async function crawl(entry) {
  const origin = new URL(entry).origin;
  const seen = new Set();
  const queue = [entry];
  const pages = [];
  const images = new Map();   // original-url -> { src, slug }
  const docs = new Map();     // url -> { src, slug }

  while (queue.length && pages.length < MAX_PAGES) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);

    try {
      console.log(`fetch  ${url}`);
      const html = await fetchText(url);

      // save raw HTML
      const slug = slugify(url);
      await mkdir(path.join(OUT, "html"), { recursive: true });
      await writeFile(path.join(OUT, "html", `${slug}.html`), html);

      // save markdown best-effort
      await mkdir(path.join(OUT, "content"), { recursive: true });
      await writeFile(path.join(OUT, "content", `${slug}.md`),
        `---\nurl: ${url}\ntitle: ${extractTitle(html).replace(/\n/g, " ")}\ndescription: ${extractMeta(html, "description")}\n---\n\n${htmlToMarkdown(html)}\n`
      );

      // find links
      const anchors = extractAttributes(html, "a", ["href"]);
      for (const a of anchors) {
        if (!a.href) continue;
        let abs;
        try { abs = new URL(a.href, url).toString(); } catch { continue; }
        if (!abs.startsWith(origin)) continue;
        if (/#|mailto:|tel:/.test(abs.split("#")[0]) && /#|mailto:|tel:/.test(abs)) continue;
        const clean = abs.split("#")[0];
        // docs
        if (/\.(pdf|docx?|xlsx?|pptx?|zip|csv|txt)(\?|$)/i.test(clean)) {
          if (!docs.has(clean)) docs.set(clean, { src: url });
          continue;
        }
        // pages
        if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean);
      }

      // find images
      const imgs = extractAttributes(html, "img", ["src", "srcset", "data-src"]);
      for (const img of imgs) {
        for (const attr of ["src", "data-src"]) {
          const v = img[attr];
          if (!v) continue;
          let abs;
          try { abs = new URL(v, url).toString(); } catch { continue; }
          const orig = wixOriginal(abs);
          if (!images.has(orig)) images.set(orig, { src: url });
        }
        if (img.srcset) {
          for (const part of img.srcset.split(",")) {
            const u = part.trim().split(/\s+/)[0];
            if (!u) continue;
            let abs;
            try { abs = new URL(u, url).toString(); } catch { continue; }
            const orig = wixOriginal(abs);
            if (!images.has(orig)) images.set(orig, { src: url });
          }
        }
      }

      // find <source srcset>
      const sources = extractAttributes(html, "source", ["srcset"]);
      for (const s of sources) {
        if (!s.srcset) continue;
        for (const part of s.srcset.split(",")) {
          const u = part.trim().split(/\s+/)[0];
          if (!u) continue;
          let abs;
          try { abs = new URL(u, url).toString(); } catch { continue; }
          const orig = wixOriginal(abs);
          if (!images.has(orig)) images.set(orig, { src: url });
        }
      }

      // find og:image
      const og = extractMeta(html, "og:image");
      if (og) {
        let abs;
        try { abs = new URL(og, url).toString(); } catch {}
        if (abs) {
          const orig = wixOriginal(abs);
          if (!images.has(orig)) images.set(orig, { src: url });
        }
      }

      pages.push({ url, slug, title: extractTitle(html) });
      await sleep(DELAY);
    } catch (err) {
      console.error(`error  ${url} — ${err.message}`);
    }
  }

  return { pages, images, docs };
}

// ---------- download ----------
async function downloadAssets(images, docs) {
  let ok = 0, fail = 0, skip = 0;

  // images: organize by stock vs site
  for (const [url] of images) {
    const isStock = isWixStock(url);
    if (isStock && !INCLUDE_STOCK) { skip++; continue; }
    const filename = url.split("/").pop().split("?")[0];
    const dir = isStock ? "stock" : "site";
    const out = path.join(OUT, "assets", "images", dir, filename);
    if (existsSync(out)) { skip++; continue; }
    try {
      const buf = await fetchBinary(url);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, buf);
      console.log(`  ✓ images/${dir}/${filename}`);
      ok++;
      await sleep(DELAY);
    } catch (err) {
      console.log(`  ✗ ${url} — ${err.message}`);
      fail++;
    }
  }

  // docs
  for (const [url] of docs) {
    const filename = decodeURIComponent(url.split("/").pop().split("?")[0]);
    const out = path.join(OUT, "assets", "documents", filename);
    if (existsSync(out)) { skip++; continue; }
    try {
      const buf = await fetchBinary(url);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, buf);
      console.log(`  ✓ documents/${filename}`);
      ok++;
      await sleep(DELAY);
    } catch (err) {
      console.log(`  ✗ ${url} — ${err.message}`);
      fail++;
    }
  }

  return { ok, fail, skip };
}

// ---------- main ----------
async function main() {
  await mkdir(OUT, { recursive: true });

  console.log(`\nScraping: ${ENTRY}`);
  console.log(`Output:   ${OUT}\n`);

  const { pages, images, docs } = await crawl(ENTRY);

  const manifest = {
    source: ENTRY,
    crawled_at: new Date().toISOString(),
    page_count: pages.length,
    image_count: images.size,
    doc_count: docs.size,
    pages: pages.map((p) => ({ url: p.url, slug: p.slug, title: p.title })),
    images: [...images.entries()].map(([url, meta]) => ({
      url,
      is_stock: isWixStock(url),
      found_on: meta.src,
    })),
    documents: [...docs.entries()].map(([url, meta]) => ({ url, found_on: meta.src })),
  };

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\nCrawled ${pages.length} pages, found ${images.size} images, ${docs.size} documents.`);

  if (DO_DOWNLOAD) {
    console.log("\nDownloading assets...\n");
    const r = await downloadAssets(images, docs);
    console.log(`\n${r.ok} downloaded, ${r.skip} skipped, ${r.fail} failed.`);
  } else {
    console.log("\n(--no-download set, manifest only)");
  }

  console.log(`\nDone. See ${OUT}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
