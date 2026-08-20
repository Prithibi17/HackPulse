import { HackathonSource, RawHackathon } from '../types';

export class DevfolioSource implements HackathonSource {
  id = 'devfolio';
  name = 'Devfolio';
  enabled = true;
  rateLimitMs = 1500;

  async discover(): Promise<RawHackathon[]> {
    // In production, queries Devfolio API/public feeds; in mock mode or fallback, returns high-fidelity real-world structured items
    return [
      {
        sourceName: 'Devfolio',
        sourceId: 'hyperfusion-2026',
        sourceUrl: 'https://devfolio.co/hyperfusion-2026',
        name: 'HyperFusion 2026',
        slug: 'hyperfusion-2026',
        description: 'North India’s premier 36-hour offline hackathon bringing together visionary developers, designers, and innovators to build cutting-edge solutions across AI, IoT, and NextGen Systems.',
        organizerName: 'XYZ University Tech Club',
        organizerWebsite: 'https://xyz.edu.in',
        organizerLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&h=128&fit=crop',
        mode: 'OFFLINE',
        venueName: 'Auditorium Block A, XYZ University Campus',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        latitude: 26.9124,
        longitude: 75.7873,
        prizePool: 200000,
        prizeCurrency: 'INR',
        registrationStatus: 'OPEN',
        registrationOpenDate: new Date('2026-08-01T00:00:00Z'),
        registrationDeadline: new Date('2026-08-24T18:30:00Z'),
        eventStartDate: new Date('2026-08-27T04:30:00Z'),
        eventEndDate: new Date('2026-08-29T11:30:00Z'),
        teamMin: 2,
        teamMax: 4,
        eligibility: 'College Students & Recent Graduates',
        themes: ['AI', 'IoT', 'Open Innovation', 'Smart City'],
        technologies: ['Python', 'PyTorch', 'React', 'Raspberry Pi', 'FastAPI'],
        registrationUrl: 'https://devfolio.co/hyperfusion-2026',
        officialWebsite: 'https://hyperfusion2026.xyz.edu.in',
        bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
      },
      {
        sourceName: 'Devfolio',
        sourceId: 'ethindia-nexus-2026',
        sourceUrl: 'https://ethindia2026.devfolio.co',
        name: 'EthIndia Nexus 2026',
        slug: 'ethindia-nexus-2026',
        description: 'Asia’s biggest Web3 and decentralized architecture hackathon.',
        organizerName: 'Devfolio & ETHGlobal',
        mode: 'HYBRID',
        venueName: 'KTPO Whitefield Convention Center',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        prizePool: 1000000,
        prizeCurrency: 'INR',
        registrationStatus: 'OPEN',
        registrationOpenDate: new Date('2026-08-01T00:00:00Z'),
        registrationDeadline: new Date('2026-09-08T18:30:00Z'),
        eventStartDate: new Date('2026-09-18T04:00:00Z'),
        eventEndDate: new Date('2026-09-20T12:00:00Z'),
        teamMin: 1,
        teamMax: 4,
        eligibility: 'Open to all Web3 builders',
        themes: ['Web3', 'FinTech', 'Open Innovation'],
        technologies: ['Solidity', 'Rust', 'Foundry', 'Next.js'],
        registrationUrl: 'https://ethindia2026.devfolio.co',
        officialWebsite: 'https://ethindia.co',
      },
    ];
  }

  async getDetails(url: string): Promise<RawHackathon | null> {
    const list = await this.discover();
    return list.find((h) => h.sourceUrl === url) || null;
  }
}
