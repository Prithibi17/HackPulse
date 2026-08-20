import prisma from '@/lib/prisma';
import { crawlerEngine } from '../crawler/engine';
import { getDiscordClient } from '../discord/client';
import { createClosingSoonEmbed } from '../discord/embeds';

export class SchedulerWorker {
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private timezone: string = process.env.CRAWLER_TIMEZONE || 'Asia/Kolkata';

  // Target fixed cron hours in 24h format: 00:00, 05:00, 10:00, 15:00, 20:00
  public fixedHours: number[] = [0, 5, 10, 15, 20];

  public getNextScheduledCrawlTime(now: Date = new Date()): Date {
    const next = new Date(now);
    next.setMinutes(0, 0, 0);

    const currentHour = now.getHours();
    const nextHour = this.fixedHours.find((h) => h > currentHour);

    if (nextHour !== undefined) {
      next.setHours(nextHour);
    } else {
      // Next day first slot
      next.setDate(next.getDate() + 1);
      next.setHours(this.fixedHours[0]);
    }

    return next;
  }

  public async start() {
    console.log(`[SchedulerWorker] 🕒 Initializing Fixed 5-Hour Scheduler (Timezone: ${this.timezone})...`);
    const nextSlot = this.getNextScheduledCrawlTime();
    console.log(`[SchedulerWorker] 📅 Next automated crawler scan scheduled at: ${nextSlot.toISOString()}`);

    // Set high-frequency precision timer (checks every 30 seconds for fixed cron alignment & deadline alerts)
    this.timer = setInterval(async () => {
      await this.tick();
    }, 30000);

    // Run first-time deadline checks immediately
    await this.processUrgentDeadlinesAndReminders();
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[SchedulerWorker] 🛑 Scheduler stopped.');
    }
  }

  public async tick() {
    if (this.isRunning) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Fixed cron slot match (exact minute 0 of 00, 05, 10, 15, 20)
    const isSlot = this.fixedHours.includes(currentHour) && currentMinute === 0;

    if (isSlot) {
      try {
        this.isRunning = true;
        console.log(`[SchedulerWorker] ⏰ Fixed 5-hour cron triggered at ${now.toISOString()}`);
        await crawlerEngine.runScan();
      } catch (err: any) {
        console.error('[SchedulerWorker] Error executing scheduled scan:', err);
      } finally {
        this.isRunning = false;
      }
    }

    // Periodically process deadline status updates and reminders
    await this.processUrgentDeadlinesAndReminders();
  }

  public async processUrgentDeadlinesAndReminders() {
    const now = new Date();

    // 1. Update hackathons with deadlines within 72 hours to CLOSING_SOON
    const closingThreshold = new Date(now.getTime() + 72 * 3600 * 1000);
    const hackathonsToClose = await prisma.hackathon.findMany({
      where: {
        registrationStatus: 'OPEN',
        registrationDeadline: {
          lte: closingThreshold,
          gte: now,
        },
      },
    });

    for (const h of hackathonsToClose) {
      console.log(`[SchedulerWorker] ⏳ Hackathon "${h.name}" is now CLOSING_SOON (< 72h)`);
      await prisma.hackathon.update({
        where: { id: h.id },
        data: { registrationStatus: 'CLOSING_SOON' },
      });
    }

    // 2. Mark passed deadlines as CLOSED
    await prisma.hackathon.updateMany({
      where: {
        registrationStatus: { in: ['OPEN', 'CLOSING_SOON'] },
        registrationDeadline: {
          lt: now,
        },
      },
      data: { registrationStatus: 'CLOSED' },
    });

    // 3. Process pending user reminders
    const pendingReminders = await prisma.hackathonReminder.findMany({
      where: {
        status: 'PENDING',
        triggerTime: { lte: now },
      },
      include: {
        hackathon: true,
      },
    });

    const client = getDiscordClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const reminder of pendingReminders) {
      try {
        if (client && client.isReady()) {
          const user = await client.users.fetch(reminder.discordUserId);
          if (user) {
            const payload = createClosingSoonEmbed(reminder.hackathon, appUrl);
            await user.send({
              content: `🔔 **Deadline Reminder:** Registration for **${reminder.hackathon.name}** is closing soon!`,
              embeds: payload.embeds,
              components: payload.components,
            });
          }
        } else {
          console.log(
            `[SchedulerWorker] (Mock Client) Sent DM deadline reminder for "${reminder.hackathon.name}" to user ${reminder.discordUserId}`
          );
        }

        await prisma.hackathonReminder.update({
          where: { id: reminder.id },
          data: { status: 'SENT', sentAt: new Date() },
        });
      } catch (err: any) {
        console.error(`[SchedulerWorker] Failed to dispatch reminder ${reminder.id}:`, err?.message || err);
      }
    }
  }
}

export const schedulerWorker = new SchedulerWorker();
