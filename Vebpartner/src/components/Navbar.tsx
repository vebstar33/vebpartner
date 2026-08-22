import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Lock,
  Bookmark,
  Plus,
  ExternalLink,
  ShieldCheck,
  X,
  Megaphone,
  Menu,
  FileText,
  Code2,
  Briefcase,
  LayoutGrid,
  Layers,
  HelpCircle,
  Mail,
  BookOpen,
  Compass,
} from 'lucide-react';
import { VebstarLogo } from './Icons';
import { CustomPage, SiteSettings, Advertisement, Category } from '../types';
import { CATEGORY_GROUPS, getGroupedCategories } from '../lib/categoryGroups';
import { ThemeToggle } from './ThemeToggle';
import { ThemePreference, ResolvedTheme } from '../hooks/useTheme';

interface NavbarProps {
  onOpenSubmit: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  pendingSubmissionsCount: number;
  totalListingsCount: number;
  onFocusSearch: () => void;
  onSelectCategory?: (category: string) => void;
  onNavigateHome: () => void;
  onNavigatePage: (slug: string) => void;
  pages: CustomPage[];
  categories?: Category[];
  categoryCounts?: Record<string, number>;
  siteSettings: SiteSettings;
  topAd?: Advertisement | null;
  onAdClick?: (adId: string) => void;
  theme: ResolvedTheme;
  themePreference: ThemePreference;
  onSelectThemePreference: (pref: ThemePreference) => void;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSubmit,
  onOpenBookmarks,
  bookmarksCount,
  isAdminView,
  onToggleAdminView,
  pendingSubmissionsCount,
  totalListingsCount,
  onFocusSearch,
  onSelectCategory,
  onNavigateHome,
  onNavigatePage,
  pages,
  categories = [],
  categoryCounts = {},
  siteSettings,
  topAd,
  onAdClick,
  theme,
  themePreference,
  onSelectThemePreference,
  onToggleTheme,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'categories' | 'explore' | null>(null);
  const [showTopAd, setShowTopAd] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>('categories');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute grouped categories
  const groupedCategories = getGroupedCategories(categories);

  // Filter published pages for navigation
  const publishedPages = pages.filter((p) => p.published);

  // Group pages into editorial categories
  const platformPages = publishedPages.filter((p) =>
    ['about', 'manifesto', 'vision', 'mission'].some((slug) => p.slug.toLowerCase().includes(slug))
  );
  const resourcePages = publishedPages.filter((p) =>
    ['blog', 'faq', 'guide', 'docs', 'help'].some((slug) => p.slug.toLowerCase().includes(slug))
  );
  const partnerPages = publishedPages.filter((p) =>
    ['advertise', 'sponsor', 'contact', 'terms', 'privacy'].some((slug) =>
      p.slug.toLowerCase().includes(slug)
    )
  );
  const otherCustomPages = publishedPages.filter(
    (p) =>
      !platformPages.includes(p) &&
      !resourcePages.includes(p) &&
      !partnerPages.includes(p)
  );

  const handleCategoryClick = (catId: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onSelectCategory?.(catId);
    onNavigateHome();
  };

