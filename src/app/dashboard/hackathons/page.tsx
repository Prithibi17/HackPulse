'use client';

import { useState, useEffect } from 'react';
import { HackathonData } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { VerificationBadge } from '@/components/verification-badge';
import {
  Plus,
  Edit2,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Merge,
  Trash2,
  Check,
  X,
} from 'lucide-react';

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [postponeModal, setPostponeModal] = useState<HackathonData | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hackathons');
      const data = await res.json();
      setHackathons(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (h: HackathonData) => {
    const nextStatus = h.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    try {
      const res = await fetch(`/api/hackathons/${h.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: nextStatus,
          verified: nextStatus === 'VERIFIED',
        }),
      });
      if (res.ok) {
        setMessage(`Updated verification for "${h.name}" to ${nextStatus}`);
        loadHackathons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (h: HackathonData, newStatus: string) => {
    try {
      const res = await fetch(`/api/hackathons/${h.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationStatus: newStatus }),
      });
      if (res.ok) {
        setMessage(`Updated registration status for "${h.name}" to ${newStatus}`);
        loadHackathons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostponeSubmit = async () => {
    if (!postponeModal || !newStartDate) return;
    try {
      const res = await fetch(`/api/hackathons/${postponeModal.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPostponed: true,
          registrationStatus: 'POSTPONED',
          eventStartDate: new Date(newStartDate),
          eventEndDate: newEndDate ? new Date(newEndDate) : undefined,
        }),
      });
      if (res.ok) {
        setMessage(`Successfully marked "${postponeModal.name}" as POSTPONED.`);
        setPostponeModal(null);
        loadHackathons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-white">Hackathon Management</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Admin oversight: Verification states, postponement overrides, and cross-source merges.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs font-mono flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Table List */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 bg-[#0d1322] py-3">
                <th className="p-3.5 font-semibold">Hackathon</th>
                <th className="p-3.5 font-semibold">Format & Location</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Verification</th>
                <th className="p-3.5 font-semibold">Deadline</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : (
                hackathons.map((h) => (
                  <tr key={h.id} className="text-slate-300 hover:bg-[#182238]/40">
                    <td className="p-3.5">
                      <div className="font-bold text-white line-clamp-1">{h.name}</div>
                      <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                        {h.organizerName} • Via {h.sourceName}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div>{h.mode}</div>
                      <div className="text-[11px] text-slate-400">{h.city || 'Online'}</div>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={h.registrationStatus} />
                    </td>
                    <td className="p-3.5">
                      <VerificationBadge status={h.verificationStatus} note={h.verificationNote} />
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {h.registrationDeadline
                        ? new Date(h.registrationDeadline).toLocaleDateString()
                        : 'TBA'}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {/* Verify Button */}
                      <button
                        onClick={() => handleVerifyToggle(h)}
                        className="px-2 py-1 bg-[#090d16] hover:bg-emerald-950 text-emerald-400 border border-[#1e293b] rounded transition-colors"
                        title="Toggle Verification"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>

                      {/* Postpone Button */}
                      <button
                        onClick={() => {
                          setPostponeModal(h);
                          setNewStartDate('');
                          setNewEndDate('');
                        }}
                        className="px-2 py-1 bg-[#090d16] hover:bg-amber-950 text-amber-400 border border-[#1e293b] rounded transition-colors"
                        title="Mark Postponed"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>

                      {/* Status Override */}
                      <select
                        value={h.registrationStatus}
                        onChange={(e) => handleStatusChange(h, e.target.value)}
                        className="bg-[#090d16] border border-[#1e293b] text-slate-300 text-[11px] rounded px-1.5 py-1"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSING_SOON">CLOSING_SOON</option>
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="POSTPONED">POSTPONED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Postpone Modal */}
      {postponeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-6 max-w-md w-full space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Postpone & Reschedule Event
              </h3>
              <button
                onClick={() => setPostponeModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 font-sans">
              Postponing <strong>{postponeModal.name}</strong> will update its status to{' '}
              <span className="text-amber-400">POSTPONED</span>, preserve old dates in the change
              log, and dispatch a Discord postponement notice.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">New Event Start Date</label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded p-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">New Event End Date (Optional)</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded p-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
              <button
                onClick={() => setPostponeModal(null)}
                className="px-3 py-1.5 bg-[#090d16] text-slate-400 hover:text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePostponeSubmit}
                disabled={!newStartDate}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded disabled:opacity-50"
              >
                Confirm Postponement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
