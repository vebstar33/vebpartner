import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Github,
  Globe,
  Tag,
  Terminal,
  Loader2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ToolListing, Category } from '../../types';
import { api } from '../../lib/api';

interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingToEdit?: ToolListing | null;
  categories: Category[];
  onSave: (listing: Partial<ToolListing>) => Promise<void>;
}

export const ListingFormModal: React.FC<ListingFormModalProps> = ({
  isOpen,
  onClose,
  listingToEdit,
  categories,
  onSave,
}) => {
  const isEditing = Boolean(listingToEdit?.id);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [replacesInput, setReplacesInput] = useState('');
  const [replacesList, setReplacesList] = useState<string[]>([]);
  const [category, setCategory] = useState('developer-tools');
  const [tagInput, setTagInput] = useState('');
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [techList, setTechList] = useState<string[]>([]);
  const [license, setLicense] = useState('MIT');
  const [githubUrl, setGithubUrl] = useState('');
  const [stars, setStars] = useState(1200);
  const [forks, setForks] = useState(150);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [dockerCommand, setDockerCommand] = useState('');
  const [pricingModel, setPricingModel] = useState<'100% Free Open Source' | 'Open Core / Freemium Cloud' | 'Self-Hosted Free'>('100% Free Open Source');
  const [logoUrl, setLogoUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [verified, setVerified] = useState(true);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [upvotes, setUpvotes] = useState(1);
  const [comparisonPoints, setComparisonPoints] = useState<{ feature: string; openSourceTool: string; proprietaryTool: string }[]>([]);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');

  // AI autofill
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Submission state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (listingToEdit) {
      setName(listingToEdit.name || '');
      setSlug(listingToEdit.slug || '');
      setTagline(listingToEdit.tagline || '');
      setDescription(listingToEdit.description || '');
      setReplacesList(listingToEdit.replaces || []);
      setCategory(listingToEdit.category || 'developer-tools');
      setTagsList(listingToEdit.tags || []);
      setTechList(listingToEdit.techStack || []);
      setLicense(listingToEdit.license || 'MIT');
      setGithubUrl(listingToEdit.githubUrl || '');
      setStars(listingToEdit.stars || 0);
      setForks(listingToEdit.forks || 0);
      setWebsiteUrl(listingToEdit.websiteUrl || '');
      setDocsUrl(listingToEdit.docsUrl || '');
      setDemoUrl(listingToEdit.demoUrl || '');
      setDockerCommand(listingToEdit.dockerCommand || '');
      setPricingModel(listingToEdit.pricingModel || '100% Free Open Source');
      setLogoUrl(listingToEdit.logoUrl || '');
      setFeatured(Boolean(listingToEdit.featured));
      setVerified(listingToEdit.verified !== false);
      setStatus(listingToEdit.status === 'draft' ? 'draft' : 'published');
      setUpvotes(listingToEdit.upvotes || 1);
      setComparisonPoints(listingToEdit.comparisonPoints || []);
      setPros(listingToEdit.pros || []);
      setCons(listingToEdit.cons || []);
    } else {
      // Defaults for brand new listing
      setName('');
      setSlug('');
      setTagline('');
      setDescription('');
      setReplacesList([]);
      setCategory('developer-tools');
      setTagsList([]);
      setTechList([]);
      setLicense('MIT');
      setGithubUrl('');
      setStars(1200);
      setForks(150);
      setWebsiteUrl('');
      setDocsUrl('');
      setDemoUrl('');
      setDockerCommand('');
      setPricingModel('100% Free Open Source');
      setLogoUrl('');
      setFeatured(false);
      setVerified(true);
      setStatus('published');
      setUpvotes(1);
      setComparisonPoints([
        { feature: 'Data Sovereignty', openSourceTool: 'Self-host on your own infrastructure with zero vendor telemetry', proprietaryTool: 'Vendor closed proprietary cloud' },
        { feature: 'Pricing & Scaling', openSourceTool: 'Unlimited team members & queries for free', proprietaryTool: 'Heavy per-seat & usage tiers' },
      ]);
      setPros(['Full data ownership and privacy', 'Active open-source community']);
      setCons(['Requires basic Docker server setup to self-host']);
    }
  }, [listingToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Replaces tags handling
  const handleAddReplace = () => {
    if (replacesInput.trim() && !replacesList.includes(replacesInput.trim())) {
      setReplacesList([...replacesList, replacesInput.trim()]);
      setReplacesInput('');
    }
  };

  const handleRemoveReplace = (item: string) => {
    setReplacesList(replacesList.filter((r) => r !== item));
  };

  // Tech stack handling
  const handleAddTech = () => {
    if (techInput.trim() && !techList.includes(techInput.trim())) {
      setTechList([...techList, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechList(techList.filter((t) => t !== tech));
  };

  // Tags handling
  const handleAddTag = () => {
    if (tagInput.trim() && !tagsList.includes(tagInput.trim())) {
      setTagsList([...tagsList, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTagsList(tagsList.filter((t) => t !== tag));
  };

  // Comparison point management
  const handleAddComparisonPoint = () => {
    setComparisonPoints([...comparisonPoints, { feature: '', openSourceTool: '', proprietaryTool: '' }]);
  };

  const handleUpdateComparisonPoint = (index: number, key: 'feature' | 'openSourceTool' | 'proprietaryTool', value: string) => {
    const next = [...comparisonPoints];
    next[index][key] = value;
    setComparisonPoints(next);
  };

  const handleRemoveComparisonPoint = (index: number) => {
    setComparisonPoints(comparisonPoints.filter((_, i) => i !== index));
  };

  // AI Autofill Trigger
  const handleAiAutoFill = async () => {
    const query = aiPrompt.trim() || name.trim() || githubUrl.trim();
    if (!query) {
      setError('Please provide a tool name, GitHub URL, or AI query to auto-fill.');
      return;
    }

    setIsAiLoading(true);
    setError('');
    setAiSuccessMessage('');

    try {
      const data = await api.aiEnrich(query);
      if (data) {
        if (data.name && (!name || name === query)) handleNameChange(data.name);
        if (data.tagline) setTagline(data.tagline);
        if (data.description) setDescription(data.description);
        if (Array.isArray(data.replaces) && data.replaces.length > 0) setReplacesList(data.replaces);
        if (data.category) setCategory(data.category);
        if (Array.isArray(data.tags) && data.tags.length > 0) setTagsList(data.tags);
        if (Array.isArray(data.techStack) && data.techStack.length > 0) setTechList(data.techStack);
        if (data.license) setLicense(data.license);
        if (data.estimatedStars && (!stars || stars === 1200)) setStars(data.estimatedStars);
        if (data.pricingModel) setPricingModel(data.pricingModel);
        if (data.dockerCommand) setDockerCommand(data.dockerCommand);
        if (Array.isArray(data.comparisonPoints) && data.comparisonPoints.length > 0) {
          setComparisonPoints(data.comparisonPoints);
        }
        if (Array.isArray(data.pros) && data.pros.length > 0) setPros(data.pros);
        if (Array.isArray(data.cons) && data.cons.length > 0) setCons(data.cons);

        setAiSuccessMessage(`Metadata populated for "${data.name || query}". Review and adjust any fields below.`);
      }
    } catch (err: any) {
      setError(err.message || 'AI Auto-fill failed. Please enter details manually.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim()) {
      setError('Name and tagline are required fields.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload: Partial<ToolListing> = {
        ...(listingToEdit || {}),
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: tagline.trim(),
        description: description.trim(),
        replaces: replacesList,
        category,
        tags: tagsList,
        techStack: techList,
        license,
        githubUrl: githubUrl.trim(),
        stars: Number(stars) || 0,
        forks: Number(forks) || 0,
        websiteUrl: websiteUrl.trim(),
        docsUrl: docsUrl.trim(),
        demoUrl: demoUrl.trim(),
        dockerCommand: dockerCommand.trim(),
        pricingModel,
        logoUrl: logoUrl.trim(),
        featured,
        verified,
        status,
        upvotes: Number(upvotes) || 1,
        comparisonPoints: comparisonPoints.filter((cp) => cp.feature.trim()),
        pros,
        cons,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save listing.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0D0F17] border border-white/[0.08] shadow-2xl shadow-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-[#090A10]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <span className="text-emerald-400 font-extrabold">{isEditing ? 'Edit Listing:' : 'Add New Listing'}</span>
              {isEditing && <span className="text-zinc-300">{listingToEdit?.name}</span>}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage core tool specs, proprietary alternatives, GitHub stars, self-hosting commands, and comparison matrices.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Quick Auto-Fill Assistant Strip */}
        <div className="p-4 bg-zinc-900/60 border-b border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white">Auto-Fill Assistant</span>
              <p className="text-[11px] text-zinc-400">
                Type a repository name or GitHub URL to auto-extract comprehensive metadata.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. https://github.com/supabase/supabase or Formbricks"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-64 sm:w-72"
              />
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiLoading}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm"
              >
                {isAiLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAiLoading ? 'Analyzing...' : 'Auto-Fill'}</span>
              </button>
            </div>
          </div>

          {aiSuccessMessage && (
            <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>1. Basic Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tool Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supabase, Plausible, Cal.com"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="supabase, plausible-analytics"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Short Tagline <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="The open source Firebase alternative with Postgres database"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Detailed Overview</label>
              <textarea
                rows={3}
                placeholder="Explain the architectural advantages, core mission, why developers love it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Replaces (Ersätter proprietär mjukvara) */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.06] space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">
                Proprietary Software Replaced (e.g. Firebase, Notion, Google Analytics)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Firebase, Airtable, Notion"
                  value={replacesInput}
                  onChange={(e) => setReplacesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReplace();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddReplace}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {replacesList.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                  >
                    <span>vs {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReplace(item)}
                      className="hover:text-rose-400 text-emerald-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Taxonomy & Repositories */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              2. Taxonomy, Pricing & Repositories
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1">License</label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="MIT">MIT</option>
                  <option value="AGPL-3.0">AGPL-3.0</option>
                  <option value="Apache-2.0">Apache-2.0</option>
                  <option value="GPL-3.0">GPL-3.0</option>
                  <option value="MPL-2.0">MPL-2.0</option>
                  <option value="BSD-3-Clause">BSD-3-Clause</option>
                  <option value="Elastic-2.0">Elastic-2.0</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Pricing Model</label>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="100% Free Open Source">100% Free Open Source</option>
                  <option value="Open Core / Freemium Cloud">Open Core / Freemium Cloud</option>
                  <option value="Self-Hosted Free">Self-Hosted Free</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/supabase/supabase"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Official Website URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://supabase.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">GitHub Stars</label>
                <input
                  type="number"
                  value={stars}
                  onChange={(e) => setStars(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Documentation URL</label>
                <input
                  type="url"
                  placeholder="https://docs.example.com"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Logo / Favicon URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/favicon.ico"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tech Stack & Tags */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">3. Tech Stack & Self-Hosting</h4>

            {/* Tech stack */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Technologies & Languages (Tech Stack)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TypeScript, Rust, PostgreSQL, Next.js, Go"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {techList.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 border border-white/[0.04]"
                  >
                    <span>{t}</span>
                    <button type="button" onClick={() => handleRemoveTech(t)} className="hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Docker Quickstart */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Docker Run / Compose Command</span>
              </label>
              <input
                type="text"
                placeholder="docker run -p 3000:3000 tool/tool or docker compose up -d"
                value={dockerCommand}
                onChange={(e) => setDockerCommand(e.target.value)}
                className="w-full px-3 py-2 font-mono text-xs rounded-xl bg-zinc-950 border border-white/[0.08] text-emerald-400 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Comparison Matrix */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                4. Feature Comparison Matrix (Open Source vs Proprietary)
              </h4>
              <button
                type="button"
                onClick={handleAddComparisonPoint}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Comparison Row</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {comparisonPoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] relative group"
                >
                  <input
                    type="text"
                    placeholder="Dimension (e.g. Data Ownership)"
                    value={cp.feature}
                    onChange={(e) => handleUpdateComparisonPoint(idx, 'feature', e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl bg-zinc-900 border border-white/[0.08] text-white placeholder-zinc-500"
                  />
                  <input
                    type="text"
                    placeholder="This Tool Advantage"
                    value={cp.openSourceTool}
                    onChange={(e) => handleUpdateComparisonPoint(idx, 'openSourceTool', e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 placeholder-emerald-700"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Proprietary SaaS limitation"
                      value={cp.proprietaryTool}
                      onChange={(e) => handleUpdateComparisonPoint(idx, 'proprietaryTool', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 placeholder-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveComparisonPoint(idx)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Visibility & Status */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">5. Publishing Status & Badges</h4>

            {/* Publishing status switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'published'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-zinc-950 border-white/[0.06] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="listing_status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="mt-1 text-emerald-500 focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Published (Live)</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Listing is immediately visible to all visitors in the public catalog.
                  </div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'draft'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-zinc-950 border-white/[0.06] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="listing_status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="mt-1 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Draft (Private)</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Saved in admin database only. Hidden from the public website until published.
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-zinc-950 border border-white/[0.06]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                />
                <span className="text-xs font-semibold text-zinc-200">Mark as Featured Pick</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                />
                <span className="text-xs font-semibold text-zinc-200">Verified Open Source</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Initial Upvotes:</span>
                <input
                  type="number"
                  value={upvotes}
                  onChange={(e) => setUpvotes(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3 sticky bottom-0 bg-[#0D0F17] py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors border border-white/[0.06]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={async (e) => {
                setStatus('draft');
                // set status to draft and trigger submit
                const payload: Partial<ToolListing> = {
                  ...(listingToEdit || {}),
                  name: name.trim(),
                  slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  tagline: tagline.trim(),
                  description: description.trim(),
                  replaces: replacesList,
                  category,
                  tags: tagsList,
                  techStack: techList,
                  license,
                  githubUrl: githubUrl.trim(),
                  stars: Number(stars) || 0,
                  forks: Number(forks) || 0,
                  websiteUrl: websiteUrl.trim(),
                  docsUrl: docsUrl.trim(),
                  demoUrl: demoUrl.trim(),
                  dockerCommand: dockerCommand.trim(),
                  pricingModel,
                  logoUrl: logoUrl.trim(),
                  featured,
                  verified,
                  status: 'draft',
                  upvotes: Number(upvotes) || 1,
                  comparisonPoints: comparisonPoints.filter((cp) => cp.feature.trim()),
                  pros,
                  cons,
                };
                setIsSaving(true);
                try {
                  await onSave(payload);
                  onClose();
                } catch (err: any) {
                  setError(err.message || 'Failed to save draft.');
                } finally {
                  setIsSaving(false);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSaving
                  ? 'Saving tool...'
                  : status === 'draft'
                  ? 'Save as Draft'
                  : isEditing
                  ? 'Update Listing'
                  : 'Publish Listing'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
