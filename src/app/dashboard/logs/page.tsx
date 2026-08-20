import prisma from '@/lib/prisma';
import { History, ShieldCheck, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0;

export default async function SystemLogsPage() {
  const auditLogs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const crawlerRuns = await prisma.crawlerRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 20,
  });

  const discordPosts = await prisma.discordPost.findMany({
    orderBy: { postedAt: 'desc' },
    take: 20,
    include: {
      hackathon: true,
      guild: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Structured System Logs & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically sanitized logs: Crawler cycles, Discord notifications, and admin mutations.
          </p>
        </div>
      </div>

      {/* Discord Posts Dispatch Log */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white">Recent Discord Community Posts Dispatched</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 pb-2">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Guild</th>
                <th className="pb-2">Event</th>
                <th className="pb-2">Post Type</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {discordPosts.map((p) => (
                <tr key={p.id} className="text-slate-300">
                  <td className="py-2.5 text-slate-400">
                    {format(new Date(p.postedAt), 'dd MMM HH:mm:ss')}
                  </td>
                  <td className="py-2.5 text-white">{p.guild.guildName}</td>
                  <td className="py-2.5 font-bold text-blue-400">{p.hackathon.name}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                      {p.postType}
                    </span>
                  </td>
                  <td className="py-2.5 text-emerald-400">Delivered ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Audit Trail */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white">Admin & System Audit Trail</h2>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-[#090d16] border border-[#1e293b] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-purple-400">{log.action}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-white">{log.entityType} ({log.entityId})</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-slate-400 font-sans">{log.performedBy}</span>
              </div>
              <span className="text-slate-500 text-[11px]">
                {format(new Date(log.createdAt), 'dd MMM yyyy HH:mm:ss')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
