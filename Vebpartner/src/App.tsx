import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  Plus,
  Bookmark,
  Github,
  Lock,
} from 'lucide-react';
import {
  ToolListing,
  Category,
  UserSubmission,
  Advertisement,
  CustomPage,
  SiteSettings,
  TagItem,
  ViewMode,
  SortOption,
} from './types';
import { api } from './lib/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ToolDetailModal } from './components/ToolDetailModal';
import { SubmitModal } from './components/SubmitModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { ListingFormModal } from './components/Admin/ListingFormModal';
import { AdminPanel } from './components/Admin/AdminPanel';
import { PageView } from './components/PageView';
import { Footer } from './components/Footer';
import { FloatingAd } from './components/FloatingAd';
import { ToastContainer, ToastMessage } from './components/Toast';
import { useTheme } from './hooks/useTheme';

export function App() {
  // Theme Manager
  const { theme, preference: themePreference, setPreference: setThemePreference, toggleTheme } = useTheme();

  // Core Data states
  const [listings, setListings] = useState<ToolListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'Vebstar',
    siteUrl: 'https://vebstar.com',
    tagline: 'Discover the best open-source alternatives to proprietary software',
    heroTitle: 'Businesses You Can Actually Start',
    heroSubtitle: 'Over 1 million developers and teams replaced expensive proprietary tools with transparent open-source alternatives.',
    contactEmail: 'hello@vebstar.com',
    twitterUrl: 'https://x.com/vebstar',
    githubUrl: 'https://github.com/vebstar',
    announcementEnabled: false,
    announcementText: '',
    announcementUrl: '',
    primaryColor: '#10B981',
    accentColor: '#059669',
  });
  const [loading, setLoading] = useState(true);

  // Initialize state from URL Search Parameters (Deep Linking)
  const getInitialUrlParams = () => {
    if (typeof window === 'undefined') {
      return {
        q: '',
        category: 'all',
        proprietary: '',
        pricing: 'all',
        license: 'all',
        sort: 'stars' as SortOption,
        view: 'grid' as ViewMode,
        page: null as string | null,
        tool: null as string | null,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || params.get('search') || '';
    const category = params.get('category') || params.get('cat') || 'all';
    const proprietary = params.get('replaces') || params.get('proprietary') || '';
    const pricing = params.get('pricing') || 'all';
    const license = params.get('license') || 'all';
    const sortParam = params.get('sort');
    const sort: SortOption = (sortParam === 'newest' || sortParam === 'upvotes' || sortParam === 'name' || sortParam === 'stars')
      ? sortParam
      : 'stars';
    const viewParam = params.get('view');
    const view: ViewMode = (viewParam === 'compact' || viewParam === 'list') ? 'compact' : 'grid';
    const page = params.get('page') || null;
    const tool = params.get('tool') || params.get('id') || null;

    return { q, category, proprietary, pricing, license, sort, view, page, tool };
  };

  const initialParams = useMemo(() => getInitialUrlParams(), []);

  // Routing & Filter States
  const [activePageSlug, setActivePageSlug] = useState<string | null>(initialParams.page);
  const [searchQuery, setSearchQuery] = useState(initialParams.q);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [selectedProprietary, setSelectedProprietary] = useState(initialParams.proprietary);
  const [selectedPricing, setSelectedPricing] = useState(initialParams.pricing);
  const [selectedLicense, setSelectedLicense] = useState(initialParams.license);
  const [sortBy, setSortBy] = useState<SortOption>(initialParams.sort);
  const [viewMode, setViewMode] = useState<ViewMode>(initialParams.view);

  // Search input ref for ⌘K focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Bookmarks & Upvotes local state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vebstar_bookmarks') || localStorage.getItem('openalt_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vebstar_upvotes') || localStorage.getItem('openalt_upvotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin & Modal states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<ToolListing | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState<ToolListing | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener (⌘K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActivePageSlug(null);
        setIsAdminMode(false);
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setActivePageSlug(null);
        setIsAdminMode(false);
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (selectedListingDetail) setSelectedListingDetail(null);
        if (isSubmitModalOpen) setIsSubmitModalOpen(false);
        if (isBookmarksOpen) setIsBookmarksOpen(false);
        if (isListingFormOpen) setIsListingFormOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedListingDetail, isSubmitModalOpen, isBookmarksOpen, isListingFormOpen]);

  // Initial Data Fetch
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        listingsData,
        categoriesData,
        submissionsData,
        adsData,
        pagesData,
        settingsData,
        tagsData,
      ] = await Promise.all([
        api.getListings(),
        api.getCategories(),
        api.getSubmissions(),
        api.getAds(),
        api.getPages(),
        api.getSettings(),
        api.getTags(),
      ]);
      setListings(listingsData);
      setCategories(categoriesData);
      setSubmissions(submissionsData);
      setAds(adsData);
      setPages(pagesData);
      if (settingsData && settingsData.siteName) {
        setSiteSettings(settingsData);
      }
      setTags(tagsData);

      // If initial URL had tool deep link, open it
      if (initialParams.tool && listingsData.length > 0) {
        const found = listingsData.find(
          (l) => l.id.toLowerCase() === initialParams.tool?.toLowerCase() || l.name.toLowerCase() === initialParams.tool?.toLowerCase()
        );
        if (found) {
          setSelectedListingDetail(found);
        }
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      addToast('Error loading directory', 'Could not retrieve data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync state to URL Search Parameters (Deep-linking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (selectedProprietary) {
      params.set('replaces', selectedProprietary);
    }
    if (selectedPricing && selectedPricing !== 'all') {
      params.set('pricing', selectedPricing);
    }
    if (selectedLicense && selectedLicense !== 'all') {
      params.set('license', selectedLicense);
    }
    if (sortBy && sortBy !== 'stars') {
      params.set('sort', sortBy);
    }
    if (viewMode === 'compact') {
      params.set('view', 'compact');
    }
    if (activePageSlug) {
      params.set('page', activePageSlug);
    }
    if (selectedListingDetail) {
      params.set('tool', selectedListingDetail.id);
    }

    const newQueryString = params.toString();
    const newRelativePath = newQueryString ? `${window.location.pathname}?${newQueryString}` : window.location.pathname;

    if (window.location.search !== (newQueryString ? `?${newQueryString}` : '')) {
      window.history.replaceState(null, '', newRelativePath);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedProprietary,
    selectedPricing,
    selectedLicense,
    sortBy,
    viewMode,
    activePageSlug,
    selectedListingDetail,
  ]);

  // Handle Browser Navigation (Popstate Back/Forward button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || params.get('search') || '');
      setSelectedCategory(params.get('category') || params.get('cat') || 'all');
      setSelectedProprietary(params.get('replaces') || params.get('proprietary') || '');
      setSelectedPricing(params.get('pricing') || 'all');
      setSelectedLicense(params.get('license') || 'all');
      const sortParam = params.get('sort');
      if (sortParam === 'newest' || sortParam === 'upvotes' || sortParam === 'name' || sortParam === 'stars') {
        setSortBy(sortParam);
      } else {
        setSortBy('stars');
      }
      const viewParam = params.get('view');
      setViewMode((viewParam === 'compact' || viewParam === 'list') ? 'compact' : 'grid');
      setActivePageSlug(params.get('page') || null);

      const toolParam = params.get('tool') || params.get('id');
      if (toolParam && listings.length > 0) {
        const found = listings.find((l) => l.id === toolParam || l.name.toLowerCase() === toolParam.toLowerCase());
        if (found) setSelectedListingDetail(found);
      } else if (!toolParam) {
        setSelectedListingDetail(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [listings]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('vebstar_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Save upvotes to localStorage
  useEffect(() => {
    localStorage.setItem('vebstar_upvotes', JSON.stringify(upvotedIds));
  }, [upvotedIds]);

  // Upvote tool handler
  const handleUpvote = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.upvoteListing(id);
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, upvotes: res.upvotes } : l))
      );
      if (selectedListingDetail?.id === id) {
        setSelectedListingDetail({ ...selectedListingDetail, upvotes: res.upvotes });
      }
      if (!upvotedIds.includes(id)) {
        setUpvotedIds([...upvotedIds, id]);
        addToast('Upvoted!', 'Thank you for supporting this open source tool', 'success');
      }
    } catch (err) {
      addToast('Error', 'Failed to submit upvote', 'error');
    }
  };

  // Toggle Bookmark handler
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
      addToast('Bookmark Removed', 'Removed from saved tools', 'info');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      addToast('Bookmark Added', 'Saved for quick access', 'success');
    }
  };

  // Public Submit handler
  const handleSubmitTool = async (submission: Partial<UserSubmission>) => {
    const created = await api.submitTool(submission);
    setSubmissions([created, ...submissions]);
    addToast('Tool Submitted!', 'Your open source tool has been queued for review', 'success');
  };

  // Admin Listing Handlers
  const handleAddListing = async (listingPayload: Partial<ToolListing>) => {
    const created = await api.createListing(listingPayload);
    setListings([created, ...listings]);
    addToast('Listing Published', `"${created.name}" is now live in the directory.`, 'success');
  };

  const handleEditListing = async (id: string, updates: Partial<ToolListing>) => {
    const updated = await api.updateListing(id, updates);
    setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    addToast('Listing Updated', `"${updated.name}" has been updated.`, 'success');
  };

  const handleDeleteListing = async (id: string) => {
    await api.deleteListing(id);
    setListings((prev) => prev.filter((l) => !id.includes(l.id)));
    addToast('Listing Deleted', 'Listing removed from the directory.', 'info');
  };

  const handleBulkDeleteListings = async (ids: string[]) => {
    await api.bulkDeleteListings(ids);
    setListings((prev) => prev.filter((l) => !ids.includes(l.id)));
    addToast('Bulk Delete Completed', `Removed ${ids.length} software listings.`, 'info');
  };

  const handleBulkUpdateListings = async (ids: string[], updates: Partial<ToolListing>) => {
    await api.bulkUpdateListings(ids, updates);
    setListings((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, ...updates } : l))
    );
    addToast('Bulk Update Completed', `Updated ${ids.length} software listings.`, 'success');
  };

  const handleReorderCategories = async (reordered: Category[]) => {
    setCategories(reordered);
    await api.reorderCategories(reordered);
    addToast('Categories Reordered', 'New category display order saved.', 'success');
  };

  const handleReorderAds = async (reordered: Advertisement[]) => {
    setAds(reordered);
    await api.reorderAds(reordered);
    addToast('Advertisements Reordered', 'New ad priority order saved.', 'success');
  };

  // Admin Submission Handlers
  const handleApproveSubmission = async (id: string) => {
    const newListing = await api.approveSubmission(id);
    setListings([newListing, ...listings]);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)));
    addToast('Submission Approved', `"${newListing.name}" is now published.`, 'success');
  };

  const handleRejectSubmission = async (id: string) => {
    await api.rejectSubmission(id);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s)));
    addToast('Submission Rejected', 'Submission has been discarded.', 'info');
  };

  // Admin Ad Handlers
  const handleSaveAd = async (adPayload: Partial<Advertisement>) => {
    const saved = await api.saveAd(adPayload);
    setAds((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    addToast('Advertisement Saved', `Campaign for "${saved.sponsorName}" updated.`, 'success');
  };

  const handleDeleteAd = async (id: string) => {
    await api.deleteAd(id);
    setAds((prev) => prev.filter((a) => a.id !== id));
    addToast('Ad Campaign Deleted', 'Advertisement removed.', 'info');
  };

  // Admin Page Handlers
  const handleSavePage = async (pagePayload: Partial<CustomPage>) => {
    const saved = await api.savePage(pagePayload);
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    addToast('Page Published', `Page "${saved.title}" updated successfully.`, 'success');
  };

  const handleDeletePage = async (id: string) => {
    await api.deletePage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    addToast('Page Deleted', 'Page removed from website.', 'info');
  };

  // Admin Category Handlers
  const handleSaveCategory = async (catPayload: Partial<Category>) => {
    const saved = await api.saveCategory(catPayload);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    addToast('Category Saved', `Category "${saved.name}" updated.`, 'success');
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Category Deleted', 'Category removed.', 'info');
  };

  // Admin Site Settings Handler
  const handleUpdateSiteSettings = async (settingsPayload: Partial<SiteSettings>) => {
    const updated = await api.updateSettings(settingsPayload);
    setSiteSettings(updated);
    addToast('Site Settings Saved', 'Platform brand and configuration updated.', 'success');
  };

  // Admin Reset & Import
  const handleResetData = async () => {
    await api.resetData();
    await fetchData();
    addToast('Database Reset', 'Default verified open-source database restored.', 'info');
  };

  const handleImportData = async (data: any) => {
    await api.importData(data);
    await fetchData();
    addToast('Data Imported', 'New open-source catalog loaded.', 'success');
  };

  // AI Enrich
  const handleAiEnrich = async (listingId: string) => {
    const enriched = await api.aiEnrichListing(listingId);
    setListings((prev) => prev.map((l) => (l.id === enriched.id ? enriched : l)));
    if (selectedListingDetail?.id === enriched.id) {
      setSelectedListingDetail(enriched);
    }
    addToast('AI Enrich Completed', `Refreshed metrics & tech stack for "${enriched.name}".`, 'success');
  };

  // Ad click tracking
  const handleAdClick = async (adId: string) => {
    try {
      await api.trackAdClick(adId);
    } catch {
      // ignore
    }
  };

  // Filtered and Sorted Listings computation
  const filteredListings = useMemo(() => {
    const seenIds = new Set<string>();
    return listings
      .filter((listing) => {
        if (!listing.id || seenIds.has(listing.id)) return false;
        seenIds.add(listing.id);

        // 1. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = listing.name.toLowerCase().includes(q);
          const matchTagline = listing.tagline?.toLowerCase().includes(q) || false;
          const matchDesc = listing.description?.toLowerCase().includes(q) || false;
          const matchAlt = listing.replaces?.some((r) => r.toLowerCase().includes(q)) || false;
          const matchTech = listing.techStack?.some((t) => t.toLowerCase().includes(q)) || false;
          const matchTags = listing.tags?.some((t) => t.toLowerCase().includes(q)) || false;
          const matchLicense = listing.license?.toLowerCase().includes(q) || false;

          if (!matchName && !matchTagline && !matchDesc && !matchAlt && !matchTech && !matchTags && !matchLicense) {
            return false;
          }
        }

        // 2. Category Filter
        if (selectedCategory && selectedCategory !== 'all') {
          if (listing.category !== selectedCategory) {
            return false;
          }
        }

        // 3. Proprietary Alternative Filter
        if (selectedProprietary) {
          const matchAlt = listing.replaces?.some(
            (r) => r.toLowerCase() === selectedProprietary.toLowerCase()
          );
          if (!matchAlt) return false;
        }

        // 4. Pricing Filter
        if (selectedPricing && selectedPricing !== 'all') {
          if (listing.pricingModel !== selectedPricing) {
            return false;
          }
        }

        // 5. License Filter
        if (selectedLicense && selectedLicense !== 'all') {
          if (listing.license !== selectedLicense) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return (b.stars || 0) - (a.stars || 0);
        }
        if (sortBy === 'upvotes') {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'newest') {
          return (b.stars || 0) - (a.stars || 0);
        }
        return 0;
      });
  }, [
    listings,
    searchQuery,
    selectedCategory,
    selectedProprietary,
    selectedPricing,
    selectedLicense,
    sortBy,
  ]);

  // Dynamic category tool counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length };
    listings.forEach((l) => {
      if (l.category) {
        counts[l.category] = (counts[l.category] || 0) + 1;
      }
    });
    return counts;
  }, [listings]);

  // Bookmarked listings full objects
  const bookmarkedListings = useMemo(() => {
    return listings.filter((l) => bookmarkedIds.includes(l.id));
  }, [listings, bookmarkedIds]);

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;

  // Active top and floating ads
  const topAd = useMemo(() => {
    return ads.find((a) => a.active && (a.placement === 'banner_top' || a.placement === 'header_top')) || null;
  }, [ads]);

  const floatingAd = useMemo(() => {
    return ads.find((a) => a.active && a.placement === 'floating_bottom_right') || null;
  }, [ads]);

  // Find active custom page if user is viewing a page
  const activeCustomPage = useMemo(() => {
    if (!activePageSlug) return null;
    return (
      pages.find(
        (p) => p.slug.toLowerCase() === activePageSlug.toLowerCase() || p.id === activePageSlug
      ) || null
    );
  }, [activePageSlug, pages]);

  // Keyboard Navigation across Directory Listing Grid (Arrow keys, Home, End, Enter)
  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number, listing: ToolListing) => {
      const totalCards = filteredListings.length;
      if (totalCards === 0) return;

      // Determine grid column count
      let numCols = 3;
      if (viewMode === 'compact') {
        numCols = 1;
      } else if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) numCols = 1;
        else if (window.innerWidth < 1024) numCols = 2;
        else numCols = 3;
      }

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = (index + 1) % totalCards;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = (index - 1 + totalCards) % totalCards;
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = Math.min(totalCards - 1, index + numCols);
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = Math.max(0, index - numCols);
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = totalCards - 1;
          break;
        default:
          break;
      }

      if (nextIndex !== null && nextIndex !== index) {
        const nextListing = filteredListings[nextIndex];
        if (nextListing) {
          const el = document.getElementById(`listing-card-${nextListing.id}`);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    },
    [filteredListings, viewMode]
  );

  // Full Admin Panel View
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#08090E] dark:bg-[#08090E] light:bg-[#f8fafc] font-sans text-zinc-100 dark:text-zinc-100 light:text-zinc-900 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <AdminPanel
          listings={listings}
          submissions={submissions}
          categories={categories}
          ads={ads}
          pages={pages}
          siteSettings={siteSettings}
          tags={tags}
          onBackToApp={() => setIsAdminMode(false)}
          onAddListing={handleAddListing}
          onEditListing={handleEditListing}
          onDeleteListing={handleDeleteListing}
          onApproveSubmission={handleApproveSubmission}
          onRejectSubmission={handleRejectSubmission}
          onSaveAd={handleSaveAd}
          onDeleteAd={handleDeleteAd}
          onSavePage={handleSavePage}
          onDeletePage={handleDeletePage}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateSiteSettings={handleUpdateSiteSettings}
          onResetData={handleResetData}
          onImportData={handleImportData}
          onAiEnrich={handleAiEnrich}
          onBulkDeleteListings={handleBulkDeleteListings}
          onBulkUpdateListings={handleBulkUpdateListings}
          onReorderCategories={handleReorderCategories}
          onReorderAds={handleReorderAds}
        />

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090E] dark:bg-[#08090E] light:bg-[#f8fafc] font-sans text-zinc-100 dark:text-zinc-100 light:text-zinc-900 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarksCount={bookmarkedIds.length}
        isAdminView={isAdminMode}
        onToggleAdminView={() => setIsAdminMode(!isAdminMode)}
        pendingSubmissionsCount={pendingSubmissionsCount}
        totalListingsCount={listings.length}
        onFocusSearch={() => {
          setActivePageSlug(null);
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 50);
        }}
        onSelectCategory={(catId) => {
          setActivePageSlug(null);
          setSelectedCategory(catId);
        }}
        onNavigateHome={() => {
          setActivePageSlug(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigatePage={(slug) => {
          setActivePageSlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pages={pages}
        categories={categories}
        categoryCounts={categoryCounts}
        siteSettings={siteSettings}
        topAd={topAd}
        onAdClick={handleAdClick}
        theme={theme}
        themePreference={themePreference}
        onSelectThemePreference={setThemePreference}
        onToggleTheme={toggleTheme}
      />

      {/* Conditional View: Custom Content Page vs. Directory Home */}
      {activePageSlug && activeCustomPage ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageView
            page={activeCustomPage}
            siteSettings={siteSettings}
            onBack={() => setActivePageSlug(null)}
            onNavigatePage={(slug) => {
              setActivePageSlug(slug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            allPages={pages}
            ads={ads}
            onAdClick={handleAdClick}
          />
        </main>
      ) : (
        /* Main Directory Home Page */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
          {/* Hero Section */}
          <Hero
            siteSettings={siteSettings}
            ads={ads}
            onSubscribeSuccess={(email) => {
              addToast('Subscribed!', `Welcome ${email} to the weekly ${siteSettings.siteName} digest.`, 'success');
            }}
            onNavigatePage={(slug) => {
              setActivePageSlug(slug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAdClick={handleAdClick}
          />

          {/* Category & Filter Navigation Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
            }}
            selectedProprietary={selectedProprietary}
            onClearProprietary={() => setSelectedProprietary('')}
            selectedPricing={selectedPricing}
            onSelectPricing={setSelectedPricing}
            selectedLicense={selectedLicense}
            onSelectLicense={setSelectedLicense}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            totalMatches={filteredListings.length}
            categoryCounts={categoryCounts}
            searchInputRef={searchInputRef}
          />

          {/* Listings Display Grid / List */}
          <div id="directory-grid" role="region" aria-label="Directory listings grid">
            {loading ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-mono tracking-wide">Loading open source catalog...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white rounded-3xl border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 p-8 max-w-2xl mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-zinc-900 tracking-tight">No tools found</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-md mx-auto mt-1 leading-relaxed">
                    No tools matched your current search filters. Try clearing your filters or submit a new open-source tool to the catalog!
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedProprietary('');
                      setSelectedPricing('all');
                      setSelectedLicense('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-zinc-200 text-white dark:text-white light:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer border border-transparent light:border-zinc-300"
                  >
                    Reset all filters
                  </button>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Submit a tool
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === 'compact'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
                tabIndex={-1}
              >
                {filteredListings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    viewMode={viewMode}
                    cardIndex={index}
                    onCardKeyDown={handleCardKeyDown}
                    onSelect={(selected) => setSelectedListingDetail(selected)}
                    isBookmarked={bookmarkedIds.includes(listing.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onUpvote={handleUpvote}
                    hasUpvoted={upvotedIds.includes(listing.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectProprietary={(prop) => {
          setActivePageSlug(null);
          setSelectedProprietary(prop);
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onSelectCategory={(catId) => {
          setActivePageSlug(null);
          setSelectedCategory(catId);
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onNavigateHome={() => {
          setActivePageSlug(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigatePage={(slug) => {
          setActivePageSlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pages={pages}
        siteSettings={siteSettings}
      />

      {/* Floating Bottom Right Ad Widget */}
      {floatingAd && (
        <FloatingAd
          ad={floatingAd}
          onAdClick={() => handleAdClick(floatingAd.id)}
        />
      )}

      {/* Tool Detail Modal View */}
      {selectedListingDetail && (
        <ToolDetailModal
          listing={selectedListingDetail}
          onClose={() => setSelectedListingDetail(null)}
          onUpvote={handleUpvote}
          hasUpvoted={upvotedIds.includes(selectedListingDetail.id)}
          isBookmarked={bookmarkedIds.includes(selectedListingDetail.id)}
          onToggleBookmark={handleToggleBookmark}
          allListings={listings}
          onSelectRelated={(tool) => setSelectedListingDetail(tool)}
        />
      )}

      {/* Submit Tool Modal */}
      {isSubmitModalOpen && (
        <SubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitTool}
          categories={categories}
        />
      )}

      {/* Saved Bookmarks Drawer */}
      {isBookmarksOpen && (
        <BookmarksDrawer
          isOpen={isBookmarksOpen}
          onClose={() => setIsBookmarksOpen(false)}
          bookmarkedListings={bookmarkedListings}
          onSelectListing={(l) => {
            setIsBookmarksOpen(false);
            setSelectedListingDetail(l);
          }}
          onRemoveBookmark={(id) => handleToggleBookmark(id)}
          onClearAllBookmarks={() => {
            setBookmarkedIds([]);
            addToast('Bookmarks Cleared', 'All saved tools removed.', 'info');
          }}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
