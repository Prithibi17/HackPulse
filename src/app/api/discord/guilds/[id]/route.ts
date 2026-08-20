import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: guildId } = await params;
    const guild = await prisma.discordGuild.findUnique({
      where: { guildId },
      include: {
        subscription: true,
      },
    });

    if (!guild) {
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 });
    }

    return NextResponse.json(guild);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: guildId } = await params;
    const body = await req.json();

    const { postingChannelId, enabled, timezone, subscription } = body;

    const updatedGuild = await prisma.discordGuild.upsert({
      where: { guildId },
      update: {
        postingChannelId,
        enabled: enabled ?? true,
        timezone: timezone || 'Asia/Kolkata',
      },
      create: {
        guildId,
        guildName: 'Discord Community',
        postingChannelId,
        enabled: enabled ?? true,
        timezone: timezone || 'Asia/Kolkata',
      },
    });

    if (subscription) {
      await prisma.guildSubscription.upsert({
        where: { guildId },
        update: {
          ...subscription,
        },
        create: {
          guildId,
          ...subscription,
        },
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        action: 'GUILD_CONFIG_UPDATE',
        entityType: 'DiscordGuild',
        entityId: guildId,
        details: JSON.stringify(body),
        performedBy: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, guild: updatedGuild });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
