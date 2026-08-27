import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_LISTINGS,
  INITIAL_CATEGORIES,
  INITIAL_ADS,
  INITIAL_PAGES,
  INITIAL_SITE_SETTINGS,
} from './src/data/seedListings.ts';
import {
  BUSINESS_FILTER_TAGS,
  getBusinessFilterTags,
  getListingBusinessCategoryNames,
  getListingPrimaryBusinessCategoryId,
  listingMatchesBusinessCategory,
} from './src/lib/businessTaxonomy.ts';
import { PROTOTYPE_LISTING_TYPES, PROTOTYPE_OPPORTUNITY_DETAILS } from './src/lib/listingTypePresentation.ts';
import { EXPLORE_DIRECTORIES, getExplorePath } from './src/data/exploreDirectories.ts';
import {
  ToolListing,
  UserSubmission,
  Category,
  Advertisement,
  CustomPage,
  SiteSettings,
  TagItem,
  ExploreMetadata,
} from './src/types.ts';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10mb' }));

// In-memory + file-backed data store
const DATA_DIR = path.join(process.cwd(), '.data');
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const ADS_FILE = path.join(DATA_DIR, 'ads.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function loadData<T>(file: string, defaultValue: T): T {
  try {
    ensureDataDir();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && 'id' in parsed[0]) {
        return deduplicateById(parsed as any) as T;
      }
      return parsed;
    }
  } catch (err) {
    console.error(`Error loading data from ${file}:`, err);
  }
  if (Array.isArray(defaultValue) && defaultValue.length > 0 && typeof defaultValue[0] === 'object' && 'id' in defaultValue[0]) {
    return deduplicateById(defaultValue as any) as T;
  }
  return defaultValue;
}

