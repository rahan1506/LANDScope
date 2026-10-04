import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000").transform((val) => parseInt(val, 10)),
  HOST: z.string().default("0.0.0.0"),
  DEMO_MODE: z.string().default("true").transform((val) => val === "true" || val === "1"),
  
  // Database (PostgreSQL + PostGIS)
  DATABASE_URL: z.string().optional(),
  PGHOST: z.string().default("localhost"),
  PGPORT: z.string().default("5432").transform((val) => parseInt(val, 10)),
  PGUSER: z.string().default("postgres"),
  PGPASSWORD: z.string().default("postgres"),
  PGDATABASE: z.string().default("landscope_gov"),
  
  // Security & JWT
  JWT_SECRET: z.string().default("sovereign_landscope_jwt_secret_key_change_in_production_2026"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  
  // Public URL
  PUBLIC_BASE_URL: z.string().default("http://localhost:3000"),
  
  // Map Provider
  MAP_PROVIDER: z.enum(["openstreetmap", "maplibre", "maptiler", "leaflet"]).default("openstreetmap"),
  MAP_API_KEY: z.string().optional(),
  
  // Satellite Data Provider
  SATELLITE_PROVIDER: z.enum(["demo", "copernicus", "usgs", "nasa"]).default("demo"),
  COPERNICUS_CLIENT_ID: z.string().optional(),
  COPERNICUS_CLIENT_SECRET: z.string().optional(),
  USGS_API_KEY: z.string().optional(),
  
  // LLM / AI Provider
  LLM_PROVIDER: z.enum(["demo", "openai", "gemini", "ollama"]).default("demo"),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default("gemini-2.5-flash"),
  
  // Storage Provider
  STORAGE_PROVIDER: z.enum(["local", "s3", "minio"]).default("local"),
  STORAGE_LOCAL_DIR: z.string().default("./uploads"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().default("ap-south-1"),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform((val) => parseInt(val, 10)), // 15 mins
  RATE_LIMIT_MAX: z.string().default("1000").transform((val) => parseInt(val, 10)),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Configuration validation error:", error.format());
  }
  // Fallback defaults for resilience
  parsedEnv = envSchema.parse({ DEMO_MODE: "true" });
}

export const env = parsedEnv;
