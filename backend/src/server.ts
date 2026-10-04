import { createApp } from "./app";
import { env } from "./config/env";
import { testDatabaseConnection } from "./config/database";
import { logger } from "./utils/logger";

async function bootstrap() {
  const app = createApp();

  logger.info("Starting LANDScope Sovereign Backend Service...");
  logger.info(`Mode: ${env.DEMO_MODE ? "DEMO_MODE (Resilient sovereign in-memory fallback)" : "REAL_DATA_MODE"}`);
  logger.info(`Satellite Provider: ${env.SATELLITE_PROVIDER}`);
  logger.info(`LLM Engine: ${env.LLM_PROVIDER} (${env.LLM_MODEL})`);
  logger.info(`Map Provider: ${env.MAP_PROVIDER}`);

  // Test PostGIS connection
  await testDatabaseConnection();

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`LANDScope Server running on http://${env.HOST}:${env.PORT}`);
    logger.info(`API Documentation available at: http://${env.HOST}:${env.PORT}/api-docs`);
    logger.info(`Health check: http://${env.HOST}:${env.PORT}/api/v1/health`);
  });

  const shutdown = () => {
    logger.info("Graceful shutdown signal received. Closing HTTP server...");
    server.close(() => {
      logger.info("LANDScope HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  bootstrap().catch((err) => {
    logger.error("Fatal error during backend bootstrap:", err);
    process.exit(1);
  });
}
