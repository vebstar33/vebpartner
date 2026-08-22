import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, Github, Globe, Layers, ShieldCheck } from 'lucide-react';
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
  const [license, setLicense] = useState('MIT');
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
        submittedBy: submittedBy.trim() || 'Anonymous Developer',
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
        setNotes('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit tool');
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
        className="relative w-full max-w-lg rounded-3xl bg-[#0D0F17] border border-white/[0.08] shadow-2xl shadow-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.06] bg-[#090A10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg tracking-tight">Submit Open Source Tool</h3>
              <p className="text-xs text-zinc-400">Suggest a tool for directory inclusion & review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">Thank you for submitting!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Your submission has been queued in the review inbox for admin verification and will be published shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tool Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Documenso, Cal.com, Penpot, Supabase"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                What proprietary software does it replace?
              </label>
              <input
                type="text"
                placeholder="e.g. Notion, DocuSign, Calendly, Firebase"
                value={replaces}
                onChange={(e) => setReplaces(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Short Tagline / Pitch</label>
              <input
                type="text"
                placeholder="e.g. The open source alternative to Calendly for easy team scheduling"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub Repo URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Official Website</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">License</label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                >
                  <option value="MIT">MIT</option>
                  <option value="AGPL-3.0">AGPL-3.0</option>
                  <option value="Apache-2.0">Apache-2.0</option>
                  <option value="GPL-3.0">GPL-3.0</option>
                  <option value="MPL-2.0">MPL-2.0</option>
                  <option value="BSD-3-Clause">BSD-3-Clause</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your Name or GitHub Handle</label>
              <input
                type="text"
                placeholder="e.g. alex_dev"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to Review Queue...' : 'Submit Tool for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
