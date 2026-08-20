import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Calendar,
  Server,
  Radio,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Play,
  History as HistoryIcon,
} from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0; // Dynamic

export default async function DashboardOverviewPage() {
  const totalHackathons = await prisma.hackathon.count();
  const verifiedCount = await prisma.hackathon.count({ where: { verificationStatus: 'VERIFIED' } });
  const guildsCount = await prisma.discordGuild.count({ where: { enabled: true } });
  const totalPosts = await prisma.discordPost.count();

  const lastRun = await prisma.crawlerRun.findFirst({
    orderBy: { startedAt: 'desc' },
    include: { sourceRuns: true },
  });

  const recentRuns = await prisma.crawlerRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 5,
  });

  const recentAudit = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-white">System & Discovery Overview</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Scheduler: Fixed 5h Cron (Asia/Kolkata) • Crawler Engine: Online
          </p>
        </div>

        <Link
          href="/dashboard/crawler"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold font-mono transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Inspect / Trigger Scan</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Hackathons
          </span>
          <div className="text-2xl font-bold text-white mt-1">{totalHackathons}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {verifiedCount} 100% Verified
          </span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            Discord Guilds
          </span>
          <div className="text-2xl font-bold text-white mt-1">{guildsCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active Channels</span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Discord Alerts Sent
          </span>
          <div className="text-2xl font-bold text-white mt-1">{totalPosts}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Deduplicated Posts</span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Last Scan Status
          </span>
          <div className="text-lg font-bold text-emerald-400 mt-1 uppercase truncate">
            {lastRun?.status || 'COMPLETED'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {lastRun ? format(new Date(lastRun.startedAt), 'dd MMM HH:mm') : 'Never'}
          </span>
        </div>
      </div>

      {/* Recent Crawler Runs Table */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <Radio className="w-4 h-4 text-blue-400" />
            Recent 5-Hour Discovery Runs
          </h2>
          <Link
            href="/dashboard/crawler"
            className="text-xs font-mono text-blue-400 hover:text-blue-300"
          >
            View All Runs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 pb-2">
                <th className="pb-2 font-semibold">Started At</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Discovered</th>
                <th className="pb-2 font-semibold">New Created</th>
                <th className="pb-2 font-semibold">Duplicates</th>
                <th className="pb-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {recentRuns.map((r) => (
                <tr key={r.id} className="text-slate-300">
                  <td className="py-2.5 text-white">{format(new Date(r.startedAt), 'dd MMM yyyy HH:mm')}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        r.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5">{r.eventsDiscovered}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">+{r.eventsCreated}</td>
                  <td className="py-2.5 text-slate-400">{r.duplicateCount} merged</td>
                  <td className="py-2.5 text-slate-400">{r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Admin Audit Logs */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
          <HistoryIcon className="w-4 h-4 text-purple-400" />
          Recent Audit & System Events
        </h2>

        <div className="space-y-2 font-mono text-xs">
          {recentAudit.map((log) => (
            <div
              key={log.id}
              className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded flex items-center justify-between text-slate-300"
            >
              <div>
                <span className="font-semibold text-blue-400">{log.action}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span>{log.entityType} ({log.entityId})</span>
              </div>
              <span className="text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
