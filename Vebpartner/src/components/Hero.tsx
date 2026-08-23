import React, { useState } from 'react';
import {
  SevallaLogo,
  SentLogo,
  CapturePageLogo,
  CodeRabbitLogo,
  OpenlaneLogo,
  LogtoLogo,
  C15tLogo,
  DocmostLogo,
  InfluxDataLogo,
  VebpartnerLogo,
} from './Icons';
import { Check, ArrowUpRight } from 'lucide-react';
import { SiteSettings, Advertisement } from '../types';

interface HeroProps {
  siteSettings: SiteSettings;
  ads?: Advertisement[];
  onSubscribeSuccess?: (email: string) => void;
  onNavigatePage?: (slug: string) => void;
  onAdClick?: (adId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  siteSettings,
  ads = [],
  onSubscribeSuccess,
  onNavigatePage,
  onAdClick,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    onSubscribeSuccess?.(email);
  };

  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center overflow-hidden">
      {/* Background Matrix Pattern Grid Texture */}
      <div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-20 light:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 70%, transparent 100%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-white/[0.08] dark:border-white/[0.08] light:border-zinc-300 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 text-xs font-medium shadow-sm hover:border-emerald-500/40 transition-colors">
          <VebpartnerLogo className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
          <span className="text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Curated by</span>
          <span className="font-bold text-white dark:text-white light:text-zinc-950 tracking-tight">{siteSettings.siteName || 'Vebpartner'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* H1 Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Businesses You Can <br />
          Actually Start
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          {siteSettings.heroSubtitle ||
            'Discover practical business models, partner programs, platforms and tools you can use to build a real online business.'}
        </p>

        {/* Subscribe Email Form */}
        <div className="pt-2">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
          >
            <div className="relative w-full sm:w-80">
              <input
                type="email"
                placeholder="Enter your email for weekly picks..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-white/[0.12] dark:border-white/[0.12] light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-zinc-400 rounded-full px-5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={subscribed}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-sm shrink-0 cursor-pointer disabled:opacity-80"
            >
              {subscribed ? (
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-zinc-950" />
                  Subscribed!
                </span>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </form>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#08090E] dark:ring-[#08090E] light:ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                alt="Community member"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#08090E] dark:ring-[#08090E] light:ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                alt="Community member"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#08090E] dark:ring-[#08090E] light:ring-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                alt="Community member"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#08090E] dark:ring-[#08090E] light:ring-white object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces"
                alt="Community member"
              />
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium">
              Joined by <strong className="text-zinc-200 dark:text-zinc-200 light:text-zinc-900 font-semibold">12,400+</strong> business builders
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
