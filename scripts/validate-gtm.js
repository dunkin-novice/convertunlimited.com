#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GTM_ID = "GTM-KQHC5ZGV";
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const FINDINGS = [];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, "utf8");
  const relative = rel(file);
  const headCount = countMatches(html, /googletagmanager\.com\/gtm\.js\?id=/g);
  const noscriptCount = countMatches(html, /googletagmanager\.com\/ns\.html\?id=/g);
  const allContainerIds = [...html.matchAll(/GTM-[A-Z0-9]+/g)].map((match) => match[0]);

  if (headCount !== 1) FINDINGS.push(`${relative}: expected one GTM head script, found ${headCount}`);
  if (noscriptCount !== 1) FINDINGS.push(`${relative}: expected one GTM noscript iframe, found ${noscriptCount}`);
  for (const id of allContainerIds) {
    if (id !== GTM_ID) FINDINGS.push(`${relative}: unexpected GTM container ${id}`);
  }

  const headOpen = html.search(/<head[^>]*>/i);
  const gtmHead = html.indexOf("googletagmanager.com/gtm.js?id=");
  const adsense = html.indexOf("pagead2.googlesyndication.com");
  const ga4 = html.indexOf("googletagmanager.com/gtag/js");
  if (headOpen === -1 || gtmHead === -1 || gtmHead < headOpen) {
    FINDINGS.push(`${relative}: GTM head script is not inside <head>`);
  }
  if (adsense !== -1 && gtmHead > adsense) {
    FINDINGS.push(`${relative}: GTM head script appears after AdSense`);
  }
  if (ga4 !== -1 && gtmHead > ga4) {
    FINDINGS.push(`${relative}: GTM head script appears after GA4`);
  }

  const bodyImmediate = /<body([^>]*)>\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe\s+src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-KQHC5ZGV"/i;
  if (!bodyImmediate.test(html)) {
    FINDINGS.push(`${relative}: GTM noscript is not immediately after opening <body>`);
  }
}

if (FINDINGS.length) {
  console.error("GTM validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`GTM validation passed for ${walk(ROOT).length} HTML files.`);
