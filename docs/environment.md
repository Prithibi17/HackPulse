# HackPulse — Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | `file:./dev.db` | PostgreSQL (Supabase / Neon) or SQLite connection string |
| `DISCORD_CLIENT_ID` | **Yes** | — | Discord OAuth2 Application Client ID |
| `DISCORD_CLIENT_SECRET` | **Yes** | — | Discord OAuth2 Application Client Secret |
| `DISCORD_BOT_TOKEN` | **Yes** | — | Discord Bot Gateway Authentication Token |
| `DISCORD_PUBLIC_KEY` | Optional | — | Discord Interactions Public Key |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `http://localhost:3000` | Base public URL of the HackPulse web application |
| `NEXTAUTH_SECRET` | Optional | — | NextAuth session encryption secret key |
| `CRAWLER_TIMEZONE` | Optional | `Asia/Kolkata` | Fixed cron schedule execution timezone |
| `CRAWLER_INTERVAL_HOURS`| Optional | `5` | Scan interval in hours (fixed cron slots: 00, 05, 10, 15, 20) |
