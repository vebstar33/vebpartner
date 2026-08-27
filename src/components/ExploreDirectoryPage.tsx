import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Globe2, Search } from 'lucide-react';
import { ExploreDirectoryDefinition, ExploreListingInput, ExploreMetadata } from '../types';
import { api } from '../lib/api';

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

interface ExploreLogoProps {
  metadata?: ExploreMetadata;
  listing: ExploreListingInput;
}

const ExploreLogo: React.FC<ExploreLogoProps> = ({ metadata, listing }) => {
  const [failed, setFailed] = useState(false);
  const src = metadata?.faviconUrl || getFallbackFavicon(listing.url);
  const label = metadata?.title || getFallbackTitle(listing.url);

  return (
    <div className="w-9 h-9 rounded-lg border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 bg-zinc-950 dark:bg-zinc-950 light:bg-white flex items-center justify-center shrink-0 overflow-hidden">
      {!failed ? (
        <img
          src={src}
          alt=""
          className="w-5 h-5 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-extrabold text-emerald-400 light:text-emerald-700">
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
  const name = metadata?.title || getFallbackTitle(listing.url);
  const description = listing.description || metadata?.description || `${getHostname(listing.url)} resource for ${listing.category.toLowerCase()}.`;
  const tags = listing.tags || [];

  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_minmax(0,1.25fr)_auto_auto] gap-3 sm:gap-4 items-center rounded-xl border border-white/[0.07] dark:border-white/[0.07] light:border-zinc-200 bg-zinc-900/42 dark:bg-zinc-900/42 light:bg-white hover:bg-zinc-900/70 dark:hover:bg-zinc-900/70 light:hover:bg-zinc-50 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 light:hover:border-emerald-400/60 px-3 py-2.5 transition-colors shadow-sm"
    >
      <ExploreLogo metadata={metadata} listing={listing} />

      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-zinc-950 truncate">
            {name}
          </h2>
          <span className="hidden sm:inline text-[11px] text-zinc-500 dark:text-zinc-500 light:text-zinc-500 truncate">
            {metadata?.domain || getHostname(listing.url)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="col-start-2 sm:col-start-auto flex flex-wrap items-center gap-1.5 min-w-0">
        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 border border-emerald-500/20 text-[10px] font-bold">
          {listing.category}
        </span>
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-md bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-100 border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="col-span-2 sm:col-span-1 justify-self-stretch sm:justify-self-end">
        <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold transition-colors">
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
  const [metadataByUrl, setMetadataByUrl] = useState<Record<string, ExploreMetadata>>({});

  useEffect(() => {
    setActiveCategory('All');
  }, [directory.slug]);

  useEffect(() => {
    let cancelled = false;
    const missingListings = directory.listings.filter((listing) => !metadataByUrl[listing.url]);

    missingListings.forEach((listing) => {
      api.getExploreMetadata(listing.url)
        .then((metadata) => {
          if (cancelled) return;
          setMetadataByUrl((prev) => ({
            ...prev,
            [listing.url]: metadata,
          }));
        })
        .catch(() => {
          if (cancelled) return;
          setMetadataByUrl((prev) => ({
            ...prev,
            [listing.url]: {
              title: getFallbackTitle(listing.url),
              domain: getHostname(listing.url),
              faviconUrl: getFallbackFavicon(listing.url),
            },
          }));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [directory.listings, directory.slug, metadataByUrl]);

  const filteredListings = useMemo(() => {
    if (activeCategory === 'All') return directory.listings;
    return directory.listings.filter((listing) => listing.category === activeCategory);
  }, [activeCategory, directory.listings]);

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Explore</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-950 tracking-tight">
          {directory.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed">
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
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                  : 'bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-white border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:border-emerald-500/30'
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
              metadata={metadataByUrl[listing.url]}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white">
          <Search className="w-5 h-5 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-white dark:text-white light:text-zinc-950">No listings in this category yet</p>
        </div>
      )}
    </main>
  );
};
