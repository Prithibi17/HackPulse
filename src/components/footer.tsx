import Link from 'next/link';
import { Radio, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] bg-[#090d16] text-xs text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white text-sm">HackPulse</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              Autonomous multi-source hackathon crawler, verification engine, and multi-server Discord bot.
              Discover upcoming hackathons without checking Devfolio, Unstop, Devpost, MLH, and college portals manually.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deterministic Validation • Zero Fabricated Information</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase text-[11px] tracking-wider">Quick Navigation</span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li><Link href="/discover" className="hover:text-white transition-colors">Discover All</Link></li>
              <li><Link href="/offline" className="hover:text-white transition-colors">Offline Hackathons</Link></li>
              <li><Link href="/online" className="hover:text-white transition-colors">Online & Virtual</Link></li>
              <li><Link href="/deadlines" className="hover:text-white transition-colors">Closing Soon (&lt;72h)</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition-colors">Interactive Calendar</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase text-[11px] tracking-wider">For Communities</span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li><Link href="/communities" className="hover:text-white transition-colors">Add to Discord</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Server Dashboard</Link></li>
              <li><Link href="/dashboard/crawler" className="hover:text-white transition-colors">5-Hour Crawler Logs</Link></li>
              <li><Link href="/dashboard/sources" className="hover:text-white transition-colors">Source Health</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>© {new Date().getFullYear()} HackPulse. All rights reserved.</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Asia/Kolkata Scheduler Engine</span>
            <span>•</span>
            <span>Version 2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
