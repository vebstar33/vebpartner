import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  ArrowLeft,
  Megaphone,
  FileText,
  Tag,
  Settings,
  BarChart3,
  Globe,
  Inbox,
  ShieldCheck,
  Star,
  ThumbsUp,
  MousePointer,
  Radio,
  Check,
  GripVertical,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  MinusSquare,
  LogOut,
} from 'lucide-react';
import {
  ToolListing,
  UserSubmission,
  Category,
  Advertisement,
  CustomPage,
  SiteSettings,
  TagItem,
} from '../../types';
import { VebpartnerLogo } from '../Icons';
import { AdFormModal } from './AdFormModal';
import { PageFormModal } from './PageFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { AnalyticsSection } from './AnalyticsSection';

interface AdminPanelProps {
  listings: ToolListing[];
  submissions: UserSubmission[];
  categories: Category[];
  ads: Advertisement[];
  pages: CustomPage[];
  siteSettings: SiteSettings;
  tags: TagItem[];
  onBackToApp: () => void;
  onAddListing: (listing: Partial<ToolListing>) => Promise<void>;
  onEditListing: (id: string, updates: Partial<ToolListing>) => Promise<void>;
  onDeleteListing: (id: string) => Promise<void>;
  onApproveSubmission: (id: string) => Promise<void>;
  onRejectSubmission: (id: string) => Promise<void>;
  onSaveAd: (ad: Partial<Advertisement>) => Promise<void>;
  onDeleteAd: (id: string) => Promise<void>;
  onSavePage: (page: Partial<CustomPage>) => Promise<void>;
  onDeletePage: (id: string) => Promise<void>;
  onSaveCategory: (cat: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  onResetData: () => Promise<void>;
  onImportData: (data: any) => Promise<void>;
  onAiEnrich: (query: string) => Promise<any>;
  onBulkDeleteListings?: (ids: string[]) => Promise<void>;
  onBulkUpdateListings?: (ids: string[], updates: Partial<ToolListing>) => Promise<void>;
  onReorderCategories?: (categories: Category[]) => Promise<void>;
  onReorderAds?: (ads: Advertisement[]) => Promise<void>;
  currentUserEmail?: string;
  onSignOut?: () => void;
}

type AdminTab =
  | 'overview'
  | 'analytics'
  | 'listings'
  | 'ads'
  | 'categories'
  | 'tags'
  | 'pages'
  | 'submissions'
  | 'settings'
  | 'backup';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  listings,
  submissions,
  categories,
  ads,
  pages,
  siteSettings,
  tags,
  onBackToApp,
  onAddListing,
  onEditListing,
  onDeleteListing,
  onApproveSubmission,
  onRejectSubmission,
  onSaveAd,
  onDeleteAd,
  onSavePage,
  onDeletePage,
  onSaveCategory,
  onDeleteCategory,
  onUpdateSiteSettings,
  onResetData,
  onImportData,
  onAiEnrich,
  onBulkDeleteListings,
  onBulkUpdateListings,
  onReorderCategories,
  onReorderAds,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Bulk listings selection state
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState<string>('');
  const [bulkPricing, setBulkPricing] = useState<string>('');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Drag and drop state for Categories & Ads
  const [draggedCategoryIdx, setDraggedCategoryIdx] = useState<number | null>(null);
  const [dragOverCategoryIdx, setDragOverCategoryIdx] = useState<number | null>(null);
  const [draggedAdIdx, setDraggedAdIdx] = useState<number | null>(null);
  const [dragOverAdIdx, setDragOverAdIdx] = useState<number | null>(null);

  // Listing editor modal state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ToolListing | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');

