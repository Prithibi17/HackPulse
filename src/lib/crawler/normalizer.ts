import { RawHackathon, NormalizedHackathon } from './types';
import { RegistrationStatus, VerificationStatus } from '@/types';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function computeRegistrationStatus(
  openDate?: Date | null,
  deadline?: Date | null,
  isPostponed: boolean = false,
  manualStatus?: RegistrationStatus
): RegistrationStatus {
  if (isPostponed) return 'POSTPONED';
  if (manualStatus && manualStatus === 'POSTPONED') return 'POSTPONED';

  const now = new Date();

  if (!deadline && !openDate) {
    return manualStatus || 'UNKNOWN';
  }

  if (deadline && deadline.getTime() < now.getTime()) {
    return 'CLOSED';
  }

  if (openDate && openDate.getTime() > now.getTime()) {
    return 'UPCOMING';
  }

  if (deadline) {
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours > 0 && diffHours <= 72) {
      return 'CLOSING_SOON';
    }
  }

  return 'OPEN';
}

export function parseSafeDate(dateInput?: string | Date | null): Date | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function sanitizeText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

export function normalizeRawHackathon(raw: RawHackathon): NormalizedHackathon {
  const name = sanitizeText(raw.name);
  const slug = raw.slug ? slugify(raw.slug) : slugify(name);
  const description = sanitizeText(raw.description);
  const organizerName = sanitizeText(raw.organizerName) || 'Independent Organizer';

  const openDate = parseSafeDate(raw.registrationOpenDate);
  const deadline = parseSafeDate(raw.registrationDeadline);
  const startDate = parseSafeDate(raw.eventStartDate);
  const endDate = parseSafeDate(raw.eventEndDate);

  const registrationStatus = computeRegistrationStatus(
    openDate,
    deadline,
    false,
    raw.registrationStatus
  );

  // Determine initial verification status based on completeness & official sources
  let verificationStatus: VerificationStatus = 'VERIFIED';
  let verificationNote: string | null = null;

  if (!raw.venueName && raw.mode === 'OFFLINE') {
    verificationStatus = 'PARTIALLY_VERIFIED';
    verificationNote = 'Location not confirmed';
  }

  if (startDate && endDate && endDate < startDate) {
    verificationStatus = 'CONFLICT';
    verificationNote = 'Date verification required (end date precedes start date)';
  }

  // Filter themes and technologies cleanly
  const themes = Array.isArray(raw.themes)
    ? Array.from(new Set(raw.themes.map((t) => sanitizeText(t)).filter(Boolean)))
    : [];

  const technologies = Array.isArray(raw.technologies)
    ? Array.from(new Set(raw.technologies.map((t) => sanitizeText(t)).filter(Boolean)))
    : [];

  return {
    name,
    slug,
    description,
    organizerName,
    organizerWebsite: raw.organizerWebsite || null,
    organizerLogo: raw.organizerLogo || null,
    mode: raw.mode,
    venueName: raw.venueName ? sanitizeText(raw.venueName) : null,
    city: raw.city ? sanitizeText(raw.city) : null,
    state: raw.state ? sanitizeText(raw.state) : null,
    country: raw.country ? sanitizeText(raw.country) : (raw.mode === 'ONLINE' ? 'Global' : 'India'),
    latitude: raw.latitude || null,
    longitude: raw.longitude || null,
    prizePool: typeof raw.prizePool === 'number' && raw.prizePool >= 0 ? raw.prizePool : null,
    prizeCurrency: raw.prizeCurrency || 'INR',
    registrationStatus,
    registrationOpenDate: openDate,
    registrationDeadline: deadline,
    eventStartDate: startDate,
    eventEndDate: endDate,
    teamMin: raw.teamMin && raw.teamMin > 0 ? raw.teamMin : 1,
    teamMax: raw.teamMax && raw.teamMax >= (raw.teamMin || 1) ? raw.teamMax : 4,
    eligibility: sanitizeText(raw.eligibility) || 'Open to all',
    themes,
    technologies,
    registrationUrl: raw.registrationUrl || raw.sourceUrl,
    officialWebsite: raw.officialWebsite || null,
    bannerImage: raw.bannerImage || null,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    verified: verificationStatus === 'VERIFIED',
    verificationStatus,
    verificationNote,
    sources: [
      {
        sourceName: raw.sourceName,
        sourceId: raw.sourceId || null,
        sourceUrl: raw.sourceUrl,
        isCanonical: true,
        rawData: raw.rawData ? JSON.stringify(raw.rawData) : null,
      },
    ],
  };
}