function saveData<T>(file: string, data: T) {
  try {
    ensureDataDir();
    const dataToSave = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'id' in data[0]
      ? deduplicateById(data as any)
      : data;
    fs.writeFileSync(file, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving data to ${file}:`, err);
  }
}

const PROVIDER_LOGO_PATHS: Record<string, string> = {
  apollo: '/providers/apollo.png',
  birdeye: '/providers/birdeye.png',
  brightlocal: '/providers/brightlocal.png',
  cloudways: '/providers/cloudways.png',
  crisp: '/providers/crisp.png',
  duda: '/providers/duda.png',
  elevenlabs: '/providers/elevenlabs.png',
  freshworks: '/providers/freshworks.png',
  getresponse: '/providers/getresponse.png',
  godaddy: '/providers/godaddy.png',
  heygen: '/providers/heygen.png',
  highlevel: '/providers/highlevel.webp',
  hostinger: '/providers/hostinger.png',
  instantly: '/providers/instantly.png',
  jotform: '/providers/jotform.png',
  kit: '/providers/kit.png',
  make: '/providers/make.png',
  podia: '/providers/podia.png',
  printful: '/providers/printful.png',
  riverside: '/providers/riverside.png',
  sellfy: '/providers/sellfy.png',
  simplybookme: '/providers/simplybookme.png',
  'simplybook.me': '/providers/simplybookme.png',
  semrush: '/providers/semrush.png',
  shopify: '/providers/shopify.png',
  socialbee: '/providers/socialbee.png',
  softr: '/providers/softr.png',
  spocket: '/providers/spocket.png',
  synthesia: '/providers/synthesia.png',
  'systeme.io': '/providers/systemeio.png',
  thinkific: '/providers/thinkific.png',
  tidio: '/providers/tidio.png',
  webflow: '/providers/webflow.png',
  writesonic: '/providers/writesonic.png',
  yesim: '/providers/yesim.webp',
  beehiiv: '/providers/beehiiv.png',
  circle: '/providers/circle.png',
};

const getSiteUrl = () => (process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.APP_URL || 'https://vebpartner.com').replace(/\/+$/, '');

const decodeHtmlEntities = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const extractAttribute = (tag: string, attribute: string) => {
  const match = tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? decodeHtmlEntities(match[1].trim()) : '';
};

const resolveUrl = (value: string | undefined, baseUrl: string) => {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
};

const extractMetaContent = (html: string, key: string) => {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const target = key.toLowerCase();

  for (const tag of tags) {
    const property = extractAttribute(tag, 'property').toLowerCase();
    const name = extractAttribute(tag, 'name').toLowerCase();
    if (property === target || name === target) {
      const content = extractAttribute(tag, 'content');
      if (content) return content;
    }
  }

  return undefined;
};

const extractLinkHref = (html: string, relNames: string[]) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const targets = relNames.map((rel) => rel.toLowerCase());

  for (const tag of tags) {
    const rel = extractAttribute(tag, 'rel').toLowerCase();
    if (targets.some((target) => rel.split(/\s+/).includes(target) || rel.includes(target))) {
      const href = extractAttribute(tag, 'href');
      if (href) return href;
    }
  }

  return undefined;
};

const extractTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].replace(/\s+/g, ' ').trim()) : undefined;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function getListingPath(listing: ToolListing) {
  return `/business/${encodeURIComponent(listing.slug || listing.id)}`;
}

function buildSitemapXml() {
  const siteUrl = getSiteUrl();
  type SitemapUrl = { loc: string; priority: string; lastmod?: string };
  const listingUrls: SitemapUrl[] = listings
    .filter((listing) => listing.status !== 'draft')
    .map((listing) => ({
      loc: `${siteUrl}${getListingPath(listing)}`,
      lastmod: listing.updatedAt || listing.createdAt,
      priority: '0.8',
    }));
  const pageUrls: SitemapUrl[] = pages
    .filter((page) => page.published !== false && page.slug)
    .map((page) => ({
      loc: `${siteUrl}/${encodeURIComponent(page.slug)}`,
      priority: page.slug === 'about' ? '0.7' : '0.6',
    }));
  const exploreUrls: SitemapUrl[] = EXPLORE_DIRECTORIES.map((directory) => ({
    loc: `${siteUrl}${getExplorePath(directory.slug)}`,
    priority: '0.7',
  }));
  const urls: SitemapUrl[] = [{ loc: `${siteUrl}/`, priority: '1.0' }, ...listingUrls, ...pageUrls, ...exploreUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

function normalizeBusinessListing(listing: ToolListing): ToolListing {
  const category = getListingPrimaryBusinessCategoryId(listing.id, listing.name);
  const categoriesList = getListingBusinessCategoryNames(listing.id, listing.name);
  const tags = Array.from(new Set([...getBusinessFilterTags(listing), ...(listing.tags || [])]));
  const prototypeType = PROTOTYPE_LISTING_TYPES[listing.id];
  const prototypeOpportunityDetails = PROTOTYPE_OPPORTUNITY_DETAILS[listing.id];
  const providerName = listing.providerName || listing.blueprintDetails?.providerName || '';
  const mappedProviderLogoUrl = PROVIDER_LOGO_PATHS[providerName.toLowerCase()];
  return {
    ...listing,
    category,
    categoriesList,
    tags,
    listingType: listing.listingType || prototypeType?.listingType,
    partnerModels: listing.partnerModels || prototypeType?.partnerModels,
    providerLogoUrl: mappedProviderLogoUrl || listing.providerLogoUrl,
    partnerModel: listing.partnerModel || prototypeOpportunityDetails?.partnerModel,
    youSell: listing.youSell || prototypeOpportunityDetails?.youSell,
    providerHandles: listing.providerHandles || prototypeOpportunityDetails?.providerHandles,
    youEarnThrough: listing.youEarnThrough || prototypeOpportunityDetails?.youEarnThrough,
  };
}

let listings: ToolListing[] = deduplicateById(loadData<ToolListing[]>(LISTINGS_FILE, INITIAL_LISTINGS)).map(normalizeBusinessListing);
let submissions: UserSubmission[] = loadData<UserSubmission[]>(SUBMISSIONS_FILE, []);
let categories: Category[] = INITIAL_CATEGORIES;
let ads: Advertisement[] = loadData<Advertisement[]>(ADS_FILE, INITIAL_ADS);
let pages: CustomPage[] = loadData<CustomPage[]>(PAGES_FILE, INITIAL_PAGES);
let siteSettings: SiteSettings = loadData<SiteSettings>(SETTINGS_FILE, INITIAL_SITE_SETTINGS);

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// ================= API ROUTES =================

// Health check & System stats
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Vebpartner',
    listingsCount: listings.length,
    categoriesCount: categories.length,
    adsCount: ads.length,
    pagesCount: pages.length,
  });
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(buildSitemapXml());
});

app.get('/robots.txt', (req, res) => {
  const siteUrl = getSiteUrl();
  res.type('text/plain').send(`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
});

// Analytics Overview
app.get('/api/analytics', (req, res) => {
  const totalStars = listings.reduce((acc, l) => acc + (l.stars || 0), 0);
  const totalUpvotes = listings.reduce((acc, l) => acc + (l.upvotes || 0), 0);
  const featuredCount = listings.filter((l) => l.featured).length;
  const verifiedCount = listings.filter((l) => l.verified).length;
  const pendingSubs = submissions.filter((s) => s.status === 'pending').length;
  const totalAdClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const totalAdImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);

  // Extract all tags and counts
  const tagCounts: Record<string, number> = {};
  listings.forEach((l) => {
    if (Array.isArray(l.tags)) {
      l.tags.forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean) tagCounts[clean] = (tagCounts[clean] || 0) + 1;
      });
    }
  });

  res.json({
    totalListings: listings.length,
    totalStars,
    totalUpvotes,
    featuredCount,
    verifiedCount,
    categoriesCount: categories.length,
    pendingSubmissions: pendingSubs,
    totalAds: ads.length,
    activeAds: ads.filter((a) => a.active).length,
    totalAdClicks,
    totalAdImpressions,
    publishedPages: pages.filter((p) => p.published).length,
    totalPages: pages.length,
    tagCounts,
  });
});

