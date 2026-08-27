import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Building2,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  BarChart,
  Users,
  Eye,
  MousePointer,
  CheckCircle2,
} from 'lucide-react';
import { CustomPage, SiteSettings, Advertisement } from '../types';

interface PageViewProps {
  page: CustomPage;
  siteSettings: SiteSettings;
  onBack: () => void;
  onNavigatePage: (slug: string) => void;
  onOpenSubmitModal: () => void;
  allPages: CustomPage[];
  ads?: Advertisement[];
  onAdClick?: (adId: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({
  page,
  siteSettings,
  onBack,
  onNavigatePage,
  onOpenSubmitModal,
  allPages,
  ads = [],
  onAdClick,
}) => {
  const [copied, setCopied] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
  };

  // Pre-formatted FAQ items for FAQ page
  const FAQ_ITEMS = [
    {
      q: 'What is Vebpartner?',
      a: 'Vebpartner is a directory of business opportunities, platforms and tools for people researching businesses they can actually start.',
    },
    {
      q: 'How are tools evaluated and verified?',
      a: 'Listings on Vebpartner are organized to clarify the provider, business model, partner structure and practical use case where that information is available.',
    },
    {
      q: 'Can I compare business models on Vebpartner?',
      a: 'Yes. You can browse by category, listing type and partner model to compare opportunities, platforms and tools.',
    },
    {
      q: 'How can I submit an opportunity?',
      a: 'Use the Submit an Opportunity page or the submission button to suggest a business opportunity, platform, tool, partner program or relevant service for review.',
    },
    {
      q: 'How does Vebpartner fund its operations?',
      a: 'Vebpartner may be supported by sponsorships and affiliate relationships, while listing content remains organized for public research.',
    },
    {
      q: 'How do I advertise or sponsor on Vebpartner?',
      a: 'Visit the Advertise / Sponsor page or contact sponsor@vebpartner.com to discuss featured listings, sponsored placements, category sponsorships or custom partnerships.',
    },
  ];

  // Sponsorship packages for Advertise page
  const SPONSOR_PACKAGES = [
    {
      name: 'Featured Listing',
      price: 'Contact',
      period: '',
      badge: 'Maximum Reach',
      description: 'Prominent visibility for a relevant provider, platform, tool or business opportunity.',
      features: [
        'Featured placement in relevant directory areas',
        'Clear sponsor label and custom CTA',
        'Direct link to your landing page',
        'Campaign reporting options on request',
      ],
      highlight: true,
    },
    {
      name: 'Category Sponsorship',
      price: 'Contact',
      period: '',
      badge: 'High Intent',
      description: 'Sponsor a category aligned with your ideal business-builder audience.',
      features: [
        'Visibility in selected category contexts',
        'Sponsor badge and concise positioning',
        'Custom CTA and campaign destination',
        'Relevant audience targeting by business type',
      ],
      highlight: false,
    },
    {
      name: 'Custom Partnership',
      price: 'Contact',
      period: '',
      badge: 'Partnership',
      description: 'Tailored visibility for partner programs, reseller offers and promoted opportunities.',
      features: [
        'Custom placement strategy',
        'Promoted business opportunity positioning',
        'Partner visibility across relevant journeys',
        'Optional campaign support from Vebpartner',
      ],
      highlight: false,
    },
  ];

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const normalizedText = text
      .replace(/\\\*\\\*\s*(\*\*[^*]+?\*\*)\s*\\\*\\\*/g, '$1')
      .replace(/\\\*/g, '*');
    const parts: React.ReactNode[] = [];
    const boldPattern = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = boldPattern.exec(normalizedText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(normalizedText.slice(lastIndex, match.index));
      }

      parts.push(
        <strong key={`${match.index}-${match[1]}`} className="font-bold text-zinc-100">
          {match[1]}
        </strong>
      );
      lastIndex = boldPattern.lastIndex;
    }

    if (lastIndex < normalizedText.length) {
      parts.push(normalizedText.slice(lastIndex));
    }

