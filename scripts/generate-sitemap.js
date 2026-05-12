const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_BASE_URL = 'https://www.convertunlimited.com';
const RAW_BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');
const ROOT_DIR = process.cwd();
const DEPLOY_DIR = process.env.DEPLOY_DIR || '.';
const SOURCE_DIR = path.resolve(ROOT_DIR, DEPLOY_DIR);
const OUTPUT_SITEMAP = path.join(SOURCE_DIR, 'sitemap.xml');
const OUTPUT_ROBOTS = path.join(SOURCE_DIR, 'robots.txt');

if (/[<>]/.test(BASE_URL)) {
  throw new Error(`BASE_URL contains invalid characters: ${BASE_URL}`);
}

if (!/^https?:\/\//i.test(BASE_URL)) {
  throw new Error(`BASE_URL must be an absolute URL, got: ${BASE_URL}`);
}

const EXCLUDED_DIRS = new Set([
  'assets',
  'img',
  'images',
  'css',
  'js',
  'fonts',
  'node_modules',
  '.git',
  '.github',
  'dist',
  'build',
  'coverage',
]);

const EXCLUDED_FILES = new Set(['404.html']);

const toPosix = (filePath) => filePath.split(path.sep).join('/');

const isExcludedPath = (relPath) => {
  const segments = toPosix(relPath).split('/');
  for (const segment of segments) {
    if (!segment) continue;
    if (EXCLUDED_DIRS.has(segment)) return true;
    if (segment.startsWith('_')) return true;
  }
  if (EXCLUDED_FILES.has(path.basename(relPath))) return true;
  return false;
};

const walk = (dir, fileList = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath);
    if (isExcludedPath(relPath)) {
      continue;
    }
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(relPath);
    }
  }
  return fileList;
};

const getLastMod = (relPath) => {
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', relPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (output) return output;
  } catch (error) {
    // Fall through to filesystem timestamp.
  }
  const stats = fs.statSync(path.join(ROOT_DIR, relPath));
  return stats.mtime.toISOString();
};

const formatUrlPath = (relPath) => {
  const posixPath = toPosix(path.relative(SOURCE_DIR, path.resolve(ROOT_DIR, relPath)));
  if (posixPath === 'index.html') return '/';
  if (posixPath.endsWith('/index.html')) {
    return `/${posixPath.replace(/index\.html$/, '')}`;
  }
  return `/${posixPath}`;
};

const xmlEscape = (value) => value.replace(/[&<>"']/g, (char) => {
  switch (char) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    case "'":
      return '&apos;';
    default:
      return char;
  }
});

const LOCALES = [
  { code: 'en', prefix: '', hreflang: 'en' },
  { code: 'th', prefix: 'th', hreflang: 'th' },
  { code: 'vi', prefix: 'vi', hreflang: 'vi' },
  { code: 'zh', prefix: 'zh', hreflang: 'zh-Hans' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko' },
  { code: 'es', prefix: 'es', hreflang: 'es' },
  { code: 'fr', prefix: 'fr', hreflang: 'fr' },
];
const LOCALE_BY_PREFIX = new Map(LOCALES.filter((locale) => locale.prefix).map((locale) => [locale.prefix, locale]));
const LOCALIZED_HOME_PATHS = new Set(['/', '/th/', '/vi/', '/zh/', '/ja/', '/ko/', '/es/', '/fr/']);

const generateSitemap = (paths) => {
  const urls = [];
  const seen = new Set();
  const clusters = new Map();

  for (const relPath of paths) {
    const urlPath = formatUrlPath(relPath);
    if (seen.has(urlPath)) continue;
    seen.add(urlPath);
    const segments = urlPath.split('/').filter(Boolean);
    const locale = LOCALE_BY_PREFIX.get(segments[0]) || LOCALES[0];
    const clusterPath = locale.code === 'en' ? urlPath : `/${segments.slice(1).join('/')}${segments.length > 1 ? '/' : ''}`;
    const clusterKey = clusterPath || '/';
    if (!clusters.has(clusterKey)) clusters.set(clusterKey, new Map());
    clusters.get(clusterKey).set(locale.code, urlPath);
    const encodedPath = encodeURI(urlPath);
    urls.push({
      loc: `${BASE_URL}${encodedPath}`,
      lastmod: getLastMod(relPath),
      urlPath,
      clusterKey,
      isLocalizedHome: LOCALIZED_HOME_PATHS.has(urlPath),
    });
  }

  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(entry.loc)}</loc>`);
    lines.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push(`    <priority>${entry.isLocalizedHome ? '1.0' : '0.5'}</priority>`);
    const cluster = clusters.get(entry.clusterKey);
    if (cluster && cluster.size > 1) {
      const defaultPath = cluster.get('en') || entry.urlPath;
      lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(`${BASE_URL}${defaultPath}`)}"/>`);
      for (const locale of LOCALES) {
        const alternatePath = cluster.get(locale.code);
        if (!alternatePath) continue;
        lines.push(`    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${xmlEscape(`${BASE_URL}${alternatePath}`)}"/>`);
      }
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
};

const generateRobots = () => [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  '',
].join('\n');

const htmlFiles = walk(SOURCE_DIR);
const sitemap = generateSitemap(htmlFiles);
const robots = generateRobots();

fs.writeFileSync(OUTPUT_SITEMAP, sitemap, 'utf8');
fs.writeFileSync(OUTPUT_ROBOTS, robots, 'utf8');

console.log(`Generated ${OUTPUT_SITEMAP} and ${OUTPUT_ROBOTS}`);
