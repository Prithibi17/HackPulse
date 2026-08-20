import Link from 'next/link';
import { HackathonData } from '@/types';
import { StatusBadge } from './status-badge';
import { VerificationBadge } from './verification-badge';
import { MapPin, Globe, Trophy, Calendar, Users, ArrowRight, Building, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface HackathonCardProps {
  hackathon: HackathonData;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  // Format prize display
  const prizeDisplay =
    hackathon.prizePool !== null && hackathon.prizePool !== undefined
      ? hackathon.prizePool === 0
        ? 'Non-monetary rewards'
        : hackathon.prizeCurrency === 'INR'
        ? `₹${hackathon.prizePool.toLocaleString('en-IN')}`
        : `$${hackathon.prizePool.toLocaleString('en-US')}`
      : 'Prize pool not announced';

  // Format location display
  let locationDisplay = 'Online (Virtual)';
  if (hackathon.mode !== 'ONLINE') {
    const locParts = [hackathon.city, hackathon.state].filter(Boolean);
    locationDisplay = locParts.length > 0 ? locParts.join(', ') : 'Location not confirmed';
  }

  // Format event dates
  const formatDateRange = () => {
    if (!hackathon.eventStartDate) return 'Dates TBA';
    try {
      const start = new Date(hackathon.eventStartDate);
      const end = hackathon.eventEndDate ? new Date(hackathon.eventEndDate) : null;
      if (end && start.getMonth() === end.getMonth()) {
        return `${format(start, 'd')}–${format(end, 'd MMMM yyyy')}`;
      }
      return `${format(start, 'd MMM')} – ${end ? format(end, 'd MMM yyyy') : 'TBD'}`;
    } catch {
      return 'Date verification required';
    }
  };

  // Format deadline
  const formatDeadline = () => {
    if (!hackathon.registrationDeadline) return 'Deadline not specified';
    try {
      return format(new Date(hackathon.registrationDeadline), 'd MMMM yyyy');
    } catch {
      return 'Date verification required';
    }
  };

  return (
    <div className="group relative bg-[#101728] border border-[#1d293f] hover:border-blue-500/60 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-black/40">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                hackathon.mode === 'ONLINE'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  : hackathon.mode === 'HYBRID'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {hackathon.mode}
            </span>
            <StatusBadge status={hackathon.registrationStatus} />
          </div>

          <VerificationBadge status={hackathon.verificationStatus} note={hackathon.verificationNote} />
        </div>

        {/* Hackathon Title & Organizer */}
        <Link href={`/hackathons/${hackathon.slug}`} className="block">
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {hackathon.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 line-clamp-1 font-sans">
          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{hackathon.organizerName}</span>
        </p>

        {/* Key Metrics: Location & Prize Box */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-2.5 flex items-center gap-2">
            {hackathon.mode === 'ONLINE' ? (
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span className="truncate text-slate-300" title={locationDisplay}>
              {locationDisplay}
            </span>
          </div>

          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-2.5 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-bold text-amber-300" title={prizeDisplay}>
              {prizeDisplay}
            </span>
          </div>
        </div>

        {/* Date & Deadline Info Rows */}
        <div className="mt-3.5 space-y-2 text-xs text-slate-300 font-sans">
          <div className="flex items-center justify-between border-b border-[#1a253a] pb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Event Dates
            </span>
            <span className="font-mono text-slate-200">{formatDateRange()}</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Deadline
            </span>
            <span
              className={`font-mono ${
                hackathon.registrationStatus === 'CLOSING_SOON'
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {formatDeadline()}
            </span>
          </div>
        </div>

        {/* Tracks / Themes Tags */}
        {hackathon.themes && hackathon.themes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-4">
            {hackathon.themes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#172238] text-slate-300 border border-[#233352]"
              >
                {theme}
              </span>
            ))}
            {hackathon.themes.length > 3 && (
              <span className="text-[10px] text-slate-400 font-mono">+{hackathon.themes.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#1a253a] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          Via {hackathon.sourceName || 'Direct'}
        </span>
        <Link
          href={`/hackathons/${hackathon.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
