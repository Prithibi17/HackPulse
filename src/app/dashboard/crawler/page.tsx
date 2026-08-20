'use client';

import { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  Layers,
} from 'lucide-react';
import { format } from 'date-fns';

export default function CrawlerDashboardPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [changes, setChanges] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/crawler/run');
      if (res.ok) {
        const data = await res.json();
        setRuns(data.runs || []);
        setChanges(data.changes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerScan = async () => {
    setScanning(true);
    setMessage(null);
    try {
      const res = await fetch('/api/crawler/run', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `✅ Scan completed successfully! Found: ${data.eventsDiscovered}, New: ${data.eventsCreated}, Updated: ${data.eventsUpdated}, Duplicates: ${data.duplicateCount}`
        );
        loadData();
      } else {
        setMessage(`❌ Scan failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Network error triggering scan: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  const lastRun = runs[0];

  return (
    <div className="space-y-6">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            Crawler Engine & Diff Inspector
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automated fixed cron execution every 5 hours (00:00, 05:00, 10:00, 15:00, 20:00 Asia/Kolkata).
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg font-mono transition-colors disabled:opacity-50"
        >
          {scanning ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning All Sources...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger Scan Now</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-[#111726] border border-blue-500/60 text-white rounded text-xs font-mono flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#111726] border border-[#1e293b] rounded p-4">
          <span className="text-slate-400">Last Scan</span>
          <div className="text-sm font-bold text-white mt-1">
            {lastRun ? format(new Date(lastRun.startedAt), 'dd MMM yyyy HH:mm') : 'Never'}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Completed</span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded p-4">
          <span className="text-slate-400">Sources Checked</span>
          <div className="text-2xl font-bold text-white mt-1">5</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Devfolio, Unstop, Devpost...</span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded p-4">
          <span className="text-slate-400">Last Discovered Yield</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {lastRun ? lastRun.eventsDiscovered : 0}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            +{lastRun ? lastRun.eventsCreated : 0} New Hackathons
          </span>
        </div>

        <div className="bg-[#111726] border border-[#1e293b] rounded p-4">
          <span className="text-slate-400">Duplicates Deduplicated</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {lastRun ? lastRun.duplicateCount : 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Multi-Source Merges</span>
        </div>
      </div>

      {/* Detected Field Diffs (Change Detector Log) */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          Detected Hackathon Changes & Field Diffs
        </h2>

        {changes.length > 0 ? (
          <div className="space-y-2">
            {changes.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-[#090d16] border border-[#1e293b] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300"
              >
                <div>
                  <span className="font-bold text-white">{c.hackathon?.name || 'Hackathon'}</span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-amber-400 font-semibold uppercase">{c.field}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    From <span className="line-through text-slate-500">{c.previousValue || 'Unset'}</span> ➔{' '}
                    <span className="text-emerald-400 font-semibold">{c.newValue}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <div>Via {c.source || 'Crawler'}</div>
                  <div>{format(new Date(c.detectedAt), 'dd MMM HH:mm')}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">No pending change diffs recorded.</p>
        )}
      </div>
    </div>
  );
}
