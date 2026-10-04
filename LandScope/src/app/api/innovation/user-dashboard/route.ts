import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot view private submissions/applications
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot view private dashboard" },
      { status: 403 }
    );
  }

  const dashboard = innovationStore.getUserDashboard({
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  return NextResponse.json({
    success: true,
    dashboard,
  });
}
