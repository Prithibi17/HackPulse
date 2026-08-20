import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
} from 'discord.js';
import prisma from '@/lib/prisma';
import { createHackathonEmbed, createClosingSoonEmbed } from './embeds';
import { interpretNaturalSearchQuery } from '../services/nlp-search.service';

let discordClientInstance: Client | null = null;

export function getDiscordClient(): Client | null {
  return discordClientInstance;
}

export function createSlashCommandDefinitions() {
  return [
    new SlashCommandBuilder()
      .setName('hackathons')
      .setDescription('Discover upcoming verified hackathons')
      .addStringOption((opt) =>
        opt
          .setName('mode')
          .setDescription('Filter by format (offline, online, hybrid)')
          .addChoices(
            { name: 'Offline', value: 'OFFLINE' },
            { name: 'Online', value: 'ONLINE' },
            { name: 'Hybrid', value: 'HYBRID' }
          )
      )
      .addStringOption((opt) => opt.setName('state').setDescription('Filter by state (e.g. Rajasthan, Karnataka)'))
      .addStringOption((opt) => opt.setName('city').setDescription('Filter by city (e.g. Jaipur, Bengaluru)'))
      .addStringOption((opt) => opt.setName('theme').setDescription('Filter by theme (e.g. AI, IoT, Web3)'))
      .addStringOption((opt) =>
        opt
          .setName('registration')
          .setDescription('Filter by registration status')
          .addChoices(
            { name: 'Open Now', value: 'OPEN' },
            { name: 'Closing Soon', value: 'CLOSING_SOON' },
            { name: 'Upcoming', value: 'UPCOMING' }
          )
      )
      .addIntegerOption((opt) => opt.setName('prize').setDescription('Minimum prize pool amount (INR)')),

    new SlashCommandBuilder().setName('upcoming').setDescription('List upcoming hackathons with open or soon-to-open registrations'),
    new SlashCommandBuilder().setName('deadlines').setDescription('List urgent hackathons closing within 72 hours'),
    new SlashCommandBuilder().setName('offline').setDescription('List upcoming in-person/offline hackathons'),
    new SlashCommandBuilder().setName('online').setDescription('List global online hackathons'),
    new SlashCommandBuilder()
      .setName('hackathon')
      .setDescription('View full details for a specific hackathon')
      .addStringOption((opt) => opt.setName('name').setDescription('Hackathon name or slug').setRequired(true)),

    new SlashCommandBuilder()
      .setName('ask')
      .setDescription('Search hackathons using natural language (e.g. "offline AI hackathons in Jaipur")')
      .addStringOption((opt) => opt.setName('query').setDescription('Natural search query').setRequired(true)),

    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Configure HackPulse for this server (Channel, Filters, Alerts)')
      .addChannelOption((opt) =>
        opt
          .setName('channel')
          .setDescription('Posting channel for hackathon alerts (#hackathons)')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('mode')
          .setDescription('Preferred hackathon mode')
          .addChoices(
            { name: 'All Formats (Online + Offline + Hybrid)', value: 'ALL' },
            { name: 'Offline In-Person Only', value: 'OFFLINE' },
            { name: 'Online Only', value: 'ONLINE' },
            { name: 'Hybrid Only', value: 'HYBRID' }
          )
      )
      .addStringOption((opt) => opt.setName('location').setDescription('Location filter (e.g. Rajasthan, Jaipur, India)'))
      .addStringOption((opt) => opt.setName('theme').setDescription('Focus tracks (e.g. AI, IoT, Web3)')),

    new SlashCommandBuilder().setName('settings').setDescription('View current server subscription settings'),
    new SlashCommandBuilder()
      .setName('team')
      .setDescription('Recruit teammates or join a hackathon team')
      .addStringOption((opt) => opt.setName('hackathon').setDescription('Hackathon name or slug').setRequired(true))
      .addStringOption((opt) => opt.setName('role').setDescription('Role needed (e.g. Frontend Dev, AI Researcher)').setRequired(true))
      .addStringOption((opt) => opt.setName('message').setDescription('Pitch or team requirements').setRequired(true)),

    new SlashCommandBuilder()
      .setName('save')
      .setDescription('Bookmark a hackathon to your profile')
      .addStringOption((opt) => opt.setName('hackathon').setDescription('Hackathon name or slug').setRequired(true)),

    new SlashCommandBuilder().setName('saved').setDescription('View your saved hackathons'),

    new SlashCommandBuilder()
      .setName('remind')
      .setDescription('Set a deadline alert reminder for a hackathon')
      .addStringOption((opt) => opt.setName('hackathon').setDescription('Hackathon name or slug').setRequired(true))
      .addStringOption((opt) =>
        opt
          .setName('timing')
          .setDescription('When to remind you')
          .addChoices(
            { name: '3 Days Before Deadline', value: '3_DAYS' },
            { name: '1 Day Before Deadline', value: '1_DAY' },
            { name: '6 Hours Before Deadline', value: '6_HOURS' },
            { name: '7 Days Before Deadline', value: '7_DAYS' }
          )
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('subscribe')
      .setDescription('Follow personal notifications for specific hackathon categories')
      .addStringOption((opt) => opt.setName('theme').setDescription('Track (AI, Web3, IoT)'))
      .addStringOption((opt) => opt.setName('location').setDescription('City or State')),

    new SlashCommandBuilder().setName('unsubscribe').setDescription('Stop personal DM alerts'),
  ];
}

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (commandName === 'hackathons' || commandName === 'upcoming' || commandName === 'offline' || commandName === 'online' || commandName === 'deadlines') {
    await interaction.deferReply();

    const mode = commandName === 'offline' ? 'OFFLINE' : commandName === 'online' ? 'ONLINE' : interaction.options.getString('mode');
    const state = interaction.options.getString('state');
    const city = interaction.options.getString('city');
    const theme = interaction.options.getString('theme');
    const regStatus = commandName === 'deadlines' ? 'CLOSING_SOON' : interaction.options.getString('registration');
    const minPrize = interaction.options.getInteger('prize');

    const where: any = {};
    if (mode && mode !== 'ALL') where.mode = mode;
    if (state) where.state = { contains: state };
    if (city) where.city = { contains: city };
    if (regStatus) where.registrationStatus = regStatus;
    if (minPrize) where.prizePool = { gte: minPrize };

    const list = await prisma.hackathon.findMany({
      where,
      orderBy: { registrationDeadline: 'asc' },
      take: 5,
    });

    if (list.length === 0) {
      return interaction.editReply({
        content: `🔍 No hackathons found matching your criteria. Browse all at ${appUrl}/discover`,
      });
    }

    const first = list[0];
    const payload = createHackathonEmbed(first, appUrl);
    await interaction.editReply({
      content: `Found **${list.length}** hackathons matching your query. Showing top result:`,
      embeds: payload.embeds,
      components: payload.components,
    });
  } else if (commandName === 'ask') {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);
    const nlp = await interpretNaturalSearchQuery(query);

    const where: any = {};
    if (nlp.interpretedFilters.mode && nlp.interpretedFilters.mode !== 'ALL') {
      where.mode = nlp.interpretedFilters.mode;
    }
    if (nlp.interpretedFilters.city) where.city = { contains: nlp.interpretedFilters.city };
    if (nlp.interpretedFilters.state) where.state = { contains: nlp.interpretedFilters.state };
    if (nlp.interpretedFilters.status) where.registrationStatus = nlp.interpretedFilters.status;
    if (nlp.interpretedFilters.minPrize) where.prizePool = { gte: nlp.interpretedFilters.minPrize };

    const results = await prisma.hackathon.findMany({
      where,
      take: 3,
      orderBy: { registrationDeadline: 'asc' },
    });

    if (results.length === 0) {
      return interaction.editReply({
        content: `🤖 Interpreted: *${nlp.explanation}*\n\n❌ No matching verified hackathons currently in database. Try widening your criteria!`,
      });
    }

    const first = results[0];
    const payload = createHackathonEmbed(first, appUrl);
    await interaction.editReply({
      content: `🤖 Interpreted: *${nlp.explanation}*\nShowing best match:`,
      embeds: payload.embeds,
      components: payload.components,
    });
  } else if (commandName === 'setup') {
    await interaction.deferReply({ ephemeral: true });

    // Permission check: requires Manage Guild or Administrator
    if (!interaction.memberPermissions?.has('ManageGuild') && !interaction.memberPermissions?.has('Administrator')) {
      return interaction.editReply({
        content: '❌ **Permission Denied**: You need **Manage Server** or **Administrator** permissions to configure HackPulse.',
      });
    }

    const channel = interaction.options.getChannel('channel', true);
    const mode = interaction.options.getString('mode') || 'ALL';
    const location = interaction.options.getString('location');
    const theme = interaction.options.getString('theme');

    const modes = mode === 'ALL' ? ['ONLINE', 'OFFLINE', 'HYBRID'] : [mode];
    const states = location ? [location] : [];
    const themes = theme ? [theme] : [];

    const guildId = interaction.guildId!;
    const guildName = interaction.guild?.name || 'Discord Server';

    await prisma.discordGuild.upsert({
      where: { guildId },
      update: {
        guildName,
        postingChannelId: channel.id,
        enabled: true,
      },
      create: {
        guildId,
        guildName,
        postingChannelId: channel.id,
        enabled: true,
      },
    });

    await prisma.guildSubscription.upsert({
      where: { guildId },
      update: {
        modes: JSON.stringify(modes),
        states: JSON.stringify(states),
        themes: JSON.stringify(themes),
        newHackathons: true,
        deadlineAlerts: true,
        registrationAlerts: true,
        changeAlerts: true,
      },
      create: {
        guildId,
        modes: JSON.stringify(modes),
        states: JSON.stringify(states),
        themes: JSON.stringify(themes),
        newHackathons: true,
        deadlineAlerts: true,
        registrationAlerts: true,
        changeAlerts: true,
      },
    });

    await interaction.editReply({
      content: `✅ **Setup Complete!**\n\n📢 **Posting Channel:** <#${channel.id}>\n🏢 **Formats:** ${modes.join(', ')}\n📍 **Locations:** ${states.length ? states.join(', ') : 'All Locations'}\n🎯 **Tracks:** ${themes.length ? themes.join(', ') : 'All Tracks'}\n\nHackPulse will now automatically discover and publish matching hackathons to <#${channel.id}> every 5 hours!`,
    });
  } else if (commandName === 'settings') {
    await interaction.deferReply({ ephemeral: true });
    const guild = await prisma.discordGuild.findUnique({
      where: { guildId: interaction.guildId! },
      include: { subscription: true },
    });

    if (!guild || !guild.subscription) {
      return interaction.editReply({
        content: '⚙️ HackPulse is not configured on this server yet. Run `/setup` to get started!',
      });
    }

    const sub = guild.subscription;
    await interaction.editReply({
      content: `⚙️ **HackPulse Server Settings**\n\n• **Status:** ${guild.enabled ? '🟢 Active' : '🔴 Paused'}\n• **Posting Channel:** <#${guild.postingChannelId}>\n• **Timezone:** \`${guild.timezone}\`\n• **Alerts:** New Hackathons (${sub.newHackathons ? '✓' : '✗'}), Deadlines (${sub.deadlineAlerts ? '✓' : '✗'}), Updates (${sub.changeAlerts ? '✓' : '✗'})\n• **Manage on Web:** ${appUrl}/dashboard/guilds/${guild.guildId}`,
    });
  } else if (commandName === 'team') {
    await interaction.deferReply();
    const hackName = interaction.options.getString('hackathon', true);
    const roleNeeded = interaction.options.getString('role', true);
    const message = interaction.options.getString('message', true);

    const hackathon = await prisma.hackathon.findFirst({
      where: {
        OR: [{ name: { contains: hackName } }, { slug: hackName }],
      },
    });

    if (!hackathon) {
      return interaction.editReply({
        content: `❌ Could not find hackathon "${hackName}". Check name and try again!`,
      });
    }

    const teamReq = await prisma.teamRequest.create({
      data: {
        hackathonId: hackathon.id,
        guildId: interaction.guildId || 'DM',
        channelId: interaction.channelId,
        authorId: interaction.user.id,
        authorName: interaction.user.username,
        rolesNeeded: roleNeeded,
        skills: 'Open',
        message,
      },
    });

    await interaction.editReply({
      content: `👥 **TEAM REQUEST: ${hackathon.name}**\n\nLooking for: **${roleNeeded}**\nPitch: "${message}"\nPosted by: <@${interaction.user.id}>\n\n*Reply in this thread to join up!*`,
    });
  } else if (commandName === 'save') {
    await interaction.deferReply({ ephemeral: true });
    const hackName = interaction.options.getString('hackathon', true);
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ name: { contains: hackName } }, { slug: hackName }] },
    });
    if (!hackathon) {
      return interaction.editReply({ content: `❌ Hackathon "${hackName}" not found.` });
    }

    await prisma.savedHackathon.upsert({
      where: {
        discordUserId_hackathonId: {
          discordUserId: interaction.user.id,
          hackathonId: hackathon.id,
        },
      },
      update: {},
      create: {
        discordUserId: interaction.user.id,
        hackathonId: hackathon.id,
      },
    });

    await interaction.editReply({
      content: `🔖 Saved **${hackathon.name}** to your bookmarks! Run \`/saved\` anytime to view your list.`,
    });
  } else if (commandName === 'saved') {
    await interaction.deferReply({ ephemeral: true });
    const saved = await prisma.savedHackathon.findMany({
      where: { discordUserId: interaction.user.id },
      include: { hackathon: true },
    });

    if (saved.length === 0) {
      return interaction.editReply({ content: '🔖 You have no saved hackathons yet. Use `/save <name>` to bookmark events!' });
    }

    const list = saved.map((s, idx) => `${idx + 1}. **${s.hackathon.name}** (${s.hackathon.mode}) — Deadline: ${s.hackathon.registrationDeadline ? s.hackathon.registrationDeadline.toLocaleDateString() : 'TBD'}`).join('\n');
    await interaction.editReply({ content: `🔖 **Your Saved Hackathons (${saved.length})**:\n\n${list}\n\n[Explore More Hackathons](${appUrl}/discover)` });
  } else if (commandName === 'remind') {
    await interaction.deferReply({ ephemeral: true });
    const hackName = interaction.options.getString('hackathon', true);
    const timing = interaction.options.getString('timing', true);

    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ name: { contains: hackName } }, { slug: hackName }] },
    });

    if (!hackathon || !hackathon.registrationDeadline) {
      return interaction.editReply({ content: `❌ Could not find hackathon or deadline is not announced.` });
    }

    let offsetMs = 24 * 3600 * 1000;
    if (timing === '7_DAYS') offsetMs = 7 * 24 * 3600 * 1000;
    if (timing === '3_DAYS') offsetMs = 3 * 24 * 3600 * 1000;
    if (timing === '6_HOURS') offsetMs = 6 * 3600 * 1000;

    const triggerTime = new Date(hackathon.registrationDeadline.getTime() - offsetMs);

    await prisma.hackathonReminder.create({
      data: {
        discordUserId: interaction.user.id,
        hackathonId: hackathon.id,
        triggerTime,
        reminderType: timing,
        status: 'PENDING',
      },
    });

    await interaction.editReply({
      content: `⏰ Reminder set! We'll alert you **${timing.replace('_', ' ').toLowerCase()}** (${triggerTime.toLocaleDateString()}) before **${hackathon.name}** registration closes.`,
    });
  }
}

