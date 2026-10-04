import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { RoleCode, PermissionCode } from "../types";
import { sendError } from "../utils/response";

const ROLE_PERMISSIONS: Record<RoleCode, PermissionCode[]> = {
  ADMIN: [
    "admin:all",
    "admin:audit",
    "parcels:read",
    "parcels:write",
    "sentinel:read",
    "sentinel:write",
    "mutations:read",
    "mutations:write",
    "legal:read",
    "legal:write",
    "evidence:read",
    "evidence:write",
    "field:read",
    "field:write",
    "cases:read",
    "cases:write",
  ],
  GOVERNMENT_AGENCY: [
    "parcels:read",
    "parcels:write",
    "sentinel:read",
    "sentinel:write",
    "mutations:read",
    "mutations:write",
    "legal:read",
    "legal:write",
    "evidence:read",
    "evidence:write",
    "field:read",
    "field:write",
    "cases:read",
    "cases:write",
  ],
  DISTRICT_OFFICER: [
    "parcels:read",
    "parcels:write",
    "sentinel:read",
    "mutations:read",
    "mutations:write",
    "legal:read",
    "evidence:read",
    "evidence:write",
    "cases:read",
    "cases:write",
  ],
  FIELD_OFFICER: [
    "parcels:read",
    "field:read",
    "field:write",
    "cases:read",
  ],
  LEGAL_REVIEWER: [
    "parcels:read",
    "legal:read",
    "legal:write",
    "evidence:read",
    "evidence:write",
    "cases:read",
  ],
  POLICYMAKER: [
    "parcels:read",
    "sentinel:read",
    "mutations:read",
    "legal:read",
    "cases:read",
  ],
  RESEARCHER: [
    "parcels:read",
    "sentinel:read",
    "mutations:read",
    "legal:read",
  ],
  ACADEMIC_INSTITUTION: [
    "parcels:read",
    "sentinel:read",
    "legal:read",
  ],
  INNOVATOR: [
    "parcels:read",
    "sentinel:read",
  ],
  PUBLIC: [
    "parcels:read",
  ],
};

export function requirePermission(...requiredPermissions: PermissionCode[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    const userRole = req.user.roleCode;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    if (permissions.includes("admin:all")) {
      return next();
    }

    const hasAll = requiredPermissions.every((perm) => permissions.includes(perm));
    if (!hasAll) {
      return sendError(
        res,
        `Forbidden: Role ${userRole} lacks required permissions [${requiredPermissions.join(", ")}]`,
        403
      );
    }

    return next();
  };
}

export function requireRole(...allowedRoles: RoleCode[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (req.user.roleCode === "ADMIN" || allowedRoles.includes(req.user.roleCode)) {
      return next();
    }

    return sendError(
      res,
      `Forbidden: Required role in [${allowedRoles.join(", ")}], but user has ${req.user.roleCode}`,
      403
    );
  };
}
