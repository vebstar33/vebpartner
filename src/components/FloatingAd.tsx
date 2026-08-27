import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Advertisement } from '../types';

interface FloatingAdProps {
  ad?: Advertisement | null;
  onAdClick?: (adId: string) => void;
}

export const FloatingAd: React.FC<FloatingAdProps> = ({ ad, onAdClick }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !ad || !ad.active) return null;

  return (
    <div className="fixed bottom-5 right-5 z-30 max-w-xs w-full bg-[#0d0f17] border border-zinc-800 rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
            {ad.sponsorName.charAt(0)}
          </div>
          <span className="font-bold text-white text-xs">{ad.sponsorName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {ad.badgeText || 'Ad'}
          </span>
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-zinc-300 leading-snug mt-2 mb-3">
        {ad.description || ad.title}
      </p>

      <a
        href={ad.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onAdClick?.(ad.id)}
        className="w-full py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
      >
        <span>{ad.ctaText || 'Learn More'}</span>
        <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
};
