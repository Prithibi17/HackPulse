import { getHackathons } from '@/lib/services/hackathon.service';
import { HackathonCard } from '@/components/hackathon-card';
import Link from 'next/link';
import { Flame, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export const revalidate = 60;

export default async function DeadlinesPage() {
  const closingSoon = await getHackathons({ status: 'CLOSING_SOON' });
  const openSoon = await getHackathons({ status: 'OPEN', sortBy: 'deadline' });

  // Merge and prioritize closing soon
  const urgentList = [...closingSoon, ...openSoon.filter((o) => !closingSoon.some((c) => c.id === o.id))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-800/40">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span>Urgent Registration Deadlines</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Hackathon Deadlines Closing Soon
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Don’t miss out. Hackathons listed here are closing registrations soon. Ranked strictly by submission deadline.
        </p>
      </div>

      {/* Grid */}
      {urgentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {urgentList.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-10 text-center space-y-3">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No imminent deadlines closing in the next 72 hours</h3>
          <p className="text-xs text-slate-400">All currently open hackathons have extended application windows.</p>
          <Link
            href="/discover"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded"
          >
            Explore All Hackathons
          </Link>
        </div>
      )}
    </div>
  );
}
