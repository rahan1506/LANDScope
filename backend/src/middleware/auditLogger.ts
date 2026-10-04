import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { query, isDbConnected } from "../config/database";
import { AuditLogEntry } from "../types";
import { logger } from "../utils/logger";

const inMemoryAuditLogs: AuditLogEntry[] = [];

export function getAuditLogs(): AuditLogEntry[] {
  return inMemoryAuditLogs;
}

export function logAuditAction(
  userId: string,
  userName: string,
  action: string,
  resource: string,
  resourceId: string,
  ipAddress?: string,
  oldValue?: Record<string, unknown> | null,
  newValue?: Record<string, unknown> | null
) {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    userName,
    action,
    resource,
    resourceId,
    ipAddress,
    oldValue: oldValue || null,
    newValue: newValue || null,
    timestamp: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(entry);
  if (inMemoryAuditLogs.length > 500) inMemoryAuditLogs.pop();

  if (isDbConnected()) {
    query(
      `INSERT INTO audit_logs (id, user_id, user_name, action, resource, resource_id, ip_address, old_value, new_value, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        entry.id,
        entry.userId,
        entry.userName,
        entry.action,
        entry.resource,
        entry.resourceId,
        entry.ipAddress || null,
        JSON.stringify(entry.oldValue),
        JSON.stringify(entry.newValue),
        entry.timestamp,
      ]
    ).catch((err) => logger.warn("Failed to write audit log to PostgreSQL:", err));
  }

  logger.info(`AUDIT: [${action}] by ${userName} (${userId}) on ${resource}:${resourceId}`);
}

export function auditMiddleware(action: string, resource: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = req.params.id || req.body?.parcelId || req.body?.caseId || req.body?.clientGeneratedId || "global";
        logAuditAction(
          req.user?.id || "anonymous",
          req.user?.name || "Anonymous User",
          action,
          resource,
          String(resourceId),
          req.ip,
          null,
          req.method !== "GET" ? req.body : null
        );
      }
      return originalJson.call(this, body);
    };

    next();
  };
}
