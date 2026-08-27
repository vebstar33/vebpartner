import { ExploreDirectoryDefinition } from '../types';

export const EXPLORE_DIRECTORY_BASE_PATH = '/explore';

export const EXPLORE_DIRECTORIES: ExploreDirectoryDefinition[] = [
  {
    slug: 'tools',
    title: 'Tools',
    navLabel: 'Tools',
    description: 'Software and services useful for building, operating or growing a business.',
    categories: ['All', 'AI', 'Automation', 'Marketing', 'Sales', 'E-commerce', 'SEO', 'Design', 'Productivity', 'Finance', 'Development', 'No-Code'],
    listings: [
      { url: 'https://www.make.com', category: 'Automation', tags: ['No-Code', 'Workflow'] },
      { url: 'https://www.semrush.com', category: 'SEO', tags: ['Marketing', 'Research'] },
      { url: 'https://www.figma.com', category: 'Design', tags: ['Collaboration', 'Product'] },
      { url: 'https://www.notion.com', category: 'Productivity', tags: ['Docs', 'Workspace'] },
    ],
  },
  {
    slug: 'platforms',
    title: 'Platforms',
    navLabel: 'Platforms',
    description: 'Places to sell products, services, digital products, find clients, distribute products or operate a business.',
    categories: ['All', 'E-commerce', 'Services', 'Digital Products', 'Creator', 'Freelance', 'Courses', 'Community'],
    listings: [
      { url: 'https://www.shopify.com', category: 'E-commerce', tags: ['Storefront', 'Payments'] },
      { url: 'https://www.upwork.com', category: 'Freelance', tags: ['Clients', 'Services'] },
      { url: 'https://www.gumroad.com', category: 'Digital Products', tags: ['Creator', 'Checkout'] },
      { url: 'https://www.thinkific.com', category: 'Courses', tags: ['Education', 'Creator'] },
    ],
  },
  {
    slug: 'suppliers',
    title: 'Suppliers',
    navLabel: 'Suppliers',
    description: 'Suppliers, wholesalers, manufacturers, print-on-demand providers, dropshipping providers and white-label suppliers.',
    categories: ['All', 'Print-on-Demand', 'Dropshipping', 'Wholesale', 'Manufacturing', 'White Label', 'E-commerce'],
    listings: [
      { url: 'https://www.printful.com', category: 'Print-on-Demand', tags: ['Merch', 'Fulfillment'] },
      { url: 'https://www.spocket.co', category: 'Dropshipping', tags: ['Suppliers', 'E-commerce'] },
      { url: 'https://www.alibaba.com', category: 'Wholesale', tags: ['Manufacturing', 'Global'] },
      { url: 'https://www.thomasnet.com', category: 'Manufacturing', tags: ['Industrial', 'Suppliers'] },
    ],
  },
  {
    slug: 'resources',
    title: 'Resources',
    navLabel: 'Resources',
    description: 'Useful free or paid research tools, templates, libraries, directories, stock resources, public services and websites.',
    categories: ['All', 'Research', 'Templates', 'Stock Assets', 'Libraries', 'Directories', 'Public Services'],
    listings: [
      { url: 'https://trends.google.com', category: 'Research', tags: ['Demand', 'Trends'] },
      { url: 'https://unsplash.com', category: 'Stock Assets', tags: ['Images', 'Creative'] },
      { url: 'https://www.producthunt.com', category: 'Directories', tags: ['Products', 'Launches'] },
      { url: 'https://www.canva.com/templates', category: 'Templates', tags: ['Design', 'Marketing'] },
    ],
  },
  {
    slug: 'apis',
    title: 'APIs',
    navLabel: 'APIs',
    description: 'Useful APIs that can be used to build products, services, automations or businesses.',
    categories: ['All', 'AI', 'Payments', 'Communication', 'Data', 'Maps', 'Automation', 'Commerce'],
    listings: [
      { url: 'https://platform.openai.com', category: 'AI', tags: ['Agents', 'Automation'] },
      { url: 'https://stripe.com', category: 'Payments', tags: ['Billing', 'Checkout'] },
      { url: 'https://www.twilio.com', category: 'Communication', tags: ['SMS', 'Voice'] },
      { url: 'https://www.apify.com', category: 'Data', tags: ['Scraping', 'Automation'] },
    ],
  },
  {
    slug: 'data-sources',
    title: 'Data Sources',
    navLabel: 'Data Sources',
    description: 'Datasets, databases, company information, market data, trend data, statistics and structured research sources.',
    categories: ['All', 'Company Data', 'Market Data', 'Trends', 'Statistics', 'Open Data', 'Finance'],
    listings: [
      { url: 'https://www.statista.com', category: 'Statistics', tags: ['Market Research', 'Charts'] },
      { url: 'https://www.crunchbase.com', category: 'Company Data', tags: ['Startups', 'Funding'] },
      { url: 'https://data.worldbank.org', category: 'Open Data', tags: ['Public Data', 'Economics'] },
      { url: 'https://finance.yahoo.com', category: 'Finance', tags: ['Markets', 'Companies'] },
    ],
  },
  {
    slug: 'partner-programs',
    title: 'Partner Programs',
    navLabel: 'Partner Programs',
    description: 'Reseller, white-label, agency, solution partner, referral and similar commercial partnership opportunities.',
    categories: ['All', 'Affiliate', 'Agency', 'Reseller', 'White Label', 'Solution Partner', 'Referral'],
    listings: [
      { url: 'https://www.hubspot.com/partners', category: 'Agency', tags: ['CRM', 'Services'] },
      { url: 'https://www.shopify.com/partners', category: 'Solution Partner', tags: ['Commerce', 'Apps'] },
      { url: 'https://webflow.com/partners', category: 'Agency', tags: ['Web Design', 'CMS'] },
      { url: 'https://www.pipedrive.com/en/partners', category: 'Reseller', tags: ['Sales', 'CRM'] },
    ],
  },
  {
    slug: 'marketplaces',
    title: 'Marketplaces',
    navLabel: 'Marketplaces',
    description: 'Marketplaces for buying or selling businesses, websites, domains, SaaS products, digital assets and other business assets.',
    categories: ['All', 'Businesses', 'SaaS', 'Domains', 'Websites', 'Digital Assets', 'Apps'],
    listings: [
      { url: 'https://flippa.com', category: 'Websites', tags: ['Businesses', 'Domains'] },
      { url: 'https://acquire.com', category: 'SaaS', tags: ['Startups', 'Acquisitions'] },
      { url: 'https://www.microns.io', category: 'Businesses', tags: ['Micro SaaS', 'Startups'] },
      { url: 'https://themeforest.net', category: 'Digital Assets', tags: ['Themes', 'Templates'] },
    ],
  },
];

export const getExploreDirectoryBySlug = (slug?: string | null) =>
  EXPLORE_DIRECTORIES.find((directory) => directory.slug === slug);

export const getExplorePath = (slug: string) => `${EXPLORE_DIRECTORY_BASE_PATH}/${slug}`;
