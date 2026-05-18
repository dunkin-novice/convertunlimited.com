#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const LOCALES = require("./data/locales");
const { WORKFLOW_CLUSTERS } = require("./data/workflow-clusters");
const { TRUST_GUIDE_BLOCKS, GUIDE_TYPES, GUIDE_REASONS } = require("./data/trust-guide-blocks");

const REGISTRY = JSON.parse(fs.readFileSync(path.join(ROOT, "tools-registry.json"), "utf8"));
const FINDINGS = [];
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);

const guideTypes = new Set(GUIDE_TYPES);
const guideReasons = new Set(GUIDE_REASONS);
const workflowIds = new Set(WORKFLOW_CLUSTERS.map((workflow) => workflow.workflow_id));
const liveCanonicalTools = new Set();

for (const category of REGISTRY.categories || []) {
  for (const tool of category.tools || []) {
    if (tool.status === "live") liveCanonicalTools.add(tool.slug || "image-converter");
  }
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function localizedHref(href, locale) {
  if (!href.startsWith("/guides/")) return href;
  return locale.prefix ? `/${locale.prefix}${href}` : href;
}

function existsRoute(href) {
  if (!href.startsWith("/")) return false;
  const route = href.replace(/^\/+/, "").replace(/\/$/, "");
  const file = route ? path.join(ROOT, route, "index.html") : path.join(ROOT, "index.html");
  return fs.existsSync(file);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name === "index.html") files.push(full);
  }
  return files;
}

function attr(anchor, name) {
  const match = anchor.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : "";
}

function localeForFile(relative) {
  return LOCALES.find((locale) => locale.prefix && relative.startsWith(`${locale.prefix}/`)) ||
    LOCALES.find((locale) => locale.code === "en");
}

function currentRouteForFile(relative, locale) {
  let page = relative;
  if (locale.prefix && page.startsWith(`${locale.prefix}/`)) page = page.slice(locale.prefix.length + 1);
  if (page === "index.html") return "/";
  if (!page.endsWith("/index.html")) return null;
  return `/${page.replace(/index\.html$/, "")}`;
}

function checkData() {
  const guideSlugs = new Set();
  for (const guide of TRUST_GUIDE_BLOCKS) {
    if (!guide.slug) FINDINGS.push("trust-guide-blocks.js: guide missing slug");
    if (guideSlugs.has(guide.slug)) FINDINGS.push(`trust-guide-blocks.js: duplicate guide slug ${guide.slug}`);
    guideSlugs.add(guide.slug);

    if (!guideTypes.has(guide.type)) FINDINGS.push(`${guide.slug}: unsupported guide type ${guide.type}`);
    if (!guideReasons.has(guide.reason)) FINDINGS.push(`${guide.slug}: unsupported reason ${guide.reason}`);
    if (!["live", "planned"].includes(guide.status)) FINDINGS.push(`${guide.slug}: status must be live or planned`);
    if (!Array.isArray(guide.target_tools) || !guide.target_tools.length) FINDINGS.push(`${guide.slug}: missing target_tools`);
    if (!Array.isArray(guide.locale_support) || !guide.locale_support.length) FINDINGS.push(`${guide.slug}: missing locale_support`);

    for (const slug of guide.target_tools || []) {
      if (slug !== "*" && !liveCanonicalTools.has(slug)) FINDINGS.push(`${guide.slug}: unknown target tool ${slug}`);
    }
    for (const workflow of guide.workflow_clusters || []) {
      if (!workflowIds.has(workflow)) FINDINGS.push(`${guide.slug}: unknown workflow_cluster ${workflow}`);
    }

    if (guide.status === "live") {
      for (const localeCode of guide.locale_support || []) {
        const locale = LOCALES.find((item) => item.code === localeCode);
        if (!locale) {
          FINDINGS.push(`${guide.slug}: unsupported locale ${localeCode}`);
          continue;
        }
        const href = localizedHref(guide.href, locale);
        if (!existsRoute(href)) FINDINGS.push(`${guide.slug}: live guide route missing ${href}`);
      }
    }
  }
}

function checkRenderedHtml() {
  const blockRe = /<!-- GUIDE_BLOCKS_START -->([\s\S]*?)<!-- GUIDE_BLOCKS_END -->/g;
  const relatedBlockRe = /<!-- RELATED_TOOLS_START -->([\s\S]*?)<!-- RELATED_TOOLS_END -->/g;
  const guideAnchorRe = /<a\b[^>]*data-track="guide-click"[^>]*>/g;
  const guideBySlug = new Map(TRUST_GUIDE_BLOCKS.map((guide) => [guide.slug, guide]));

  for (const file of walk(ROOT)) {
    const relative = rel(file);
    const locale = localeForFile(relative);
    const currentRoute = currentRouteForFile(relative, locale);
    const html = fs.readFileSync(file, "utf8");
    let blockMatch;

    while ((blockMatch = blockRe.exec(html))) {
      const anchors = [...blockMatch[1].matchAll(guideAnchorRe)].map((match) => match[0]);
      if (anchors.length > 3) FINDINGS.push(`${relative}: guide block has ${anchors.length} links`);

      const seenHrefs = new Set();
      anchors.forEach((anchor, index) => {
        const href = attr(anchor, "href");
        const destination = attr(anchor, "data-destination-guide");
        const guideType = attr(anchor, "data-guide-type");
        const reason = attr(anchor, "data-reason");
        const position = attr(anchor, "data-position");
        const guide = guideBySlug.get(destination);

        if (!guide) FINDINGS.push(`${relative}: unknown destination guide ${destination || "(missing)"}`);
        if (!guideTypes.has(guideType)) FINDINGS.push(`${relative}: unsupported guide_type ${guideType || "(missing)"}`);
        if (!guideReasons.has(reason)) FINDINGS.push(`${relative}: unsupported reason ${reason || "(missing)"}`);
        if (String(index + 1) !== position) FINDINGS.push(`${relative}: expected guide position ${index + 1}, found ${position || "(missing)"}`);
        if (!href || !existsRoute(href)) FINDINGS.push(`${relative}: guide href missing or unresolved ${href || "(missing)"}`);
        if (currentRoute && href === currentRoute) FINDINGS.push(`${relative}: guide block links to itself ${href}`);
        if (seenHrefs.has(href)) FINDINGS.push(`${relative}: duplicate guide link ${href}`);
        seenHrefs.add(href);

        if (guide && guide.href.startsWith("/guides/") && guide.locale_support.includes(locale.code)) {
          const expectedHref = localizedHref(guide.href, locale);
          if (href !== expectedHref) FINDINGS.push(`${relative}: localized guide href ${href} should be ${expectedHref}`);
        }
      });
    }

    while ((blockMatch = relatedBlockRe.exec(html))) {
      if (/data-track="guide-click"/.test(blockMatch[1])) {
        FINDINGS.push(`${relative}: guide links are mixed into related-tool block`);
      }
    }
  }
}

checkData();
checkRenderedHtml();

if (FINDINGS.length) {
  console.error("Guide-block validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Guide-block validation passed.");