// ================= LISTINGS API =================

app.get('/api/listings', (req, res) => {
  res.json(listings);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id || l.slug === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

app.post('/api/listings', (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.tagline) {
      return res.status(400).json({ error: 'Name and tagline are required' });
    }

    const id = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `tool-${Date.now()}`;
    const slug = data.slug || id;

    const newListing: ToolListing = {
      id,
      name: data.name,
      slug,
      tagline: data.tagline,
      description: data.description || '',
      replaces: Array.isArray(data.replaces) ? data.replaces : (data.replaces ? data.replaces.split(',').map((s: string) => s.trim()) : []),
      category: data.category || 'agencies-services',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((s: string) => s.trim()) : []),
      techStack: Array.isArray(data.techStack) ? data.techStack : (data.techStack ? data.techStack.split(',').map((s: string) => s.trim()) : []),
      license: data.license || 'MIT',
      githubUrl: data.githubUrl || '',
      stars: Number(data.stars) || 0,
      forks: Number(data.forks) || 0,
      websiteUrl: data.websiteUrl || '',
      docsUrl: data.docsUrl || '',
      demoUrl: data.demoUrl || '',
      dockerCommand: data.dockerCommand || '',
      pricingModel: data.pricingModel || 'Partner Program / Tool',
      logoUrl: data.logoUrl || '',
      screenshotUrl: data.screenshotUrl || '',
      featured: Boolean(data.featured),
      verified: data.verified !== undefined ? Boolean(data.verified) : true,
      isAiNative: Boolean(data.isAiNative),
      isSponsored: Boolean(data.isSponsored),
      listingType: data.listingType,
      partnerModels: Array.isArray(data.partnerModels) ? data.partnerModels : undefined,
      partnerModel: data.partnerModel,
      youSell: data.youSell,
      providerHandles: data.providerHandles,
      youEarnThrough: data.youEarnThrough,
      adCtaText: data.adCtaText || '',
      adCtaUrl: data.adCtaUrl || '',
      upvotes: Number(data.upvotes) || 1,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comparisonPoints: data.comparisonPoints || [],
      pros: data.pros || [],
      cons: data.cons || [],
      similarProjects: data.similarProjects || [],
      selfHosted: data.selfHosted || 'Yes',
      version: data.version || 'v1.0.0',
    };

    const existingIndex = listings.findIndex((l) => l.id === id);
    if (existingIndex >= 0) {
      listings[existingIndex] = newListing;
    } else {
      listings.unshift(newListing);
    }

    saveData(LISTINGS_FILE, listings);
    res.status(201).json(newListing);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create listing' });
  }
});