  const handlePageClick = (slug: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onNavigatePage(slug);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090E]/95 dark:bg-[#08090E]/95 light:bg-white/95 backdrop-blur-md border-b border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 transition-colors duration-200">
      {/* Top Announcement Bar (Configurable in Admin) */}
      {siteSettings.announcementEnabled && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-emerald-900/60 via-emerald-600/30 to-cyan-900/60 dark:from-emerald-900/60 dark:via-emerald-600/30 dark:to-cyan-900/60 light:from-emerald-50 light:via-teal-100/70 light:to-cyan-50 border-b border-emerald-500/20 px-4 py-1.5 text-center text-xs text-emerald-200 dark:text-emerald-200 light:text-emerald-900 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{siteSettings.announcementText}</span>
            {siteSettings.announcementUrl && (
              <a
                href={siteSettings.announcementUrl}
                className="underline hover:text-white dark:hover:text-white light:hover:text-emerald-950 font-bold ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={dropdownRef}>
        <div className="flex items-center justify-between h-16">
          {/* Left Brand Logo & Grouped Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-white dark:text-white light:text-zinc-900 hover:opacity-90 transition-opacity group cursor-pointer text-left"
            >
              <div className="text-white dark:text-white light:text-zinc-900 group-hover:scale-105 transition-transform duration-200">
                <VebstarLogo className="w-6 h-6 text-emerald-400 dark:text-white light:text-emerald-600" />
              </div>
              <span className="font-extrabold text-white dark:text-white light:text-zinc-950 tracking-tight text-[18px] leading-tight">
                {siteSettings.siteName || 'Vebstar'}
              </span>
            </button>

            {/* Desktop Navigation - Grouped Menus */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
              {/* 1. Direct Directory / Alternatives Link */}
              <button
                onClick={() => {
                  onSelectCategory?.('all');
                  onNavigateHome();
                }}
                className="px-3 py-1.5 rounded-lg hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100 transition-colors cursor-pointer font-medium"
              >
                Alternatives
              </button>

              {/* 2. Grouped Categories Mega Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'categories' ? null : 'categories')
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeDropdown === 'categories'
                      ? 'text-white dark:text-white light:text-zinc-950 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-zinc-100 shadow-sm font-semibold'
                      : 'hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
                      activeDropdown === 'categories' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Grouped Mega Menu Dropdown Box */}
                {activeDropdown === 'categories' && (
                  <div className="absolute left-0 mt-2 w-[720px] rounded-2xl bg-[#0c0e16] dark:bg-[#0c0e16] light:bg-white border border-white/[0.1] dark:border-white/[0.1] light:border-zinc-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-3 gap-4 pb-3">
                      {groupedCategories.map((group) => {
                        const GroupIcon =
                          group.id === 'ai-businesses'
                            ? Code2
                            : group.id === 'agencies-services'
                            ? Briefcase
                            : LayoutGrid;

                        return (
                          <div key={group.id} className="space-y-2">
                            {/* Group Header */}
                            <div className="flex items-center gap-2 pb-1.5 border-b border-white/[0.06] dark:border-white/[0.06] light:border-zinc-100">
                              <div className="p-1 rounded-md bg-zinc-800 text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                                <GroupIcon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white dark:text-white light:text-zinc-900 text-xs leading-none">
                                  {group.name}
                                </h4>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 line-clamp-1 mt-0.5">
                                  {group.shortName}
                                </p>
                              </div>
                            </div>

                            {/* Group Items */}
                            <div className="space-y-1">
                              {group.items.map((cat) => {
                                const count = categoryCounts[cat.id] ?? cat.count;
                                return (
                                  <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-850/80 dark:hover:bg-zinc-850/80 light:hover:bg-zinc-100 transition-colors text-xs group cursor-pointer"
                                  >
                                    <span className="truncate group-hover:translate-x-0.5 transition-transform">
                                      {cat.name}
                                    </span>
                                    {typeof count === 'number' && (
                                      <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 font-mono px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200 shrink-0 ml-1">
                                        {count}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mega Menu Footer Actions */}
                    <div className="pt-3 border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleCategoryClick('all')}
                        className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 hover:underline font-semibold cursor-pointer"
                      >
                        Browse All {totalListingsCount || ''} Businesses &rarr;
                      </button>
                      <span className="text-zinc-400 dark:text-zinc-400 light:text-zinc-500 text-[11px]">
                        {categories.length - 1} business categories
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Grouped Explore & Pages Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeDropdown === 'explore'
                      ? 'text-white dark:text-white light:text-zinc-950 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-zinc-100 shadow-sm font-semibold'
                      : 'hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                  <span>Explore</span>
                  <ChevronDown
                    className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
                      activeDropdown === 'explore' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Grouped Explore Dropdown Box */}
                {activeDropdown === 'explore' && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#0c0e16] dark:bg-[#0c0e16] light:bg-white border border-white/[0.1] dark:border-white/[0.1] light:border-zinc-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3 text-xs">
                    {/* Section: Platform & Mission */}
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider px-2.5 pb-1">
                        Platform & Mission
                      </div>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => handlePageClick('about')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
                          <div>
                            <div className="font-semibold">About Vebstar</div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Our open-source catalog</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePageClick('manifesto')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 light:text-cyan-600" />
                          <div>
                            <div className="font-semibold">Open-Source Manifesto</div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Freedom from vendor lock-in</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Section: Content & Help */}
                    <div className="pt-2 border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-100">
                      <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider px-2.5 pb-1">
                        Resources & Editorial
                      </div>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => handlePageClick('blog')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400 light:text-purple-600" />
                          <div>
                            <div className="font-semibold">Blog & Comparisons</div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Migration guides & deep dives</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePageClick('faq')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 light:text-amber-600" />
                          <div>
                            <div className="font-semibold">FAQ & Self-Hosting</div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Answers to common questions</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Section: Community & Sponsors */}
                    <div className="pt-2 border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-100">
                      <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider px-2.5 pb-1">
                        Partnerships & Contact
                      </div>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => handlePageClick('advertise')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center justify-between text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Megaphone className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
                            <span className="font-semibold">Advertise with Us</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            Sponsor
                          </span>
                        </button>
                        <button
                          onClick={() => handlePageClick('contact')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-400 light:text-blue-600" />
                          <span className="font-semibold">Contact Team</span>
                        </button>
                      </div>
                    </div>

                    {/* Custom Admin Pages if any exist */}
                    {otherCustomPages.length > 0 && (
                      <div className="pt-2 border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-100">
                        <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider px-2.5 pb-1">
                          More Pages
                        </div>
                        <div className="space-y-0.5">
                          {otherCustomPages.map((page) => (
                            <button
                              key={page.id}
                              onClick={() => handlePageClick(page.slug)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-100 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors text-zinc-300 dark:text-zinc-300 light:text-zinc-700 truncate cursor-pointer"
                            >
                              {page.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle in Navigation Bar */}
            <ThemeToggle
              theme={theme}
              preference={themePreference}
              onSelectPreference={onSelectThemePreference}
              onToggleTheme={onToggleTheme}
            />

            {/* Search Icon button */}
            <button
              onClick={onFocusSearch}
              aria-label="Search directory tools (⌘K)"
              className="p-2 rounded-full text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Search tools (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Bookmarks Counter Button */}
            {bookmarksCount > 0 && (
              <button
                onClick={onOpenBookmarks}
                aria-label={`View ${bookmarksCount} saved bookmarks`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 bg-zinc-900 dark:bg-zinc-900 light:bg-white text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 text-xs font-medium transition-colors cursor-pointer shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{bookmarksCount}</span>
              </button>
            )}

            {/* Submit Tool Button */}
            <button
              onClick={onOpenSubmit}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-white/[0.12] dark:border-white/[0.12] light:border-zinc-300 bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-100 light:text-zinc-900 text-xs font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
              <span>Submit Tool</span>
            </button>

            {/* Exit Admin Button - Only visible when already actively inside Admin View */}
            {isAdminView && (
              <button
                onClick={onToggleAdminView}
                className="px-3.5 py-1.5 rounded-full border border-emerald-500 bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Exit Admin</span>
                {pendingSubmissionsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                    {pendingSubmissionsCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Grouped structure) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 bg-[#0c0e16] dark:bg-[#0c0e16] light:bg-white px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
          {/* Quick Submit & Bookmark on mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSubmit();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Submit a Tool</span>
            </button>

            {bookmarksCount > 0 && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookmarks();
                }}
                className="py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 text-xs font-semibold flex items-center gap-1 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{bookmarksCount}</span>
              </button>
            )}
          </div>

          {/* Group 1: Categories Accordion */}
          <div className="rounded-xl border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-zinc-50 overflow-hidden">
            <button
              onClick={() =>
                setMobileExpandedGroup(mobileExpandedGroup === 'categories' ? null : 'categories')
              }
              className="w-full flex items-center justify-between p-3 text-xs font-bold text-white dark:text-white light:text-zinc-900 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Software Categories</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  mobileExpandedGroup === 'categories' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileExpandedGroup === 'categories' && (
              <div className="p-3 pt-0 space-y-3 text-xs border-t border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200">
                {groupedCategories.map((grp) => (
                  <div key={grp.id} className="space-y-1 pt-2">
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
                      {grp.name}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {grp.items.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 cursor-pointer"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 font-mono">
                            {categoryCounts[cat.id] ?? cat.count ?? 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group 2: Explore & Editorial Pages Accordion */}
          <div className="rounded-xl border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-zinc-50 overflow-hidden">
            <button
              onClick={() =>
                setMobileExpandedGroup(mobileExpandedGroup === 'pages' ? null : 'pages')
              }
              className="w-full flex items-center justify-between p-3 text-xs font-bold text-white dark:text-white light:text-zinc-900 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-400 dark:text-zinc-400 light:text-zinc-500" />
                <span>Explore & Editorial</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  mobileExpandedGroup === 'pages' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileExpandedGroup === 'pages' && (
              <div className="p-3 pt-0 space-y-1.5 text-xs border-t border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200">
                <button
                  onClick={() => handlePageClick('about')}
                  className="w-full text-left py-1.5 px-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 cursor-pointer"
                >
                  About Vebstar
                </button>
                <button
                  onClick={() => handlePageClick('manifesto')}
                  className="w-full text-left py-1.5 px-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 cursor-pointer"
                >
                  Open-Source Manifesto
                </button>
                <button
                  onClick={() => handlePageClick('blog')}
                  className="w-full text-left py-1.5 px-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 cursor-pointer"
                >
                  Blog & Comparisons
                </button>
                <button
                  onClick={() => handlePageClick('faq')}
                  className="w-full text-left py-1.5 px-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 cursor-pointer"
                >
                  FAQ & Self-Hosting
                </button>
                <button
                  onClick={() => handlePageClick('advertise')}
                  className="w-full text-left py-1.5 px-2 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-semibold cursor-pointer"
                >
                  Advertise / Sponsor
                </button>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="w-full text-left py-1.5 px-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-zinc-950 cursor-pointer"
                >
                  Contact Team
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Banner Advertisement (Managed via Admin) */}
      {topAd && showTopAd && (
        <div className="border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 bg-[#0c0e15] dark:bg-[#0c0e15] light:bg-zinc-50 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 border border-emerald-500/30">
                {topAd.badgeText || 'Ad'}
              </span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="font-bold text-white dark:text-white light:text-zinc-900">{topAd.sponsorName}</span>
                <span className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600">– {topAd.description || topAd.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={topAd.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onAdClick?.(topAd.id)}
                className="px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{topAd.ctaText || 'Learn More'}</span>
                <ExternalLink className="w-3 h-3 text-emerald-400 light:text-emerald-600" />
              </a>
              <button
                onClick={() => setShowTopAd(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-zinc-800 transition-colors cursor-pointer"
                title="Dismiss ad"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
