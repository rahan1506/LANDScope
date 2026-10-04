export const logger = {
  info: (msg: string, meta?: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [LANDScope] ${msg}`, meta ? JSON.stringify(meta) : "");
  },
  warn: (msg: string, meta?: unknown) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [LANDScope] ${msg}`, meta ? JSON.stringify(meta) : "");
  },
  error: (msg: string, err?: unknown) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [LANDScope] ${msg}`, err || "");
  },
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}] [DEBUG] [LANDScope] ${msg}`, meta ? JSON.stringify(meta) : "");
    }
  },
};