app.put('/api/listings/:id', (req, res) => {
  try {
    const id = req.params.id;
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const updatedListing: ToolListing = {
      ...listings[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    listings[index] = updatedListing;
    saveData(LISTINGS_FILE, listings);
    res.json(updatedListing);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', (req, res) => {
  try {
    const id = req.params.id;
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const removed = listings.splice(index, 1)[0];
    saveData(LISTINGS_FILE, listings);
    res.json({ message: 'Listing deleted successfully', deleted: removed });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete listing' });
  }
});

// Bulk Delete Listings
app.post('/api/listings/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided for bulk delete' });
    }
    const idSet = new Set(ids);
    const beforeCount = listings.length;
    listings = listings.filter((l) => !idSet.has(l.id));
    const deletedCount = beforeCount - listings.length;
    saveData(LISTINGS_FILE, listings);
    res.json({ message: `Successfully deleted ${deletedCount} listings`, deletedCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Bulk delete failed' });
  }
});

// Bulk Update Listings
app.post('/api/listings/bulk-update', (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Valid IDs and updates object required' });
    }
    const idSet = new Set(ids);
    let updatedCount = 0;
    listings = listings.map((l) => {
      if (idSet.has(l.id)) {
        updatedCount++;
        return {
          ...l,
          ...updates,
          id: l.id,
          updatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    saveData(LISTINGS_FILE, listings);
    res.json({ message: `Successfully updated ${updatedCount} listings`, updatedCount, updates });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Bulk update failed' });
  }
});

app.post('/api/listings/:id/vote', (req, res) => {
  const id = req.params.id;
  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const { delta = 1 } = req.body;
  listing.upvotes = Math.max(0, (listing.upvotes || 0) + Number(delta));
  saveData(LISTINGS_FILE, listings);
  res.json({ id: listing.id, upvotes: listing.upvotes });
});

// ================= CATEGORIES API =================

app.get('/api/categories', (req, res) => {
  // Update counts dynamically
  const categoriesWithCounts = categories.map((cat) => {
    if (cat.id === 'all') {
      return { ...cat, count: listings.length };
    }
    const count = listings.filter((listing) => listingMatchesBusinessCategory(listing, cat.id)).length;
    return { ...cat, count };
  });
  res.json(categoriesWithCounts);
});

app.post('/api/categories', (req, res) => {
  try {
    const { name, id, icon, description, badgeColor, featured } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const catId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory: Category = {
      id: catId,
      name,
      icon: icon || 'Sparkles',
      description: description || `Browse business opportunities and tools in ${name}`,
      badgeColor: badgeColor || 'emerald',
      featured: Boolean(featured),
    };

    const existIdx = categories.findIndex((c) => c.id === catId);
    if (existIdx >= 0) {
      categories[existIdx] = newCategory;
    } else {
      categories.push(newCategory);
    }

    saveData(CATEGORIES_FILE, categories);
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const catId = req.params.id;
    const idx = categories.findIndex((c) => c.id === catId);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    categories[idx] = {
      ...categories[idx],
      ...req.body,
      id: catId,
    };
    saveData(CATEGORIES_FILE, categories);
    res.json(categories[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const catId = req.params.id;
    if (catId === 'all') return res.status(400).json({ error: 'Cannot delete default "all" category' });
    const idx = categories.findIndex((c) => c.id === catId);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    const removed = categories.splice(idx, 1)[0];
    saveData(CATEGORIES_FILE, categories);
    res.json({ message: 'Category removed', deleted: removed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder Categories
app.put('/api/categories/reorder', (req, res) => {
  try {
    const { categories: reordered } = req.body;
    if (!Array.isArray(reordered)) {
      return res.status(400).json({ error: 'Array of categories required' });
    }
    categories = reordered;
    saveData(CATEGORIES_FILE, categories);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Reorder failed' });
  }
});

// ================= ADVERTISEMENTS & SPONSORS API =================

app.get('/api/ads', (req, res) => {
  res.json(ads);
});

app.post('/api/ads', (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.sponsorName || !data.ctaUrl) {
      return res.status(400).json({ error: 'Title, sponsor name, and CTA URL are required' });
    }

    const newAd: Advertisement = {
      id: data.id || `ad-${Date.now()}`,
      title: data.title,
      sponsorName: data.sponsorName,
      logoUrl: data.logoUrl || '',
      badgeText: data.badgeText || 'Sponsored',
      description: data.description || '',
      ctaText: data.ctaText || 'Learn More',
      ctaUrl: data.ctaUrl,
      placement: data.placement || 'navbar_top',
      active: data.active !== undefined ? Boolean(data.active) : true,
      impressions: Number(data.impressions) || 0,
      clicks: Number(data.clicks) || 0,
      bgGradient: data.bgGradient || 'from-emerald-500/20 to-cyan-500/10',
      createdAt: new Date().toISOString(),
    };

    const existIdx = ads.findIndex((a) => a.id === newAd.id);
    if (existIdx >= 0) {
      ads[existIdx] = newAd;
    } else {
      ads.unshift(newAd);
    }

    saveData(ADS_FILE, ads);
    res.status(201).json(newAd);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/ads/:id', (req, res) => {
  try {
    const id = req.params.id;
    const idx = ads.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Advertisement not found' });

    ads[idx] = {
      ...ads[idx],
      ...req.body,
      id,
    };
    saveData(ADS_FILE, ads);
    res.json(ads[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ads/:id', (req, res) => {
  try {
    const id = req.params.id;
    const idx = ads.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Advertisement not found' });

    const removed = ads.splice(idx, 1)[0];
    saveData(ADS_FILE, ads);
    res.json({ message: 'Advertisement deleted', deleted: removed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder Ads
app.put('/api/ads/reorder', (req, res) => {
  try {
    const { ads: reordered } = req.body;
    if (!Array.isArray(reordered)) {
      return res.status(400).json({ error: 'Array of ads required' });
    }
    ads = reordered;
    saveData(ADS_FILE, ads);
    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Reorder ads failed' });
  }
});

// Track Ad Click
app.post('/api/ads/:id/click', (req, res) => {
  const id = req.params.id;
  const ad = ads.find((a) => a.id === id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    saveData(ADS_FILE, ads);
    return res.json({ id: ad.id, clicks: ad.clicks });
  }
  res.status(404).json({ error: 'Ad not found' });
});

// ================= CUSTOM & EDITORIAL PAGES API =================

app.get('/api/pages', (req, res) => {
  res.json(pages);
});

app.get('/api/pages/:slug', (req, res) => {
  const page = pages.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

app.post('/api/pages', (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.contentMarkdown) {
      return res.status(400).json({ error: 'Page title and content are required' });
    }

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPage: CustomPage = {
      id: data.id || `page-${slug}`,
      slug,
      title: data.title,
      subtitle: data.subtitle || '',
      badge: data.badge || 'Guide',
      contentMarkdown: data.contentMarkdown,
      published: data.published !== undefined ? Boolean(data.published) : true,
      showInMenu: Boolean(data.showInMenu),
      showInFooter: data.showInFooter !== undefined ? Boolean(data.showInFooter) : true,
      category: data.category || 'resources',
      lastUpdated: new Date().toISOString(),
    };

    const existIdx = pages.findIndex((p) => p.slug === slug || p.id === newPage.id);
    if (existIdx >= 0) {
      pages[existIdx] = newPage;
    } else {
      pages.push(newPage);
    }

    saveData(PAGES_FILE, pages);
    res.status(201).json(newPage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pages/:id', (req, res) => {
  try {
    const id = req.params.id;
    const idx = pages.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ error: 'Page not found' });

    pages[idx] = {
      ...pages[idx],
      ...req.body,
      id: pages[idx].id,
      lastUpdated: new Date().toISOString(),
    };

    saveData(PAGES_FILE, pages);
    res.json(pages[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pages/:id', (req, res) => {
  try {
    const id = req.params.id;
    const idx = pages.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ error: 'Page not found' });

    const removed = pages.splice(idx, 1)[0];
    saveData(PAGES_FILE, pages);
    res.json({ message: 'Page deleted', deleted: removed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SITE SETTINGS API =================

app.get('/api/settings', (req, res) => {
  res.json(siteSettings);
});

app.put('/api/settings', (req, res) => {
  try {
    siteSettings = {
      ...siteSettings,
      ...req.body,
    };
    saveData(SETTINGS_FILE, siteSettings);
    res.json(siteSettings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= TAGS API =================

app.get('/api/tags', (req, res) => {
  const counts: Record<string, number> = {};
  listings.forEach((l) => {
    getBusinessFilterTags(l).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  const tagList: TagItem[] = BUSINESS_FILTER_TAGS.filter((tag) => counts[tag] > 0).map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    count: counts[name],
  }));
  res.json(tagList);
});

// ================= SUBMISSIONS API =================

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  try {
    const data = req.body;
    if (!data.toolName) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    const newSub: UserSubmission = {
      id: `sub-${Date.now()}`,
      toolName: data.toolName,
      tagline: data.tagline || '',
      replaces: data.replaces || '',
      githubUrl: data.githubUrl || '',
      websiteUrl: data.websiteUrl || '',
      category: data.category || 'agencies-services',
      license: data.license || 'MIT',
      submittedBy: data.submittedBy || 'Anonymous Contributor',
      submittedAt: new Date().toISOString(),
      status: 'pending',
      notes: data.notes || '',
    };

    submissions.unshift(newSub);
    saveData(SUBMISSIONS_FILE, submissions);
    res.status(201).json(newSub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/submissions/:id/approve', (req, res) => {
  try {
    const id = req.params.id;
    const subIndex = submissions.findIndex((s) => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const sub = submissions[subIndex];
    sub.status = 'approved';

    // Convert to listing
    const listingId = sub.toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newListing: ToolListing = {
      id: listingId || `tool-${Date.now()}`,
      name: sub.toolName,
      slug: listingId,
      tagline: sub.tagline || `Business resource related to ${sub.replaces || 'online business tools'}`,
      description: `${sub.toolName} is a submitted business tool or provider listing queued for Vebpartner review.`,
      replaces: sub.replaces ? sub.replaces.split(',').map((r) => r.trim()).filter(Boolean) : ['Business Tool'],
      category: sub.category || 'agencies-services',
      tags: ['Business Resource', 'Community Pick', sub.category],
      techStack: ['TypeScript', 'JavaScript'],
      license: sub.license || 'MIT',
      githubUrl: sub.githubUrl || '',
      stars: 1200,
      websiteUrl: sub.websiteUrl || '',
      pricingModel: 'Partner Program / Tool',
      featured: false,
      verified: true,
      upvotes: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pros: ['Submitted by the community', 'Reviewed before public publication'],
      cons: ['Check documentation for complete deployment prerequisites'],
    };

    const existIdx = listings.findIndex((l) => l.id === newListing.id);
    if (existIdx >= 0) {
      listings[existIdx] = newListing;
    } else {
      listings.unshift(newListing);
    }

    saveData(LISTINGS_FILE, listings);
    saveData(SUBMISSIONS_FILE, submissions);

    res.json({ message: 'Submission approved and published as listing', listing: newListing });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/submissions/:id', (req, res) => {
  const id = req.params.id;
  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  const removed = submissions.splice(index, 1)[0];
  saveData(SUBMISSIONS_FILE, submissions);
  res.json({ message: 'Submission rejected and removed', removed });
});

// ================= EXPLORE WEBSITE METADATA =================

app.get('/api/explore/metadata', async (req, res) => {
  const inputUrl = String(req.query.url || '');

  if (!inputUrl) {
    return res.status(400).json({ error: 'url is required' });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(inputUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported URL protocol');
    }
  } catch {
    return res.status(400).json({ error: 'A valid http or https URL is required' });
  }

  const fallbackFavicon = `${parsedUrl.origin}/favicon.ico`;

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'user-agent': 'VebpartnerMetadataBot/1.0 (+https://vebpartner.com)',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      throw new Error(`Metadata request failed with ${response.status}`);
    }

    const html = (await response.text()).slice(0, 250000);
    const title = extractMetaContent(html, 'og:title') || extractTitle(html);
    const description =
      extractMetaContent(html, 'description') ||
      extractMetaContent(html, 'og:description');
    const favicon =
      extractLinkHref(html, ['apple-touch-icon', 'shortcut icon', 'icon']) ||
      '/favicon.ico';
    const imageUrl = extractMetaContent(html, 'og:image');

    const metadata: ExploreMetadata = {
      title,
      description,
      faviconUrl: resolveUrl(favicon, parsedUrl.toString()) || fallbackFavicon,
      imageUrl: resolveUrl(imageUrl, parsedUrl.toString()),
      domain: parsedUrl.hostname.replace(/^www\./, ''),
    };

    return res.json(metadata);
  } catch (err: any) {
    console.warn(`Explore metadata fallback for ${parsedUrl.hostname}:`, err.message);
    return res.json({
      title: parsedUrl.hostname.replace(/^www\./, ''),
      faviconUrl: fallbackFavicon,
      domain: parsedUrl.hostname.replace(/^www\./, ''),
    } satisfies ExploreMetadata);
  }
});

// ================= AI AUTO-ENRICHMENT =================

app.post('/api/ai/enrich', async (req, res) => {
  const { toolName, githubUrl, query } = req.body;
  const input = toolName || githubUrl || query;

  if (!input) {
    return res.status(400).json({ error: 'toolName or githubUrl is required' });
  }

  const ai = getGemini();

  if (ai) {
    try {
      const prompt = `Analyze this business tool, platform, or provider program: "${input}". 
Extract and generate structured metadata for a Vebpartner business directory listing in JSON format.
Include:
- name: Official project name
- tagline: A punchy 1-sentence description (e.g. "A CRM and automation platform for agency service packages")
- description: 2-3 detailed sentences explaining key capabilities and architectural strengths.
- replaces: Array of related providers, products, or business models (e.g. ["CRM", "Email marketing", "Booking automation"])
- category: One of ["agencies-services", "ai-businesses", "e-commerce", "creator-businesses", "reseller-businesses", "automation-no-code", "marketing-growth", "content-media"]
- tags: Array of 4-6 keyword tags
- techStack: Array of primary technologies/languages (e.g. ["TypeScript", "Rust", "PostgreSQL", "Next.js"])
- license: License string (e.g. "MIT", "AGPL-3.0", "Apache-2.0")
- estimatedStars: Estimated GitHub star count as integer (e.g. 25000)
- pricingModel: One of "Free Trial" | "Paid SaaS" | "Partner Program" | "Marketplace Fees"
- dockerCommand: A typical quickstart docker command or "docker run -p 8080:8080 ..."
- comparisonPoints: Array of 3 objects { feature: string, openSourceTool: string, proprietaryTool: string }
- pros: Array of 3 key advantages for the target business use case
- cons: Array of 1-2 honest limitations or requirements`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tagline: { type: Type.STRING },
              description: { type: Type.STRING },
              replaces: { type: Type.ARRAY, items: { type: Type.STRING } },
              category: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              license: { type: Type.STRING },
              estimatedStars: { type: Type.INTEGER },
              pricingModel: { type: Type.STRING },
              dockerCommand: { type: Type.STRING },
              comparisonPoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    openSourceTool: { type: Type.STRING },
                    proprietaryTool: { type: Type.STRING },
                  },
                  required: ['feature', 'openSourceTool', 'proprietaryTool'],
                },
              },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'tagline', 'description', 'replaces', 'category', 'tags', 'techStack', 'license'],
          },
        },
      });

      if (response.text) {
        const enriched = JSON.parse(response.text);
        return res.json(enriched);
      }
    } catch (err: any) {
      console.warn('Gemini enrichment failed, using heuristic fallback:', err.message);
    }
  }

  // Fallback heuristic enricher
  const nameClean = input.replace(/https?:\/\/(github\.com\/)?/, '').split('/')[0] || input;
  const capitalized = nameClean.charAt(0).toUpperCase() + nameClean.slice(1);
  return res.json({
    name: capitalized,
    tagline: `Practical business tool for building online services and recurring revenue`,
    description: `${capitalized} is a submitted business resource that can support a service, platform, or creator-led online business model.`,
    replaces: ['Business Tool', 'Cloud Provider'],
    category: 'agencies-services',
    tags: ['Agency', 'B2B', 'Recurring Revenue'],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    license: 'MIT',
    estimatedStars: 15000,
    pricingModel: 'Paid SaaS',
    dockerCommand: `docker run -p 3000:3000 ${nameClean.toLowerCase()}/${nameClean.toLowerCase()}:latest`,
    comparisonPoints: [
      { feature: 'Data Sovereignty', openSourceTool: 'Full control on your private servers', proprietaryTool: 'Vendor cloud lock-in' },
      { feature: 'Cost Model', openSourceTool: 'Transparent entry pricing', proprietaryTool: 'Recurring service or platform fees' },
    ],
    pros: ['No vendor lock-in', 'Customizable and self-hostable', 'Active community'],
    cons: ['Requires basic setup and provider review before launch'],
  });
});

// ================= BACKUP & IMPORT/EXPORT =================

app.get('/api/backup/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="vebpartner-backup.json"');
  res.json({
    brand: 'Vebpartner',
    timestamp: new Date().toISOString(),
    version: '2.0',
    listings,
    submissions,
    categories,
    ads,
    pages,
    siteSettings,
  });
});

app.post('/api/backup/import', (req, res) => {
  try {
    const {
      listings: importedListings,
      submissions: importedSubmissions,
      categories: importedCategories,
      ads: importedAds,
      pages: importedPages,
      siteSettings: importedSettings,
    } = req.body;

    if (Array.isArray(importedListings)) {
      listings = importedListings;
      saveData(LISTINGS_FILE, listings);
    }
    if (Array.isArray(importedSubmissions)) {
      submissions = importedSubmissions;
      saveData(SUBMISSIONS_FILE, submissions);
    }
    if (Array.isArray(importedCategories)) {
      categories = importedCategories;
      saveData(CATEGORIES_FILE, categories);
    }
    if (Array.isArray(importedAds)) {
      ads = importedAds;
      saveData(ADS_FILE, ads);
    }
    if (Array.isArray(importedPages)) {
      pages = importedPages;
      saveData(PAGES_FILE, pages);
    }
    if (importedSettings) {
      siteSettings = importedSettings;
      saveData(SETTINGS_FILE, siteSettings);
    }

    res.json({
      message: 'Vebpartner data imported successfully',
      counts: {
        listings: listings.length,
        categories: categories.length,
        ads: ads.length,
        pages: pages.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Import failed' });
  }
});

app.post('/api/backup/reset', (req, res) => {
  listings = [...INITIAL_LISTINGS];
  categories = [...INITIAL_CATEGORIES];
  ads = [...INITIAL_ADS];
  pages = [...INITIAL_PAGES];
  siteSettings = { ...INITIAL_SITE_SETTINGS };

  saveData(LISTINGS_FILE, listings);
  saveData(CATEGORIES_FILE, categories);
  saveData(ADS_FILE, ads);
  saveData(PAGES_FILE, pages);
  saveData(SETTINGS_FILE, siteSettings);

  res.json({ message: 'Reset to initial curated Vebpartner dataset', count: listings.length });
});

// ================= VITE MIDDLEWARE =================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vebpartner Server running at http://localhost:${PORT}`);
  });
}

startServer();
