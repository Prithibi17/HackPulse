import { NextRequest, NextResponse } from 'next/server';
import { crawlerEngine } from '@/lib/crawler/engine';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const runs = await prisma.crawlerRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: { sourceRuns: true },
    });

    const changes = await prisma.hackathonChange.findMany({
      orderBy: { detectedAt: 'desc' },
      take: 15,
      include: { hackathon: true },
    });

    return NextResponse.json({ runs, changes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const report = await crawlerEngine.runScan();
    return NextResponse.json(report);
  } catch (err: any) {
    console.error('Crawler API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
