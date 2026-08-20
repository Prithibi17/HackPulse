import Link from 'next/link';
import { HackathonCard } from '@/components/hackathon-card';
import { getHackathons, getHackathonStats } from '@/lib/services/hackathon.service';
import {
  Sparkles,
  MapPin,
  Globe,
  Flame,
  Clock,
  ArrowRight,
  Radio,
  Plus,
  Zap,
  Calendar,
} from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const stats = await getHackathonStats();

  const openHackathons = await getHackathons({ status: 'OPEN' });
  const offlineHackathons = await getHackathons({ mode: 'OFFLINE' });
  const onlineHackathons = await getHackathons({ mode: 'ONLINE' });
  const closingSoonHackathons = await getHackathons({ status: 'CLOSING_SOON' });
  const recentlyAdded = await getHackathons({ sortBy: 'recentlyAdded' });

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '123456789012345678';
  const botInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=277025508352&scope=bot%20applications.commands`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <section className="relative pt-4 pb-8 border-b border-[#1c273e]">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>Autonomous Hackathon Discovery Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Find your next hackathon.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Discover verified hackathons, track deadlines and get notified before opportunities disappear.
            Aggregated continuously from Devfolio, Unstop, Devpost, MLH, and official university portals.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Hackathons</span>
            </Link>

            <a
              href={botInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all shadow-md shadow-[#5865F2]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Discord</span>
            </a>

            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-[#101728] hover:bg-[#162138] text-slate-200 border border-[#1d293f] transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>View Calendar</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-10 pt-6 border-t border-[#1c273e]">
          <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-4">
            <div className="text-xs text-slate-400 font-mono">Total Tracked</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{stats.total}</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <span>●</span> 100% Verified Sources
            </div>
          </div>

          <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-4">
            <div className="text-xs text-slate-400 font-mono">Open Registrations</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">{stats.open}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Accepting Teams</div>
          </div>

          <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-4">
            <div className="text-xs text-slate-400 font-mono">Discord Communities</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 font-mono">{stats.guilds}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Connected Servers</div>
          </div>

          <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-4">
            <div className="text-xs text-slate-400 font-mono">Crawler Frequency</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 font-mono">Every 5h</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Fixed Cron (Asia/Kolkata)</div>
          </div>
        </div>
      </section>

      {/* Section 1: Closing This Week (Urgent) */}
      {closingSoonHackathons.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#1c273e] pb-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Closing This Week</h2>
                <p className="text-xs text-slate-400">Deadlines less than 72 hours away — submit applications now</p>
              </div>
            </div>
            <Link
              href="/deadlines"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
            >
              <span>View All Deadlines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {closingSoonHackathons.slice(0, 3).map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Open Registrations */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#1c273e] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Open Registrations</h2>
              <p className="text-xs text-slate-400">Active competitions ready for team enrollments</p>
            </div>
          </div>
          <Link
            href="/discover?status=OPEN"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
          >
            <span>Explore All Open ({openHackathons.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {openHackathons.slice(0, 6).map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>

      {/* Section 3: In-Person & Offline Hackathons */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#1c273e] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">In-Person & Offline Hackathons</h2>
              <p className="text-xs text-slate-400">Campus buildathons across Jaipur, Rajasthan, Bengaluru, Delhi & more</p>
            </div>
          </div>
          <Link
            href="/offline"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
          >
            <span>View Regional Hackathons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offlineHackathons.slice(0, 3).map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>

      {/* Section 4: Online & Global Hackathons */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#1c273e] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Online & Global Hackathons</h2>
              <p className="text-xs text-slate-400">Virtual competitions open to developers worldwide</p>
            </div>
          </div>
          <Link
            href="/online"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
          >
            <span>View Online Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {onlineHackathons.slice(0, 3).map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>

      {/* Section 5: Recently Discovered */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#1c273e] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recently Discovered & Verified</h2>
              <p className="text-xs text-slate-400">Latest additions captured during recent 5-hour crawler scans</p>
            </div>
          </div>
          <Link
            href="/discover?sortBy=recentlyAdded"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
          >
            <span>Explore Recent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentlyAdded.slice(0, 3).map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>
    </div>
  );
}
