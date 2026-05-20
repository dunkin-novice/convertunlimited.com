#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "vendor"]);
const LOCALE_PREFIXES = new Set(["th", "vi", "zh", "ja", "ko", "es", "fr"]);
const EXCLUDED_PREFIXES = ["/best/", "/alternatives/", "/compare/"];
const RECOVERY_LINKS = [
  ["/tools/", "Tools"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
  ["/privacy/", "Privacy Policy"],
  ["/terms/", "Terms of Service"],
  ["/trust/", "Trust Center"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name === "index.html") files.push(full);
  }
  return files;
}

function routeFor(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function isEnglishIndexable(route, html) {
  const first = route.split("/").filter(Boolean)[0] || "";
  if (LOCALE_PREFIXES.has(first)) return false;
  if (EXCLUDED_PREFIXES.some((prefix) => route.startsWith(prefix))) return false;
  const robots = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || "";
  return !/\bnoindex\b/i.test(robots);
}

function hasHref(html, href) {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<a\\b[^>]*href="${escaped}"`, "i").test(html);
}

function addHeaderLinks(html) {
  const navMatch = html.match(/<nav class="topnav" aria-label="Primary">[\s\S]*?<\/nav>/i);
  if (!navMatch) return html;
  const nav = navMatch[0];
  const missing = [
    ["/tools/", "Tools"],
    ["/about/", "About"],
    ["/trust/", "Trust"],
  ].filter(([href]) => !hasHref(nav, href));
  if (!missing.length) return html;
  const insert = missing.map(([href, label]) => `                <a href="${href}">${label}</a>`).join("\n");
  let updated = nav;
  if (/<details class="tools-dropdown">/i.test(nav)) {
    updated = nav.replace(/\s*<details class="tools-dropdown">/i, `\n${insert}\n                <details class="tools-dropdown">`);
  } else {
    updated = nav.replace(/(<span class="pill">[\s\S]*?<\/span>)/i, `$1\n${insert}`);
    if (updated === nav) updated = nav.replace(/\s*<\/nav>/i, `\n${insert}\n            </nav>`);
  }
  return html.replace(nav, updated);
}

function addFooterLinks(html) {
  const footerMatch = html.match(/<footer class="footer">[\s\S]*?<\/footer>/i);
  if (!footerMatch) {
    const footer = `        <footer class="footer">
            <div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — browser-native utility workflows.</div>
            <nav class="links" aria-label="Footer">
${RECOVERY_LINKS.map(([href, label]) => `                <a href="${href}">${label}</a>`).join("\n")}
            </nav>
        </footer>`;
    return html.replace(/(\s*<\/main>)(\s*<\/div>\s*<\/body>)/i, `$1\n\n${footer}$2`);
  }
  const footer = footerMatch[0];
  const navMatch = footer.match(/<nav class="links" aria-label="Footer">[\s\S]*?<\/nav>/i);
  if (!navMatch) return html;
  const nav = navMatch[0];
  const missing = RECOVERY_LINKS.filter(([href]) => !hasHref(nav, href));
  if (!missing.length) return html;
  const insert = missing.map(([href, label]) => `                <a href="${href}">${label}</a>`).join("\n");
  const updatedNav = nav.replace(/\s*<\/nav>/, `\n${insert}\n            </nav>`);
  return html.replace(nav, updatedNav);
}

function isToolPage(route) {
  const first = route.split("/").filter(Boolean)[0] || "";
  const recovery = new Set(["tools", "about", "contact", "privacy", "terms", "trust", "guides", "proof-of-local-processing"]);
  return route !== "/" && first && !recovery.has(first) && !route.startsWith("/trust/");
}

function addToolTrustModule(route, html) {
  if (!isToolPage(route) || html.includes('id="local-privacy-note"')) return html;
  const module = `        <section class="article trust-note" id="local-privacy-note">
            <h2>Trust and privacy</h2>
            <p>Files are processed locally where supported. Review the <a href="/trust/">Trust Center</a> for the processing model and the <a href="/privacy/">Privacy Policy</a> for public-site privacy boundaries.</p>
        </section>
`;
  const marker = "<!-- RELATED_TOOLS_START -->";
  if (html.includes(marker)) return html.replace(marker, `${module}${marker}`);
  return html.replace(/(\s*<\/main>)/, `\n${module}$1`);
}

function addHomeSection(route, html) {
  if (route !== "/" || html.includes('id="trust-transparency"')) return html;
  const section = `        <section class="article trust-note" id="trust-transparency">
            <h2>Trust and transparency</h2>
            <p>Explore the <a href="/tools/">tools directory</a>, review the <a href="/trust/">Trust Center</a>, or read the <a href="/privacy/">Privacy Policy</a> before choosing a workflow.</p>
        </section>
`;
  const heroClose = html.indexOf("        </section>", html.indexOf('<section class="hero">'));
  if (heroClose === -1) return html;
  return `${html.slice(0, heroClose + "        </section>".length)}\n\n${section}${html.slice(heroClose + "        </section>".length)}`;
}

function addToolsHubSection(route, html) {
  if (route !== "/tools/" || html.includes('id="tools-trust-links"')) return html;
  const section = `            <section class="article trust-note" id="tools-trust-links">
                <h2>Privacy-first tool directory</h2>
                <p>Need the technical boundary before using a file tool? Review the <a href="/trust/">Trust Center</a>, read the <a href="/privacy/">Privacy Policy</a>, or <a href="/contact/">contact ConvertUnlimited</a> with site questions.</p>
            </section>
`;
  return html.replace("<!-- TOOLS_HUB_START -->", `${section}\n<!-- TOOLS_HUB_START -->`);
}

function main() {
  const changed = [];
  for (const file of walk(ROOT)) {
    const route = routeFor(file);
    const original = fs.readFileSync(file, "utf8");
    if (!isEnglishIndexable(route, original)) continue;
    let html = original;
    html = addHeaderLinks(html);
    html = addFooterLinks(html);
    html = addHomeSection(route, html);
    html = addToolsHubSection(route, html);
    html = addToolTrustModule(route, html);
    if (html !== original) {
      fs.writeFileSync(file, html, "utf8");
      changed.push(path.relative(ROOT, file).split(path.sep).join("/"));
    }
  }
  console.log(`Internal link recovery updated ${changed.length} files.`);
  for (const file of changed) console.log(`- ${file}`);
}

main();
