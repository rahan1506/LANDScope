import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { sendError } from "../utils/response";
import { env } from "../config/env";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const message =
    env.NODE_ENV === "production" && statusCode === 500
      ? "An internal server error occurred"
      : err.message || "Internal Server Error";

  return sendError(res, err.name || "SERVER_ERROR", statusCode, message);
}
