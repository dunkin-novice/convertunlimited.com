const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'tools-registry.json');

const LOCALES = [
  { code: 'en', prefix: '', toolsPath: 'tools/index.html', relatedLabel: 'Related Tools', comingSoon: 'Coming soon' },
  { code: 'th', prefix: 'th', toolsPath: 'th/tools/index.html', relatedLabel: 'เครื่องมือที่เกี่ยวข้อง', comingSoon: 'เร็วๆ นี้' },
  { code: 'vi', prefix: 'vi', toolsPath: 'vi/tools/index.html', relatedLabel: 'Công cụ liên quan', comingSoon: 'Sắp ra mắt' },
  { code: 'zh', prefix: 'zh', toolsPath: 'zh/tools/index.html', relatedLabel: '相关工具', comingSoon: '即将推出' },
  { code: 'ja', prefix: 'ja', toolsPath: 'ja/tools/index.html', relatedLabel: '関連ツール', comingSoon: '近日公開' },
  { code: 'ko', prefix: 'ko', toolsPath: 'ko/tools/index.html', relatedLabel: '관련 도구', comingSoon: '출시 예정' },
  { code: 'es', prefix: 'es', toolsPath: 'es/tools/index.html', relatedLabel: 'Herramientas relacionadas', comingSoon: 'Próximamente' },
  { code: 'fr', prefix: 'fr', toolsPath: 'fr/tools/index.html', relatedLabel: 'Outils associés', comingSoon: 'Bientôt disponible' },
];

const CATEGORY_LABELS = {
  en: { image: 'Image Tools', pdf: 'PDF Tools', seo: 'SEO Tools', developer: 'Developer Tools' },
  th: { image: 'เครื่องมือรูปภาพ', pdf: 'เครื่องมือ PDF', seo: 'เครื่องมือ SEO', developer: 'เครื่องมือนักพัฒนา' },
  vi: { image: 'Công cụ hình ảnh', pdf: 'Công cụ PDF', seo: 'Công cụ SEO', developer: 'Công cụ lập trình' },
  zh: { image: '图片工具', pdf: 'PDF 工具', seo: 'SEO 工具', developer: '开发者工具' },
  ja: { image: '画像ツール', pdf: 'PDF ツール', seo: 'SEO ツール', developer: '開発者ツール' },
  ko: { image: '이미지 도구', pdf: 'PDF 도구', seo: 'SEO 도구', developer: '개발자 도구' },
  es: { image: 'Herramientas de imagen', pdf: 'Herramientas PDF', seo: 'Herramientas SEO', developer: 'Herramientas para desarrolladores' },
  fr: { image: 'Outils image', pdf: 'Outils PDF', seo: 'Outils SEO', developer: 'Outils développeur' },
};

