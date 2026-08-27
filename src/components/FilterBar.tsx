import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  Shield,
  DollarSign,
  Filter,
  ChevronDown,
  Code2,
  Briefcase,
  Layers,
  FolderTree,
  Check,
} from 'lucide-react';
import { Category, ViewMode, SortOption, ListingType } from '../types';
import {
  CATEGORY_GROUPS,
  getGroupedCategories,
  findGroupForCategory,
} from '../lib/categoryGroups';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import { LISTING_TYPE_FILTERS } from '../lib/listingTypePresentation';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedListingType: 'all' | ListingType;
  onSelectListingType: (listingType: 'all' | ListingType) => void;
  selectedProprietary?: string;
  onClearProprietary?: () => void;
  selectedPricing: string;
  onSelectPricing: (pricing: string) => void;
  selectedLicense: string;
  onSelectLicense: (license: string) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  totalMatches: number;
  categoryCounts?: Record<string, number>;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedListingType,
  onSelectListingType,
  selectedProprietary,
  onClearProprietary,
  selectedPricing,
  onSelectPricing,
  selectedLicense,
  onSelectLicense,
  sortBy,
  onSelectSort,
  viewMode,
  onSelectViewMode,
  totalMatches,
  categoryCounts = {},
  searchInputRef,
}) => {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  // Search History State
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync active group when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setActiveGroup('all');
    } else {
      const grp = findGroupForCategory(selectedCategory);
      if (grp) {
        setActiveGroup(grp);
      }
    }
  }, [selectedCategory]);

  // Click outside to close group dropdown and search history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target as Node)
      ) {
        setShowGroupSelector(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchHistoryOpen(false);
        setActiveHistoryIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupedCategories = getGroupedCategories(categories);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedListingType !== 'all' ? 1 : 0) +
    (selectedProprietary ? 1 : 0) +
    (selectedPricing !== 'all' ? 1 : 0) +
    (selectedLicense !== 'all' ? 1 : 0);

  const handleResetAll = () => {
    onSearchChange('');
    onSelectCategory('all');
    onSelectListingType('all');
    setActiveGroup('all');
    onClearProprietary?.();
    onSelectPricing('all');
    onSelectLicense('all');
  };

  // Get current subcategories to display in pills
  const currentGroupObj = groupedCategories.find((g) => g.id === activeGroup);
  const currentSubCategories =
    activeGroup === 'all'
      ? categories.filter((c) => c.id !== 'all').slice(0, 8) // Show top curated when "all" is active
      : currentGroupObj?.items || [];

  // Group total counts
  const getGroupTotalCount = (grpId: string) => {
    const grp = groupedCategories.find((g) => g.id === grpId);
    if (!grp) return 0;
    return grp.items.reduce((acc, cat) => acc + (categoryCounts[cat.id] ?? cat.count ?? 0), 0);
  };

  const totalAllCount =
    categoryCounts['all'] ?? categories.find((category) => category.id === 'all')?.count ?? totalMatches;

  // Search Input Keydown (handling history list and submission)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!isSearchHistoryOpen) {
        setIsSearchHistoryOpen(true);
        setActiveHistoryIndex(0);
      } else if (history.length > 0) {
        e.preventDefault();
        setActiveHistoryIndex((prev) => (prev + 1) % history.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (isSearchHistoryOpen && history.length > 0) {
        e.preventDefault();
        setActiveHistoryIndex((prev) => (prev <= 0 ? history.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      if (isSearchHistoryOpen && activeHistoryIndex >= 0 && history[activeHistoryIndex]) {
        e.preventDefault();
        const selected = history[activeHistoryIndex];
        onSearchChange(selected);
        addSearch(selected);
        setIsSearchHistoryOpen(false);
        setActiveHistoryIndex(-1);
      } else if (searchQuery.trim()) {
        addSearch(searchQuery.trim());
        setIsSearchHistoryOpen(false);
        setActiveHistoryIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsSearchHistoryOpen(false);
      setActiveHistoryIndex(-1);
    }
  };

  const handleSelectHistoryItem = (term: string) => {
    onSearchChange(term);
    addSearch(term);
    setIsSearchHistoryOpen(false);
    setActiveHistoryIndex(-1);
  };

  return (
    <div id="category-filter-bar" className="space-y-3.5 pt-2">
      {/* 1. Top High-Level Group Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e1017] dark:bg-[#0e1017] light:bg-white border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 shadow-inner light:shadow-sm">
          {/* "All" Group Tab */}
          <button
            onClick={() => {
              setActiveGroup('all');
              onSelectCategory('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeGroup === 'all' && selectedCategory === 'all'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm font-bold'
                : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Businesses</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeGroup === 'all' && selectedCategory === 'all'
                  ? 'bg-zinc-950/30 text-zinc-950 font-bold'
                  : 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700'
              }`}
            >
              {totalAllCount}
            </span>
          </button>

          {/* Individual Group Tabs */}
          {groupedCategories.map((group) => {
            const isGroupActive = activeGroup === group.id;
            const GroupIcon =
              group.id === 'ai-businesses'
                ? Code2
                : group.id === 'agencies-services'
                ? Briefcase
                : LayoutGrid;
            const groupCount = getGroupTotalCount(group.id);

            return (
              <button
                key={group.id}
                onClick={() => {
                  setActiveGroup(group.id);
                  onSelectCategory(group.items[0]?.id || 'all');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isGroupActive
                    ? 'bg-zinc-100 dark:bg-zinc-100 light:bg-zinc-900 text-zinc-950 dark:text-zinc-950 light:text-white shadow-sm font-bold'
                    : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100'
                }`}
              >
                <GroupIcon className="w-3.5 h-3.5" />
                <span>{group.shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isGroupActive
                      ? 'bg-zinc-300 dark:bg-zinc-300 light:bg-zinc-800 text-zinc-900 dark:text-zinc-900 light:text-white font-bold'
                      : 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700'
                  }`}
                >
                  {groupCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grouped Category Dropdown Picker */}
        <div className="relative shrink-0" ref={groupDropdownRef}>
          <button
            onClick={() => setShowGroupSelector(!showGroupSelector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showGroupSelector || selectedCategory !== 'all'
                ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 border-zinc-600 dark:border-zinc-600 light:border-zinc-300 text-white dark:text-white light:text-zinc-900 shadow-sm'
                : 'bg-[#0e1017] dark:bg-[#0e1017] light:bg-white border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:border-zinc-700'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Browse Groups</span>
            <span className="sm:hidden">Groups</span>
            <ChevronDown
              className={`w-3 h-3 text-zinc-400 transition-transform ${
                showGroupSelector ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Grouped Modal/Dropdown list */}
          {showGroupSelector && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e1017] dark:bg-[#0e1017] light:bg-white border border-white/[0.1] dark:border-white/[0.1] light:border-zinc-200 shadow-2xl p-3 z-50 animate-in fade-in duration-150 space-y-3 text-xs max-h-[420px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200">
                <span className="font-bold text-white dark:text-white light:text-zinc-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Grouped Category Directory</span>
                </span>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setShowGroupSelector(false);
                  }}
                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-3">
                {groupedCategories.map((grp) => (
                  <div key={grp.id} className="space-y-1">
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider px-1">
                      {grp.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {grp.items.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        const count = categoryCounts[cat.id] ?? cat.count;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              onSelectCategory(cat.id);
                              setShowGroupSelector(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                                : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950'
                            }`}
                          >
                            <span className="truncate">{cat.name}</span>
                            {typeof count === 'number' && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-1 shrink-0 ${
                                  isSelected
                                    ? 'bg-zinc-950/20 text-zinc-950 font-bold'
                                    : 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700'
                                }`}
                              >
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Sub-Category Pills for the Active Group */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar py-0.5">
        {activeGroup !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border shrink-0 active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-zinc-100 dark:bg-zinc-100 light:bg-zinc-900 text-zinc-950 dark:text-zinc-950 light:text-white border-zinc-100 dark:border-zinc-100 light:border-zinc-900 font-bold shadow-sm'
                : 'bg-[#111111] dark:bg-[#111111] light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900 border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200'
            }`}
          >
            <span>All in {currentGroupObj?.shortName || 'Group'}</span>
          </button>
        )}

        {currentSubCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? cat.count;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border shrink-0 active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-bold shadow-sm'
                  : 'bg-[#111111] dark:bg-[#111111] light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900 border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200'
              }`}
            >
              <span>{cat.name}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-zinc-950/20 text-zinc-950 font-bold'
                      : 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prototype Listing Type Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar py-0.5">
        {LISTING_TYPE_FILTERS.map((filter) => {
          const isSelected = selectedListingType === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onSelectListingType(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-zinc-100 dark:bg-zinc-100 light:bg-zinc-900 text-zinc-950 dark:text-zinc-950 light:text-white border-zinc-100 dark:border-zinc-100 light:border-zinc-900 font-bold shadow-sm'
                  : 'bg-[#111111] dark:bg-[#111111] light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900 border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* 3. Main Search, Filter Toggle, Order By, View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1">
        {/* Search Input Box with Search History Dropdown */}
        <div className="relative flex-1 max-w-md" ref={searchContainerRef}>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-500 light:text-zinc-400 z-10">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            role="combobox"
            aria-expanded={isSearchHistoryOpen}
            aria-autocomplete="list"
            aria-controls="search-history-menu"
            placeholder="Search businesses, providers, categories... (⌘K)"
            value={searchQuery}
            onFocus={() => setIsSearchHistoryOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (!isSearchHistoryOpen) setIsSearchHistoryOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-zinc-200 dark:text-zinc-200 light:text-zinc-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                searchInputRef?.current?.focus();
              }}
              aria-label="Clear search text"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-zinc-800 z-10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search History Dropdown Menu */}
          <SearchHistoryDropdown
            history={history}
            onSelectSearch={handleSelectHistoryItem}
            onRemoveSearch={removeSearch}
            onClearHistory={clearHistory}
            isOpen={isSearchHistoryOpen}
            activeIndex={activeHistoryIndex}
          />
        </div>

        {/* Right Controls: Advanced Filters, Order By, View Mode */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              showFilterDrawer || activeFiltersCount > 0
                ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-900 border-zinc-700 dark:border-zinc-700 light:border-zinc-900 text-white shadow-sm'
                : 'bg-[#111111] dark:bg-[#111111] light:bg-white border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:border-zinc-700 light:hover:border-zinc-400 hover:text-white dark:hover:text-white light:hover:text-zinc-950'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 light:text-zinc-500" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Order By Selector */}
          <div className="flex items-center gap-1.5 bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-700 shadow-sm">
            <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400 hidden sm:inline">Order by</span>
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              className="bg-transparent text-zinc-200 dark:text-zinc-200 light:text-zinc-900 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="stars" className="bg-[#141414] dark:bg-[#141414] light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900">
                Most Stars
              </option>
              <option value="newest" className="bg-[#141414] dark:bg-[#141414] light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900">
                Last commit
              </option>
              <option value="upvotes" className="bg-[#141414] dark:bg-[#141414] light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900">
                Most Upvoted
              </option>
              <option value="name" className="bg-[#141414] dark:bg-[#141414] light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900">
                Alphabetical (A - Z)
              </option>
            </select>
          </div>

          {/* View Mode Toggle (Grid vs Compact) */}
          <div className="flex items-center bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => onSelectViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-white dark:text-white light:text-zinc-950 font-bold'
                  : 'text-zinc-500 dark:text-zinc-500 light:text-zinc-400 hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-zinc-800'
              }`}
              title="Grid View"
              aria-label="Switch to Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectViewMode('compact')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-white dark:text-white light:text-zinc-950 font-bold'
                  : 'text-zinc-500 dark:text-zinc-500 light:text-zinc-400 hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-zinc-800'
              }`}
              title="Compact View"
              aria-label="Switch to Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {showFilterDrawer && (
        <div className="p-4 rounded-2xl bg-[#111111] dark:bg-[#111111] light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in duration-150">
          <div>
            <label className="block text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mb-1.5">Pricing Model</label>
            <select
              value={selectedPricing}
              onChange={(e) => onSelectPricing(e.target.value)}
              className="w-full bg-[#181818] dark:bg-[#181818] light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-zinc-200 dark:text-zinc-200 light:text-zinc-900 focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All Models</option>
              <option value="100% Free Open Source">100% Free Open Source</option>
              <option value="Open Core / Freemium Cloud">Open Core / Freemium</option>
              <option value="Self-Hosted Free">Self-Hosted Free</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mb-1.5">Open Source License</label>
            <select
              value={selectedLicense}
              onChange={(e) => onSelectLicense(e.target.value)}
              className="w-full bg-[#181818] dark:bg-[#181818] light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-zinc-200 dark:text-zinc-200 light:text-zinc-900 focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All Licenses</option>
              <option value="AGPL-3.0">AGPL-3.0</option>
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="MPL-2.0">MPL-2.0</option>
              <option value="GPL-3.0">GPL-3.0</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetAll}
              className="w-full py-2 rounded-xl bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:text-white dark:hover:text-white light:hover:text-zinc-950 font-medium transition-colors cursor-pointer border border-transparent light:border-zinc-300"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {(activeFiltersCount > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-500 font-medium">Active:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 dark:bg-zinc-850 light:bg-zinc-100 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800">
              Search: "{searchQuery}"
              <button onClick={() => onSearchChange('')} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 font-medium">
              Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              <button onClick={() => onSelectCategory('all')} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedListingType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 dark:bg-zinc-850 light:bg-zinc-100 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 font-medium">
              Type: {LISTING_TYPE_FILTERS.find((filter) => filter.id === selectedListingType)?.label || selectedListingType}
              <button onClick={() => onSelectListingType('all')} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedProprietary && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 dark:bg-zinc-850 light:bg-zinc-100 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 font-medium">
              Alternative to: {selectedProprietary}
              <button onClick={onClearProprietary} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPricing !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 dark:bg-zinc-850 light:bg-zinc-100 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800">
              Pricing: {selectedPricing}
              <button onClick={() => onSelectPricing('all')} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLicense !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 dark:bg-zinc-850 light:bg-zinc-100 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800">
              License: {selectedLicense}
              <button onClick={() => onSelectLicense('all')} className="hover:text-rose-400 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetAll}
            className="text-xs text-rose-400 hover:text-rose-300 light:text-rose-600 underline underline-offset-2 ml-1 cursor-pointer font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
