import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { collaborationStore } from "@/lib/collaboration/collaboration-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access project details." },
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

  // Strict server-side authorization check:
  // Non-members & uninvited users cannot access private projects!
  const hasAccess = collaborationStore.canUserAccessProject(project, ctx.user.email, ctx.role.code);
  if (!hasAccess) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: User '${ctx.user.email}' (${ctx.role.title}) is not an authorized member of project '${project.title}'.`,
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const { projectRole, permission } = collaborationStore.getUserRoleInProject(project, ctx.user.email, ctx.role.code);

  return NextResponse.json({
    success: true,
    project,
    userRole: ctx.role.code,
    userProjectRole: projectRole,
    userPermission: permission,
  });
}
