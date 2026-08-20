import { HackathonMode, RegistrationStatus, VerificationStatus } from '@/types';

export interface RawHackathon {
  sourceName: string;
  sourceId?: string;
  sourceUrl: string;
  name: string;
  slug?: string;
  description: string;
  organizerName: string;
  organizerWebsite?: string;
  organizerLogo?: string;
  mode: HackathonMode;
  venueName?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  prizePool?: number;
  prizeCurrency?: string;
  registrationStatus?: RegistrationStatus;
  registrationOpenDate?: string | Date;
  registrationDeadline?: string | Date;
  eventStartDate?: string | Date;
  eventEndDate?: string | Date;
  teamMin?: number;
  teamMax?: number;
  eligibility?: string;
  themes?: string[];
  technologies?: string[];
  registrationUrl: string;
  officialWebsite?: string;
  bannerImage?: string;
  isPostponed?: boolean;
  rawData?: Record<string, any>;
}

export interface NormalizedHackathon {
  name: string;
  slug: string;
  description: string;
  organizerName: string;
  organizerWebsite?: string | null;
  organizerLogo?: string | null;
  mode: HackathonMode;
  venueName?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  prizePool?: number | null;
  prizeCurrency: string;
  registrationStatus: RegistrationStatus;
  registrationOpenDate?: Date | null;
  registrationDeadline?: Date | null;
  eventStartDate?: Date | null;
  eventEndDate?: Date | null;
  teamMin: number;
  teamMax: number;
  eligibility: string;
  themes: string[];
  technologies: string[];
  registrationUrl: string;
  officialWebsite?: string | null;
  bannerImage?: string | null;
  sourceName: string;
  sourceUrl?: string | null;
  verified: boolean;
  verificationStatus: VerificationStatus;
  verificationNote?: string | null;
  isPostponed?: boolean;
  sources: {
    sourceName: string;
    sourceId?: string | null;
    sourceUrl: string;
    isCanonical: boolean;
    rawData?: string | null;
  }[];
}

export interface HackathonSource {
  id: string;
  name: string;
  enabled: boolean;
  rateLimitMs?: number;

  discover(): Promise<RawHackathon[]>;
  getDetails(url: string): Promise<RawHackathon | null>;
}

export interface CrawlerScanReport {
  runId: string;
  startedAt: Date;
  completedAt: Date;
  status: 'COMPLETED' | 'FAILED';
  eventsDiscovered: number;
  eventsCreated: number;
  eventsUpdated: number;
  duplicateCount: number;
  errorCount: number;
  errors: string[];
  durationMs: number;
  sourceReports: {
    sourceName: string;
    status: 'SUCCESS' | 'ERROR' | 'PARTIAL';
    eventsFound: number;
    responseTimeMs: number;
    errorMessage?: string;
  }[];
}
