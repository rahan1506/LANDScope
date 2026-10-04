import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { challengeId } = await request.json();
    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: "Missing challengeId" },
        { status: 400 }
      );
    }

    const isSaved = innovationStore.toggleSaveChallenge(challengeId, auth.user.id);

    return NextResponse.json({
      success: true,
      isSaved,
      message: isSaved ? "Challenge bookmarked" : "Challenge removed from bookmarks",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}
