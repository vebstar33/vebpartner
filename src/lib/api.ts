import {
  ToolListing,
  UserSubmission,
  Category,
  Advertisement,
  CustomPage,
  SiteSettings,
  TagItem,
  ExploreMetadata,
} from '../types';
import {
  INITIAL_ADS,
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_PAGES,
  INITIAL_SITE_SETTINGS,
} from '../data/seedListings';
import { BUSINESS_FILTER_TAGS, getBusinessFilterTags, listingMatchesBusinessCategory } from './businessTaxonomy';
import * as firestoreService from './firestoreService';

const API_BASE = '/api';

const getPublishedListings = () => INITIAL_LISTINGS.filter((listing) => listing.status !== 'draft');

const getStaticCategoriesWithCounts = () => {
  const publishedListings = getPublishedListings();

  return INITIAL_CATEGORIES.map((category) => ({
    ...category,
    count:
      category.id === 'all'
        ? publishedListings.length
        : publishedListings.filter((listing) => listingMatchesBusinessCategory(listing, category.id)).length,
  }));
};

const getStaticTags = (): TagItem[] => {
  const counts: Record<string, number> = {};

  getPublishedListings().forEach((listing) => {
    getBusinessFilterTags(listing).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return BUSINESS_FILTER_TAGS.filter((tag) => counts[tag] > 0).map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    count: counts[name],
  }));
};

