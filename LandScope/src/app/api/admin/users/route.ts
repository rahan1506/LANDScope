import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { DEMO_USERS } from "@/lib/auth/rbac-data";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "admin:manage_users")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Platform administration requires ADMIN role.`,
        requiredPermission: "admin:manage_users",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authorized: true,
    userRole: ctx.role.code,
    users: Object.values(DEMO_USERS),
  });
}
