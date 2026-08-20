import { describe, it, expect } from 'vitest';
import { detectHackathonChanges } from '../src/lib/crawler/change-detector';
import { normalizeRawHackathon } from '../src/lib/crawler/normalizer';

describe('Change Detector Engine', () => {
  const existingBase = {
    name: 'HackX 2026',
    registrationStatus: 'OPEN',
    registrationDeadline: new Date('2026-08-20T18:30:00Z'),
    eventStartDate: new Date('2026-08-24T04:00:00Z'),
    eventEndDate: new Date('2026-08-26T12:00:00Z'),
    prizePool: 100000,
    venueName: 'Auditorium A',
    city: 'Jaipur',
    teamMin: 2,
    teamMax: 4,
    isPostponed: false,
    isCancelled: false,
  };

  it('detects deadline extension', () => {
    const rawUpdated = {
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hackx-2026',
      name: 'HackX 2026',
      description: 'Hackathon description',
      organizerName: 'Council',
      mode: 'OFFLINE' as const,
      registrationDeadline: new Date('2026-08-30T18:30:00Z'), // Extended
      registrationUrl: 'https://devfolio.co/hackx-2026',
    };
    const incoming = normalizeRawHackathon(rawUpdated);

    const changes = detectHackathonChanges(existingBase, incoming);
    expect(changes.length).toBeGreaterThan(0);
    const deadlineChange = changes.find((c) => c.field === 'registrationDeadline');
    expect(deadlineChange).toBeDefined();
    expect(deadlineChange?.isMeaningful).toBe(true);
    expect(deadlineChange?.alertType).toBe('DEADLINE_CHANGED');
  });

  it('detects postponement and marks alertType as POSTPONED', () => {
    const rawPostponed = {
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hackx-2026',
      name: 'HackX 2026',
      description: 'Hackathon description',
      organizerName: 'Council',
      mode: 'OFFLINE' as const,
      eventStartDate: new Date('2026-09-10T04:00:00Z'), // Rescheduled
      registrationUrl: 'https://devfolio.co/hackx-2026',
    };
    const incoming = normalizeRawHackathon(rawPostponed);
    incoming.isPostponed = true;

    const changes = detectHackathonChanges(existingBase, incoming);
    const postponeChange = changes.find((c) => c.alertType === 'POSTPONED');
    expect(postponeChange).toBeDefined();
    expect(postponeChange?.isMeaningful).toBe(true);
  });

  it('detects prize pool increase', () => {
    const rawPrizeUpdate = {
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hackx-2026',
      name: 'HackX 2026',
      description: 'Hackathon description',
      organizerName: 'Council',
      mode: 'OFFLINE' as const,
      prizePool: 250000, // Increased
      registrationUrl: 'https://devfolio.co/hackx-2026',
    };
    const incoming = normalizeRawHackathon(rawPrizeUpdate);

    const changes = detectHackathonChanges(existingBase, incoming);
    const prizeChange = changes.find((c) => c.field === 'prizePool');
    expect(prizeChange).toBeDefined();
    expect(prizeChange?.alertType).toBe('PRIZE_UPDATED');
  });
});
