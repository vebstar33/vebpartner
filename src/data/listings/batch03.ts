import { BusinessListing } from './listing.schema';

const disclaimer = 'These figures are illustrative examples only. Pricing, expenses, customer acquisition and actual results vary.';

export const batch03Listings: BusinessListing[] = [
  {
    id: 'online-course-business',
    slug: 'online-course-business',
    name: 'Online Course Business',
    tagline: 'Turn expertise into a structured online course business',
    shortDescription:
      'Create and sell structured online courses, learning programs and related digital education products using Thinkific as the course platform.',
    category: 'creator-businesses',
    categoriesList: ['Business Blueprint', 'Creator Business'],
    tags: ['online-courses', 'education', 'creator', 'digital-products', 'recurring-revenue'],
    listingType: 'opportunity',
    partnerModels: ['agency-partner'],
    startCost: 'Plan varies',
    revenueModel: 'Sales + Recurring',
    difficulty: 'Easy–Medium',
    businessIcon: 'FileText',
    provider: {
      name: 'Thinkific',
      logo: '/providers/thinkific.png',
      website: 'https://www.thinkific.com',
      programUrl: 'https://www.thinkific.com/affiliates/',
      affiliateUrl: 'THINKIFIC_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2C / Creator Education',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Optional',
      whiteLabel: 'No',
    },
    whatYouSell: {
      description:
        'Online courses, cohort-style learning, training programs, memberships or related educational products built around legitimate expertise.',
      items: ['Online courses', 'Cohort-style learning', 'Training programs', 'Memberships', 'Educational products'],
    },
    targetCustomers: ['Subject-matter experts', 'Consultants', 'Educators', 'Coaches', 'Professional trainers', 'Businesses with knowledge that can be packaged into learning products'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose an outcome', description: 'Choose one narrow learning outcome.' },
      { stepNumber: 2, title: 'Design the structure', description: 'Design the course structure and modules.' },
      { stepNumber: 3, title: 'Create lessons', description: 'Create lessons and supporting resources.' },
      { stepNumber: 4, title: 'Build in Thinkific', description: 'Build the course and checkout experience in Thinkific.' },
      { stepNumber: 5, title: 'Launch', description: 'Launch to a relevant audience.' },
      { stepNumber: 6, title: 'Expand products', description: 'Add additional courses, subscriptions or related education products over time.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Creator-defined',
      scenarios: ['Course pricing and sales volume are set by the creator. Do not present enrollment, revenue or completion outcomes as guaranteed.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'Thinkific plan',
        price: 'Plan varies',
        description: 'Thinkific pricing varies by plan and business requirements.',
        details: 'Keep the card value as Plan varies unless current provider pricing is intentionally maintained as structured data.',
      },
    ],
    whyProvider: [
      {
        title: 'Course commerce infrastructure',
        description:
          'Thinkific provides course delivery, student management and commerce infrastructure, allowing the operator to focus on expertise, curriculum, marketing and customer experience.',
      },
    ],
    requirements: [
      { label: 'Content', value: 'Original expertise/content' },
      { label: 'Production', value: 'Course production' },
      { label: 'Support', value: 'Customer support' },
      { label: 'Distribution', value: 'Strategy required' },
      { label: 'Inventory', value: 'None' },
    ],
    monetization: {
      type: 'Affiliate / Sales',
      commissionType: 'Official affiliate program',
      commissionValue:
        'Thinkific official affiliate program currently states 30% lifetime recurring commission on standard monthly/annual paid plans; Plus referrals use a $150/month recurring commission instead. Current cookie period: 90 days.',
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
  {
    id: 'course-membership-business',
    slug: 'course-membership-business',
    name: 'Course & Membership Business',
    tagline: 'Sell courses, downloads and memberships from one creator platform',
    shortDescription: 'Build a creator business selling courses, downloads, webinars and recurring membership-style products through Podia.',
    category: 'creator-businesses',
    categoriesList: ['Business Blueprint', 'Creator Business'],
    tags: ['courses', 'memberships', 'digital-products', 'community', 'creator', 'recurring-revenue'],
    listingType: 'platform',
    partnerModels: [],
    startCost: 'Plan varies',
    revenueModel: 'Sales + Recurring',
    difficulty: 'Easy',
    businessIcon: 'Download',
    provider: {
      name: 'Podia',
      logo: '/providers/podia.png',
      website: 'https://www.podia.com',
      programUrl: 'https://affiliates.podia.com/',
      affiliateUrl: 'PODIA_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2C / Creator Commerce',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Optional',
      whiteLabel: 'No',
    },
    whatYouSell: {
      description: 'Courses, webinars, digital downloads, memberships/subscriptions and other legitimate creator products.',
      items: ['Courses', 'Webinars', 'Digital downloads', 'Memberships', 'Subscriptions', 'Creator products'],
    },
    targetCustomers: ['Creators', 'Educators', 'Consultants', 'Coaches', 'Niche experts', 'Small businesses monetizing knowledge or digital resources'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose an audience', description: 'Choose one audience and problem.' },
      { stepNumber: 2, title: 'Create an offer', description: 'Create a focused course, download or membership offer.' },
      { stepNumber: 3, title: 'Build in Podia', description: 'Build the product and sales page in Podia.' },
      { stepNumber: 4, title: 'Set delivery', description: 'Set pricing and delivery.' },
      { stepNumber: 5, title: 'Launch', description: 'Launch through content, email or an existing audience.' },
      { stepNumber: 6, title: 'Expand offers', description: 'Expand with complementary products or recurring offers.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Creator-defined',
      scenarios: ['Sales depend on offer quality, audience, pricing and distribution. Do not describe digital products as guaranteed passive income.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'Podia plan',
        price: 'Plan varies',
        description: 'Podia pricing varies by plan.',
        details: "Affiliate functionality for a creator's own Podia products is available on applicable higher plans; do not hard-code plan pricing here.",
      },
    ],
    whyProvider: [
      {
        title: 'Creator commerce stack',
        description:
          'Podia combines digital products, courses, website/email and creator-commerce capabilities, reducing the number of separate systems required for a small creator business.',
      },
    ],
    requirements: [
      { label: 'Content', value: 'Original/licensed' },
      { label: 'Positioning', value: 'Required' },
      { label: 'Support', value: 'Customer support' },
      { label: 'Traffic', value: 'Audience strategy' },
    ],
    monetization: {
      type: 'Affiliate / Sales',
      commissionType: 'Official affiliate program',
      commissionValue: "Podia current official affiliate program pays 20% on sales through the affiliate link, capped at 12 months; current published cookie window is 31 days.",
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
  {
    id: 'community-business',
    slug: 'community-business',
    name: 'Community Business',
    tagline: 'Build a paid online community around a focused audience',
    shortDescription:
      'Create a paid or membership-driven online community with discussions, content, events and member experiences using Circle.',
    category: 'creator-businesses',
    categoriesList: ['Business Blueprint', 'Community Business'],
    tags: ['community', 'membership', 'creator', 'recurring-revenue', 'education', 'network'],
    listingType: 'platform',
    partnerModels: [],
    startCost: 'Plan varies',
    revenueModel: 'Recurring',
    difficulty: 'Medium',
    businessIcon: 'Users',
    provider: {
      name: 'Circle',
      logo: '/providers/circle.png',
      website: 'https://circle.so',
      programUrl: 'https://circle.so/affiliate-program',
      affiliateUrl: 'CIRCLE_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2C / Community',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Yes',
      whiteLabel: 'No',
    },
    whatYouSell: {
      description:
        'Paid community access, membership tiers, premium groups, educational/community programs, events or bundled member experiences.',
      items: ['Paid community access', 'Membership tiers', 'Premium groups', 'Community programs', 'Events', 'Member experiences'],
    },
    targetCustomers: ['Creators', 'Educators', 'Professional networks', 'Niche communities', 'Coaches', 'Membership organizations', 'Brands with an engaged audience'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose a purpose', description: 'Choose a narrow community purpose and member profile.' },
      { stepNumber: 2, title: 'Define membership', description: 'Define the recurring membership offer.' },
      { stepNumber: 3, title: 'Create spaces', description: 'Create spaces, onboarding and community rules.' },
      { stepNumber: 4, title: 'Seed value', description: 'Seed useful content/events before launch.' },
      { stepNumber: 5, title: 'Recruit members', description: 'Recruit founding members.' },
      { stepNumber: 6, title: 'Retain members', description: 'Retain members through recurring value, programming and interaction.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Membership-defined',
      scenarios: ['Recurring membership revenue depends on member acquisition, pricing and retention. Do not promise community growth or retention rates.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'Circle plan',
        price: 'Plan varies',
        description: 'Circle pricing varies by plan and required features.',
        details: 'Keep Plan varies unless maintained from current official pricing.',
      },
    ],
    whyProvider: [
      {
        title: 'Community infrastructure',
        description:
          'Circle provides dedicated community infrastructure, memberships/paywalls and community-management features so the operator can focus on member value rather than building community software.',
      },
    ],
    requirements: [
      { label: 'Niche', value: 'Clear member profile' },
      { label: 'Value', value: 'Recurring member value' },
      { label: 'Moderation', value: 'Required' },
      { label: 'Programming', value: 'Ongoing' },
      { label: 'Stewardship', value: 'Active' },
    ],
    monetization: {
      type: 'Affiliate / Membership',
      commissionType: 'Official affiliate program',
      commissionValue:
        'Circle current official affiliate program starts with $100 per new customer plus recurring commission. Standard-plan recurring tiers currently range from 10% to 20% based on referrals; Circle Plus tiers range from 5% to 10%. Current cookie window: 90 days.',
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
  {
    id: 'newsletter-business',
    slug: 'newsletter-business',
    name: 'Newsletter Business',
    tagline: 'Build an owned audience and monetize a focused newsletter',
    shortDescription:
      'Launch a niche newsletter, grow an owned email audience and monetize through sponsorships, paid subscriptions, recommendations, products or affiliate offers.',
    category: 'creator-businesses',
    categoriesList: ['Business Blueprint', 'Creator Business'],
    tags: ['newsletter', 'email', 'audience', 'publishing', 'sponsorships', 'recurring-revenue'],
    listingType: 'platform',
    partnerModels: [],
    startCost: 'Low',
    revenueModel: 'Ads + Subscriptions + Affiliate',
    difficulty: 'Easy–Medium',
    businessIcon: 'Mail',
    provider: {
      name: 'beehiiv',
      logo: '/providers/beehiiv.png',
      website: 'https://www.beehiiv.com',
      programUrl: 'https://www.beehiiv.com/partners',
      affiliateUrl: 'BEEHIIV_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2C / Publishing',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Optional',
      whiteLabel: 'Publication-based',
    },
    whatYouSell: {
      description:
        'The core product is the newsletter/audience itself, with monetization through advertising, sponsorships, paid content, recommendations and related offers.',
      items: ['Newsletter audience', 'Advertising', 'Sponsorships', 'Paid content', 'Recommendations', 'Related offers'],
    },
    targetCustomers: ['Writers', 'Analysts', 'Niche experts', 'Local publishers', 'Creators', 'Industry professionals', 'Entrepreneurs able to publish consistently around a focused topic'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose a topic', description: 'Choose a narrow topic with recurring reader interest.' },
      { stepNumber: 2, title: 'Define cadence', description: 'Define the newsletter promise and publishing cadence.' },
      { stepNumber: 3, title: 'Create publication', description: 'Create the publication in beehiiv.' },
      { stepNumber: 4, title: 'Publish consistently', description: 'Publish consistently and build subscriber acquisition loops.' },
      { stepNumber: 5, title: 'Monetize', description: 'Introduce monetization once the audience has value.' },
      { stepNumber: 6, title: 'Expand', description: 'Expand through sponsorships, paid tiers, recommendations or products.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Audience-defined',
      scenarios: ['Subscriber count does not guarantee revenue. Advertising, subscription and affiliate economics vary significantly by audience quality and niche.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'beehiiv plan',
        price: 'Low',
        description: 'beehiiv offers different plan levels and capabilities.',
        details: 'Use Low as the card value and keep exact plan pricing outside the listing unless maintained as current structured provider data.',
      },
    ],
    whyProvider: [
      {
        title: 'Newsletter growth and monetization',
        description:
          'beehiiv is purpose-built for newsletter publishing, audience growth and monetization, making it suitable infrastructure for an audience-first publishing business.',
      },
    ],
    requirements: [
      { label: 'Niche', value: 'Defined editorial niche' },
      { label: 'Publishing', value: 'Consistent cadence' },
      { label: 'Audience', value: 'Acquisition required' },
      { label: 'Compliance', value: 'Email/ad disclosures' },
    ],
    monetization: {
      type: 'Affiliate / Publishing',
      commissionType: 'Partner Program',
      commissionValue:
        "beehiiv current Partner Program offers recurring commissions for 12 months, with tiers reaching up to 60% of referred customer revenue. Current partner materials show Bronze 50%, Silver 55% and Gold 60% after qualifying milestones.",
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
  {
    id: 'creator-email-business',
    slug: 'creator-email-business',
    name: 'Creator Email Business',
    tagline: 'Build and monetize a creator-owned email audience',
    shortDescription:
      'Build an email-first creator business using newsletters, automations, digital products and creator recommendations through Kit.',
    category: 'creator-businesses',
    categoriesList: ['Business Blueprint', 'Creator Business'],
    tags: ['email', 'newsletter', 'creator', 'digital-products', 'audience', 'affiliate'],
    listingType: 'platform',
    partnerModels: [],
    startCost: 'Low',
    revenueModel: 'Products + Affiliate + Recurring',
    difficulty: 'Easy',
    businessIcon: 'Mail',
    provider: {
      name: 'Kit',
      logo: '/providers/kit.png',
      website: 'https://kit.com',
      programUrl: 'https://kit.com/affiliate',
      affiliateUrl: 'KIT_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2C / Creator Email',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Optional',
      whiteLabel: 'No',
    },
    whatYouSell: {
      description: 'Newsletter content, digital products, subscriptions, services and other creator offers distributed through an owned email audience.',
      items: ['Newsletter content', 'Digital products', 'Subscriptions', 'Services', 'Creator offers', 'Owned email audience'],
    },
    targetCustomers: ['Creators', 'Writers', 'Consultants', 'Coaches', 'Educators', 'Niche experts who want an audience they control directly'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose a niche', description: 'Choose a narrow creator niche.' },
      { stepNumber: 2, title: 'Create a promise', description: 'Create a useful lead magnet or clear subscription promise.' },
      { stepNumber: 3, title: 'Set up email', description: 'Set up forms, landing pages and welcome automation.' },
      { stepNumber: 4, title: 'Publish consistently', description: 'Publish useful email content consistently.' },
      { stepNumber: 5, title: 'Introduce offers', description: 'Introduce relevant products/services or monetization.' },
      { stepNumber: 6, title: 'Use partnerships', description: 'Use partnerships/recommendations to expand the audience.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Audience-defined',
      scenarios: ['List size does not guarantee revenue. Monetization depends on trust, audience fit, offers and distribution.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'Kit plan',
        price: 'Low',
        description: 'Kit offers multiple plan levels including entry options.',
        details: 'Use Low rather than hard-coding a temporary plan price.',
      },
    ],
    whyProvider: [
      {
        title: 'Creator email infrastructure',
        description:
          'Kit is designed around creator email, automations, products and creator-network growth, supporting an email-first business without building newsletter infrastructure.',
      },
    ],
    requirements: [
      { label: 'Content', value: 'Consistently useful' },
      { label: 'Audience', value: 'Audience-building' },
      { label: 'Offers', value: 'Legitimate offers' },
      { label: 'Compliance', value: 'Email compliance' },
      { label: 'Inventory', value: 'None' },
    ],
    monetization: {
      type: 'Affiliate / Creator Commerce',
      commissionType: 'Official affiliate program',
      commissionValue:
        'Kit current official affiliate program pays 50% commission for up to 12 months on referred paid customers. Affiliates meeting qualifying tiers can unlock 10–20% recurring commission beyond the first year while maintaining status.',
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
  {
    id: 'podcast-remote-production-agency',
    slug: 'podcast-remote-production-agency',
    name: 'Podcast & Remote Production Agency',
    tagline: 'Produce professional remote podcasts and video content for clients',
    shortDescription:
      'Start a remote production service recording, organizing and delivering podcasts, interviews and video content for businesses and creators using Riverside.',
    category: 'agencies-services',
    categoriesList: ['Business Blueprint', 'Content Production Agency'],
    tags: ['podcast', 'video', 'remote-recording', 'content', 'agency', 'b2b'],
    listingType: 'tool',
    partnerModels: [],
    startCost: 'Plan varies',
    revenueModel: 'Project + Recurring',
    difficulty: 'Medium',
    businessIcon: 'Headphones',
    provider: {
      name: 'Riverside',
      logo: '/providers/riverside.png',
      website: 'https://riverside.fm',
      programUrl: 'https://riverside.fm/affiliate-program',
      affiliateUrl: 'RIVERSIDE_AFFILIATE_URL',
    },
    overview: {
      businessType: 'B2B / Content Production',
      inventoryRequired: 'No',
      codingRequired: 'No',
      recurringRevenue: 'Optional',
      whiteLabel: 'No',
    },
    whatYouSell: {
      description:
        'Remote recording setup, podcast/video production coordination, interview recording, editing workflow management, clips and recurring production packages.',
      items: ['Remote recording setup', 'Production coordination', 'Interview recording', 'Editing workflow management', 'Clips', 'Recurring production packages'],
    },
    targetCustomers: ['Podcasters', 'Consultants', 'Agencies', 'SaaS companies', 'Educators', 'Executives', 'Creators', 'Businesses producing interviews or recurring video/audio content'],
    howItWorks: [
      { stepNumber: 1, title: 'Choose deliverables', description: 'Choose a production niche and deliverables.' },
      { stepNumber: 2, title: 'Create packages', description: 'Create a fixed episode or monthly package.' },
      { stepNumber: 3, title: 'Set standards', description: 'Set up recording standards and client/guest workflow.' },
      { stepNumber: 4, title: 'Record remotely', description: 'Record sessions remotely in Riverside.' },
      { stepNumber: 5, title: 'Package deliverables', description: 'Edit/package the agreed deliverables.' },
      { stepNumber: 6, title: 'Charge for production', description: 'Charge per episode, project or recurring monthly production package.' },
    ],
    exampleBusinessModel: {
      customerPrice: 'Agency-defined',
      scenarios: ['Production fees are agency-defined. Do not guarantee audience growth, downloads, views or customer acquisition.'],
      disclaimer,
    },
    platformCosts: [
      {
        planName: 'Riverside plan',
        price: 'Plan varies',
        description: 'Riverside pricing varies by plan and usage.',
        details: 'Keep Plan varies unless current pricing is maintained separately.',
      },
    ],
    whyProvider: [
      {
        title: 'Remote production workflows',
        description:
          'Riverside provides remote high-quality audio/video recording and creator production workflows, allowing the agency to sell production expertise without building recording infrastructure.',
      },
    ],
    requirements: [
      { label: 'Coordination', value: 'Production coordination' },
      { label: 'Editing', value: 'Editing skill or partner' },
      { label: 'Quality', value: 'Quality control' },
      { label: 'Management', value: 'Client/guest management' },
    ],
    monetization: {
      type: 'Affiliate / Service',
      commissionType: 'Official affiliate program',
      commissionValue: "Riverside current official affiliate program advertises up to 30% recurring commission for referred subscriptions.",
    },
    status: 'published',
    featured: false,
    lastVerified: '2026-08-21T00:00:00Z',
  },
];
