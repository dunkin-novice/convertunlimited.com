#!/usr/bin/env node
// One-shot cleanup: removes all AdSense surface from production HTML and adds
// Organization JSON-LD sitewide. Safe to re-run (idempotent).
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor", ".wrangler"]);

const ORG_JSONLD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"ConvertUnlimited","alternateName":"ConvertUnlimited.com","url":"https://convertunlimited.com/","logo":"https://convertunlimited.com/og-image.svg","sameAs":["https://github.com/dunkin-novice/convertunlimited.com","https://privacy.convertunlimited.com/"],"contactPoint":[{"@type":"ContactPoint","contactType":"customer support","url":"https://convertunlimited.com/contact/","email":"hello@convertunlimited.com"}]}</script>`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

// Excise an HTML element by class name with proper balanced-div matching.
// className is matched as a whole-word class (so `ad-slot` matches `class="ad-slot"`
// but NOT `class="my-ad-slot"`). Removes the entire <div class="X">...</div>
// region including the optional preceding HTML comment on the same/prev line.
function exciseDivByClass(html, className) {
  const openRe = new RegExp(
    `[ \\t]*(?:<!--[^\\n]*-->[ \\t]*\\n[ \\t]*)?<div\\s+class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?">`,
    "gi"
  );

  let out = html;
  while (true) {
    openRe.lastIndex = 0;
    const m = openRe.exec(out);
    if (!m) break;
    const start = m.index;
    const afterOpen = openRe.lastIndex;

    // Walk forward, counting <div ...> opens and </div> closes
    let depth = 1;
    let i = afterOpen;
    const len = out.length;
    while (i < len && depth > 0) {
      // Find next <div or </div
      const nextOpen = out.indexOf("<div", i);
      const nextClose = out.indexOf("</div>", i);
      if (nextClose === -1) {
        depth = -1;
        break;
      }
      if (nextOpen !== -1 && nextOpen < nextClose) {
        // Could be a real <div ...> tag or a coincidental "<diva" etc.
        const ch = out[nextOpen + 4];
        if (ch === " " || ch === ">" || ch === "\t" || ch === "\n") {
          depth += 1;
        }
        i = nextOpen + 4;
      } else {
        depth -= 1;
        i = nextClose + 6;
      }
    }

    if (depth !== 0) {
      // Unbalanced — skip this match to avoid corruption
      openRe.lastIndex = afterOpen;
      continue;
    }

    let end = i;
    // Consume trailing whitespace + newline
    while (end < len && (out[end] === " " || out[end] === "\t")) end += 1;
    if (out[end] === "\n") end += 1;

    out = out.slice(0, start) + out.slice(end);
  }

  return out;
}

function clean(html) {
  let out = html;

  // 1. <meta name="google-adsense-account" ...>
  out = out.replace(/^[ \t]*<meta\s+name="google-adsense-account"[^>]*>\s*\n?/gim, "");

  // 2. AdSense loader script tag
  out = out.replace(
    /^[ \t]*<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*\n?/gim,
    ""
  );

  // 3. <!-- Google AdSense (...) --> comment line
  out = out.replace(/^[ \t]*<!--\s*Google AdSense[^\n]*-->\s*\n?/gim, "");

  // 4. ADSENSE_RECOVERY_CSS <style> block
  out = out.replace(
    /^[ \t]*<style id="ADSENSE_RECOVERY_CSS">[\s\S]*?<\/style>\s*\n?/gim,
    ""
  );

  // 5. <div class="banner-ad"> ... </div> (balanced)
  out = exciseDivByClass(out, "banner-ad");

  // 6. <div class="footer-ad"> ... </div> (balanced)
  out = exciseDivByClass(out, "footer-ad");

  // 7. <div class="ad-slot"> ... </div> (balanced, has nested ad-body + ad-foot)
  out = exciseDivByClass(out, "ad-slot");

  // 8. Stray "<!-- Below-action ... -->" or "<!-- Footer banner ... -->" comments
  out = out.replace(
    /^[ \t]*<!--[^\n]*(?:Below-action|Footer banner)[^\n]*-->\s*\n?/gim,
    ""
  );

  // 9. Stray <ins class="adsbygoogle ..."> (uncaught by wrappers)
  out = out.replace(
    /^[ \t]*<ins\s+class="adsbygoogle[^"]*"[\s\S]*?<\/ins>\s*\n?/gim,
    ""
  );

  // 10. Inline (adsbygoogle = ...).push({}) one-liners
  out = out.replace(
    /^[ \t]*<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);\s*<\/script>\s*\n?/gim,
    ""
  );

  // 11. Insert Organization JSON-LD once per file (idempotent)
  if (!/"@type"\s*:\s*"Organization"/.test(out)) {
    if (/<link rel="canonical"[^>]*>/i.test(out)) {
      out = out.replace(
        /(<link rel="canonical"[^>]*>)/i,
        `$1\n    ${ORG_JSONLD}`
      );
    } else if (/<\/head>/i.test(out)) {
      out = out.replace(/<\/head>/i, `    ${ORG_JSONLD}\n</head>`);
    }
  }

  // 12. Collapse runs of 3+ blank lines into 2
  out = out.replace(/\n{3,}/g, "\n\n");

  return out;
}

function main() {
  const files = walk(ROOT);
  let changed = 0;
  let unchanged = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const after = clean(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed += 1;
    } else {
      unchanged += 1;
    }
  }
  console.log(`Scanned ${files.length} HTML files.`);
  console.log(`Modified: ${changed}`);
  console.log(`Unchanged: ${unchanged}`);
}

main();
