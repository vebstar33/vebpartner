import React, { useState, useEffect } from 'react';
import { X, FileText, Eye, CheckCircle2 } from 'lucide-react';
import { CustomPage } from '../../types';

interface PageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: Partial<CustomPage>) => Promise<void>;
  pageToEdit: CustomPage | null;
}

export const PageFormModal: React.FC<PageFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pageToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('Guide');
  const [category, setCategory] = useState<'company' | 'legal' | 'resources' | 'community' | 'editorial'>('company');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [published, setPublished] = useState(true);
  const [showInMenu, setShowInMenu] = useState(true);
  const [showInFooter, setShowInFooter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title || '');
      setSlug(pageToEdit.slug || '');
      setSubtitle(pageToEdit.subtitle || '');
      setBadge(pageToEdit.badge || 'Guide');
      setCategory(pageToEdit.category || 'company');
      setContentMarkdown(pageToEdit.contentMarkdown || '');
      setPublished(pageToEdit.published !== undefined ? pageToEdit.published : true);
      setShowInMenu(Boolean(pageToEdit.showInMenu));
      setShowInFooter(pageToEdit.showInFooter !== undefined ? Boolean(pageToEdit.showInFooter) : true);
    } else {
      setTitle('');
      setSlug('');
      setSubtitle('');
      setBadge('Guide');
      setCategory('company');
      setContentMarkdown('# New Page\n\nAdd your formatted markdown content here.');
      setPublished(true);
      setShowInMenu(false);
      setShowInFooter(true);
    }
    setError(null);
  }, [pageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!pageToEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !contentMarkdown) {
      setError('Please provide a title, URL slug, and page markdown content.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        id: pageToEdit?.id,
        title,
        slug,
        subtitle,
        badge,
        category,
        contentMarkdown,
        published,
        showInMenu,
        showInFooter,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-vp-surface-raised border border-vp rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-vp-subtle flex items-center justify-between bg-vp-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vp-brand-subtle border border-vp-brand flex items-center justify-center text-vp-brand">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-vp-primary">
                {pageToEdit ? 'Edit Custom Content Page' : 'Create New Content Page'}
              </h2>
              <p className="text-xs text-vp-muted">Manage pages, blog guides, legal documents, and manifesto content.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-vp-muted hover:text-vp-primary hover:bg-vp-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-vp-error/10 border border-vp-error/25 text-vp-error text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Page Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. About Vebpartner, Business Model Guide"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">URL Slug *</label>
              <div className="flex items-center rounded-xl bg-vp-surface-subtle border border-vp overflow-hidden px-3.5">
                <span className="text-vp-faint text-xs font-mono">/page/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="about"
                  className="w-full py-2.5 bg-transparent text-vp-brand font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Subtitle / Hero Tagline</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Short summary displayed below the main title"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Badge Label</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Our Mission, Legal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Section Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            >
              <option value="company">Company (About, Advertise, Contact)</option>
              <option value="resources">Resources & Help</option>
              <option value="community">Community & Submissions</option>
              <option value="legal">Legal (Privacy Policy, Terms of Service)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-vp-secondary">Page Content (Markdown) *</label>
              <span className="text-[11px] text-vp-faint">Supports # H1, ## H2, ### H3, - bullets, 1. lists</span>
            </div>
            <textarea
              required
              rows={10}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              placeholder="# Heading\n\nYour article or page content here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            />
          </div>

          {/* Visibility Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-vp-surface-subtle/60 border border-vp">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-vp-strong text-vp-brand focus:ring-[var(--vp-brand)] bg-vp-surface-subtle"
              />
              <span className="text-xs font-semibold text-vp-secondary">Published Live</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-vp-surface-subtle/60 border border-vp">
              <input
                type="checkbox"
                checked={showInMenu}
                onChange={(e) => setShowInMenu(e.target.checked)}
                className="w-4 h-4 rounded border-vp-strong text-vp-brand focus:ring-[var(--vp-brand)] bg-vp-surface-subtle"
              />
              <span className="text-xs font-semibold text-vp-secondary">Header Menu Link</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-vp-surface-subtle/60 border border-vp">
              <input
                type="checkbox"
                checked={showInFooter}
                onChange={(e) => setShowInFooter(e.target.checked)}
                className="w-4 h-4 rounded border-vp-strong text-vp-brand focus:ring-[var(--vp-brand)] bg-vp-surface-subtle"
              />
              <span className="text-xs font-semibold text-vp-secondary">Footer Link</span>
            </label>
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
            {loading ? 'Saving...' : pageToEdit ? 'Update Page' : 'Publish Page'}
          </button>
        </div>
      </div>
    </div>
  );
};
