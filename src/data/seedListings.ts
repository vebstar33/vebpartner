import { ToolListing, Category } from '../types';
import { BUSINESS_CATEGORIES } from '../lib/businessTaxonomy';
import { BUSINESS_TOOL_LISTINGS } from './listings';

export const INITIAL_CATEGORIES: Category[] = BUSINESS_CATEGORIES;

export const INITIAL_LISTINGS: ToolListing[] = [...BUSINESS_TOOL_LISTINGS];

export const INITIAL_ADS: import('../types').Advertisement[] = [
  {
    id: 'ad-top-sevalla',
    title: 'Sevalla Cloud Hosting',
    sponsorName: 'Sevalla',
    badgeText: 'Featured Sponsor',
    description: 'Effortless cloud hosting for open-source apps, databases, and microservices.',
    ctaText: 'Deploy Now',
    ctaUrl: 'https://sevalla.com',
    placement: 'navbar_top',
    active: true,
    impressions: 48920,
    clicks: 3410,
    bgGradient: 'from-orange-500/20 to-amber-500/10',
  },
  {
    id: 'ad-floating-dirstarter',
    title: 'Dirstarter.com',
    sponsorName: 'Dirstarter',
    badgeText: 'Promo',
    description: 'Launch your high-converting software directory in hours with ready-made Next.js template.',
    ctaText: 'View Template',
    ctaUrl: 'https://dirstarter.com',
    placement: 'floating_bottom',
    active: true,
    impressions: 102450,
    clicks: 8120,
  },
  {
    id: 'ad-tool-stellar',
    title: 'Stellar Hosted Cloud',
    sponsorName: 'Stellar Hosted',
    badgeText: '1-Click Deploy',
    description: 'Deploy production-grade business software and infrastructure on isolated dedicated nodes.',
    ctaText: 'Host with Stellar Hosted',
    ctaUrl: 'https://stellarhosted.com',
    placement: 'tool_detail',
    active: true,
    impressions: 29400,
    clicks: 1980,
  },
  {
    id: 'ad-coderabbit-sidebar',
    title: 'CodeRabbit AI Code Reviews',
    sponsorName: 'CodeRabbit',
    badgeText: 'AI Dev Tool',
    description: 'Cut code review time in half with context-aware AI summary and line-by-line feedback.',
    ctaText: 'Try Free',
    ctaUrl: 'https://coderabbit.ai',
    placement: 'sidebar',
    active: true,
    impressions: 15300,
    clicks: 940,
  },
];

export const INITIAL_SITE_SETTINGS: import('../types').SiteSettings = {
  siteName: 'Vebpartner',
  tagline: 'Discover business opportunities, reseller programs, white-label platforms and business tools you can actually start.',
  announcementBanner: {
    enabled: true,
    badge: 'Sponsored',
    text: 'Deploy business databases and apps on Sevalla Cloud in 60 seconds.',
    linkText: 'Get $50 Free Credits',
    linkUrl: 'https://sevalla.com',
  },
  socials: {
    twitter: 'https://twitter.com/vebpartner',
    github: 'https://github.com/vebpartner',
    discord: 'https://discord.gg/vebpartner',
    linkedin: 'https://linkedin.com/company/vebpartner',
    mastodon: 'https://mastodon.social/@vebpartner',
    rss: '/rss.xml',
    email: 'hello@vebpartner.com',
  },
  contactEmail: 'contact@vebpartner.com',
  enableCommunitySubmissions: true,
};

