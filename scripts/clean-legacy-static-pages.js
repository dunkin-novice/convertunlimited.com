#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const LOCALES = require("./data/locales");

const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const LOCALIZED_PREFIXES = new Set(LOCALES.map((locale) => locale.prefix).filter(Boolean));

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name === "index.html") files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
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

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function matchOne(html, pattern) {
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : "";
}

function titleFrom(html) {
  return matchOne(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s*\|\s*ConvertUnlimited\s*$/i, "");
}

function descriptionFrom(html) {
  return (html.match(/<meta name="description" content="([^"]*)">/i) || [])[1] || "";
}

function routeForFile(file) {
  const r = rel(file);
  if (r === "index.html") return "/";
  return `/${r.replace(/index\.html$/, "")}`;
}

function isLocalizedGuideFallback(file) {
  const parts = rel(file).split("/");
  return LOCALIZED_PREFIXES.has(parts[0]) && parts[1] === "guides" && parts[2] === "how-it-works";
}

function isGuide(file) {
  return rel(file).split("/").includes("guides");
}

function standardizePrivacyWording(html) {
  return html
    .replace(/No uploads, no signup, no watermark\./gi, "No signup or watermark. File contents are processed locally in your browser for supported workflows.")
    .replace(/No uploads, no signup\./gi, "No signup. File contents are processed locally in your browser for supported workflows.")
    .replace(/No uploads, no limits, no signup\./gi, "No signup. Supported workflows process selected file contents locally in your browser.")
    .replace(/No uploads, no servers, browser-native local processing\./gi, "Browser-native local processing for supported workflows.")
    .replace(/Local-first compression, no uploads, no signup, no watermark\./gi, "Local-first compression with no signup or watermark.")
    .replace(/Your files stay on your device\./gi, "Selected file contents are processed locally in your browser.")
    .replace(/Your files stay on your device/gi, "Selected file contents are processed locally in your browser")
    .replace(/Files stay on your device\s*—\s*no upload\./gi, "Selected file contents are processed locally in your browser.")
    .replace(/Files stay on your device\s*—\s*no upload/gi, "Selected file contents are processed locally in your browser")
    .replace(/Files are not uploaded\./gi, "File contents are not intentionally uploaded by this tool.")
    .replace(/no data is uploaded to our servers/gi, "file contents are not intentionally uploaded by this tool")
    .replace(/No uploads, no server processing\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this processing flow.")
    .replace(/No uploads, no server processing/gi, "ConvertUnlimited does not provide a server-side upload endpoint for this processing flow")
    .replace(/No uploads, no limits, no signup/gi, "No signup. Supported workflows process selected file contents locally in your browser")
    .replace(/No uploads/gi, "Local browser processing")
    .replace(/no uploads/gi, "local browser processing")
    .replace(/No Upload/gi, "Local Processing")
    .replace(/No upload\s*—\s*runs in your browser/gi, "Local processing in your browser")
    .replace(/<span>No upload<\/span>/gi, "<span>Local processing</span>")
    .replace(/No upload\/download waiting time/gi, "No file-transfer wait after the page loads")
    .replace(/No upload cost\./gi, "Local processing cost profile.")
    .replace(/No upload, no signup, no watermark\./gi, "No signup or watermark. File contents are processed locally in your browser for supported workflows.")
    .replace(/No upload, no signup, no watermark/gi, "No signup or watermark. File contents are processed locally in your browser for supported workflows")
    .replace(/Free, private, no upload, no signup\./gi, "Free, browser-native, and no signup.")
    .replace(/Free, private, no upload, no signup/gi, "Free, browser-native, and no signup")
    .replace(/no upload, no watermark/gi, "no watermark. File contents are processed locally in your browser for supported workflows")
    .replace(/full privacy/gi, "local browser processing")
    .replace(/no upload, local browser processing/gi, "local browser processing")
    .replace(/Stays on your device\./gi, "Local browser processing.")
    .replace(/stays on your device\./gi, "processed locally in your browser.")
    .replace(/not uploaded by this tool/gi, "not intentionally uploaded by this tool")
    .replace(/your text or URL is not uploaded/gi, "text or URL input is processed locally in your browser")
    .replace(/Files are processed in your browser and never uploaded\./gi, "Selected file contents are processed locally in your browser. ConvertUnlimited does not provide a server-side upload endpoint for this processing flow.")
    .replace(/files are never uploaded/gi, "file contents are not intentionally uploaded by supported tools")
    .replace(/Since your files are never uploaded,/gi, "For supported local-processing flows,")
    .replace(/Are my files uploaded\?/gi, "Are my files sent to ConvertUnlimited servers?")
    .replace(/Are my images uploaded\?/gi, "Are my images sent to ConvertUnlimited servers?")
    .replace(/Never\. The only thing our server provides is the static code required to run the tool in your browser\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this processing flow. The public site may still load ads and analytics.")
    .replace(/Yes\. Open your network inspector in your browser tools and you will see that no image data is sent to our servers\. All logic is executed in your browser's local environment\./gi, "Selected image contents are processed locally in your browser. For privacy-sensitive workflows, use the privacy build, which is designed without ads, analytics, remote fonts, or third-party runtime scripts.")
    .replace(/We do not collect, store, or transmit any images you process\. All processing is strictly local\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this image-processing flow. Selected image contents are processed locally in your browser.")
    .replace(/We do not collect, store, or transmit any images you process\. All conversion tasks are strictly local to your machine\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this image-conversion flow. Selected image contents are processed locally in your browser.")
    .replace(/We do not collect, store, or transmit any PDF files\. All processing is strictly local to your machine\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this PDF processing flow. Selected PDF contents are processed locally in your browser.")
    .replace(/We do not collect, store, or transmit any PDF files\. All processing is strictly local\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this PDF processing flow. Selected PDF contents are processed locally in your browser.")
    .replace(/strictly local to your machine/gi, "processed locally in your browser")
    .replace(/strictly local/gi, "processed locally in your browser")
    .replace(/your private selected photo contents are processed locally in your browser/gi, "selected photo contents are processed locally in your browser")
    .replace(/This provides total security for sensitive contracts, legal documents, and personal records\./gi, "This reduces server-side exposure for sensitive contracts, legal documents, and personal records.")
    .replace(/That local-only model has two practical consequences\./gi, "That browser-native model has two practical consequences.")
    .replace(/First, the tool is private —/gi, "First,")
    .replace(/there is nothing for us to see, store, or share/gi, "file contents are not intentionally uploaded by this tool")
    .replace(/Our Privacy Promise/gi, "Privacy behavior")
    .replace(/We don&#39;t have a backend that stores your data\. We don&#39;t have accounts\. We don&#39;t track your content\. The code you see on the screen is the code that runs on your machine\./gi, "Supported processing flows run in the browser after the static page loads. The public site may still load ads and analytics; use the privacy build for privacy-sensitive workflows.")
    .replace(/Because there is no upload step,/gi, "Because supported flows process selected file contents locally in your browser,")
    .replace(/never uploaded to our servers/gi, "not intentionally uploaded by this tool")
    .replace(/It is never uploaded to our servers or stored on any disk\./gi, "ConvertUnlimited does not provide a server-side upload endpoint for this processing flow.");
}

function aeoSummary(html, file) {
  const title = matchOne(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || titleFrom(html) || "ConvertUnlimited tool";
  const description = descriptionFrom(html) || matchOne(html, /<p class="sub hero-sub">([\s\S]*?)<\/p>/i) || title;
  const workflow = isGuide(file)
    ? "Use this page to understand the workflow, then open the linked tool page when you are ready to process files."
    : "Use the controls on this page, review the output in your browser, then download the result from this tab.";
  return `            <section class="article aeo-summary" id="tool-summary">
                <h2>What this page does</h2>
                <p>${esc(description)}</p>
                <h2>Privacy behavior</h2>
                <p>Selected file contents are processed locally in your browser for supported workflows. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>
                <h2>Supported workflow</h2>
                <p>${esc(workflow)}</p>
            </section>`;
}

function addAeoSummary(html, file) {
  if (/class="article aeo-summary"/i.test(html)) return html;
  if (!/<main\b/i.test(html)) return html;
  const block = aeoSummary(html, file);
  const targets = [
    /(\s*<section id="faq" class="article">)/i,
    /(\s*<section class="article">\s*<h2 id="faq">)/i,
    /(\s*<!-- TOOLS_HUB_START -->)/i,
    /(\s*<!-- RELATED_TOOLS_START -->)/i,
    /(\s*<\/main>)/i,
  ];
  for (const target of targets) {
    if (target.test(html)) return html.replace(target, `\n${block}\n$1`);
  }
  return html;
}

function updateJsonLdDescriptions(html) {
  const description = descriptionFrom(html);
  if (!description) return html;
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/gi, (full, open, json, close) => {
    try {
      const data = JSON.parse(json);
      if (data && typeof data === "object" && data.description) {
        data.description = description;
        if (data["@type"] === "WebApplication" || data["@type"] === "SoftwareApplication") {
          data.featureList ||= [
            "Browser-native utility workflow",
            "Local processing for supported file operations",
            "No account required",
          ];
          data.isAccessibleForFree = true;
        }
        return `${open}${JSON.stringify(data)}${close}`;
      }
    } catch (error) {
      return full;
    }
    return full;
  });
}

function markEnglishFallbackGuide(html, file) {
  if (!isLocalizedGuideFallback(file)) return html;
  if (!/<meta name="translation-status"/i.test(html)) {
    html = html.replace("</head>", `    <meta name="translation-status" content="english-fallback">\n</head>`);
  }
  if (!/data-translation-status="english-fallback"/i.test(html)) {
    const notice = `<section class="article translation-status" data-translation-status="english-fallback"><h2>Translation status</h2><p>This guide is currently shown in English for this locale. Tool links still point to localized routes where available.</p></section>`;
    html = html.replace(/(<main[^>]*>)/i, `$1\n${notice}`);
  }
  html = html.replace(/("inLanguage"\s*:\s*")(?:th|vi|zh-Hans|ja|ko|es|fr)(")/g, '$1en$2');
  html = html.replace(/("mainEntityOfPage"\s*:\s*\{[^}]+\})\}/g, '$1,"inLanguage":"en"}');
  html = html.replace(/("@type"\s*:\s*"FAQPage",)(?!\s*"inLanguage")/g, '$1"inLanguage":"en",');
  html = html.replace(/files are never uploaded/gi, "file contents are not intentionally uploaded by supported tools");
  return html;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let html = original;
  html = standardizePrivacyWording(html);
  html = addAeoSummary(html, file);
  html = markEnglishFallbackGuide(html, file);
  html = updateJsonLdDescriptions(html);
  if (html !== original) {
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
}

console.log(`Cleaned ${changed} legacy/static HTML files.`);
