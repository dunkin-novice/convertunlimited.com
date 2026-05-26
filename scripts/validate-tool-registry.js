const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const REGISTRY_PATH = path.join(ROOT, 'tools-registry.json');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const { isIndexableRoute, shouldKeepHreflang } = require('./data/index-policy');

const LOCALES = require('./data/locales').map((locale) => ({
  ...locale,
  toolsPath: locale.prefix ? `${locale.prefix}/tools/index.html` : 'tools/index.html',
}));

const checks = [];

const addCheck = (name, pass, detail = '', level = 'check') => {
  checks.push({ name, pass, detail, level });
};

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const slugPath = (slug, locale) => {
  const prefix = locale.prefix ? `/${locale.prefix}` : '';
  if (!slug) return `${prefix}/` || '/';
  return `${prefix}/${slug}/`;
};

const filePath = (slug, locale) => {
  const parts = [];
  if (locale.prefix) parts.push(locale.prefix);
  if (slug) parts.push(slug);
  parts.push('index.html');
  return path.join(ROOT, ...parts);
};

const allHtmlFiles = () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
    }
  };
  walk(ROOT);
  return files;
};

let registry;
try {
  registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  addCheck('registry parses', true);
} catch (error) {
  addCheck('registry parses', false, error.message);
  registry = { categories: [] };
}

const tools = registry.categories.flatMap((category) =>
  (category.tools || []).map((tool) => ({ ...tool, categoryId: category.id }))
);
const liveTools = tools.filter((tool) => tool.status === 'live');
const toolMap = new Map(tools.map((tool) => [tool.slug, tool]));
const duplicateSlugs = tools.map((tool) => tool.slug).filter((slug, index, slugs) => slugs.indexOf(slug) !== index);
addCheck('registry has no duplicate slugs', duplicateSlugs.length === 0, duplicateSlugs.join(', '));

const unknownRelated = [];
const nonLiveRelated = [];
for (const tool of tools) {
  for (const related of tool.related || []) {
    const target = toolMap.get(related);
    if (!target) unknownRelated.push(`${tool.slug || '(home)'} -> ${related || '(home)'}`);
    else if (tool.status === 'live' && target.status !== 'live') nonLiveRelated.push(`${tool.slug || '(home)'} -> ${related}`);
  }
}
addCheck('related mappings point to known tools', unknownRelated.length === 0, unknownRelated.join('; '));
addCheck('live related mappings point to live tools', nonLiveRelated.length === 0, nonLiveRelated.join('; '));

const missingLivePages = [];
for (const tool of liveTools) {
  for (const locale of LOCALES) {
    if (!fs.existsSync(filePath(tool.slug, locale))) {
      missingLivePages.push(`${locale.code}:${tool.slug || '(home)'}`);
    }
  }
}
addCheck('every live tool exists in every supported language', missingLivePages.length === 0, missingLivePages.join('; '));

const missingHubLinks = [];
for (const locale of LOCALES) {
  const html = read(locale.toolsPath);
  for (const tool of liveTools) {
    const href = `href="${slugPath(tool.slug, locale)}"`;
    if (!html.includes(href)) missingHubLinks.push(`${locale.code}:${tool.slug || '(home)'}`);
  }
}
addCheck('every live tool appears in localized tools hubs', missingHubLinks.length === 0, missingHubLinks.join('; '));

const badRelatedLinks = [];
const relatedHrefRe = /<!-- RELATED_TOOLS_START -->([\s\S]*?)<!-- RELATED_TOOLS_END -->/g;
for (const file of allHtmlFiles()) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = relatedHrefRe.exec(html))) {
    const hrefs = [...match[1].matchAll(/href="([^"]+)"/g)].map((item) => item[1]);
    for (const href of hrefs) {
      const slug = href.replace(/^\/(th|vi|zh|ja|ko|es|fr)\//, '/').replace(/^\/|\/$/g, '');
      const tool = toolMap.get(slug);
      if (!tool || tool.status !== 'live') badRelatedLinks.push(`${rel} -> ${href}`);
      else {
        const locale = LOCALES.find((item) => href === slugPath(slug, item));
        if (locale && !fs.existsSync(filePath(slug, locale))) badRelatedLinks.push(`${rel} -> missing ${href}`);
      }
    }
  }
}
addCheck('generated related-tool links point to live existing pages', badRelatedLinks.length === 0, badRelatedLinks.join('; '));

const toolsPageIssues = [];
for (const locale of LOCALES) {
  const html = read(locale.toolsPath);
  if (!html.includes('rel="canonical"')) toolsPageIssues.push(`${locale.code}:missing canonical`);
  // AdSense intentionally removed pending re-approval. Flag accidental reintroduction.
  if (html.includes('google-adsense-account') || html.includes('adsbygoogle')) toolsPageIssues.push(`${locale.code}:adsense present (must stay removed until approved)`);
  for (const alt of LOCALES) {
    if (!shouldKeepHreflang(alt.hreflang)) continue;
    if (!html.includes(`hreflang="${alt.hreflang}"`)) toolsPageIssues.push(`${locale.code}:missing ${alt.hreflang}`);
  }
  if (!html.includes('hreflang="x-default"')) toolsPageIssues.push(`${locale.code}:missing x-default`);
}
addCheck('tools pages have canonical and hreflang alternates, and no AdSense (removed pending approval)', toolsPageIssues.length === 0, toolsPageIssues.join('; '));

const allHtml = allHtmlFiles().map((file) => fs.readFileSync(file, 'utf8')).join('\n');
addCheck('no www canonical remains', !/rel="canonical" href="https:\/\/www\.convertunlimited\.com/.test(allHtml));

const sitemap = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf8') : '';
const missingSitemap = [];
for (const tool of liveTools) {
  for (const locale of LOCALES) {
    const loc = `${BASE_URL}${slugPath(tool.slug, locale)}`;
    if (!isIndexableRoute(slugPath(tool.slug, locale))) continue;
    if (!sitemap.includes(`<loc>${loc}</loc>`)) missingSitemap.push(loc);
  }
}
addCheck('sitemap includes indexable live tool pages', missingSitemap.length === 0, missingSitemap.slice(0, 20).join('; '));
addCheck('robots points to canonical sitemap', read('robots.txt').includes(`Sitemap: ${BASE_URL}/sitemap-index.xml`));
addCheck('no www production domain remains', !/https:\/\/www\.convertunlimited\.com/.test(`${allHtml}\n${sitemap}\n${read('robots.txt')}\n${read('scripts/generate-sitemap.js')}`));

const missingLocalizedRegistryText = [];
for (const tool of tools) {
  for (const locale of LOCALES.filter((item) => item.code !== 'en')) {
    if (!tool.labels || !tool.labels[locale.code]) missingLocalizedRegistryText.push(`${tool.slug || '(home)'}:${locale.code}`);
  }
}
addCheck('registry localized tool text coverage', missingLocalizedRegistryText.length === 0, `${missingLocalizedRegistryText.length} missing localized label sets; generator falls back to harvested page text or English`, 'warning');

const sitemapUrlCount = (sitemap.match(/<loc>/g) || []).length;
console.log('ConvertUnlimited Registry Validation');
for (const check of checks) {
  const status = check.pass ? 'PASS' : check.level === 'warning' ? 'WARN' : 'FAIL';
  console.log(`${status} ${check.name}${check.detail ? ` - ${check.detail}` : ''}`);
}
console.log(`SITEMAP_URL_COUNT ${sitemapUrlCount}`);

const failed = checks.filter((check) => !check.pass && check.level !== 'warning');
process.exit(failed.length ? 1 : 0);
