#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { INTENT_PAGES, PRIVACY_NOTE } = require("./data/intent-pages");
require("./data/locales");

const ROOT = process.cwd();
const BASE_URL = "https://convertunlimited.com";
const GTM_ID = "GTM-KQHC5ZGV";

const TOOL_LABELS = {
  "image-converter": ["Image Converter", "/"],
  "png-to-webp": ["PNG to WebP", "/png-to-webp/"],
  "jpg-to-webp": ["JPG to WebP", "/jpg-to-webp/"],
  "webp-to-jpg": ["WebP to JPG", "/webp-to-jpg/"],
  "webp-to-png": ["WebP to PNG", "/webp-to-png/"],
  "png-to-jpg": ["PNG to JPG", "/png-to-jpg/"],
  "image-compressor": ["Image Compressor", "/image-compressor/"],
  "image-resizer": ["Image Resizer", "/image-resizer/"],
  "metadata-remover": ["Metadata Remover", "/metadata-remover/"],
  "avif-converter": ["AVIF Converter", "/avif-converter/"],
  "merge-pdf": ["Merge PDF", "/merge-pdf/"],
  "split-pdf": ["Split PDF", "/split-pdf/"],
  "compress-pdf": ["Compress PDF", "/compress-pdf/"],
  "images-to-pdf": ["Images to PDF", "/images-to-pdf/"],
  "pdf-to-images": ["PDF to Images", "/pdf-to-images/"],
  "json-formatter": ["JSON Formatter", "/json-formatter/"],
  "hash-generator": ["Hash Generator", "/hash-generator/"]
};

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function pageKindLabel(type) {
  return {
    alternative: "Alternative",
    best: "Best tools",
    "without-upload": "Without-upload guide",
    comparison: "Comparison"
  }[type] || "Guide";
}

function sectionLabel(section) {
  return {
    alternatives: "Alternatives",
    compare: "Comparison",
    best: "Best tools",
    guides: "Guides"
  }[section] || section;
}

const HUBS = [
  // /alternatives/ hub removed during AdSense recovery (pages deleted from the site).
  {
    path: "/best/",
    title: "Best Browser-Based Tool Workflows",
    h1: "Best browser-based tool workflows",
    summary: "Start with practical browser-native workflows for image and PDF tasks without creating broad, thin rankings.",
    type: "best",
    filter: (page) => page.path.startsWith("/best/")
  },
  {
    path: "/compare/",
    title: "Format Comparisons",
    h1: "Format comparisons",
    summary: "Compare image formats by compression, compatibility, transparency, and practical browser-based workflow fit.",
    type: "comparison",
    filter: (page) => page.path.startsWith("/compare/")
  },
  {
    path: "/guides/",
    title: "Browser-Native Processing Guides",
    h1: "Browser-native processing guides",
    summary: "Read practical guides for local browser processing, no-upload workflows, format choices, and privacy verification.",
    type: "guide",
    filter: (page) => page.path.startsWith("/guides/")
  }
];

function renderTable(table) {
  if (!table) return "";
  return [
    '<div class="table-container"><table class="comparison-table">',
    `<thead><tr>${table.headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>`,
    `<tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`,
    "</table></div>"
  ].join("");
}

