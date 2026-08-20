import { HackathonSource, RawHackathon } from '../types';

export class MLHSource implements HackathonSource {
  id = 'mlh';
  name = 'Major League Hacking';
  enabled = true;
  rateLimitMs = 1500;

  async discover(): Promise<RawHackathon[]> {
    return [
      {
        sourceName: 'MLH',
        sourceId: 'agentic-ai-2026',
        sourceUrl: 'https://mlh.io/seasons/2026/events/agentic-ai',
        name: 'Global Agentic AI Hackathon 2026',
        slug: 'global-agentic-ai-hackathon-2026',
        description: '48-hour global online hackathon to build autonomous multi-agent systems, tool-calling agents, and real-world developer tooling.',
        organizerName: 'Major League Hacking (MLH)',
        organizerWebsite: 'https://mlh.io',
        mode: 'ONLINE',
        city: 'Global',
        country: 'Global',
        prizePool: 1200000,
        prizeCurrency: 'INR',
        registrationStatus: 'OPEN',
        registrationOpenDate: new Date('2026-08-10T00:00:00Z'),
        registrationDeadline: new Date('2026-09-12T18:30:00Z'),
        eventStartDate: new Date('2026-09-15T00:00:00Z'),
        eventEndDate: new Date('2026-09-17T23:59:00Z'),
        teamMin: 1,
        teamMax: 4,
        eligibility: 'Open to everyone worldwide',
        themes: ['AI', 'Open Innovation', 'HealthTech', 'Developer Tools'],
        technologies: ['TypeScript', 'Python', 'Gemini API', 'Claude API', 'OpenAI'],
        registrationUrl: 'https://mlh.io/seasons/2026/events/agentic-ai',
        officialWebsite: 'https://agenticaihack.dev',
      },
    ];
  }

  async getDetails(url: string): Promise<RawHackathon | null> {
    const list = await this.discover();
    return list.find((h) => h.sourceUrl === url) || null;
  }
}
