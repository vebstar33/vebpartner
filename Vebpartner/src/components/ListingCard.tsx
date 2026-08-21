import React from 'react';
import {
  Star,
  Clock,
  Scale,
  ExternalLink,
  Bot,
  Bookmark,
  ThumbsUp,
  Edit,
  Trash2,
  GitFork,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  Layers,
  Zap,
} from 'lucide-react';
import { ToolListing, ViewMode } from '../types';
import { VerifiedBadge } from './Icons';

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
        className="group relative rounded-2xl bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300 p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
      >
        <div>
          {/* Top Row: Logo + Name + Ad Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {listing.logoUrl ? (
                <img
                  src={listing.logoUrl}
                  alt={listing.name}
                  className="w-10 h-10 rounded-xl object-cover bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 border border-zinc-700/80 dark:border-zinc-700/80 light:border-zinc-200 flex items-center justify-center text-white dark:text-white light:text-zinc-800 font-bold text-sm">
                  {listing.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-white dark:text-white light:text-zinc-900 text-sm sm:text-base tracking-tight group-hover:text-zinc-200 dark:group-hover:text-zinc-100 transition-colors">
                    {listing.name}
                  </h3>
                  {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                </div>
              </div>
            </div>

            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 border border-zinc-700/60 dark:border-zinc-700/60 light:border-zinc-300">
              Ad
            </span>
          </div>

          {/* Description */}
          <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-3 mb-4">
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
            className="w-full py-2 px-4 rounded-xl bg-[#1d63ed] hover:bg-[#1a55cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
        className="group relative rounded-xl bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
      >
        <div className="flex items-center gap-3 min-w-0">
          {listing.logoUrl ? (
            <img
              src={listing.logoUrl}
              alt={listing.name}
              className="w-8 h-8 rounded-lg object-cover bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 text-white dark:text-white light:text-zinc-800 font-bold text-xs flex items-center justify-center shrink-0">
              {listing.name.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white dark:text-white light:text-zinc-900 text-sm truncate group-hover:text-zinc-200 transition-colors">
                {listing.name}
              </span>
              {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
              {listing.isAiNative && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300">
                  AI
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 truncate max-w-md">{listing.tagline}</p>
          </div>
        </div>

        {listing.startCost || listing.isBlueprint ? (
          <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 shrink-0">
            <div className="flex items-center gap-1 font-mono text-zinc-300 dark:text-zinc-300 light:text-zinc-800">
              <DollarSign className="w-3.5 h-3.5 text-zinc-400 light:text-zinc-500" />
              <span>{listing.startCost || '$97/mo'}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-zinc-400 dark:text-zinc-400 light:text-zinc-500">
              <TrendingUp className="w-3 h-3 text-zinc-500 light:text-zinc-400" />
              <span>{listing.revenueModel || 'Recurring'}</span>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-[11px] font-mono text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
              {listing.providerName ? `Powered by: ${listing.providerName}` : (listing.difficulty || 'Easy–Medium')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 shrink-0">
            <div className="flex items-center gap-1 font-mono text-zinc-300 dark:text-zinc-300 light:text-zinc-800">
              <Star className="w-3.5 h-3.5 text-zinc-400 light:text-zinc-500" />
              <span>{formattedStars}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-zinc-400 dark:text-zinc-400 light:text-zinc-500">
              <Clock className="w-3 h-3 text-zinc-500 light:text-zinc-400" />
              <span>{listing.lastCommit || 'Recent'}</span>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-[11px] font-mono text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
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
      className="group relative rounded-2xl bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 hover:border-zinc-700 light:hover:border-zinc-300 p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
    >
      <div>
        {/* Top Header: Logo + Name + AI Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {listing.logoUrl ? (
              <img
                src={listing.logoUrl}
                alt={listing.name}
                className="w-10 h-10 rounded-xl object-cover bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 border border-zinc-700/80 dark:border-zinc-700/80 light:border-zinc-200 flex items-center justify-center text-white dark:text-white light:text-zinc-800 font-bold text-sm">
                {listing.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white dark:text-white light:text-zinc-900 text-sm sm:text-base tracking-tight group-hover:text-emerald-400 dark:group-hover:text-zinc-100 transition-colors">
                  {listing.name}
                </h3>
                {listing.verified && <VerifiedBadge className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {listing.isAiNative && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800/90 dark:bg-zinc-800/90 light:bg-zinc-100 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 border border-zinc-700/70 dark:border-zinc-700/70 light:border-zinc-300">
                <Bot className="w-3 h-3 text-zinc-400 light:text-zinc-500" />
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
                  ? 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-600 border-amber-500/40'
                  : 'opacity-0 group-hover:opacity-100 focus:opacity-100 text-zinc-500 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-800 border-transparent hover:border-zinc-700 light:hover:border-zinc-300'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Subtitle / Tagline */}
        <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-3 mb-4">
          {listing.tagline || listing.description}
        </p>
      </div>

      {/* Metrics Section with clean Leader Lines */}
      <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 text-xs font-normal text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
        {listing.startCost || listing.isBlueprint ? (
          <>
            {/* START COST */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <DollarSign className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Start Cost</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="font-mono text-white dark:text-white light:text-zinc-900 font-medium">{listing.startCost || '$97/mo'}</span>
            </div>

            {/* REVENUE */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <TrendingUp className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Revenue</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 font-mono text-[11px]">{listing.revenueModel || 'Recurring'}</span>
            </div>

            {/* DIFFICULTY */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Difficulty</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 font-mono text-[11px]">{listing.difficulty || 'Easy–Medium'}</span>
            </div>
          </>
        ) : (
          <>
            {/* Stars */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <Star className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Stars</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="font-mono text-white dark:text-white light:text-zinc-900 font-medium">{formattedStars}</span>
            </div>

            {/* Last commit */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Last commit</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 font-mono text-[11px]">{listing.lastCommit || '1 day ago'}</span>
            </div>

            {/* License */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                <Scale className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>License</span>
              </span>
              <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
              <span className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 font-mono text-[11px]">{listing.license || 'Open Source'}</span>
            </div>
          </>
        )}
      </div>

      {/* Powered by / Platform footer */}
      {listing.providerName && (
        <div className="pt-2.5 mt-2.5 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
          <span className="text-[11px]">Powered by:</span>
          <span className="font-semibold text-white dark:text-white light:text-zinc-900 font-mono text-[11px]">{listing.providerName}</span>
        </div>
      )}

      {/* Admin Actions Bar (visible only in admin mode) */}
      {isAdminMode && onAdminEdit && onAdminDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs"
        >
          <button
            type="button"
            onClick={(e) => onAdminEdit(listing, e)}
            className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Edit className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={(e) => onAdminDelete(listing, e)}
            className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
