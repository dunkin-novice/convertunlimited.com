#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { INTENT_PAGES } = require("./data/intent-pages");
const { isIndexableRoute } = require("./data/index-policy");

const ROOT = process.cwd();
const BASE_URL = "https://convertunlimited.com";
const FINDINGS = [];
const BANNED = [
  /100%\s+private/i,
  /nothing is sent/i,
  /nothing is uploaded/i,
  /guaranteed secure/i,
  /maximum privacy/i,
  /total privacy/i,
  /files never leave your device/i,
  /files never leave your browser/i,
  /your files never leave/i,
  /zero risk/i,
  /military-?grade/i
];

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function routeFile(route) {
  return path.join(ROOT, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

function routeExists(route) {
  if (route === "/") return fs.existsSync(path.join(ROOT, "index.html"));
  return fs.existsSync(routeFile(route));
}

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta name="description" content="([^"]*)">/i);
  return match ? match[1].trim() : "";
}

function anchors(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

const seenTitles = new Map();
const seenDescriptions = new Map();
const sitemap = fs.existsSync(path.join(ROOT, "sitemap.xml")) ? fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8") : "";
const paths = new Set();
const HUB_ROUTES = ["/alternatives/", "/best/", "/compare/", "/guides/"];

for (const page of INTENT_PAGES) {
  if (paths.has(page.path)) FINDINGS.push(`${page.path}: duplicate intent path`);
  paths.add(page.path);

  const file = routeFile(page.path);
  if (!fs.existsSync(file)) {
    FINDINGS.push(`${page.path}: generated file missing`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const relative = rel(file);
  const canonical = `${BASE_URL}${page.path}`;

  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) FINDINGS.push(`${relative}: missing canonical`);
  if (!html.includes(`hreflang="x-default" href="${canonical}"`)) FINDINGS.push(`${relative}: missing x-default hreflang`);
  if (!/"@type":"FAQPage"/.test(html)) FINDINGS.push(`${relative}: missing FAQ JSON-LD`);
  if (!/class="article aeo-summary" id="answer-first"/.test(html)) FINDINGS.push(`${relative}: missing answer-first AEO summary`);
  if (page.answer && page.answer === page.summary) FINDINGS.push(`${relative}: answer-first copy duplicates hero summary`);
  if (page.answer && !html.includes(`<p>${page.answer.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")}</p>`)) {
    FINDINGS.push(`${relative}: answer-first copy was not rendered`);
  }
  if (!/<section class="article" id="limitations">/.test(html)) FINDINGS.push(`${relative}: missing limitations section`);
  if (!/class="article CTA"/.test(html)) FINDINGS.push(`${relative}: missing internal CTA`);
  if (!/comparison-table/.test(html) && ["alternative", "best", "comparison"].includes(page.type)) FINDINGS.push(`${relative}: expected comparison table`);

  for (const pattern of BANNED) {
    if (pattern.test(html)) FINDINGS.push(`${relative}: banned privacy or security claim ${pattern}`);
  }

  const title = extractTitle(html);
  const description = extractMetaDescription(html);
  if (seenTitles.has(title)) FINDINGS.push(`${relative}: duplicate title with ${seenTitles.get(title)}`);
  else seenTitles.set(title, relative);
  if (seenDescriptions.has(description)) FINDINGS.push(`${relative}: duplicate meta description with ${seenDescriptions.get(description)}`);
  else seenDescriptions.set(description, relative);

  for (const tool of page.relatedTools || []) {
    const route = tool === "image-converter" ? "/" : `/${tool}/`;
    if (!routeExists(route)) FINDINGS.push(`${relative}: related tool route missing ${route}`);
    if (!html.includes(`href="${route}"`)) FINDINGS.push(`${relative}: related tool not linked ${route}`);
  }

  for (const href of page.guideLinks || []) {
    if (!routeExists(href)) FINDINGS.push(`${relative}: guide link route missing ${href}`);
    if (!html.includes(`href="${href}"`)) FINDINGS.push(`${relative}: guide link not rendered ${href}`);
  }

  for (const href of anchors(html)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (!routeExists(href)) FINDINGS.push(`${relative}: internal link does not resolve ${href}`);
  }

  if (isIndexableRoute(page.path)) {
    if (!html.includes('<meta name="robots" content="index,follow,max-image-preview:large">')) FINDINGS.push(`${relative}: indexable page missing index robots`);
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) FINDINGS.push(`${relative}: sitemap missing ${canonical}`);
  } else {
    if (!html.includes('<meta name="robots" content="noindex,follow">')) FINDINGS.push(`${relative}: noindex page missing noindex robots`);
    if (sitemap.includes(`<loc>${canonical}</loc>`)) FINDINGS.push(`${relative}: noindex page remains in sitemap ${canonical}`);
  }
}

for (const route of HUB_ROUTES) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) {
    FINDINGS.push(`${route}: hub page missing`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const canonical = `${BASE_URL}${route}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) FINDINGS.push(`${route}: missing hub canonical`);
  if (!/"@type":"FAQPage"/.test(html)) FINDINGS.push(`${route}: missing hub FAQ JSON-LD`);
  if (!/class="article aeo-summary" id="answer-first"/.test(html)) FINDINGS.push(`${route}: missing hub answer-first block`);
  if (isIndexableRoute(route)) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) FINDINGS.push(`${route}: sitemap missing hub ${canonical}`);
  } else {
    if (!html.includes('<meta name="robots" content="noindex,follow">')) FINDINGS.push(`${route}: noindex hub missing noindex robots`);
    if (sitemap.includes(`<loc>${canonical}</loc>`)) FINDINGS.push(`${route}: noindex hub remains in sitemap ${canonical}`);
  }
}

const homeHtml = fs.existsSync(path.join(ROOT, "index.html")) ? fs.readFileSync(path.join(ROOT, "index.html"), "utf8") : "";
for (const route of HUB_ROUTES) {
  if (!homeHtml.includes(`href="${route}"`)) FINDINGS.push(`index.html: missing discoverability link to ${route}`);
}

for (const page of INTENT_PAGES) {
  const route = page.path;
  const sourceRoutes = HUB_ROUTES.filter((hubRoute) => {
    const file = routeFile(hubRoute);
    return fs.existsSync(file) && fs.readFileSync(file, "utf8").includes(`href="${route}"`);
  });
  if (!sourceRoutes.length) FINDINGS.push(`${route}: not linked from any intent hub`);
}

if (FINDINGS.length) {
  console.error("Intent-page validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Intent-page validation passed for ${INTENT_PAGES.length} pages.`);
