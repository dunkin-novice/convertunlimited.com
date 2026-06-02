#!/usr/bin/env node
// Replaces format-pair converter pages with redirect stubs to the homepage
// (locale-aware). Consolidates 6 near-duplicate URLs into 1 canonical converter
// page per locale, eliminating the template-duplication "Low value content"
// surface flagged in the AdSense audit. Pages targeted have no special-format
// libraries — they use only the homepage's canvas converter. HEIC/AVIF are NOT
// touched (HEIC has heic2any, AVIF has its own encoder).
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PAIRS = ["png-to-jpg", "jpg-to-webp", "webp-to-jpg", "png-to-webp", "webp-to-png"];
const LOCALES = [
  { prefix: "",   lang: "en",      home: "/" },
  { prefix: "th", lang: "th",      home: "/th/" },
  { prefix: "es", lang: "es",      home: "/es/" },
  { prefix: "fr", lang: "fr",      home: "/fr/" },
  { prefix: "ja", lang: "ja",      home: "/ja/" },
  { prefix: "ko", lang: "ko",      home: "/ko/" },
  { prefix: "vi", lang: "vi",      home: "/vi/" },
  { prefix: "zh", lang: "zh-Hans", home: "/zh/" },
];

const ADSENSE_CLIENT = "ca-pub-2823470980745945";
const ORG_JSONLD = `{"@context":"https://schema.org","@type":"Organization","name":"ConvertUnlimited","alternateName":"ConvertUnlimited.com","url":"https://convertunlimited.com/","logo":"https://convertunlimited.com/og-image.svg","sameAs":["https://github.com/dunkin-novice/convertunlimited.com","https://privacy.convertunlimited.com/"],"contactPoint":[{"@type":"ContactPoint","contactType":"customer support","url":"https://convertunlimited.com/contact/","email":"info@convertunlimited.com"}]}`;

function stub(target) {
  const canonicalUrl = `https://convertunlimited.com${target}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Converter | ConvertUnlimited</title>
    <meta name="description" content="The ConvertUnlimited Image Converter handles PNG, JPG, WebP, GIF, SVG and BMP in your browser. This URL has been consolidated into the main converter.">
    <meta name="robots" content="noindex,follow">
    <link rel="canonical" href="${canonicalUrl}">
    <meta http-equiv="refresh" content="0; url=${canonicalUrl}">
    <script type="application/ld+json">${ORG_JSONLD}</script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>
    <style>body{font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:80px auto;padding:0 20px;color:#222;line-height:1.5}a{color:#3aa17e}</style>
</head>
<body>
    <h1>Image Converter</h1>
    <p>This URL has been consolidated into the ConvertUnlimited image converter. You should be redirected automatically — if not, open the converter directly:</p>
    <p><a href="${canonicalUrl}">${canonicalUrl}</a></p>
    <script>location.replace(${JSON.stringify(canonicalUrl)});</script>
</body>
</html>
`;
}

let replaced = 0;
let missing = 0;
for (const locale of LOCALES) {
  for (const pair of PAIRS) {
    const dir = locale.prefix ? path.join(ROOT, locale.prefix, pair) : path.join(ROOT, pair);
    const file = path.join(dir, "index.html");
    if (!fs.existsSync(file)) { missing += 1; continue; }
    fs.writeFileSync(file, stub(locale.home));
    replaced += 1;
    console.log(`stub: /${locale.prefix ? locale.prefix + "/" : ""}${pair}/  →  ${locale.home}`);
  }
}
console.log(`\nReplaced ${replaced} pair pages with redirect stubs (${missing} not present).`);
