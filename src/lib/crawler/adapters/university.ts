import { HackathonSource, RawHackathon } from '../types';

export class UniversitySource implements HackathonSource {
  id = 'university';
  name = 'University & Organizer Feeds';
  enabled = true;
  rateLimitMs = 1000;

  async discover(): Promise<RawHackathon[]> {
    return [
      {
        sourceName: 'University Feeds',
        sourceId: 'udaipur-mobility-2026',
        sourceUrl: 'https://udaipursmartcity.gov.in/hackathon',
        name: 'Udaipur Smart Mobility Sprint',
        slug: 'udaipur-smart-mobility-sprint',
        description: 'A grassroots civic tech hackathon focused on sustainable electric mobility and public transit optimization in heritage cities.',
        organizerName: 'Smart City Udaipur Initiative',
        mode: 'OFFLINE',
        venueName: undefined, // Location not confirmed yet
        city: 'Udaipur',
        state: 'Rajasthan',
        country: 'India',
        prizePool: undefined, // Prize pool not announced yet
        prizeCurrency: 'INR',
        registrationStatus: 'OPEN',
        registrationOpenDate: new Date('2026-08-12T00:00:00Z'),
        registrationDeadline: new Date('2026-09-15T18:30:00Z'),
        eventStartDate: new Date('2026-09-22T04:00:00Z'),
        eventEndDate: new Date('2026-09-23T12:00:00Z'),
        teamMin: 1,
        teamMax: 3,
        eligibility: 'Open to all residents & students in Rajasthan',
        themes: ['IoT', 'Open Innovation', 'Robotics'],
        technologies: ['C++', 'OpenStreetMap', 'Python'],
        registrationUrl: 'https://udaipursmartcity.gov.in/hackathon',
      },
    ];
  }

  async getDetails(url: string): Promise<RawHackathon | null> {
    const list = await this.discover();
    return list.find((h) => h.sourceUrl === url) || null;
  }
}
