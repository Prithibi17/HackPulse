import { RegistrationStatus } from '@/types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: RegistrationStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toUpperCase();

  switch (normStatus) {
    case 'OPEN':
      return (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          OPEN
        </span>
      );
    case 'CLOSING_SOON':
      return (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-950/50',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          CLOSING SOON
        </span>
      );
    case 'UPCOMING':
      return (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          UPCOMING
        </span>
      );
    case 'POSTPONED':
      return (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          POSTPONED
        </span>
      );
    case 'CLOSED':
    default:
      return (
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider bg-slate-800/80 text-slate-400 border border-slate-700/60',
            className
          )}
        >
          CLOSED
        </span>
      );
  }
}
