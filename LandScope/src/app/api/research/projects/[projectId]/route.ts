import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import { getPersistedResearchProjectById } from "@/lib/supabase/research-service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Research Project details." },
      { status: 401 }
    );
  }

  // Acceptance Test 8: Policymaker cannot access researcher-private project data
  // Only RESEARCHER, ACADEMIC_INSTITUTION, and ADMIN are permitted to inspect researcher project workspaces.
  const allowedRoles = ["RESEARCHER", "ACADEMIC_INSTITUTION", "ADMIN"];
  if (!allowedRoles.includes(ctx.role.code)) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to access private researcher project data.`,
        requiredRole: "RESEARCHER",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const project = (await getPersistedResearchProjectById(supabaseClient, projectId)) || researchStore.getProjectById(projectId);

  if (!project) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Research project '${projectId}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    project,
  });
}
