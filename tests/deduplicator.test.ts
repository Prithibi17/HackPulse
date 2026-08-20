import { describe, it, expect } from 'vitest';
import {
  checkDuplicate,
  cleanNameForComparison,
  extractDomain,
  calculateSimilarityScore,
} from '../src/lib/crawler/deduplicator';
import { normalizeRawHackathon } from '../src/lib/crawler/normalizer';

describe('Deduplicator Engine', () => {
  it('cleans names accurately for fuzzy comparison', () => {
    expect(cleanNameForComparison("HackX '26")).toBe('hackx');
    expect(cleanNameForComparison('HackX 2026 Hackathon')).toBe('hackx');
    expect(cleanNameForComparison('HyperFusion 2026')).toBe('hyperfusion');
  });

  it('extracts root domain correctly', () => {
    expect(extractDomain('https://xyz.edu.in/events/hackx')).toBe('xyz.edu.in');
    expect(extractDomain('https://www.hyperfusion.org')).toBe('hyperfusion.org');
  });

  it('detects exact slug match as duplicate', () => {
    const raw = {
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hyperfusion-2026',
      name: 'HyperFusion 2026',
      slug: 'hyperfusion-2026',
      description: 'North India hackathon',
      organizerName: 'XYZ University',
      mode: 'OFFLINE' as const,
      registrationUrl: 'https://devfolio.co/hyperfusion-2026',
    };
    const normalized = normalizeRawHackathon(raw);

    const existing = {
      id: 'h-1',
      name: 'HyperFusion 2026',
      slug: 'hyperfusion-2026',
      organizerName: 'XYZ University',
      registrationUrl: 'https://devfolio.co/hyperfusion-2026',
    };

    const match = checkDuplicate(normalized, existing);
    expect(match.isDuplicate).toBe(true);
    expect(match.score).toBe(1.0);
  });

  it('detects duplicate across different aggregators (Unstop vs Devfolio)', () => {
    const raw = {
      sourceName: 'Unstop',
      sourceUrl: 'https://unstop.com/hackathons/hyperfusion-26',
      name: "HyperFusion '26",
      description: 'North India hackathon',
      organizerName: 'XYZ University Tech Club',
      mode: 'OFFLINE' as const,
      city: 'Jaipur',
      registrationUrl: 'https://unstop.com/hackathons/hyperfusion-26',
      eventStartDate: new Date('2026-08-27T04:30:00Z'),
    };
    const normalized = normalizeRawHackathon(raw);

    const existing = {
      id: 'h-1',
      name: 'HyperFusion 2026',
      slug: 'hyperfusion-2026',
      organizerName: 'XYZ University',
      city: 'Jaipur',
      registrationUrl: 'https://devfolio.co/hyperfusion-2026',
      eventStartDate: new Date('2026-08-27T04:30:00Z'),
    };

    const match = checkDuplicate(normalized, existing);
    expect(match.isDuplicate).toBe(true);
    expect(match.score).toBeGreaterThanOrEqual(0.9);
  });
});
