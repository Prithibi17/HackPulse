# HackPulse — Production Deployment Guide

HackPulse can be deployed as a unified Next.js full-stack application alongside dedicated background workers.

---

## 1. Prerequisites

- Node.js 18+ (Node 20+ recommended)
- PostgreSQL Database (Supabase, Neon, AWS RDS, or Railway)
- Discord Application credentials (from [Discord Developer Portal](https://discord.com/developers/applications))

---

## 2. Step-by-Step Deployment (Vercel / Railway / Docker)

### Option A: Railway / Render (Full-Stack + Bot + Worker)

1. **Clone Repository & Set Environment Variables**:
   Configure `.env` with production keys:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
   DISCORD_CLIENT_ID="your_client_id"
   DISCORD_CLIENT_SECRET="your_client_secret"
   DISCORD_BOT_TOKEN="your_bot_token"
   NEXT_PUBLIC_APP_URL="https://hackpulse.up.railway.app"
   CRAWLER_TIMEZONE="Asia/Kolkata"
   ```

2. **Run Migrations & Seed Initial Dataset**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

3. **Start Services**:
   - **Web App**: `npm run start` (or `next start`)
   - **Discord Bot**: `npm run bot`
   - **5-Hour Scheduler Worker**: `npm run worker`

---

## 3. Production Monitoring & Health Checks

- Admin Overview: `https://your-domain.com/dashboard`
- 60-Source Directory & Latency: `https://your-domain.com/dashboard/sources`
- Manual Scan Trigger: `https://your-domain.com/dashboard/crawler`
- System Logs: `https://your-domain.com/dashboard/logs`
