'use client';

import { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { interpretNaturalSearchQuery } from '@/lib/services/nlp-search.service';
import { FilterOptions } from '@/types';

interface NaturalSearchBarProps {
  onApplyFilters: (filters: FilterOptions, queryText: string) => void;
  initialQuery?: string;
}

export function NaturalSearchBar({ onApplyFilters, initialQuery = '' }: NaturalSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [interpreting, setInterpreting] = useState(false);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      onApplyFilters({}, '');
      setLastExplanation(null);
      return;
    }

    setInterpreting(true);
    try {
      const result = await interpretNaturalSearchQuery(query);
      setLastExplanation(result.explanation);
      onApplyFilters(result.interpretedFilters, query);
    } catch (err) {
      console.error(err);
      onApplyFilters({ keyword: query }, query);
    } finally {
      setInterpreting(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setLastExplanation(null);
    onApplyFilters({}, '');
  };

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSearch} className="relative flex items-center shadow-md shadow-black/20">
        <div className="absolute left-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search keywords or enter natural query (e.g. 'offline AI hackathons in Jaipur with prize > 1 lakh')"
          className="w-full bg-[#101728] border border-[#1d293f] focus:border-blue-500 text-white text-sm rounded-xl pl-11 pr-32 py-3.5 outline-none placeholder:text-slate-500 font-sans transition-all focus:ring-1 focus:ring-blue-500"
        />

        <div className="absolute right-2.5 flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-[#1a253a] transition-colors"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={interpreting}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
          >
            {interpreting ? (
              <span className="animate-spin text-xs">⌛</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Structured interpretation banner */}
      {lastExplanation && (
        <div className="px-4 py-2.5 bg-[#101728] border border-blue-500/30 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2 text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {lastExplanation}
          </span>
          <span className="text-[11px] text-emerald-400 font-bold">Deterministic DB Filter</span>
        </div>
      )}
    </div>
  );
}
