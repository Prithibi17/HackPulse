'use client';

import { FilterOptions } from '@/types';
import { Filter, RotateCcw, Check, MapPin, Layers, Trophy, GraduationCap } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onChange: (updated: FilterOptions) => void;
  onReset: () => void;
}

const THEME_OPTIONS = [
  'AI',
  'IoT',
  'Web3',
  'Cybersecurity',
  'FinTech',
  'Robotics',
  'HealthTech',
  'Open Innovation',
];

const LOCATION_OPTIONS = [
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur'] },
  { state: 'Karnataka', cities: ['Bengaluru'] },
  { state: 'Delhi', cities: ['New Delhi'] },
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune'] },
];

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const handleModeChange = (mode: 'ALL' | 'ONLINE' | 'OFFLINE' | 'HYBRID') => {
    onChange({ ...filters, mode });
  };

  const handleStatusChange = (status?: string) => {
    onChange({ ...filters, status: filters.status === status ? undefined : status });
  };

  const toggleTheme = (theme: string) => {
    const current = filters.themes || [];
    const updated = current.includes(theme)
      ? current.filter((t) => t !== theme)
      : [...current, theme];
    onChange({ ...filters, themes: updated.length > 0 ? updated : undefined });
  };

  const setLocation = (state?: string, city?: string) => {
    onChange({ ...filters, state, city });
  };

  const setMinPrize = (minPrize?: number) => {
    onChange({ ...filters, minPrize });
  };

  const toggleStudentOnly = () => {
    onChange({ ...filters, studentOnly: !filters.studentOnly });
  };

  const hasActiveFilters =
    (filters.mode && filters.mode !== 'ALL') ||
    filters.status ||
    (filters.themes && filters.themes.length > 0) ||
    filters.state ||
    filters.city ||
    filters.minPrize ||
    filters.studentOnly;

  return (
    <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-5 text-sm space-y-6 shadow-sm">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1a253a]">
        <div className="flex items-center gap-2 font-bold text-white">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Faceted Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Format / Mode */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Event Format
        </label>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          {(['ALL', 'OFFLINE', 'ONLINE', 'HYBRID'] as const).map((m) => {
            const active = (filters.mode || 'ALL') === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-3 py-2 rounded-lg text-left border transition-all ${
                  active
                    ? 'bg-[#182338] border-blue-500 text-white font-bold shadow-sm'
                    : 'bg-[#090e1a] border-[#1a253a] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {m === 'ALL' ? 'All Formats' : m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration Status */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Registration Status
        </label>
        <div className="space-y-1.5 font-mono text-xs">
          {[
            { key: 'OPEN', label: 'Open Now', color: 'text-emerald-400' },
            { key: 'CLOSING_SOON', label: 'Closing Soon (<72h)', color: 'text-rose-400' },
            { key: 'UPCOMING', label: 'Upcoming', color: 'text-blue-400' },
            { key: 'POSTPONED', label: 'Postponed', color: 'text-amber-400' },
          ].map((st) => {
            const active = filters.status === st.key;
            return (
              <button
                key={st.key}
                onClick={() => handleStatusChange(st.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                  active
                    ? 'bg-[#182338] border-blue-500 text-white font-bold shadow-sm'
                    : 'bg-[#090e1a] border-[#1a253a] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={st.color}>{st.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location (State & City) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          Location & State
        </label>
        <div className="space-y-2">
          {LOCATION_OPTIONS.map((loc) => {
            const isStateActive = filters.state === loc.state && !filters.city;
            return (
              <div key={loc.state} className="space-y-1">
                <button
                  onClick={() => setLocation(isStateActive ? undefined : loc.state, undefined)}
                  className={`w-full text-left text-xs font-mono px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                    isStateActive
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold'
                      : 'text-slate-300 hover:bg-[#182338]'
                  }`}
                >
                  <span>{loc.state} (All)</span>
                  {isStateActive && <Check className="w-3 h-3 text-blue-400" />}
                </button>

                <div className="pl-3 grid grid-cols-2 gap-1">
                  {loc.cities.map((c) => {
                    const isCityActive = filters.city === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setLocation(loc.state, isCityActive ? undefined : c)}
                        className={`text-[11px] font-mono px-2 py-1 rounded border transition-all ${
                          isCityActive
                            ? 'bg-[#182338] border-blue-500 text-white font-bold'
                            : 'bg-[#090e1a]/80 border-[#1a253a] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracks & Themes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          Tracks & Themes
        </label>
        <div className="flex flex-wrap gap-1.5">
          {THEME_OPTIONS.map((theme) => {
            const active = filters.themes?.includes(theme);
            return (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all ${
                  active
                    ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-sm'
                    : 'bg-[#090e1a] border-[#1a253a] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {theme}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Prize */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Minimum Prize Pool
        </label>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          {[
            { val: undefined, label: 'Any Prize' },
            { val: 50000, label: '≥ ₹50,000' },
            { val: 100000, label: '≥ ₹1,00,000' },
            { val: 200000, label: '≥ ₹2,00,000' },
          ].map((p) => {
            const active = filters.minPrize === p.val;
            return (
              <button
                key={p.label}
                onClick={() => setMinPrize(p.val)}
                className={`px-2.5 py-1.5 rounded-lg text-left border transition-all ${
                  active
                    ? 'bg-[#182338] border-blue-500 text-white font-bold'
                    : 'bg-[#090e1a] border-[#1a253a] text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Eligibility Toggle */}
      <div className="pt-3 border-t border-[#1a253a]">
        <button
          onClick={toggleStudentOnly}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-xs font-semibold ${
            filters.studentOnly
              ? 'bg-blue-500/15 border-blue-500 text-white shadow-sm'
              : 'bg-[#090e1a] border-[#1a253a] text-slate-300 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Student & College Only</span>
          </span>
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border ${
              filters.studentOnly ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
            }`}
          >
            {filters.studentOnly && <Check className="w-3 h-3" />}
          </div>
        </button>
      </div>
    </div>
  );
}