  // Ad modal state
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  // Page modal state
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Local site settings state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Listing Form State
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReplaces, setFormReplaces] = useState('');
  const [formCategory, setFormCategory] = useState('agencies-services');
  const [formTags, setFormTags] = useState('');
  const [formTechStack, setFormTechStack] = useState('');
  const [formLicense, setFormLicense] = useState('MIT');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formWebsiteUrl, setFormWebsiteUrl] = useState('');
  const [formStars, setFormStars] = useState<number>(1000);
  const [formPricingModel, setFormPricingModel] = useState('100% Free Open Source');
  const [formDockerCommand, setFormDockerCommand] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVerified, setFormVerified] = useState(true);
  const [formIsAiNative, setFormIsAiNative] = useState(false);
  const [formIsSponsored, setFormIsSponsored] = useState(false);
  const [formAdCtaText, setFormAdCtaText] = useState('');
  const [formAdCtaUrl, setFormAdCtaUrl] = useState('');

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleOpenNewListingModal = () => {
    setEditingListing(null);
    setFormName('');
    setFormTagline('');
    setFormDescription('');
    setFormReplaces('');
    setFormCategory('agencies-services');
    setFormTags('');
    setFormTechStack('');
    setFormLicense('MIT');
    setFormGithubUrl('');
    setFormWebsiteUrl('');
    setFormStars(1000);
    setFormPricingModel('100% Free Open Source');
    setFormDockerCommand('');
    setFormFeatured(false);
    setFormVerified(true);
    setFormIsAiNative(false);
    setFormIsSponsored(false);
    setFormAdCtaText('');
    setFormAdCtaUrl('');
    setAiInput('');
    setIsListingModalOpen(true);
  };

  const handleOpenEditListingModal = (listing: ToolListing) => {
    setEditingListing(listing);
    setFormName(listing.name);
    setFormTagline(listing.tagline);
    setFormDescription(listing.description || '');
    setFormReplaces(Array.isArray(listing.replaces) ? listing.replaces.join(', ') : '');
    setFormCategory(listing.category || 'agencies-services');
    setFormTags(Array.isArray(listing.tags) ? listing.tags.join(', ') : '');
    setFormTechStack(Array.isArray(listing.techStack) ? listing.techStack.join(', ') : '');
    setFormLicense(listing.license || 'MIT');
    setFormGithubUrl(listing.githubUrl || '');
    setFormWebsiteUrl(listing.websiteUrl || '');
    setFormStars(listing.stars || 0);
    setFormPricingModel(listing.pricingModel || '100% Free Open Source');
    setFormDockerCommand(listing.dockerCommand || '');
    setFormFeatured(Boolean(listing.featured));
    setFormVerified(listing.verified !== undefined ? Boolean(listing.verified) : true);
    setFormIsAiNative(Boolean(listing.isAiNative));
    setFormIsSponsored(Boolean(listing.isSponsored));
    setFormAdCtaText(listing.adCtaText || '');
    setFormAdCtaUrl(listing.adCtaUrl || '');
    setIsListingModalOpen(true);
  };

  const handleAiAutoFill = async () => {
    if (!aiInput && !formName && !formGithubUrl) {
      alert('Please enter a tool name or GitHub URL to auto-enrich');
      return;
    }
    try {
      setIsAiLoading(true);
      const enriched = await onAiEnrich(aiInput || formName || formGithubUrl);
      if (enriched) {
        if (enriched.name) setFormName(enriched.name);
        if (enriched.tagline) setFormTagline(enriched.tagline);
        if (enriched.description) setFormDescription(enriched.description);
        if (enriched.replaces) {
          setFormReplaces(Array.isArray(enriched.replaces) ? enriched.replaces.join(', ') : enriched.replaces);
        }
        if (enriched.category) setFormCategory(enriched.category);
        if (enriched.tags) {
          setFormTags(Array.isArray(enriched.tags) ? enriched.tags.join(', ') : enriched.tags);
        }
        if (enriched.techStack) {
          setFormTechStack(Array.isArray(enriched.techStack) ? enriched.techStack.join(', ') : enriched.techStack);
        }
        if (enriched.license) setFormLicense(enriched.license);
        if (enriched.estimatedStars) setFormStars(enriched.estimatedStars);
        if (enriched.pricingModel) setFormPricingModel(enriched.pricingModel);
        if (enriched.dockerCommand) setFormDockerCommand(enriched.dockerCommand);
        showNotification('Tool details generated by Gemini AI!');
      }
    } catch (err: any) {
      alert('AI enrichment error: ' + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTagline) return;

    const payload: Partial<ToolListing> = {
      name: formName,
      tagline: formTagline,
      description: formDescription,
      replaces: formReplaces.split(',').map((s) => s.trim()).filter(Boolean),
      category: formCategory,
      tags: formTags.split(',').map((s) => s.trim()).filter(Boolean),
      techStack: formTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      license: formLicense,
      githubUrl: formGithubUrl,
      websiteUrl: formWebsiteUrl,
      stars: Number(formStars) || 0,
      pricingModel: formPricingModel,
      dockerCommand: formDockerCommand,
      featured: formFeatured,
      verified: formVerified,
      isAiNative: formIsAiNative,
      isSponsored: formIsSponsored,
      adCtaText: formAdCtaText,
      adCtaUrl: formAdCtaUrl,
    };

    if (editingListing) {
      await onEditListing(editingListing.id, payload);
      showNotification(`Updated ${formName} successfully`);
    } else {
      await onAddListing(payload);
      showNotification(`Created ${formName} successfully`);
    }
    setIsListingModalOpen(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      await onUpdateSiteSettings(settingsForm);
      showNotification('Vebpartner Site Settings updated successfully');
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(l.replaces) && l.replaces.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const allFilteredSelected =
    filteredListings.length > 0 &&
    filteredListings.every((l) => selectedListingIds.includes(l.id));
  const someFilteredSelected =
    filteredListings.some((l) => selectedListingIds.includes(l.id)) && !allFilteredSelected;

  // Toggle select all visible
  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredListings.map((l) => l.id));
      setSelectedListingIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const visibleIds = filteredListings.map((l) => l.id);
      setSelectedListingIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedListingIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedListingIds.length} selected software listings? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      setIsBulkProcessing(true);
      if (onBulkDeleteListings) {
        await onBulkDeleteListings(selectedListingIds);
      } else {
        for (const id of selectedListingIds) {
          await onDeleteListing(id);
        }
      }
      showNotification(`Deleted ${selectedListingIds.length} listings`);
      setSelectedListingIds([]);
    } catch (err: any) {
      alert('Bulk delete failed: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Bulk Set Status / Attributes
  const handleBulkSetFeatured = async (featured: boolean) => {
    if (selectedListingIds.length === 0) return;
    try {
      setIsBulkProcessing(true);
      if (onBulkUpdateListings) {
        await onBulkUpdateListings(selectedListingIds, { featured });
      } else {
        for (const id of selectedListingIds) {
          await onEditListing(id, { featured });
        }
      }
      showNotification(
        `Updated ${selectedListingIds.length} items to ${featured ? 'Featured' : 'Standard'}`
      );
      setSelectedListingIds([]);
    } catch (err: any) {
      alert('Bulk update failed: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkSetVerified = async (verified: boolean) => {
    if (selectedListingIds.length === 0) return;
    try {
      setIsBulkProcessing(true);
      if (onBulkUpdateListings) {
        await onBulkUpdateListings(selectedListingIds, { verified });
      } else {
        for (const id of selectedListingIds) {
          await onEditListing(id, { verified });
        }
      }
      showNotification(
        `Updated ${selectedListingIds.length} items to ${verified ? 'Verified' : 'Unverified'}`
      );
      setSelectedListingIds([]);
    } catch (err: any) {
      alert('Bulk update failed: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkChangeCategory = async (catId: string) => {
    if (selectedListingIds.length === 0 || !catId) return;
    try {
      setIsBulkProcessing(true);
      if (onBulkUpdateListings) {
        await onBulkUpdateListings(selectedListingIds, { category: catId });
      } else {
        for (const id of selectedListingIds) {
          await onEditListing(id, { category: catId });
        }
      }
      showNotification(`Moved ${selectedListingIds.length} items to category "${catId}"`);
      setSelectedListingIds([]);
      setBulkCategory('');
    } catch (err: any) {
      alert('Bulk category change failed: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkChangePricing = async (pricing: string) => {
    if (selectedListingIds.length === 0 || !pricing) return;
    try {
      setIsBulkProcessing(true);
      if (onBulkUpdateListings) {
        await onBulkUpdateListings(selectedListingIds, { pricingModel: pricing });
      } else {
        for (const id of selectedListingIds) {
          await onEditListing(id, { pricingModel: pricing });
        }
      }
      showNotification(`Updated pricing model for ${selectedListingIds.length} items`);
      setSelectedListingIds([]);
      setBulkPricing('');
    } catch (err: any) {
      alert('Bulk pricing update failed: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Export Full Database as Downloadable JSON
  const handleExportDatabase = () => {
    const databaseSnapshot = {
      exportMeta: {
        application: siteSettings.siteName || 'Vebpartner',
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        totalCounts: {
          listings: listings.length,
          categories: categories.length,
          advertisements: ads.length,
          customPages: pages.length,
          submissions: submissions.length,
          tags: tags.length,
        },
      },
      siteSettings,
      categories,
      listings,
      advertisements: ads,
      pages,
      submissions,
      tags,
    };

    const jsonString = JSON.stringify(databaseSnapshot, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(siteSettings.siteName || 'vebpartner').toLowerCase()}-database-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Complete database exported as JSON!');
  };

  // Drag and Drop: Categories Reordering
  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCategoryIdx !== index) {
      setDragOverCategoryIdx(index);
    }
  };

  const handleCategoryDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCategoryIdx === null || draggedCategoryIdx === dropIndex) {
      setDraggedCategoryIdx(null);
      setDragOverCategoryIdx(null);
      return;
    }

    const reordered = [...categories];
    const [moved] = reordered.splice(draggedCategoryIdx, 1);
    reordered.splice(dropIndex, 0, moved);

    setDraggedCategoryIdx(null);
    setDragOverCategoryIdx(null);

    if (onReorderCategories) {
      await onReorderCategories(reordered);
    }
    showNotification('Category layout reordered!');
  };

  const handleMoveCategory = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    if (onReorderCategories) {
      await onReorderCategories(reordered);
    }
    showNotification('Category order updated');
  };

  // Drag and Drop: Advertisements Reordering
  const handleAdDragStart = (e: React.DragEvent, index: number) => {
    setDraggedAdIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleAdDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverAdIdx !== index) {
      setDragOverAdIdx(index);
    }
  };

  const handleAdDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedAdIdx === null || draggedAdIdx === dropIndex) {
      setDraggedAdIdx(null);
      setDragOverAdIdx(null);
      return;
    }

    const reordered = [...ads];
    const [moved] = reordered.splice(draggedAdIdx, 1);
    reordered.splice(dropIndex, 0, moved);

    setDraggedAdIdx(null);
    setDragOverAdIdx(null);

    if (onReorderAds) {
      await onReorderAds(reordered);
    }
    showNotification('Advertisement priority order saved!');
  };

  const handleMoveAd = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ads.length) return;

    const reordered = [...ads];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    if (onReorderAds) {
      await onReorderAds(reordered);
    }
    showNotification('Advertisement order updated');
  };

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const totalStarsCount = listings.reduce((acc, l) => acc + (l.stars || 0), 0);
  const totalUpvotesCount = listings.reduce((acc, l) => acc + (l.upvotes || 0), 0);

  return (
    <div className="min-h-screen bg-[#08090E] text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0d14] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <VebpartnerLogo className="w-7 h-7" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">Vebpartner</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mission Control Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportDatabase}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/[0.08] text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
              title="Download complete database as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Database</span>
            </button>

            <button
              onClick={onBackToApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Site Preview</span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">yogigunes@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Secondary Tab Bar - Grouped Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/[0.04] py-2">
          {/* Overview */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Analytics</span>
          </button>

          {/* Group 1: Content & Catalog */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 hidden xl:inline">
              Catalog:
            </span>
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Listings ({listings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                activeTab === 'submissions'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Review Queue</span>
              {pendingSubmissionsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pages ({pages.length})</span>
            </button>
          </div>

          {/* Group 2: Taxonomy & Ads */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 hidden xl:inline">
              Taxonomy:
            </span>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'tags'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Tags ({tags.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Sponsors & Ads ({ads.length})</span>
            </button>
          </div>

          {/* Group 3: System & Config */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 hidden xl:inline">
              System:
            </span>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* ================= TAB: OVERVIEW / DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Listings</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{listings.length}</div>
                <div className="text-[10px] text-emerald-400 font-medium">Business Directory</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">GitHub Stars</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  {(totalStarsCount / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Aggregated Community</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Upvotes</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{totalUpvotesCount}</div>
                <div className="text-[10px] text-zinc-400 font-medium">Community Votes</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Ads</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                  {ads.filter((a) => a.active).length} / {ads.length}
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Sponsor Spots</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Custom Pages</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{pages.length}</div>
                <div className="text-[10px] text-zinc-400 font-medium">Site Pages</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Submissions</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
                  {pendingSubmissionsCount}
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Pending Moderation</div>
              </div>
            </div>

            {/* Quick Actions & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">
                    Quick Management Actions
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleOpenNewListingModal}
                    className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Add New Software Card
                      </span>
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Create a tool manually or use Gemini AI to auto-fill metadata.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingAd(null);
                      setIsAdModalOpen(true);
                    }}
                    className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Create Advertisement
                      </span>
                      <Megaphone className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Configure top header banners, floating ads, or detail sponsorships.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPage(null);
                      setIsPageModalOpen(true);
                    }}
                    className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Publish Content Page
                      </span>
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Add a new manifesto, comparison guide, or documentation page.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Site Settings & Announcement
                      </span>
                      <Settings className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Update banner alert, brand slogan, and social profiles.
                    </p>
                  </button>
                </div>
              </div>

              {/* System State Card */}
              <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Engine & Storage Status</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Database Engine:</span>
                    <span className="font-mono text-emerald-400 font-semibold">File-Backed JSON (.data)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-zinc-400">AI Auto-Enricher:</span>
                    <span className="font-mono text-emerald-400 font-semibold">Gemini 3.7 Flash</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Active Brand Name:</span>
                    <span className="font-mono text-white font-bold">{siteSettings.siteName || 'Vebpartner'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-zinc-400">Moderator Admin:</span>
                    <span className="font-mono text-zinc-300">yogigunes@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <AnalyticsSection
            listings={listings}
            ads={ads}
            submissions={submissions}
            categories={categories}
          />
        )}

        {/* ================= TAB: SOFTWARE LISTINGS ================= */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search software, replaces..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Businesses ({listings.length})</option>
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleOpenNewListingModal}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Software Card</span>
                </button>
              </div>
            </div>

            {/* Bulk Actions Floating / Sticky Toolbar when items are selected */}
            {selectedListingIds.length > 0 && (
              <div className="sticky top-20 z-20 p-4 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{selectedListingIds.length} items selected</span>
                  </span>

                  <button
                    onClick={() => setSelectedListingIds([])}
                    className="text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Mark as Featured / Unfeature */}
                  <button
                    disabled={isBulkProcessing}
                    onClick={() => handleBulkSetFeatured(true)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Feature
                  </button>
                  <button
                    disabled={isBulkProcessing}
                    onClick={() => handleBulkSetFeatured(false)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-zinc-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Unfeature
                  </button>

                  {/* Mark as Verified / Unverify */}
                  <button
                    disabled={isBulkProcessing}
                    onClick={() => handleBulkSetVerified(true)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-blue-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ✓ Verify
                  </button>

                  {/* Bulk Category Change */}
                  <select
                    disabled={isBulkProcessing}
                    value={bulkCategory}
                    onChange={(e) => {
                      setBulkCategory(e.target.value);
                      if (e.target.value) handleBulkChangeCategory(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">Move Category...</option>
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>

                  {/* Bulk Pricing Change */}
                  <select
                    disabled={isBulkProcessing}
                    value={bulkPricing}
                    onChange={(e) => {
                      setBulkPricing(e.target.value);
                      if (e.target.value) handleBulkChangePricing(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">Set Pricing...</option>
                    <option value="100% Free Open Source">100% Free Open Source</option>
                    <option value="Open Source (Self-Host) / Paid Cloud">Open Source / Paid Cloud</option>
                    <option value="Open Core / Commercial Extensions">Open Core / Commercial</option>
                    <option value="Freemium Open Source">Freemium Open Source</option>
                  </select>

                  {/* Bulk Delete */}
                  <button
                    disabled={isBulkProcessing}
                    onClick={handleBulkDelete}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ({selectedListingIds.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Listings Table */}
            <div className="rounded-2xl bg-[#0d0f17] border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 border-b border-white/[0.06] text-zinc-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <button
                          onClick={handleToggleSelectAll}
                          className="flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                          title={allFilteredSelected ? 'Deselect all' : 'Select all visible'}
                        >
                          {allFilteredSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : someFilteredSelected ? (
                            <MinusSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-600" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Tool / Project</th>
                      <th className="py-3.5 px-4">Related Provider</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Stats & Votes</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredListings.map((tool) => {
                      const isSelected = selectedListingIds.includes(tool.id);
                      return (
                        <tr
                          key={tool.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-emerald-500/10' : 'hover:bg-zinc-900/40'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleSelectOne(tool.id)}
                              className="flex items-center justify-center cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center font-bold text-sm text-emerald-400">
                                {tool.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{tool.name}</div>
                                <div className="text-[11px] text-zinc-500 truncate max-w-xs">{tool.tagline}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(tool.replaces) &&
                                tool.replaces.slice(0, 2).map((rep, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-medium"
                                  >
                                    {rep}
                                  </span>
                                ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 capitalize text-zinc-400 font-medium">
                            {tool.category.replace(/-/g, ' ')}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 font-mono text-[11px]">
                              <span className="flex items-center gap-1 text-amber-400">
                                <Star className="w-3 h-3" />
                                {tool.stars?.toLocaleString() || 0}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-400">
                                <ThumbsUp className="w-3 h-3" />
                                {tool.upvotes || 0}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {tool.featured && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  Featured
                                </span>
                              )}
                              {tool.verified && (
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                                  Verified
                                </span>
                              )}
                              {tool.isSponsored && (
                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                                  Sponsor
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditListingModal(tool)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit Tool"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${tool.name}?`)) {
                                    onDeleteListing(tool.id);
                                    showNotification(`Deleted ${tool.name}`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                title="Delete Tool"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ADVERTISEMENTS & SPONSORS ================= */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>Promotional Spots & Advertisements</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-normal">
                    Drag & drop cards to reorder priority
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">Manage paid sponsor campaigns, top banners, floating CTA badges, and detail slots.</p>
              </div>
              <button
                onClick={() => {
                  setEditingAd(null);
                  setIsAdModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Advertisement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ads.map((ad, idx) => (
                <div
                  key={ad.id}
                  draggable
                  onDragStart={(e) => handleAdDragStart(e, idx)}
                  onDragOver={(e) => handleAdDragOver(e, idx)}
                  onDrop={(e) => handleAdDrop(e, idx)}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                    draggedAdIdx === idx
                      ? 'opacity-40 border-dashed border-emerald-500 scale-95'
                      : dragOverAdIdx === idx
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg'
                      : ad.active
                      ? 'bg-[#0d0f17] border-zinc-800 shadow-sm hover:border-zinc-700'
                      : 'bg-[#0a0c12] border-white/[0.06] opacity-70'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="w-4 h-4 text-zinc-500 hover:text-white transition-colors" />
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ad.placement.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Position Shift Buttons */}
                        <div className="flex items-center bg-zinc-900 rounded-lg border border-white/[0.06] p-0.5">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveAd(idx, -1)}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === ads.length - 1}
                            onClick={() => handleMoveAd(idx, 1)}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ad.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {ad.active ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{ad.sponsorName}</h4>
                      <p className="text-xs text-emerald-300 font-semibold mt-0.5">{ad.title}</p>
                      {ad.description && <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{ad.description}</p>}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
                      <div>
                        Clicks: <span className="font-bold text-white">{ad.clicks || 0}</span>
                      </div>
                      <div>
                        Impressions: <span className="font-bold text-white">{ad.impressions || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <a
                      href={ad.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 truncate max-w-[140px]"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{ad.ctaUrl}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAd(ad);
                          setIsAdModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Ad"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete ad "${ad.sponsorName}"?`)) {
                            onDeleteAd(ad.id);
                            showNotification('Advertisement deleted');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Ad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>Software Categories & Taxonomy</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-normal">
                    Drag & drop to reorder site layout
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">Manage filtering categories, order of appearance on public homepage, icons, and tools count.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleCategoryDragStart(e, idx)}
                  onDragOver={(e) => handleCategoryDragOver(e, idx)}
                  onDrop={(e) => handleCategoryDrop(e, idx)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                    draggedCategoryIdx === idx
                      ? 'opacity-40 border-dashed border-emerald-500 scale-95'
                      : dragOverCategoryIdx === idx
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg'
                      : 'bg-[#0d0f17] border-white/[0.08] hover:border-white/[0.18]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
                        <span className="text-[10px] font-mono text-zinc-500">#{cat.id}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-zinc-900 rounded-md border border-white/[0.06] p-0.5">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveCategory(idx, -1)}
                            className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Left/Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === categories.length - 1}
                            onClick={() => handleMoveCategory(idx, 1)}
                            className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Right/Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {cat.featured && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">{cat.description || 'Browse tools'}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold">{cat.count || 0} tools</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCategoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      {cat.id !== 'all' && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete category "${cat.name}"?`)) {
                              onDeleteCategory(cat.id);
                              showNotification('Category removed');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: TAGS MANAGEMENT ================= */}
        {activeTab === 'tags' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-bold text-lg text-white">Aggregated System Tags ({tags.length})</h3>
              <p className="text-xs text-zinc-400">All keywords and metadata tags used across directory listings.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08]">
              <div className="flex flex-wrap gap-2.5">
                {tags.map((t) => (
                  <div
                    key={t.id}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center gap-2 text-xs"
                  >
                    <span className="text-zinc-200 font-medium">{t.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                      {t.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: CUSTOM PAGES & CONTENT ================= */}
        {activeTab === 'pages' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Custom Pages & Site Content</h3>
                <p className="text-xs text-zinc-400">Manage Vebpartner About, Advertise, Submit, Contact, Privacy, and Terms pages.</p>
              </div>
              <button
                onClick={() => {
                  setEditingPage(null);
                  setIsPageModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Content Page</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pages.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base">{p.title}</h4>
                    <p className="text-xs text-emerald-400 font-mono">/page/{p.slug}</p>
                    {p.subtitle && <p className="text-xs text-zinc-400 line-clamp-2">{p.subtitle}</p>}
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                      {p.showInMenu && <span>Header Menu</span>}
                      {p.showInMenu && p.showInFooter && <span>•</span>}
                      {p.showInFooter && <span>Footer</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPage(p);
                          setIsPageModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Page"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete page "${p.title}"?`)) {
                            onDeletePage(p.id);
                            showNotification('Page deleted');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SUBMISSIONS REVIEW QUEUE ================= */}
        {activeTab === 'submissions' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-bold text-lg text-white">Community Submission Review Queue</h3>
              <p className="text-xs text-zinc-400">Review business resources submitted by community members and operators.</p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Inbox Zero!</h4>
                <p className="text-xs text-zinc-400">All submitted opportunities have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{sub.toolName}</h4>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                          Related: {sub.replaces}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{sub.tagline}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                        {sub.githubUrl && (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            GitHub Repo
                          </a>
                        )}
                        <span>Submitted by: {sub.submittedBy || 'Anonymous'}</span>
                        {sub.notes && <span className="italic text-zinc-500">"{sub.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={async () => {
                          await onApproveSubmission(sub.id);
                          showNotification(`Approved ${sub.toolName} and published live!`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        onClick={async () => {
                          await onRejectSubmission(sub.id);
                          showNotification(`Rejected ${sub.toolName}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-white">Global Vebpartner Site Settings</h3>
              <p className="text-xs text-zinc-400">Configure branding, announcement bar, contact info, and navigation links.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Site Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Site Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Hero Headline Title</label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Announcement Banner */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcementEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                  <span className="text-xs font-bold text-white">Enable Top Sitewide Announcement Bar</span>
                </label>

                {settingsForm.announcementEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Banner Text</label>
                      <input
                        type="text"
                        value={settingsForm.announcementText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Banner Link URL</label>
                      <input
                        type="text"
                        value={settingsForm.announcementUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Social & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">X / Twitter URL</label>
                  <input
                    type="text"
                    value={settingsForm.twitterUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">GitHub URL</label>
                  <input
                    type="text"
                    value={settingsForm.githubUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingSettings ? 'Saving Settings...' : 'Save Site Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB: BACKUP & SYNC ================= */}
        {activeTab === 'backup' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-white">Database Backup & Recovery</h3>
              <p className="text-xs text-zinc-400">Export full JSON backups, import external data, or reset to initial curated state.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-3 flex flex-col justify-between">
                <div>
                  <Download className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Export Full Backup</h4>
                  <p className="text-xs text-zinc-400">Download complete dataset (listings, ads, pages, categories, tags, settings) as a structured JSON file.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportDatabase}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs text-center transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-3 flex flex-col justify-between">
                <div>
                  <Upload className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Import JSON Backup</h4>
                  <p className="text-xs text-zinc-400">Upload and restore previously exported Vebpartner JSON backups.</p>
                </div>
                <label className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs text-center transition-colors cursor-pointer block">
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (evt) => {
                        try {
                          const json = JSON.parse(evt.target?.result as string);
                          await onImportData(json);
                          showNotification('Data imported successfully!');
                        } catch (err: any) {
                          alert('Import failed: ' + err.message);
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-3 flex flex-col justify-between">
                <div>
                  <RefreshCw className="w-6 h-6 text-rose-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Reset to Curated Default</h4>
                  <p className="text-xs text-zinc-400">Reset database to the initial verified business directory collection.</p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to reset all data to default curated listings?')) {
                      await onResetData();
                      showNotification('Database reset to defaults');
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: LISTING FORM ================= */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#0d0f17] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingListing ? `Edit ${editingListing.name}` : 'Add New Software Listing'}
                  </h2>
                  <p className="text-xs text-zinc-400">Configure directory card, related providers, and implementation notes.</p>
                </div>
              </div>
              <button
                onClick={() => setIsListingModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* AI Auto-fill toolbar */}
            <div className="px-6 py-3 bg-zinc-900/80 border-b border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
              <div className="text-zinc-300 text-xs font-bold whitespace-nowrap">
                AI Auto-Enricher:
              </div>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Paste GitHub URL or tool name (e.g. n8n-io/n8n)..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500/30 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAiLoading ? 'Enriching...' : 'Auto-Fill'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveListing} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Supabase, Novu, PostHog"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Related Providers or Programs (Comma Separated) *</label>
                  <input
                    type="text"
                    required
                    value={formReplaces}
                    onChange={(e) => setFormReplaces(e.target.value)}
                    placeholder="Firebase, AWS Amplify"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tagline (Punchy Headline) *</label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="A practical provider or tool for launching an online business..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Full business overview for this Vebpartner listing..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">License</label>
                  <input
                    type="text"
                    value={formLicense}
                    onChange={(e) => setFormLicense(e.target.value)}
                    placeholder="MIT, AGPL-3.0, Apache-2.0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">GitHub Stars</label>
                  <input
                    type="number"
                    value={formStars}
                    onChange={(e) => setFormStars(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/supabase/supabase"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Official Website URL</label>
                  <input
                    type="url"
                    value={formWebsiteUrl}
                    onChange={(e) => setFormWebsiteUrl(e.target.value)}
                    placeholder="https://supabase.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Database, Postgres, Realtime, Auth"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={formTechStack}
                    onChange={(e) => setFormTechStack(e.target.value)}
                    placeholder="TypeScript, PostgreSQL, Go, Rust"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Docker 1-Click Run Command</label>
                <input
                  type="text"
                  value={formDockerCommand}
                  onChange={(e) => setFormDockerCommand(e.target.value)}
                  placeholder="docker run -d -p 8080:8080 supabase/postgres"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                  <span className="text-xs font-semibold text-zinc-200">Featured Card</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={formVerified}
                    onChange={(e) => setFormVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                  <span className="text-xs font-semibold text-zinc-200">Verified Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={formIsAiNative}
                    onChange={(e) => setFormIsAiNative(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                  <span className="text-xs font-semibold text-zinc-200">AI-Native</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={formIsSponsored}
                    onChange={(e) => setFormIsSponsored(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                  <span className="text-xs font-semibold text-zinc-200">Sponsored Tool</span>
                </label>
              </div>

              {formIsSponsored && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950 border border-cyan-500/20">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Sponsor CTA Text</label>
                    <input
                      type="text"
                      value={formAdCtaText}
                      onChange={(e) => setFormAdCtaText(e.target.value)}
                      placeholder="e.g. Try Free Cloud Instance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Sponsor Target URL</label>
                    <input
                      type="url"
                      value={formAdCtaUrl}
                      onChange={(e) => setFormAdCtaUrl(e.target.value)}
                  placeholder="https://sponsor.com/?ref=vebpartner"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 border-t border-white/[0.06] bg-zinc-950/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsListingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveListing}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {editingListing ? 'Save Changes' : 'Publish Tool Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Form Modal */}
      <AdFormModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onSave={async (ad) => {
          await onSaveAd(ad);
          showNotification('Advertisement saved successfully');
        }}
        adToEdit={editingAd}
      />

      {/* Page Form Modal */}
      <PageFormModal
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSave={async (page) => {
          await onSavePage(page);
          showNotification('Page saved successfully');
        }}
        pageToEdit={editingPage}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={async (cat) => {
          await onSaveCategory(cat);
          showNotification('Category saved successfully');
        }}
        categoryToEdit={editingCategory}
      />
    </div>
  );
};
