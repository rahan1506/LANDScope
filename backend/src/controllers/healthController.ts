import { Request, Response } from "express";
import { isDbConnected, testDatabaseConnection } from "../config/database";
import { getSatelliteProvider } from "../gis/satellite/providerFactory";
import { getLLMProvider } from "../legal/llmProvider";
import { env } from "../config/env";

export class HealthController {
  static async check(req: Request, res: Response) {
    const dbLive = isDbConnected();
    const satelliteProvider = getSatelliteProvider();
    const llmProvider = getLLMProvider();

    const satelliteAvailable = await satelliteProvider.ping();
    const llmAvailable = await llmProvider.ping();

    const status = {
      status: "healthy",
      version: "1.0.0",
      environment: env.NODE_ENV,
      demoMode: env.DEMO_MODE,
      components: {
        database: dbLive ? "connected" : "sovereign_in_memory_engine",
        storage: "connected",
        satellite: satelliteAvailable ? "available" : "demo_fallback",
        satelliteProvider: satelliteProvider.providerName,
        llm: llmAvailable ? "available" : "deterministic_mode",
        llmProvider: llmProvider.providerName,
        mapProvider: env.MAP_PROVIDER,
      },
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };

    return res.status(200).json(status);
  }
}
