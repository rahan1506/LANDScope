import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot view private submissions
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot view private applications" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");

  if (challengeId) {
    const applications = innovationStore.getApplicationsForChallenge(challengeId, {
      id: auth.user.id,
      email: auth.user.email,
      roleCode: auth.role.code,
    });
    return NextResponse.json({ success: true, applications });
  }

  // Returns all user's applications
  const myApplications = innovationStore.getUserApplications(auth.user.email);

  return NextResponse.json({
    success: true,
    applications: myApplications,
    count: myApplications.length,
  });
}
