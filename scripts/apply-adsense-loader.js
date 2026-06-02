#!/usr/bin/env node
// Adds Google AdSense Auto Ads loader to every production HTML file.
// Loader only — no manual <ins> units, no hidden placeholders. Idempotent.
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP = new Set([".git", "dist", "node_modules", "vendor", ".wrangler"]);
const ADSENSE_CLIENT = "ca-pub-2823470980745945";
const LOADER = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;
const LOADER_MARKER = "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.isFile() && e.name.endsWith(".html")) files.push(full);
  }
  return files;
}

let added = 0;
let already = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(LOADER_MARKER)) { already += 1; continue; }
  if (/<link rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/(<link rel="canonical"[^>]*>)/i, `$1\n    ${LOADER}`);
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${LOADER}\n</head>`);
  } else {
    continue;
  }
  fs.writeFileSync(file, html);
  added += 1;
}
console.log(`AdSense loader added to ${added} files (${already} already had it).`);
