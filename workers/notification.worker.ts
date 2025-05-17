import { Job } from 'bullmq';
import { createWorker, NOTIFICATION_QUEUE } from './queue.config';

// Define the structure of your notification job data
interface NotificationJobData {
  type: 'bookingConfirmation' | 'passwordReset' | 'maintenanceAlert' | 'generic'; // Add more types as needed
  recipient: string; // e.g., email address or user ID
  payload: Record<string, any>; // Data specific to the notification type
}

/**
 * Processes jobs added to the notification queue.
 * This function will be executed by the worker process.
 */
const processNotificationJob = async (job: Job<NotificationJobData>) => {
  const { type, recipient, payload } = job.data;
  console.log(`Processing notification job ${job.id}: Type=${type}, Recipient=${recipient}`);

  try {
    // TODO: Implement actual notification sending logic based on type
    switch (type) {
      case 'bookingConfirmation':
        // Example: await sendBookingConfirmationEmail(recipient, payload.bookingDetails);
        console.log(`--> Pretending to send booking confirmation to ${recipient}`);
        break;
      case 'passwordReset':
        // Example: await sendPasswordResetEmail(recipient, payload.resetToken);
        console.log(`--> Pretending to send password reset to ${recipient}`);
        break;
      case 'maintenanceAlert':
         // Example: await sendMaintenanceAlert(recipient, payload.vehicleInfo);
         console.log(`--> Pretending to send maintenance alert for ${recipient}`);
         break;
      default:
        console.warn(`Unhandled notification type: ${type}`);
    }

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`Finished processing job ${job.id}`);

  } catch (error: any) {
    console.error(`Error processing job ${job.id}: ${error.message}`);
    // Optional: throw error to make BullMQ retry the job based on retry settings
    throw error;
  }
};

// --- Worker Initialization ---
// This part should only run when you start your dedicated worker process/service
// Do not run this directly within your main Next.js application process
const startNotificationWorker = () => {
  console.log('🚀 Initializing Notification Worker...');
  const worker = createWorker(NOTIFICATION_QUEUE, processNotificationJob);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down notification worker...');
    await worker.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  console.log('Notification Worker started and waiting for jobs.');
};

// Example: You might call startNotificationWorker() from a separate script
// like `node dist/workers/notification.worker.js`
// Uncomment the line below ONLY if you intend to run this file directly as the worker
// startNotificationWorker();

export default processNotificationJob; // Exporting for potential direct use or testing 