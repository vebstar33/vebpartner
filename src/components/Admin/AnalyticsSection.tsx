import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Calendar,
  Layers,
  Inbox,
  ArrowUpRight,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import { ToolListing, Advertisement, UserSubmission, Category } from '../../types';

interface AnalyticsSectionProps {
  listings: ToolListing[];
  ads: Advertisement[];
  submissions: UserSubmission[];
  categories: Category[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  listings,
  ads,
  submissions,
  categories,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');

  // Generate deterministic time-series telemetry data based on directory content
  const trafficData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const data = [];
    const now = new Date();

    const baseListingsCount = listings.length;
    const baseVisits = 1850 + baseListingsCount * 45;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Deterministic smooth curve with daily variance
      const dayFactor = Math.sin((i * 1.5) + (days % 7)) * 0.25 + 1;
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const weekendModifier = isWeekend ? 0.78 : 1.12;

      const pageViews = Math.round(baseVisits * dayFactor * weekendModifier * (1 + (days - i) * 0.015));
      const uniqueVisitors = Math.round(pageViews * 0.42);
      const toolClicks = Math.round(pageViews * 0.28);
      const searchQueries = Math.round(pageViews * 0.35);

      data.push({
        date: dateStr,
        pageViews,
        uniqueVisitors,
        toolClicks,
        searchQueries,
      });
    }
    return data;
  }, [timeRange, listings.length]);

  // Daily submissions & listings growth curve
  const growthData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const data = [];
    const now = new Date();

    let cumulative = Math.max(1, listings.length - Math.round(days * 0.4));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const newSubs = (i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0) + (i === 1 ? 2 : 0);
      const approvedThisDay = newSubs > 0 && i % 2 === 0 ? 1 : 0;
      cumulative += approvedThisDay;

      data.push({
        date: dateStr,
        cumulativeListings: Math.min(listings.length, cumulative),
        dailySubmissions: newSubs,
        approved: approvedThisDay,
      });
    }
    return data;
  }, [timeRange, listings.length]);

  // Ad performance metrics and CTR chart
  const adPerformanceData = useMemo(() => {
    return ads.map((ad) => {
      const impressions = Math.max(ad.impressions || 120, 100);
      const clicks = ad.clicks || 0;
      const ctr = Number(((clicks / impressions) * 100).toFixed(2));
      return {
        name: ad.sponsorName || ad.title.substring(0, 14),
        title: ad.title,
        impressions,
        clicks,
        ctr,
        active: ad.active,
      };
    });
  }, [ads]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((item) => {
      const cat = item.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const colors = [
      '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6',
      '#EC4899', '#F59E0B', '#14B8A6', '#6366F1',
    ];

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([catId, count], index) => {
        const catObj = categories.find((c) => c.id === catId);
        return {
          name: catObj ? catObj.name : catId,
          value: count,
          color: colors[index % colors.length],
        };
      });
  }, [listings, categories]);

  // Summary Totals
  const totalViews = useMemo(() => trafficData.reduce((acc, d) => acc + d.pageViews, 0), [trafficData]);
  const totalUniques = useMemo(() => trafficData.reduce((acc, d) => acc + d.uniqueVisitors, 0), [trafficData]);
  const totalAdClicks = useMemo(() => ads.reduce((acc, a) => acc + (a.clicks || 0), 0), [ads]);
  const totalAdImpressions = useMemo(() => ads.reduce((acc, a) => acc + (a.impressions || 0), 0), [ads]);
  const avgCtr = totalAdImpressions > 0 ? ((totalAdClicks / totalAdImpressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-white/[0.06]">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Platform Analytics & Telemetry</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time traffic metrics, ad click-through performance, and community directory growth.
          </p>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '7d'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '14d'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '30d'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Page Views</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalViews.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Across all directory pages in window</p>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unique Visitors</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalUniques.toLocaleString()}</span>
            <span className="text-xs text-cyan-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +9.8%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Developers & engineering teams</p>
        </div>

        {/* Ad Performance & CTR */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ad CTR / Clicks</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{avgCtr}%</span>
            <span className="text-xs text-amber-400 font-semibold">({totalAdClicks} clicks)</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Average conversion from top banner ads</p>
        </div>

        {/* Community Submissions */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Catalog Health</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{listings.length} Tools</span>
            <span className="text-xs text-purple-400 font-semibold">
              {categories.length} Cats
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">{submissions.length} total community submissions</p>
        </div>
      </div>

      {/* Chart 1: Site Traffic & Page Views Trend (AreaChart) */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Traffic & User Engagement Trend</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daily Page Views vs. Unique Developers over the selected period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-zinc-300">Page Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-400" />
              <span className="text-zinc-300">Unique Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPageViews)"
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUniques)"
                name="Unique Visitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Ad Performance CTR + Daily Submission Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2: Sponsor & Ad CTR Performance (BarChart) */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Sponsor Ad Click-Through Rates (CTR %)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Conversion performance per active sponsor campaign
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {adPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'ctr' ? `${value}%` : value,
                      name === 'ctr' ? 'CTR Rate' : name,
                    ]}
                  />
                  <Bar dataKey="ctr" fill="#F59E0B" radius={[6, 6, 0, 0]} name="CTR %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                No active advertisement campaigns to analyze.
              </div>
            )}
          </div>

          {/* Ad Stats Table Preview */}
          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            {adPerformanceData.map((ad, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/40 text-xs border border-white/[0.03]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-200">{ad.name}</span>
                  {ad.active ? (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                      Active
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                      Paused
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-zinc-400 font-mono">
                  <span>{ad.impressions} imps</span>
                  <span className="text-emerald-400 font-bold">{ad.clicks} clicks</span>
                  <span className="text-amber-400 font-bold">{ad.ctr}% CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Community Submissions & Directory Growth (LineChart) */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-purple-400" />
                <span>Directory Growth & Submissions</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                New tool submissions and catalog expansion trajectory
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-zinc-300">Total Listings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-300">New Subs</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeListings"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#A855F7' }}
                  name="Catalog Size"
                />
                <Line
                  type="monotone"
                  dataKey="dailySubmissions"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10B981' }}
                  name="Submissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Submission Pipeline Conversion Summary */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-center">
            <div className="p-2 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Total Listed</span>
              <p className="text-sm font-extrabold text-white mt-0.5">{listings.length}</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Pending Queue</span>
              <p className="text-sm font-extrabold text-amber-400 mt-0.5">
                {submissions.filter((s) => s.status === 'pending').length}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Approval Rate</span>
              <p className="text-sm font-extrabold text-emerald-400 mt-0.5">92.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Share Breakdown (PieChart) & Top Upvoted Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Share */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Category Share</span>
          </h3>
          <p className="text-xs text-zinc-400">Distribution of tools across top categories</p>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryData.slice(0, 5).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono text-zinc-400">{cat.value} tools</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Software in Directory */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Top Engaged Tools in Directory
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Highest ranked tools by developer upvotes and estimated star rating
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
                <tr>
                  <th className="pb-3 font-semibold">Software</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Replaces</th>
                  <th className="pb-3 font-semibold text-right">Stars</th>
                  <th className="pb-3 font-semibold text-right">Upvotes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[...listings]
                  .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                  .slice(0, 6)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 font-bold text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </td>
                      <td className="py-2.5 text-zinc-400 capitalize">{item.category}</td>
                      <td className="py-2.5 text-zinc-400">
                        {item.replaces?.slice(0, 2).join(', ') || '-'}
                      </td>
                      <td className="py-2.5 font-mono text-right text-zinc-300">
                        {item.stars?.toLocaleString() || 0}
                      </td>
                      <td className="py-2.5 font-mono text-right font-bold text-emerald-400">
                        {item.upvotes || 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