const ICONS = {
  'background-remover': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  'image-compressor': '<path d="M4 14h6c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2H4C2.9 4 2 4.9 2 6v6C2 13.1 2.9 14 4 14z"/><path d="M20 14h-6c-1.1 0-2-0.9-2-2V6c0-1.1 0.9-2 2-2h6c1.1 0 2 0.9 2 2v6C22 13.1 21.1 14 20 14z"/><path d="M4 22h6c1.1 0 2-0.9 2-2v-6c0-1.1-0.9-2-2-2H4c-1.1 0-2 0.9-2 2v6C2 21.1 2.9 22 4 22z"/><path d="M20 22h-6c-1.1 0-2-0.9-2-2v-6c0-1.1 0.9-2 2-2h6c1.1 0 2 0.9 2 2v6C22 21.1 21.1 22 20 22z"/>',
  'image-resizer': '<polyline points="21 8 21 21 8 21"/><line x1="21" y1="21" x2="3" y2="3"/><polyline points="3 16 3 3 16 3"/>',
  'metadata-remover': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'heic-to-jpg': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  'watermark-tool': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15l2-5 2 5"/><path d="M8 13h2"/><path d="M14 10v5"/><path d="M17 10v5"/>',
  'avif-converter': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 16l3-6 3 6"/><path d="M8 14h4"/><path d="M15 10v6"/><path d="M17 10v6"/>',
  'qr-generator': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2h-2z"/><path d="M18 14h3v3"/><path d="M14 19h3"/><path d="M19 19h2v2"/>',
  'meta-preview-checker': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10"/><path d="M7 13h6"/><path d="M15 13h2"/><path d="M7 17h4"/>',
  'json-formatter': '<path d="M8 6 4 12l4 6"/><path d="m16 6 4 6-4 6"/><path d="M14 4 10 20"/>',
  'csv-cleaner': '<path d="M4 5h16"/><path d="M4 10h16"/><path d="M4 15h16"/><path d="M8 5v14"/><path d="M16 5v14"/><path d="M4 19h16"/>',
  'csv-to-json': '<path d="M4 5h7"/><path d="M4 9h7"/><path d="M4 13h7"/><path d="M15 7l4 5-4 5"/><path d="M19 12H9"/><path d="M16 3h2a2 2 0 0 1 2 2v2"/><path d="M16 21h2a2 2 0 0 0 2-2v-2"/>',
  'json-to-csv': '<path d="M8 6 4 12l4 6"/><path d="M16 6l4 6-4 6"/><path d="M3 21h18"/><path d="M7 17h10"/><path d="M7 13h10"/><path d="M10 13v8"/><path d="M14 13v8"/>',
  'base64-encoder-decoder': '<path d="M7 8h10"/><path d="M7 16h10"/><path d="M9 4 5 20"/><path d="M19 4l-4 16"/><path d="M4 12h16"/>',
  'url-encoder-decoder': '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/>',
  'uuid-generator': '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 4 6 20"/><path d="M18 4l-2 16"/>',
  'hash-generator': '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
  'timestamp-converter': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M3 3l4 4"/><path d="M21 3l-4 4"/>',
  'regex-tester': '<path d="M4 7h4"/><path d="M6 5v4"/><path d="M12 7h.01"/><path d="M16 7h.01"/><path d="M20 7h.01"/><path d="M5 16c2-3 5-3 7 0s5 3 7 0"/>',
  'diff-checker': '<path d="M6 5h8"/><path d="M6 9h12"/><path d="M6 15h8"/><path d="M6 19h12"/><path d="M3 5h.01"/><path d="M3 9h.01"/><path d="M3 15h.01"/><path d="M3 19h.01"/><path d="m17 4 4 4-4 4"/>',
  'jwt-decoder': '<path d="M12 3 4 7v6c0 5 8 8 8 8s8-3 8-8V7l-8-4Z"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M10 18h4"/>',
  defaultImage: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  defaultPdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  defaultDev: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
};

const START_HUB = '<!-- TOOLS_HUB_START -->';
const END_HUB = '<!-- TOOLS_HUB_END -->';
const START_RELATED = '<!-- RELATED_TOOLS_START -->';
const END_RELATED = '<!-- RELATED_TOOLS_END -->';

const readRegistry = () => JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));

const decodeHtml = (value) => {
  let decoded = String(value);
  for (let i = 0; i < 5; i += 1) {
    const next = decoded
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
};

const slugToPath = (slug, locale) => {
  const prefix = locale.prefix ? `/${locale.prefix}` : '';
  if (!slug) return `${prefix}/` || '/';
  return `${prefix}/${slug}/`;
};

const fileForTool = (slug, locale) => {
  const parts = [];
  if (locale.prefix) parts.push(locale.prefix);
  if (slug) parts.push(slug);
  parts.push('index.html');
  return path.join(ROOT, ...parts);
};

const getAllTools = (registry) => registry.categories.flatMap((category) =>
  category.tools.map((tool) => ({ ...tool, categoryId: category.id }))
);

const toolBySlug = (registry) => new Map(getAllTools(registry).map((tool) => [tool.slug, tool]));

const extractCards = (html, locale, labels) => {
  const cardRe = /<a href="([^"]+)" class="tool-item"[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<\/a>/g;
  let match;
  while ((match = cardRe.exec(html))) {
    const slug = match[1].replace(/^\/(th|vi|zh|ja|ko|es|fr)\//, '/').replace(/^\/|\/$/g, '');
    const normalizedSlug = slug === '' ? '' : slug;
    if (!labels[locale.code]) labels[locale.code] = {};
    labels[locale.code][normalizedSlug] = {
      title: decodeHtml(match[2].replace(/<[^>]+>/g, '').trim()),
      description: decodeHtml(match[3].replace(/<[^>]+>/g, '').trim()),
    };
  }
};

