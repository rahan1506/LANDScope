import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import openApiSpec from "./docs/openapi.json";

import authRoutes from "./routes/authRoutes";
import parcelRoutes from "./routes/parcelRoutes";
import changeDetectionRoutes from "./routes/changeDetectionRoutes";
import mutationRoutes from "./routes/mutationRoutes";
import ulpinRoutes from "./routes/ulpinRoutes";
import legalRoutes from "./routes/legalRoutes";
import evidenceRoutes from "./routes/evidenceRoutes";
import fieldRoutes from "./routes/fieldRoutes";
import caseRoutes from "./routes/caseRoutes";
import riskRoutes from "./routes/riskRoutes";
import healthRoutes from "./routes/healthRoutes";

import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  // Security headers & CORS
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] }));
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Global rate limiter on API endpoints
  app.use("/api/", apiRateLimiter);

  // Swagger Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get("/api/v1/openapi.json", (req, res) => res.json(openApiSpec));

  // Mount API Version 1 endpoints
  const apiV1 = express.Router();
  apiV1.use("/health", healthRoutes);
  apiV1.use("/auth", authRoutes);
  apiV1.use("/parcels", parcelRoutes);
  apiV1.use("/change-detection", changeDetectionRoutes);
  apiV1.use("/mutations", mutationRoutes);
  apiV1.use("/ulpin", ulpinRoutes);
  apiV1.use("/legal", legalRoutes);
  apiV1.use("/evidence", evidenceRoutes);
  apiV1.use("/", fieldRoutes); // field-observations, field-sync
  apiV1.use("/cases", caseRoutes);
  apiV1.use("/risk", riskRoutes);

  app.use("/api/v1", apiV1);

  // Fallback 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "NOT_FOUND",
      message: `Endpoint ${req.method} ${req.url} does not exist. Refer to /api-docs for documentation.`,
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
