import { Pool, QueryResult, QueryResultRow } from "pg";
import { env } from "./env";
import { logger } from "../utils/logger";

let pool: Pool | null = null;
let isConnected = false;

export function getDatabasePool(): Pool | null {
  if (pool) return pool;

  try {
    const config = env.DATABASE_URL
      ? { connectionString: env.DATABASE_URL }
      : {
          host: env.PGHOST,
          port: env.PGPORT,
          user: env.PGUSER,
          password: env.PGPASSWORD,
          database: env.PGDATABASE,
        };

    pool = new Pool({
      ...config,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    });

    pool.on("error", (err) => {
      logger.error("Unexpected error on idle database client", err);
    });

    return pool;
  } catch (err) {
    logger.warn("Database pool initialization skipped (running in DEMO mode)", err);
    return null;
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  const p = getDatabasePool();
  if (!p) {
    isConnected = false;
    return false;
  }

  try {
    const res = await p.query("SELECT NOW() as current_time, PostGIS_Version() as postgis;");
    isConnected = true;
    logger.info("Connected to PostgreSQL with PostGIS:", res.rows[0]);
    return true;
  } catch (err) {
    isConnected = false;
    logger.warn("PostgreSQL connection failed. Falling back gracefully to in-memory sovereign demo engine.");
    return false;
  }
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | null> {
  const p = getDatabasePool();
  if (!p || !isConnected) return null;

  try {
    return await p.query<T>(text, params);
  } catch (err) {
    logger.error(`Database query failed: ${text}`, err);
    throw err;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}
