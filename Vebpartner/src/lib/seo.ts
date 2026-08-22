import { CustomPage, ToolListing } from '../types';

const DEFAULT_SITE_URL = 'https://vebpartner.com';
const HOMEPAGE_TITLE = 'Vebpartner — Businesses You Can Actually Start';
const HOMEPAGE_DESCRIPTION =
  'Discover business opportunities, reseller programs, white-label platforms, business tools and proven models you can actually start with Vebpartner.';
const HOMEPAGE_SOCIAL_DESCRIPTION =
  'Discover business opportunities, reseller programs, white-label platforms, business tools and proven models you can actually start.';

const getConfiguredSiteUrl = () => {
  const envUrl = (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL;

  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
};

export const SITE_URL = getConfiguredSiteUrl().replace(/\/+$/, '');

export const getHomeTitle = () => HOMEPAGE_TITLE;

export const getHomeDescription = () => HOMEPAGE_DESCRIPTION;

export const getHomeSocialDescription = () => HOMEPAGE_SOCIAL_DESCRIPTION;

export const getListingPath = (listing: Pick<ToolListing, 'slug' | 'id'>) =>
  `/business/${encodeURIComponent(listing.slug || listing.id)}`;

export const getListingUrl = (listing: Pick<ToolListing, 'slug' | 'id'>) =>
  `${SITE_URL}${getListingPath(listing)}`;

export const getPagePath = (page: Pick<CustomPage, 'slug'>) =>
  `/${encodeURIComponent(page.slug)}`;

export const getPageUrl = (page: Pick<CustomPage, 'slug'>) =>
  `${SITE_URL}${getPagePath(page)}`;

export const getListingTitle = (listing: Pick<ToolListing, 'name'>) =>
  `${listing.name} — Start This Business | Vebpartner`;

export const getListingDescription = (listing: Pick<ToolListing, 'tagline' | 'description'>) =>
  normalizeDescription(listing.tagline || listing.description || HOMEPAGE_DESCRIPTION);

export const normalizeDescription = (value: string, maxLength = 160) => {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const clipped = normalized.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : clipped.length).trim()}…`;
};

export const getRouteFromLocation = (location: Location) => {
  const path = decodeURIComponent(location.pathname).replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(location.search);
  const businessMatch = path.match(/^\/business\/([^/]+)$/);

  return {
    path,
    listingSlug: businessMatch?.[1] || params.get('tool') || params.get('id') || null,
    pageSlug: !businessMatch && path !== '/' ? path.slice(1) : params.get('page'),
    legacyListingParam: params.get('tool') || params.get('id') || null,
  };
};

export const setDocumentTitleAndMeta = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  socialDescription,
  imageUrl,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  socialDescription?: string;
  imageUrl?: string;
}) => {
  if (typeof document === 'undefined') return;

  document.title = title;
  setMeta('name', 'description', description);
  const socialMetaDescription = socialDescription || description;
  setLink('canonical', canonicalUrl);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', socialMetaDescription);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:type', ogType);
  setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', socialMetaDescription);

  if (imageUrl) {
    setMeta('property', 'og:image', imageUrl);
    setMeta('name', 'twitter:image', imageUrl);
  } else {
    removeMeta('property', 'og:image');
    removeMeta('name', 'twitter:image');
  }
};

export const setJsonLd = (items: object[]) => {
  if (typeof document === 'undefined') return;

  const id = 'vebpartner-jsonld';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(items.length === 1 ? items[0] : items);
};

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

const removeMeta = (attribute: 'name' | 'property', key: string) => {
  document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove();
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};
