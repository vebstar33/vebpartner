export interface BlueprintDetails {
  provider?: string;
  providerName?: string;
  providerUrl?: string;
  providerProgramUrl?: string;
  providerLogoUrl?: string;
  affiliateUrl?: string;
  startCost?: string;
  revenueModel?: string;
  difficulty?: string;
  businessType?: string;
  inventoryRequired?: string;
  codingRequired?: string;
  recurringRevenue?: string;
  whiteLabel?: string;
  leadParagraph?: string;
  whatYouSellDescription?: string;
  whatYouSellItems?: string[];
  whatYouSellNote?: string;
  targetCustomers?: string[];
  howItWorksSteps?: {
    stepNumber: number;
    title: string;
    description: string;
    example?: string;
  }[];
  exampleBusinessModel?: {
    customerPrice: string;
    scenarios: string[];
    disclaimer: string;
  };
  platformCosts?: {
    planName: string;
    price: string;
    description: string;
    details: string;
  }[];
  whyProviderReasons?: {
    title: string;
    description: string;
  }[];
  requirements?: {
    label: string;
    value: string;
  }[];
  ctaData?: {
    label: string;
    provider: string;
    supportingText: string;
    startingPrice: string;
    url: string;
  };
  monetization?: {
    monetizationType?: string;
    provider?: string;
    commissionType?: string;
    directReferralCommission?: string;
    secondTierCommission?: string;
    affiliateUrl?: string;
  };
}

export type ListingType = 'opportunity' | 'platform' | 'tool';

export type PartnerModel =
  | 'reseller'
  | 'white-label'
  | 'agency-partner'
  | 'solution-partner'
  | 'partner'
  | 'distributor'
  | 'referral-partner';

export interface ToolListing {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  replaces?: string[]; // Proprietary apps it replaces, e.g. ["Customer.io", "MagicBell"]
  category: string;
  categoriesList?: string[];
  tags: string[];
  techStack?: string[];
  license?: string;
  githubUrl?: string;
  stars?: number;
  starsChange30d?: string;
  forks?: number;
  websiteUrl?: string;
  docsUrl?: string;
  demoUrl?: string;
  dockerCommand?: string;
  pricingModel?: string;
  logoUrl?: string;
  businessIcon?: string;
  providerLogoUrl?: string;
  screenshotUrl?: string;
  featured: boolean;
  verified: boolean;
  status?: 'published' | 'draft';
  isAiNative?: boolean;
  isSponsored?: boolean;
  listingType?: ListingType;
  partnerModels?: PartnerModel[];
  partnerModel?: string;
  youSell?: string;
  providerHandles?: string;
  youEarnThrough?: string;
  adCtaText?: string;
  adCtaUrl?: string;
  lastCommit?: string;
  repoAge?: string;
  version?: string;
  selfHosted?: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  comparisonPoints?: {
    feature: string;
    openSourceTool: string;
    proprietaryTool: string;
  }[];
  pros?: string[];
  cons?: string[];
  detailedParagraphs?: string[];
  similarProjects?: string[];
  repoName?: string;
  // Business Blueprint fields
  isBlueprint?: boolean;
  startCost?: string;
  revenueModel?: string;
  difficulty?: string;
  providerName?: string;
  providerUrl?: string;
  providerProgramUrl?: string;
  affiliateUrl?: string;
  blueprintDetails?: BlueprintDetails;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count?: number;
  badgeColor?: string;
  featured?: boolean;
}

export interface TagItem {
  id: string;
  name: string;
  count?: number;
}

export type AdPlacement = 'navbar_top' | 'floating_bottom' | 'tool_detail' | 'sidebar' | 'in_feed';

export interface Advertisement {
  id: string;
  title: string;
  sponsorName: string;
  logoUrl?: string;
  badgeText?: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  placement: AdPlacement;
  active: boolean;
  impressions?: number;
  clicks?: number;
  bgGradient?: string;
  createdAt?: string;
}

export interface CustomPage {
  id: string;
  slug: string; // e.g. "about", "advertise", "manifesto", "blog", "faq", "contact", "privacy", "terms"
  title: string;
  subtitle?: string;
  badge?: string;
  contentMarkdown: string;
  published: boolean;
  showInMenu: boolean;
  showInFooter: boolean;
  category?: 'company' | 'legal' | 'resources' | 'community' | 'editorial';
  lastUpdated: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  announcementBanner: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  socials: {
    twitter?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
    mastodon?: string;
    rss?: string;
    email?: string;
  };
  contactEmail: string;
  enableCommunitySubmissions: boolean;
}

export interface ProprietaryTool {
  name: string;
  category: string;
  logo?: string;
  popularAlternativesCount?: number;
}

export interface UserSubmission {
  id: string;
  toolName: string;
  tagline: string;
  replaces: string;
  githubUrl: string;
  websiteUrl: string;
  category: string;
  license?: string;
  submittedBy?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export type ViewMode = 'grid' | 'list' | 'compact';
export type SortOption = 'stars' | 'upvotes' | 'name' | 'newest';

export interface ExploreListingInput {
  url: string;
  category: string;
  tags?: string[];
  description?: string;
}

export interface ExploreMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
  imageUrl?: string;
  domain?: string;
}

export interface ExploreDirectoryDefinition {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  categories: string[];
  listings: ExploreListingInput[];
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedReplaces: string;
  selectedLicense: string;
  selectedTech: string;
  onlyFeatured: boolean;
  onlySelfHosted: boolean;
  sortBy: SortOption;
}
