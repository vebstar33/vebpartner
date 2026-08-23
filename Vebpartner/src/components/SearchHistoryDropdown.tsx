import React from 'react';
import { History, X, Trash2, ArrowUpRight } from 'lucide-react';

interface SearchHistoryDropdownProps {
  history: string[];
  onSelectSearch: (query: string) => void;
  onRemoveSearch: (query: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  activeIndex: number;
}

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  history,
  onSelectSearch,
  onRemoveSearch,
  onClearHistory,
  isOpen,
  activeIndex,
}) => {
  if (!isOpen) return null;

  const popularSearches = ['CRM', 'Reseller', 'Automation', 'E-commerce', 'Marketing', 'Creator'];

  return (
    <div
      id="search-history-menu"
      role="listbox"
      aria-label="Recent searches"
      className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl border shadow-2xl z-50 overflow-hidden text-xs animate-in fade-in slide-in-from-top-1 duration-150 bg-[#11131a] dark:bg-[#11131a] light:bg-white border-zinc-700/80 dark:border-white/[0.1] light:border-zinc-200 text-zinc-200 light:text-zinc-800"
    >
      {history.length > 0 ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 dark:border-white/[0.06] light:border-zinc-100 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-zinc-50">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-500">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recent Searches</span>
            </span>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onClearHistory();
              }}
              className="text-[11px] text-zinc-400 light:text-zinc-500 hover:text-rose-400 dark:hover:text-rose-400 light:hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          </div>

          {/* List items */}
          <div className="max-h-60 overflow-y-auto py-1">
            {history.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <div
                  key={item}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectSearch(item);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:bg-emerald-50 light:text-emerald-800'
                      : 'hover:bg-zinc-800/70 dark:hover:bg-zinc-800/70 light:hover:bg-zinc-100 text-zinc-300 dark:text-zinc-300 light:text-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <History className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500 light:text-zinc-400 shrink-0" />
                    <span className="truncate font-medium">{item}</span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item} from search history`}
                    title="Remove from history"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveSearch(item, e);
                    }}
                    className="p-1 rounded-md text-zinc-500 hover:text-rose-400 dark:hover:text-rose-400 light:hover:text-rose-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 transition-colors shrink-0 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty History - Show Quick Suggestions */
        <div className="p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-500 mb-2">
            Popular searches
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectSearch(term);
                }}
                className="px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:border-emerald-500/40"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
