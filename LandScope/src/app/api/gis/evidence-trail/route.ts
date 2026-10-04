import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { EVIDENCE_TRAILS } from "@/lib/gis/gis-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Evidence Trail." },
      { status: 401 }
    );
  }

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
  const id = searchParams.get("id") || "urban-expansion-ashta";

  const trail = EVIDENCE_TRAILS[id];

  if (!trail) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Evidence trail for '${id}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    trail,
  });
}
