# HackPulse — Database Schema & Data Models

HackPulse uses **Prisma ORM** with support for PostgreSQL (Supabase) and SQLite for local development.

---

## Tables & Relationships

### 1. `Hackathon`
The canonical verified hackathon record.
- `id` (String / CUID, Primary Key)
- `name` (String)
- `slug` (String, Unique index)
- `description` (Text)
- `organizerName` (String)
- `organizerWebsite`, `organizerLogo` (String, Nullable)
- `mode` (`ONLINE` | `OFFLINE` | `HYBRID`)
- `venueName`, `city`, `state`, `country` (String, Nullable)
- `latitude`, `longitude` (Float, Nullable)
- `prizePool` (Int, Nullable — `null` if unannounced)
- `prizeCurrency` (String, default `"INR"`)
- `registrationStatus` (`UPCOMING` | `OPEN` | `CLOSING_SOON` | `CLOSED` | `POSTPONED`)
- `registrationOpenDate`, `registrationDeadline`, `eventStartDate`, `eventEndDate` (DateTime, Nullable)
- `teamMin`, `teamMax` (Int)
- `eligibility` (String)
- `themes`, `technologies` (JSON string array)
- `registrationUrl`, `officialWebsite`, `bannerImage` (String)
- `verified` (Boolean), `verificationStatus` (`VERIFIED` | `PARTIALLY_VERIFIED` | `UNVERIFIED` | `CONFLICT`)
- `isPostponed`, `isCancelled` (Boolean)
- `firstSeenAt`, `lastSeenAt`, `lastCheckedAt` (DateTime)

### 2. `HackathonSourceRecord`
Links multiple discovery sources to one canonical event.
- `id` (PK)
- `hackathonId` (FK -> `Hackathon.id`)
- `sourceName` (e.g. "Devfolio", "Unstop", "MLH", "IIT Bombay")
- `sourceUrl` (String)
- `isCanonical` (Boolean)

### 3. `HackathonChange`
Audit history of field modifications across crawl cycles.
- `id` (PK)
- `hackathonId` (FK -> `Hackathon.id`)
- `field` (e.g. `eventStartDate`, `registrationDeadline`, `prizePool`)
- `previousValue`, `newValue` (String, Nullable)
- `detectedAt` (DateTime)
- `source` (String)

### 4. `DiscordGuild` & `GuildSubscription`
Per-server configuration and filtering rules.
- `DiscordGuild`: `guildId` (Unique), `guildName`, `postingChannelId`, `timezone`, `enabled`
- `GuildSubscription`: `modes`, `countries`, `states`, `cities`, `themes`, `minPrize`, `studentsOnly`, `newHackathons`, `deadlineAlerts`, `registrationAlerts`, `changeAlerts`, `pingRoleId`

### 5. `DiscordPost`
Deduplication registry tracking posts sent to Discord servers.
- `guildId`, `channelId`, `messageId`, `hackathonId`, `postType` (`NEW_EVENT` | `DEADLINE_ALERT` | `POSTPONED` | `UPDATE`)
- Unique constraint: `@@unique([guildId, channelId, hackathonId, postType])`

### 6. `SavedHackathon`, `HackathonReminder`, `TeamRequest`, `AdminAuditLog`, `CrawlerRun`, `CrawlerSourceRun`.
