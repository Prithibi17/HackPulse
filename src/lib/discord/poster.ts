import prisma from '@/lib/prisma';
import {
  createHackathonEmbed,
  createPostponedEmbed,
  createRegistrationOpenEmbed,
  createUpdateEmbed,
  createClosingSoonEmbed,
} from './embeds';
import { DetectedFieldChange } from '../crawler/change-detector';
import { getDiscordClient } from './client';

export function matchGuildSubscription(
  sub: {
    modes: string;
    countries: string;
    states: string;
    cities: string;
    themes: string;
    minPrize: number;
    studentsOnly: boolean;
    newHackathons: boolean;
  },
  hackathon: any
): boolean {
  try {
    // 1. Mode check
    const modes: string[] = JSON.parse(sub.modes || '[]');
    if (modes.length > 0 && !modes.includes(hackathon.mode)) {
      return false;
    }

    // 2. Location check for offline/hybrid
    if (hackathon.mode !== 'ONLINE') {
      const countries: string[] = JSON.parse(sub.countries || '[]');
      if (countries.length > 0 && hackathon.country && !countries.includes(hackathon.country)) {
        return false;
      }

      const states: string[] = JSON.parse(sub.states || '[]');
      if (states.length > 0 && hackathon.state && !states.includes(hackathon.state)) {
        return false;
      }

      const cities: string[] = JSON.parse(sub.cities || '[]');
      if (cities.length > 0 && hackathon.city && !cities.includes(hackathon.city)) {
        return false;
      }
    }

    // 3. Minimum Prize check
    if (sub.minPrize > 0) {
      if (typeof hackathon.prizePool !== 'number' || hackathon.prizePool < sub.minPrize) {
        return false;
      }
    }

    // 4. Themes check
    const subThemes: string[] = JSON.parse(sub.themes || '[]');
    if (subThemes.length > 0) {
      const eventThemes: string[] =
        typeof hackathon.themes === 'string' ? JSON.parse(hackathon.themes || '[]') : hackathon.themes || [];
      const hasMatch = eventThemes.some((t) =>
        subThemes.some((st) => st.toLowerCase() === t.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    return true;
  } catch (err) {
    console.error('[Poster] Subscription matching error:', err);
    return false;
  }
}

// REST helper to send Discord messages across serverless Vercel / Gateway
async function sendDiscordChannelMessage(
  channelId: string,
  content: string | undefined,
  embedPayload: any
): Promise<string> {
  const client = getDiscordClient();
  const token = process.env.DISCORD_BOT_TOKEN;

  // 1. If active WebSocket gateway client is available
  if (client && client.isReady()) {
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      const sent = await (channel as any).send({
        content,
        embeds: embedPayload.embeds,
        components: embedPayload.components,
      });
      return sent.id;
    }
  }

  // 2. Direct HTTP REST API (for Vercel Serverless / Cron execution)
  if (token && !token.startsWith('mock_')) {
    const jsonEmbeds = embedPayload.embeds.map((e: any) => (typeof e.toJSON === 'function' ? e.toJSON() : e));
    const jsonComponents = embedPayload.components.map((c: any) => (typeof c.toJSON === 'function' ? c.toJSON() : c));

    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds: jsonEmbeds,
        components: jsonComponents,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.id;
    } else {
      const errText = await res.text();
      throw new Error(`Discord REST API ${res.status}: ${errText}`);
    }
  }

  // Simulated / Mock for local development
  return `mock_msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export async function dispatchDiscordAlertsForNewHackathon(hackathon: any) {
  const guilds = await prisma.discordGuild.findMany({
    where: {
      enabled: true,
      postingChannelId: { not: null },
    },
    include: {
      subscription: true,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  for (const guild of guilds) {
    if (!guild.subscription || !guild.subscription.newHackathons || !guild.postingChannelId) {
      continue;
    }

    // Check subscription match
    const isMatch = matchGuildSubscription(guild.subscription, hackathon);
    if (!isMatch) continue;

    // Check deduplication: Has this hackathon already been posted to this guild?
    const existingPost = await prisma.discordPost.findFirst({
      where: {
        guildId: guild.guildId,
        hackathonId: hackathon.id,
        postType: 'NEW_EVENT',
      },
    });

    if (existingPost) {
      console.log(`[Poster] Skipping duplicate post for guild ${guild.guildName} (${guild.guildId})`);
      continue;
    }

    // Prepare message payload
    const embedPayload = createHackathonEmbed(hackathon, appUrl);
    const content = guild.subscription.pingRoleId
      ? `<@&${guild.subscription.pingRoleId}>`
      : undefined;

    try {
      const messageId = await sendDiscordChannelMessage(
        guild.postingChannelId,
        content,
        embedPayload
      );

      console.log(
        `[Poster] Dispatched new hackathon post "${hackathon.name}" to guild ${guild.guildName} #${guild.postingChannelId}`
      );

      // Record in DiscordPost table to ensure deduplication across restarts
      await prisma.discordPost.create({
        data: {
          guildId: guild.guildId,
          channelId: guild.postingChannelId,
          messageId,
          hackathonId: hackathon.id,
          postType: 'NEW_EVENT',
        },
      });
    } catch (err: any) {
      console.error(
        `[Poster] Failed to dispatch Discord post to guild ${guild.guildName}:`,
        err?.message || err
      );
    }
  }
}

export async function dispatchDiscordAlertsForChanges(
  hackathon: any,
  changes: DetectedFieldChange[]
) {
  const meaningfulChanges = changes.filter((c) => c.isMeaningful);
  if (meaningfulChanges.length === 0) return;

  const guilds = await prisma.discordGuild.findMany({
    where: {
      enabled: true,
      postingChannelId: { not: null },
    },
    include: {
      subscription: true,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  for (const guild of guilds) {
    if (!guild.subscription || !guild.subscription.changeAlerts || !guild.postingChannelId) {
      continue;
    }

    const isMatch = matchGuildSubscription(guild.subscription, hackathon);
    if (!isMatch) continue;

    // Check if postponed or general update
    const isPostponed = meaningfulChanges.some((c) => c.alertType === 'POSTPONED');
    const isRegOpened = meaningfulChanges.some((c) => c.alertType === 'REGISTRATION_OPENED');

    let payload: any;
    let postType = 'UPDATE';

    if (isPostponed) {
      postType = 'POSTPONED';
      const startDateChange = meaningfulChanges.find((c) => c.field === 'eventStartDate');
      payload = createPostponedEmbed(
        hackathon,
        startDateChange?.previousValue || 'Previously Announced',
        startDateChange?.newValue || 'Rescheduled Date',
        appUrl
      );
    } else if (isRegOpened) {
      postType = 'REGISTRATION_OPEN';
      payload = createRegistrationOpenEmbed(hackathon, appUrl);
    } else {
      payload = createUpdateEmbed(hackathon, meaningfulChanges, appUrl);
    }

    try {
      const messageId = await sendDiscordChannelMessage(
        guild.postingChannelId,
        guild.subscription.pingRoleId ? `<@&${guild.subscription.pingRoleId}>` : undefined,
        payload
      );

      console.log(
        `[Poster] Dispatched ${postType} alert for "${hackathon.name}" to guild ${guild.guildName}`
      );

      await prisma.discordPost.create({
        data: {
          guildId: guild.guildId,
          channelId: guild.postingChannelId,
          messageId,
          hackathonId: hackathon.id,
          postType,
        },
      });
    } catch (err: any) {
      console.error(`[Poster] Error dispatching update alert:`, err?.message || err);
    }
  }
}
