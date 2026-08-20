import { NormalizedHackathon } from './types';

export interface DetectedFieldChange {
  field: string;
  previousValue: string | null;
  newValue: string | null;
  isMeaningful: boolean;
  alertType?: 'DEADLINE_CHANGED' | 'REGISTRATION_OPENED' | 'POSTPONED' | 'PRIZE_UPDATED' | 'VENUE_ANNOUNCED' | 'GENERAL_UPDATE';
}

export function detectHackathonChanges(
  existing: {
    name: string;
    registrationStatus: string;
    registrationDeadline: Date | null;
    eventStartDate: Date | null;
    eventEndDate: Date | null;
    prizePool: number | null;
    venueName: string | null;
    city: string | null;
    teamMin: number;
    teamMax: number;
    isPostponed: boolean;
    isCancelled: boolean;
  },
  incoming: NormalizedHackathon
): DetectedFieldChange[] {
  const changes: DetectedFieldChange[] = [];

  // 1. Postponement Check
  if (incoming.isPostponed && !existing.isPostponed) {
    changes.push({
      field: 'isPostponed',
      previousValue: 'false',
      newValue: 'true',
      isMeaningful: true,
      alertType: 'POSTPONED',
    });
  }

  // 2. Start Date change (e.g. postponed or rescheduled)
  if (
    incoming.eventStartDate &&
    existing.eventStartDate &&
    incoming.eventStartDate.getTime() !== existing.eventStartDate.getTime()
  ) {
    changes.push({
      field: 'eventStartDate',
      previousValue: existing.eventStartDate.toISOString(),
      newValue: incoming.eventStartDate.toISOString(),
      isMeaningful: true,
      alertType: incoming.isPostponed || existing.isPostponed ? 'POSTPONED' : 'GENERAL_UPDATE',
    });
  }

  // 3. Deadline Change (Extended or adjusted)
  if (
    incoming.registrationDeadline &&
    existing.registrationDeadline &&
    incoming.registrationDeadline.getTime() !== existing.registrationDeadline.getTime()
  ) {
    changes.push({
      field: 'registrationDeadline',
      previousValue: existing.registrationDeadline.toISOString(),
      newValue: incoming.registrationDeadline.toISOString(),
      isMeaningful: true,
      alertType: 'DEADLINE_CHANGED',
    });
  }

  // 4. Registration Status change (e.g. UPCOMING -> OPEN)
  if (incoming.registrationStatus !== existing.registrationStatus) {
    const isOpening =
      (existing.registrationStatus === 'UPCOMING' || existing.registrationStatus === 'UNKNOWN') &&
      (incoming.registrationStatus === 'OPEN' || incoming.registrationStatus === 'CLOSING_SOON');

    changes.push({
      field: 'registrationStatus',
      previousValue: existing.registrationStatus,
      newValue: incoming.registrationStatus,
      isMeaningful: isOpening, // Opening triggers immediate alert
      alertType: isOpening ? 'REGISTRATION_OPENED' : 'GENERAL_UPDATE',
    });
  }

  // 5. Prize Pool Change
  if (
    typeof incoming.prizePool === 'number' &&
    incoming.prizePool !== existing.prizePool &&
    incoming.prizePool > (existing.prizePool || 0)
  ) {
    changes.push({
      field: 'prizePool',
      previousValue: existing.prizePool !== null ? existing.prizePool.toString() : null,
      newValue: incoming.prizePool.toString(),
      isMeaningful: true,
      alertType: 'PRIZE_UPDATED',
    });
  }

  // 6. Venue Announced
  if (incoming.venueName && !existing.venueName) {
    changes.push({
      field: 'venueName',
      previousValue: null,
      newValue: incoming.venueName,
      isMeaningful: true,
      alertType: 'VENUE_ANNOUNCED',
    });
  }

  // 7. Team Size change
  if (incoming.teamMin !== existing.teamMin || incoming.teamMax !== existing.teamMax) {
    changes.push({
      field: 'teamSize',
      previousValue: `${existing.teamMin}-${existing.teamMax}`,
      newValue: `${incoming.teamMin}-${incoming.teamMax}`,
      isMeaningful: false,
      alertType: 'GENERAL_UPDATE',
    });
  }

  return changes;
}
