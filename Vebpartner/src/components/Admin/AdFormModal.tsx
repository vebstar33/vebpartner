import React, { useState, useEffect } from 'react';
import { X, Megaphone, ExternalLink, Globe, Layout, CheckCircle2 } from 'lucide-react';
import { Advertisement, AdPlacement } from '../../types';

interface AdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ad: Partial<Advertisement>) => Promise<void>;
  adToEdit: Advertisement | null;
}

export const AdFormModal: React.FC<AdFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  adToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [badgeText, setBadgeText] = useState('Sponsored');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('Learn More');
  const [ctaUrl, setCtaUrl] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('navbar_top');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adToEdit) {
      setTitle(adToEdit.title || '');
      setSponsorName(adToEdit.sponsorName || '');
      setLogoUrl(adToEdit.logoUrl || '');
      setBadgeText(adToEdit.badgeText || 'Sponsored');
      setDescription(adToEdit.description || '');
      setCtaText(adToEdit.ctaText || 'Learn More');
      setCtaUrl(adToEdit.ctaUrl || '');
      setPlacement(adToEdit.placement || 'navbar_top');
      setActive(adToEdit.active !== undefined ? adToEdit.active : true);
    } else {
      setTitle('');
      setSponsorName('');
      setLogoUrl('');
      setBadgeText('Sponsored');
      setDescription('');
      setCtaText('Get Started');
      setCtaUrl('');
      setPlacement('navbar_top');
      setActive(true);
    }
    setError(null);
  }, [adToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sponsorName || !ctaUrl) {
      setError('Please provide title, sponsor name, and CTA destination URL.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        id: adToEdit?.id,
        title,
        sponsorName,
        logoUrl,
        badgeText,
        description,
        ctaText,
        ctaUrl,
        placement,
        active,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save advertisement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d0f17] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {adToEdit ? 'Edit Advertisement / Sponsor' : 'Create New Advertisement / Sponsor'}
              </h2>
              <p className="text-xs text-zinc-400">Configure promotional spots and sponsorship campaigns on Vebstar.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Sponsor / Brand Name *</label>
              <input
                type="text"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="e.g. Sevalla, Stellar, CodeRabbit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Campaign Headline / Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1-Click Open-Source Cloud Hosting"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Ad Placement Slot *</label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="navbar_top">Navbar Top Banner (Sitewide Header)</option>
                <option value="floating_bottom">Floating Bottom Ad Badge</option>
                <option value="tool_detail">Tool Detail Dedicated Sponsor</option>
                <option value="sidebar">Sidebar / Card Feed Promoted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. Sponsored, Featured, Promo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Short Promotional Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Deploy open-source databases and microservices in 60 seconds with free credits."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">CTA Button Label</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Deploy Now, Get Free Credits"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">CTA Target URL (with UTM) *</label>
              <input
                type="url"
                required
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://sponsor.com/?ref=vebstar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Optional Sponsor Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://sponsor.com/logo.svg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Active Switch */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
              />
              <div>
                <div className="text-xs font-bold text-zinc-200">Active Campaign</div>
                <div className="text-[11px] text-zinc-400">When enabled, this advertisement will be rendered live in its chosen slot.</div>
              </div>
            </label>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Component Preview:</div>
            <div className="p-3 rounded-lg bg-zinc-900/90 border border-emerald-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {badgeText || 'Sponsored'}
                </span>
                <span className="font-bold text-white text-xs truncate">{sponsorName || 'Sponsor'}</span>
                <span className="text-zinc-400 text-xs truncate hidden sm:inline">{description || title || 'Promotional message...'}</span>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-emerald-500 text-zinc-950 font-bold text-[11px] shrink-0"
              >
                {ctaText || 'Learn More'}
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-zinc-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : adToEdit ? 'Update Advertisement' : 'Publish Advertisement'}
          </button>
        </div>
      </div>
    </div>
  );
};
