import { describe, it, expect } from 'vitest';
import { interpretNaturalSearchQuery } from '../src/lib/services/nlp-search.service';

describe('Natural Search Query Parser', () => {
  it('extracts offline format, Jaipur city, and AI track accurately', async () => {
    const result = await interpretNaturalSearchQuery(
      'offline AI hackathons near Jaipur with registration open and prize of 2 lakh'
    );

    expect(result.interpretedFilters.mode).toBe('OFFLINE');
    expect(result.interpretedFilters.city).toBe('Jaipur');
    expect(result.interpretedFilters.themes).toContain('AI');
    expect(result.interpretedFilters.status).toBe('OPEN');
    expect(result.interpretedFilters.minPrize).toBe(200000);
    expect(result.explanation).toContain('Filters applied');
  });

  it('extracts online virtual format and Web3/FinTech tracks', async () => {
    const result = await interpretNaturalSearchQuery(
      'virtual online blockchain web3 and fintech hackathons with 50k prize'
    );

    expect(result.interpretedFilters.mode).toBe('ONLINE');
    expect(result.interpretedFilters.themes).toContain('Web3');
    expect(result.interpretedFilters.themes).toContain('FinTech');
    expect(result.interpretedFilters.minPrize).toBe(50000);
  });
});
