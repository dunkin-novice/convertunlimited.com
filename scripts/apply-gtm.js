#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GTM_ID = "GTM-KQHC5ZGV";
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const REGISTRY = require(path.join(ROOT, "tools-registry.json"));
const LOCALE_PREFIXES = new Set(REGISTRY.locales.filter((locale) => locale !== "en"));
const TOOL_SLUGS = new Set(["image-converter"]);

for (const category of REGISTRY.categories) {
  for (const tool of category.tools) {
    TOOL_SLUGS.add(tool.slug || "image-converter");
  }
}

const HEAD_SNIPPET = `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->
    <script src="/analytics-events.js"></script>`;

const BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function stripExistingGtm(html) {
  return html
    .replace(/\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe\s+src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-[A-Z0-9]+"[\s\S]*?<\/iframe><\/noscript>\s*<!-- End Google Tag Manager \(noscript\) -->\s*/gi, "\n")
    .replace(/\s*<!-- Google Tag Manager -->\s*<script>\(function\(w,d,s,l,i\)\{[\s\S]*?googletagmanager\.com\/gtm\.js\?id=[\s\S]*?<\/script>\s*<!-- End Google Tag Manager -->\s*/gi, "\n")
    .replace(/\s*<script\s+src="\/analytics-events\.js"><\/script>\s*/gi, "\n");
}

function stripDirectGa4(html) {
  return html
    .replace(/\s*<!-- Google Analytics \(gtag\.js\) -->\s*/gi, "\n")
    .replace(/\s*<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-98HSCSEKBX"[^>]*><\/script>\s*/gi, "\n")
    .replace(/\s*<script>\s*window\.dataLayer=window\.dataLayer\|\|\[\];function gtag\(\)\{dataLayer\.push\(arguments\);\}gtag\('js',new Date\(\)\);gtag\('config','G-98HSCSEKBX'\);\s*<\/script>\s*/gi, "\n")
    .replace(/\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-98HSCSEKBX'\);\s*<\/script>\s*/gi, "\n");
}

function pageMeta(file) {
  const relative = path.relative(ROOT, file).split(path.sep).join("/");
  const parts = relative.split("/");
  if (parts[parts.length - 1] !== "index.html") return {};

  let segments = parts.slice(0, -1);
  if (segments.length && LOCALE_PREFIXES.has(segments[0])) segments = segments.slice(1);

  if (segments.length === 0) {
    return { tool: "image-converter", pageType: "home" };
  }
  if (segments[0] === "tools") {
    return { pageType: "hub" };
  }
  if (segments[0] === "guides") {
    return { pageType: "guide" };
  }
  if (segments[0] === "proof-of-local-processing") {
    return { pageType: "proof" };
  }
  if (segments.length === 1 && TOOL_SLUGS.has(segments[0])) {
    return { tool: segments[0], pageType: "tool" };
  }
  return {};
}

function setAttribute(attrs, name, value) {
  if (!value) return attrs;
  const pattern = new RegExp(`\\s${name}="[^"]*"`, "i");
  if (pattern.test(attrs)) return attrs.replace(pattern, ` ${name}="${value}"`);
  return `${attrs} ${name}="${value}"`;
}

function setBodyMetadata(html, meta) {
  if (!meta.tool && !meta.pageType) return html;
  return html.replace(/<body([^>]*)>/i, (_match, attrs) => {
    let nextAttrs = attrs || "";
    nextAttrs = setAttribute(nextAttrs, "data-tool", meta.tool);
    nextAttrs = setAttribute(nextAttrs, "data-page-type", meta.pageType);
    return `<body${nextAttrs}>`;
  });
}

function normalizeSpacing(html) {
  return html
    .replace(/(<script src="\/analytics-events\.js"><\/script>)\s*<meta/gi, "$1\n    <meta")
    .replace(/(<script[^>]+pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>)\s*<!-- Structured data/gi, "$1\n\n    <!-- Structured data")
    .replace(/(<!-- End Google Tag Manager \(noscript\) -->)\s*<div/gi, "$1\n    <div");
}

let changed = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let html = stripDirectGa4(stripExistingGtm(original));
  if (!/<head[^>]*>/i.test(html)) throw new Error(`${path.relative(ROOT, file)}: missing <head>`);
  if (!/<body[^>]*>/i.test(html)) throw new Error(`${path.relative(ROOT, file)}: missing <body>`);
  html = html.replace(/<head([^>]*)>/i, `<head$1>\n    ${HEAD_SNIPPET}\n    `);
  html = setBodyMetadata(html, pageMeta(file));
  html = html.replace(/<body([^>]*)>/i, `<body$1>\n    ${BODY_SNIPPET}\n    `);
  html = normalizeSpacing(html);
  if (html !== original) {
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
}

console.log(`Applied GTM ${GTM_ID} to ${changed} HTML files.`);
