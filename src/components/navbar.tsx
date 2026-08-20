'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, Flame, Globe, MapPin, Sparkles, LayoutDashboard, Plus, MessageSquare } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/discover', label: 'Discover', icon: Sparkles },
    { href: '/offline', label: 'Offline', icon: MapPin },
    { href: '/online', label: 'Online', icon: Globe },
    { href: '/deadlines', label: 'Deadlines', icon: Flame },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/communities', label: 'For Communities', icon: MessageSquare },
  ];

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '123456789012345678';
  const botInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=277025508352&scope=bot%20applications.commands`;

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-[#1c273e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/25 transition-all shadow-sm">
                <Radio className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  HackPulse
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    2.0
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono tracking-wide -mt-0.5">
                  Discover. Build. Compete.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#182338] text-white border border-blue-500/50 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#121a2d] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-[#111726] border-[#1e293b] text-slate-200 hover:text-white hover:border-slate-600 hover:bg-[#172033]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin & Guilds</span>
            </Link>

            <a
              href={botInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all shadow-md shadow-[#5865F2]/20 hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Discord</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-[#1c273e] overflow-x-auto bg-[#0b111e]">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#162136]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
