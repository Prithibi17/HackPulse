import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Server, Settings, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const revalidate = 0;

export default async function DiscordGuildsListPage() {
  const guilds = await prisma.discordGuild.findMany({
    include: {
      subscription: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '123456789012345678';
  const botInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=277025508352&scope=bot%20applications.commands`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-white">Connected Discord Servers</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure automated channel posting, state/city filters, tracks, and ping roles per server.
          </p>
        </div>

        <a
          href={botInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold rounded font-mono transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Another Server</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guilds.map((g) => {
          let modes: string[] = ['ALL'];
          let states: string[] = [];
          let themes: string[] = [];
          if (g.subscription) {
            try {
              modes = JSON.parse(g.subscription.modes);
              states = JSON.parse(g.subscription.states);
              themes = JSON.parse(g.subscription.themes);
            } catch {}
          }

          return (
            <div
              key={g.id}
              className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#8ea1e1]">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{g.guildName}</h3>
                      <span className="text-[11px] font-mono text-slate-400">ID: {g.guildId}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                      g.enabled
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {g.enabled ? 'Active ✓' : 'Paused'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b] space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Posting Channel:</span>
                    <span className="text-white">
                      {g.postingChannelId ? `#${g.postingChannelId}` : 'Not configured'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Formats:</span>
                    <span className="text-white">{modes.join(', ')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Locations:</span>
                    <span className="text-white">
                      {states.length > 0 ? states.join(', ') : 'All Locations'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Posts Dispatched:</span>
                    <span className="text-blue-400 font-bold">{g._count.posts} events</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e293b] flex items-center justify-end">
                <Link
                  href={`/dashboard/guilds/${g.guildId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#090d16] hover:bg-[#1e293b] text-white text-xs font-semibold rounded border border-[#1e293b] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  <span>Configure Rules</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
