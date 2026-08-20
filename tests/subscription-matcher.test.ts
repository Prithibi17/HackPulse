import { describe, it, expect } from 'vitest';
import { matchGuildSubscription } from '../src/lib/discord/poster';

describe('Discord Subscription Matcher', () => {
  const offlineJaipurAIHackathon = {
    name: 'HyperFusion 2026',
    mode: 'OFFLINE',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    prizePool: 200000,
    themes: JSON.stringify(['AI', 'IoT', 'Open Innovation']),
  };

  it('matches server with offline Rajasthan AI subscription', () => {
    const subscription = {
      modes: JSON.stringify(['OFFLINE', 'HYBRID']),
      countries: JSON.stringify(['India']),
      states: JSON.stringify(['Rajasthan']),
      cities: JSON.stringify([]),
      themes: JSON.stringify(['AI']),
      minPrize: 50000,
      studentsOnly: false,
      newHackathons: true,
    };

    expect(matchGuildSubscription(subscription, offlineJaipurAIHackathon)).toBe(true);
  });

  it('rejects event when mode does not match server preference', () => {
    const onlineOnlySubscription = {
      modes: JSON.stringify(['ONLINE']),
      countries: JSON.stringify([]),
      states: JSON.stringify([]),
      cities: JSON.stringify([]),
      themes: JSON.stringify([]),
      minPrize: 0,
      studentsOnly: false,
      newHackathons: true,
    };

    expect(matchGuildSubscription(onlineOnlySubscription, offlineJaipurAIHackathon)).toBe(false);
  });

  it('rejects event when prize pool is below server threshold', () => {
    const highPrizeSubscription = {
      modes: JSON.stringify(['OFFLINE']),
      countries: JSON.stringify([]),
      states: JSON.stringify([]),
      cities: JSON.stringify([]),
      themes: JSON.stringify([]),
      minPrize: 500000, // Requires 5L, event is 2L
      studentsOnly: false,
      newHackathons: true,
    };

    expect(matchGuildSubscription(highPrizeSubscription, offlineJaipurAIHackathon)).toBe(false);
  });
});