function renderSection(section) {
  return [
    '<section class="article">',
    `<h2>${esc(section.heading)}</h2>`,
    ...(section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`),
    renderTable(section.table),
    "</section>"
  ].join("\n");
}

function renderLinks(title, links, className) {
  return [
    `<section class="article ${className}">`,
    `<h2>${esc(title)}</h2>`,
    '<ul class="intent-link-list">',
    ...links.map((link) => `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`),
    "</ul>",
    "</section>"
  ].join("\n");
}

function renderToolLinks(page) {
  return page.relatedTools.map((slug) => {
    const item = TOOL_LABELS[slug];
    if (!item) throw new Error(`${page.path}: unknown related tool ${slug}`);
    return { label: item[0], href: item[1] };
  });
}

function renderGuideLinks(page) {
  return page.guideLinks.map((href) => ({ label: guideLabel(href), href }));
}

function guideLabel(href) {
  return {
    "/proof-of-local-processing/": "Proof of local processing",
    "/guides/how-it-works/": "How browser-based processing works",
    "/guides/local-processing/": "What local processing means",
    "/guides/webp-vs-png/": "WebP vs PNG guide",
    "/guides/webp-vs-jpg/": "WebP vs JPG guide",
    "/guides/what-is-webp/": "What WebP is",
    "/trust/": "Trust Center",
    "/trust/local-processing/": "Local processing trust notes",
    "/trust/privacy-build/": "Privacy build details",
    "/trust/security-architecture/": "Security architecture",
    "/trust/verification/": "How to verify local processing",
    "/trust/limitations/": "Browser-native limitations",
    "/trust/third-parties/": "Third-party runtime policy",
    "/compare/browser-native-vs-cloud-converters/": "Browser-native vs cloud converters",
    "/compare/no-upload-file-converters/": "No-upload converter checklist",
    "/best/browser-based-pdf-tools/": "Browser-based PDF tools",
    "/best/free-image-converter/": "Free image converter workflows",
    "/compare/png-vs-webp/": "PNG vs WebP",
  }[href] || href.replace(/^\/|\/$/g, "").replace(/[-/]/g, " ");
}

function breadcrumbs(page) {
  const section = page.path.split("/").filter(Boolean)[0];
  return [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: sectionLabel(section), item: `${BASE_URL}/${section}/` },
    { "@type": "ListItem", position: 3, name: page.h1, item: `${BASE_URL}${page.path}` }
  ];
}

function renderPage(page) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: page.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": page.type === "comparison" ? "TechArticle" : "WebPage",
    headline: page.h1,
    description: page.metaDescription,
    inLanguage: "en",
    dateModified: "2026-05-18",
    author: { "@type": "Organization", name: "ConvertUnlimited" },
    publisher: { "@type": "Organization", name: "ConvertUnlimited", logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.svg` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${page.path}` }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs(page)
  };

  const toolLinks = renderToolLinks(page);
  const guideLinks = renderGuideLinks(page);

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
    <meta name="description" content="${esc(page.metaDescription)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
<link rel="canonical" href="${BASE_URL}${page.path}">
    <link rel="alternate" hreflang="en" href="${BASE_URL}${page.path}">
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.path}">
    <meta property="og:title" content="${esc(page.title)} | ConvertUnlimited">
    <meta property="og:description" content="${esc(page.metaDescription)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${BASE_URL}${page.path}">
    <meta property="og:site_name" content="ConvertUnlimited">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${BASE_URL}/og-image.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(page.title)} | ConvertUnlimited">
    <meta name="twitter:description" content="${esc(page.metaDescription)}">
    <meta name="twitter:image" content="${BASE_URL}/og-image.svg">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
${jsonLd(breadcrumbSchema)}
    ${jsonLd(articleSchema)}
    ${jsonLd(faqSchema)}
</head>
<body data-page-type="intent">
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
                <span class="pill"><span class="dot"></span>Browser-native utilities</span>
                <a href="/tools/">Tools</a>
                <a href="/guides/how-it-works/">How it works</a>
                <a href="/proof-of-local-processing/">Proof</a>
            </nav>
        </header>

        <main>
            <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; opacity: 0.8;">
                <a href="/">Home</a> &gt; <span>${esc(pageKindLabel(page.type))}</span> &gt; <span>${esc(page.h1)}</span>
            </nav>

            <section class="hero intent-hero">
                <p class="section-eyebrow">${esc(pageKindLabel(page.type))}</p>
                <h1 class="hero-title">${esc(page.h1)}</h1>
                <p class="sub hero-sub">${esc(page.summary)}</p>
            </section>

            <section class="article aeo-summary" id="answer-first">
                <h2>Short answer</h2>
                <p>${esc(page.answer)}</p>
                <h2>Privacy behavior</h2>
                <p>${esc(PRIVACY_NOTE)}</p>
                <h2>Best next step</h2>
                <p>Choose the related tool below that matches your file type and output goal, then review the limitations before processing large or sensitive files.</p>
            </section>

            ${page.sections.map(renderSection).join("\n\n")}

            <section class="article" id="limitations">
                <h2>Limitations</h2>
                <ul>
                    ${page.limitations.map((item) => `<li>${esc(item)}</li>`).join("\n                    ")}
                </ul>
            </section>

            ${renderLinks("Related tools", toolLinks, "intent-related-tools")}
            ${renderLinks("Related trust pages and guides", guideLinks, "intent-guide-links")}

            <section id="faq" class="article">
                <h2>FAQ</h2>
                ${page.faqs.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("\n                ")}
            </section>

            <section class="article CTA">
                <h3>Action</h3>
                <p>Start with <a href="${esc(toolLinks[0].href)}">${esc(toolLinks[0].label)}</a>, then use the linked guides to verify behavior and choose the right format.</p>
            </section>

            <section class="article operator-note">
                <h2>Review note</h2>
                <p>Comparison criteria reviewed: ${esc(page.reviewed)}.</p>
            </section>
        </main>

        <footer class="footer">
            <div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — browser-native utility workflows.</div>
            <nav class="links" aria-label="Footer">
                <a href="/">Image Converter</a>
                <a href="/image-compressor/">Image Compressor</a>
                <a href="/metadata-remover/">Metadata Remover</a>
                <a href="/merge-pdf/">Merge PDF</a>
                <a href="/guides/how-it-works/">How it works</a>
                <a href="/proof-of-local-processing/">Proof</a>
                <a href="/trust/">Trust Center</a>
                <a href="/trust/verification/">Verification</a>
            </nav>
        </footer>
    </div>
</body>
</html>
`;
}

function renderHub(hub) {
  const pages = INTENT_PAGES.filter(hub.filter);
  const extraGuideLinks = hub.path === "/guides/" ? [
    { path: "/guides/how-it-works/", title: "How browser-based processing works", metaDescription: "Learn how ConvertUnlimited processes supported files locally in your browser." },
    { path: "/guides/local-processing/", title: "What local processing means", metaDescription: "Understand the limits and behavior of browser-native file processing." },
    { path: "/guides/what-is-webp/", title: "What WebP is", metaDescription: "Learn when WebP is useful for modern web images." },
    { path: "/proof-of-local-processing/", title: "Proof of local processing", metaDescription: "Review how to verify local processing behavior." }
  ] : [];
  const allLinks = [...pages, ...extraGuideLinks];
  const canonical = `${BASE_URL}${hub.path}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these pages localized?",
        acceptedAnswer: { "@type": "Answer", text: "No. Intent and comparison pages are English-first until data shows a page should be translated and maintained for a target locale." }
      },
      {
        "@type": "Question",
        name: "Do these pages change how tools process files?",
        acceptedAnswer: { "@type": "Answer", text: "No. They explain workflows and link to existing tools. Supported file processing still happens locally in the browser for the relevant tools." }
      }
    ]
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: hub.h1,
    description: hub.summary,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical }
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allLinks.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.title,
      url: `${BASE_URL}${page.path}`
    }))
  };

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
    <title>${esc(hub.title)} | ConvertUnlimited</title>
    <meta name="description" content="${esc(hub.summary)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
<link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${canonical}">
    <link rel="alternate" hreflang="x-default" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
${jsonLd(webPageSchema)}
    ${jsonLd(itemListSchema)}
    ${jsonLd(faqSchema)}
</head>
<body data-page-type="intent-hub">
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
                <a href="/tools/">Tools</a>
                <a href="/guides/">Guides</a>
                <a href="/compare/">Compare</a>
            </nav>
        </header>
        <main>
            <section class="hero intent-hero">
                <p class="section-eyebrow">${esc(pageKindLabel(hub.type))}</p>
                <h1 class="hero-title">${esc(hub.h1)}</h1>
                <p class="sub hero-sub">${esc(hub.summary)}</p>
            </section>
            <section class="article aeo-summary" id="answer-first">
                <h2>Short answer</h2>
                <p>${esc(hub.summary)}</p>
                <h2>Privacy behavior</h2>
                <p>${esc(PRIVACY_NOTE)}</p>
                <h2>How to use this section</h2>
                <p>Open the page that matches your decision, then use the linked tool only when the limitations fit your file and workflow.</p>
            </section>
            <section class="article intent-index">
                <h2>Pages</h2>
                <ul class="intent-link-list">
                    ${allLinks.map((page) => `<li><a href="${esc(page.path)}">${esc(page.title)}</a><br><span>${esc(page.metaDescription)}</span></li>`).join("\n                    ")}
                </ul>
            </section>
            <section class="article" id="limitations">
                <h2>Limitations</h2>
                <ul>
                    <li>These pages are English-only until search and engagement data justify maintained translations.</li>
                    <li>They are decision and education pages, not new tools.</li>
                    <li>Privacy claims apply to supported tool workflows and should be verified before sensitive use.</li>
                </ul>
            </section>
            <section id="faq" class="article">
                <h2>FAQ</h2>
                <h3>Are these pages localized?</h3>
                <p>No. Intent and comparison pages are English-first until data shows a page should be translated and maintained for a target locale.</p>
                <h3>Do these pages add new tools?</h3>
                <p>No. They explain existing workflows and link to existing ConvertUnlimited tools and guides.</p>
            </section>
        </main>
    </div>
</body>
</html>
`;
}

function main() {
  for (const page of INTENT_PAGES) {
    const outputDir = path.join(ROOT, page.path.replace(/^\/+|\/+$/g, ""));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderPage(page), "utf8");
  }
  for (const hub of HUBS) {
    const outputDir = path.join(ROOT, hub.path.replace(/^\/+|\/+$/g, ""));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderHub(hub), "utf8");
  }
  console.log(`Generated ${INTENT_PAGES.length} English intent pages and ${HUBS.length} hubs.`);
}

main();
