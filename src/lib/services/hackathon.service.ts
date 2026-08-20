import prisma from '@/lib/prisma';
import { FilterOptions, HackathonData } from '@/types';

export async function getHackathons(filters: FilterOptions = {}) {
  const where: any = {};

  if (filters.keyword) {
    const kw = filters.keyword.trim();
    where.OR = [
      { name: { contains: kw } },
      { description: { contains: kw } },
      { organizerName: { contains: kw } },
      { city: { contains: kw } },
      { state: { contains: kw } },
      { themes: { contains: kw } },
    ];
  }

  if (filters.mode && filters.mode !== 'ALL') {
    where.mode = filters.mode;
  }

  if (filters.city) {
    where.city = { contains: filters.city };
  }

  if (filters.state) {
    where.state = { contains: filters.state };
  }

  if (filters.country) {
    where.country = { contains: filters.country };
  }

  if (filters.status) {
    where.registrationStatus = filters.status;
  }

  if (typeof filters.minPrize === 'number') {
    where.prizePool = { ...(where.prizePool || {}), gte: filters.minPrize };
  }

  if (typeof filters.maxPrize === 'number') {
    where.prizePool = { ...(where.prizePool || {}), lte: filters.maxPrize };
  }

  if (filters.studentOnly) {
    where.eligibility = { contains: 'Student' };
  }

  let orderBy: any = { registrationDeadline: 'asc' };
  if (filters.sortBy === 'startDate') {
    orderBy = { eventStartDate: 'asc' };
  } else if (filters.sortBy === 'prize') {
    orderBy = { prizePool: 'desc' };
  } else if (filters.sortBy === 'recentlyAdded') {
    orderBy = { createdAt: 'desc' };
  }

  const items = await prisma.hackathon.findMany({
    where,
    orderBy,
    include: {
      sources: true,
      changes: {
        orderBy: { detectedAt: 'desc' },
      },
    },
  });

  // Parse JSON fields
  return items.map(formatHackathonRecord);
}

export async function getHackathonBySlug(slug: string): Promise<HackathonData | null> {
  const item = await prisma.hackathon.findUnique({
    where: { slug },
    include: {
      sources: {
        orderBy: { discoveredAt: 'desc' },
      },
      changes: {
        orderBy: { detectedAt: 'desc' },
      },
    },
  });

  if (!item) return null;
  return formatHackathonRecord(item);
}

export async function getSimilarHackathons(hackathon: HackathonData, limit = 3): Promise<HackathonData[]> {
  const firstTheme = hackathon.themes[0];

  const items = await prisma.hackathon.findMany({
    where: {
      id: { not: hackathon.id },
      OR: [
        { mode: hackathon.mode },
        { state: hackathon.state || undefined },
        firstTheme ? { themes: { contains: firstTheme } } : {},
      ],
    },
    take: limit,
    orderBy: { registrationDeadline: 'asc' },
    include: { sources: true },
  });

  return items.map(formatHackathonRecord);
}

export async function getHackathonStats() {
  const total = await prisma.hackathon.count();
  const open = await prisma.hackathon.count({ where: { registrationStatus: 'OPEN' } });
  const closingSoon = await prisma.hackathon.count({ where: { registrationStatus: 'CLOSING_SOON' } });
  const offline = await prisma.hackathon.count({ where: { mode: 'OFFLINE' } });
  const online = await prisma.hackathon.count({ where: { mode: 'ONLINE' } });
  const guilds = await prisma.discordGuild.count({ where: { enabled: true } });
  const crawlerRuns = await prisma.crawlerRun.count();

  return {
    total,
    open,
    closingSoon,
    offline,
    online,
    guilds,
    crawlerRuns,
  };
}

export function formatHackathonRecord(item: any): HackathonData {
  let themes: string[] = [];
  try {
    themes = typeof item.themes === 'string' ? JSON.parse(item.themes) : item.themes || [];
  } catch {}

  let technologies: string[] = [];
  try {
    technologies = typeof item.technologies === 'string' ? JSON.parse(item.technologies) : item.technologies || [];
  } catch {}

  return {
    ...item,
    themes,
    technologies,
    registrationOpenDate: item.registrationOpenDate?.toISOString() || null,
    registrationDeadline: item.registrationDeadline?.toISOString() || null,
    eventStartDate: item.eventStartDate?.toISOString() || null,
    eventEndDate: item.eventEndDate?.toISOString() || null,
    firstSeenAt: item.firstSeenAt?.toISOString() || new Date().toISOString(),
    lastSeenAt: item.lastSeenAt?.toISOString() || new Date().toISOString(),
    lastCheckedAt: item.lastCheckedAt?.toISOString() || new Date().toISOString(),
  };
}
