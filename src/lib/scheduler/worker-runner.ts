import { schedulerWorker } from './cron-worker';

async function startScheduler() {
  console.log('[WorkerRunner] 🚀 Starting HackPulse 5-Hour Scheduler & Alert Worker...');
  await schedulerWorker.start();
}

startScheduler().catch((err) => {
  console.error('[WorkerRunner] Fatal scheduler startup error:', err);
});
