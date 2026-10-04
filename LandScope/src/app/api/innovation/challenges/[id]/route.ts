import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getAuthenticatedUser();
  const userRole = auth?.role.code;

  const challenge = innovationStore.getChallengeById(id, userRole);
  if (!challenge) {
    // Check if challenge exists but is private/draft
    const anyChallenge = (innovationStore as unknown as { challenges: { id: string; visibility: string }[] })
      .challenges?.find((c) => c.id === id);

    if (anyChallenge && anyChallenge.visibility !== "Published") {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not have permission to view this challenge draft" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Challenge not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    challenge,
  });
}

export async function PATCH(
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

  try {
    const updates = await request.json();
    const updated = innovationStore.updateChallenge(id, updates, {
      id: auth.user.id,
      email: auth.user.email,
      roleCode: auth.role.code,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to edit this challenge" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Challenge updated successfully",
      challenge: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update challenge" },
      { status: 500 }
    );
  }
}
