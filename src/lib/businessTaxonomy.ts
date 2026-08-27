import type { Category } from '../types';

export const BUSINESS_CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Businesses',
    icon: 'LayoutGrid',
    description: 'Browse all business opportunities',
  },
  {
    id: 'agencies-services',
    name: 'Agencies & Services',
    icon: 'Briefcase',
    description: 'Client-service businesses people can start with proven platforms',
  },
  {
    id: 'ai-businesses',
    name: 'AI Businesses',
    icon: 'Bot',
    description: 'AI-powered agencies and productized service businesses',
  },
  {
    id: 'e-commerce',
    name: 'E-commerce',
    icon: 'ShoppingBag',
    description: 'Online store, product, fulfillment and digital commerce models',
  },
  {
    id: 'creator-businesses',
    name: 'Creator Businesses',
    icon: 'Users',
    description: 'Audience, education, community and creator-led revenue models',
  },
  {
    id: 'reseller-businesses',
    name: 'Reseller Businesses',
    icon: 'RefreshCw',
    description: 'White-label, reseller and affiliate-friendly businesses',
  },
  {
    id: 'automation-no-code',
    name: 'Automation & No-Code',
    icon: 'Workflow',
    description: 'No-code systems, workflow automation and operational setup services',
  },
  {
    id: 'marketing-growth',
    name: 'Marketing & Growth',
    icon: 'TrendingUp',
    description: 'Acquisition, SEO, outbound, funnels and retention services',
  },
  {
    id: 'content-media',
    name: 'Content & Media',
    icon: 'Clapperboard',
    description: 'Content production, publishing and media service businesses',
  },
];

export const BUSINESS_CATEGORY_IDS = BUSINESS_CATEGORIES.map((category) => category.id);

const CATEGORY_NAMES_BY_ID = new Map(BUSINESS_CATEGORIES.map((category) => [category.id, category.name]));

export const BUSINESS_LISTING_CATEGORY_IDS: Record<string, string[]> = {
  'crm-automation-agency': ['agencies-services', 'automation-no-code', 'marketing-growth'],
  'email-marketing-agency': ['agencies-services', 'marketing-growth'],
  'esim-business': ['e-commerce', 'reseller-businesses'],
  'domain-reseller-business': ['reseller-businesses'],
  'web-hosting-business': ['reseller-businesses'],
  'ecommerce-setup-agency': ['agencies-services', 'e-commerce'],
  'website-design-agency': ['agencies-services'],
  'wordpress-hosting-agency': ['agencies-services'],
  'funnel-building-agency': ['agencies-services', 'automation-no-code', 'marketing-growth'],
  'automation-agency': ['agencies-services', 'automation-no-code'],
  'seo-agency': ['agencies-services', 'marketing-growth'],
  'local-seo-agency': ['agencies-services', 'marketing-growth'],
  'cold-email-agency': ['agencies-services', 'marketing-growth'],
  'b2b-lead-generation-agency': ['agencies-services', 'marketing-growth'],
  'social-media-management-agency': ['agencies-services', 'marketing-growth', 'content-media'],
  'ai-chatbot-agency': ['ai-businesses'],
  'ai-voice-agency': ['ai-businesses', 'content-media'],
  'ai-video-agency': ['ai-businesses', 'content-media'],
  'ai-avatar-agency': ['ai-businesses', 'content-media'],
  'ai-content-agency': ['ai-businesses', 'content-media'],
  'no-code-app-agency': ['automation-no-code'],
  'no-code-web-agency': ['automation-no-code'],
  'forms-lead-capture-agency': ['automation-no-code'],
  'booking-system-business': ['automation-no-code'],
  'customer-support-agency': ['agencies-services'],
  'live-chat-support-agency': ['agencies-services'],
  'reputation-management-agency': ['agencies-services', 'marketing-growth'],
  'print-on-demand-business': ['e-commerce'],
  'dropshipping-business': ['e-commerce'],
  'digital-product-business': ['e-commerce', 'creator-businesses'],
  'online-course-business': ['creator-businesses'],
  'course-membership-business': ['creator-businesses'],
  'community-business': ['creator-businesses'],
  'newsletter-business': ['creator-businesses', 'content-media'],
  'creator-email-business': ['creator-businesses', 'content-media'],
  'podcast-remote-production-agency': ['agencies-services', 'creator-businesses', 'content-media'],
};

