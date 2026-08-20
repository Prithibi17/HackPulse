import { HackathonSource, RawHackathon } from '../types';

export class DevpostSource implements HackathonSource {
  id = 'devpost';
  name = 'Devpost';
  enabled = true;
  rateLimitMs = 2000;

  async discover(): Promise<RawHackathon[]> {
    return [
      {
        sourceName: 'Devpost',
        sourceId: 'bangalore-buildathon-2026',
        sourceUrl: 'https://devpost.com/hackathons/bangalore-buildathon-2026',
        name: 'Bangalore Buildathon 2026',
        slug: 'bangalore-buildathon-2026',
        description: 'Silicon Valley of India hackathon building high-throughput FinTech and Agentic AI workflows with top VC mentors and hiring partners.',
        organizerName: 'Bengaluru Tech Collective',
        organizerWebsite: 'https://blrtechcollective.dev',
        mode: 'OFFLINE',
        venueName: 'Koramangala Indoor Stadium & Convention Center',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        prizePool: 500000,
        prizeCurrency: 'INR',
        registrationStatus: 'UPCOMING',
        registrationOpenDate: new Date('2026-09-01T00:00:00Z'),
        registrationDeadline: new Date('2026-09-20T18:30:00Z'),
        eventStartDate: new Date('2026-09-26T03:30:00Z'),
        eventEndDate: new Date('2026-09-28T12:30:00Z'),
        teamMin: 2,
        teamMax: 5,
        eligibility: 'Open to All (Students & Professionals)',
        themes: ['FinTech', 'AI', 'Open Innovation', 'Web3'],
        technologies: ['Next.js', 'PostgreSQL', 'LangChain', 'Docker'],
        registrationUrl: 'https://devpost.com/hackathons/bangalore-buildathon-2026',
        officialWebsite: 'https://bangalorebuildathon.com',
      },
    ];
  }

  async getDetails(url: string): Promise<RawHackathon | null> {
    const list = await this.discover();
    return list.find((h) => h.sourceUrl === url) || null;
  }
}
