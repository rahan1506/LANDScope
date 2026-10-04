import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Research Documents." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:read")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:read'.`,
        requiredPermission: "research:read",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authorized: true,
    userRole: ctx.role.code,
    documentsCount: 5,
    documents: [
      {
        id: "DOC-2025-089",
        title: "Tenure Insecurity and Agricultural Credit Accessibility in Central India",
        authorAgency: "NITI Aayog & NCAER",
        confidenceScore: 94,
        status: "PEER_REVIEWED",
      },
      {
        id: "DOC-2025-041",
        title: "Spatial Quantification of Eco-Sensitive Buffer Zone Encroachments",
        authorAgency: "Forest Survey of India",
        confidenceScore: 91,
        status: "PEER_REVIEWED",
      },
    ],
  });
}
