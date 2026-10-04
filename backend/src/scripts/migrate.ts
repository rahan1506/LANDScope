import fs from "fs";
import path from "path";
import { getDatabasePool } from "../config/database";
import { logger } from "../utils/logger";

async function runMigrations() {
  const pool = getDatabasePool();
  if (!pool) {
    logger.warn("Database pool is null. Cannot run PostgreSQL migrations (ensure DATABASE_URL or PGHOST is set).");
    process.exit(0);
  }

  const migrationPath = path.resolve(__dirname, "../../migrations/001_postgis_landscope_schema.sql");
  logger.info(`Reading migration file: ${migrationPath}`);

  if (!fs.existsSync(migrationPath)) {
    logger.error("Migration file not found at " + migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  try {
    const client = await pool.connect();
    logger.info("Executing PostGIS schema migration...");
    await client.query(sql);
    client.release();
    logger.info("Migration 001_postgis_landscope_schema.sql completed successfully!");
    process.exit(0);
  } catch (err) {
    logger.error("Migration execution failed:", err);
    process.exit(1);
  }
}

runMigrations();
