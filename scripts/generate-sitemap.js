const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BASE_URL = (process.env.BASE_URL || 'https://<MY_DOMAIN>').replace(/\/+$/, '');
const ROOT_DIR = process.cwd();
const OUTPUT_SITEMAP = path.join(ROOT_DIR, 'sitemap.xml');
const OUTPUT_ROBOTS = path.join(ROOT_DIR, 'robots.txt');

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
  const posixPath = toPosix(relPath);
  if (posixPath === 'index.html') return '/';
  if (posixPath.endsWith('/index.html')) {
    return `/${posixPath.replace(/index\.html$/, '')}`;
  }
  return `/${posixPath}`;
};

const generateSitemap = (paths) => {
  const urls = [];
  const seen = new Set();

  for (const relPath of paths) {
    const urlPath = formatUrlPath(relPath);
    if (seen.has(urlPath)) continue;
    seen.add(urlPath);
    urls.push({
      loc: `${BASE_URL}${urlPath}`,
      lastmod: getLastMod(relPath),
    });
  }

  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${entry.loc}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.5</priority>');
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

const htmlFiles = walk(ROOT_DIR);
const sitemap = generateSitemap(htmlFiles);
const robots = generateRobots();

fs.writeFileSync(OUTPUT_SITEMAP, sitemap, 'utf8');
fs.writeFileSync(OUTPUT_ROBOTS, robots, 'utf8');

console.log(`Generated ${OUTPUT_SITEMAP} and ${OUTPUT_ROBOTS}`);
