#!/usr/bin/env node
// Adds author (Person → dunkin-novice) and dateModified to SoftwareApplication,
// TechArticle, AboutPage, ContactPage, and WebApplication JSON-LD blocks on
// indexable pages. Skips noindex pages. Idempotent.
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP = new Set([".git", "dist", "node_modules", "vendor", ".wrangler"]);
const TODAY = "2026-06-03";
const AUTHOR = { "@type": "Person", "name": "dunkin-novice", "url": "https://github.com/dunkin-novice" };
const ENRICH_TYPES = new Set([
  "SoftwareApplication",
  "TechArticle",
  "AboutPage",
  "ContactPage",
  "WebApplication",
  "Article",
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name === "index.html") out.push(full);
  }
  return out;
}

function isIndexable(html) {
  const m = html.match(/<meta name="robots" content="([^"]+)"/);
  if (!m) return true; // default to indexable if no robots tag
  return !/noindex/i.test(m[1]);
}

function enrichBlock(jsonStr) {
  let obj;
  try { obj = JSON.parse(jsonStr); } catch { return null; }
  const type = obj["@type"];
  if (!type || !ENRICH_TYPES.has(type)) return null;
  let changed = false;
  // Add Person author if missing OR if existing author is Organization-only
  if (!obj.author) {
    obj.author = AUTHOR;
    changed = true;
  } else if (obj.author["@type"] === "Organization" && !Array.isArray(obj.author)) {
    obj.author = [AUTHOR, obj.author];
    changed = true;
  }
  if (!obj.dateModified) {
    obj.dateModified = TODAY;
    changed = true;
  }
  return changed ? JSON.stringify(obj) : null;
}

let pagesTouched = 0;
let blocksTouched = 0;
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, "utf8");
  if (!isIndexable(html)) continue;
  let out = html;
  let local = 0;
  out = out.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (m, body) => {
      const enriched = enrichBlock(body.trim());
      if (enriched === null) return m;
      local += 1;
      return `<script type="application/ld+json">${enriched}</script>`;
    }
  );
  if (local > 0) {
    fs.writeFileSync(file, out);
    pagesTouched += 1;
    blocksTouched += local;
  }
}
console.log(`Enriched ${blocksTouched} JSON-LD blocks across ${pagesTouched} indexable pages.`);