export const INITIAL_PAGES: import('../types').CustomPage[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About Vebpartner',
    subtitle: 'A curated directory for practical business opportunities, platforms, tools and services.',
    badge: 'About',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# About Vebpartner

Vebpartner is a curated directory for people researching practical ways to build, expand or support a business.

### What We Cover
- **Business opportunities**: reseller, partner, agency, service and freelancing models.
- **Business platforms**: software and marketplaces that can power storefronts, communities, courses, services or client operations.
- **Business tools**: operational tools for marketing, automation, customer support, content, commerce and delivery.
- **Relevant services**: providers and service models that can help operators create new income streams.

### How to Use Vebpartner
Browse Vebpartner as a starting point for research. Listings are organized to make it easier to understand what you can offer, what a provider handles and how a business model might work in practice.

Vebpartner does not replace your own due diligence. Provider terms, pricing, commissions and availability can change.
    `,
  },
  {
    id: 'page-advertise',
    slug: 'advertise',
    title: 'Advertise / Sponsor',
    subtitle: 'Reach people actively researching business opportunities, platforms and tools.',
    badge: 'For Businesses',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# Advertise / Sponsor

Vebpartner helps companies reach an audience that is already comparing ways to start, package or grow practical businesses.

### Commercial Placements
- **Featured listings** for providers, platforms and tools that match Vebpartner categories.
- **Sponsored placements** across high-intent directory views.
- **Category sponsorships** for relevant business areas.
- **Promoted business opportunities** for partner, reseller, service and platform programs.
- **Partner visibility** for companies that support business builders and service operators.
- **Custom partnerships** for campaigns that need a tailored placement or content package.

### Contact Vebpartner
To discuss advertising, sponsorships or partnership visibility, contact **sponsor@vebpartner.com** with a short description of your company, target category and campaign goals.
    `,
  },
  {
    id: 'page-submit-opportunity',
    slug: 'submit-opportunity',
    title: 'Submit an Opportunity',
    subtitle: 'Suggest a business opportunity, platform, tool, program or relevant service for review.',
    badge: 'Submissions',
    category: 'community',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# Submit an Opportunity

Companies and operators can suggest listings for Vebpartner review.

### What You Can Submit
- **Business opportunities**
- **Business platforms**
- **Business tools**
- **Reseller programs**
- **Partner programs**
- **Relevant services**

### Review Process
Submission does not guarantee publication. Vebpartner may review, edit, reject, reclassify or categorize submissions based on fit, clarity, quality and relevance to the directory.

Please include a clear provider name, website, category suggestion and a concise explanation of why the opportunity is useful for people researching business ideas or new income streams.
    `,
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Contact',
    subtitle: 'Contact Vebpartner about listings, partnerships, submissions or general questions.',
    badge: 'Contact',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# Contact Vebpartner

Use this page for questions about Vebpartner, listing updates, partnerships, sponsorships or submissions.

### Contact Options
- **General questions**: hello@vebpartner.com
- **Advertising and partnerships**: sponsor@vebpartner.com
- **Listing updates and submissions**: directory@vebpartner.com
- **Privacy questions**: privacy@vebpartner.com

You can also use the contact form below.
    `,
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'How Vebpartner handles data connected to browsing, submissions and contact requests.',
    badge: 'Legal',
    category: 'legal',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# Privacy Policy

**Last Updated: August 2026**

Vebpartner aims to collect only the information needed to operate the directory, review submissions and respond to contact requests.

### 1. Information We Collect
- **Local browser preferences**: saved listings, view mode and similar preferences may be stored in your browser.
- **Voluntary submissions**: when you submit an opportunity, platform, tool, program or service, we collect the information you provide.
- **Contact messages**: when you contact Vebpartner, we collect the details needed to respond.
- **Operational analytics**: we may use aggregate, non-identifying information to understand site performance and usage.

### 2. How Information Is Used
Information may be used to operate Vebpartner, review and categorize submissions, improve directory quality, respond to inquiries and maintain site reliability.

### 3. Contact
For privacy questions, email **privacy@vebpartner.com**.
    `,
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Terms of Service',
    subtitle: 'Terms for using Vebpartner and submitting opportunities to the directory.',
    badge: 'Legal',
    category: 'legal',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-24T00:00:00Z',
    contentMarkdown: `
# Terms of Service

**Last Updated: August 2026**

By using Vebpartner, you agree to use the directory responsibly and to evaluate any opportunity, platform, tool, program or service independently before making a business decision.

### 1. Directory Information
Vebpartner provides informational directory listings. Provider terms, pricing, commissions, availability and program details may change.

### 2. Submissions
Submitting a listing does not guarantee publication. Vebpartner may review, edit, reject, reclassify or categorize submissions at its discretion.

### 3. Third-Party Providers
Listings may reference third-party companies, products, programs, services, logos or trademarks. Those belong to their respective owners.

### 4. Responsible Use
Do not submit spam, misleading claims, malicious links or content that you do not have permission to share.
    `,
  },
];
