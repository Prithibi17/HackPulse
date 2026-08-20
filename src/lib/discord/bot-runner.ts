import { initDiscordBot } from './client';

async function startBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  console.log('[BotRunner] Starting HackPulse Discord Bot Service...');

  const client = initDiscordBot();

  if (token && !token.startsWith('mock_')) {
    try {
      await client.login(token);
      console.log('[BotRunner] ✅ Discord Bot Gateway connected successfully.');
    } catch (err) {
      console.warn('[BotRunner] ⚠️ Live token login failed, operating in simulated mode for local development/testing:', err);
    }
  } else {
    console.log('[BotRunner] ℹ️ DISCORD_BOT_TOKEN is set to mock/development. Bot is operating in simulation mode.');
  }
}

startBot().catch((err) => {
  console.error('[BotRunner] Fatal startup error:', err);
});
