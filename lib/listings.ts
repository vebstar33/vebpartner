import type { Listing, ListingChartMetric } from '../types/listing';
import { createPublicSupabaseClient } from './supabase/server';

type ListingRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  website_url: string;
  partner_url: string | null;
  category: string;
  opportunity_type: string;
  geography: string[] | null;
  startup_cost: string | null;
  revenue_model: string | null;
  typical_margin: string | null;
  time_to_launch: string | null;
  requirements: string[] | null;
  highlights: string[] | null;
  chart_metrics: ListingChartMetric[] | null;
  status: Listing['status'];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    partnerUrl: row.partner_url,
    category: row.category,
    opportunityType: row.opportunity_type,
    geography: row.geography ?? [],
    startupCost: row.startup_cost,
    revenueModel: row.revenue_model,
    typicalMargin: row.typical_margin,
    timeToLaunch: row.time_to_launch,
    requirements: row.requirements ?? [],
    highlights: row.highlights ?? [],
    chartMetrics: row.chart_metrics ?? [],
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data ? mapListing(data as ListingRow) : null;
}
