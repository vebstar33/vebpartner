import React, { useState } from 'react';
import {
  Star,
  ExternalLink,
  Github,
  Bookmark,
  Flag,
  Code,
  Check,
  Copy,
  Clock,
  Calendar,
  Tag,
  Server,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  Layers,
  ChevronLeft,
  DollarSign,
  Mail,
  Smartphone,
  Globe,
  MessageCircle,
  Mic,
  Video,
  UserRound,
  FileText,
  LayoutGrid,
  ShoppingCart,
  Monitor,
  Headphones,
  MessageSquare,
  Shirt,
  Package,
  Download,
  Gauge,
  Search,
  MapPin,
  Send,
  Users,
  Share2,
  Workflow,
} from 'lucide-react';
import { ToolListing } from '../types';
import {
  getListingTypeCardClasses,
  getListingTypeLabel,
  getPartnerModelLabel,
} from '../lib/listingTypePresentation';
import { ProviderLogoPlate } from './ProviderLogoPlate';
import {
  VerifiedBadge,
  NovuLogo,
  OpenlaneLogo,
  CodeRabbitLogo,
  ProprietaryIcon,
  TechIcon,
  XTwitterIcon,
  ThreadsIcon,
  RedditIcon,
  HackerNewsIcon,
  FacebookIcon,
  LinkedInIcon,
  PinterestIcon,
  WhatsAppIcon,
} from './Icons';

interface ToolPageProps {
  listing: ToolListing;
  allListings?: ToolListing[];
  onBackToDirectory: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onUpvote: (id: string, e?: React.MouseEvent) => void;
  hasUpvoted: boolean;
  onSelectListing: (listing: ToolListing) => void;
  onReport?: () => void;
}

const businessIconMap = {
  Calendar,
  Download,
  FileText,
  Gauge,
  Globe,
  Headphones,
  LayoutGrid,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  Monitor,
  Package,
  Search,
  Send,
  Server,
  Share2,
  Shirt,
  ShoppingCart,
  Smartphone,
  Users,
  UserRound,
  Video,
  Workflow,
};

const BusinessIcon: React.FC<{ name?: string; className?: string }> = ({ name, className }) => {
  const Icon = businessIconMap[name as keyof typeof businessIconMap] || Workflow;
  return <Icon className={className} aria-hidden="true" />;
};

