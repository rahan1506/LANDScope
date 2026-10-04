import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import {
  getIntelligenceForGeography,
  getRelatedEvidenceForGeography,
  getAvailableLayersForRole,
} from "@/lib/gis/gis-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users rejected with 401
  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Land Intelligence GIS." },
      { status: 401 }
    );
  }

  // 2. Permission check: must have at least 'gis:public'
  if (!hasPermission(ctx, "gis:public") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'gis:public'.`,
        requiredPermission: "gis:public",
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

  // Retrieve intelligence profile for selected geography & year
  const intelligence = getIntelligenceForGeography(state, district, tehsil, year);

  // Retrieve related evidence for selected geography
  const relatedEvidence = getRelatedEvidenceForGeography(state, district);

  // Retrieve allowed layers based on user role (Public role has restricted layers filtered out)
  const availableLayers = getAvailableLayersForRole(ctx.role.code);

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    year,
    intelligence,
    relatedEvidence,
    availableLayers,
    isRestrictedRole: ctx.role.code === "PUBLIC",
  });
}
