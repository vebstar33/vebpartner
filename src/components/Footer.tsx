import React, { useState } from 'react';
import {
  VebpartnerLogo,
  XTwitterIcon,
  RssIcon,
} from './Icons';
import { CustomPage, ListingType, SiteSettings } from '../types';

interface FooterProps {
  onSelectProprietary?: (prop: string) => void;
  onSelectCategory?: (catId: string) => void;
  onSelectListingType?: (listingType: 'all' | ListingType) => void;
  onOpenSubmit?: () => void;
  onNavigateHome: () => void;
  onNavigatePage: (slug: string) => void;
  pages: CustomPage[];
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectProprietary,
  onSelectCategory,
  onSelectListingType,
  onOpenSubmit,
  onNavigateHome,
  onNavigatePage,
  pages,
  siteSettings,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const POPULAR_BUSINESS_MODELS = [
    [
      { name: 'Firebase', count: 18 },
      { name: 'Notion', count: 24 },
      { name: 'Google Analytics', count: 15 },
      { name: 'Slack', count: 12 },
    ],
    [
      { name: 'Airtable', count: 14 },
      { name: 'Zapier', count: 16 },
      { name: 'Calendly', count: 9 },
      { name: 'Typeform', count: 11 },
    ],
    [
      { name: 'Linear', count: 8 },
      { name: 'Postman', count: 7 },
      { name: 'Figma', count: 6 },
      { name: 'Shopify', count: 9 },
    ],
    [
      { name: 'Twilio', count: 8 },
      { name: 'Mailchimp', count: 10 },
      { name: 'Intercom', count: 7 },
      { name: '1Password', count: 5 },
    ],
  ];

  const POPULAR_CATEGORIES = [
    [
      { name: 'Agencies & Services', id: 'agencies-services', count: 16 },
      { name: 'AI Businesses', id: 'ai-businesses', count: 5 },
      { name: 'E-commerce', id: 'e-commerce', count: 5 },
    ],
    [
      { name: 'Creator Businesses', id: 'creator-businesses', count: 7 },
      { name: 'Reseller Businesses', id: 'reseller-businesses', count: 3 },
      { name: 'Automation & No-Code', id: 'automation-no-code', count: 7 },
    ],
    [
      { name: 'Marketing & Growth', id: 'marketing-growth', count: 9 },
      { name: 'Content & Media', id: 'content-media', count: 8 },
      { name: 'All Businesses', id: 'all', count: 36 },
    ],
  ];

