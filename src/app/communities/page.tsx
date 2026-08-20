import Link from 'next/link';
import {
  MessageSquare,
  Plus,
  Radio,
  Sparkles,
  Sliders,
  Users,
  ShieldCheck,
  BellRing,
  Bot,
  ArrowRight,
} from 'lucide-react';

export default function CommunitiesPage() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '123456789012345678';
  const botInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=277025508352&scope=bot%20applications.commands`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-[#5865F2]/20 text-[#8ea1e1] border border-[#5865F2]/40">
          <Bot className="w-3.5 h-3.5" />
          <span>Multi-Server Community Bot</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Supercharge Your Discord with Hackathon Discovery
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
          Keep your developer club, university society, or community active. HackPulse scans Devfolio, Unstop, Devpost, MLH, and 60+ official portals every 5 hours and delivers relevant, verified events straight to your server.
        </p>

        <div className="pt-2">
          <a
            href={botInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all shadow-lg shadow-[#5865F2]/20 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            <span>Add HackPulse to Discord</span>
          </a>
        </div>
      </section>

      {/* 3 Core Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Automated 5-Hour Delivery</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Crawls 60+ verified sources every 5 hours on fixed cron slots. Only announces real new events or critical postponements. Never spams empty notifications.
          </p>
        </div>

        <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Custom Server Filters</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Configure your server to only receive offline events in Rajasthan, AI tracks, minimum prize thresholds, or student-eligible competitions.
          </p>
        </div>

        <div className="bg-[#101728] border border-[#1d293f] rounded-xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Instant Team Recruitment</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Members can click `[Find Team]` or run `/team` to post team requests directly into dedicated discussion threads under each event post.
          </p>
        </div>
      </section>

      {/* Guided Setup Steps */}
      <section className="bg-[#101728] border border-[#1d293f] rounded-xl p-8 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-white">How to Set Up in 60 Seconds</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-4 space-y-2">
            <div className="text-blue-400 font-bold text-sm">Step 1</div>
            <div className="font-semibold text-white">Authorize Bot</div>
            <p className="text-slate-400 font-sans">
              Click &quot;Add HackPulse to Discord&quot; and invite it to your server. Minimal permissions required.
            </p>
          </div>

          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-4 space-y-2">
            <div className="text-blue-400 font-bold text-sm">Step 2</div>
            <div className="font-semibold text-white">Run /setup</div>
            <p className="text-slate-400 font-sans">
              Choose your dedicated announcement channel (e.g. <code>#hackathons</code>).
            </p>
          </div>

          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-4 space-y-2">
            <div className="text-blue-400 font-bold text-sm">Step 3</div>
            <div className="font-semibold text-white">Set Preferences</div>
            <p className="text-slate-400 font-sans">
              Select formats (Offline, Online), locations (e.g. Rajasthan, Jaipur), and tracks.
            </p>
          </div>

          <div className="bg-[#090e1a] border border-[#1a253a] rounded-lg p-4 space-y-2">
            <div className="text-blue-400 font-bold text-sm">Step 4</div>
            <div className="font-semibold text-white">Autonomous Alerts</div>
            <p className="text-slate-400 font-sans">
              Sit back. HackPulse posts verified events and deadline countdowns seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Slash Commands Directory */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Available Slash Commands</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {[
            { cmd: '/hackathons', desc: 'Browse verified upcoming events with interactive filters' },
            { cmd: '/ask <natural query>', desc: 'Deterministic NLP search without hallucinations' },
            { cmd: '/deadlines', desc: 'List hackathons closing applications within 72 hours' },
            { cmd: '/offline', desc: 'Discover in-person hackathons by state or city' },
            { cmd: '/online', desc: 'Discover global virtual hackathons' },
            { cmd: '/team', desc: 'Recruit teammates with role requirements and discussion threads' },
            { cmd: '/remind', desc: 'Set personal deadline alerts (7d, 3d, 1d, 6h before close)' },
            { cmd: '/setup', desc: 'Configure server channel, roles, and automated posting filters' },
          ].map((item) => (
            <div
              key={item.cmd}
              className="p-3 bg-[#101728] border border-[#1d293f] rounded-lg flex items-center justify-between gap-3"
            >
              <span className="text-blue-400 font-bold">{item.cmd}</span>
              <span className="text-slate-400 text-right font-sans text-[11px]">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