export const api = {
  // Listings
  async getListings(): Promise<ToolListing[]> {
    return getPublishedListings();
  },

  async getListing(id: string): Promise<ToolListing> {
    const listing = getPublishedListings().find((item) => item.id === id || item.slug === id);
    if (!listing) throw new Error('Listing not found');
    return listing;
  },

  async createListing(listing: Partial<ToolListing>): Promise<ToolListing> {
    try {
      return await firestoreService.createListingFirestore(listing);
    } catch (err) {
      console.warn('Firestore direct write failed, attempting server proxy', err);
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create listing');
      }
      return await res.json();
    }
  },

  async updateListing(id: string, updates: Partial<ToolListing>): Promise<ToolListing> {
    try {
      return await firestoreService.updateListingFirestore(id, updates);
    } catch (err) {
      console.warn('Firestore direct update failed, attempting server proxy', err);
      const res = await fetch(`${API_BASE}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update listing');
      }
      return await res.json();
    }
  },

  async setListingStatus(id: string, status: 'published' | 'draft'): Promise<void> {
    try {
      await firestoreService.setListingStatusFirestore(id, status);
    } catch {
      await this.updateListing(id, { status });
    }
  },

  async deleteListing(id: string): Promise<void> {
    try {
      await firestoreService.deleteListingFirestore(id);
    } catch (err) {
      console.warn('Firestore delete failed, attempting server proxy', err);
      const res = await fetch(`${API_BASE}/listings/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete listing');
      }
    }
  },

  async bulkDeleteListings(ids: string[]): Promise<{ message: string; deletedCount: number }> {
    for (const id of ids) {
      await this.deleteListing(id);
    }
    return { message: 'Bulk delete successful', deletedCount: ids.length };
  },

  async bulkUpdateListings(
    ids: string[],
    updates: Partial<ToolListing>
  ): Promise<{ message: string; updatedCount: number }> {
    for (const id of ids) {
      await this.updateListing(id, updates);
    }
    return { message: 'Bulk update successful', updatedCount: ids.length };
  },

  async upvoteListing(id: string, delta: number = 1): Promise<{ id: string; upvotes: number }> {
    try {
      const upvotes = await firestoreService.upvoteListingFirestore(id, delta);
      return { id, upvotes };
    } catch {
      const res = await fetch(`${API_BASE}/listings/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error('Failed to register upvote');
      return await res.json();
    }
  },

  // Submissions
  async getSubmissions(): Promise<UserSubmission[]> {
    return [];
  },

  async submitTool(submission: Partial<UserSubmission>): Promise<UserSubmission> {
    try {
      return await firestoreService.submitToolFirestore(submission);
    } catch {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit tool');
      }
      return await res.json();
    }
  },

  async approveSubmission(id: string, submission?: UserSubmission): Promise<ToolListing> {
    if (submission) {
      return await firestoreService.approveSubmissionFirestore(id, submission);
    }
    const res = await fetch(`${API_BASE}/submissions/${id}/approve`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to approve submission');
    const data = await res.json();
    return data.listing || data;
  },

  async rejectSubmission(id: string): Promise<void> {
    try {
      await firestoreService.rejectSubmissionFirestore(id);
    } catch {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to reject submission');
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return getStaticCategoriesWithCounts();
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    return firestoreService.saveCategoryFirestore(category);
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return firestoreService.saveCategoryFirestore({ ...category, id });
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    return firestoreService.saveCategoryFirestore(cat);
  },

  async deleteCategory(id: string): Promise<void> {
    return firestoreService.deleteCategoryFirestore(id);
  },

  async reorderCategories(categories: Category[]): Promise<Category[]> {
    for (const cat of categories) {
      await firestoreService.saveCategoryFirestore(cat);
    }
    return categories;
  },

  // Advertisements
  async getAds(): Promise<Advertisement[]> {
    return INITIAL_ADS;
  },

  async createAd(ad: Partial<Advertisement>): Promise<Advertisement> {
    return firestoreService.saveAdFirestore(ad);
  },

  async updateAd(id: string, ad: Partial<Advertisement>): Promise<Advertisement> {
    return firestoreService.saveAdFirestore({ ...ad, id });
  },

  async saveAd(ad: Partial<Advertisement>): Promise<Advertisement> {
    return firestoreService.saveAdFirestore(ad);
  },

  async deleteAd(id: string): Promise<void> {
    return firestoreService.deleteAdFirestore(id);
  },

  async reorderAds(ads: Advertisement[]): Promise<Advertisement[]> {
    for (const ad of ads) {
      await firestoreService.saveAdFirestore(ad);
    }
    return ads;
  },

  async clickAd(id: string): Promise<{ id: string; clicks: number }> {
    await firestoreService.trackAdClickFirestore(id);
    return { id, clicks: 1 };
  },

  async trackAdClick(id: string): Promise<{ id: string; clicks: number }> {
    return this.clickAd(id);
  },

  // Custom Pages
  async getPages(): Promise<CustomPage[]> {
    return INITIAL_PAGES.filter((page) => page.published);
  },

  async getPage(slug: string): Promise<CustomPage> {
    const page = INITIAL_PAGES.find((item) => item.published && (item.slug === slug || item.id === slug));
    if (!page) throw new Error('Page not found');
    return page;
  },

  async createPage(page: Partial<CustomPage>): Promise<CustomPage> {
    return firestoreService.savePageFirestore(page);
  },

  async updatePage(id: string, page: Partial<CustomPage>): Promise<CustomPage> {
    return firestoreService.savePageFirestore({ ...page, id });
  },

  async savePage(page: Partial<CustomPage>): Promise<CustomPage> {
    return firestoreService.savePageFirestore(page);
  },

  async deletePage(id: string): Promise<void> {
    return firestoreService.deletePageFirestore(id);
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    return INITIAL_SITE_SETTINGS;
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return firestoreService.saveSiteSettingsFirestore(settings);
  },

  // Analytics & Tags
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) return {};
    return await res.json();
  },

  async getTags(): Promise<TagItem[]> {
    return getStaticTags();
  },

  async getExploreMetadata(url: string): Promise<ExploreMetadata> {
    const res = await fetch(`${API_BASE}/explore/metadata?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error('Failed to retrieve website metadata');
    return await res.json();
  },

  // AI Auto-enrichment
  async aiEnrich(queryOrUrl: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/enrich`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryOrUrl, toolName: queryOrUrl }),
    });
    if (!res.ok) throw new Error('AI auto-fill failed');
    return await res.json();
  },

  async enrichListingAi(queryOrUrl: string): Promise<any> {
    return this.aiEnrich(queryOrUrl);
  },

  async aiEnrichListing(idOrName: string): Promise<any> {
    return this.aiEnrich(idOrName);
  },

  // Backup / Restore
  async resetToDefault(): Promise<{ message: string; listings: ToolListing[] }> {
    await firestoreService.seedAllDataToFirestore();
    return { message: 'Database reset to verified default catalog', listings: [] };
  },

  async resetData(): Promise<{ message: string; listings: ToolListing[] }> {
    return this.resetToDefault();
  },

  async importData(data: any): Promise<{ success: boolean; count: number }> {
    if (data.listings && Array.isArray(data.listings)) {
      for (const item of data.listings) {
        await firestoreService.createListingFirestore(item);
      }
    }
    return { success: true, count: data.listings?.length || 0 };
  },
};

export default api;
