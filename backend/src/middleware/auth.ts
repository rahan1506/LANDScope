import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, RoleCode, PermissionCode } from "../types";
import { sendError } from "../utils/response";

export interface AuthenticatedRequest extends Request {
  user?: User;
  permissions?: PermissionCode[];
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If in demo mode and no token supplied, provide authenticated demo officer context
    if (env.DEMO_MODE) {
      req.user = {
        id: "usr_demo_admin",
        name: "Dr. Ananya Sharma (Demo Lead)",
        email: "officer@landscope.gov.in",
        roleCode: "ADMIN",
        organization: "Ministry of Rural Development",
        designation: "Director General Land Intelligence",
        status: "ACTIVE",
        createdAt: "2024-01-01T00:00:00Z",
      };
      return next();
    }
    return sendError(res, "Missing or invalid authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = decoded;
    return next();
  } catch (err) {
    return sendError(res, "Invalid or expired token", 401);
  }
}
