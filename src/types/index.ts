export type HackathonMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';

export type RegistrationStatus =
  | 'UPCOMING'
  | 'OPEN'
  | 'CLOSING_SOON'
  | 'CLOSED'
  | 'POSTPONED'
  | 'UNKNOWN';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'UNVERIFIED'
  | 'CONFLICT';

export interface HackathonData {
  id: string;
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
  registrationOpenDate?: string | Date | null;
  registrationDeadline?: string | Date | null;
  eventStartDate?: string | Date | null;
  eventEndDate?: string | Date | null;
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
  isPostponed: boolean;
  isCancelled: boolean;
  firstSeenAt: string | Date;
  lastSeenAt: string | Date;
  lastCheckedAt: string | Date;
  sources?: HackathonSourceRecordData[];
  changes?: HackathonChangeData[];
}

export interface HackathonSourceRecordData {
  id: string;
  sourceName: string;
  sourceId?: string | null;
  sourceUrl: string;
  isCanonical: boolean;
  discoveredAt: string | Date;
  lastSyncedAt: string | Date;
}

export interface HackathonChangeData {
  id: string;
  field: string;
  previousValue?: string | null;
  newValue?: string | null;
  detectedAt: string | Date;
  source?: string | null;
  notified: boolean;
}

export interface FilterOptions {
  keyword?: string;
  mode?: 'ALL' | 'ONLINE' | 'OFFLINE' | 'HYBRID';
  country?: string;
  state?: string;
  city?: string;
  themes?: string[];
  status?: string;
  minPrize?: number;
  maxPrize?: number;
  studentOnly?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  month?: string; // "YYYY-MM"
  startDate?: string;
  endDate?: string;
  sortBy?: 'deadline' | 'startDate' | 'prize' | 'recentlyAdded' | 'relevance';
}

export interface GuildConfig {
  guildId: string;
  guildName: string;
  icon?: string | null;
  postingChannelId?: string | null;
  timezone: string;
  enabled: boolean;
  subscription: {
    modes: HackathonMode[];
    countries: string[];
    states: string[];
    cities: string[];
    themes: string[];
    minPrize: number;
    studentsOnly: boolean;
    newHackathons: boolean;
    registrationAlerts: boolean;
    deadlineAlerts: boolean;
    changeAlerts: boolean;
    dailyDigest: boolean;
    pingRoleId?: string | null;
  };
}

export interface NaturalSearchResult {
  query: string;
  interpretedFilters: FilterOptions;
  explanation: string;
}
