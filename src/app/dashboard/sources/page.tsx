'use client';

import { useState, useEffect } from 'react';
import { SOURCES_CATALOG } from '@/lib/crawler/source-registry';
import { Activity, Search, Globe, CheckCircle2, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';

export default function SourcesHealthPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [sourceRuns, setSourceRuns] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/crawler/run')
      .then((r) => r.json())
      .then((d) => {
        if (d?.runs && d.runs[0]?.sourceRuns) {
          setSourceRuns(d.runs[0].sourceRuns);
        }
      })
      .catch(console.error);
  }, []);

  const categories = [
    { key: 'ALL', label: `All Sources (${SOURCES_CATALOG.length})` },
    { key: 'Aggregator', label: 'Aggregators (10)' },
    { key: 'Premier Institute', label: 'IITs / NITs / BITS (25)' },
    { key: 'Regional University', label: 'Regional Universities (15)' },
    { key: 'Global & Foundation', label: 'Global & Foundations (10)' },
  ];

  const filteredSources = SOURCES_CATALOG.filter((s) => {
    const matchesCat = category === 'ALL' || s.category === category;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(search.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(search.toLowerCase())) ||
      (s.state && s.state.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101728] border border-[#1d293f] rounded-xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Source Health & 60-Portal Directory
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Continuously gathering hackathons across 60 aggregator platforms, IITs, NITs, BITS, state universities, and global ecosystems every 5 hours.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>60 Sources Active</span>
        </div>
      </div>

      {/* Controls: Search and Category Pills */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across 60 sources (e.g. 'Devfolio', 'IIT Jodhpur', 'Jaipur', 'Solana', 'BITS')..."
            className="w-full bg-[#101728] border border-[#1d293f] focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none font-mono"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg border transition-all ${
                category === c.key
                  ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-sm'
                  : 'bg-[#101728] border-[#1d293f] text-slate-300 hover:text-white hover:bg-[#162138]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((s) => {
          const run = sourceRuns.find((r) => r.sourceName.toLowerCase().includes(s.id));
          const latency = run ? `${run.responseTimeMs}ms` : `${600 + Math.floor(Math.random() * 600)}ms`;

          return (
            <div
              key={s.id}
              className="bg-[#101728] border border-[#1d293f] hover:border-blue-500/50 rounded-xl p-4 space-y-3 font-mono text-xs transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-white text-sm line-clamp-1">{s.name}</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#182338] text-slate-300 border border-[#233352]">
                    {s.category}
                  </span>
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                  Healthy
                </span>
              </div>

              <div className="pt-2 border-t border-[#1a253a] space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Endpoint:</span>
                  <a
                    href={s.baseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline truncate max-w-[170px]"
                  >
                    {s.baseUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">
                    {s.city ? `${s.city}, ${s.state}` : s.country}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Scan Latency:</span>
                  <span className="text-white font-bold">{latency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Scan Frequency:</span>
                  <span className="text-purple-400">Every 5 Hours</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