const harvestLabels = () => {
  const labels = {};
  for (const locale of LOCALES) {
    const toolsFile = path.join(ROOT, locale.toolsPath);
    if (fs.existsSync(toolsFile)) extractCards(fs.readFileSync(toolsFile, 'utf8'), locale, labels);
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!locale.prefix && ['th', 'vi', 'zh', 'ja', 'ko', 'es', 'fr'].includes(entry.name)) continue;
        if (entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        if (entry.isFile() && entry.name === 'index.html') {
          extractCards(fs.readFileSync(full, 'utf8'), locale, labels);
        }
      }
    };
    walk(locale.prefix ? path.join(ROOT, locale.prefix) : ROOT);
  }
  return labels;
};

const labelFor = (tool, locale, labels) => {
  if (tool.labels && tool.labels[locale.code]) {
    return {
      title: tool.labels[locale.code].title || tool.title,
      description: tool.labels[locale.code].description || tool.description,
    };
  }
  if (locale.code === 'en') {
    return {
      title: tool.title,
      description: tool.description,
    };
  }
  const localized = labels[locale.code] && labels[locale.code][tool.slug];
  return {
    title: localized && localized.title ? localized.title : tool.title,
    description: localized && localized.description ? localized.description : tool.description,
  };
};

const iconFor = (tool) => {
  const body = ICONS[tool.slug] || (tool.categoryId === 'pdf' ? ICONS.defaultPdf : tool.categoryId === 'developer' || tool.categoryId === 'seo' ? ICONS.defaultDev : ICONS.defaultImage);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
};

const renderToolCard = (tool, locale, labels, { allowPlanned = false } = {}) => {
  const text = labelFor(tool, locale, labels);
  const inner = [
    '                    <div class="icon">',
    `                        ${iconFor(tool)}`,
    '                    </div>',
    `                    <h3>${escapeHtml(text.title)}${tool.status === 'planned' ? ` <span class="tool-status">${escapeHtml(locale.comingSoon)}</span>` : ''}</h3>`,
    `                    <p>${escapeHtml(text.description)}</p>`,
  ].join('\n');
  if (tool.status === 'live') {
    return [
      `                <a href="${slugToPath(tool.slug, locale)}" class="tool-item">`,
      inner,
      '                </a>',
    ].join('\n');
  }
  if (!allowPlanned) return '';
  return [
    '                <div class="tool-item is-planned" aria-disabled="true">',
    inner,
    '                </div>',
  ].join('\n');
};

const renderHub = (registry, locale, labels) => {
  const chunks = [];
  for (const category of registry.categories) {
    chunks.push(`            <div class="category-title">${escapeHtml((CATEGORY_LABELS[locale.code] && CATEGORY_LABELS[locale.code][category.id]) || category.label)}</div>`);
    chunks.push('            <div class="tool-grid">');
    for (const tool of category.tools) {
      chunks.push(renderToolCard({ ...tool, categoryId: category.id }, locale, labels, { allowPlanned: true }));
    }
    chunks.push('            </div>');
  }
  return chunks.filter(Boolean).join('\n');
};

const renderRelated = (registry, currentSlug, locale, labels) => {
  const tools = toolBySlug(registry);
  const current = tools.get(currentSlug);
  if (!current || current.status !== 'live') return '';
  const related = (current.related || [])
    .map((slug) => tools.get(slug))
    .filter((tool) => tool && tool.status === 'live' && fs.existsSync(fileForTool(tool.slug, locale)))
    .slice(0, 3);
  if (!related.length) return '';
  return [
    '        <section class="related-tools">',
    `            <div class="category-title">${escapeHtml(locale.relatedLabel)}</div>`,
    '            <div class="tool-grid">',
    ...related.map((tool) => renderToolCard(tool, locale, labels)),
    '            </div>',
    '        </section>',
  ].join('\n');
};