export const BUSINESS_FILTER_TAGS = [
  'Recurring Revenue',
  'Low Startup Cost',
  'No Inventory',
  'Beginner Friendly',
  'B2B',
  'Local Business',
  'Remote',
  'Affiliate',
  'Reseller',
  'White Label',
  'No-Code',
  'Creator',
  'Ecommerce',
  'Agency',
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function getBusinessCategoryName(categoryId: string): string {
  return CATEGORY_NAMES_BY_ID.get(categoryId) || categoryId;
}

export function getListingBusinessCategoryIds(listingId: string, listingName?: string): string[] {
  const ids =
    BUSINESS_LISTING_CATEGORY_IDS[listingId] ||
    (listingName ? BUSINESS_LISTING_CATEGORY_IDS[normalize(listingName)] : undefined);

  return ids || ['agencies-services'];
}

export function getListingPrimaryBusinessCategoryId(listingId: string, listingName?: string): string {
  return getListingBusinessCategoryIds(listingId, listingName)[0];
}

export function getListingBusinessCategoryNames(listingId: string, listingName?: string): string[] {
  return getListingBusinessCategoryIds(listingId, listingName).map(getBusinessCategoryName);
}

export function listingMatchesBusinessCategory(
  listing: { id: string; name?: string; category?: string; categoriesList?: string[] },
  categoryId: string,
): boolean {
  if (categoryId === 'all') return true;
  const categoryName = getBusinessCategoryName(categoryId);
  const mappedIds = getListingBusinessCategoryIds(listing.id, listing.name);
  return (
    mappedIds.includes(categoryId) ||
    listing.category === categoryId ||
    Boolean(listing.categoriesList?.includes(categoryId)) ||
    Boolean(listing.categoriesList?.includes(categoryName))
  );
}

export function getBusinessFilterTags(listing: {
  tags?: string[];
  startCost?: string;
  difficulty?: string;
  revenueModel?: string;
  blueprintDetails?: {
    inventoryRequired?: string;
    whiteLabel?: string;
    codingRequired?: string;
    businessType?: string;
  };
}): string[] {
  const sourceTags = listing.tags || [];
  const source = sourceTags.map((tag) => tag.toLowerCase());
  const filters = new Set<string>();

  if (source.includes('recurring-revenue') || listing.revenueModel === 'Recurring') filters.add('Recurring Revenue');
  if (listing.startCost && /free|\$0|\$9|\$10|\$19|\$29/i.test(listing.startCost)) filters.add('Low Startup Cost');
  if (source.includes('no-inventory') || listing.blueprintDetails?.inventoryRequired?.toLowerCase() === 'no') filters.add('No Inventory');
  if (listing.difficulty?.toLowerCase().startsWith('easy')) filters.add('Beginner Friendly');
  if (source.includes('b2b')) filters.add('B2B');
  if (source.includes('local-business')) filters.add('Local Business');
  if (source.some((tag) => ['remote-recording', 'newsletter', 'digital-products', 'online-courses'].includes(tag))) filters.add('Remote');
  if (source.includes('affiliate')) filters.add('Affiliate');
  if (source.includes('reseller')) filters.add('Reseller');
  if (source.includes('white-label') || listing.blueprintDetails?.whiteLabel?.toLowerCase() === 'yes') filters.add('White Label');
  if (source.includes('no-code') || listing.blueprintDetails?.codingRequired?.toLowerCase() === 'no') filters.add('No-Code');
  if (source.includes('creator')) filters.add('Creator');
  if (source.includes('ecommerce')) filters.add('Ecommerce');
  if (source.includes('agency')) filters.add('Agency');

  return BUSINESS_FILTER_TAGS.filter((tag) => filters.has(tag));
}