    return parts.length ? parts : normalizedText;
  };

  // Helper to render markdown content with styling
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight">
            {renderInlineMarkdown(trimmed.replace('# ', ''))}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-zinc-100 mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
            {renderInlineMarkdown(trimmed.replace('### ', ''))}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 tracking-tight">
            {renderInlineMarkdown(trimmed.replace('## ', ''))}
          </h2>
        );
      }
      if (trimmed.startsWith('- ')) {
        const itemText = trimmed.replace('- ', '');
        return (
          <li key={idx} className="text-zinc-300 text-sm sm:text-base leading-relaxed ml-4 list-disc marker:text-emerald-500 my-1.5">
            {renderInlineMarkdown(itemText)}
          </li>
        );
      }
      if (trimmed.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="text-zinc-300 text-sm sm:text-base leading-relaxed ml-4 list-decimal marker:text-emerald-400 font-medium my-2">
            {renderInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-zinc-300 text-sm sm:text-base leading-relaxed my-2.5">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-zinc-100 pb-28">
      {/* Top Header / Breadcrumbs Bar */}
      <div className="border-b border-white/[0.06] bg-[#0c0d14]/90 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">/</span>

            <span className="text-xs text-zinc-400 font-medium hidden sm:inline capitalize">
              {page.category || 'Pages'}
            </span>

            <span className="text-zinc-600 hidden sm:inline">/</span>

            <span className="text-xs text-emerald-400 font-semibold truncate max-w-[200px] sm:max-w-none">
              {page.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-10">
        {/* Page Hero Header */}
        <div className="space-y-4">
          {page.badge && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              <span>{page.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-3xl">
              {page.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Updated {new Date(page.lastUpdated || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Vebpartner Publication</span>
            </div>
          </div>
        </div>

        {/* Dynamic Page Specific Interactive Modules */}

        {/* 1. ADVERTISE PAGE: Pricing & Sponsorship Matrix */}
        {page.slug === 'advertise' && (
          <div className="space-y-8 my-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SPONSOR_PACKAGES.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    pkg.highlight
                      ? 'bg-[#151c24] border-emerald-500/40 shadow-sm'
                      : 'bg-[#0d0f17] border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                          pkg.highlight
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">{pkg.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{pkg.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-2">
                      <span className="text-3xl font-extrabold text-white font-mono">{pkg.price}</span>
                      <span className="text-xs text-zinc-400">{pkg.period}</span>
                    </div>

                    <div className="space-y-2 border-t border-white/[0.08] pt-4">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="mailto:sponsor@vebpartner.com?subject=Sponsorship%20Inquiry%20-%20Vebpartner"
                    className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center ${
                      pkg.highlight
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    <span>Reserve Placement</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Sponsorship focus areas */}
            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-sm sm:text-base font-extrabold text-white">Listings</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Featured providers</div>
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">Categories</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Sponsor placements</div>
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-white">Programs</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Promoted opportunities</div>
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400">Partners</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Custom campaigns</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. FAQ ACCORDIONS (if on FAQ page) */}
        {page.slug === 'faq' && (
          <div className="space-y-3 my-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Frequently Asked Questions</span>
            </h3>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-[#0d0f17] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-zinc-100">{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-zinc-300 text-xs sm:text-sm leading-relaxed border-t border-white/[0.04]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 3. CONTACT FORM (if on Contact page) */}
        {page.slug === 'contact' && (
          <div className="my-8 p-6 sm:p-8 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Send Us a Direct Message</h3>
                <p className="text-xs text-zinc-400">We typically respond within 12–24 hours on business days.</p>
              </div>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-zinc-300">
                  Thank you, <span className="font-semibold text-white">{contactName}</span>. Our team will get back to you at{' '}
                  <span className="font-semibold text-white">{contactEmail}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactMessage('');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Inquiry Type</label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Sponsorship / Advertising">Sponsorship / Advertising</option>
                    <option value="Tool Listing Update / Verification">Tool Listing Update / Verification</option>
                    <option value="Partnership & Integration">Partnership & Integration</option>
                    <option value="Security Report">Security Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Render Formatted Markdown Body */}
        <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4 pt-4 border-t border-white/[0.06]">
          {renderMarkdownContent(page.contentMarkdown)}
        </div>

        {/* Other Pages Navigation Carousel */}
        <div className="pt-12 border-t border-white/[0.08] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Explore More on Vebpartner</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allPages
              .filter((p) => p.slug !== page.slug && p.published)
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => onNavigatePage(p.slug)}
                  className="p-4 rounded-xl bg-[#0d0f17] hover:bg-zinc-800/80 border border-white/[0.06] hover:border-white/[0.15] text-left transition-all group cursor-pointer"
                >
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {p.badge || 'Guide'}
                  </div>
                  <div className="font-bold text-zinc-100 text-sm group-hover:text-emerald-300 transition-colors mt-1">
                    {p.title}
                  </div>
                  <div className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                    {p.subtitle || 'Read guide on Vebpartner'}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white">Know a great business resource?</h3>
            <p className="text-xs text-zinc-400">Submit a business opportunity, platform, tool, program or service for Vebpartner review.</p>
          </div>
          <button
            onClick={onOpenSubmitModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm whitespace-nowrap cursor-pointer transition-all active:scale-95"
          >
            Submit an Opportunity
          </button>
        </div>
      </div>
    </div>
  );
};
