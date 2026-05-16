#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_URL = "https://www.convertunlimited.com";

const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && entry.name === "index.html") {
      files.push(full);
    }
  }
  return files;
}

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function routeFor(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

const LOCALE_LINKS = [
  { code: "en", prefix: "", hreflang: "en", label: "English" },
  { code: "th", prefix: "th", hreflang: "th", label: "ไทย" },
  { code: "vi", prefix: "vi", hreflang: "vi", label: "Tiếng Việt" },
  { code: "zh", prefix: "zh", hreflang: "zh-Hans", label: "中文（简体）" },
  { code: "ja", prefix: "ja", hreflang: "ja", label: "日本語" },
  { code: "ko", prefix: "ko", hreflang: "ko", label: "한국어" },
  { code: "es", prefix: "es", hreflang: "es", label: "Español" },
  { code: "fr", prefix: "fr", hreflang: "fr", label: "Français" },
];

function equivalentSlug(file) {
  const route = routeFor(file);
  const parts = route.split("/").filter(Boolean);
  if (parts.length && LOCALE_LINKS.some((locale) => locale.prefix === parts[0])) {
    parts.shift();
  }
  return parts.join("/");
}

function titleFrom(html) {
  return (html.match(/<title>(.*?)<\/title>/i) || [])[1] || "ConvertUnlimited Tool";
}

function descriptionFrom(html) {
  return (html.match(/<meta name="description" content="(.*?)">/i) || [])[1] || "Browser-native utility from ConvertUnlimited.";
}

function canonicalFrom(html, file) {
  const existing = (html.match(/<link rel="canonical" href="(.*?)">/i) || [])[1];
  return existing || `${BASE_URL}${routeFor(file)}`;
}

function langFrom(html) {
  return (html.match(/<html lang="([^"]+)"/i) || [])[1] || "en";
}

function addCanonicalAndHreflang(html, file) {
  if (!/<link rel="canonical" href="/i.test(html)) {
    html = html.replace("</head>", `    <link rel="canonical" href="${canonicalFrom(html, file)}">\n</head>`);
  }
  if (!/hreflang="x-default"/i.test(html)) {
    html = html.replace("</head>", `    <link rel="alternate" hreflang="x-default" href="${canonicalFrom(html, file)}">\n</head>`);
  }
  return html;
}

function addBasicSchema(html, file) {
  if (/application\/ld\+json/i.test(html)) return html;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: titleFrom(html).replace(/\s*\|\s*ConvertUnlimited\s*$/i, ""),
    description: descriptionFrom(html),
    url: canonicalFrom(html, file),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    inLanguage: langFrom(html),
    featureList: [
      "Browser-native utility workflow",
      "Local processing for supported file operations",
      "No account required",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  return html.replace("</head>", `    <script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
}

function standardizePrivacyWording(html) {
  return html
    .replace(/100% private(?: and secure)?/gi, "browser-native local processing")
    .replace(/100% privacy/gi, "local browser-based processing")
    .replace(/maximum privacy/gi, "local browser-based processing")
    .replace(/total privacy/gi, "local browser-based processing")
    .replace(/complete privacy/gi, "local browser-based processing")
    .replace(/completely private/gi, "processed locally in your browser")
    .replace(/nothing is uploaded/gi, "file contents are not intentionally uploaded by this tool")
    .replace(/nothing is sent/gi, "file contents are not intentionally uploaded by this tool")
    .replace(/There is nothing to log, because file contents are not intentionally uploaded by this tool\./gi, "File contents are not intentionally uploaded by this tool.")
    .replace(/there's nothing for us \(or anyone else\) to log, look at, or leak/gi, "file contents are not intentionally uploaded by this tool")
    .replace(/Your files never leave your device/gi, "Selected file contents are processed locally in your browser")
    .replace(/your files never leave your device/gi, "selected file contents are processed locally in your browser")
    .replace(/Files never leave your browser/gi, "Selected file contents are processed locally in your browser")
    .replace(/files never leave your browser/gi, "selected file contents are processed locally in your browser")
    .replace(/Your image never leaves your browser/gi, "Selected image contents are processed locally in your browser")
    .replace(/Your photos never leave your device/gi, "Selected photo contents are processed locally in your browser")
    .replace(/Your images stay on your device/gi, "Selected image contents are processed locally in your browser")
    .replace(/Your images\./g, "Selected images.")
    .replace(/your sensitive documents never leave your machine/gi, "selected document contents are processed locally in your browser")
    .replace(/documents are never transmitted over the internet/gi, "document contents are processed locally in your browser")
    .replace(/sensitive documents never leave your machine/gi, "selected document contents are processed locally in your browser")
    .replace(/photos never leave your device/gi, "selected photo contents are processed locally in your browser")
    .replace(/never sent to our servers/gi, "not intentionally uploaded by this tool")
    .replace(/never sent to the server/gi, "not intentionally uploaded by this tool")
    .replace(/never sent to a server/gi, "not intentionally uploaded by this tool")
    .replace(/never receives your file data/gi, "does not provide a server-side upload endpoint for this processing flow")
    .replace(/zero-knowledge/gi, "local-processing")
    .replace(/Zero-Knowledge model/gi, "No server-side upload endpoint for supported local flows")
    .replace(/privacy risks/gi, "server-side exposure risks")
    .replace(/\(No one else sees your files\)/gi, "(file contents are processed locally in your browser)")
    .replace(/The actual file processing uses zero data because it happens offline on your device\./gi, "After the static page is loaded, supported processing flows run locally in the browser.")
    .replace(/Experience the privacy\./gi, "Try the browser-native workflow.");
}

function fixLocaleSwitcherRoutes(html, file) {
  const slug = equivalentSlug(file);
  if (!slug) return html;
  for (const locale of LOCALE_LINKS) {
    const href = `/${locale.prefix ? `${locale.prefix}/` : ""}${slug}/`.replace(/\/+/g, "/");
    const labelPattern = locale.code === "zh" ? "(?:中文（简体）|中文\\(简体\\))" : locale.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const anchorRe = new RegExp(`<a href="[^"]*" hreflang="${locale.hreflang}" lang="${locale.hreflang}"(?: aria-current="page")?>${labelPattern}</a>`, "g");
    const current = routeFor(file) === href ? ' aria-current="page"' : "";
    html = html.replace(anchorRe, `<a href="${href}" hreflang="${locale.hreflang}" lang="${locale.hreflang}"${current}>${locale.label}</a>`);
  }
  return html;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let html = original;
  html = standardizePrivacyWording(html);
  html = fixLocaleSwitcherRoutes(html, file);
  html = addCanonicalAndHreflang(html, file);
  html = addBasicSchema(html, file);
  if (html !== original) {
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
}

console.log(`Strategy v5 normalization updated ${changed} HTML files.`);
