import { Category } from '../types';

export interface CategoryGroupDef {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  categoryIds: string[];
}

export const CATEGORY_GROUPS: CategoryGroupDef[] = [
  {
    id: 'dev-cloud',
    name: 'Developer & Cloud',
    shortName: 'Dev & Cloud',
    icon: 'Code2',
    description: 'Developer tools, backend BaaS, databases, auth & automation',
    categoryIds: ['developer-tools', 'database', 'security', 'automation'],
  },
  {
    id: 'business-growth',
    name: 'Business & Operations',
    shortName: 'Business & Ops',
    icon: 'Briefcase',
    description: 'CRM, customer messaging, social management & analytics',
    categoryIds: ['crm-support', 'customer-communication', 'social-media', 'analytics'],
  },
  {
    id: 'productivity-workspace',
    name: 'Productivity & Workspace',
    shortName: 'Productivity',
    icon: 'LayoutGrid',
    description: 'Wikis, project trackers, scheduling, forms & media',
    categoryIds: ['productivity', 'project-management', 'scheduling', 'forms-surveys', 'design-media'],
  },
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
