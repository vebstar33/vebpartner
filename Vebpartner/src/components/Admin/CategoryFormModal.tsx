import React, { useState, useEffect } from 'react';
import { X, Layers, CheckCircle2 } from 'lucide-react';
import { Category } from '../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Partial<Category>) => Promise<void>;
  categoryToEdit: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
}) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState('emerald');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setId(categoryToEdit.id || '');
      setIcon(categoryToEdit.icon || 'Layers');
      setDescription(categoryToEdit.description || '');
      setBadgeColor(categoryToEdit.badgeColor || 'emerald');
      setFeatured(Boolean(categoryToEdit.featured));
    } else {
      setName('');
      setId('');
      setIcon('Layers');
      setDescription('');
      setBadgeColor('emerald');
      setFeatured(false);
    }
    setError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!categoryToEdit) {
      setId(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !id) {
      setError('Please provide category name and identifier.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        id,
        name,
        icon,
        description,
        badgeColor,
        featured,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const AVAILABLE_ICONS = [
    'Layers',
    'Database',
    'Code2',
    'Headset',
    'Megaphone',
    'BarChart3',
    'FileText',
    'Kanban',
    'Palette',
    'CheckSquare',
    'Calendar',
    'ShieldCheck',
    'Workflow',
    'Layers',
    'Server',
    'Cpu',
    'Cloud',
    'Lock',
    'Globe',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0d0f17] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {categoryToEdit ? 'Edit Category' : 'Create New Category'}
              </h2>
              <p className="text-xs text-zinc-400">Configure directory taxonomy and filtering tags.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. AI & Machine Learning, Vector Databases"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category Slug / ID *</label>
            <input
              type="text"
              required
              value={id}
              disabled={Boolean(categoryToEdit && categoryToEdit.id === 'all')}
              onChange={(e) => setId(e.target.value)}
              placeholder="ai-machine-learning"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Icon Selection</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {AVAILABLE_ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of this category's tools..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
              />
              <span className="text-xs font-semibold text-zinc-200">Highlight in Category Filter Bar</span>
            </label>
          </div>
        </form>

        {/* Footer */}
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
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : categoryToEdit ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};
