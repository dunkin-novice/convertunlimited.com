#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { TRUST_PAGES } = require("./data/trust-pages");

const ROOT = process.cwd();
const FINDINGS = [];

const banned = [
  /100%\s+private/i,
  /nothing is sent/i,
  /guaranteed secure/i,
  /military-?grade/i,
  /zero risk/i,
  /no one can see/i,
];

function routeFor(page) {
  return page.slug ? `/trust/${page.slug}/` : "/trust/";
}

function readRoute(route) {
  const file = path.join(ROOT, route.replace(/^\/+|\/+$/g, ""), "index.html");
  if (!fs.existsSync(file)) {
    FINDINGS.push(`${route}: missing index.html`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

for (const page of TRUST_PAGES) {
  const route = routeFor(page);
  const html = readRoute(route);
  if (!html) continue;

  if (!html.includes(`<link rel="canonical" href="https://convertunlimited.com${route}">`)) {
    FINDINGS.push(`${route}: missing canonical`);
  }
  if (!html.includes('"@type":"BreadcrumbList"')) FINDINGS.push(`${route}: missing BreadcrumbList JSON-LD`);
  if (!html.includes('"@type":"FAQPage"')) FINDINGS.push(`${route}: missing FAQPage JSON-LD`);
  if (!html.includes(`"@type":"${page.type}"`)) FINDINGS.push(`${route}: missing ${page.type} JSON-LD`);
  if (!page.slug && !html.includes('"@type":"ItemList"')) FINDINGS.push(`${route}: missing ItemList JSON-LD`);
  if (!html.includes('id="answer-first"')) FINDINGS.push(`${route}: missing answer-first section`);
  if (!html.includes("privacy.convertunlimited.com")) FINDINGS.push(`${route}: missing privacy build link/copy`);
  if (!html.includes("/trust/verification/")) FINDINGS.push(`${route}: missing verification trust link`);
  if (!html.includes("Trust documentation reviewed: May 2026")) FINDINGS.push(`${route}: missing operator freshness note`);
  for (const pattern of banned) {
    if (pattern.test(html)) FINDINGS.push(`${route}: banned trust overclaim ${pattern}`);
  }
}

const sitemap = fs.existsSync(path.join(ROOT, "sitemap.xml")) ? fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8") : "";
for (const page of TRUST_PAGES) {
  const route = routeFor(page);
  if (sitemap && !sitemap.includes(`https://convertunlimited.com${route}`)) {
    FINDINGS.push(`${route}: missing sitemap entry`);
  }
}

if (FINDINGS.length) {
  console.error("Trust-page validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Trust-page validation passed for ${TRUST_PAGES.length} pages.`);
