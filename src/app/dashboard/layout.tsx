'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Server,
  Layers,
  Activity,
  History,
  Settings,
  ArrowLeft,
  Radio,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/hackathons', label: 'Hackathons', icon: Calendar },
    { href: '/dashboard/guilds', label: 'Discord Servers', icon: Server },
    { href: '/dashboard/sources', label: 'Sources Health', icon: Activity },
    { href: '/dashboard/crawler', label: 'Crawler & Diff', icon: Radio },
    { href: '/dashboard/logs', label: 'System Logs', icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-[#111726] border border-[#1e293b] rounded-lg p-4 space-y-4">
          <div className="pb-3 border-b border-[#1e293b]">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <h2 className="text-sm font-bold text-white mt-2">Admin Dashboard</h2>
          </div>

          <nav className="space-y-1 font-mono text-xs">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-[#182238]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-4">{children}</div>
      </div>
    </div>
  );
}
