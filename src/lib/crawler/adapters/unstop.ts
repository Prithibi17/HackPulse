import { HackathonSource, RawHackathon } from '../types';

export class UnstopSource implements HackathonSource {
  id = 'unstop';
  name = 'Unstop';
  enabled = true;
  rateLimitMs = 1500;

  async discover(): Promise<RawHackathon[]> {
    return [
      {
        sourceName: 'Unstop',
        sourceId: 'deserthacks-2026',
        sourceUrl: 'https://unstop.com/hackathons/deserthacks-2026-iit-jodhpur',
        name: 'DesertHacks 2026',
        slug: 'deserthacks-2026',
        description: 'A national-level flagship hardware and software hackathon organized at IIT Jodhpur focusing on autonomous robotics and clean-tech.',
        organizerName: 'IIT Jodhpur Innovation Hub',
        organizerWebsite: 'https://iitj.ac.in',
        mode: 'OFFLINE',
        venueName: 'Centre for Intelligent Systems, IIT Jodhpur Campus',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        prizePool: 150000,
        prizeCurrency: 'INR',
        registrationStatus: 'CLOSING_SOON',
        registrationOpenDate: new Date('2026-08-05T00:00:00Z'),
        registrationDeadline: new Date(Date.now() + 36 * 3600 * 1000),
        eventStartDate: new Date('2026-09-05T03:30:00Z'),
        eventEndDate: new Date('2026-09-07T12:30:00Z'),
        teamMin: 1,
        teamMax: 4,
        eligibility: 'All Engineering & Polytechnic Students',
        themes: ['Robotics', 'Web3', 'CleanTech', 'AI'],
        technologies: ['ROS2', 'Solidity', 'TensorFlow', 'C++'],
        registrationUrl: 'https://unstop.com/hackathons/deserthacks-2026-iit-jodhpur',
        officialWebsite: 'https://deserthacks.org',
        bannerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
      },
      {
        sourceName: 'Unstop',
        sourceId: 'delhi-ai-cyber-nexus-2026',
        sourceUrl: 'https://unstop.com/hackathons/delhi-ai-cyber-nexus-2026',
        name: 'Delhi AI & Cyber Nexus 2026',
        slug: 'delhi-ai-cyber-nexus-2026',
        description: 'Cross-disciplinary hybrid hackathon bringing together defensive security researchers and machine learning practitioners.',
        organizerName: 'Delhi Technical University & CyberPeace',
        mode: 'HYBRID',
        venueName: 'BR Ambedkar Auditorium, DTU Campus',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        prizePool: 300000,
        prizeCurrency: 'INR',
        registrationStatus: 'OPEN',
        registrationOpenDate: new Date('2026-08-01T00:00:00Z'),
        registrationDeadline: new Date('2026-08-30T18:30:00Z'),
        eventStartDate: new Date('2026-09-04T04:00:00Z'),
        eventEndDate: new Date('2026-09-06T12:00:00Z'),
        teamMin: 2,
        teamMax: 4,
        eligibility: 'University Students & Research Scholars',
        themes: ['Cybersecurity', 'AI', 'FinTech'],
        technologies: ['Wireshark', 'Python', 'Suricata'],
        registrationUrl: 'https://unstop.com/hackathons/delhi-ai-cyber-nexus-2026',
        officialWebsite: 'https://cybernexus.dtu.ac.in',
      },
    ];
  }

  async getDetails(url: string): Promise<RawHackathon | null> {
    const list = await this.discover();
    return list.find((h) => h.sourceUrl === url) || null;
  }
}
