#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist", "privacy-build");

const EXCLUDE = new Set([
  ".git",
  ".github",
  ".DS_Store",
  "dist",
  "docs",
  "scripts",
  "tests",
  "ads.txt",
  "CNAME",
  "package.json",
  "package-lock.json",
]);

const THIRD_PARTY_SCRIPT_MAP = new Map([
  [
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    "/vendor/jszip-3.10.1.min.js",
  ],
  [
    "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js",
    "/vendor/pdf-lib-1.17.1.min.js",
  ],
  [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "/vendor/jspdf-2.5.1.umd.min.js",
  ],
  [
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js",
    "/vendor/pdfjs-3.4.120.min.js",
  ],
  [
    "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js",
    "/vendor/heic2any-0.0.4.min.js",
  ],
]);

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self'",
  "connect-src 'none'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const PRIVACY_LLMS = `# ConvertUnlimited Privacy Build

Privacy build:
https://privacy.convertunlimited.com/

This privacy build is the recommended version for privacy-sensitive workflows and privacy-first review.

Core behavior:
- Supported tools process selected file contents locally in the browser using browser APIs, Canvas, Web Crypto, JavaScript, and vendored client-side libraries.
- File contents are not intentionally uploaded by supported local-processing tools.
- ConvertUnlimited does not provide a server-side upload endpoint for supported local-processing flows.
- This privacy build is generated without ads, analytics, remote fonts, Google services, Cloudflare Insights, or third-party runtime scripts.
- Network isolation is verified by static audit and representative browser processing tests.

Useful pages:
- Tools index: https://privacy.convertunlimited.com/tools/
- Proof of local processing: https://privacy.convertunlimited.com/proof-of-local-processing/
- Source repository: https://github.com/dunkin-novice/convertunlimited.com
- Local processing documentation: https://github.com/dunkin-novice/convertunlimited.com/blob/main/LOCAL_PROCESSING.md
- Third-party inventory: https://github.com/dunkin-novice/convertunlimited.com/blob/main/THIRD_PARTIES.md

