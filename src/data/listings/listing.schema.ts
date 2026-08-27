import type { ToolListing } from '../../types';
import type { ListingType, PartnerModel } from '../../types';
import {
  getBusinessFilterTags,
  getListingBusinessCategoryNames,
  getListingPrimaryBusinessCategoryId,
} from '../../lib/businessTaxonomy';

export interface BusinessListing {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  category: string;
  categoriesList?: string[];
  tags: string[];
  listingType?: ListingType;
  partnerModels?: PartnerModel[];
  partnerModel?: string;
  youSell?: string;
  providerHandles?: string;
  youEarnThrough?: string;
  startCost: string;
  revenueModel: string;
  difficulty: string;
  businessIcon?: string;
  provider: {
    name: string;
    logo?: string;
    website: string;
    programUrl?: string;
    affiliateUrl: string;
  };
  overview: {
    businessType: string;
    inventoryRequired: string;
    codingRequired: string;
    recurringRevenue: string;
    whiteLabel: string;
  };
  whatYouSell: {
    description: string;
    items: string[];
    note?: string;
  };
  targetCustomers: string[];
  howItWorks: {
    stepNumber: number;
    title: string;
    description: string;
    example?: string;
  }[];
  exampleBusinessModel: {
    customerPrice: string;
    scenarios: string[];
    disclaimer: string;
  };
  platformCosts: {
    planName: string;
    price: string;
    description: string;
    details: string;
  }[];
  whyProvider: {
    title: string;
    description: string;
  }[];
  requirements: {
    label: string;
    value: string;
  }[];
  monetization: {
    type: string;
    commissionType: string;
    commissionValue: string;
    secondTierCommission?: string;
  };
  status: 'published' | 'draft';
  featured: boolean;
  lastVerified: string;
  upvotes?: number;
}

const REQUIRED_FIELDS: Array<keyof BusinessListing> = [
  'id',
  'slug',
  'name',
  'tagline',
  'startCost',
  'revenueModel',
  'difficulty',
];

export function validateBusinessListing(listing: BusinessListing): BusinessListing {
  const missing = REQUIRED_FIELDS.filter((field) => !listing[field]);

  if (!listing.provider?.name) {
    missing.push('provider' as keyof BusinessListing);
  }

  if (missing.length > 0) {
    throw new Error(`Business listing "${listing.id || 'unknown'}" is missing required fields: ${missing.join(', ')}`);
  }

  return listing;
}

function getProviderFaviconUrl(website: string): string | undefined {
  try {
    const hostname = new URL(website).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
  } catch {
    return undefined;
  }
}

export function businessListingToToolListing(listing: BusinessListing): ToolListing {
  validateBusinessListing(listing);
  const category = getListingPrimaryBusinessCategoryId(listing.id, listing.name);
  const categoriesList = getListingBusinessCategoryNames(listing.id, listing.name);
  const tags = Array.from(new Set([...getBusinessFilterTags(listing), ...listing.tags]));
  const providerLogoUrl = getProviderFaviconUrl(listing.provider.website) || listing.provider.logo;

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    tagline: listing.tagline,
    description: listing.shortDescription,
    category,
    categoriesList,
    tags,
    listingType: listing.listingType,
    partnerModels: listing.partnerModels,
    partnerModel: listing.partnerModel,
    youSell: listing.youSell,
    providerHandles: listing.providerHandles,
    youEarnThrough: listing.youEarnThrough,
    pricingModel: `From ${listing.startCost} (${listing.provider.name} Starter)`,
    logoUrl: providerLogoUrl,
    featured: listing.featured,
    verified: true,
    status: listing.status,
    upvotes: listing.upvotes ?? 0,
    createdAt: listing.lastVerified,
    updatedAt: listing.lastVerified,
    isBlueprint: true,
    businessIcon: listing.businessIcon,
    providerName: listing.provider.name,
    providerUrl: listing.provider.website,
    providerProgramUrl: listing.provider.programUrl,
    providerLogoUrl,
    affiliateUrl: listing.provider.affiliateUrl,
    startCost: listing.startCost,
    revenueModel: listing.revenueModel,
    difficulty: listing.difficulty,
    blueprintDetails: {
      provider: listing.provider.name,
      providerName: listing.provider.name,
      providerUrl: listing.provider.website,
      providerProgramUrl: listing.provider.programUrl,
      providerLogoUrl,
      affiliateUrl: listing.provider.affiliateUrl,
      startCost: listing.startCost.replace('/mo', '/month'),
      revenueModel: listing.revenueModel === 'Recurring' ? 'Recurring monthly revenue' : listing.revenueModel,
      difficulty: listing.difficulty,
      businessType: listing.overview.businessType,
      inventoryRequired: listing.overview.inventoryRequired,
      codingRequired: listing.overview.codingRequired,
      recurringRevenue: listing.overview.recurringRevenue,
      whiteLabel: listing.overview.whiteLabel,
      leadParagraph: listing.shortDescription,
      whatYouSellDescription: listing.whatYouSell.description,
      whatYouSellItems: listing.whatYouSell.items,
      whatYouSellNote: listing.whatYouSell.note,
      targetCustomers: listing.targetCustomers,
      howItWorksSteps: listing.howItWorks,
      exampleBusinessModel: listing.exampleBusinessModel,
      platformCosts: listing.platformCosts,
      whyProviderReasons: listing.whyProvider,
      requirements: listing.requirements,
      monetization: {
        monetizationType: listing.monetization.type,
        provider: listing.provider.name,
        commissionType: listing.monetization.commissionType,
        directReferralCommission: listing.monetization.commissionValue,
        secondTierCommission: listing.monetization.secondTierCommission,
        affiliateUrl: listing.provider.affiliateUrl,
      },
    },
  };
}
