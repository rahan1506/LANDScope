import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Agency Tasks." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "agency:operational")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Operational agency tasks require GOVERNMENT_AGENCY or ADMIN credentials.`,
        requiredPermission: "agency:operational",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authorized: true,
    userRole: ctx.role.code,
    tasksCount: 4,
    tasks: [
      {
        id: "TSK-2026-904",
        title: "Cadastral Boundary Reconciliation: Khasra 402/A Eco-Buffer",
        status: "IN_PROGRESS",
      },
      {
        id: "TSK-2026-891",
        title: "Ground-Truth Verification of SVAMITVA Drone Ortho-Mosaic",
        status: "REVIEW_PENDING",
      },
    ],
  });
}
