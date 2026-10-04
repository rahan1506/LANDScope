import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  const result = innovationStore.submitApplication(id, {
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Proposal locked and formally submitted for review",
    application: result.application,
  });
}
