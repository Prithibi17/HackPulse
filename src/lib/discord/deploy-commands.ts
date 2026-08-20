import { REST, Routes } from 'discord.js';
import { createSlashCommandDefinitions } from './client';

async function deployGlobalSlashCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID || '1540009540576215112';

  if (!token || token.startsWith('mock_')) {
    console.error('❌ DISCORD_BOT_TOKEN is missing or mock in .env');
    process.exit(1);
  }

  const commands = createSlashCommandDefinitions().map((cmd) => cmd.toJSON());
  const rest = new REST({ version: '10' }).setToken(token);

  console.log(`[DeployCommands] 🚀 Registering ${commands.length} slash commands to Discord Application ${clientId}...`);

  try {
    const data: any = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`[DeployCommands] ✅ Successfully registered ${data.length} global slash commands with Discord API!`);
  } catch (error) {
    console.error('[DeployCommands] ❌ Error registering commands:', error);
    process.exit(1);
  }
}

deployGlobalSlashCommands();
