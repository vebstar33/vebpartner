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
      <div className="relative w-full max-w-lg bg-vp-surface-raised border border-vp rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-vp-subtle flex items-center justify-between bg-vp-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vp-brand-subtle border border-vp-brand flex items-center justify-center text-vp-brand">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-vp-primary">
                {categoryToEdit ? 'Edit Category' : 'Create New Category'}
              </h2>
              <p className="text-xs text-vp-muted">Configure directory taxonomy and filtering tags.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-vp-muted hover:text-vp-primary hover:bg-vp-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-vp-error/10 border border-vp-error/25 text-vp-error text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. AI Businesses, Reseller Businesses"
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Category Slug / ID *</label>
            <input
              type="text"
              required
              value={id}
              disabled={Boolean(categoryToEdit && categoryToEdit.id === 'all')}
              onChange={(e) => setId(e.target.value)}
              placeholder="ai-machine-learning"
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Icon Selection</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            >
              {AVAILABLE_ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of this category's tools..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-surface-subtle border border-vp text-vp-primary text-xs focus:outline-none focus:ring-2 focus:ring-[var(--vp-brand)]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-vp-surface-subtle/60 border border-vp">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-vp-strong text-vp-brand focus:ring-[var(--vp-brand)] bg-vp-surface-subtle"
              />
              <span className="text-xs font-semibold text-vp-secondary">Highlight in Category Filter Bar</span>
            </label>
          </div>
        </form>

        {/* Footer */}
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
            className="px-5 py-2 rounded-xl bg-vp-brand hover:bg-vp-brand-hover text-vp-inverse font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : categoryToEdit ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};