export async function handleButtonInteraction(interaction: ButtonInteraction) {
  const customId = interaction.customId;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (customId.startsWith('btn_save_')) {
    const hackathonId = customId.replace('btn_save_', '');
    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon) return interaction.reply({ content: '❌ Hackathon not found.', ephemeral: true });

    await prisma.savedHackathon.upsert({
      where: {
        discordUserId_hackathonId: {
          discordUserId: interaction.user.id,
          hackathonId,
        },
      },
      update: {},
      create: {
        discordUserId: interaction.user.id,
        hackathonId,
      },
    });

    return interaction.reply({
      content: `🔖 Saved **${hackathon.name}** to your bookmarks!`,
      ephemeral: true,
    });
  }

  if (customId.startsWith('btn_remind_')) {
    const hackathonId = customId.replace('btn_remind_', '');
    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon || !hackathon.registrationDeadline) {
      return interaction.reply({ content: '❌ Deadline not announced yet.', ephemeral: true });
    }

    const triggerTime = new Date(hackathon.registrationDeadline.getTime() - 24 * 3600 * 1000);
    await prisma.hackathonReminder.create({
      data: {
        discordUserId: interaction.user.id,
        hackathonId,
        triggerTime,
        reminderType: '1_DAY',
        status: 'PENDING',
      },
    });

    return interaction.reply({
      content: `⏰ Reminder set! We'll alert you 1 day before **${hackathon.name}** registration closes.`,
      ephemeral: true,
    });
  }

  if (customId.startsWith('btn_team_')) {
    const hackathonId = customId.replace('btn_team_', '');
    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon) return interaction.reply({ content: '❌ Hackathon not found.', ephemeral: true });

    // Show modal for team request
    const modal = new ModalBuilder()
      .setCustomId(`modal_team_${hackathonId}`)
      .setTitle(`Find Team: ${hackathon.name.slice(0, 30)}`);

    const roleInput = new TextInputBuilder()
      .setCustomId('role_needed')
      .setLabel('What roles / teammates are you looking for?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g. 1 Backend Engineer, 1 UI/UX Designer')
      .setRequired(true);

    const pitchInput = new TextInputBuilder()
      .setCustomId('pitch_message')
      .setLabel('Project pitch or message')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Tell potential teammates about your project concept and stack...')
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(roleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(pitchInput)
    );

    return interaction.showModal(modal);
  }
}

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  if (interaction.customId.startsWith('modal_team_')) {
    const hackathonId = interaction.customId.replace('modal_team_', '');
    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    const roleNeeded = interaction.fields.getTextInputValue('role_needed');
    const message = interaction.fields.getTextInputValue('pitch_message');

    await prisma.teamRequest.create({
      data: {
        hackathonId,
        guildId: interaction.guildId || 'DM',
        channelId: interaction.channelId || '',
        authorId: interaction.user.id,
        authorName: interaction.user.username,
        rolesNeeded: roleNeeded,
        skills: 'Open',
        message,
      },
    });

    return interaction.reply({
      content: `👥 **TEAM REQUEST POSTED**\n\n**${hackathon?.name || 'Hackathon'}**\nLooking for: **${roleNeeded}**\nPitch: "${message}"\nPosted by: <@${interaction.user.id}>`,
    });
  }
}

