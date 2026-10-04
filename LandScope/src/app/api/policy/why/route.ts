import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { POLICY_EXPLAINABILITY_TRAILS } from "@/lib/policy/policy-twin-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to inspect Policy Evidence Trail." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "policy:read") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'policy:read'.`,
        requiredPermission: "policy:read",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") || "why-agriculture";

  const trail = POLICY_EXPLAINABILITY_TRAILS[key];

  if (!trail) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Explainability trail for '${key}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    trail,
  });
}
