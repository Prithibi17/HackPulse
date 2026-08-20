# Deploying HackPulse to Vercel (100% Automated, 0 Server Commands)

This guide shows you how to deploy **HackPulse** to **Vercel** so that the **website, 5-hour crawler, and Discord bot run 100% automatically 24/7** without you ever needing to run manual commands.

---

## ⚡ How It Works Serverlessly on Vercel

1. **Website**: Runs automatically on Vercel's Edge/Serverless infrastructure with automatic SSL, CDN caching, and 100% uptime.
2. **5-Hour Autonomous 60-Source Crawler**: Configured via `vercel.json` as a native **Vercel Cron Job** running every 5 hours (`0 */5 * * *`). It scans all 60 sources, verifies dates, merges duplicates, and posts new hackathons and updates to Discord.
3. **Discord Bot (Zero-Server Webhook Interactions)**: Discord sends slash commands (`/hackathons`, `/ask`, `/upcoming`, `/deadlines`, `/team`, `/setup`, `/settings`) directly to your Vercel endpoint (`/api/discord/interactions`). No background bot server or process needed!

---

## 🚀 3-Step Vercel Deployment

### Step 1: Push & Import in Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your repository: **`Prithibi17/HackPulse`**.
3. Framework Preset: **Next.js** (Auto-detected).

### Step 2: Configure Environment Variables in Vercel
In the Vercel project settings, add the following environment variables:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:...@db.supabase.co:5432/postgres` | PostgreSQL connection string (Supabase / Neon / Railway) |
| `DISCORD_CLIENT_ID` | `Your Discord Client ID` | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET`| `Your Discord Client Secret` | From Discord Developer Portal |
| `DISCORD_BOT_TOKEN` | `Your Discord Bot Token` | From Discord Developer Portal |
| `DISCORD_PUBLIC_KEY` | `Your Discord Public Key` | From Discord Developer Portal (General Information) |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel production URL |
| `CRAWLER_TIMEZONE` | `Asia/Kolkata` | Timezone for display and scheduling |

Click **Deploy**!

### Step 3: Link Discord Bot to Vercel in 1 Click
1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your **HackPulse** application.
3. On the **General Information** page, find **Interactions Endpoint URL**.
4. Enter:
   ```text
   https://your-project.vercel.app/api/discord/interactions
   ```
5. Click **Save Changes**. Discord will send a test handshake to verify your endpoint.

---

## 🎯 Verification

Once deployed:
1. **Website**: Visit `https://your-project.vercel.app`.
2. **Bot in Discord**: Type `/hackathons`, `/ask`, or `/setup` in any Discord server where HackPulse is installed.
3. **5-Hour Crawler**: Vercel Cron will automatically trigger `/api/crawler/run` every 5 hours without you having to touch anything!
