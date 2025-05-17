import { Queue, Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '@/lib/env-check'; // Assuming you have an env validation setup

// Re-use connection options for efficiency
const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Prevent BullMQ from crashing the worker on Redis disconnect
});

if (!connection) {
  console.error('🔴 Failed to create Redis connection for BullMQ');
  // Optionally throw an error or exit if Redis is critical
}

// --- Queue Names --- (Define all your queues here)
export const NOTIFICATION_QUEUE = 'notifications';
export const REPORT_QUEUE = 'reports';
// Add other queue names as needed...

// --- Factory function to create/get queues ---
const queues: { [key: string]: Queue } = {};

export const getQueue = (name: string): Queue => {
  if (!queues[name]) {
    console.log(`Creating queue: ${name}`);
    queues[name] = new Queue(name, { connection });
  }
  return queues[name];
};

// --- Factory function to create workers ---
// Note: Workers should typically run in separate processes/services
export const createWorker = (
  queueName: string,
  processor: (job: any) => Promise<void>
) => {
  console.log(`Creating worker for queue: ${queueName}`);
  const worker = new Worker(queueName, processor, { connection });

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} in ${queueName} completed.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} in ${queueName} failed with ${err.message}`);
    // Add more robust error handling/logging here
  });

  return worker;
};

// --- Queue Scheduler --- (Needed for delayed jobs, rate limiting etc.)
// Typically only ONE scheduler process should run for your entire application
let scheduler: QueueScheduler | null = null;
export const startScheduler = () => {
  if (!scheduler) {
    console.log('Starting BullMQ Queue Scheduler...');
    scheduler = new QueueScheduler(NOTIFICATION_QUEUE, { connection }); // Add other queues if needed
    // Handle scheduler errors if necessary
  }
};

// Graceful shutdown (important for workers)
export const closeQueues = async () => {
  console.log('Closing BullMQ queues...');
  await Promise.all(Object.values(queues).map((queue) => queue.close()));
  if (scheduler) {
    await scheduler.close();
  }
  // Note: Workers need their own close methods called where they run
  if (connection) {
     await connection.quit();
  }
   console.log('BullMQ queues closed.');
}; 