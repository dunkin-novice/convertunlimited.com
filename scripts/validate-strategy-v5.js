#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const FINDINGS = [];

const BANNED = [
  /100%\s+private/i,
  /100%\s+privacy/i,
  /maximum privacy/i,
  /total privacy/i,
  /complete privacy/i,
  /completely private/i,
  /nothing is sent/i,
  /nothing is uploaded/i,
  /no one else sees/i,
  /military-?grade/i,
  /zero-knowledge/i,
  /files never leave your device/i,
  /files never leave your browser/i,
  /your files never leave/i,
];

const MIXED_LANGUAGE = [
  /ファイルจาก/,
  /và các chuyển/,
  /และ các/,
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && /\.(html|txt|md)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function htmlFiles() {
  return walk(ROOT).filter((file) => file.endsWith("index.html"));
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function routeFor(file) {
  const r = rel(file);
  if (r === "index.html") return "/";
  return `/${r.replace(/index\.html$/, "")}`;
}

function checkTextFiles() {
  for (const file of walk(ROOT)) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of BANNED) {
      if (pattern.test(text)) FINDINGS.push(`${rel(file)}: banned privacy overclaim ${pattern}`);
    }
    for (const pattern of MIXED_LANGUAGE) {
      if (pattern.test(text)) FINDINGS.push(`${rel(file)}: mixed-language fragment ${pattern}`);
    }
  }
}

function checkHtmlBasics() {
  for (const file of htmlFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (!/<link rel="canonical" href="https:\/\/www\.convertunlimited\.com\/[^"]*">/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing canonical`);
    }
    if (!/hreflang="x-default"/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing x-default hreflang`);
    }
    if (!/application\/ld\+json/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing JSON-LD`);
    }
  }
}

function checkLocaleSwitcherRoutes() {
  const routePattern = /^\/(?:th|vi|zh|ja|ko|es|fr)?\/?$/;
  for (const file of htmlFiles()) {
    const currentRoute = routeFor(file);
    if (currentRoute === "/" || /^\/(?:th|vi|zh|ja|ko|es|fr)\/$/.test(currentRoute)) continue;
    const text = fs.readFileSync(file, "utf8");
    const anchors = [...text.matchAll(/<a href="([^"]+)" hreflang="(en|th|vi|zh-Hans|ja|ko|es|fr)" lang="[^"]+"/g)];
    if (!anchors.length) continue;
    for (const [, href, hreflang] of anchors) {
      if (routePattern.test(href)) {
        FINDINGS.push(`${rel(file)}: locale switcher for ${hreflang} points to home route ${href}`);
      }
    }
  }
}

function checkLlms() {
  const llms = path.join(ROOT, "llms.txt");
  if (!fs.existsSync(llms)) {
    FINDINGS.push("llms.txt: missing");
    return;
  }
  const text = fs.readFileSync(llms, "utf8");
  for (const required of [
    "https://www.convertunlimited.com/",
    "https://privacy.convertunlimited.com/",
    "use the privacy build for privacy-sensitive workflows",
    "file contents are not intentionally uploaded",
  ]) {
    if (!text.toLowerCase().includes(required.toLowerCase())) {
      FINDINGS.push(`llms.txt: missing required guidance "${required}"`);
    }
  }
}

checkTextFiles();
checkHtmlBasics();
checkLocaleSwitcherRoutes();
checkLlms();

if (FINDINGS.length) {
  console.error("Strategy v5 validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Strategy v5 validation passed.");
