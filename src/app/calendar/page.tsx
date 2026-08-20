'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackathonData } from '@/types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Globe, Trophy } from 'lucide-react';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-08-01'));
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    date: Date;
    events: { hackathon: HackathonData; type: 'DEADLINE' | 'START' | 'END' }[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/hackathons')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          setHackathons(data.items);
        }
      })
      .catch(console.error);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    const matched: { hackathon: HackathonData; type: 'DEADLINE' | 'START' | 'END' }[] = [];

    for (const h of hackathons) {
      if (h.registrationDeadline && isSameDay(new Date(h.registrationDeadline), day)) {
        matched.push({ hackathon: h, type: 'DEADLINE' });
      }
      if (h.eventStartDate && isSameDay(new Date(h.eventStartDate), day)) {
        matched.push({ hackathon: h, type: 'START' });
      }
      if (h.eventEndDate && isSameDay(new Date(h.eventEndDate), day)) {
        matched.push({ hackathon: h, type: 'END' });
      }
    }

    return matched;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/40">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Timeline</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Hackathon Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track registration deadlines and event dates at a glance.
          </p>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-[#111726] border border-[#1e293b] hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm font-bold text-white min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-[#111726] border border-[#1e293b] hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-slate-300 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          Registration Deadline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Hackathon Start
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Hackathon End
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#1e293b] text-center text-xs font-mono font-semibold text-slate-400 py-3 bg-[#0d1322]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#1e293b]">
          {days.map((day) => {
            const isCurrMonth = isSameMonth(day, monthStart);
            const events = getEventsForDay(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDayEvents(events.length > 0 ? { date: day, events } : null)}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors cursor-pointer hover:bg-[#182238]/60 ${
                  isCurrMonth ? 'bg-[#111726]' : 'bg-[#090d16]/60 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      isCurrMonth ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {events.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </div>

                {/* Event markers */}
                <div className="space-y-1 mt-1">
                  {events.slice(0, 2).map((ev, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded truncate border ${
                        ev.type === 'DEADLINE'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                          : ev.type === 'START'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          : 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                      }`}
                      title={`${ev.hackathon.name} (${ev.type})`}
                    >
                      {ev.type === 'DEADLINE' ? '⏰ ' : '🚀 '}
                      {ev.hackathon.name}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-[9px] text-slate-400 font-mono pl-1">
                      +{events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Modal / Drawer */}
      {selectedDayEvents && (
        <div className="bg-[#111726] border border-blue-500/50 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              Events on {format(selectedDayEvents.date, 'EEEE, d MMMM yyyy')}
            </h3>
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDayEvents.events.map((ev, idx) => (
              <div
                key={idx}
                className="bg-[#090d16] border border-[#1e293b] rounded p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      ev.type === 'DEADLINE'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {ev.type === 'DEADLINE' ? 'Registration Deadline' : 'Event Start'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{ev.hackathon.mode}</span>
                </div>

                <Link
                  href={`/hackathons/${ev.hackathon.slug}`}
                  className="text-sm font-bold text-white hover:text-blue-400 block transition-colors"
                >
                  {ev.hackathon.name}
                </Link>

                <p className="text-xs text-slate-400 line-clamp-2">{ev.hackathon.description}</p>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>{ev.hackathon.city || ev.hackathon.mode}</span>
                  <Link
                    href={`/hackathons/${ev.hackathon.slug}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
