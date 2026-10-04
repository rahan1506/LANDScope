import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { collaborationStore } from "@/lib/collaboration/collaboration-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to reject invitation." },
      { status: 401 }
    );
  }

  const success = collaborationStore.rejectInvitation(id, ctx.user.email);
  if (!success) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Invitation '${id}' not found or does not belong to user '${ctx.user.email}'.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Invitation declined.",
  });
}
