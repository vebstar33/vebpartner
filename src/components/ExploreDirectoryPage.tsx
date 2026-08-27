import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Globe2, Search } from 'lucide-react';
import { ExploreDirectoryDefinition, ExploreListingInput, ExploreMetadata } from '../types';

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
};

const getFallbackFavicon = (url: string) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(getHostname(url))}&sz=64`;

const getFallbackTitle = (url: string) =>
  getHostname(url)
    .split('.')
    .filter(Boolean)[0]
    ?.replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) || getHostname(url);

const getListingTitle = (listing: ExploreListingInput, metadata?: ExploreMetadata) =>
  listing.title || metadata?.title || getFallbackTitle(listing.url);

interface ExploreLogoProps {
  metadata?: ExploreMetadata;
  listing: ExploreListingInput;
}

const ExploreLogo: React.FC<ExploreLogoProps> = ({ metadata, listing }) => {
  const [failed, setFailed] = useState(false);
  const src = metadata?.faviconUrl || getFallbackFavicon(listing.url);
  const label = getListingTitle(listing, metadata);

  return (
    <div className="w-9 h-9 rounded-lg border border-vp dark:border-vp light:border-zinc-200 bg-vp-bg dark:bg-vp-bg light:bg-white flex items-center justify-center shrink-0 overflow-hidden">
      {!failed ? (
        <img
          src={src}
          alt=""
          className="w-5 h-5 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-extrabold text-vp-brand light:text-emerald-700">
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
};

interface ExploreListingRowProps {
  listing: ExploreListingInput;
  metadata?: ExploreMetadata;
}

const ExploreListingRow: React.FC<ExploreListingRowProps> = ({ listing, metadata }) => {
  const name = getListingTitle(listing, metadata);
  const description = listing.description || metadata?.description || `${getHostname(listing.url)} resource for ${listing.category.toLowerCase()}.`;
  const tags = listing.tags || [];

  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_minmax(0,1.25fr)_auto_auto] gap-3 sm:gap-4 items-center rounded-xl border border-vp dark:border-vp light:border-zinc-200 bg-vp-surface-subtle/42 dark:bg-vp-surface-subtle/42 light:bg-white hover:bg-vp-surface-subtle/70 dark:hover:bg-vp-surface-subtle/70 light:hover:bg-zinc-50 hover:border-vp-brand dark:hover:border-vp-brand light:hover:border-emerald-400/60 px-3 py-2.5 transition-colors shadow-sm"
    >
      <ExploreLogo metadata={metadata} listing={listing} />

      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-bold text-vp-primary dark:text-vp-primary light:text-vp-inverse truncate">
            {name}
          </h2>
          <span className="hidden sm:inline text-[11px] text-vp-faint dark:text-vp-faint light:text-vp-faint truncate">
            {metadata?.domain || getHostname(listing.url)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-vp-muted dark:text-vp-muted light:text-zinc-600 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="col-start-2 sm:col-start-auto flex flex-wrap items-center gap-1.5 min-w-0">
        <span className="px-2 py-1 rounded-md bg-vp-brand-subtle text-emerald-300 dark:text-emerald-300 light:text-emerald-700 border border-vp-brand text-[10px] font-bold">
          {listing.category}
        </span>
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-md bg-vp-bg/80 dark:bg-vp-bg/80 light:bg-zinc-100 border border-vp-subtle dark:border-vp-subtle light:border-zinc-200 text-[10px] font-semibold text-vp-muted dark:text-vp-muted light:text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="col-span-2 sm:col-span-1 justify-self-stretch sm:justify-self-end">
        <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-vp-brand hover:bg-vp-brand-hover text-vp-inverse text-xs font-extrabold transition-colors">
          Visit <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
};

interface ExploreDirectoryPageProps {
  directory: ExploreDirectoryDefinition;
}

export const ExploreDirectoryPage: React.FC<ExploreDirectoryPageProps> = ({ directory }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setActiveCategory('All');
  }, [directory.slug]);

  const filteredListings = useMemo(() => {
    if (activeCategory === 'All') return directory.listings;
    return directory.listings.filter((listing) => listing.category === activeCategory);
  }, [activeCategory, directory.listings]);

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-vp-brand dark:text-vp-brand light:text-emerald-700">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Explore</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-vp-primary dark:text-vp-primary light:text-vp-inverse tracking-tight">
          {directory.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-vp-muted dark:text-vp-muted light:text-zinc-600 leading-relaxed">
          {directory.description}
        </p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {directory.categories.map((category) => {
          const selected = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
                selected
                  ? 'bg-vp-brand text-vp-inverse border-emerald-400'
                  : 'bg-vp-surface-subtle/70 dark:bg-vp-surface-subtle/70 light:bg-white border-vp dark:border-vp light:border-zinc-200 text-vp-secondary dark:text-vp-secondary light:text-zinc-700 hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse hover:border-vp-brand'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredListings.length > 0 ? (
        <div className="space-y-2">
          {filteredListings.map((listing) => (
            <ExploreListingRow
              key={listing.url}
              listing={listing}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-vp dark:border-vp light:border-zinc-200 bg-vp-surface-subtle/50 dark:bg-vp-surface-subtle/50 light:bg-white">
          <Search className="w-5 h-5 text-vp-faint mx-auto mb-3" />
          <p className="text-sm font-bold text-vp-primary dark:text-vp-primary light:text-vp-inverse">No listings in this category yet</p>
        </div>
      )}
    </main>
  );
};