Preferred short description:
ConvertUnlimited Privacy Build provides browser-native file utilities with no ads, analytics, remote fonts, or third-party runtime scripts. Supported tools process selected file contents locally in the browser.
`;

function shouldSkip(name) {
  return EXCLUDE.has(name) || name.endsWith(".zip") || name.endsWith(".md");
}

function copyTree(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (shouldSkip(name)) continue;
      copyTree(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function stripThirdPartyRuntime(html) {
  let out = html;

  out = out.replace(
    /\s*<link\s+rel="preconnect"\s+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/[^"]+"\s+rel="stylesheet"[^>]*>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<script[^>]+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"]*"[^>]*><\/script>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"[^>]*><\/script>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<!-- Google Tag Manager -->\s*<script>\(function\(w,d,s,l,i\)\{[\s\S]*?googletagmanager\.com\/gtm\.js\?id=[\s\S]*?<\/script>\s*<!-- End Google Tag Manager -->\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe\s+src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-[A-Z0-9]+"[\s\S]*?<\/iframe><\/noscript>\s*<!-- End Google Tag Manager \(noscript\) -->\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<script>\s*window\.dataLayer=window\.dataLayer\|\|\[\];function gtag\(\)\{dataLayer\.push\(arguments\);\}gtag\('js',new Date\(\)\);gtag\('config','G-98HSCSEKBX'\);\s*<\/script>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-98HSCSEKBX'\);\s*<\/script>\s*/gi,
    "\n"
  );

  for (const [remote, local] of THIRD_PARTY_SCRIPT_MAP.entries()) {
    out = out.split(remote).join(local);
  }

  out = out.replace(/https:\/\/www\.convertunlimited\.com/g, "https://privacy.convertunlimited.com");
  out = out.replace(/https:\/\/convertunlimited\.com/g, "https://privacy.convertunlimited.com");
  out = out.replace(/\s*<!-- Google AdSense[\s\S]*?-->\s*/gi, "\n");
  out = out.replace(/\s*<!-- Google Analytics[\s\S]*?-->\s*/gi, "\n");
  out = out.replace(/<p\b[^>]*>(?:(?!<\/p>).)*(?:Analytics|Analytique|Analyses|การวิเคราะห์)(?:(?!<\/p>).)*<\/p>/gis, "");
  out = out.replace(/<p\b[^>]*>(?:(?!<\/p>).)*(?:Advertising|Ads|Publicit|โฆษณา)(?:(?!<\/p>).)*<\/p>/gis, "");
  out = out.replace(/<p\b[^>]*>(?:(?!<\/p>).)*Google Analytics(?:(?!<\/p>).)*<\/p>/gis, "");
  out = out.replace(/<p\b[^>]*>(?:(?!<\/p>).)*Google AdSense(?:(?!<\/p>).)*<\/p>/gis, "");
  out = out.replace(
    /<section id="privacy" class="article">\s*<h2>Privacy(?: Policy)?<\/h2>/i,
    `<section id="privacy" class="article">\n                <h2>Privacy</h2>\n                <p><b>Privacy build:</b> This build removes ads, analytics, remote fonts, runtime CDN scripts, and file-operation telemetry. Selected files are processed in the browser using local JavaScript and browser APIs.</p>`
  );
  out = out.replace(/100% Private/gi, "Local file processing");
  out = out.replace(/100% privacy/gi, "local file processing");
  out = out.replace(/Zero-Knowledge model/gi, "No upload endpoint in this build");
  out = out.replace(/zero-knowledge/gi, "local-processing");
  out = out.replace(/privacy risks/gi, "server-side exposure risk");
  out = out.replace(/Your files never leave your device/gi, "Selected file contents are processed locally in your browser");
  out = out.replace(/your files never leave your device/gi, "selected file contents are processed locally in your browser");
  out = out.replace(/Your photos never leave your device/gi, "Selected photo contents are processed locally in your browser");
  out = out.replace(/your private photos never leave your device/gi, "selected photo contents are processed locally in your browser");
  out = out.replace(/your sensitive documents never leave your machine/gi, "selected document contents are processed locally in your browser");
  out = out.replace(/Files never leave your browser\./gi, "Selected file contents are processed locally in your browser.");
  out = out.replace(/Files never leave your browser/gi, "Selected file contents are processed locally in your browser");
  out = out.replace(/There is nothing to log, because nothing is sent\./gi, "The privacy build does not include file-operation telemetry.");
  out = out.replace(/there's nothing for us \(or anyone else\) to log, look at, or leak\./gi, "the privacy build does not include file-operation telemetry.");
  out = out.replace(/a small ad block in the right rail covers it\./gi, "the privacy build removes ad code; public deployment costs must be funded separately.");
  out = out.replace(/A small ad in the right rail and one in the footer cover hosting costs\./gi, "The privacy build does not include ads.");
  out = out.replace(/static HTML, CSS, JavaScript, and ads/gi, "static HTML, CSS, and JavaScript");
  out = out.replace(/Why ads\?/gi, "Privacy build");
  out = out.replace(/Ads cover hosting\./gi, "The privacy build does not include ads.");
  out = out.replace(/Experience the privacy\./gi, "Try the privacy build.");
  out = out.replace(/The actual file processing uses zero data because it happens offline on your device\./gi, "After the static assets are loaded, supported processing flows are verified by tests to run without network requests.");

  out = out.replace(
    /\s*<div class="banner-ad">\s*<span class="ad-label">Ad<\/span>\s*<ins class="adsbygoogle[\s\S]*?<\/ins>\s*<\/div>\s*/gi,
    "\n"
  );
  out = out.replace(
    /\s*<div class="footer-ad">\s*<span class="ad-label">Ad<\/span>\s*<ins class="adsbygoogle[\s\S]*?<\/ins>\s*<\/div>\s*/gi,
    "\n"
  );
  out = out.replace(/class="ad-slot"/g, `class="ad-slot privacy-build-hidden"`);
  out = out.replace(
    /\s*<ins class="adsbygoogle[\s\S]*?<\/ins>\s*/gi,
    "\n"
  );
  out = out.replace(/\s*<!--\s*AdSense slot:[\s\S]*?-->\s*/gi, "\n");

  if (!/http-equiv="Content-Security-Policy"/i.test(out)) {
    out = out.replace(
      /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/i,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">\n    <meta name="referrer" content="no-referrer">`
    );
  }

  out = out.replace(
    /<meta name="google-adsense-account"[^>]*>\s*/gi,
    ""
  );
  out = out.replace(
    /<span class="pill"><span class="dot"><\/span>100% free, no signup<\/span>/g,
    `<span class="pill"><span class="dot"></span>Privacy build: no ads, analytics, or third-party runtime scripts</span>`
  );
  out = out.replace(
    /<div>© <span id="copyright-year">2026<\/span> ConvertUnlimited\.com — runs entirely in your browser\.<\/div>/g,
    `<div>© <span id="copyright-year">2026</span> ConvertUnlimited privacy build — file processing runs in your browser.</div>`
  );

  return out;
}

