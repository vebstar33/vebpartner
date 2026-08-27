import React from 'react';
import {
  Star,
  Clock,
  Scale,
  Bot,
  Bookmark,
  Edit,
  Trash2,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { ToolListing, ViewMode } from '../types';
import { VerifiedBadge } from './Icons';
import { getListingTypeCardClasses, getListingTypeLabel } from '../lib/listingTypePresentation';
import { ProviderLogoPlate } from './ProviderLogoPlate';
import { getListingPath } from '../lib/seo';

interface ListingCardProps {
  listing: ToolListing;
  viewMode?: ViewMode;
  onSelect: (listing: ToolListing) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onUpvote: (id: string, e?: React.MouseEvent) => void;
  hasUpvoted: boolean;
  isAdminMode?: boolean;
  onAdminEdit?: (listing: ToolListing, e: React.MouseEvent) => void;
  onAdminDelete?: (listing: ToolListing, e: React.MouseEvent) => void;
  cardIndex?: number;
  onCardKeyDown?: (e: React.KeyboardEvent, index: number, listing: ToolListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  viewMode = 'grid',
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onUpvote,
  hasUpvoted,
  isAdminMode = false,
  onAdminEdit,
  onAdminDelete,
  cardIndex = 0,
  onCardKeyDown,
}) => {
  // Format stars into comma separated number (e.g. 39,531)
  const formattedStars = (listing.stars || 0).toLocaleString();
  const listingTypeLabel = getListingTypeLabel(listing.listingType);
  const listingTypeClasses = getListingTypeCardClasses(listing.listingType);
  const listingPath = getListingPath(listing);
  const openListingLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(listing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If Enter or Space is pressed while focused on card
    if (e.key === 'Enter' || e.key === ' ') {
      // Don't trigger if an interactive inner button or link is focused
      if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'A') {
        e.preventDefault();
        onSelect(listing);
      }
    }
    onCardKeyDown?.(e, cardIndex, listing);
  };

  // If this is a sponsored card
  if (listing.isSponsored) {
    return (
      <div
        tabIndex={0}
        role="article"
        aria-label={`Sponsored: ${listing.name}. ${listing.tagline || listing.description}`}
        id={`listing-card-${listing.id}`}
        onClick={() => onSelect(listing)}
        onKeyDown={handleKeyDown}
        className="group relative rounded-2xl bg-vp-surface dark:bg-vp-surface light:bg-white border border-vp dark:border-vp light:border-zinc-200 hover:border-vp-strong light:hover:border-zinc-300 p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--vp-brand)]"
      >
        <div>
          {/* Top Row: Logo + Name + Ad Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {listing.logoUrl ? (
                <img
                  src={listing.logoUrl}
                  alt={listing.name}
                  className="w-10 h-10 rounded-xl object-cover bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp dark:border-vp light:border-zinc-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-vp-surface-hover dark:bg-vp-surface-hover light:bg-zinc-100 border border-vp-strong dark:border-vp-strong light:border-zinc-200 flex items-center justify-center text-vp-primary dark:text-vp-primary light:text-zinc-800 font-bold text-sm">
                  {listing.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-vp-primary dark:text-vp-primary light:text-zinc-900 text-sm sm:text-base tracking-tight group-hover:text-vp-secondary dark:group-hover:text-vp-primary transition-colors">
                    {listing.name}
                  </h3>
                  {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 text-vp-info shrink-0" />}
                </div>
              </div>
            </div>

            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-vp-surface-hover dark:bg-vp-surface-hover light:bg-zinc-100 text-vp-muted dark:text-vp-muted light:text-zinc-600 border border-vp-strong dark:border-vp-strong light:border-zinc-300">
              Ad
            </span>
          </div>

          {/* Description */}
          <p className="text-vp-muted dark:text-vp-muted light:text-zinc-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-3 mb-4">
            {listing.description || listing.tagline}
          </p>
        </div>

        {/* Bottom CTA button */}
        <div>
          <a
            href={listing.websiteUrl || listing.adCtaUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 px-4 rounded-xl bg-vp-info hover:bg-vp-info text-vp-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>{listing.adCtaText || 'Get started now'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Compact List View
  if (viewMode === 'compact' || viewMode === 'list') {
    return (
      <div
        tabIndex={0}
        role="article"
        aria-label={`Open-source tool: ${listing.name}. ${listing.tagline}`}
        id={`listing-card-${listing.id}`}
        onClick={() => onSelect(listing)}
        onKeyDown={handleKeyDown}
        className={`group relative rounded-xl ${listingTypeClasses.surface} border ${listingTypeClasses.border} p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--vp-brand)]`}
      >
        <div className="min-w-0">
            {listingTypeLabel && (
              <span className={`mb-1 inline-flex px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap text-center min-w-[7.25rem] ${listingTypeClasses.badge}`}>
                {listingTypeLabel}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <a
                href={listingPath}
                onClick={openListingLink}
                className="font-semibold text-vp-primary dark:text-vp-primary light:text-zinc-900 text-sm truncate group-hover:text-vp-secondary transition-colors"
              >
                {listing.name}
              </a>
              {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
              {listing.isAiNative && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-vp-surface-hover dark:bg-vp-surface-hover light:bg-zinc-100 text-vp-secondary dark:text-vp-secondary light:text-zinc-700 border border-vp-strong dark:border-vp-strong light:border-zinc-300">
                  AI
                </span>
              )}
            </div>
            <p className="text-xs text-vp-muted dark:text-vp-muted light:text-zinc-600 truncate max-w-md">{listing.tagline}</p>
        </div>

        {listing.startCost || listing.isBlueprint ? (
          <div className="flex items-center gap-4 text-xs text-vp-muted dark:text-vp-muted light:text-zinc-600 shrink-0">
            <div className="flex items-center gap-1 font-mono text-vp-secondary dark:text-vp-secondary light:text-zinc-800">
              <DollarSign className="w-3.5 h-3.5 text-vp-muted light:text-vp-faint" />
              <span>{listing.startCost || '$97/mo'}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-vp-muted dark:text-vp-muted light:text-vp-faint">
              <TrendingUp className="w-3 h-3 text-vp-faint light:text-vp-muted" />
              <span>{listing.revenueModel || 'Recurring'}</span>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp dark:border-vp light:border-zinc-200 text-[11px] font-mono text-vp-secondary dark:text-vp-secondary light:text-zinc-700">
              {listing.providerName ? `Powered by: ${listing.providerName}` : (listing.difficulty || 'Easy–Medium')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs text-vp-muted dark:text-vp-muted light:text-zinc-600 shrink-0">
            <div className="flex items-center gap-1 font-mono text-vp-secondary dark:text-vp-secondary light:text-zinc-800">
              <Star className="w-3.5 h-3.5 text-vp-muted light:text-vp-faint" />
              <span>{formattedStars}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-vp-muted dark:text-vp-muted light:text-vp-faint">
              <Clock className="w-3 h-3 text-vp-faint light:text-vp-muted" />
              <span>{listing.lastCommit || 'Recent'}</span>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp dark:border-vp light:border-zinc-200 text-[11px] font-mono text-vp-secondary dark:text-vp-secondary light:text-zinc-700">
              {listing.license}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Standard 3-Column Grid Card
  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Listing: ${listing.name}. ${listing.tagline || listing.description}`}
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing)}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-2xl ${listingTypeClasses.surface} border ${listingTypeClasses.border} p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--vp-brand)]`}
    >
      <div>
        {/* Top Header: Type badge + name + actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
              {listingTypeLabel && (
                <span className={`mb-1 inline-flex px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap text-center min-w-[7.25rem] ${listingTypeClasses.badge}`}>
                  {listingTypeLabel}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-vp-primary dark:text-vp-primary light:text-zinc-900 text-sm sm:text-base tracking-tight group-hover:text-vp-secondary dark:group-hover:text-vp-primary transition-colors">
                  <a href={listingPath} onClick={openListingLink}>
                  {listing.name}
                  </a>
                </h3>
                {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 text-vp-info shrink-0" />}
              </div>
          </div>

          <div className="flex items-center gap-1">
            {listing.isAiNative && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-vp-surface-hover/90 dark:bg-vp-surface-hover/90 light:bg-zinc-100 text-vp-secondary dark:text-vp-secondary light:text-zinc-700 border border-vp-strong dark:border-vp-strong light:border-zinc-300">
                <Bot className="w-3 h-3 text-vp-muted light:text-vp-faint" />
                <span>AI</span>
              </span>
            )}
            {/* Quick Bookmark button on card */}
            <button
              type="button"
              aria-label={isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
              onClick={(e) => onToggleBookmark(listing.id, e)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-vp-warning/15 text-vp-warning dark:text-vp-warning light:text-amber-600 border-vp-warning/30'
                  : 'opacity-0 group-hover:opacity-100 focus:opacity-100 text-vp-faint hover:text-vp-secondary dark:hover:text-vp-secondary light:hover:text-zinc-800 border-transparent hover:border-vp-strong light:hover:border-zinc-300'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-vp-warning text-vp-warning' : ''}`} />
            </button>
          </div>
        </div>

        {/* Subtitle / Tagline */}
        <p className="text-vp-muted dark:text-vp-muted light:text-zinc-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-3 mb-4">
          {listing.tagline || listing.description}
        </p>
      </div>

      {/* Metrics Section with clean Leader Lines */}
      <div className="space-y-1.5 pt-3 border-t border-vp dark:border-vp light:border-zinc-200 text-xs font-normal text-vp-muted dark:text-vp-muted light:text-zinc-600">
        {listing.startCost || listing.isBlueprint ? (
          <>
            {/* START COST */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <DollarSign className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>Start Cost</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="font-mono text-vp-primary dark:text-vp-primary light:text-zinc-900 font-medium">{listing.startCost || '$97/mo'}</span>
            </div>

            {/* REVENUE */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <TrendingUp className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>Revenue</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="text-vp-secondary dark:text-vp-secondary light:text-zinc-700 font-mono text-[11px]">{listing.revenueModel || 'Recurring'}</span>
            </div>

            {/* DIFFICULTY */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <Layers className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>Difficulty</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="text-vp-secondary dark:text-vp-secondary light:text-zinc-700 font-mono text-[11px]">{listing.difficulty || 'Easy–Medium'}</span>
            </div>
          </>
        ) : (
          <>
            {/* Stars */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <Star className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>Stars</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="font-mono text-vp-primary dark:text-vp-primary light:text-zinc-900 font-medium">{formattedStars}</span>
            </div>

            {/* Last commit */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <Clock className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>Last commit</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="text-vp-secondary dark:text-vp-secondary light:text-zinc-700 font-mono text-[11px]">{listing.lastCommit || '1 day ago'}</span>
            </div>

            {/* License */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-vp-muted dark:text-vp-muted light:text-zinc-600">
                <Scale className="w-3.5 h-3.5 text-vp-muted dark:text-vp-muted light:text-vp-faint" />
                <span>License</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-vp dark:border-vp light:border-zinc-300" />
              <span className="text-vp-secondary dark:text-vp-secondary light:text-zinc-700 font-mono text-[11px]">{listing.license || 'Open Source'}</span>
            </div>
          </>
        )}
      </div>

      {/* Powered by / Platform footer */}
      {listing.providerName && (
        <div className="pt-2.5 mt-2.5 border-t border-vp dark:border-vp light:border-zinc-200 flex items-center justify-between text-xs text-vp-muted dark:text-vp-muted light:text-zinc-600">
          <span className="text-[11px]">Powered by:</span>
          <span className="font-semibold text-vp-primary dark:text-vp-primary light:text-zinc-900 font-mono text-[11px] inline-flex items-center gap-1.5">
            <ProviderLogoPlate src={listing.providerLogoUrl} name={listing.providerName} variant="card" />
          </span>
        </div>
      )}

      {/* Admin Actions Bar (visible only in admin mode) */}
      {isAdminMode && onAdminEdit && onAdminDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between pt-3 mt-3 border-t border-vp dark:border-vp light:border-zinc-200 text-xs"
        >
          <button
            type="button"
            onClick={(e) => onAdminEdit(listing, e)}
            className="text-vp-info hover:text-vp-info font-medium flex items-center gap-1 cursor-pointer"
          >
            <Edit className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={(e) => onAdminDelete(listing, e)}
            className="text-vp-error hover:text-vp-error font-medium flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
