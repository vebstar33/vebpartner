import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ListingDetailTemplate } from '../../../components/listings/ListingDetailTemplate';
import { getPublishedListingBySlug } from '../../../lib/listings';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);

  if (!listing) {
    return { title: 'Möjlighet hittades inte | Vebpartner' };
  }

  return {
    title: `${listing.name} | Vebpartner`,
    description: listing.tagline || listing.description.slice(0, 155),
  };
}

export default async function OpportunityPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);

  if (!listing) notFound();

  return <ListingDetailTemplate listing={listing} />;
}
