export type ListingStatus = 'draft' | 'pending' | 'published' | 'archived';

export type Listing = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string | null;
  websiteUrl: string;
  partnerUrl?: string | null;
  category: string;
  opportunityType: string;
  geography: string[];
  startupCost?: string | null;
  revenueModel?: string | null;
  typicalMargin?: string | null;
  timeToLaunch?: string | null;
  requirements?: string[];
  highlights?: string[];
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};
