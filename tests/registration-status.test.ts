import { describe, it, expect } from 'vitest';
import { computeRegistrationStatus } from '../src/lib/crawler/normalizer';

describe('Registration Status Calculation Logic', () => {
  it('returns UPCOMING when openDate is in the future', () => {
    const futureOpen = new Date(Date.now() + 5 * 24 * 3600 * 1000);
    const futureDeadline = new Date(Date.now() + 20 * 24 * 3600 * 1000);

    expect(computeRegistrationStatus(futureOpen, futureDeadline)).toBe('UPCOMING');
  });

  it('returns OPEN when openDate is in past and deadline is > 72h away', () => {
    const pastOpen = new Date(Date.now() - 5 * 24 * 3600 * 1000);
    const futureDeadline = new Date(Date.now() + 10 * 24 * 3600 * 1000);

    expect(computeRegistrationStatus(pastOpen, futureDeadline)).toBe('OPEN');
  });

  it('returns CLOSING_SOON when deadline is within 72 hours', () => {
    const pastOpen = new Date(Date.now() - 5 * 24 * 3600 * 1000);
    const deadlineIn30Hours = new Date(Date.now() + 30 * 3600 * 1000);

    expect(computeRegistrationStatus(pastOpen, deadlineIn30Hours)).toBe('CLOSING_SOON');
  });

  it('returns CLOSED when deadline has passed', () => {
    const pastOpen = new Date(Date.now() - 10 * 24 * 3600 * 1000);
    const pastDeadline = new Date(Date.now() - 1 * 24 * 3600 * 1000);

    expect(computeRegistrationStatus(pastOpen, pastDeadline)).toBe('CLOSED');
  });

  it('returns POSTPONED when isPostponed is true', () => {
    const pastOpen = new Date(Date.now() - 5 * 24 * 3600 * 1000);
    const futureDeadline = new Date(Date.now() + 10 * 24 * 3600 * 1000);

    expect(computeRegistrationStatus(pastOpen, futureDeadline, true)).toBe('POSTPONED');
  });
});
