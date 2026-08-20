import { NormalizedHackathon } from './types';

export function cleanNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b20\d\d\b/g, '')     // remove full year 2024, 2025, 2026, etc.
    .replace(/['"’`]?\d{2}\b/g, '') // remove '26, 26, '25, etc.
    .replace(/['"’`]/g, '')
    .replace(/hackathon/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function extractDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function calculateSimilarityScore(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1.0;

  const distance = calculateLevenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

export interface DuplicateMatchResult {
  isDuplicate: boolean;
  score: number;
  reason?: string;
}

export function checkDuplicate(
  incoming: NormalizedHackathon,
  existing: {
    id: string;
    name: string;
    slug: string;
    organizerName: string;
    officialWebsite?: string | null;
    registrationUrl?: string | null;
    city?: string | null;
    eventStartDate?: Date | null;
  }
): DuplicateMatchResult {
  // 1. Exact slug match or registration URL match
  if (incoming.slug === existing.slug) {
    return { isDuplicate: true, score: 1.0, reason: 'Exact slug match' };
  }

  if (
    incoming.registrationUrl &&
    existing.registrationUrl &&
    incoming.registrationUrl === existing.registrationUrl
  ) {
    return { isDuplicate: true, score: 1.0, reason: 'Exact registration URL match' };
  }

  // 2. Official website domain match (excluding aggregator domains)
  const incomingDomain = extractDomain(incoming.officialWebsite);
  const existingDomain = extractDomain(existing.officialWebsite);
  const aggregatorDomains = ['devfolio.co', 'unstop.com', 'devpost.com', 'mlh.io', 'github.com', 'google.com'];

  if (
    incomingDomain &&
    existingDomain &&
    incomingDomain === existingDomain &&
    !aggregatorDomains.includes(incomingDomain)
  ) {
    return { isDuplicate: true, score: 0.95, reason: `Matching official domain (${incomingDomain})` };
  }

  // 3. Name comparison
  const cleanIncomingName = cleanNameForComparison(incoming.name);
  const cleanExistingName = cleanNameForComparison(existing.name);

  if (cleanIncomingName.length >= 3 && cleanExistingName.length >= 3) {
    const nameSimilarity = calculateSimilarityScore(cleanIncomingName, cleanExistingName);

    // High name similarity threshold
    if (nameSimilarity >= 0.85) {
      // Check date proximity if available
      if (incoming.eventStartDate && existing.eventStartDate) {
        const timeDiffDays =
          Math.abs(incoming.eventStartDate.getTime() - existing.eventStartDate.getTime()) /
          (1000 * 60 * 60 * 24);
        if (timeDiffDays <= 7) {
          return {
            isDuplicate: true,
            score: 0.95,
            reason: `Matching normalized title and start date proximity (${timeDiffDays.toFixed(1)} days)`,
          };
        }
      }

      // Check city match
      const incomingCity = (incoming.city || '').toLowerCase().trim();
      const existingCity = (existing.city || '').toLowerCase().trim();
      if (incomingCity && existingCity && incomingCity === existingCity) {
        return {
          isDuplicate: true,
          score: 0.92,
          reason: `Matching title and city (${incoming.city})`,
        };
      }

      // Check organizer match
      const organizerSimilarity = calculateSimilarityScore(
        cleanNameForComparison(incoming.organizerName),
        cleanNameForComparison(existing.organizerName)
      );
      if (organizerSimilarity >= 0.5) {
        return {
          isDuplicate: true,
          score: 0.9,
          reason: `Matching title and organizer similarity`,
        };
      }

      // If exact title match
      if (cleanIncomingName === cleanExistingName) {
        return {
          isDuplicate: true,
          score: 0.9,
          reason: `Matching normalized title (${cleanIncomingName})`,
        };
      }
    }
  }

  return { isDuplicate: false, score: 0 };
}
