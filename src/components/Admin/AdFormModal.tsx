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
      <div className="relative w-full max-w-2xl bg-vp-surface-raised border border-vp rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-vp-subtle flex items-center justify-between bg-vp-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vp-brand-subtle border border-vp-brand flex items-center justify-center text-vp-brand">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-vp-primary">
                {adToEdit ? 'Edit Advertisement / Sponsor' : 'Create New Advertisement / Sponsor'}
              </h2>
              <p className="text-xs text-vp-muted">Configure promotional spots and sponsorship campaigns on Vebpartner.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-vp-muted hover:text-vp-primary hover:bg-vp-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-vp-error/10 border border-vp-error/25 text-vp-error text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Sponsor / Brand Name *</label>
              <input
                type="text"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="e.g. Sevalla, Stellar, CodeRabbit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Campaign Headline / Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Launch Faster With Managed Business Infrastructure"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Ad Placement Slot *</label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              >
                <option value="navbar_top">Navbar Top Banner (Sitewide Header)</option>
                <option value="floating_bottom">Floating Bottom Ad Badge</option>
                <option value="tool_detail">Tool Detail Dedicated Sponsor</option>
                <option value="sidebar">Sidebar / Card Feed Promoted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. Sponsored, Featured, Promo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Short Promotional Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Launch hosted services, automations and business infrastructure faster with free credits."
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">CTA Button Label</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Deploy Now, Get Free Credits"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">CTA Target URL (with UTM) *</label>
              <input
                type="url"
                required
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://sponsor.com/?ref=vebpartner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Optional Sponsor Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://sponsor.com/logo.svg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            />
          </div>

          {/* Active Switch */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-vp-surface-subtle/60 border border-vp">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded border-vp-strong text-vp-brand focus:ring-[var(--vp-brand)] bg-vp-surface-subtle"
              />
              <div>
                <div className="text-xs font-bold text-vp-secondary">Active Campaign</div>
                <div className="text-[11px] text-vp-muted">When enabled, this advertisement will be rendered live in its chosen slot.</div>
              </div>
            </label>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-vp-bg border border-vp space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-vp-muted">Live Component Preview:</div>
            <div className="p-3 rounded-lg bg-vp-surface-subtle/90 border border-vp-brand flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-vp-brand-subtle text-emerald-300 border border-vp-brand">
                  {badgeText || 'Sponsored'}
                </span>
                <span className="font-bold text-vp-primary text-xs truncate">{sponsorName || 'Sponsor'}</span>
                <span className="text-vp-muted text-xs truncate hidden sm:inline">{description || title || 'Promotional message...'}</span>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-vp-brand text-vp-inverse font-bold text-[11px] shrink-0"
              >
                {ctaText || 'Learn More'}
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-vp-subtle bg-vp-bg/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-vp-surface-hover hover:bg-vp-surface-hover text-xs font-semibold text-vp-secondary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-vp-brand hover:bg-vp-brand-hover text-vp-inverse font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : adToEdit ? 'Update Advertisement' : 'Publish Advertisement'}
          </button>
        </div>
      </div>
    </div>
  );
};
