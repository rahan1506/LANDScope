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
      { error: "UNAUTHORIZED", message: "Authentication required to associate reports." },
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
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot associate reports with this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "reportId is required." },
        { status: 400 }
      );
    }

    const linked = collaborationStore.associateReport(
      id,
      reportId,
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      }
    );

    return NextResponse.json({
      success: true,
      linked,
      reportId,
      message: `Report brief '${reportId}' successfully linked to project.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid report association payload." },
      { status: 400 }
    );
  }
}
