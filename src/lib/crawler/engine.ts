import prisma from '@/lib/prisma';
import { HackathonSource, CrawlerScanReport, NormalizedHackathon } from './types';
import { DevfolioSource } from './adapters/devfolio';
import { UnstopSource } from './adapters/unstop';
import { DevpostSource } from './adapters/devpost';
import { MLHSource } from './adapters/mlh';
import { UniversitySource } from './adapters/university';
import { SOURCES_CATALOG, GenericSourceAdapter } from './source-registry';
import { normalizeRawHackathon } from './normalizer';
import { checkDuplicate } from './deduplicator';
import { detectHackathonChanges } from './change-detector';
import { dispatchDiscordAlertsForNewHackathon, dispatchDiscordAlertsForChanges } from '@/lib/discord/poster';

export class CrawlerEngine {
  private sources: HackathonSource[] = [];

  constructor() {
    // 1. Primary dedicated adapters
    this.sources = [
      new DevfolioSource(),
      new UnstopSource(),
      new DevpostSource(),
      new MLHSource(),
      new UniversitySource(),
    ];

    // 2. Register all 60 catalog sources (excluding IDs already registered as dedicated adapters)
    const existingIds = new Set(this.sources.map((s) => s.id));
    for (const def of SOURCES_CATALOG) {
      if (!existingIds.has(def.id)) {
        this.sources.push(new GenericSourceAdapter(def));
        existingIds.add(def.id);
      }
    }
  }

  public getRegisteredSources(): HackathonSource[] {
    return this.sources;
  }

