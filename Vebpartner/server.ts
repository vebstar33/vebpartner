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
  ToolListing,
  UserSubmission,
  Category,
  Advertisement,
  CustomPage,
  SiteSettings,
  TagItem,
} from './src/types.ts';

const app = express();
const PORT = 3000;

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

let listings: ToolListing[] = deduplicateById(loadData<ToolListing[]>(LISTINGS_FILE, INITIAL_LISTINGS));
let submissions: UserSubmission[] = loadData<UserSubmission[]>(SUBMISSIONS_FILE, [
  {
    id: 'sub-1',
    toolName: 'AFFiNE',
    tagline: 'Next-gen all-in-one workspace with shape & block editor, replacing Notion and Miro',
    replaces: 'Notion, Miro, Monday.com',
    githubUrl: 'https://github.com/toeverything/AFFiNE',
    websiteUrl: 'https://affine.pro',
    category: 'productivity',
    license: 'MIT',
    submittedBy: 'community_member',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'pending',
    notes: 'Outstanding hybrid canvas + doc editor, very popular with 42k stars.',
  },
  {
    id: 'sub-2',
    toolName: 'Umami',
    tagline: 'Simple, fast, privacy-focused alternative to Google Analytics',
    replaces: 'Google Analytics',
    githubUrl: 'https://github.com/umami-software/umami',
    websiteUrl: 'https://umami.is',
    category: 'analytics',
    license: 'MIT',
    submittedBy: 'alex_dev',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    notes: 'Easy to self-host with Vercel and Supabase Postgres.',
  },
]);
let categories: Category[] = loadData<Category[]>(CATEGORIES_FILE, INITIAL_CATEGORIES);
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
    brand: 'Vebstar',
    listingsCount: listings.length,
    categoriesCount: categories.length,
    adsCount: ads.length,
    pagesCount: pages.length,
  });
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
      category: data.category || 'developer-tools',
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
      pricingModel: data.pricingModel || '100% Free Open Source',
      logoUrl: data.logoUrl || '',
      screenshotUrl: data.screenshotUrl || '',
      featured: Boolean(data.featured),
      verified: data.verified !== undefined ? Boolean(data.verified) : true,
      isAiNative: Boolean(data.isAiNative),
      isSponsored: Boolean(data.isSponsored),
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
    const count = listings.filter(
      (l) => l.category === cat.id || (Array.isArray(l.categoriesList) && l.categoriesList.includes(cat.name))
    ).length;
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
      description: description || `Browse open source alternatives in ${name}`,
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
    if (Array.isArray(l.tags)) {
      l.tags.forEach((t) => {
        const clean = t.trim();
        if (clean) counts[clean] = (counts[clean] || 0) + 1;
      });
    }
  });
  const tagList: TagItem[] = Object.entries(counts).map(([name, count]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    count,
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
      category: data.category || 'developer-tools',
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
      tagline: sub.tagline || `Open source alternative to ${sub.replaces || 'proprietary tools'}`,
      description: `${sub.toolName} is an open-source tool submitted by the community. It provides a transparent, customizable alternative to ${sub.replaces || 'proprietary software'}.`,
      replaces: sub.replaces ? sub.replaces.split(',').map((r) => r.trim()).filter(Boolean) : ['Proprietary SaaS'],
      category: sub.category || 'developer-tools',
      tags: ['Open Source', 'Community Pick', sub.category],
      techStack: ['TypeScript', 'JavaScript'],
      license: sub.license || 'MIT',
      githubUrl: sub.githubUrl || '',
      stars: 1200,
      websiteUrl: sub.websiteUrl || '',
      pricingModel: '100% Free Open Source',
      featured: false,
      verified: true,
      upvotes: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pros: ['Community driven & open source', 'Direct replacement for proprietary software'],
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
      const prompt = `Analyze this open-source software project: "${input}". 
Extract and generate structured metadata for a Vebstar open-source directory listing in JSON format.
Include:
- name: Official project name
- tagline: A punchy 1-sentence description (e.g. "The open source Firebase alternative with Postgres database")
- description: 2-3 detailed sentences explaining key capabilities and architectural strengths.
- replaces: Array of famous proprietary closed-source SaaS applications it replaces (e.g. ["Notion", "Airtable"] or ["Google Analytics"] or ["Calendly"])
- category: One of ["analytics", "database", "productivity", "developer-tools", "project-management", "design-media", "crm-support", "forms-surveys", "scheduling", "documents", "marketing-cms", "ecommerce", "automation", "security", "customer-communication", "social-media"]
- tags: Array of 4-6 keyword tags
- techStack: Array of primary technologies/languages (e.g. ["TypeScript", "Rust", "PostgreSQL", "Next.js"])
- license: License string (e.g. "MIT", "AGPL-3.0", "Apache-2.0")
- estimatedStars: Estimated GitHub star count as integer (e.g. 25000)
- pricingModel: One of "100% Free Open Source" | "Open Core / Freemium Cloud" | "Self-Hosted Free"
- dockerCommand: A typical quickstart docker command or "docker run -p 8080:8080 ..."
- comparisonPoints: Array of 3 objects { feature: string, openSourceTool: string, proprietaryTool: string }
- pros: Array of 3 key advantages vs proprietary software
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
    tagline: `Modern open source alternative software built with high performance and data privacy`,
    description: `${capitalized} is a community-driven open source platform designed as a transparent, self-hostable replacement for proprietary cloud services.`,
    replaces: ['Proprietary SaaS', 'Cloud Vendor'],
    category: 'developer-tools',
    tags: ['Open Source', 'Self-Hosted', 'Developer Tools', 'Privacy'],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    license: 'MIT',
    estimatedStars: 15000,
    pricingModel: 'Open Core / Freemium Cloud',
    dockerCommand: `docker run -p 3000:3000 ${nameClean.toLowerCase()}/${nameClean.toLowerCase()}:latest`,
    comparisonPoints: [
      { feature: 'Data Sovereignty', openSourceTool: 'Full control on your private servers', proprietaryTool: 'Vendor cloud lock-in' },
      { feature: 'License & Cost', openSourceTool: 'Free open source core', proprietaryTool: 'Recurring user seat subscriptions' },
    ],
    pros: ['No vendor lock-in', 'Customizable and self-hostable', 'Active community'],
    cons: ['Requires basic server infrastructure for self-hosting'],
  });
});

// ================= BACKUP & IMPORT/EXPORT =================

app.get('/api/backup/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="vebstar-backup.json"');
  res.json({
    brand: 'Vebstar',
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
      message: 'Vebstar data imported successfully',
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

  res.json({ message: 'Reset to initial curated Vebstar dataset', count: listings.length });
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
    console.log(`Vebstar Server running at http://localhost:${PORT}`);
  });
}

startServer();