function rewritePublicHostnames(text) {
  return text
    .replace(/https:\/\/www\.convertunlimited\.com/g, "https://privacy.convertunlimited.com")
    .replace(/https:\/\/convertunlimited\.com/g, "https://privacy.convertunlimited.com");
}

function rewriteJs(js) {
  return rewritePublicHostnames(js)
    .replace(/\s*\/\/ GA4 event helper[^\n]*\n/gi, "\n")
    .replace(
      /pdfjsLib\.GlobalWorkerOptions\.workerSrc = "https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js\/3\.4\.120\/pdf\.worker\.min\.js";/g,
      `pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs-3.4.120.worker.min.js";`
    )
    .replace(
      /function track\(name, params\) \{[\s\S]*?\n  \}/g,
      "function track() {\n    /* Privacy build: no analytics or telemetry. */\n  }"
    )
    .replace(
      /\n\s*\/\/ Initialise each AdSense <ins> on the page[\s\S]*?\n\s*} catch \(_\) \{ \/\* noop \*\/ \}\n/g,
      "\n"
    );
}

function rewriteCss(css) {
  return css
    .replace(/\/\* Ads \*\/[\s\S]*?\/\* Related Tools \*\//g, "/* Related Tools */")
    .replace(/adsbygoogle/g, "privacy-build-removed-ad-selector")
    .concat("\n.privacy-build-hidden{display:none!important;}\n");
}

function transformGeneratedFiles(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      transformGeneratedFiles(file);
      continue;
    }
    if (name.endsWith(".html")) {
      fs.writeFileSync(file, stripThirdPartyRuntime(fs.readFileSync(file, "utf8")));
    } else if (name.endsWith(".js")) {
      fs.writeFileSync(file, rewriteJs(fs.readFileSync(file, "utf8")));
    } else if (name.endsWith(".css")) {
      fs.writeFileSync(file, rewriteCss(fs.readFileSync(file, "utf8")));
    } else if (name.endsWith(".xml") || name.endsWith(".txt")) {
      if (name === "llms.txt") {
        fs.writeFileSync(file, PRIVACY_LLMS);
      } else {
        fs.writeFileSync(file, rewritePublicHostnames(fs.readFileSync(file, "utf8")));
      }
    }
  }
}

function writeHeaders() {
  const headers = `/*
  Content-Security-Policy: ${CSP}
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
`;
  fs.writeFileSync(path.join(OUT, "_headers"), headers);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyTree(ROOT, OUT);
transformGeneratedFiles(OUT);
writeHeaders();

console.log(`Privacy build written to ${path.relative(ROOT, OUT)}`);
