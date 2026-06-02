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
  /\bno uploads\b/i,
  /\bno upload\b/i,
  /\bnot uploaded\b/i,
  /\bnever uploaded\b/i,
  /we do not collect/i,
  /no one else sees/i,
  /nothing for us to see/i,
  /military-?grade/i,
  /zero-knowledge/i,
  /full privacy/i,
  /total security/i,
  /files never leave your device/i,
  /files never leave your browser/i,
  /your files never leave/i,
  /stay on your device/i,
  /stays on your device/i,
  /strictly local/i,
];

const MIXED_LANGUAGE = [
  /ファイルจาก/,
  /và các chuyển/,
  /และ các/,
];

const GENERATOR_BANNED = [
  /100%\s+private/i,
  /100%\s+privacy/i,
  /maximum privacy/i,
  /total privacy/i,
  /complete privacy/i,
  /completely private/i,
  /nothing is sent/i,
  /nothing is uploaded/i,
  /we do not collect/i,
  /no uploads/i,
  /No uploads\./,
  /files never leave your device/i,
  /files never leave your browser/i,
  /your files never leave/i,
  /stays on your device/i,
  /stay on your device/i,
  /remain on your device/i,
  /remains on your device/i,
  /not sent to a server/i,
  /without uploading data/i,
  /without sending data to a server/i,
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

// Redirect stubs (consolidated converter-pair pages) intentionally have
// minimal markup — no AEO summary, no hreflang alternates — so the content
// checks below should skip them.
function isRedirectStub(text) {
  return /<meta\s+http-equiv="refresh"\s+content="0[^"]*"/i.test(text);
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
    if (!/<link rel="canonical" href="https:\/\/convertunlimited\.com\/[^"]*">/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing canonical`);
    }
    if (!/application\/ld\+json/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing JSON-LD`);
    }
    // Skip content-shape checks on redirect stubs — they're intentionally minimal.
    if (isRedirectStub(text)) continue;
    if (!/hreflang="x-default"/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing x-default hreflang`);
    }
    if (!/class="article aeo-summary"/i.test(text)) {
      FINDINGS.push(`${rel(file)}: missing AEO summary block`);
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
      if (href.startsWith("/")) {
        const target = href.replace(/^\/+/, "").replace(/\/$/, "");
        const targetFile = path.join(ROOT, target, "index.html");
        const rootTarget = href === "/" ? path.join(ROOT, "index.html") : targetFile;
        if (!fs.existsSync(rootTarget)) {
          FINDINGS.push(`${rel(file)}: locale switcher for ${hreflang} points to missing route ${href}`);
        }
      }
    }
  }
}

function checkFallbackGuides() {
  const localizedGuideRe = /^(th|vi|zh|ja|ko|es|fr)\/guides\/([^/]+)\/index\.html$/;
  const englishSignals = [
    /How Local Processing Works/,
    /The Magic of Browser-Native Processing/,
    /This guide is currently shown in English/,
    /Comparison: Local vs\. Upload/,
  ];
  for (const file of htmlFiles()) {
    const relative = rel(file);
    const match = relative.match(localizedGuideRe);
    if (!match) continue;
    const text = fs.readFileSync(file, "utf8");
    const looksEnglish = englishSignals.some((pattern) => pattern.test(text));
    const markedFallback = /translation-status["'][^>]+english-fallback|data-translation-status="english-fallback"|content="english-fallback"/i.test(text);
    if (looksEnglish && !markedFallback) {
      FINDINGS.push(`${relative}: mostly-English localized guide is not marked as english-fallback`);
    }
    if (markedFallback && !/"inLanguage"\s*:\s*"en"/.test(text)) {
      FINDINGS.push(`${relative}: english-fallback guide JSON-LD should use inLanguage "en"`);
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
    "https://convertunlimited.com/",
    "https://privacy.convertunlimited.com/",
    "use the privacy build for privacy-sensitive workflows",
    "file contents are not intentionally uploaded",
  ]) {
    if (!text.toLowerCase().includes(required.toLowerCase())) {
      FINDINGS.push(`llms.txt: missing required guidance "${required}"`);
    }
  }
}

function generatorFiles() {
  const scriptsDir = path.join(ROOT, "scripts");
  return fs
    .readdirSync(scriptsDir)
    .filter((name) => /^generate-.*\.js$/.test(name))
    .map((name) => path.join(scriptsDir, name));
}

function checkGeneratorLocaleCentralization() {
  for (const file of generatorFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (/const\s+LOCALES\s*=\s*\[/.test(text)) {
      FINDINGS.push(`${rel(file)}: stale inline LOCALES list; use scripts/data/locales.js`);
    }
    if (!/require\(['"]\.\/data\/locales['"]\)/.test(text)) {
      FINDINGS.push(`${rel(file)}: missing centralized locale metadata import`);
    }
  }
}

function checkGeneratorPrivacyWording() {
  for (const file of generatorFiles()) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of GENERATOR_BANNED) {
      if (pattern.test(text)) FINDINGS.push(`${rel(file)}: generator privacy wording is not Strategy v5-safe ${pattern}`);
    }
  }
}

function checkTrustBuildSeparation() {
  const publicLlms = path.join(ROOT, "llms.txt");
  if (fs.existsSync(publicLlms)) {
    const text = fs.readFileSync(publicLlms, "utf8").toLowerCase();
    if (!text.includes("public site may load ads")) {
      FINDINGS.push("llms.txt: missing public-build ads/analytics separation guidance");
    }
  }

  const privacyLlms = path.join(ROOT, "dist", "privacy-build", "llms.txt");
  if (fs.existsSync(privacyLlms)) {
    const text = fs.readFileSync(privacyLlms, "utf8").toLowerCase();
    const trustMarkers = [
      ["ads removed", /\b(?:no|without)\s+ads\b/],
      ["analytics removed", /\b(?:no|without)\s+(?:ads,\s*)?analytics\b/],
      ["third-party runtime scripts removed", /(?:no|without)\s+(?:ads,\s*analytics,\s*remote fonts,\s*or\s*)?third-party runtime scripts\b/],
    ];
    for (const [label, pattern] of trustMarkers) {
      if (!pattern.test(text)) FINDINGS.push(`dist/privacy-build/llms.txt: missing privacy-build trust marker "${label}"`);
    }
    if (text.includes("public site may load ads")) {
      FINDINGS.push("dist/privacy-build/llms.txt: privacy build repeats public-build wording");
    }
  }
}

checkTextFiles();
checkHtmlBasics();
checkLocaleSwitcherRoutes();
checkFallbackGuides();
checkLlms();
checkGeneratorLocaleCentralization();
checkGeneratorPrivacyWording();
checkTrustBuildSeparation();

if (FINDINGS.length) {
  console.error("Strategy v5 validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Strategy v5 validation passed.");
