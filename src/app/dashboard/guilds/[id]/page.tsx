'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Server,
  ArrowLeft,
  Save,
  Check,
  Bell,
  Sliders,
  Send,
  ShieldAlert,
  Layers,
  MapPin,
} from 'lucide-react';

const THEMES_LIST = ['AI', 'IoT', 'Web3', 'Cybersecurity', 'FinTech', 'Robotics', 'HealthTech', 'Open Innovation'];
const STATES_LIST = ['Rajasthan', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Telangana'];

export default function GuildConfigPage() {
  const params = useParams();
  const router = useRouter();
  const guildId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guild, setGuild] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form State
  const [postingChannelId, setPostingChannelId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [modes, setModes] = useState<string[]>(['ONLINE', 'OFFLINE', 'HYBRID']);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [minPrize, setMinPrize] = useState(0);
  const [studentsOnly, setStudentsOnly] = useState(false);
  const [newHackathons, setNewHackathons] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [registrationAlerts, setRegistrationAlerts] = useState(true);
  const [changeAlerts, setChangeAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [pingRoleId, setPingRoleId] = useState('');

  useEffect(() => {
    fetchGuildData();
  }, [guildId]);

  const fetchGuildData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discord/guilds/${guildId}`);
      if (res.ok) {
        const data = await res.json();
        setGuild(data);
        setPostingChannelId(data.postingChannelId || '');
        setEnabled(data.enabled ?? true);

        if (data.subscription) {
          const sub = data.subscription;
          setModes(JSON.parse(sub.modes || '["ONLINE","OFFLINE","HYBRID"]'));
          setStates(JSON.parse(sub.states || '[]'));
          setCities(JSON.parse(sub.cities || '[]'));
          setThemes(JSON.parse(sub.themes || '[]'));
          setMinPrize(sub.minPrize || 0);
          setStudentsOnly(sub.studentsOnly ?? false);
          setNewHackathons(sub.newHackathons ?? true);
          setDeadlineAlerts(sub.deadlineAlerts ?? true);
          setRegistrationAlerts(sub.registrationAlerts ?? true);
          setChangeAlerts(sub.changeAlerts ?? true);
          setDailyDigest(sub.dailyDigest ?? false);
          setPingRoleId(sub.pingRoleId || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/discord/guilds/${guildId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postingChannelId,
          enabled,
          subscription: {
            modes: JSON.stringify(modes),
            states: JSON.stringify(states),
            cities: JSON.stringify(cities),
            themes: JSON.stringify(themes),
            minPrize: Number(minPrize),
            studentsOnly,
            newHackathons,
            deadlineAlerts,
            registrationAlerts,
            changeAlerts,
            dailyDigest,
            pingRoleId: pingRoleId || null,
          },
        }),
      });

      if (res.ok) {
        setMessage('Server configuration updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update server configuration.');
    } finally {
      setSaving(false);
    }
  };

  const toggleMode = (m: string) => {
    setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const toggleTheme = (t: string) => {
    setThemes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const toggleState = (st: string) => {
    setStates((prev) => (prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading server configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-[#1e293b] rounded-lg p-5">
        <div>
          <Link
            href="/dashboard/guilds"
            className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to servers
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            {guild?.guildName || 'Discord Server Configuration'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">Server ID: {guildId}</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold font-mono transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs font-mono flex items-center justify-between">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        {/* Left Column: Channel & Alert Types */}
        <div className="space-y-6">
          {/* Channel Setup */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              Posting Channel & Active Status
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  Discord Text Channel ID (#hackathons)
                </label>
                <input
                  type="text"
                  value={postingChannelId}
                  onChange={(e) => setPostingChannelId(e.target.value)}
                  placeholder="e.g. 102938475610293847"
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded p-2.5 text-white outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Copy channel ID from Discord (Right-click channel ➔ Copy Channel ID).
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notification Ping Role ID (Optional)</label>
                <input
                  type="text"
                  value={pingRoleId}
                  onChange={(e) => setPingRoleId(e.target.value)}
                  placeholder="e.g. 102938475610293847 (Role ID to mention)"
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded p-2.5 text-white outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Leave blank to avoid role mentions. Never spams @everyone automatically.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#1e293b]">
                <span className="text-slate-300">Enable Automated Posting</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </div>
            </div>
          </div>

          {/* Alert Toggles */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Alert Subscriptions
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  label: 'New Hackathons',
                  desc: 'Post rich embed when a newly verified hackathon is discovered',
                  val: newHackathons,
                  set: setNewHackathons,
                },
                {
                  label: 'Deadline Alerts (< 72h)',
                  desc: 'Post urgent countdown warnings when applications are closing',
                  val: deadlineAlerts,
                  set: setDeadlineAlerts,
                },
                {
                  label: 'Registration Opening Alerts',
                  desc: 'Notify community immediately when an upcoming event opens',
                  val: registrationAlerts,
                  set: setRegistrationAlerts,
                },
                {
                  label: 'Event Updates & Postponements',
                  desc: 'Announce rescheduled dates and prize pool increases',
                  val: changeAlerts,
                  set: setChangeAlerts,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-[#090d16] border border-[#1e293b] rounded flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 rounded ml-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Filter Rules */}
        <div className="space-y-6">
          {/* Format & Mode */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Event Formats</h2>
            <div className="flex gap-2">
              {['ONLINE', 'OFFLINE', 'HYBRID'].map((m) => {
                const active = modes.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleMode(m)}
                    className={`flex-1 py-2 rounded text-center border transition-colors ${
                      active
                        ? 'bg-blue-600 border-blue-500 text-white font-bold'
                        : 'bg-[#090d16] border-[#1e293b] text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              State / Region Filters
            </h2>
            <div className="flex flex-wrap gap-2">
              {STATES_LIST.map((st) => {
                const active = states.includes(st);
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => toggleState(st)}
                    className={`px-3 py-1.5 rounded border transition-colors ${
                      active
                        ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                        : 'bg-[#090d16] border-[#1e293b] text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-slate-400 block">
              If no state is selected, all states across India will be accepted.
            </span>
          </div>

          {/* Tracks / Themes */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Tracks & Themes
            </h2>
            <div className="flex flex-wrap gap-2">
              {THEMES_LIST.map((th) => {
                const active = themes.includes(th);
                return (
                  <button
                    type="button"
                    key={th}
                    onClick={() => toggleTheme(th)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      active
                        ? 'bg-purple-600 border-purple-500 text-white font-bold'
                        : 'bg-[#090d16] border-[#1e293b] text-slate-400'
                    }`}
                  >
                    {th}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min Prize & Student Only */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-lg p-5 space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Minimum Prize Pool (INR)</label>
              <input
                type="number"
                value={minPrize}
                onChange={(e) => setMinPrize(Number(e.target.value))}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded p-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1e293b]">
              <span className="text-slate-300">Student / College Only Events</span>
              <input
                type="checkbox"
                checked={studentsOnly}
                onChange={(e) => setStudentsOnly(e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
