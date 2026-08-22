import React, { useState } from 'react';
import {
  VebstarLogo,
  XTwitterIcon,
  ThreadsIcon,
  MastodonIcon,
  LinkedInIcon,
  RssIcon,
} from './Icons';
import { Moon, ArrowUpRight, Check, Mail } from 'lucide-react';
import { CustomPage, SiteSettings } from '../types';

interface FooterProps {
  onSelectProprietary?: (prop: string) => void;
  onSelectCategory?: (catId: string) => void;
  onOpenSubmit?: () => void;
  onNavigateHome: () => void;
  onNavigatePage: (slug: string) => void;
  pages: CustomPage[];
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectProprietary,
  onSelectCategory,
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

  const footerPages = pages.filter((p) => p.showInFooter && p.published);

  const POPULAR_PROPRIETARY = [
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

  return (
    <footer className="w-full bg-[#08090E] dark:bg-[#08090E] light:bg-white border-t border-white/[0.08] dark:border-white/[0.08] light:border-zinc-200 mt-20 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Column 1: Brand Info & Newsletter Subscribe */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-white dark:text-white light:text-zinc-900 hover:opacity-90 transition-opacity text-left cursor-pointer"
            >
              <div className="text-white dark:text-white light:text-zinc-900">
                <VebstarLogo className="w-6 h-6 text-emerald-400 light:text-emerald-600" />
              </div>
              <span className="font-extrabold text-white dark:text-white light:text-zinc-950 tracking-tight text-lg">
                {siteSettings.siteName || 'Vebstar'}
              </span>
            </button>

            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed max-w-sm">
              {siteSettings.tagline || 'The modern open source software directory and cloud alternative index.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your developer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-50 border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-200 dark:text-zinc-200 light:text-zinc-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
              {siteSettings.twitterUrl && (
                <a
                  href={siteSettings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors"
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
                  className="p-2 rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors"
                  title="GitHub"
                >
                  <VebstarLogo className="w-4 h-4" />
                </a>
              )}
              <a
                href="#rss"
                onClick={(e) => {
                  e.preventDefault();
                  alert('RSS Feed coming soon!');
                }}
                className="p-2 rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors"
                title="RSS Feed"
              >
                <RssIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Proprietary Software Alternatives */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-white dark:text-white light:text-zinc-900 uppercase tracking-wider mb-3">
                Popular SaaS Alternatives
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_PROPRIETARY.flat().map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onSelectProprietary?.(item.name)}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 border border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200 text-left transition-colors group cursor-pointer"
                  >
                    <span className="truncate text-zinc-300 dark:text-zinc-300 light:text-zinc-800 group-hover:text-white dark:group-hover:text-white light:group-hover:text-zinc-950">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-500 px-1 rounded bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Categories */}
            <div>
              <h4 className="text-xs font-bold text-white dark:text-white light:text-zinc-900 uppercase tracking-wider mb-3">
                Top Categories
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_CATEGORIES.flat().map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 border border-white/[0.04] dark:border-white/[0.04] light:border-zinc-200 text-left transition-colors group cursor-pointer"
                  >
                    <span className="truncate text-zinc-300 dark:text-zinc-300 light:text-zinc-800 group-hover:text-white dark:group-hover:text-white light:group-hover:text-zinc-950">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-500 px-1 rounded bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Editorial Pages Navigation */}
        <div className="pt-8 border-t border-white/[0.06] dark:border-white/[0.06] light:border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.siteName || 'Vebstar'} &mdash; The Open Source Catalog.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigatePage('about')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigatePage('manifesto')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Manifesto
            </button>
            <button
              onClick={() => onNavigatePage('blog')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Blog
            </button>
            <button
              onClick={() => onNavigatePage('faq')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigatePage('advertise')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-semibold"
            >
              Advertise / Sponsor
            </button>
            <button
              onClick={() => onNavigatePage('contact')}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Contact
            </button>
            {footerPages.map((page) => (
              <button
                key={page.id}
                onClick={() => onNavigatePage(page.slug)}
                className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
