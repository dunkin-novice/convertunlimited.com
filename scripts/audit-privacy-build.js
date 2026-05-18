#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "dist", "privacy-build");
const FINDINGS = [];

const DISALLOWED = [
  /https:\/\/www\.googletagmanager\.com/i,
  /https:\/\/www\.google-analytics\.com/i,
  /https:\/\/pagead2\.googlesyndication\.com/i,
  /https:\/\/googleads\.g\.doubleclick\.net/i,
  /https:\/\/fonts\.googleapis\.com/i,
  /https:\/\/fonts\.gstatic\.com/i,
  /https:\/\/cdnjs\.cloudflare\.com/i,
  /https:\/\/unpkg\.com/i,
  /https:\/\/cdn\.jsdelivr\.net/i,
  /static\.cloudflareinsights\.com/i,
  /recaptcha/i,
  /gtag\(/i,
  /\bgtag\b/i,
  /adsbygoogle/i,
  /\bbanner-ad\b/i,
  /\bfooter-ad\b/i,
  /\bad-slot\b/i,
  /privacy-build-hidden/i,
  /Google Analytics/i,
  /Google AdSense/i,
  /AdSense slot/i,
  /DoubleClick/i,
  /https:\/\/www\.convertunlimited\.com/i,
  /100% private/i,
  /100% privacy/i,
  /zero privacy risk/i,
  /nothing is sent/i,
  /no one can see/i,
  /military-?grade/i,
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      if (name === "vendor") continue;
      walk(file);
      continue;
    }
    if (!/\.(html|js|css|json|xml|txt)$/i.test(name)) continue;
    const rel = path.relative(TARGET, file);
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of DISALLOWED) {
      if (pattern.test(text)) FINDINGS.push(`${rel}: ${pattern}`);
    }
  }
}

if (!fs.existsSync(TARGET)) {
  console.error("dist/privacy-build does not exist. Run: node scripts/build-privacy.js");
  process.exit(1);
}

walk(TARGET);

if (FINDINGS.length) {
  console.error("Privacy build audit failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Privacy build static audit passed.");