export function initDiscordBot(): Client {
  if (discordClientInstance) return discordClientInstance;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('ready', () => {
    console.log(`[DiscordBot] 🤖 Logged in as ${client.user?.tag}!`);
  });

  client.on('guildCreate', async (guild) => {
    console.log(`[DiscordBot] 👋 Joined guild: ${guild.name} (${guild.id})`);
    await prisma.discordGuild.upsert({
      where: { guildId: guild.id },
      update: { guildName: guild.name, enabled: true },
      create: { guildId: guild.id, guildName: guild.name, enabled: true },
    });

    const defaultChannel = guild.systemChannel || guild.channels.cache.find((c) => c.isTextBased());
    if (defaultChannel && defaultChannel.isTextBased()) {
      try {
        await (defaultChannel as any).send(
          '👋 **Welcome to HackPulse!**\n\nI can automatically discover, verify, and publish hackathons for your community.\n\nRun `/setup` to configure your posting channel and filters!'
        );
      } catch {}
    }
  });

  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        await handleSlashCommand(interaction);
      } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
      } else if (interaction.isModalSubmit()) {
        await handleModalSubmit(interaction);
      }
    } catch (err: any) {
      console.error('[DiscordBot] Interaction error:', err);
      if (interaction.isRepliable() && !interaction.replied) {
        await interaction.reply({
          content: '❌ An error occurred while executing this command.',
          ephemeral: true,
        });
      }
    }
  });

  discordClientInstance = client;
  return client;
}
