#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const LOCALE_PREFIXES = new Set(["th", "vi", "zh", "ja", "ko", "es", "fr"]);
const EXCLUDED_PREFIXES = ["/best/", "/alternatives/", "/compare/"];
const TARGETS = ["/tools/", "/about/", "/contact/", "/privacy/", "/terms/", "/trust/"];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name === "index.html") files.push(full);
  }
  return files;
}

function routeFor(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function isAudited(route, html) {
  const first = route.split("/").filter(Boolean)[0] || "";
  if (LOCALE_PREFIXES.has(first)) return false;
  if (EXCLUDED_PREFIXES.some((prefix) => route.startsWith(prefix))) return false;
  const robots = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || "";
  return !/\bnoindex\b/i.test(robots);
}

function hasTarget(html, target) {
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<a\\b[^>]*href="${escaped}"`, "i").test(html);
}

const pages = walk(ROOT)
  .map((file) => ({ file, route: routeFor(file), html: fs.readFileSync(file, "utf8") }))
  .filter(({ route, html }) => isAudited(route, html));

const missingByPage = [];
const linkedFrom = new Map(TARGETS.map((target) => [target, []]));

for (const page of pages) {
  const missing = [];
  for (const target of TARGETS) {
    if (hasTarget(page.html, target)) linkedFrom.get(target).push(page.route);
    else missing.push(target);
  }
  if (missing.length) missingByPage.push(`${page.route}: ${missing.join(", ")}`);
}

console.log("Internal Link Recovery Audit");
console.log(`AUDITED_INDEXABLE_PAGES ${pages.length}`);
for (const target of TARGETS) {
  console.log(`${linkedFrom.get(target).length ? "PASS" : "FAIL"} ${target} linked from ${linkedFrom.get(target).length} audited pages`);
}
if (missingByPage.length) {
  console.error("FAIL pages missing recovery links:");
  for (const item of missingByPage.slice(0, 80)) console.error(`- ${item}`);
  if (missingByPage.length > 80) console.error(`- ... ${missingByPage.length - 80} more`);
  process.exit(1);
}
console.log("PASS all audited indexable English pages link to recovery targets.");
