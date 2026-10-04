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
      { error: "UNAUTHORIZED", message: "Authentication required to add evidence." },
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

  // Access check
  if (!collaborationStore.canUserAccessProject(project, ctx.user.email, ctx.role.code)) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: You are not an authorized member of this project." },
      { status: 403 }
    );
  }

  // VIEWER check
  const { projectRole } = collaborationStore.getUserRoleInProject(project, ctx.user.email, ctx.role.code);
  if (projectRole === "VIEWER") {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot add evidence to this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { title, authorOrOrg, year, evidenceId, notes, confidence, evidenceType } = body;

    if (!title) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Evidence title is required." },
        { status: 400 }
      );
    }

    const added = collaborationStore.addEvidence(
      id,
      {
        evidenceId: evidenceId || `ev-${Date.now().toString(36)}`,
        title,
        authorOrOrg: authorOrOrg || "Academic / Policy Research Consortium",
        year: year || 2026,
        confidence: confidence || 90,
        evidenceType: evidenceType || "Research Paper",
        addedBy: ctx.user.name,
        addedByEmail: ctx.user.email,
        notes: notes || "Shared cross-module empirical evidence.",
      },
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      }
    );

    return NextResponse.json(
      {
        success: true,
        evidence: added,
        message: `Evidence '${title}' successfully added to project.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid evidence payload." },
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
      { error: "UNAUTHORIZED", message: "Authentication required to remove evidence." },
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
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot remove evidence from this project." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const evidenceId = searchParams.get("evidenceId");

  if (!evidenceId) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "evidenceId parameter is required." },
      { status: 400 }
    );
  }

  const removed = collaborationStore.removeEvidence(id, evidenceId, {
    name: ctx.user.name,
    email: ctx.user.email,
    roleCode: ctx.role.code,
  });

  if (!removed) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Evidence '${evidenceId}' not found in project.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Evidence successfully removed from project.",
  });
}
