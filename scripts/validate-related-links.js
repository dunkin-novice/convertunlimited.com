#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, "tools-registry.json");
const LOCALES = require("./data/locales");
const { WORKFLOW_CLUSTERS } = require("./data/workflow-clusters");

const REASON_ALLOWLIST = new Set([
  "immediate_next_action",
  "same_file_type",
  "optimization_cleanup",
  "reverse_conversion",
  "alternative_conversion",
  "trust_help",
]);

const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const findings = [];

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
const tools = registry.categories.flatMap((category) =>
  (category.tools || []).map((tool) => ({ ...tool, categoryId: category.id }))
);
const liveCanonicalTools = new Map();
for (const tool of tools) {
  if (tool.status !== "live") continue;
  liveCanonicalTools.set(tool.slug || "image-converter", tool);
}

const workflowIds = new Set(WORKFLOW_CLUSTERS.map((workflow) => workflow.workflow_id));

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

// Format-pair converters consolidated into the homepage during AdSense recovery.
// A data-destination-tool of "jpg-to-webp" (etc.) should now resolve to the
// locale homepage just like "image-converter" does.
const CONSOLIDATED_INTO_HOMEPAGE = new Set([
  "image-converter",
  "png-to-jpg",
  "jpg-to-webp",
  "webp-to-jpg",
  "png-to-webp",
  "webp-to-png",
]);

function slugPath(slug, locale) {
  const registrySlug = CONSOLIDATED_INTO_HOMEPAGE.has(slug) ? "" : slug;
  const prefix = locale.prefix ? `/${locale.prefix}` : "";
  if (!registrySlug) return `${prefix}/` || "/";
  return `${prefix}/${registrySlug}/`;
}

function filePath(slug, locale) {
  const registrySlug = CONSOLIDATED_INTO_HOMEPAGE.has(slug) ? "" : slug;
  const parts = [];
  if (locale.prefix) parts.push(locale.prefix);
  if (registrySlug) parts.push(registrySlug);
  parts.push("index.html");
  return path.join(ROOT, ...parts);
}

function localeForFile(relative) {
  const matched = LOCALES.find((locale) => locale.prefix && relative.startsWith(`${locale.prefix}/`));
  return matched || LOCALES.find((locale) => locale.code === "en");
}

function currentSlugForFile(relative, locale) {
  let page = relative;
  if (locale.prefix && page.startsWith(`${locale.prefix}/`)) page = page.slice(locale.prefix.length + 1);
  if (page === "index.html") return "image-converter";
  if (!page.endsWith("/index.html")) return null;
  const slug = page.replace(/\/index\.html$/, "");
  if (slug === "tools" || slug.startsWith("guides/")) return null;
  return slug;
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

const relatedBlockRe = /<!-- RELATED_TOOLS_START -->([\s\S]*?)<!-- RELATED_TOOLS_END -->/g;
const relatedAnchorRe = /<a\b[^>]*data-track="related-tool-click"[^>]*>/g;

for (const file of walk(ROOT)) {
  const relative = rel(file);
  const locale = localeForFile(relative);
  const currentSlug = currentSlugForFile(relative, locale);
  const html = fs.readFileSync(file, "utf8");
  let blockMatch;

  while ((blockMatch = relatedBlockRe.exec(html))) {
    const anchors = [...blockMatch[1].matchAll(relatedAnchorRe)].map((match) => match[0]);
    if (anchors.length > 5) findings.push(`${relative}: related block has ${anchors.length} links`);

    anchors.forEach((anchor, index) => {
      const href = attr(anchor, "href");
      const destination = attr(anchor, "data-destination-tool");
      const workflowCluster = attr(anchor, "data-workflow-cluster");
      const reason = attr(anchor, "data-reason");
      const position = attr(anchor, "data-position");

      if (!destination) findings.push(`${relative}: related link ${index + 1} missing data-destination-tool`);
      if (destination && !liveCanonicalTools.has(destination)) findings.push(`${relative}: unknown destination tool ${destination}`);
      if (currentSlug && destination === currentSlug) findings.push(`${relative}: links to itself (${destination})`);
      if (!workflowIds.has(workflowCluster)) findings.push(`${relative}: unknown workflow_cluster ${workflowCluster || "(missing)"}`);
      if (!REASON_ALLOWLIST.has(reason)) findings.push(`${relative}: unsupported reason ${reason || "(missing)"}`);
      if (String(index + 1) !== position) findings.push(`${relative}: expected position ${index + 1}, found ${position || "(missing)"}`);

      if (destination) {
        const expectedHref = slugPath(destination, locale);
        if (href !== expectedHref) findings.push(`${relative}: ${destination} href ${href || "(missing)"} should be ${expectedHref}`);
        if (!fs.existsSync(filePath(destination, locale))) findings.push(`${relative}: localized destination missing ${expectedHref}`);
      }
    });
  }
}

if (findings.length) {
  console.error("Related-link validation failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Related-link validation passed.");
