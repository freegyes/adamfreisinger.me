#!/usr/bin/env node
/**
 * Post-build consistency checks.
 *
 * Run after `npm run build`. Exits 1 on failure so CI blocks the deploy.
 *
 * Checks:
 *   1. Any page with data-glightbox must load glightbox.min.js
 *   2. All cdn.jsdelivr.net resources must carry SRI integrity hashes
 *   3. All <img> elements must have an alt attribute
 *      (empty alt="" is correct for decorative images — only a missing attribute fails)
 *   4. Internal /img/ and /assets/ references must resolve to real files on disk
 */

const { readFileSync, readdirSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const SITE = "_site";

if (!existsSync(SITE)) {
  console.error(`Build output not found at ./${SITE} — run 'npm run build' first.`);
  process.exit(1);
}

let failures = 0;

function fail(file, msg) {
  console.error(`  FAIL  ${file}: ${msg}`);
  failures++;
}

function walkHtml(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkHtml(full));
    else if (entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}

// Strip <script> blocks before HTML-level checks to avoid false positives
// from embedded JSON (e.g. window.__PHOTOS__ contains <img> strings).
function withoutScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

const pages = walkHtml(SITE);

for (const file of pages) {
  const label = file.slice(SITE.length + 1);
  const raw = readFileSync(file, "utf8");
  const html = withoutScripts(raw);

  // 1. GLightbox JS must be present on any page that uses data-glightbox.
  //    Check html (stripped) for the attribute, raw for the script src tag.
  if (html.includes("data-glightbox") && !raw.includes("glightbox.min.js")) {
    fail(label, "uses data-glightbox but does not load glightbox.min.js");
  }

  // 2. All cdn.jsdelivr.net <script> and <link> tags must have SRI integrity hashes.
  //    (FontAwesome kit and Plausible are excluded — they serve dynamic/account-specific
  //    bundles that can't have static hashes.)
  for (const [, tag] of raw.matchAll(/(<(?:script|link)\b[^>]+cdn\.jsdelivr\.net[^>]*>)/gi)) {
    if (!tag.includes("integrity=")) {
      fail(label, `jsdelivr resource missing SRI: ${tag.replace(/\s+/g, " ").slice(0, 100)}`);
    }
  }

  // 3. <img> elements must have an alt attribute.
  //    Empty alt="" is correct for decorative images — only a missing attribute is wrong.
  for (const [, attrs] of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/i.test(attrs)) {
      fail(label, `<img> missing alt attribute: <img${attrs.slice(0, 60)}>`);
    }
  }

  // 4. Internal /img/ and /assets/ src/href references must exist on disk.
  for (const [, url] of html.matchAll(/(?:src|href)="(\/(img|assets)[^"#?]*)"/gi)) {
    if (!existsSync(join(SITE, url))) {
      fail(label, `broken asset reference: ${url}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} check${failures === 1 ? "" : "s"} failed.`);
  process.exit(1);
} else {
  console.log(`All checks passed (${pages.length} pages).`);
}
