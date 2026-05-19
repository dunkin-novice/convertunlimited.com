const fs = require('fs');
const path = require('path');
const GUIDES = require('./data/guides.js');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';

const LOCALES = require('./data/locales');

function htmlEscape(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

function routeFor(locale, guideSlug) {
  return `${locale.prefix ? `/${locale.prefix}` : ''}/guides/${guideSlug}/`;
}

function renderSection(section) {
  let html = `<section class="article"><h2>${htmlEscape(section.title)}</h2>`;
  if (section.content) {
    html += `<p>${htmlEscape(section.content)}</p>`;
  }
  if (section.isTable) {
    html += `<div class="table-container"><table class="comparison-table"><thead><tr>`;
    section.headers.forEach(h => html += `<th>${htmlEscape(h)}</th>`);
    html += `</tr></thead><tbody>`;
    section.rows.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => html += `<td>${htmlEscape(cell)}</td>`);
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
  }
  if (section.prosCons) {
    html += `<div class="pros-cons-container">`;
    Object.keys(section.prosCons).forEach(key => {
      const pc = section.prosCons[key];
      html += `<div class="pc-block"><h3>${htmlEscape(key.toUpperCase())}</h3>`;
      html += `<ul class="pros">` + pc.pros.map(p => `<li>✅ ${htmlEscape(p)}</li>`).join('') + `</ul>`;
      html += `<ul class="cons">` + pc.cons.map(c => `<li>❌ ${htmlEscape(c)}</li>`).join('') + `</ul>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  html += `</section>`;
  return html;
}

function generate() {
  for (const guideData of GUIDES) {
    for (const locale of LOCALES) {
      const hasLocalizedGuide = Boolean(guideData[locale.code]);
      const langData = guideData[locale.code] || guideData['en'];
      const contentLanguage = hasLocalizedGuide ? locale.hreflang : 'en';
      const templatePath = locale.prefix ? path.join(ROOT, locale.prefix, 'index.html') : path.join(ROOT, 'index.html');
      
      if (!fs.existsSync(templatePath)) continue;
      let html = fs.readFileSync(templatePath, 'utf8');

      // Clear main content
      const heroRe = /(<section class="hero">)[\s\S]*?(<\/section>)/;
      const converterRe = /(<div class="grid" id="layout">)[\s\S]*?(<\/div>\s*<\/main>)/;
      
      const newHero = `<section class="hero"><h1 class="hero-title">${htmlEscape(langData.h1)}</h1><p class="sub hero-sub">${htmlEscape(langData.intro)}</p></section>`;
      const sectionsHtml = langData.sections.map(s => renderSection(s)).join('');
      const fallbackHtml = hasLocalizedGuide ? '' : `<section class="article translation-status" data-translation-status="english-fallback"><h2>Translation status</h2><p>This guide is currently shown in English for this locale. Tool links still point to localized routes where available.</p></section>`;
      const faqHtml = `<section id="faq" class="article"><h2>FAQ</h2>${langData.faq.map(([q, a]) => `<h3>${htmlEscape(q)}</h3><p>${htmlEscape(a)}</p>`).join('')}</section>`;
      const ctaHtml = `<section class="article CTA"><h3>Action</h3><p>${langData.cta ? langData.cta.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') : ''}</p></section>`;
      
      const newContent = `<div class="guide-content">${fallbackHtml}${sectionsHtml}${faqHtml}${ctaHtml}</div></main>`;

      html = html.replace(heroRe, newHero);
      // We keep the main container but replace the inner grid
      const layoutStart = html.indexOf('<div class="grid" id="layout">');
      const mainEnd = html.indexOf('</main>');
      if (layoutStart !== -1 && mainEnd !== -1) {
          html = html.slice(0, layoutStart) + newContent + html.slice(mainEnd + 7);
      }

      // Breadcrumbs
      const breadcrumbUi = `
        <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; opacity: 0.8;">
            <a href="${locale.prefix ? '/' + locale.prefix : ''}/">${htmlEscape(locale.homeLabel)}</a> &gt; 
            <span>${htmlEscape(locale.guidesLabel)}</span> &gt; 
            <span>${htmlEscape(langData.h1)}</span>
        </nav>
`;
      html = html.replace('<section class="hero">', breadcrumbUi + '<section class="hero">');

      // Schema
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": locale.homeLabel, "item": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/` },
          { "@type": "ListItem", "position": 2, "name": locale.guidesLabel, "item": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/guides/` },
          { "@type": "ListItem", "position": 3, "name": langData.h1, "item": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/guides/${guideData.slug}/` }
        ]
      };

      const articleSchema = {
        "@context": "https://schema.org",
        "@type": guideData.slug === 'how-it-works' ? "AboutPage" : "TechArticle",
        "headline": langData.h1,
        "description": langData.description,
        "inLanguage": contentLanguage,
        "author": { "@type": "Organization", "name": "ConvertUnlimited" },
        "publisher": { "@type": "Organization", "name": "ConvertUnlimited", "logo": { "@type": "ImageObject", "url": `${BASE_URL}/og-image.svg` } },
        "mainEntityOfPage": { "@type": guideData.slug === 'how-it-works' ? "AboutPage" : "WebPage", "@id": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/guides/${guideData.slug}/` }
      };

      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ConvertUnlimited",
        "url": BASE_URL,
        "logo": `${BASE_URL}/og-image.svg`,
        "sameAs": [
            "https://github.com/dunkin-novice/convertunlimited.com"
        ]
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": contentLanguage,
        "mainEntity": langData.faq.map(([q, a]) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        }))
      };

      const schemaHtml = `
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
`;
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
      html = html.replace('</head>', schemaHtml + '</head>');

      // Meta tags
      html = html.replace(/<title>.*?<\/title>/, `<title>${htmlEscape(langData.title)}</title>`);
      html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${htmlEscape(langData.description)}">`);
      html = html.replace('</head>', `    <meta name="translation-status" content="${hasLocalizedGuide ? 'localized' : 'english-fallback'}">\n</head>`);
      
      const canonical = `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/guides/${guideData.slug}/`;
      html = html.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${canonical}">`);

      // Hreflang
      const altRe = /<link rel="alternate" hreflang="(.*?)" href="(.*?)">/g;
      html = html.replace(altRe, (match, hreflang, href) => {
        const altLocale = LOCALES.find(l => l.hreflang === hreflang);
        if (altLocale) {
            const altPath = `${BASE_URL}${altLocale.prefix ? '/' + altLocale.prefix : ''}/guides/${guideData.slug}/`;
            return `<link rel="alternate" hreflang="${hreflang}" href="${altPath}">`;
        }
        return match;
      });
      html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?">/, `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/guides/${guideData.slug}/">`);

      // OG/Twitter
      html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${htmlEscape(langData.title)}">`);
      html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${htmlEscape(langData.description)}">`);
      html = html.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${canonical}">`);

      for (const switchLocale of LOCALES) {
        const href = routeFor(switchLocale, guideData.slug);
        const current = switchLocale.code === locale.code ? ' aria-current="page"' : '';
        const label = {
          en: 'English',
          th: 'ไทย',
          vi: 'Tiếng Việt',
          zh: '中文(简体)',
          ja: '日本語',
          ko: '한국어',
          es: 'Español',
          fr: 'Français',
        }[switchLocale.code];
        const altLabel = switchLocale.code === 'zh' ? '中文（简体）' : label;
        const switcherRe = new RegExp(`<a href="[^"]*" hreflang="${switchLocale.hreflang}" lang="${switchLocale.hreflang}"(?: aria-current="page")?>(${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${altLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})</a>`, 'g');
        html = html.replace(switcherRe, `<a href="${href}" hreflang="${switchLocale.hreflang}" lang="${switchLocale.hreflang}"${current}>${altLabel}</a>`);
      }

      // Remove heavy JS
      html = html.replace('<script src="/script.js"></script>', '');
      html = html.replace('<script src="script.js"></script>', '');

      // Save file
      const outDir = path.join(ROOT, locale.prefix || '', 'guides', guideData.slug);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    }
  }
}

generate();
console.log("Generated 24 localized guide pages.");
