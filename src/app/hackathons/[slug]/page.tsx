import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getHackathonBySlug, getSimilarHackathons } from '@/lib/services/hackathon.service';
import { StatusBadge } from '@/components/status-badge';
import { VerificationBadge } from '@/components/verification-badge';
import { HackathonCard } from '@/components/hackathon-card';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Trophy,
  Users,
  Building,
  ExternalLink,
  ShieldCheck,
  History,
  Bookmark,
  Share2,
  ChevronLeft,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);

  if (!hackathon) {
    return { title: 'Hackathon Not Found — HackRadar' };
  }

  return {
    title: `${hackathon.name} — HackRadar`,
    description: hackathon.description,
    openGraph: {
      title: `${hackathon.name} | HackRadar`,
      description: hackathon.description,
      images: hackathon.bannerImage ? [hackathon.bannerImage] : [],
    },
  };
}

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);

  if (!hackathon) {
    notFound();
  }

  const similarHackathons = await getSimilarHackathons(hackathon, 3);

  // Formatting helpers
  const prizeDisplay =
    hackathon.prizePool !== null && hackathon.prizePool !== undefined
      ? hackathon.prizePool === 0
        ? 'Non-monetary rewards'
        : hackathon.prizeCurrency === 'INR'
        ? `₹${hackathon.prizePool.toLocaleString('en-IN')}`
        : `$${hackathon.prizePool.toLocaleString('en-US')}`
      : 'Prize pool not announced';

  let locationDisplay = '🌐 Online (Virtual)';
  if (hackathon.mode !== 'ONLINE') {
    const locParts = [hackathon.venueName, hackathon.city, hackathon.state, hackathon.country].filter(Boolean);
    locationDisplay = locParts.length > 0 ? `📍 ${locParts.join(', ')}` : '📍 Location not confirmed';
  }

  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return 'Date verification required';
    try {
      return format(new Date(dateStr), 'd MMMM yyyy (EEEE)');
    } catch {
      return 'Date verification required';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back breadcrumb */}
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to all hackathons
        </Link>
      </div>

      {/* Main Event Header */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
        {/* Banner with CSS Fallback */}
        <div className="relative w-full h-48 sm:h-64 bg-[#090d16] border-b border-[#1e293b]">
          {hackathon.bannerImage ? (
            <img
              src={hackathon.bannerImage}
              alt={hackathon.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111726] to-[#090d16] p-6 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-blue-400 opacity-60" />
              <span className="text-xl font-black text-white font-mono">{hackathon.name}</span>
              <span className="text-xs text-slate-400 font-mono">Official Banner Fallback</span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#090d16]/90 backdrop-blur text-white border border-[#1e293b]">
              {hackathon.mode}
            </span>
            <StatusBadge status={hackathon.registrationStatus} />
          </div>

          <div className="absolute top-4 right-4">
            <VerificationBadge status={hackathon.verificationStatus} note={hackathon.verificationNote} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {hackathon.name}
              </h1>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-mono flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Building className="w-4 h-4 text-slate-400" />
                  {hackathon.organizerName}
                </span>
                <span>•</span>
                <span className="text-slate-300">{locationDisplay}</span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <a
                href={hackathon.registrationUrl || hackathon.officialWebsite || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md"
              >
                <span>Register on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {hackathon.officialWebsite && (
                <a
                  href={hackathon.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-[#090d16] hover:bg-[#182238] text-slate-200 border border-[#1e293b] transition-colors"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Facts Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#1e293b] font-mono text-xs">
            <div className="bg-[#090d16] border border-[#1e293b] rounded p-3">
              <div className="text-slate-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Prize Pool
              </div>
              <div className="text-sm font-bold text-amber-300 mt-1">{prizeDisplay}</div>
            </div>

            <div className="bg-[#090d16] border border-[#1e293b] rounded p-3">
              <div className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Team Size
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {hackathon.teamMin}–{hackathon.teamMax} Members
              </div>
            </div>

            <div className="bg-[#090d16] border border-[#1e293b] rounded p-3">
              <div className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Registration Deadline
              </div>
              <div className="text-sm font-bold text-rose-300 mt-1">
                {formatDate(hackathon.registrationDeadline)}
              </div>
            </div>

            <div className="bg-[#090d16] border border-[#1e293b] rounded p-3">
              <div className="text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Eligibility
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1 truncate" title={hackathon.eligibility}>
                {hackathon.eligibility}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Verification Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Dates, Themes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">About the Hackathon</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {hackathon.description}
            </p>
          </div>

          {/* Event Schedule Timeline */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Schedule & Key Dates
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 bg-[#090d16] border border-[#1e293b] rounded">
                <span className="text-slate-400">Applications Open</span>
                <span className="text-white font-semibold">
                  {formatDate(hackathon.registrationOpenDate)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#090d16] border border-[#1e293b] rounded">
                <span className="text-slate-400">Registration Deadline</span>
                <span className="text-rose-400 font-bold">
                  {formatDate(hackathon.registrationDeadline)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#090d16] border border-[#1e293b] rounded">
                <span className="text-slate-400">Hackathon Kickoff</span>
                <span className="text-emerald-400 font-semibold">
                  {formatDate(hackathon.eventStartDate)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#090d16] border border-[#1e293b] rounded">
                <span className="text-slate-400">Project Submissions & Finale</span>
                <span className="text-white font-semibold">
                  {formatDate(hackathon.eventEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracks & Tech Stack */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Tracks & Technologies</h2>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Themes</span>
                <div className="flex flex-wrap gap-2">
                  {hackathon.themes.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-[#1e293b] text-blue-300 border border-[#2d3b55] rounded text-xs font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {hackathon.technologies && hackathon.technologies.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-2">
                    Technologies / Tooling
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 bg-[#090d16] text-slate-300 border border-[#1e293b] rounded text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change History (e.g. Postponements or deadline extensions) */}
          {hackathon.changes && hackathon.changes.length > 0 && (
            <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-6 space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <History className="w-4 h-4 text-amber-400" />
                Change & Reschedule Log
              </h2>
              <div className="space-y-2 font-mono text-xs">
                {hackathon.changes.map((chg) => (
                  <div key={chg.id} className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-amber-300 uppercase">{chg.field}</span>
                      <span>{new Date(chg.detectedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-slate-300">
                      From <span className="line-through text-slate-500">{chg.previousValue || 'Initial'}</span> ➔{' '}
                      <span className="text-white font-bold">{chg.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Verification & Connected Sources */}
        <div className="space-y-6">
          {/* Verification Box */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verification Status
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <VerificationBadge status={hackathon.verificationStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Verified</span>
                <span className="text-slate-200">{new Date(hackathon.lastCheckedAt).toLocaleDateString()}</span>
              </div>
              {hackathon.verificationNote && (
                <div className="mt-2 p-2.5 bg-[#090d16] border border-[#1e293b] rounded text-slate-300">
                  {hackathon.verificationNote}
                </div>
              )}
            </div>
          </div>

          {/* Connected Sources Box */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono">Connected Sources</h3>
            <div className="space-y-2 font-mono text-xs">
              {hackathon.sources && hackathon.sources.length > 0 ? (
                hackathon.sources.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{s.sourceName}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{s.sourceUrl}</div>
                    </div>
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">Direct Organizer Listing</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Hackathons Section */}
      {similarHackathons.length > 0 && (
        <div className="pt-10 border-t border-[#1e293b] space-y-4">
          <h2 className="text-xl font-bold text-white">Similar Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarHackathons.map((sim) => (
              <HackathonCard key={sim.id} hackathon={sim} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
