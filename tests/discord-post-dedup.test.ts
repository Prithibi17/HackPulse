import { describe, it, expect } from 'vitest';

describe('Discord Post Deduplication Logic', () => {
  it('prevents posting duplicate hackathon to the same guild when already tracked', () => {
    // Simulated database post tracking table
    const discordPostsTable: { guildId: string; hackathonId: string; postType: string }[] = [
      {
        guildId: '100100100100100101',
        hackathonId: 'hackathon-hyperfusion-2026',
        postType: 'NEW_EVENT',
      },
    ];

    const isAlreadyPosted = (guildId: string, hackathonId: string, postType: string) => {
      return discordPostsTable.some(
        (p) => p.guildId === guildId && p.hackathonId === hackathonId && p.postType === postType
      );
    };

    // 1. Same event to same guild should be recognized as already posted
    expect(isAlreadyPosted('100100100100100101', 'hackathon-hyperfusion-2026', 'NEW_EVENT')).toBe(true);

    // 2. Different guild should be allowed to receive post
    expect(isAlreadyPosted('100200300400500600', 'hackathon-hyperfusion-2026', 'NEW_EVENT')).toBe(false);

    // 3. Different post type (e.g. POSTPONED) should be allowed
    expect(isAlreadyPosted('100100100100100101', 'hackathon-hyperfusion-2026', 'POSTPONED')).toBe(false);
  });
});
