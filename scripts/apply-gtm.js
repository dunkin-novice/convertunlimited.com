#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GTM_ID = "GTM-KQHC5ZGV";
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);

const HEAD_SNIPPET = `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->`;

const BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function stripExistingGtm(html) {
  return html
    .replace(/\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe\s+src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-[A-Z0-9]+"[\s\S]*?<\/iframe><\/noscript>\s*<!-- End Google Tag Manager \(noscript\) -->\s*/gi, "\n")
    .replace(/\s*<!-- Google Tag Manager -->\s*<script>\(function\(w,d,s,l,i\)\{[\s\S]*?googletagmanager\.com\/gtm\.js\?id=[\s\S]*?<\/script>\s*<!-- End Google Tag Manager -->\s*/gi, "\n");
}

let changed = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let html = stripExistingGtm(original);
  if (!/<head[^>]*>/i.test(html)) throw new Error(`${path.relative(ROOT, file)}: missing <head>`);
  if (!/<body[^>]*>/i.test(html)) throw new Error(`${path.relative(ROOT, file)}: missing <body>`);
  html = html.replace(/<head([^>]*)>/i, `<head$1>\n    ${HEAD_SNIPPET}`);
  html = html.replace(/<body([^>]*)>/i, `<body$1>\n    ${BODY_SNIPPET}`);
  if (html !== original) {
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
}

console.log(`Applied GTM ${GTM_ID} to ${changed} HTML files.`);
