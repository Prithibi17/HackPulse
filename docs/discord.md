# HackPulse — Discord Bot & Integration Guide

The HackPulse Discord bot connects developer communities, university clubs, and hackathon organizers to autonomous event discovery and alert routing.

---

## 1. Discord Developer Portal Setup Instructions

Follow these exact steps to set up your Discord application and bot:

### Step 1: Create Application
1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** in the top right.
3. Enter Application Name: `HackPulse`.
4. Agree to Discord Developer Terms and click **Create**.

### Step 2: Configure Bot Credentials
1. Go to the **Bot** tab on the left sidebar.
2. Click **Add Bot** (or **Reset Token**).
3. Copy the **Token** and paste it into your `.env` as `DISCORD_BOT_TOKEN`.
4. Under **Privileged Gateway Intents**, enable:
   - **Message Content Intent** (Required for commands and thread reading)
   - **Server Members Intent** (Optional, for pinging roles)
5. Save changes.

### Step 3: OAuth2 & Client Secrets
1. Go to the **OAuth2** tab.
2. Copy the **Client ID** and save to `.env` as `DISCORD_CLIENT_ID`.
3. Under **Client Secret**, click **Reset Secret**, copy, and save to `.env` as `DISCORD_CLIENT_SECRET`.
4. Under **Redirects**, add:
   - `http://localhost:3000/api/auth/callback/discord` (Local development)
   - `https://your-production-domain.com/api/auth/callback/discord` (Production)

### Step 4: Bot Installation URL & Minimal Permissions
Under **OAuth2 ➔ URL Generator**:
- Select Scopes:
  - `bot`
  - `applications.commands`
- Select Bot Permissions:
  - `View Channels`
  - `Send Messages`
  - `Embed Links`
  - `Use Application Commands`
  - `Create Public Threads`
  - `Send Messages in Threads`
  - `Read Message History`

> [!IMPORTANT]
> **Minimal Permissions**: HackPulse does NOT require Administrator permissions.

Generated Bot Invite URL:
```text
https://discord.com/api/oauth2/authorize?client_id=<YOUR_CLIENT_ID>&permissions=277025508352&scope=bot%20applications.commands
```

---

## 2. Slash Commands Reference

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `/hackathons` | `mode`, `state`, `city`, `theme`, `registration`, `prize` | Search upcoming verified hackathons with filters |
| `/ask` | `query` (string) | Deterministic natural language query search without hallucinations |
| `/upcoming` | *None* | List upcoming hackathons with open or soon-to-open registrations |
| `/deadlines` | *None* | List urgent hackathons closing within 72 hours |
| `/offline` | *None* | List campus & in-person hackathons |
| `/online` | *None* | List virtual global hackathons |
| `/hackathon` | `name` (string) | View full details, tracks, and official links for an event |
| `/team` | `hackathon`, `role`, `message` | Recruit teammates with automatic thread generation |
| `/save` | `hackathon` (string) | Bookmark an event to personal profile |
| `/saved` | *None* | View your saved hackathons list |
| `/remind` | `hackathon`, `timing` (`7_DAYS`, `3_DAYS`, `1_DAY`, `6_HOURS`) | Schedule deadline alert reminders |
| `/setup` | `channel`, `mode`, `location`, `theme` | Interactive guided server setup wizard (requires Manage Server) |
| `/settings` | *None* | View current server subscription settings and web dashboard link |

---

## 3. First-Time Setup Wizard (`/setup`)

When the bot joins a server or when an administrator executes `/setup`:
1. **Choose Posting Channel**: Select `#hackathons` or announcement channel.
2. **Choose Event Formats**: `All`, `Offline In-Person`, `Online`, `Hybrid`.
3. **Choose Locations**: e.g., `Rajasthan`, `Jaipur`, `Karnataka`, `Bengaluru`.
4. **Choose Tracks**: e.g., `AI`, `IoT`, `Web3`, `Cybersecurity`, `Open Innovation`.
5. **Set Minimum Prize**: e.g., `₹50,000`.
6. **Set Role Mention**: Ping a specific role (e.g. `@Hackers`) or leave blank for silent posting.

---

## 4. Interactive Buttons on Hackathon Posts

Every automated Discord post includes interactive action buttons:
- **`[Register Now]`**: Direct link to official organizer / partner registration portal.
- **`[View on HackPulse]`**: Deep link to canonical HackPulse verification page.
- **`[Save]`**: Instantly bookmarks the event for the clicking Discord user.
- **`[Remind Me]`**: Sets up 1-day pre-deadline DM alert.
- **`[Find Team]`**: Opens interactive recruitment modal and posts team request thread.
