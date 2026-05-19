"use strict";

const fs = require("fs");
const path = require("path");
const pages = require("./data/legal-pages");
require("./data/locales");

const ROOT = process.cwd();
const BASE_URL = "https://convertunlimited.com";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const routeFor = (page) => `/${page.slug}/`;

const sectionHtml = (section) => `
            <section class="article">
                <h2>${escapeHtml(section.h2)}</h2>
${section.paragraphs.map((paragraph) => `                <p>${escapeHtml(paragraph)}</p>`).join("\n")}
            </section>`;

const schemaFor = (page) => {
  const canonical = `${BASE_URL}${routeFor(page)}`;
  return {
    "@context": "https://schema.org",
    "@type": page.schemaType,
    name: page.h1,
    headline: page.h1,
    description: page.description,
    inLanguage: "en",
    dateModified: "2026-05-20",
    publisher: {
      "@type": "Organization",
      name: "ConvertUnlimited",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };
};

const breadcrumbsFor = (page) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: page.h1, item: `${BASE_URL}${routeFor(page)}` },
  ],
});

const render = (page) => {
  const route = routeFor(page);
  const canonical = `${BASE_URL}${route}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KQHC5ZGV');</script>
    <!-- End Google Tag Manager -->
    <script src="/analytics-events.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)} | ConvertUnlimited</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
    <meta name="google-adsense-account" content="ca-pub-2823470980745945">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${canonical}">
    <link rel="alternate" hreflang="x-default" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(page.title)} | ConvertUnlimited">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="ConvertUnlimited">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${BASE_URL}/og-image.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)} | ConvertUnlimited">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${BASE_URL}/og-image.svg">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <style id="ADSENSE_RECOVERY_CSS">
      .banner-ad, .footer-ad, .ad-slot { display: none !important; }
    </style>
    <script type="application/ld+json">${JSON.stringify(breadcrumbsFor(page))}</script>
    <script type="application/ld+json">${JSON.stringify(schemaFor(page))}</script>
</head>
<body data-page-type="trust">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQHC5ZGV"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div class="app">
        <header class="topbar">
            <a href="/" class="brand" aria-label="ConvertUnlimited home">
                <span class="mark" aria-hidden="true"></span>
                <span class="word"><b>Convert</b><span>Unlimited</span></span>
            </a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>Product information</span>
                <a href="/tools/">Tools</a>
                <a href="/guides/">Guides</a>
                <a href="/trust/">Trust Center</a>
                <a href="https://privacy.convertunlimited.com/">Privacy build</a>
            </nav>
        </header>

        <main>
            <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; opacity: 0.8;">
                <a href="/">Home</a> &gt; ${escapeHtml(page.h1)}
            </nav>

            <section class="hero intent-hero">
                <p class="section-eyebrow">ConvertUnlimited</p>
                <h1 class="hero-title">${escapeHtml(page.h1)}</h1>
                <p class="sub hero-sub">${escapeHtml(page.summary)}</p>
            </section>

            <section class="article aeo-summary" id="answer-first">
                <h2>Short answer</h2>
                <p>${escapeHtml(page.summary)}</p>
            </section>

${page.sections.map(sectionHtml).join("\n")}

            <section class="article">
                <h2>Related pages</h2>
                <ul>
${page.links.map(([href, label]) => `                    <li><a href="${href}">${escapeHtml(label)}</a></li>`).join("\n")}
                </ul>
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
                <a href="/about/">About</a>
                <a href="/contact/">Contact</a>
                <a href="/privacy/">Privacy</a>
                <a href="/terms/">Terms</a>
                <a href="https://privacy.convertunlimited.com/">Privacy Build</a>
            </nav>
        </footer>
    </div>
</body>
</html>
`;
};

for (const page of pages) {
  const dir = path.join(ROOT, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(page), "utf8");
  console.log(`Generated ${routeFor(page)}`);
}
