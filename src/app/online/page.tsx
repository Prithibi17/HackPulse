import { getHackathons } from '@/lib/services/hackathon.service';
import { HackathonCard } from '@/components/hackathon-card';
import Link from 'next/link';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function OnlineHackathonsPage() {
  const onlineHackathons = await getHackathons({ mode: 'ONLINE' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/40">
          <Globe className="w-3.5 h-3.5" />
          <span>Virtual & Global Competitions</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Online Hackathons
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Build from anywhere in the world. Compete in virtual hackathons powered by Major League Hacking (MLH), Devpost, and global developer communities.
        </p>
      </div>

      {/* Grid */}
      {onlineHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {onlineHackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-10 text-center space-y-3">
          <Globe className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No online hackathons currently found</h3>
          <p className="text-xs text-slate-400">Check back soon as new virtual hackathons are added every 5 hours.</p>
        </div>
      )}
    </div>
  );
}
