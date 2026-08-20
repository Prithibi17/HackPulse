import { describe, it, expect } from 'vitest';
import { SchedulerWorker } from '../src/lib/scheduler/cron-worker';

describe('Scheduler Timing Logic', () => {
  it('schedules next crawl accurately on fixed 5-hour slots without time drift', () => {
    const worker = new SchedulerWorker();

    // If now is 02:30 -> Next slot is 05:00
    const t1 = new Date('2026-08-20T02:30:00');
    const next1 = worker.getNextScheduledCrawlTime(t1);
    expect(next1.getHours()).toBe(5);
    expect(next1.getMinutes()).toBe(0);

    // If now is 07:15 -> Next slot is 10:00
    const t2 = new Date('2026-08-20T07:15:00');
    const next2 = worker.getNextScheduledCrawlTime(t2);
    expect(next2.getHours()).toBe(10);
    expect(next2.getMinutes()).toBe(0);

    // If now is 21:45 -> Next slot is 00:00 tomorrow
    const t3 = new Date('2026-08-20T21:45:00');
    const next3 = worker.getNextScheduledCrawlTime(t3);
    expect(next3.getHours()).toBe(0);
    expect(next3.getMinutes()).toBe(0);
    expect(next3.getDate()).toBe(t3.getDate() + 1);
  });
});
