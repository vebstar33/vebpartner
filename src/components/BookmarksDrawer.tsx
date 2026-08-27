import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Github, ExternalLink, Star } from 'lucide-react';
import { ToolListing } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedListings: ToolListing[];
  onSelectListing: (listing: ToolListing) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedListings,
  onSelectListing,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-vp-surface-raised border-l border-vp h-full flex flex-col shadow-2xl shadow-black animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-vp-subtle flex items-center justify-between bg-vp-bg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-vp-warning/10 border border-vp-warning/25 flex items-center justify-center text-vp-warning">
              <Bookmark className="w-4 h-4 fill-vp-warning" />
            </div>
            <div>
              <h3 className="font-bold text-vp-primary text-base">Saved Tools</h3>
              <p className="text-xs text-vp-muted">{bookmarkedListings.length} items bookmarked</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedListings.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-vp-error hover:text-vp-error font-medium px-2.5 py-1 rounded-lg bg-vp-error/10 border border-vp-error/25 hover:bg-vp-error/15 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-vp-surface-subtle hover:bg-vp-surface-hover text-vp-muted hover:text-vp-primary border border-vp-subtle transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          {bookmarkedListings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vp-surface-subtle/80 border border-vp-subtle flex items-center justify-center mx-auto text-zinc-600">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-vp-secondary">No saved tools yet</p>
              <p className="text-xs text-vp-faint max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any business listing card to pin it here for easy reference.
              </p>
            </div>
          ) : (
            bookmarkedListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => {
                  onClose();
                  onSelectListing(listing);
                }}
                className="group p-3.5 rounded-2xl bg-vp-bg/80 hover:bg-vp-surface-subtle/90 border border-vp-subtle hover:border-white/[0.14] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-vp-primary text-sm group-hover:text-vp-brand transition-colors truncate">
                      {listing.name}
                    </h4>
                    {listing.replaces?.length > 0 && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40 truncate">
                        vs {listing.replaces[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-vp-muted line-clamp-1 mt-0.5">{listing.tagline}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(listing.id);
                    }}
                    className="p-1.5 rounded-xl text-vp-faint hover:text-vp-error hover:bg-vp-surface-hover transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-vp-faint group-hover:text-vp-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-vp-subtle bg-vp-bg text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-vp-surface-hover hover:bg-vp-surface-hover text-vp-primary font-medium text-xs transition-colors"
          >
            Close Saved Panel
          </button>
        </div>
      </div>
    </div>
  );
};
