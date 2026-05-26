#!/usr/bin/env node
// Removes AdSense-emitting markup from page-generator scripts so future
// regenerations do not reintroduce ads. Excludes privacy-build tooling that
// legitimately contains ad-removal regexes. Verifies JS syntax after each edit.
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SCRIPTS_DIR = path.join(process.cwd(), "scripts");

// Files that legitimately reference AdSense for *removal*/validation — leave alone.
const EXCLUDE = new Set([
  "strip-adsense.js",
  "strip-adsense-generators.js",
  "build-privacy.js",
  "audit-privacy-build.js",
  "apply-gtm.js",
  "validate-gtm.js",
  "apply-index-policy.js", // handled separately (no-op the recovery CSS fn)
]);

function exciseDivByClass(src, className) {
  const openRe = new RegExp(
    `[ \\t]*(?:<!--[^\\n]*-->[ \\t]*\\n[ \\t]*)?<div\\s+class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?">`,
    "gi"
  );
  let out = src;
  while (true) {
    openRe.lastIndex = 0;
    const m = openRe.exec(out);
    if (!m) break;
    const start = m.index;
    const afterOpen = openRe.lastIndex;
    let depth = 1;
    let i = afterOpen;
    const len = out.length;
    while (i < len && depth > 0) {
      const nextOpen = out.indexOf("<div", i);
      const nextClose = out.indexOf("</div>", i);
      if (nextClose === -1) { depth = -1; break; }
      if (nextOpen !== -1 && nextOpen < nextClose) {
        const ch = out[nextOpen + 4];
        if (ch === " " || ch === ">" || ch === "\t" || ch === "\n") depth += 1;
        i = nextOpen + 4;
      } else {
        depth -= 1;
        i = nextClose + 6;
      }
    }
    if (depth !== 0) { openRe.lastIndex = afterOpen; continue; }
    let end = i;
    while (end < len && (out[end] === " " || out[end] === "\t")) end += 1;
    if (out[end] === "\n") end += 1;
    out = out.slice(0, start) + out.slice(end);
  }
  return out;
}

function clean(src) {
  let out = src;
  // adsense meta (literal or ${ADSENSE})
  out = out.replace(/^[ \t]*<meta\s+name="google-adsense-account"[^>]*>\s*\n?/gim, "");
  // loader script
  out = out.replace(
    /^[ \t]*<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*\n?/gim,
    ""
  );
  // recovery css style block (literal)
  out = out.replace(/^[ \t]*<style id="ADSENSE_RECOVERY_CSS">[\s\S]*?<\/style>\s*\n?/gim, "");
  // ad div wrappers (balanced)
  out = exciseDivByClass(out, "banner-ad");
  out = exciseDivByClass(out, "footer-ad");
  out = exciseDivByClass(out, "ad-slot");
  // stray ins
  out = out.replace(/^[ \t]*<ins\s+class="adsbygoogle[^"]*"[\s\S]*?<\/ins>\s*\n?/gim, "");
  return out;
}

function main() {
  const files = fs
    .readdirSync(SCRIPTS_DIR)
    .filter((f) => f.endsWith(".js") && !EXCLUDE.has(f))
    .map((f) => path.join(SCRIPTS_DIR, f));

  let changed = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    if (!/adsbygoogle|google-adsense-account|banner-ad|footer-ad|ad-slot|ADSENSE_RECOVERY_CSS/.test(before)) {
      continue;
    }
    const after = clean(before);
    if (after === before) continue;
    // Write to temp (.js so node --check accepts it), syntax-check, then commit
    const tmp = file.replace(/\.js$/, ".check.js");
    fs.writeFileSync(tmp, after);
    try {
      execSync(`node --check "${tmp}"`, { stdio: "pipe" });
      fs.unlinkSync(tmp);
      fs.writeFileSync(file, after);
      changed += 1;
      console.log(`cleaned: ${path.basename(file)}`);
    } catch (err) {
      fs.unlinkSync(tmp);
      console.error(`SKIPPED (syntax check failed): ${path.basename(file)}`);
    }
  }
  console.log(`\nGenerator scripts cleaned: ${changed}`);
}

main();
