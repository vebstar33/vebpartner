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
    description: 'Deploy production-grade open source software instantly on isolated dedicated nodes.',
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
    ctaText: 'Try Free for Open Source',
    ctaUrl: 'https://coderabbit.ai',
    placement: 'sidebar',
    active: true,
    impressions: 15300,
    clicks: 940,
  },
];

export const INITIAL_SITE_SETTINGS: import('../types').SiteSettings = {
  siteName: 'Vebstar',
  tagline: 'Discover the best open-source alternatives to proprietary software',
  announcementBanner: {
    enabled: true,
    badge: 'Sponsored',
    text: 'Deploy open-source databases & apps on Sevalla Cloud in 60 seconds.',
    linkText: 'Get $50 Free Credits',
    linkUrl: 'https://sevalla.com',
  },
  socials: {
    twitter: 'https://twitter.com/vebstar_os',
    github: 'https://github.com/vebstar',
    discord: 'https://discord.gg/vebstar',
    linkedin: 'https://linkedin.com/company/vebstar',
    mastodon: 'https://mastodon.social/@vebstar',
    rss: '/rss.xml',
    email: 'hello@vebstar.com',
  },
  contactEmail: 'contact@vebstar.com',
  enableCommunitySubmissions: true,
};

export const INITIAL_PAGES: import('../types').CustomPage[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About Vebstar',
    subtitle: 'Championing transparent, self-hostable, and privacy-first software for creators and teams.',
    badge: 'Our Mission',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Welcome to Vebstar

Vebstar is the premier destination for developers, founders, engineering leaders, and privacy advocates seeking modern open-source alternatives to proprietary SaaS.

### Why Vebstar Exists
Software vendor lock-in, unannounced price hikes, opaque data telemetry, and sudden license changes have created massive friction for modern teams. We believe software should be:
- **Transparent**: Inspectable code that respects user privacy and security audits.
- **Self-Hostable**: Deployable on your own hardware, virtual private servers, or cloud infrastructure.
- **Community-Driven**: Built with open collaboration, standards, and community contributions.

### Our Curation Philosophy
Every tool listed on Vebstar undergoes thorough verification:
1. **Active Maintenance**: Fresh commits, healthy issue resolution rates, and active maintainer responsiveness.
2. **True Open Source & Free Tiers**: Clearly defined permissive or copyleft licenses (MIT, Apache 2.0, AGPL-3.0, BSD, GPL).
3. **Enterprise & Production Readiness**: Documentation quality, Docker container support, and upgrade paths.
4. **Community Trust**: Real GitHub stars, active forks, and user sentiment analysis.

Join our community of over 500,000 monthly developers exploring the open ecosystem.
    `,
  },
  {
    id: 'page-advertise',
    slug: 'advertise',
    title: 'Advertise with Vebstar',
    subtitle: 'Connect your brand directly with 500,000+ software engineers, CTOs, founders, and self-hosting enthusiasts.',
    badge: 'Partner with Us',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Reach 500k+ Tech Decision Makers

Vebstar attracts high-intent developers and technology executives who are actively searching for tools, infrastructure, hosting providers, and software alternatives.

### Key Audience Demographics
- **64% Senior Developers & Engineering Leads** (Full-Stack, DevOps, Backend, AI Engineers)
- **22% Founders & Tech Executives** (CTOs, Tech Leads, Solopreneurs)
- **14% Open Source Contributors & Self-Hosters**
- **1.2M+ Monthly Page Views** across 180+ countries

### Available Sponsorship Placements
1. **Top Announcement Banner**: Sitewide sticky header position seen on 100% of visitor sessions.
2. **Featured Tool Listing**: Pinned at the top of category pages and home directory with 'Featured Pick' badge and custom CTA.
3. **Tool Page Dedicated Sponsor**: High-converting banner on specific alternative comparison pages (e.g., Novu, Supabase, Typebot).
4. **Floating Action Badge**: Non-intrusive bottom badge with high click-through rates.
5. **Newsletter Feature**: Direct placement in our weekly open-source digest reaching 48,000+ subscribers.

Contact **sponsor@vebstar.com** or fill out our sponsorship inquiry form in the contact section to receive our media kit.
    `,
  },
  {
    id: 'page-manifesto',
    slug: 'manifesto',
    title: 'The Open Source Manifesto',
    subtitle: 'Why the future of software infrastructure belongs to open standards and user sovereignty.',
    badge: 'Core Beliefs',
    category: 'resources',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# The Vebstar Open Source Manifesto

We believe the foundational building blocks of the digital economy should belong to humanity, not walled gardens.

### Principle 1: Data Sovereignty is Non-Negotiable
Your business data, customer records, and intellectual property should reside wherever you choose. When you own your software stack, you eliminate compliance risks and third-party data scraping.

### Principle 2: Pricing Predictability
SaaS subscription pricing models with artificial user-seat tiers punish growing companies. Open-source foundations allow organizations to scale computational horsepower without exponential licensing tolls.

### Principle 3: Longevity Over Vendor Survival
When a proprietary startup shuts down, your team is forced into catastrophic migration. Open-source software endures forever — you can fork, maintain, and adapt code indefinitely.

### Principle 4: Auditable Security
Security through obscurity is a failed paradigm. Millions of eyes on open code repositories uncover vulnerabilities before malicious actors can exploit them in secret.
    `,
  },
  {
    id: 'page-blog',
    slug: 'blog',
    title: 'Vebstar Editorial & Guides',
    subtitle: 'Deep dives, architectural comparisons, and step-by-step migration guides for modern software.',
    badge: 'Editorial',
    category: 'editorial',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Featured Guides & Software Comparisons

Explore our latest in-depth technical analysis and migration playbooks curated by the Vebstar engineering team.

### 1. Migrating from Firebase to Supabase in 2026
A complete step-by-step breakdown of schema design, Row Level Security (RLS), real-time subscriptions, and authentication mapping without downtime.

### 2. The 10 Best Self-Hosted Notion & Miro Alternatives
Comparing AFFiNE, Docmost, AppFlowy, and Outline: benchmarks on performance, offline synchronization, and canvas speed.

### 3. Privacy-First Analytics: Umami vs. PostHog vs. Plausible
How to achieve 100% GDPR/CCPA compliance without cookie consent banners while retaining essential conversion funnel metrics.

### 4. Self-Hosting Docker Quickstart: From Local to VPS in 15 Minutes
Best practices for reverse proxy routing with Caddy and Traefik, automated SSL renewal, and Docker Compose orchestration.
    `,
  },
  {
    id: 'page-faq',
    slug: 'faq',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about browsing, submitting, and managing software on Vebstar.',
    badge: 'Help Center',
    category: 'resources',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Frequently Asked Questions (FAQ)

### What is Vebstar?
Vebstar is an open-source software directory and comparison engine that helps teams replace closed-source, proprietary SaaS with transparent, self-hostable alternatives.

### How do you verify listings?
Our team verifies that each repository has a valid open-source license, clean documentation, active maintenance, and honest feature parity with the tools it claims to replace.

### Is Vebstar free to use?
Yes, Vebstar is 100% free for all developers and teams. We are supported by transparent sponsorships from reputable developer tools and cloud hosting providers.

### How can I submit my project?
Click "Submit a Tool" in the header navigation or footer. Provide your project name, GitHub URL, demo link, and which proprietary tool it replaces. Our moderation team reviews submissions within 24–48 hours.

### Can I self-host the tools listed on Vebstar?
Yes! Over 90% of tools on Vebstar include ready-to-run Docker commands, Helm charts, or Docker Compose files for immediate deployment.
    `,
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Contact the Vebstar Team',
    subtitle: 'Have a question, feedback, partnership inquiry, or need assistance? We are here to help.',
    badge: 'Get in Touch',
    category: 'company',
    published: true,
    showInMenu: true,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Contact Us

We love hearing from maintainers, developers, and partners. 

### Direct Contacts
- **General Inquiries & Community**: hello@vebstar.com
- **Sponsorships & Partnerships**: sponsor@vebstar.com
- **Security & Privacy**: security@vebstar.com
- **Tool Moderation & Edits**: directory@vebstar.com

### Social & Community Channels
- **Twitter / X**: [@vebstar_os](https://twitter.com)
- **Discord Community**: [Join Vebstar Discord](https://discord.gg)
- **GitHub Discussions**: [github.com/vebstar](https://github.com)

Submit your message using the interactive contact form below.
    `,
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'How Vebstar respects your data privacy with minimal collection and zero tracking.',
    badge: 'Legal & Privacy',
    category: 'legal',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Privacy Policy

**Last Updated: August 2026**

At Vebstar, we practice what we preach. We do not sell your personal information, deploy invasive cross-site tracking cookies, or build behavioral ad profiles.

### 1. Information We Collect
- **Local Storage State**: When you bookmark tools or upvote listings, your preferences are saved locally on your device in browser storage.
- **Voluntary Submissions**: When you submit a tool or send a contact message, we collect only the information provided in the submission form.
- **Aggregated Analytics**: We collect non-identifiable, privacy-respecting metrics (page counts, aggregate referrer domains) to maintain server health.

### 2. Cookies & Tracking
We do not use third-party tracking pixels or advertising cookie networks. Essential storage is used strictly for remembering user preferences (view mode, bookmarked IDs).

### 3. Contact Us
For any privacy inquiries or data requests, email **privacy@vebstar.com**.
    `,
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Terms of Service',
    subtitle: 'Guidelines and terms for using the Vebstar directory and submission services.',
    badge: 'Legal',
    category: 'legal',
    published: true,
    showInMenu: false,
    showInFooter: true,
    lastUpdated: '2026-08-14T00:00:00Z',
    contentMarkdown: `
# Terms of Service

**Last Updated: August 2026**

Welcome to Vebstar. By accessing our platform, you agree to the following terms and conditions:

### 1. Directory Listings & Accuracy
Vebstar provides software information and metadata for educational and informational purposes. While we strive for absolute accuracy, project details, star counts, and licensing terms are subject to change by respective upstream maintainers.

### 2. Intellectual Property & Trademarks
All third-party product names, logos, and brands mentioned on Vebstar (e.g., Notion, Slack, Google Analytics) are the property of their respective trademark holders. Reference to them is purely descriptive for comparison purposes under nominative fair use.

### 3. Community Conduct
Users submitting tools must provide accurate URLs and valid repository sources. Spam, malicious software, misleading claims, or abusive submissions will be rejected immediately.
    `,
  },
];
