import type { ListingType, PartnerModel } from '../types';

export const PROTOTYPE_LISTING_TYPES: Record<string, { listingType: ListingType; partnerModels?: PartnerModel[] }> = {
  'crm-automation-agency': {
    listingType: 'opportunity',
    partnerModels: ['white-label', 'agency-partner'],
  },
  'email-marketing-agency': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'agency-partner', 'referral-partner'],
  },
  'esim-business': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'white-label'],
  },
  'domain-reseller-business': {
    listingType: 'opportunity',
    partnerModels: ['reseller'],
  },
  'web-hosting-business': {
    listingType: 'opportunity',
    partnerModels: ['agency-partner'],
  },
  'ecommerce-setup-agency': {
    listingType: 'opportunity',
    partnerModels: ['agency-partner'],
  },
  'website-design-agency': {
    listingType: 'opportunity',
    partnerModels: ['white-label', 'agency-partner'],
  },
  'wordpress-hosting-agency': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'agency-partner'],
  },
  'funnel-building-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'automation-agency': {
    listingType: 'opportunity',
    partnerModels: ['solution-partner'],
  },
  'seo-agency': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'agency-partner'],
  },
  'local-seo-agency': {
    listingType: 'opportunity',
    partnerModels: ['white-label'],
  },
  'cold-email-agency': {
    listingType: 'opportunity',
    partnerModels: ['white-label', 'agency-partner'],
  },
  'b2b-lead-generation-agency': {
    listingType: 'opportunity',
    partnerModels: ['solution-partner', 'reseller'],
  },
  'social-media-management-agency': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'white-label'],
  },
  'ai-chatbot-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'ai-voice-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'ai-video-agency': {
    listingType: 'opportunity',
    partnerModels: ['referral-partner'],
  },
  'ai-avatar-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'ai-content-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'no-code-app-agency': {
    listingType: 'platform',
    partnerModels: [],
  },
  'no-code-web-agency': {
    listingType: 'opportunity',
    partnerModels: ['agency-partner'],
  },
  'forms-lead-capture-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
  'booking-system-business': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'white-label'],
  },
  'customer-support-agency': {
    listingType: 'opportunity',
    partnerModels: ['reseller', 'solution-partner'],
  },
  'live-chat-support-agency': {
    listingType: 'opportunity',
    partnerModels: ['partner'],
  },
  'reputation-management-agency': {
    listingType: 'opportunity',
    partnerModels: ['partner', 'reseller'],
  },
  'print-on-demand-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'dropshipping-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'digital-product-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'online-course-business': {
    listingType: 'opportunity',
    partnerModels: ['agency-partner'],
  },
  'course-membership-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'community-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'newsletter-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'creator-email-business': {
    listingType: 'platform',
    partnerModels: [],
  },
  'podcast-remote-production-agency': {
    listingType: 'tool',
    partnerModels: [],
  },
};

export const PROTOTYPE_OPPORTUNITY_DETAILS: Record<
  string,
  {
    partnerModel: string;
    youSell: string;
    providerHandles: string;
    youEarnThrough: string;
  }
> = {
  'crm-automation-agency': {
    partnerModel: 'White Label · Agency Partner',
    youSell:
      'CRM, marketing automation, booking, follow-up, reputation management and related recurring services to your own business clients.',
    providerHandles:
      'Core CRM/SaaS platform, hosting/infrastructure, product updates and the underlying software functionality.',
    youEarnThrough:
      'Your own setup fees, monthly service packages, SaaS subscriptions and recurring client retainers.',
  },
};

export const LISTING_TYPE_FILTERS: Array<{ id: 'all' | ListingType; label: string }> = [
  { id: 'all', label: 'All Businesses' },
  { id: 'opportunity', label: 'Business Opportunities' },
  { id: 'platform', label: 'Business Platforms' },
  { id: 'tool', label: 'Business Tools' },
];

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  opportunity: 'Business Opportunity',
  platform: 'Business Platform',
  tool: 'Business Tool',
};

export const PARTNER_MODEL_LABELS: Record<PartnerModel, string> = {
  reseller: 'Reseller',
  'white-label': 'White Label',
  'agency-partner': 'Agency Partner',
  'solution-partner': 'Solution Partner',
  partner: 'Partner',
  distributor: 'Distributor',
  'referral-partner': 'Referral Partner',
};

export function getListingTypeLabel(listingType?: ListingType): string | null {
  return listingType ? LISTING_TYPE_LABELS[listingType] : null;
}

export function getPartnerModelLabel(partnerModel: PartnerModel): string {
  return PARTNER_MODEL_LABELS[partnerModel];
}

export function getListingTypeCardClasses(listingType?: ListingType) {
  if (listingType === 'opportunity') {
    return {
      surface: 'bg-[#111111] dark:bg-[#111111] light:bg-white',
      border:
        'border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300',
      badge:
        'bg-[linear-gradient(180deg,rgba(25,180,100,0.30),rgba(15,110,70,0.18))] text-zinc-100 border-emerald-500/25 shadow-[inset_0_0_10px_rgba(25,180,100,0.18),0_0_6px_rgba(25,180,100,0.08)]',
    };
  }

  if (listingType === 'platform') {
    return {
      surface: 'bg-[#111111] dark:bg-[#111111] light:bg-white',
      border:
        'border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300',
      badge:
        'bg-[linear-gradient(180deg,rgba(60,120,255,0.30),rgba(40,70,180,0.18))] text-zinc-100 border-blue-500/25 shadow-[inset_0_0_10px_rgba(60,120,255,0.18),0_0_6px_rgba(60,120,255,0.08)]',
    };
  }

  return {
    surface: 'bg-[#111111] dark:bg-[#111111] light:bg-white',
    border:
      'border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300',
    badge: 'bg-[#090909] text-zinc-200 border-zinc-700/80',
  };
}
