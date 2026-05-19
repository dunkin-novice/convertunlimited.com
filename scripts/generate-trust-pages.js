#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { TRUST_PAGES } = require("./data/trust-pages");
require("./data/locales");

const ROOT = process.cwd();
const BASE_URL = "https://www.convertunlimited.com";
const GTM_ID = "GTM-KQHC5ZGV";
const REVIEWED = "May 2026";

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function routeFor(page) {
  return page.slug ? `/trust/${page.slug}/` : "/trust/";
}

function breadcrumbSchema(page) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Trust Center", item: `${BASE_URL}/trust/` },
  ];
  if (page.slug) {
    items.push({ "@type": "ListItem", position: 3, name: page.h1, item: `${BASE_URL}${routeFor(page)}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function pageSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": page.type,
    headline: page.h1,
    name: page.h1,
    description: page.description,
    inLanguage: "en",
    dateModified: "2026-05-19",
    author: { "@type": "Organization", name: "ConvertUnlimited" },
    publisher: {
      "@type": "Organization",
      name: "ConvertUnlimited",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${routeFor(page)}` },
  };
}

function faqSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: page.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function trustItemListSchema() {
  const items = TRUST_PAGES.filter((page) => page.slug).map((page, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: page.h1,
    url: `${BASE_URL}${routeFor(page)}`,
  }));
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: items };
}

function renderSection(section) {
  const parts = [`<section class="article">`, `<h2>${esc(section.heading)}</h2>`];
  for (const paragraph of section.paragraphs || []) {
    parts.push(`<p>${esc(paragraph)}</p>`);
  }
  if (section.list) {
    parts.push('<ul class="intent-link-list">');
    for (const item of section.list) {
      if (Array.isArray(item) && item[0].startsWith("/")) {
        parts.push(`<li><a href="${esc(item[0])}">${esc(item[1])}</a><br><span>${esc(item[2])}</span></li>`);
      } else if (Array.isArray(item)) {
        parts.push(`<li><b>${esc(item[0])}:</b> ${esc(item[1])}</li>`);
      } else {
        parts.push(`<li>${esc(item)}</li>`);
      }
    }
    parts.push("</ul>");
  }
  if (section.links) {
    parts.push('<ul class="intent-link-list">');
    for (const [label, href] of section.links) {
      parts.push(`<li><a href="${esc(href)}">${esc(label)}</a></li>`);
    }
    parts.push("</ul>");
  }
  if (section.code) {
    parts.push(`<pre><code>${esc(section.code)}</code></pre>`);
  }
  parts.push("</section>");
  return parts.join("\n");
}

function renderTrustLinks(currentRoute) {
  const links = TRUST_PAGES.map((page) => [page.h1, routeFor(page)]).filter(([, href]) => href !== currentRoute);
  return [
    '<section class="article intent-index">',
    "<h2>Trust topics</h2>",
    '<ul class="intent-link-list">',
    ...links.map(([label, href]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`),
    "</ul>",
    "</section>",
  ].join("\n");
}

function renderPage(page) {
  const route = routeFor(page);
  const canonical = `${BASE_URL}${route}`;
  const schema = [
    jsonLd(breadcrumbSchema(page)),
    jsonLd(pageSchema(page)),
    jsonLd(faqSchema(page)),
  ];
  if (!page.slug) schema.push(jsonLd(trustItemListSchema()));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->
    <script src="/analytics-events.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(page.title)} | ConvertUnlimited</title>
    <meta name="description" content="${esc(page.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
    <meta name="google-adsense-account" content="ca-pub-2823470980745945">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${canonical}">
    <link rel="alternate" hreflang="x-default" href="${canonical}">
    <meta property="og:title" content="${esc(page.title)} | ConvertUnlimited">
    <meta property="og:description" content="${esc(page.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="ConvertUnlimited">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${BASE_URL}/og-image.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(page.title)} | ConvertUnlimited">
    <meta name="twitter:description" content="${esc(page.description)}">
    <meta name="twitter:image" content="${BASE_URL}/og-image.svg">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2823470980745945" crossorigin="anonymous"></script>
    ${schema.join("\n    ")}
</head>
<body data-page-type="trust">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div class="app">
        <header class="topbar">
            <a href="/" class="brand" aria-label="ConvertUnlimited home">
                <span class="mark" aria-hidden="true"></span>
                <span class="word"><b>Convert</b><span>Unlimited</span></span>
            </a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>Trust documentation</span>
                <a href="/tools/">Tools</a>
                <a href="/guides/">Guides</a>
                <a href="/proof-of-local-processing/">Proof</a>
                <a href="https://privacy.convertunlimited.com/">Privacy build</a>
            </nav>
        </header>

        <main>
            <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; opacity: 0.8;">
                <a href="/">Home</a> &gt; <a href="/trust/">Trust Center</a>${page.slug ? ` &gt; <span>${esc(page.h1)}</span>` : ""}
            </nav>

            <section class="hero intent-hero">
                <p class="section-eyebrow">Trust Center</p>
                <h1 class="hero-title">${esc(page.h1)}</h1>
                <p class="sub hero-sub">${esc(page.summary)}</p>
            </section>

            <section class="article aeo-summary" id="answer-first">
                <h2>Short answer</h2>
                <p>${esc(page.answer)}</p>
                <h2>Build boundary</h2>
                <p>The public site may load ads and analytics. The privacy build at <a href="https://privacy.convertunlimited.com/">privacy.convertunlimited.com</a> is the no-ads, no-analytics review target.</p>
                <h2>Verification path</h2>
                <p>Use the verification page, browser DevTools, and repository privacy tests to inspect the behavior instead of relying on marketing language.</p>
            </section>

            ${page.sections.map(renderSection).join("\n\n")}

            ${renderTrustLinks(route)}

            <section id="faq" class="article">
                <h2>FAQ</h2>
                ${page.faqs.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("\n                ")}
            </section>

            <section class="article operator-note">
                <h2>Review note</h2>
                <p>Trust documentation reviewed: ${REVIEWED}. These pages describe the current public and privacy-build architecture and should be updated when deployment, telemetry, or runtime dependencies change.</p>
            </section>
        </main>

        <footer class="footer">
            <div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — browser-native utility workflows.</div>
            <nav class="links" aria-label="Footer">
                <a href="/tools/">Tools</a>
                <a href="/guides/">Guides</a>
                <a href="/trust/">Trust Center</a>
                <a href="/trust/verification/">Verification</a>
                <a href="/proof-of-local-processing/">Proof</a>
                <a href="https://privacy.convertunlimited.com/">Privacy Build</a>
            </nav>
        </footer>
    </div>
</body>
</html>
`;
}

function main() {
  for (const page of TRUST_PAGES) {
    const route = routeFor(page).replace(/^\/+|\/+$/g, "");
    const outputDir = path.join(ROOT, route);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderPage(page), "utf8");
  }
  console.log(`Generated ${TRUST_PAGES.length} trust pages.`);
}

main();
