'use client';

import { useState, useEffect } from 'react';
import { FilterOptions, HackathonData } from '@/types';
import { HackathonCard } from '@/components/hackathon-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import { NaturalSearchBar } from '@/components/natural-search-bar';
import { Filter, SlidersHorizontal, ArrowUpDown, Layers, MapPin, X } from 'lucide-react';

export default function DiscoverPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchHackathons(filters);
  }, [filters]);

  const fetchHackathons = async (currentFilters: FilterOptions) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.keyword) params.set('keyword', currentFilters.keyword);
      if (currentFilters.mode && currentFilters.mode !== 'ALL') params.set('mode', currentFilters.mode);
      if (currentFilters.state) params.set('state', currentFilters.state);
      if (currentFilters.city) params.set('city', currentFilters.city);
      if (currentFilters.status) params.set('status', currentFilters.status);
      if (currentFilters.minPrize) params.set('minPrize', currentFilters.minPrize.toString());
      if (currentFilters.studentOnly) params.set('studentOnly', 'true');
      if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);
      if (currentFilters.themes && currentFilters.themes.length > 0) {
        params.set('themes', currentFilters.themes.join(','));
      }

      const res = await fetch(`/api/hackathons?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setHackathons(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalQuery = (interpreted: FilterOptions, rawText: string) => {
    setFilters((prev) => ({
      ...interpreted,
      keyword: rawText,
    }));
  };

  const clearFilter = (key: keyof FilterOptions) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Natural Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discover Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, and track verified hackathons across all major aggregators and universities.
          </p>
        </div>

        <NaturalSearchBar onApplyFilters={handleNaturalQuery} initialQuery={filters.keyword || ''} />
      </div>

      {/* Main Grid: Sidebar + List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#1e293b]">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#111726] border border-[#1e293b] text-xs font-semibold text-white"
          >
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Hackathons'}</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            {hackathons.length} Events Found
          </span>
        </div>

        {/* Sidebar */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <FilterSidebar
            filters={filters}
            onChange={(updated) => setFilters(updated)}
            onReset={() => setFilters({})}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Count, Active Filter Badges, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726] border border-[#1e293b] rounded-lg p-3 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">
                {loading ? 'Searching...' : `${hackathons.length} hackathons`}
              </span>

              {/* Active Badges */}
              {filters.mode && filters.mode !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                  {filters.mode}
                  <button onClick={() => clearFilter('mode')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.state && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  <MapPin className="w-2.5 h-2.5" />
                  {filters.state} {filters.city ? `(${filters.city})` : ''}
                  <button onClick={() => { clearFilter('state'); clearFilter('city'); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.status && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                  {filters.status}
                  <button onClick={() => clearFilter('status')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy || 'deadline'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-[#090d16] border border-[#1e293b] text-slate-200 text-xs rounded px-2.5 py-1 outline-none focus:border-blue-500"
              >
                <option value="deadline">Sort by: Registration Deadline</option>
                <option value="startDate">Sort by: Event Date</option>
                <option value="prize">Sort by: Prize Pool (Highest)</option>
                <option value="recentlyAdded">Sort by: Recently Discovered</option>
              </select>
            </div>
          </div>

          {/* Cards Grid or Skeletons or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-12 bg-slate-800/50 rounded" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : hackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hackathons.map((h) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  No hackathons currently match these filters
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters to discover more events.
                </p>
              </div>

              <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                <div>• Remove state/city filter</div>
                <div>• Include online & hybrid events</div>
                <div>• Reset prize range</div>
              </div>

              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
