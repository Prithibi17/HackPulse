# 📡 HackPulse — Discover. Build. Compete.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=flat-square&logo=discord)](https://discord.js.org/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20(19%20passed)-10B981?style=flat-square)](https://vitest.dev/)

**HackPulse** is a full-stack, production-grade hackathon discovery platform, 5-hour autonomous crawler across 60+ sources, and multi-server Discord bot. It eliminates manual checking across Devfolio, Unstop, Devpost, MLH, and 60+ university portals by continuously aggregating, normalizing, verifying, and publishing upcoming hackathons to student communities and developer servers.

---

## 🌟 Key Features

1. **Public Discovery Website**: Modern, developer-focused, information-dense interface without AI visual noise or decorative fluff.
2. **60-Source Autonomous Crawler**: Discovers hackathons across 60 platforms including Devfolio, Unstop, Devpost, MLH, IITs, NITs, BITS, state universities, and global Web3 foundations.
3. **Deterministic Validation & Integrity**: Strictly enforces the *"Never Invent Information"* principle. Missing fields are transparently labeled (`"Prize pool not announced"`, `"Location not confirmed"`), and dates are checked for conflicts.
4. **Multi-Source Deduplication**: Fuzzy Levenshtein matching, domain comparison, date proximity, and organizer clustering link multiple source listings to a single canonical event.
5. **Change Detection & Postponements**: Field diffing detects deadline extensions, venue announcements, and rescheduled dates (preserving previous dates in history with dedicated postponement embeds).
6. **Fixed 5-Hour Scheduler**: Executes on fixed cron slots (`00:00`, `05:00`, `10:00`, `15:00`, `20:00` in `Asia/Kolkata` timezone) to prevent time drift across restarts.
7. **Multi-Server Discord Bot**: Interactive slash commands (`/hackathons`, `/ask`, `/upcoming`, `/deadlines`, `/team`, `/setup`, `/settings`), interactive buttons (`[Register Now]`, `[View Details]`, `[Save]`, `[Remind Me]`, `[Find Team]`), and post deduplication database tracking.
8. **Interactive Calendar**: Monthly timeline displaying application deadlines, hackathon kickoffs, and finale dates.
9. **Deterministic Natural Query Search**: Interprets natural user questions (e.g., *"offline AI hackathons in Jaipur with prize > 1 lakh"*) into strict database filters without hallucinations.
10. **Admin & Multi-Server Dashboard**: Full management for verification overrides, duplicate merges, server channel routing, 60-source latency monitoring, and structured system audit logs.

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/hackpulse.git
cd hackpulse
npm install
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Configure your credentials in `.env`:
```env
DATABASE_URL="file:./dev.db"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
DISCORD_BOT_TOKEN="your_discord_bot_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRAWLER_TIMEZONE="Asia/Kolkata"
```

### 3. Initialize Database & Seed Real-World Events
```bash
# Push Prisma schema to SQLite / PostgreSQL
npx prisma db push

# Populate realistic test dataset (Jaipur, Bengaluru, Delhi, Online, Closing Soon, Postponed)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 Running Bot & Background Scheduler

To run the Discord bot Gateway client and background 5-hour scheduler worker:
```bash
# Start Discord Bot Gateway Service
npm run bot

# Start Fixed 5-Hour Scheduler & Deadline Alert Worker
npm run worker
```

---

## 🧪 Running Automated Tests

Run the complete test suite (19 tests across deduplication, registration status, change detection, scheduler timing, natural search, and subscription matching):
```bash
npm test
```

---

## 📁 Project Structure

```text
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Public Homepage with curated sections
│   │   ├── discover/             # Faceted search & filter UI
│   │   ├── offline/              # In-person campus hackathons directory
│   │   ├── online/               # Virtual & global hackathons
│   │   ├── deadlines/            # Urgent closing-soon hackathons (<72h)
│   │   ├── calendar/             # Interactive deadline calendar
│   │   ├── hackathons/[slug]/    # Detailed event view & verification breakdown
│   │   ├── communities/          # "Add to Discord" & setup guide
│   │   ├── dashboard/            # Admin & Multi-Server Dashboard
│   │   │   ├── hackathons/       # Hackathon CRUD & verification overrides
│   │   │   ├── guilds/           # Server configuration & channel routing
│   │   │   ├── sources/          # 60-Source health & latency monitor
│   │   │   ├── crawler/          # 5-Hour crawler runs & diff inspector
│   │   │   └── logs/             # Structured system audit logs
│   │   └── api/                  # REST API endpoints & Webhooks
│   ├── components/               # Clean modern UI components (Tailwind + Lucide)
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── crawler/              # Crawler engine, deduplicator, normalizer, 60-source registry
│   │   │   ├── adapters/         # Devfolio, Unstop, Devpost, MLH, University feeds
│   │   ├── discord/              # Discord.js client, embeds, commands, interactions
│   │   ├── scheduler/            # Fixed 5-hour cron worker & reminder engine
│   │   └── services/             # Hackathons, Guild subscriptions, NLP search service
├── prisma/
│   ├── schema.prisma             # Comprehensive Prisma database schema
│   └── seed.ts                   # Realistic seed dataset
├── tests/                        # Vitest automated test suite
└── docs/                         # Detailed architecture & integration documentation
```

---

## 📄 License
MIT © HackPulse Team.
