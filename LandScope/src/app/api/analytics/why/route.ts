import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { ANALYTICS_WHY_TRAILS } from "@/lib/analytics/analytics-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to inspect Analytics Evidence Trails." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") || "why-agri-conversion";

  const trail = ANALYTICS_WHY_TRAILS[key];

  if (!trail) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Analytics evidence trail for '${key}' not found.` },
      { status: 404 }
    );
  }

  // Restricted evidence trails cannot be accessed by PUBLIC role
  if (trail.isRestricted && ctx.role.code === "PUBLIC") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Evidence trail '${key}' contains confidential administrative data and cannot be viewed by the Public role.`,
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    trail,
  });
}
