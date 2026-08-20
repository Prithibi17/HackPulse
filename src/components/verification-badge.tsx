import { VerificationStatus } from '@/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldQuestion } from 'lucide-react';
import clsx from 'clsx';

interface VerificationBadgeProps {
  status: VerificationStatus | string;
  note?: string | null;
  className?: string;
}

export function VerificationBadge({ status, note, className }: VerificationBadgeProps) {
  const norm = status?.toUpperCase() || 'UNVERIFIED';

  if (norm === 'VERIFIED') {
    return (
      <span
        title={note || 'Verified directly by HackPulse crawler and official organizer portal'}
        className={clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/25',
          className
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified</span>
      </span>
    );
  }

  if (norm === 'PARTIALLY_VERIFIED') {
    return (
      <span
        title={note || 'Partially verified - some details pending official announcement'}
        className={clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25',
          className
        )}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Partial Verify</span>
      </span>
    );
  }

  if (norm === 'CONFLICT') {
    return (
      <span
        title={note || 'Date conflict detected between aggregator sources'}
        className={clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/25',
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        <span>Date Conflict</span>
      </span>
    );
  }

  return (
    <span
      title={note || 'Unverified listing'}
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800/60 text-slate-400 border border-slate-700/50',
        className
      )}
    >
      <ShieldQuestion className="w-3.5 h-3.5 text-slate-400" />
      <span>Unverified</span>
    </span>
  );
}
