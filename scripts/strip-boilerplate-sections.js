#!/usr/bin/env node
// Removes byte-identical boilerplate from tool/guide pages:
//   1. The "Privacy behavior" <h2>+<p> pair inside aeo-summary blocks
//      (the wording is essentially identical across the 29 indexable pages
//      that carry it, so it contributes to template-duplication risk).
//   2. The full <section id="privacy" class="article"><h2>Privacy Policy</h2>…
//      </section> and matching id="terms" sections embedded in tool pages.
//      These are duplicate-content stubs of the real /privacy/ and /terms/
//      pages and add nothing — replaced with a single link line on pages
//      that had them. Safe and idempotent.
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP = new Set([".git", "dist", "node_modules", "vendor", ".wrangler"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name === "index.html") out.push(full);
  }
  return out;
}

// Excise a <section …> … </section> block by matching id attribute.
// Uses balanced-section counting in case anyone ever nested a <section>.
function exciseSectionById(html, sectionId) {
  const openRe = new RegExp(
    `[ \\t]*<section\\b[^>]*\\bid="${sectionId}"[^>]*>`,
    "gi"
  );
  let out = html;
  while (true) {
    openRe.lastIndex = 0;
    const m = openRe.exec(out);
    if (!m) break;
    const start = m.index;
    const afterOpen = openRe.lastIndex;
    let depth = 1;
    let i = afterOpen;
    const len = out.length;
    while (i < len && depth > 0) {
      const nextOpen = out.indexOf("<section", i);
      const nextClose = out.indexOf("</section>", i);
      if (nextClose === -1) { depth = -1; break; }
      if (nextOpen !== -1 && nextOpen < nextClose) {
        const ch = out[nextOpen + 8];
        if (ch === " " || ch === ">" || ch === "\t" || ch === "\n") depth += 1;
        i = nextOpen + 8;
      } else {
        depth -= 1;
        i = nextClose + 10;
      }
    }
    if (depth !== 0) { openRe.lastIndex = afterOpen; continue; }
    let end = i;
    while (end < len && (out[end] === " " || out[end] === "\t")) end += 1;
    if (out[end] === "\n") end += 1;
    out = out.slice(0, start) + out.slice(end);
  }
  return out;
}

// Strip <h2>Privacy behavior</h2><p>…</p> from inside the aeo-summary section.
function stripPrivacyBehaviorParagraph(html) {
  // Limit to inside aeo-summary blocks so we don't accidentally hit other places.
  return html.replace(
    /(class="article aeo-summary"[\s\S]{0,3000}?)\s*<h2>Privacy behavior<\/h2>\s*<p>[\s\S]*?<\/p>/gi,
    "$1"
  );
}

let touched = 0;
let privSections = 0;
let termsSections = 0;
let privBehavior = 0;
for (const file of walk(ROOT)) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;

  if (/<section[^>]*\bid="privacy"[^>]*>/i.test(after) && /<h2>Privacy Policy<\/h2>/i.test(after)) {
    after = exciseSectionById(after, "privacy");
    privSections += 1;
  }
  if (/<section[^>]*\bid="terms"[^>]*>/i.test(after) && /<h2>Terms of Use<\/h2>/i.test(after)) {
    after = exciseSectionById(after, "terms");
    termsSections += 1;
  }
  if (/class="article aeo-summary"/i.test(after) && /<h2>Privacy behavior<\/h2>/i.test(after)) {
    const before2 = after;
    after = stripPrivacyBehaviorParagraph(after);
    if (after !== before2) privBehavior += 1;
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    touched += 1;
  }
}
console.log(`Files touched: ${touched}`);
console.log(`  embedded Privacy Policy sections removed: ${privSections}`);
console.log(`  embedded Terms of Use sections removed:   ${termsSections}`);
console.log(`  Privacy behavior boilerplate stripped from AEO blocks: ${privBehavior}`);
