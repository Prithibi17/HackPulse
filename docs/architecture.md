# HackPulse — System Architecture

**HackPulse** is an autonomous hackathon discovery platform and multi-server Discord bot designed to automatically aggregate, normalize, verify, and broadcast developer competitions across 60+ platforms without fabricating missing information.

```text
60+ Hackathon Sources (Devfolio, Unstop, Devpost, MLH, IITs, NITs, BITS, Global)
                                ↓
                        Source Connectors
                                ↓
                         Crawler Engine
                                ↓
                        Data Normalizer
                                ↓
                       Duplicate Detector
                                ↓
                       Change Detector (Diff)
                                ↓
                      PostgreSQL / SQLite
                                ↓
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
    Public Website          Discord Bot            Alert Engine
    (Next.js App)       (Multi-Server Bot)      (Cron Scheduler)
```

---

## 1. Core Modules

### A. Extensible Source Connectors (60 Sources)
Every data provider implements the `HackathonSource` interface:
```typescript
export interface HackathonSource {
  id: string;
  name: string;
  enabled: boolean;
  rateLimitMs?: number;

  discover(): Promise<RawHackathon[]>;
  getDetails(url: string): Promise<RawHackathon | null>;
}
```

### B. Normalizer & "Never Invent Information" Principle
- Unknown prize pools are stored as `null` and displayed as **"Prize pool not announced"**.
- Unconfirmed offline venues are displayed as **"Location not confirmed"**.
- Conflicting dates are flagged as **"Date verification required"** with verification state `CONFLICT`.
- Automatic Registration Status transition logic:
  - `registrationOpenDate > now` ➔ `UPCOMING`
  - `registrationOpenDate <= now && deadline >= now` ➔ `OPEN` (or `CLOSING_SOON` when `<= 72h`)
  - `registrationDeadline < now` ➔ `CLOSED`
  - `isPostponed === true` ➔ `POSTPONED`

### C. Multi-Signal Deduplication
Cross-source clustering uses:
- Exact registration URL / slug match
- Matching official website domains (excluding aggregators)
- Year/symbol-stripped title comparison + start date proximity (within 7 days)
- City and organizer fuzzy string similarity (Levenshtein & Jaro distances)

All matching source URLs are preserved as `HackathonSourceRecord` entries linked to a single canonical `Hackathon`.

### D. Change Detection & Postponement Handling
- Field diffing tracks modifications across scans (`HackathonChange` table).
- When an event is postponed, the previous dates are preserved in history, `isPostponed` is set to `true`, status becomes `POSTPONED`, and a dedicated postponement alert embed is dispatched to Discord.

### E. Fixed 5-Hour Scheduler
- Fixed cron schedule slots: `00:00`, `05:00`, `10:00`, `15:00`, `20:00` in configurable timezone (default `Asia/Kolkata`).
- Eliminates time drift across application restarts.
- Silent on no-change scans (never posts "No hackathons found" noise).
