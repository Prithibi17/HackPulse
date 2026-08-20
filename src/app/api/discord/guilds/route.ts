import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const guilds = await prisma.discordGuild.findMany({
      include: {
        subscription: true,
      },
    });
    return NextResponse.json({ guilds });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
