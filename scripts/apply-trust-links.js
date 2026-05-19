#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TARGETS = [
  "index.html",
  "tools/index.html",
  "image-compressor/index.html",
  "metadata-remover/index.html",
  "png-to-webp/index.html",
  "jpg-to-webp/index.html",
  "webp-to-jpg/index.html",
  "webp-to-png/index.html",
  "png-to-jpg/index.html",
  "merge-pdf/index.html",
  "split-pdf/index.html",
  "compress-pdf/index.html",
  "images-to-pdf/index.html",
  "pdf-to-images/index.html",
];

function insertFooterTrustLinks(html) {
  if (html.includes('href="/trust/"')) return html;
  return html.replace(
    /(\s*<a href="\/#privacy">Privacy<\/a>)/,
    `$1\n                <a href="/trust/">Trust Center</a>\n                <a href="/trust/verification/">Verification</a>`
  );
}

function addFaqTrustLinks(html, rel) {
  if (rel === "index.html") {
    html = html.replace(
      /(<p>No\. ConvertUnlimited runs entirely inside your browser using the HTML canvas API\. Selected file contents are processed locally in your browser — file contents are not intentionally uploaded by this tool\.)<\/p>/,
      `$1 See <a href="/trust/local-processing/">how local processing works</a> and <a href="/trust/verification/">how to verify it</a>.</p>`
    );
  }
  if (rel === "image-compressor/index.html") {
    html = html.replace(
      /(<p>ConvertUnlimited does not provide a server-side upload endpoint for this processing flow\. The public site may still load ads and analytics\.)<\/p>/,
      `$1 See <a href="/trust/local-processing/">local processing</a> and the <a href="/trust/privacy-build/">privacy build</a>.</p>`
    );
  }
  if (rel === "metadata-remover/index.html") {
    html = html.replace(
      /(<p>Yes\. Because the tool runs entirely in your local browser environment, no image data is ever uploaded to a server\. You can even use the tool while offline once the page is loaded\.)<\/p>/,
      `<p>Selected image contents are processed locally in your browser for supported metadata cleanup workflows. ConvertUnlimited does not provide a server-side upload endpoint for this processing flow. See <a href="/trust/local-processing/">local processing</a> and <a href="/trust/limitations/">limitations</a>.</p>`
    );
  }
  return html;
}

let changed = 0;
for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");
  let next = insertFooterTrustLinks(original);
  next = addFaqTrustLinks(next, rel);
  if (next !== original) {
    fs.writeFileSync(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Applied trust links to ${changed} files.`);