const replaceMarked = (html, start, end, content) => {
  const marked = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (marked.test(html)) return html.replace(marked, `${start}\n${content}\n${end}`);
  return null;
};

const updateHubPage = (registry, locale, labels) => {
  const file = path.join(ROOT, locale.toolsPath);
  const original = fs.readFileSync(file, 'utf8');
  const content = renderHub(registry, locale, labels);
  let next = replaceMarked(original, START_HUB, END_HUB, content);
  if (next === null) {
    const heroEnd = original.indexOf('            </section>', original.indexOf('<section class="hero">'));
    const relatedStart = original.indexOf('        <section class="related-tools">', heroEnd);
    const mainEnd = original.indexOf('        </main>', heroEnd);
    const stop = relatedStart > -1 ? relatedStart : mainEnd;
    if (heroEnd === -1 || stop === -1) throw new Error(`Could not place hub markers in ${locale.toolsPath}`);
    next = `${original.slice(0, heroEnd + '            </section>'.length)}\n\n${START_HUB}\n${content}\n${END_HUB}\n${original.slice(stop)}`;
  }
  if (next !== original) fs.writeFileSync(file, next, 'utf8');
};

const currentSlugFromFile = (file, locale) => {
  let rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (locale.prefix && rel.startsWith(`${locale.prefix}/`)) rel = rel.slice(locale.prefix.length + 1);
  if (rel === 'index.html') return '';
  if (rel.endsWith('/index.html')) return rel.replace(/\/index\.html$/, '');
  return null;
};

const updateRelatedPage = (registry, file, locale, labels) => {
  const slug = currentSlugFromFile(file, locale);
  if (slug === null || slug === 'tools') return;
  const tools = toolBySlug(registry);
  if (!tools.has(slug)) return;
  const original = fs.readFileSync(file, 'utf8');
  const content = renderRelated(registry, slug, locale, labels);
  if (!content) return;
  let next = replaceMarked(original, START_RELATED, END_RELATED, content);
  if (next === null) {
    const relatedStart = original.indexOf('        <section class="related-tools">');
    const mainEnd = original.indexOf('        </main>');
    if (relatedStart === -1 || mainEnd === -1) throw new Error(`Could not place related markers in ${path.relative(ROOT, file)}`);
    next = `${original.slice(0, relatedStart)}${START_RELATED}\n${content}\n${END_RELATED}\n${original.slice(mainEnd)}`;
  }
  if (next !== original) fs.writeFileSync(file, next, 'utf8');
};

const validateRegistry = (registry) => {
  const errors = [];
  const slugs = new Set();
  for (const category of registry.categories || []) {
    if (!category.id || !category.label || !Array.isArray(category.tools)) errors.push(`Invalid category: ${JSON.stringify(category)}`);
    for (const tool of category.tools || []) {
      if (slugs.has(tool.slug)) errors.push(`Duplicate tool slug: ${tool.slug || '(home)'}`);
      slugs.add(tool.slug);
      if (!['live', 'planned'].includes(tool.status)) errors.push(`Invalid status for ${tool.slug}: ${tool.status}`);
      if (!Array.isArray(tool.related)) errors.push(`Missing related list for ${tool.slug}`);
    }
  }
  for (const tool of getAllTools(registry)) {
    for (const related of tool.related || []) {
      if (!slugs.has(related)) errors.push(`Unknown related slug "${related}" on ${tool.slug || '(home)'}`);
    }
  }
  return errors;
};

const main = () => {
  const registry = readRegistry();
  const errors = validateRegistry(registry);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const labels = harvestLabels();
  for (const locale of LOCALES) updateHubPage(registry, locale, labels);
  for (const locale of LOCALES) {
    for (const tool of getAllTools(registry).filter((item) => item.status === 'live')) {
      const file = fileForTool(tool.slug, locale);
      if (fs.existsSync(file)) updateRelatedPage(registry, file, locale, labels);
    }
  }
  console.log('Generated tool hub and related-tool blocks from tools-registry.json');
};

main();