  const goToDirectory = (listingType: 'all' | ListingType) => {
    onSelectCategory?.('all');
    onSelectListingType?.(listingType);
    onNavigateHome();
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Vebpartner',
      links: [
        { label: 'About Vebpartner', onClick: () => onNavigatePage('about') },
        { label: 'Contact', onClick: () => onNavigatePage('contact') },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'All Businesses', onClick: () => goToDirectory('all') },
        { label: 'Business Opportunities', onClick: () => goToDirectory('opportunity') },
        { label: 'Business Platforms', onClick: () => goToDirectory('platform') },
        { label: 'Business Tools', onClick: () => goToDirectory('tool') },
      ],
    },
    {
      title: 'For Businesses',
      links: [
        { label: 'Advertise / Sponsor', onClick: () => onNavigatePage('advertise'), emphasis: true },
        { label: 'Submit an Opportunity', onClick: () => onNavigatePage('submit-opportunity') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', onClick: () => onNavigatePage('privacy') },
        { label: 'Terms of Service', onClick: () => onNavigatePage('terms') },
      ],
    },
  ];

  return (
    <footer className="w-full bg-vp-bg dark:bg-vp-bg light:bg-white border-t border-vp dark:border-vp light:border-zinc-200 mt-20 text-vp-muted dark:text-vp-muted light:text-zinc-600 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Column 1: Brand Info & Newsletter Subscribe */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-vp-primary dark:text-vp-primary light:text-zinc-900 hover:opacity-90 transition-opacity text-left cursor-pointer"
            >
              <div className="text-vp-primary dark:text-vp-primary light:text-zinc-900">
                <VebpartnerLogo className="w-6 h-6 text-vp-brand light:text-emerald-600" />
              </div>
              <span className="font-extrabold text-vp-primary dark:text-vp-primary light:text-vp-inverse tracking-tight text-lg">
                {siteSettings.siteName || 'Vebpartner'}
              </span>
            </button>

            <p className="text-xs text-vp-muted dark:text-vp-muted light:text-zinc-600 leading-relaxed max-w-sm">
              {siteSettings.tagline || 'Discover business opportunities, reseller programs, white-label platforms and business tools you can actually start.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-50 border border-vp dark:border-vp light:border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-vp-secondary dark:text-vp-secondary light:text-zinc-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-vp-brand hover:bg-vp-brand-hover text-vp-inverse font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2 text-vp-muted dark:text-vp-muted light:text-zinc-600">
              {siteSettings.twitterUrl && (
                <a
                  href={siteSettings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp-subtle dark:border-vp-subtle light:border-zinc-200 hover:bg-vp-surface-hover dark:hover:bg-vp-surface-hover light:hover:bg-zinc-200 hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse transition-colors"
                  title="X (Twitter)"
                >
                  <XTwitterIcon className="w-4 h-4" />
                </a>
              )}
              {siteSettings.githubUrl && (
                <a
                  href={siteSettings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp-subtle dark:border-vp-subtle light:border-zinc-200 hover:bg-vp-surface-hover dark:hover:bg-vp-surface-hover light:hover:bg-zinc-200 hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse transition-colors"
                  title="GitHub"
                >
                  <VebpartnerLogo className="w-4 h-4" />
                </a>
              )}
              <a
                href="#rss"
                onClick={(e) => {
                  e.preventDefault();
                  alert('RSS Feed coming soon!');
                }}
                className="p-2 rounded-lg bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-100 border border-vp-subtle dark:border-vp-subtle light:border-zinc-200 hover:bg-vp-surface-hover dark:hover:bg-vp-surface-hover light:hover:bg-zinc-200 hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse transition-colors"
                title="RSS Feed"
              >
                <RssIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular business models */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-vp-primary dark:text-vp-primary light:text-zinc-900 uppercase tracking-wider mb-3">
                Popular Business Models
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_BUSINESS_MODELS.flat().map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onSelectProprietary?.(item.name)}
                    className="flex items-center justify-between p-2 rounded-xl bg-vp-surface-subtle/60 dark:bg-vp-surface-subtle/60 light:bg-zinc-50 hover:bg-vp-surface-hover dark:hover:bg-vp-surface-hover light:hover:bg-zinc-100 border border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200 text-left transition-colors group cursor-pointer"
                  >
                    <span className="truncate text-vp-secondary dark:text-vp-secondary light:text-zinc-800 group-hover:text-vp-primary dark:group-hover:text-vp-primary light:group-hover:text-vp-inverse">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-vp-muted dark:text-vp-muted light:text-vp-faint px-1 rounded bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-200">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Categories */}
            <div>
              <h4 className="text-xs font-bold text-vp-primary dark:text-vp-primary light:text-zinc-900 uppercase tracking-wider mb-3">
                Top Categories
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_CATEGORIES.flat().map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-vp-surface-subtle/60 dark:bg-vp-surface-subtle/60 light:bg-zinc-50 hover:bg-vp-surface-hover dark:hover:bg-vp-surface-hover light:hover:bg-zinc-100 border border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200 text-left transition-colors group cursor-pointer"
                  >
                    <span className="truncate text-vp-secondary dark:text-vp-secondary light:text-zinc-800 group-hover:text-vp-primary dark:group-hover:text-vp-primary light:group-hover:text-vp-inverse">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono text-vp-muted dark:text-vp-muted light:text-vp-faint px-1 rounded bg-vp-surface-subtle dark:bg-vp-surface-subtle light:bg-zinc-200">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="pt-8 border-t border-vp-subtle dark:border-vp-subtle light:border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-bold text-vp-primary dark:text-vp-primary light:text-zinc-900 uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="space-y-2.5">
                {section.links.map((link) => (
                  <button
                    key={link.label}
                    onClick={link.onClick}
                    className={`block text-left transition-colors cursor-pointer ${
                      link.emphasis
                        ? 'text-vp-brand dark:text-vp-brand light:text-emerald-600 font-semibold hover:text-emerald-300 light:hover:text-emerald-700'
                        : 'text-vp-muted dark:text-vp-muted light:text-zinc-600 hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-vp-subtle dark:border-vp-subtle light:border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-vp-muted dark:text-vp-muted light:text-zinc-600">
          <div>
            &copy; 2026 Vebpartner. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => onNavigatePage('privacy')} className="hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse transition-colors cursor-pointer">
              Privacy
            </button>
            <button onClick={() => onNavigatePage('terms')} className="hover:text-vp-primary dark:hover:text-vp-primary light:hover:text-vp-inverse transition-colors cursor-pointer">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