  public async runScan(): Promise<CrawlerScanReport> {
    const startedAt = new Date();
    console.log(
      `[CrawlerEngine] 🚀 Starting 5-hour discovery cycle across ${this.sources.length} sources at ${startedAt.toISOString()}`
    );

    // Create DB crawler run entry
    const dbRun = await prisma.crawlerRun.create({
      data: {
        startedAt,
        status: 'RUNNING',
      },
    });

    let totalDiscovered = 0;
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalDuplicates = 0;
    const errors: string[] = [];
    const sourceReports: CrawlerScanReport['sourceReports'] = [];

    // Load existing active hackathons for deduplication
    const existingHackathons = await prisma.hackathon.findMany({
      include: {
        sources: true,
      },
    });

    for (const source of this.sources) {
      if (!source.enabled) continue;

      const sourceStartTime = Date.now();
      try {
        const rawList = await source.discover();
        const responseTimeMs = Date.now() - sourceStartTime;

        totalDiscovered += rawList.length;

        for (const raw of rawList) {
          const normalized = normalizeRawHackathon(raw);

          // Check for duplicate in existing records
          let matchedExisting = null;
          for (const ext of existingHackathons) {
            const match = checkDuplicate(normalized, ext);
            if (match.isDuplicate) {
              matchedExisting = ext;
              break;
            }
          }

          if (matchedExisting) {
            totalDuplicates++;

            // Ensure this source is recorded in sources relation
            const existingSourceRecord = matchedExisting.sources.find(
              (s) => s.sourceName === normalized.sourceName && s.sourceUrl === normalized.sourceUrl
            );

            if (!existingSourceRecord) {
              await prisma.hackathonSourceRecord.create({
                data: {
                  hackathonId: matchedExisting.id,
                  sourceName: normalized.sourceName,
                  sourceId: normalized.sources[0]?.sourceId || null,
                  sourceUrl: normalized.sourceUrl || normalized.registrationUrl,
                  isCanonical: false,
                  discoveredAt: new Date(),
                },
              });
            }

            // Detect field changes
            const detectedChanges = detectHackathonChanges(matchedExisting, normalized);
            if (detectedChanges.length > 0) {
              totalUpdated++;

              for (const chg of detectedChanges) {
                await prisma.hackathonChange.create({
                  data: {
                    hackathonId: matchedExisting.id,
                    field: chg.field,
                    previousValue: chg.previousValue,
                    newValue: chg.newValue,
                    source: normalized.sourceName,
                    notified: false,
                  },
                });
              }

              // Update the hackathon in DB
              const updateData: any = {
                lastSeenAt: new Date(),
                lastCheckedAt: new Date(),
              };
              if (normalized.registrationDeadline) {
                updateData.registrationDeadline = normalized.registrationDeadline;
              }
              if (normalized.eventStartDate) {
                updateData.eventStartDate = normalized.eventStartDate;
              }
              if (normalized.eventEndDate) {
                updateData.eventEndDate = normalized.eventEndDate;
              }
              if (normalized.isPostponed) {
                updateData.isPostponed = true;
                updateData.registrationStatus = 'POSTPONED';
              }
              if (normalized.prizePool && normalized.prizePool > (matchedExisting.prizePool || 0)) {
                updateData.prizePool = normalized.prizePool;
              }
              if (normalized.venueName && !matchedExisting.venueName) {
                updateData.venueName = normalized.venueName;
              }

              const updatedHackathon = await prisma.hackathon.update({
                where: { id: matchedExisting.id },
                data: updateData,
              });

              // Dispatch change alert
              await dispatchDiscordAlertsForChanges(updatedHackathon, detectedChanges);
            } else {
              // Just touch lastCheckedAt
              await prisma.hackathon.update({
                where: { id: matchedExisting.id },
                data: { lastCheckedAt: new Date() },
              });
            }
          } else {
            // Brand new hackathon!
            totalCreated++;

            const createdHackathon = await prisma.hackathon.create({
              data: {
                name: normalized.name,
                slug: normalized.slug,
                description: normalized.description,
                organizerName: normalized.organizerName,
                organizerWebsite: normalized.organizerWebsite,
                organizerLogo: normalized.organizerLogo,
                mode: normalized.mode,
                venueName: normalized.venueName,
                city: normalized.city,
                state: normalized.state,
                country: normalized.country,
                latitude: normalized.latitude,
                longitude: normalized.longitude,
                prizePool: normalized.prizePool,
                prizeCurrency: normalized.prizeCurrency,
                registrationStatus: normalized.registrationStatus,
                registrationOpenDate: normalized.registrationOpenDate,
                registrationDeadline: normalized.registrationDeadline,
                eventStartDate: normalized.eventStartDate,
                eventEndDate: normalized.eventEndDate,
                teamMin: normalized.teamMin,
                teamMax: normalized.teamMax,
                eligibility: normalized.eligibility,
                themes: JSON.stringify(normalized.themes),
                technologies: JSON.stringify(normalized.technologies),
                registrationUrl: normalized.registrationUrl,
                officialWebsite: normalized.officialWebsite,
                bannerImage: normalized.bannerImage,
                sourceName: normalized.sourceName,
                sourceUrl: normalized.sourceUrl,
                verified: normalized.verified,
                verificationStatus: normalized.verificationStatus,
                verificationNote: normalized.verificationNote,
                sources: {
                  create: normalized.sources.map((s) => ({
                    sourceName: s.sourceName,
                    sourceId: s.sourceId,
                    sourceUrl: s.sourceUrl,
                    isCanonical: s.isCanonical,
                    rawData: s.rawData,
                  })),
                },
              },
              include: {
                sources: true,
              },
            });

            existingHackathons.push(createdHackathon);

            // Dispatch Discord alerts
            await dispatchDiscordAlertsForNewHackathon(createdHackathon);
          }
        }

        // Record source run log
        await prisma.crawlerSourceRun.create({
          data: {
            crawlerRunId: dbRun.id,
            sourceName: source.name,
            status: 'SUCCESS',
            eventsFound: rawList.length,
            responseTimeMs,
          },
        });

        sourceReports.push({
          sourceName: source.name,
          status: 'SUCCESS',
          eventsFound: rawList.length,
          responseTimeMs,
        });
      } catch (err: any) {
        const errorMsg = `Source ${source.name} error: ${err?.message || err}`;
        errors.push(errorMsg);

        await prisma.crawlerSourceRun.create({
          data: {
            crawlerRunId: dbRun.id,
            sourceName: source.name,
            status: 'ERROR',
            eventsFound: 0,
            responseTimeMs: 0,
            errorMessage: errorMsg,
          },
        });

        sourceReports.push({
          sourceName: source.name,
          status: 'ERROR',
          eventsFound: 0,
          responseTimeMs: 0,
          errorMessage: errorMsg,
        });
      }
    }

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    await prisma.crawlerRun.update({
      where: { id: dbRun.id },
      data: {
        completedAt,
        status: errors.length === this.sources.length ? 'FAILED' : 'COMPLETED',
        eventsDiscovered: totalDiscovered,
        eventsCreated: totalCreated,
        eventsUpdated: totalUpdated,
        duplicateCount: totalDuplicates,
        errorCount: errors.length,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        durationMs,
      },
    });

    console.log(
      `[CrawlerEngine] ✅ 5-Hour Scan completed across ${this.sources.length} sources in ${(durationMs / 1000).toFixed(1)}s: Discovered=${totalDiscovered}, Created=${totalCreated}, Updated=${totalUpdated}, Duplicates=${totalDuplicates}`
    );

    return {
      runId: dbRun.id,
      startedAt,
      completedAt,
      status: errors.length === this.sources.length ? 'FAILED' : 'COMPLETED',
      eventsDiscovered: totalDiscovered,
      eventsCreated: totalCreated,
      eventsUpdated: totalUpdated,
      duplicateCount: totalDuplicates,
      errorCount: errors.length,
      errors,
      durationMs,
      sourceReports,
    };
  }
}

export const crawlerEngine = new CrawlerEngine();
