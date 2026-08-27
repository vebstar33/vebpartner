import React from 'react';
import { X } from 'lucide-react';
import { ToolListing } from '../types';
import { ToolPage } from './ToolPage';

interface ToolDetailModalProps {
  listing: ToolListing | null;
  allListings?: ToolListing[];
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onUpvote: (id: string, e?: React.MouseEvent) => void;
  hasUpvoted: boolean;
  isAdminMode: boolean;
  onOpenAdminEdit?: (listing: ToolListing) => void;
  onSelectListing?: (listing: ToolListing) => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  listing,
  allListings = [],
  onClose,
  isBookmarked,
  onToggleBookmark,
  onUpvote,
  hasUpvoted,
  onSelectListing,
}) => {
  if (!listing) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full min-h-screen bg-vp-bg text-vp-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating close button */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-md bg-vp-surface-subtle/90 border border-vp-strong text-[11px] font-mono text-vp-muted">
            Esc to close
          </span>
          <button
            onClick={onClose}
            aria-label="Close view (Esc)"
            className="p-2.5 rounded-full bg-vp-surface-subtle/90 border border-vp-strong text-vp-secondary hover:text-vp-primary hover:bg-vp-surface-hover transition-all shadow-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Render identical Tool Page */}
        <ToolPage
          listing={listing}
          allListings={allListings}
          onBackToDirectory={onClose}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onUpvote={onUpvote}
          hasUpvoted={hasUpvoted}
          onSelectListing={(tool) => onSelectListing?.(tool)}
        />
      </div>
    </div>
  );
};
