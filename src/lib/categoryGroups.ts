import { Category } from '../types';
import { BUSINESS_CATEGORIES } from './businessTaxonomy';

export interface CategoryGroupDef {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  categoryIds: string[];
}

export const CATEGORY_GROUPS: CategoryGroupDef[] = [
  ...BUSINESS_CATEGORIES.filter((category) => category.id !== 'all').map((category) => ({
    id: category.id,
    name: category.name,
    shortName: category.name,
    icon: category.icon,
    description: category.description,
    categoryIds: [category.id],
  })),
];

export interface GroupedCategoryResult {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  categoryIds: string[];
  items: Category[];
}

export function getGroupedCategories(categories: Category[]): GroupedCategoryResult[] {
  const nonAll = categories.filter((c) => c.id !== 'all');
  const assigned = new Set<string>();

  const groups: GroupedCategoryResult[] = CATEGORY_GROUPS.map((grp) => {
    const items = nonAll.filter((cat) => grp.categoryIds.includes(cat.id));
    items.forEach((i) => assigned.add(i.id));
    return {
      ...grp,
      items,
    };
  });

  const remaining = nonAll.filter((cat) => !assigned.has(cat.id));
  if (remaining.length > 0) {
    groups.push({
      id: 'other',
      name: 'Other Categories',
      shortName: 'Other',
      icon: 'Layers',
      description: 'Specialized and custom categories',
      categoryIds: remaining.map((r) => r.id),
      items: remaining,
    });
  }

  return groups;
}

export function findGroupForCategory(categoryId: string): string | null {
  if (categoryId === 'all') return 'all';
  for (const group of CATEGORY_GROUPS) {
    if (group.categoryIds.includes(categoryId)) {
      return group.id;
    }
  }
  return 'other';
}