export const ToolPage: React.FC<ToolPageProps> = ({
  listing,
  allListings = [],
  onBackToDirectory,
  isBookmarked,
  onToggleBookmark,
  onUpvote,
  hasUpvoted,
  onSelectListing,
  onReport,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const listingTypeLabel = getListingTypeLabel(listing.listingType);
  const listingTypeClasses = getListingTypeCardClasses(listing.listingType);
  const opportunityStructureRows = [
    { label: 'Partner model', value: listing.partnerModel },
    { label: 'You sell', value: listing.youSell },
    { label: 'Provider handles', value: listing.providerHandles },
    { label: 'You earn through', value: listing.youEarnThrough },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Find similar listings
  const similarTools = allListings
    .filter(
      (l) =>
        l.id !== listing.id &&
        (listing.similarProjects?.includes(l.id) ||
          l.category === listing.category ||
          l.replaces?.some((r) => listing.replaces?.includes(r)))
    )
    .slice(0, 2);

  // 12 Featured project icons for right sidebar widget
  const featuredProjects = allListings.slice(0, 12);

  return (
    <div className="w-full text-zinc-200">
      {/* Top Banner Advertisement (Exact match to screenshot) */}
      <div className="border-b border-zinc-800/80 bg-[#09090b] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-zinc-300 flex-wrap justify-center sm:justify-start">
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              Ad
            </span>
            <div className="flex items-center gap-1.5 font-medium">
              <OpenlaneLogo className="w-4 h-4" />
              <span className="font-semibold text-white">Openlane</span>
              <span className="text-zinc-400">– Open-source, developer-first platform for automated compliance, risk management, and built-in Trust Center.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://openlane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <span>Learn More</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Tool Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back breadcrumb navigation */}
        <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
          <button
            onClick={onBackToDirectory}
            className="flex items-center gap-1 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to all alternatives</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout (Screenshot: ~68% Left, ~32% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Tool Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header: Logo, Name, Verified Badge & Action Buttons */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Brand Logo */}
                {listing.businessIcon ? (
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shadow-sm shrink-0">
                    <BusinessIcon name={listing.businessIcon} className="w-6 h-6" />
                  </div>
                ) : listing.id === 'novu' ? (
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 shadow-sm shrink-0">
                    <NovuLogo className="w-full h-full" />
                  </div>
                ) : listing.logoUrl ? (
                  <img
                    src={listing.logoUrl}
                    alt={listing.name}
                    className="w-12 h-12 rounded-xl object-cover bg-zinc-900 border border-zinc-800 p-1 shadow-sm shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {listing.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-2 min-w-0">
                  {listingTypeLabel && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${listingTypeClasses.badge}`}>
                        {listingTypeLabel}
                      </span>
                      {listing.listingType === 'opportunity' &&
                        listing.partnerModels?.map((partnerModel) => (
                          <span
                            key={partnerModel}
                            className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300"
                          >
                            {getPartnerModelLabel(partnerModel)}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {listing.name}
                    </h1>
                    {listing.verified && (
                      <VerifiedBadge className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save, Report, Embed */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => onToggleBookmark(listing.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isBookmarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#141414] hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={onReport || (() => alert('Listing reported for moderation review.'))}
                  className="p-2 rounded-lg bg-[#141414] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Report"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-[#141414] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Embed code"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tagline / Subtitle */}
            <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed font-normal">
              {listing.tagline || listing.description}
            </p>

            {/* "Powered by:" or "Open Source Alternative to:" Section */}
            {listing.isBlueprint || listing.providerName ? (
              <div className="space-y-2">
                <h3 className="text-xs font-normal text-zinc-400">
                  Powered by:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] border border-zinc-800 text-xs font-semibold text-white">
                    {!listing.providerLogoUrl && <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                    <ProviderLogoPlate
                      src={listing.providerLogoUrl}
                      name={listing.providerName || 'HighLevel'}
                      variant="detail"
                    />
                  </span>
                </div>
              </div>
            ) : listing.replaces && listing.replaces.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs font-normal text-zinc-400">
                  Open Source Alternative to:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.replaces.map((prop) => (
                    <span
                      key={prop}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-zinc-800 text-xs font-medium text-zinc-200"
                    >
                      <ProprietaryIcon name={prop} className="w-3.5 h-3.5 shrink-0" />
                      <span>{prop}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Action Buttons: Visit Tool / Start Business */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {listing.isBlueprint || listing.blueprintDetails ? (
                <a
                  href={listing.affiliateUrl || listing.websiteUrl || 'HIGHLEVEL_AFFILIATE_URL'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#f8b273] hover:bg-[#f59747] text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>Start This Business</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : (
                <>
                  <a
                    href={listing.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#f8b273] hover:bg-[#f59747] text-zinc-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <span>Visit {listing.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://sevalla.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>Host with Stellar Hosted</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </>
              )}
            </div>

            {/* Blueprint Specific Content OR Standard Tool Content */}
            {listing.isBlueprint || listing.blueprintDetails ? (
              <div className="space-y-8 pt-2">
                {/* Lead Paragraph */}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                  {listing.blueprintDetails?.leadParagraph ||
                    'Build a recurring-revenue business helping small businesses capture leads, manage customers, automate follow-ups, book appointments and generate reviews using HighLevel as the underlying platform.'}
                </p>

                {opportunityStructureRows.length > 0 && (
                  <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 sm:p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Partner Structure
                    </h3>
                    <div className="divide-y divide-zinc-800/80">
                      {opportunityStructureRows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1.5 sm:gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                            {row.label}
                          </span>
                          <span className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Overview Card */}
                <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Business Overview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Starting Cost</span>
                      <span className="font-semibold text-white font-mono">{listing.blueprintDetails?.startCost || '$97/month'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Revenue Model</span>
                      <span className="font-semibold text-zinc-200">{listing.blueprintDetails?.revenueModel || 'Recurring monthly revenue'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Difficulty</span>
                      <span className="font-semibold text-zinc-200">{listing.blueprintDetails?.difficulty || 'Easy–Medium'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Business Type</span>
                      <span className="font-semibold text-zinc-200">{listing.blueprintDetails?.businessType || 'B2B'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Inventory Required</span>
                      <span className="font-semibold text-zinc-200">{listing.blueprintDetails?.inventoryRequired || 'No'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Coding Required</span>
                      <span className="font-semibold text-zinc-200">{listing.blueprintDetails?.codingRequired || 'No'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Recurring Revenue</span>
                      <span className="font-semibold text-emerald-400">{listing.blueprintDetails?.recurringRevenue || 'Yes'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">White-Label Potential</span>
                      <span className="font-semibold text-emerald-400">{listing.blueprintDetails?.whiteLabel || 'Yes'}</span>
                    </div>
                  </div>
                </div>

                {/* What You Sell */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">What You Sell</h2>
                  <p className="text-xs sm:text-sm text-zinc-300">
                    {listing.blueprintDetails?.whatYouSellDescription || 'Create a packaged CRM and marketing automation service for small businesses.'}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      A package can include:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {(listing.blueprintDetails?.whatYouSellItems || [
                        'CRM',
                        'Lead capture',
                        'Sales pipelines',
                        'Automated email follow-up',
                        'Automated SMS follow-up',
                        'Appointment booking',
                        'Review requests',
                        'Website chat',
                        'Funnels',
                        'Landing pages',
                        'Customer communication',
                        'Marketing workflows',
                      ]).map((item) => (
                        <div key={item} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#141414] border border-zinc-800/80 text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 italic pt-1">
                    {listing.blueprintDetails?.whatYouSellNote || 'Do not present every feature as mandatory. The business owner chooses which services to package.'}
                  </p>
                </div>

                {/* Who You Sell To */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Who You Sell To</h2>
                  <p className="text-xs sm:text-sm text-zinc-300">Potential customers include:</p>
                  <div className="flex flex-wrap gap-2">
                    {(listing.blueprintDetails?.targetCustomers || [
                      'Dentists',
                      'Salons',
                      'Gyms',
                      'Real-estate businesses',
                      'Contractors',
                      'Home-service businesses',
                      'Consultants',
                      'Local service businesses',
                      'Agencies',
                      'Other appointment-based businesses',
                    ]).map((customer) => (
                      <span key={customer} className="px-3 py-1.5 rounded-lg bg-[#141414] border border-zinc-800 text-xs sm:text-sm font-medium text-zinc-200">
                        {customer}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How The Business Works */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">How The Business Works</h2>
                  <div className="space-y-3">
                    {(listing.blueprintDetails?.howItWorksSteps || [
                      {
                        stepNumber: 1,
                        title: 'Choose a niche',
                        description: 'Select one type of business to target.',
                        example: 'Dentists',
                      },
                      {
                        stepNumber: 2,
                        title: 'Create an offer',
                        description: 'Package the CRM and automation functionality into one simple monthly service.',
                        example: 'CRM + booking + automated follow-up + review system',
                      },
                      {
                        stepNumber: 3,
                        title: 'Configure the platform',
                        description: 'Use HighLevel to create the CRM, workflows, booking system and other functionality included in the offer.',
                      },
                      {
                        stepNumber: 4,
                        title: 'Find customers',
                        description: 'Sell the packaged service to businesses in the selected niche.',
                      },
                      {
                        stepNumber: 5,
                        title: 'Create the customer account',
                        description: "Configure the customer's account and required automations.",
                      },
                      {
                        stepNumber: 6,
                        title: 'Charge recurring revenue',
                        description: 'Charge the customer monthly for continued access to the service.',
                      },
                    ]).map((step) => (
                      <div key={step.stepNumber} className="p-4 rounded-xl bg-[#141414] border border-zinc-800/80 space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                            {step.stepNumber}
                          </span>
                          <h3 className="font-bold text-white text-sm sm:text-base">{step.title}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 pl-8 leading-relaxed">{step.description}</p>
                        {step.example && (
                          <div className="pl-8 pt-1 flex items-center gap-2 text-xs">
                            <span className="text-zinc-500">Example:</span>
                            <code className="font-mono text-emerald-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-[11px]">
                              {step.example}
                            </code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Business Model */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Example Business Model</h2>
                  <p className="text-xs text-zinc-400">
                    Clearly label this section as an <strong className="text-zinc-200">example</strong>, not expected earnings or guaranteed income.
                  </p>
                  <div className="p-5 rounded-2xl bg-[#141414] border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-zinc-400">Example customer price:</span>
                      <code className="font-mono font-bold text-white bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        {listing.blueprintDetails?.exampleBusinessModel?.customerPrice || '$199/month'}
                      </code>
                    </div>
                    <div className="space-y-2 pt-1 font-mono text-xs sm:text-sm">
                      {(listing.blueprintDetails?.exampleBusinessModel?.scenarios || [
                        '10 customers × $199/month = $1,990/month gross revenue',
                        '25 customers × $199/month = $4,975/month gross revenue',
                      ]).map((scenario, sIdx) => (
                        <div key={sIdx} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200">
                          {scenario}
                        </div>
                      ))}
                    </div>
                    <blockquote className="text-xs text-zinc-500 italic pt-2 border-t border-zinc-800/80">
                      {listing.blueprintDetails?.exampleBusinessModel?.disclaimer ||
                        'These figures are illustrative examples only. Pricing, expenses, customer acquisition and actual results vary.'}
                    </blockquote>
                  </div>
                </div>

                {/* Platform Costs */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Platform Costs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {(listing.blueprintDetails?.platformCosts || [
                      {
                        planName: 'Starter',
                        price: '$97/month',
                        description: 'Suitable for testing the business model or operating with a small number of sub-accounts.',
                        details: 'Includes up to 3 sub-accounts.',
                      },
                      {
                        planName: 'Unlimited',
                        price: '$297/month',
                        description: 'Designed for growing agencies.',
                        details: 'Includes unlimited sub-accounts.',
                      },
                      {
                        planName: 'Agency Pro',
                        price: '$497/month',
                        description: 'Designed for agencies wanting to operate a more automated SaaS-style business.',
                        details: 'Includes SaaS Mode and automated sub-account creation.',
                      },
                    ]).map((plan) => (
                      <div key={plan.planName} className="p-4 rounded-xl bg-[#141414] border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
                            <h3 className="font-bold text-white text-sm">{plan.planName}</h3>
                            <span className="font-mono text-emerald-400 font-bold text-xs">{plan.price}</span>
                          </div>
                          <p className="text-xs text-zinc-300 pt-2 leading-relaxed">{plan.description}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60 font-mono">{plan.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Provider */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Why {listing.providerName || 'HighLevel'}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(listing.blueprintDetails?.whyProviderReasons || [
                      {
                        title: 'All-in-one platform',
                        description: 'HighLevel combines functionality such as CRM, pipelines, booking, websites, funnels, workflows and customer communication within one platform.',
                      },
                      {
                        title: 'Built for agencies',
                        description: 'Higher plans support multiple client sub-accounts, with Unlimited supporting unlimited sub-accounts.',
                      },
                      {
                        title: 'White-label potential',
                        description: 'Agency-oriented plans provide branding and white-label capabilities.',
                      },
                      {
                        title: 'SaaS potential',
                        description: 'Agency Pro includes SaaS Mode, which can automate parts of account creation and recurring SaaS delivery.',
                      },
                    ]).map((reason) => (
                      <div key={reason.title} className="p-4 rounded-xl bg-[#141414] border border-zinc-800 space-y-1.5">
                        <h3 className="font-bold text-white text-sm">{reason.title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{reason.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What You Need */}
                <div className="space-y-4 pt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">What You Need</h2>
                  <div className="p-5 rounded-2xl bg-[#141414] border border-zinc-800 space-y-2 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {(listing.blueprintDetails?.requirements || [
                        { label: 'Platform', value: 'HighLevel' },
                        { label: 'Minimum platform cost', value: '$97/month' },
                        { label: 'Inventory', value: 'None' },
                        { label: 'Coding', value: 'Not required' },
                        { label: 'Customer type', value: 'Businesses' },
                        { label: 'Revenue model', value: 'Monthly recurring revenue' },
                        { label: 'Can scale to multiple customers', value: 'Yes' },
                        { label: 'White-label potential', value: 'Yes' },
                      ]).map((req) => (
                        <div key={req.label} className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                          <span className="text-zinc-400">{req.label}</span>
                          <span className={`font-medium ${req.value === 'Yes' ? 'text-emerald-400' : 'text-white'}`}>
                            {req.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Start This Business CTA Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#18181b] to-[#111113] border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{listing.providerName || 'HighLevel'}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          From {listing.blueprintDetails?.startCost || '$97/month'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        {listing.blueprintDetails?.ctaData?.supportingText || 'CRM and marketing automation platform for agencies and businesses.'}
                      </p>
                    </div>
                    <a
                      href={listing.affiliateUrl || listing.websiteUrl || 'HIGHLEVEL_AFFILIATE_URL'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-[#f8b273] hover:bg-[#f59747] text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                      <span>Start This Business</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Product Interface Preview Mockup */}
                <div className="rounded-xl border border-zinc-800 bg-[#0d0d10] overflow-hidden shadow-2xl">
                  {listing.id === 'novu' ? (
                    <div className="p-6 sm:p-8 bg-gradient-to-b from-[#121218] to-[#09090c] text-white space-y-6">
                      {/* Top Mockup Header Bar */}
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 text-xs text-zinc-400">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <NovuLogo className="w-5 h-5" />
                            <span className="font-bold text-white text-sm">Novu</span>
                          </div>
                          <span className="text-zinc-500 hidden sm:inline">Product</span>
                          <span className="text-zinc-500 hidden sm:inline">Resources</span>
                          <span className="text-zinc-500 hidden sm:inline">Docs</span>
                          <span className="text-zinc-500 hidden sm:inline">Customers</span>
                          <span className="text-zinc-500 hidden sm:inline">Pricing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-400 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            39.5k
                          </span>
                          <button className="px-2.5 py-1 rounded bg-zinc-800 text-white font-medium text-[11px]">
                            Get Started
                          </button>
                        </div>
                      </div>

                      {/* Mockup Headline */}
                      <div className="text-center space-y-3 max-w-lg mx-auto py-2">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                          The communication infrastructure for agents and products
                        </h2>
                        <p className="text-xs text-zinc-400">
                          One platform to connect your products and your agents to every channel your users live on: Inbox, Email, SMS, Push, Chat, Slack, Microsoft Teams, Resend, and more.
                        </p>
                        <div className="flex justify-center gap-2 pt-2">
                          <span className="px-3 py-1 rounded bg-zinc-200 text-zinc-950 font-bold text-xs">Start for free</span>
                          <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-200 font-medium text-xs">Visit Doc</span>
                        </div>
                      </div>

                      {/* Mockup Notification Inbox Component Floating UI */}
                      <div className="rounded-lg bg-[#14141c] border border-zinc-800 p-4 max-w-md mx-auto shadow-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Inbox</span>
                            <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono">3 new</span>
                          </div>
                          <span className="text-zinc-500 text-[11px]">Mark all as read</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800 flex items-start justify-between">
                            <div>
                              <div className="font-medium text-zinc-200">Deployment Succeeded</div>
                              <div className="text-[11px] text-zinc-400">Production pipeline deployed in 42s</div>
                            </div>
                            <span className="text-[10px] text-zinc-500">2m ago</span>
                          </div>
                          <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/60 flex items-start justify-between">
                            <div>
                              <div className="font-medium text-zinc-200">New team member joined</div>
                              <div className="text-[11px] text-zinc-400">sarah@company.com joined workspace</div>
                            </div>
                            <span className="text-[10px] text-zinc-500">1h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : listing.screenshotUrl ? (
                    <img
                      src={listing.screenshotUrl}
                      alt={`${listing.name} dashboard`}
                      className="w-full h-auto max-h-[420px] object-cover"
                    />
                  ) : (
                    <div className="p-12 text-center bg-gradient-to-b from-zinc-900 to-[#101014] space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-300 font-bold">
                        {listing.name.slice(0, 2)}
                      </div>
                      <h3 className="text-lg font-bold text-white">{listing.name} Interface</h3>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        Full open-source platform with native self-hosting capabilities and modern UI.
                      </p>
                    </div>
                  )}
                </div>

                {/* Rich Markdown Article Description */}
                <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                  {listing.detailedParagraphs && listing.detailedParagraphs.length > 0 ? (
                    listing.detailedParagraphs.map((para, idx) => (
                      <p key={idx}>
                        {idx === 0 ? (
                          <>
                            <strong>{listing.name}</strong> gives developers a single platform to{' '}
                            <strong>handle notifications across every channel</strong>: in-app inbox, email, push, SMS, and chat. Instead of wiring together separate providers for each channel, you get one API and a visual workflow editor that covers the full delivery pipeline.
                          </>
                        ) : idx === 1 ? (
                          <>
                            The embeddable <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200 font-mono text-[11px]">&lt;Inbox /&gt;</code> component drops a fully functional notification center into any React, Next.js, or Remix app. It includes real-time delivery, user preference controls, snooze, read/archive states, and tabbed filtering out of the box. The visual appearance is customizable to match your product.
                          </>
                        ) : idx === 2 ? (
                          <>
                            For email, {listing.name} includes a block-based editor powered by React Email. Build and preview templates without touching raw HTML. A <strong>digest engine</strong> batches multiple events into a single message, which cuts noise on things like comment threads or activity feeds.
                          </>
                        ) : idx === 3 ? (
                          <>
                            Workflows can start in the UI and graduate to code when you need runtime logic, local data access, or tighter control over branching. If you've looked at <strong>alternatives like Knock</strong> or <strong>Courier</strong>, {listing.name} covers similar ground but with a self-hostable option. Integrations include Twilio, Resend, Clerk, and Stripe.
                          </>
                        ) : (
                          <>
                            {para}
                          </>
                        )}
                      </p>
                    ))
                  ) : (
                    <>
                      <p>
                        <strong>{listing.name}</strong> gives developers a comprehensive open-source solution to avoid proprietary SaaS vendor lock-in.
                      </p>
                      <p>
                        With zero telemetry tracking, full self-hosting Docker scripts, and active community maintenance, you can deploy {listing.name} on your own infrastructure or cloud VPC.
                      </p>
                      <p>
                        The project has over {(listing.stars || 1000).toLocaleString()} GitHub stars and dozens of active open-source contributors.
                      </p>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Categories Section */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-white">Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {(listing.categoriesList || [listing.category]).map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-lg bg-[#141414] border border-zinc-800 text-xs font-medium text-zinc-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags Section (With bullets like screenshot: • typescript • react...) */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white">Tags:</h4>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-400">
                {listing.tags?.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 hover:text-zinc-200 transition-colors">
                    <span className="text-zinc-600">•</span>
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Built With Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white">Built with:</h4>
              <div className="flex flex-wrap gap-2">
                {listing.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-zinc-800 text-xs font-medium text-zinc-300"
                  >
                    <TechIcon name={tech} className="w-3.5 h-3.5" />
                    <span>{tech}</span>
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-zinc-800 text-xs font-medium text-zinc-400">
                  +74 more
                </span>
              </div>
            </div>

            {/* Bottom Actions & Social Sharing Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 text-xs">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 text-zinc-300 font-medium border border-zinc-800 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Link [C]'}</span>
              </button>

              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-500 mr-1">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out ${listing.name} on OpenAlternative&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on X / Twitter"
                >
                  <XTwitterIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on Threads"
                >
                  <ThreadsIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://reddit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on Reddit"
                >
                  <RedditIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://news.ycombinator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on Hacker News"
                >
                  <HackerNewsIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on LinkedIn"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on Pinterest"
                >
                  <PinterestIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#141414] hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Similar Open Source Projects Section (Screenshot 1: Dittofeed card) */}
            <div className="space-y-4 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">Similar open source projects</h3>
                  <div className="h-px w-16 sm:w-32 bg-zinc-800" />
                </div>
                <button
                  onClick={onBackToDirectory}
                  className="px-3 py-1 rounded-lg border border-zinc-800 bg-[#141414] hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Check {listing.name} alternatives</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarTools.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectListing(sim)}
                    className="p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                        {sim.name.slice(0, 1)}
                      </div>
                      <span className="font-bold text-white text-sm group-hover:text-zinc-200">
                        {sim.name}
                      </span>
                      {sim.verified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {sim.tagline || sim.description}
                    </p>

                    {/* Dotted Leader Line Metrics */}
                    <div className="space-y-1.5 pt-1 text-[11px] text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-zinc-500" />
                          <span>Stars</span>
                        </span>
                        <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                        <span className="text-zinc-200 font-mono font-semibold">
                          {(sim.stars || 2897).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>Last commit</span>
                        </span>
                        <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                        <span className="text-zinc-300 font-mono">
                          {sim.lastCommit || '5 months ago'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3 text-zinc-500" />
                          <span>License</span>
                        </span>
                        <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                        <span className="text-zinc-300 font-mono">
                          {sim.license || 'MIT'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets (Live GitHub Graph, CodeRabbit Ad, Featured Projects, Newsletter) */}
          <div className="lg:col-span-4 space-y-5">
            {/* WIDGET 1: Blueprint Key Metrics OR GitHub Stars & Sparkline */}
            {listing.isBlueprint || listing.startCost ? (
              <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-base">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{listing.startCost || '$97/mo'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {listing.revenueModel || 'Recurring'}
                  </span>
                </div>

                {/* Metrics with Dotted Leader Lines */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Provider</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.providerName || 'HighLevel'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Difficulty</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.difficulty || 'Easy–Medium'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Inventory Req.</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.blueprintDetails?.inventoryRequired || 'No'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Coding Req.</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.blueprintDetails?.codingRequired || 'No'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-zinc-500" />
                      <span>White-Label</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-emerald-400 font-mono font-medium">{listing.blueprintDetails?.whiteLabel || 'Yes'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-base">
                    <Star className="w-4 h-4 text-zinc-400" />
                    <span>{(listing.stars || 39531).toLocaleString()} stars</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {listing.starsChange30d || '+205 (+0.5%)'}
                  </span>
                </div>

                {/* Glowing Neon Green Sparkline Graph with "Last 30 days" */}
                <div className="relative h-14 w-full pt-1">
                  <svg viewBox="0 0 200 40" className="w-full h-full text-emerald-400 stroke-current fill-none">
                    <path
                      d="M 0,35 Q 40,32 70,28 T 130,18 T 170,8 T 200,3"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0,35 Q 40,32 70,28 T 130,18 T 170,8 T 200,3 L 200,40 L 0,40 Z"
                      fill="currentColor"
                      className="opacity-15"
                    />
                  </svg>
                  <div className="text-right text-[10px] text-zinc-500 -mt-1 font-mono">
                    Last 30 days
                  </div>
                </div>

                {/* Metrics with Dotted Leader Lines */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Last commit</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.lastCommit || '8 hours ago'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Repository age</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.repoAge || '5 years'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Version</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.version || 'v3.19.0'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Self-hosted</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <span className="text-zinc-100 font-mono font-medium">{listing.selfHosted || 'Yes'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Repository</span>
                    </span>
                    <div className="flex-1 mx-2 border-b border-dotted border-zinc-800" />
                    <a
                      href={listing.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f8b273] hover:underline font-mono font-medium"
                    >
                      {listing.repoName || 'novuhq/novu'}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET 2: CodeRabbit Sponsored Ad Box */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800/90 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CodeRabbitLogo className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="font-bold text-white text-sm">CodeRabbit</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                  Ad
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                The leading AI Code Review platform. Ship better quality code in 50% less time, with 90% fewer bugs.
              </p>

              <a
                href="https://coderabbit.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Try it for free</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* WIDGET 3: Featured Projects Icon Grid (2 Rows x 6 Columns = 12 Project Icons) */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800/90 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300">
                Featured projects:
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {featuredProjects.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onSelectListing(tool)}
                    title={tool.name}
                    className="w-9 h-9 rounded-lg bg-[#181818] border border-zinc-800 hover:border-zinc-600 p-1.5 flex items-center justify-center transition-all hover:scale-105 group"
                  >
                    {tool.businessIcon ? (
                      <BusinessIcon name={tool.businessIcon} className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                    ) : tool.id === 'novu' ? (
                      <NovuLogo className="w-full h-full" />
                    ) : tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">
                        {tool.name.slice(0, 2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* WIDGET 4: Newsletter Subscription Box */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800/90 space-y-3">
              <h4 className="text-sm font-bold text-white">Subscribe to our newsletter</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every Sunday we deconstruct one proprietary app and pick the best open source alternatives worth switching to.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubscribed(true);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#181818] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shrink-0"
                >
                  {newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
