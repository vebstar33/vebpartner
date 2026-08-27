import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, Globe, Layers } from 'lucide-react';
import { Category, UserSubmission } from '../types';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (submission: Partial<UserSubmission>) => Promise<void>;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
}) => {
  const [toolName, setToolName] = useState('');
  const [tagline, setTagline] = useState('');
  const [replaces, setReplaces] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState(categories[1]?.id || 'agencies-services');
  const [license, setLicense] = useState('Business Opportunity');
  const [submittedBy, setSubmittedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) {
      setError('Please provide a tool name.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        toolName: toolName.trim(),
        tagline: tagline.trim(),
        replaces: replaces.trim(),
        githubUrl: githubUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        category,
        license,
        submittedBy: submittedBy.trim() || 'Anonymous',
        notes: notes.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setToolName('');
        setTagline('');
        setReplaces('');
        setGithubUrl('');
        setWebsiteUrl('');
        setLicense('Business Opportunity');
        setNotes('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-vp-surface-raised border border-vp shadow-2xl shadow-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-vp-subtle bg-vp-bg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-vp-surface-subtle border border-vp flex items-center justify-center text-vp-secondary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-vp-primary text-base sm:text-lg tracking-tight">Submit an Opportunity</h3>
              <p className="text-xs text-vp-muted">Suggest a business opportunity, platform, tool, program or service for review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-vp-surface-subtle hover:bg-vp-surface-hover text-vp-muted hover:text-vp-primary border border-vp-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-vp-brand/15 border border-vp-brand flex items-center justify-center mx-auto text-vp-brand animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-vp-primary tracking-tight">Thank you for submitting!</h4>
            <p className="text-xs text-vp-muted max-w-sm mx-auto leading-relaxed">
              Your submission has been queued for Vebpartner review. Publication is not guaranteed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-vp-error flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-vp-error" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">
                Name <span className="text-vp-brand">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Documenso, Cal.com, Penpot, Supabase"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">
                Provider, program or business model
              </label>
              <input
                type="text"
                placeholder="e.g. Shopify, HighLevel, Webflow, Printful"
                value={replaces}
                onChange={(e) => setReplaces(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Short Tagline / Pitch</label>
              <input
                type="text"
                placeholder="e.g. A practical tool or partner program for building an online business"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-vp-secondary mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-vp-muted" />
                  <span>Program or Docs URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-vp-secondary mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-vp-muted" />
                  <span>Official Website</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Program Type</label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                >
                  <option value="Business Opportunity">Business Opportunity</option>
                  <option value="Platform">Platform</option>
                  <option value="Tool">Tool</option>
                  <option value="Reseller Program">Reseller Program</option>
                  <option value="Partner Program">Partner Program</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-vp-bg border border-vp text-vp-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-vp-brand hover:bg-vp-brand-hover disabled:opacity-50 text-vp-inverse font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to Review Queue...' : 'Submit Opportunity for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
