import { getHackathons } from '@/lib/services/hackathon.service';
import { HackathonCard } from '@/components/hackathon-card';
import Link from 'next/link';
import { MapPin, ArrowRight, Building, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function OfflineHackathonsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string }>;
}) {
  const params = await searchParams;
  const offlineHackathons = await getHackathons({
    mode: 'OFFLINE',
    state: params.state,
    city: params.city,
  });

  const regions = [
    { label: 'All Offline', state: undefined, city: undefined },
    { label: 'Rajasthan (Jaipur/Jodhpur)', state: 'Rajasthan', city: undefined },
    { label: 'Jaipur Only', state: 'Rajasthan', city: 'Jaipur' },
    { label: 'Bengaluru (Karnataka)', state: 'Karnataka', city: 'Bengaluru' },
    { label: 'New Delhi (NCR)', state: 'Delhi', city: 'New Delhi' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
          <MapPin className="w-3.5 h-3.5" />
          <span>In-Person Campus & Venue Hackathons</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Offline Hackathons {params.state ? `in ${params.state}` : ''}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Build in-person alongside fellow developers. Find confirmed campus hackathons across Rajasthan, Karnataka, Delhi, and premier tech institutes.
        </p>
      </div>

      {/* Region quick selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
        {regions.map((r) => {
          const isActive = params.state === r.state && params.city === r.city;
          const href = r.state
            ? r.city
              ? `/offline?state=${r.state}&city=${r.city}`
              : `/offline?state=${r.state}`
            : '/offline';

          return (
            <Link
              key={r.label}
              href={href}
              className={`shrink-0 px-3.5 py-1.5 rounded-md border transition-all ${
                isActive
                  ? 'bg-emerald-600 border-emerald-500 text-white font-semibold'
                  : 'bg-[#111726] border-[#1e293b] text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {r.label}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      {offlineHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offlineHackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-10 text-center space-y-3">
          <MapPin className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No offline hackathons currently listed in this region</h3>
          <p className="text-xs text-slate-400">Try browsing all offline events across India.</p>
          <Link
            href="/offline"
            className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
          >
            View All Offline
          </Link>
        </div>
      )}
    </div>
  );
}
