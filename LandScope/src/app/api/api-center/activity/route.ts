import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot view audit activity
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot view system audit logs" },
      { status: 403 }
    );
  }

  const logs = apiCenterStore.getActivityLogs();

  return NextResponse.json({
    success: true,
    count: logs.length,
    logs,
  });
}
