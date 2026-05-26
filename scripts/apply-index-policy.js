"use strict";

const fs = require("fs");
const path = require("path");
const {
  classifyRoute,
  normalizeRoute,
  shouldKeepHreflang,
} = require("./data/index-policy");

const ROOT = process.cwd();

const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "dist",
  "assets",
  "img",
  "images",
  "fonts",
]);

const LEGAL_FOOTER_LINKS = [
  '<a href="/about/">About</a>',
  '<a href="/contact/">Contact</a>',
  '<a href="/privacy/">Privacy</a>',
  '<a href="/terms/">Terms</a>',
];

const toPosix = (filePath) => filePath.split(path.sep).join("/");

const isExcluded = (filePath) => {
  const rel = toPosix(path.relative(ROOT, filePath));
  return rel.split("/").some((part) => EXCLUDED_DIRS.has(part));
};

const walkHtml = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (isExcluded(fullPath)) continue;
    if (entry.isDirectory()) walkHtml(fullPath, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
};

const routeForFile = (file) => {
  const rel = toPosix(path.relative(ROOT, file));
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return normalizeRoute(`/${rel.replace(/index\.html$/, "")}`);
  return normalizeRoute(`/${rel}`);
};

const ensureRobots = (html, indexable) => {
  const content = indexable
    ? "index,follow,max-image-preview:large"
    : "noindex,follow";
  const tag = `<meta name="robots" content="${content}">`;
  if (/<meta name="robots" content="[^"]*">/i.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]*">/i, tag);
  }
  return html.replace(/(<meta name="description" content="[^"]*">\s*)/i, `$1\n    ${tag}`);
};

const trimHreflangAlternates = (html) => html.replace(
  /^\s*<link rel="alternate" hreflang="([^"]+)" href="[^"]+">\s*\n/gim,
  (match, hreflang) => shouldKeepHreflang(hreflang) ? match : ""
);

const ensureLegalFooterLinks = (html) => {
  if (LEGAL_FOOTER_LINKS.every((link) => html.includes(link))) return html;
  return html.replace(
    /(<nav class="links" aria-label="Footer">)([\s\S]*?)(\s*<\/nav>)/i,
    (match, open, body, close) => {
      const additions = LEGAL_FOOTER_LINKS
        .filter((link) => !body.includes(link))
        .map((link) => `                        ${link}`)
        .join("\n");
      if (!additions) return match;
      return `${open}${body}\n${additions}${close}`;
    }
  );
};

// AdSense removed from production pending re-approval. This previously injected
// a hide rule for ad slots; it is now a no-op so the index policy never
// reintroduces ad-related markup. Re-enable only after AdSense is approved.
const addRecoveryAdCss = (html) => html;

const standardizeRecoveryWording = (html) => html
  .replace(/100% free, no signup/g, "Browser-native tools")
  .replace(/ฟรี 100% ไม่ต้องสมัคร/g, "ประมวลผลในเบราว์เซอร์")
  .replace(/ปลอดภัยเต็มที่/g, "เหมาะกับเวิร์กโฟลว์ที่รองรับ")
  .replace(/ไม่มีการอัปโหลด/g, "ประมวลผลในเบราว์เซอร์")
  .replace(/ไม่ต้องอัปโหลด/g, "ประมวลผลในเบราว์เซอร์")
  .replace(/ไม่อัปโหลด/g, "ประมวลผลในเบราว์เซอร์")
  .replace(
    /No file is ever uploaded to a server, and we never see, store, or transmit your images\./g,
    "Selected file contents are processed locally in your browser for this supported workflow. ConvertUnlimited does not provide a server-side upload endpoint for this processing flow."
  )
  .replace(
    /never the contents of files you convert \(which never leave your device in the first place\)/g,
    "never the contents of files you convert"
  )
  .replace(
    /The only operating cost is keeping the page online, and a small ad block in the right rail covers it\./g,
    "The product is kept lightweight so the tool remains usable without an account or upload queue."
  );

let changed = 0;
let indexableCount = 0;
let noindexCount = 0;
const reasons = new Map();

for (const file of walkHtml(ROOT)) {
  const route = routeForFile(file);
  const policy = classifyRoute(route);
  const before = fs.readFileSync(file, "utf8");
  let html = before;
  html = ensureRobots(html, policy.indexable);
  html = trimHreflangAlternates(html);
  html = ensureLegalFooterLinks(html);
  html = addRecoveryAdCss(html);
  html = standardizeRecoveryWording(html);

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }

  if (policy.indexable) indexableCount += 1;
  else noindexCount += 1;
  reasons.set(policy.reason, (reasons.get(policy.reason) || 0) + 1);
}

console.log(`Applied AdSense recovery index policy to ${changed} HTML files.`);
console.log(`Indexable routes: ${indexableCount}`);
console.log(`Noindex routes: ${noindexCount}`);
for (const [reason, count] of [...reasons.entries()].sort()) {
  console.log(`${reason}: ${count}`);
}
