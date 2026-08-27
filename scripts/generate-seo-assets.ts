import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_LISTINGS, INITIAL_PAGES } from '../src/data/seedListings';
import { EXPLORE_DIRECTORIES, getExplorePath } from '../src/data/exploreDirectories';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.URL || 'https://vebpartner.com').replace(/\/+$/, '');
type SitemapUrl = { loc: string; priority: string; lastmod?: string };

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const listings: SitemapUrl[] = INITIAL_LISTINGS.filter((listing) => listing.status !== 'draft').map((listing) => ({
  loc: `${siteUrl}/business/${encodeURIComponent(listing.slug || listing.id)}`,
  lastmod: listing.updatedAt || listing.createdAt,
  priority: '0.8',
}));

const pages: SitemapUrl[] = INITIAL_PAGES.filter((page) => page.published !== false && page.slug).map((page) => ({
  loc: `${siteUrl}/${encodeURIComponent(page.slug)}`,
  priority: page.slug === 'about' ? '0.7' : '0.6',
}));

const explorePages: SitemapUrl[] = EXPLORE_DIRECTORIES.map((directory) => ({
  loc: `${siteUrl}${getExplorePath(directory.slug)}`,
  priority: '0.7',
}));

const urls: SitemapUrl[] = [
  { loc: `${siteUrl}/`, priority: '1.0' },
  ...listings,
  ...pages,
  ...explorePages,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

console.log(`Generated ${urls.length} sitemap URLs for ${siteUrl}`);
