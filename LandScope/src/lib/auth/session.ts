import { cookies } from "next/headers";
import crypto from "crypto";
import {
  UserAccount,
  RoleDefinition,
  RoleCode,
  RoleSlug,
  PermissionCode,
  ROLES,
  DEMO_USERS,
  ROLE_SLUG_TO_CODE,
} from "./rbac-data";

const SESSION_SECRET = process.env.SESSION_SECRET || "landscope-sih2026-secure-session-salt-98741";
export const SESSION_COOKIE_NAME = "landscope_session_token";

export interface SessionPayload {
  userId: string;
  email: string;
  roleCode: RoleCode;
  createdAt: number;
}

/**
 * Creates a signed cryptographic token for the user session.
 */
export function createSessionToken(user: UserAccount): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    roleCode: user.roleCode,
    createdAt: Date.now(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Validates the cryptographic token and returns the parsed payload.
 * Prevents tampering with user roles in browser cookies.
 */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSignature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  try {
    const bufA = Buffer.from(providedSignature);
    const bufB = Buffer.from(expectedSignature);
    if (bufA.length !== bufB.length) {
      return null;
    }
    if (!crypto.timingSafeEqual(bufA, bufB)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;

    // Optional expiration check (e.g. 7 days)
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.createdAt > sevenDaysMs) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export interface AuthenticatedContext {
  user: UserAccount;
  role: RoleDefinition;
  supabaseAccessToken?: string;
}

/**
 * Retrieves the currently authenticated user from server-side cookies.
 * Server-side source of truth.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = DEMO_USERS[payload.email];
  if (!user || user.status !== "ACTIVE") return null;

  // Retrieve role strictly from server-side database
  const role = ROLES[user.roleCode];
  if (!role) return null;

  const supabaseAccessToken = cookieStore.get("sb_access_token")?.value;

  return { user, role, supabaseAccessToken };
}

/**
 * Validates whether the user has a specific permission.
 */
export function hasPermission(
  ctx: AuthenticatedContext | null,
  permission: PermissionCode | "admin:all"
): boolean {
  if (!ctx) return false;
  if (ctx.role.code === "ADMIN") return true;
  return ctx.role.permissions.includes(permission as PermissionCode);
}

/**
 * Validates whether a user can access a specific role workspace route.
 * E.g. Researcher cannot access /app/policymaker.
 */
export function canAccessWorkspaceRoute(
  ctx: AuthenticatedContext | null,
  routeRoleSlug: string
): boolean {
  if (!ctx) return false;
  if (ctx.role.code === "ADMIN") return true;

  const targetRoleCode = ROLE_SLUG_TO_CODE[routeRoleSlug.toLowerCase()];
  if (!targetRoleCode) return false;

  return ctx.role.code === targetRoleCode;
}
