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
        className="w-full max-w-md bg-[#0D0F17] border-l border-white/[0.08] h-full flex flex-col shadow-2xl shadow-black animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-[#090A10]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Saved Tools</h3>
              <p className="text-xs text-zinc-400">{bookmarkedListings.length} items bookmarked</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedListings.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-900/40 hover:bg-rose-950/80 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          {bookmarkedListings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-600">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">No saved tools yet</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any open source tool card to pin it here for easy reference.
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
                className="group p-3.5 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors truncate">
                      {listing.name}
                    </h4>
                    {listing.replaces?.length > 0 && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40 truncate">
                        vs {listing.replaces[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{listing.tagline}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(listing.id);
                    }}
                    className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#090A10] text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
          >
            Close Saved Panel
          </button>
        </div>
      </div>
    </div>
  );
};
