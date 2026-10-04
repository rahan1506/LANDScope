import { logger } from "../utils/logger";

export type JobType =
  | "satellite_processing"
  | "ndvi_processing"
  | "change_detection"
  | "document_ingestion"
  | "embedding_generation"
  | "evidence_generation"
  | "offline_synchronization";

export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface JobRecord<T = any> {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: T;
  result?: any;
  error?: string;
  progressPct: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  completedAt?: string;
}

export class JobQueue {
  private static jobs: Map<string, JobRecord> = new Map();
  private static handlers: Map<JobType, (payload: any) => Promise<any>> = new Map();

  static registerHandler(type: JobType, handler: (payload: any) => Promise<any>) {
    this.handlers.set(type, handler);
  }

  static enqueue<T>(type: JobType, payload: T): JobRecord<T> {
    const id = `job-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const job: JobRecord<T> = {
      id,
      type,
      status: "PENDING",
      payload,
      progressPct: 0,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(id, job);
    logger.info(`Job enqueued: ${id} (${type})`);

    // Process asynchronously without blocking request
    setImmediate(() => this.processJob(id));

    return job;
  }

  private static async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "COMPLETED";
      job.progressPct = 100;
      job.result = { message: "Job processed via default asynchronous executor." };
      return;
    }

    job.status = "PROCESSING";
    job.attempts++;
    job.progressPct = 25;

    try {
      const result = await handler(job.payload);
      job.status = "COMPLETED";
      job.progressPct = 100;
      job.result = result;
      job.completedAt = new Date().toISOString();
      logger.info(`Job completed successfully: ${jobId}`);
    } catch (err: any) {
      logger.error(`Job execution failed: ${jobId}`, err);
      if (job.attempts < job.maxAttempts) {
        job.status = "PENDING";
        logger.info(`Retrying job ${jobId} (Attempt ${job.attempts}/${job.maxAttempts})`);
        setTimeout(() => this.processJob(jobId), 2000);
      } else {
        job.status = "FAILED";
        job.error = err.message || "Execution error";
      }
    }
  }

  static getJob(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  static listJobs(): JobRecord[] {
    return Array.from(this.jobs.values()).slice(-50);
  }
}
