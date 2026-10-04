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
      { error: "UNAUTHORIZED", message: "Authentication required to post comments." },
      { status: 401 }
    );
  }

  const project = collaborationStore.getProjectById(id);
  if (!project) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Collaborative project '${id}' not found.` },
      { status: 404 }
    );
  }

  if (!collaborationStore.canUserAccessProject(project, ctx.user.email, ctx.role.code)) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: You are not an authorized member of this project." },
      { status: 403 }
    );
  }

  const { projectRole } = collaborationStore.getUserRoleInProject(project, ctx.user.email, ctx.role.code);
  if (projectRole === "VIEWER") {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot post comments to this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { content, parentId } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Comment content cannot be empty." },
        { status: 400 }
      );
    }

    const comment = collaborationStore.addComment(
      id,
      content.trim(),
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      },
      parentId
    );

    return NextResponse.json(
      {
        success: true,
        comment,
        message: "Comment posted successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid comment payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to delete comments." },
      { status: 401 }
    );
  }

  const project = collaborationStore.getProjectById(id);
  if (!project) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Collaborative project '${id}' not found.` },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "commentId parameter is required." },
      { status: 400 }
    );
  }

  const deleted = collaborationStore.deleteComment(id, commentId, ctx.user.email, ctx.role.code);

  if (!deleted) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: You can only delete your own comments, or you must be project owner." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Comment successfully deleted.",
  });
}
