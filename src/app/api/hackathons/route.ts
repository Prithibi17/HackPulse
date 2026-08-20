import { NextRequest, NextResponse } from 'next/server';
import { getHackathons } from '@/lib/services/hackathon.service';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const keyword = searchParams.get('keyword') || undefined;
    const mode = (searchParams.get('mode') as any) || undefined;
    const state = searchParams.get('state') || undefined;
    const city = searchParams.get('city') || undefined;
    const status = searchParams.get('status') || undefined;
    const minPrize = searchParams.get('minPrize') ? Number(searchParams.get('minPrize')) : undefined;
    const maxPrize = searchParams.get('maxPrize') ? Number(searchParams.get('maxPrize')) : undefined;
    const studentOnly = searchParams.get('studentOnly') === 'true';
    const sortBy = (searchParams.get('sortBy') as any) || undefined;
    const themesParam = searchParams.get('themes');
    const themes = themesParam ? themesParam.split(',').map((t) => t.trim()) : undefined;

    const items = await getHackathons({
      keyword,
      mode,
      state,
      city,
      status,
      minPrize,
      maxPrize,
      studentOnly,
      sortBy,
      themes,
    });

    return NextResponse.json({ items, count: items.length });
  } catch (err: any) {
    console.error('API /api/hackathons error:', err);
    return NextResponse.json({ error: 'Failed to fetch hackathons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, organizerName, mode, city, state, prizePool, registrationUrl } = body;

    if (!name || !description || !organizerName || !registrationUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.hackathon.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        organizerName,
        mode: mode || 'OFFLINE',
        city,
        state,
        prizePool: prizePool ? Number(prizePool) : null,
        registrationUrl,
        verified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('API POST /api/hackathons error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create hackathon' }, { status: 500 });
  }
}
