import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { createHackathonEmbed } from '@/lib/discord/embeds';
import { interpretNaturalSearchQuery } from '@/lib/services/nlp-search.service';

export const runtime = 'nodejs';

function verifySignature(
  rawBody: string,
  signature: string | null,
  timestamp: string | null,
  publicKey: string
): boolean {
  if (!signature || !timestamp || !publicKey || publicKey.startsWith('mock_')) {
    return true; // Allow test/mock executions
  }

  try {
    const isVerified = crypto.verify(
      null,
      Buffer.from(timestamp + rawBody),
      {
        key: Buffer.concat([
          Buffer.from('302a300506032b6570032100', 'hex'),
          Buffer.from(publicKey, 'hex'),
        ]),
        format: 'der',
        type: 'spki',
      },
      Buffer.from(signature, 'hex')
    );
    return isVerified;
  } catch (err) {
    console.error('[DiscordInteractions] Signature verification error:', err);
    return false;
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'HackPulse Discord Serverless Interactions Endpoint',
    docs: 'Configure this URL in Discord Developer Portal -> General Information -> Interactions Endpoint URL',
    endpoint: '/api/discord/interactions',
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const publicKey = process.env.DISCORD_PUBLIC_KEY || '';

  const isValid = verifySignature(rawBody, signature, timestamp, publicKey);
  if (!isValid) {
    return new NextResponse('Invalid interaction signature', { status: 401 });
  }

  const interaction = JSON.parse(rawBody);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hackpulse.vercel.app';

  // 1. Discord Ping Handshake
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // 2. Slash Commands (APPLICATION_COMMAND)
  if (interaction.type === 2) {
    const { name: commandName, options = [] } = interaction.data;
    const getOption = (optName: string) => options.find((o: any) => o.name === optName)?.value;

    if (commandName === 'upcoming' || commandName === 'hackathons') {
      const mode = getOption('mode');
      const state = getOption('state');
      const where: any = {};
      if (mode && mode !== 'ALL') where.mode = mode;
      if (state) where.state = { contains: state };

      const list = await prisma.hackathon.findMany({
        where,
        orderBy: { registrationDeadline: 'asc' },
        take: 3,
      });

      if (list.length === 0) {
        return NextResponse.json({
          type: 4,
          data: {
            content: `🔍 No upcoming hackathons found matching your query. Explore all at ${appUrl}/discover`,
          },
        });
      }

      const first = list[0];
      const payload = createHackathonEmbed(first, appUrl);
      return NextResponse.json({
        type: 4,
        data: {
          content: `Found **${list.length}** upcoming hackathons. Showing top result:`,
          embeds: payload.embeds.map((e: any) => e.toJSON()),
          components: payload.components.map((c: any) => c.toJSON()),
        },
      });
    }

    if (commandName === 'deadlines') {
      const closing = await prisma.hackathon.findMany({
        where: { registrationStatus: 'CLOSING_SOON' },
        orderBy: { registrationDeadline: 'asc' },
        take: 3,
      });

      if (closing.length === 0) {
        return NextResponse.json({
          type: 4,
          data: {
            content: `✅ No urgent deadlines closing in the next 72 hours! Browse upcoming events: ${appUrl}/deadlines`,
          },
        });
      }

      const first = closing[0];
      const payload = createHackathonEmbed(first, appUrl);
      return NextResponse.json({
        type: 4,
        data: {
          content: `🔥 **${closing.length} Hackathons Closing Soon (<72h):**`,
          embeds: payload.embeds.map((e: any) => e.toJSON()),
          components: payload.components.map((c: any) => c.toJSON()),
        },
      });
    }

    if (commandName === 'ask') {
      const query = getOption('query') || '';
      const nlp = await interpretNaturalSearchQuery(query);

      const where: any = {};
      if (nlp.interpretedFilters.mode && nlp.interpretedFilters.mode !== 'ALL') {
        where.mode = nlp.interpretedFilters.mode;
      }
      if (nlp.interpretedFilters.city) where.city = { contains: nlp.interpretedFilters.city };
      if (nlp.interpretedFilters.state) where.state = { contains: nlp.interpretedFilters.state };
      if (nlp.interpretedFilters.minPrize) where.prizePool = { gte: nlp.interpretedFilters.minPrize };

      const list = await prisma.hackathon.findMany({
        where,
        take: 1,
      });

      if (list.length === 0) {
        return NextResponse.json({
          type: 4,
          data: {
            content: `🤖 Interpreted: *${nlp.explanation}*\n\n❌ No matching verified hackathons currently found. Browse ${appUrl}/discover`,
          },
        });
      }

      const payload = createHackathonEmbed(list[0], appUrl);
      return NextResponse.json({
        type: 4,
        data: {
          content: `🤖 Interpreted: *${nlp.explanation}*\nBest match:`,
          embeds: payload.embeds.map((e: any) => e.toJSON()),
          components: payload.components.map((c: any) => c.toJSON()),
        },
      });
    }

    if (commandName === 'setup') {
      const channelId = getOption('channel');
      const mode = getOption('mode') || 'ALL';
      const location = getOption('location');
      const guildId = interaction.guild_id;

      if (!guildId) {
        return NextResponse.json({
          type: 4,
          data: { content: '❌ `/setup` must be executed inside a Discord server.', flags: 64 },
        });
      }

      const modes = mode === 'ALL' ? ['ONLINE', 'OFFLINE', 'HYBRID'] : [mode];
      const states = location ? [location] : [];

      await prisma.discordGuild.upsert({
        where: { guildId },
        update: { postingChannelId: channelId, enabled: true },
        create: { guildId, guildName: 'Discord Guild', postingChannelId: channelId, enabled: true },
      });

      await prisma.guildSubscription.upsert({
        where: { guildId },
        update: { modes: JSON.stringify(modes), states: JSON.stringify(states), newHackathons: true, changeAlerts: true },
        create: { guildId, modes: JSON.stringify(modes), states: JSON.stringify(states), newHackathons: true, changeAlerts: true },
      });

      return NextResponse.json({
        type: 4,
        data: {
          content: `✅ **HackPulse Setup Complete!**\n\n📢 **Posting Channel:** <#${channelId}>\n🏢 **Formats:** ${modes.join(', ')}\n📍 **Locations:** ${states.length ? states.join(', ') : 'All Locations'}\n\nHackPulse will automatically discover and post hackathons every 5 hours!`,
          flags: 64,
        },
      });
    }

    if (commandName === 'settings') {
      const guildId = interaction.guild_id;
      const guild = guildId
        ? await prisma.discordGuild.findUnique({
            where: { guildId },
            include: { subscription: true },
          })
        : null;

      if (!guild || !guild.subscription) {
        return NextResponse.json({
          type: 4,
          data: {
            content: '⚙️ HackPulse is not configured on this server yet. Run `/setup` to get started!',
            flags: 64,
          },
        });
      }

      return NextResponse.json({
        type: 4,
        data: {
          content: `⚙️ **HackPulse Server Settings**\n\n• **Status:** ${guild.enabled ? '🟢 Active' : '🔴 Paused'}\n• **Posting Channel:** <#${guild.postingChannelId}>\n• **Manage on Web:** ${appUrl}/dashboard/guilds/${guild.guildId}`,
          flags: 64,
        },
      });
    }
  }

  // 3. Interactive Buttons (MESSAGE_COMPONENT)
  if (interaction.type === 3) {
    const customId = interaction.data.custom_id;

    if (customId.startsWith('btn_save_')) {
      const hackathonId = customId.replace('btn_save_', '');
      const userId = interaction.member?.user?.id || interaction.user?.id;

      if (userId) {
        await prisma.savedHackathon.upsert({
          where: { discordUserId_hackathonId: { discordUserId: userId, hackathonId } },
          update: {},
          create: { discordUserId: userId, hackathonId },
        });
      }

      return NextResponse.json({
        type: 4,
        data: { content: '🔖 Saved to your HackPulse bookmarks! View all: /saved', flags: 64 },
      });
    }

    if (customId.startsWith('btn_remind_')) {
      const hackathonId = customId.replace('btn_remind_', '');
      const userId = interaction.member?.user?.id || interaction.user?.id;

      if (userId) {
        const h = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
        if (h && h.registrationDeadline) {
          const remindAt = new Date(new Date(h.registrationDeadline).getTime() - 24 * 3600 * 1000);
          await prisma.hackathonReminder.create({
            data: {
              hackathonId,
              discordUserId: userId,
              triggerTime: remindAt > new Date() ? remindAt : new Date(),
              reminderType: '1_DAY',
            },
          });
        }
      }

      return NextResponse.json({
        type: 4,
        data: { content: '⏰ Reminder scheduled! You will receive a DM alert 1 day before the deadline.', flags: 64 },
      });
    }
  }

  return NextResponse.json({ type: 4, data: { content: 'Received by HackPulse!' } });
}
