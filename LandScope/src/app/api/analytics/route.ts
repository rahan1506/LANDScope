import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { getAnalyticsForGeography } from "@/lib/analytics/analytics-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users rejected with 401
  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Land Governance Analytics." },
      { status: 401 }
    );
  }

  // 2. Permission check: role must have access to analytics or public view
  const hasAccess =
    hasPermission(ctx, "gis:public") ||
    hasPermission(ctx, "research:read") ||
    hasPermission(ctx, "policy:read") ||
    ctx.role.code === "ADMIN" ||
    ctx.role.allowedModules.includes("analytics") ||
    ctx.role.allowedModules.includes("land-intelligence");

  if (!hasAccess) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to inspect analytics data.`,
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state") || "Madhya Pradesh";
  const district = searchParams.get("district") || "Sehore";
  const tehsil = searchParams.get("tehsil") || "Ashta";
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : 2026;
  const mode = searchParams.get("mode");

  // Restricted governance audit mode requires operational / policymaker / admin rights
  if (mode === "restricted" || mode === "governance_audit") {
    const canAccessRestricted =
      hasPermission(ctx, "agency:operational") ||
      hasPermission(ctx, "policy:simulate") ||
      hasPermission(ctx, "admin:all") ||
      ctx.role.code === "ADMIN" ||
      ctx.role.code === "POLICYMAKER" ||
      ctx.role.code === "GOVERNMENT_AGENCY";

    if (!canAccessRestricted) {
      return NextResponse.json(
        {
          error: "FORBIDDEN",
          message: `Access Denied: Role '${ctx.role.title}' is not authorized to access restricted governance analytics.`,
          userRole: ctx.role.code,
        },
        { status: 403 }
      );
    }
  }

  const profile = getAnalyticsForGeography(state, district, tehsil, year);

  // If role is PUBLIC, filter out restricted operational signals (e.g. annual litigation plaints counts)
  if (ctx.role.code === "PUBLIC") {
    return NextResponse.json({
      success: true,
      userRole: ctx.role.code,
      profile: {
        ...profile,
        governance: {
          ...profile.governance,
          annualLitigationPlaints: 0, // Restricted from public view
          confidentialAuditFlag: false,
        },
      },
      isPublicRole: true,
    });
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    profile,
    isPublicRole: false,
  });
}
