import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import {
  linkEvidenceToPersistedProject,
  getPersistedResearchProjectById,
} from "@/lib/supabase/research-service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to modify research projects." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:write")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:write'.`,
        requiredPermission: "research:write",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { evidenceId } = body;

    if (!evidenceId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "evidenceId is required." },
        { status: 400 }
      );
    }

    // 1. Try Supabase persistence
    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    try {
      await linkEvidenceToPersistedProject(supabaseClient, projectId, evidenceId);
    } catch (dbErr) {
      console.warn("Supabase project_evidence_links notice:", dbErr);
    }

    // 2. Also update in-memory store for instant reactivity and demo projects
    researchStore.addEvidenceToProject(projectId, evidenceId, ctx.user.email);

    const updatedProject =
      (await getPersistedResearchProjectById(supabaseClient, projectId)) ||
      researchStore.getProjectById(projectId);

    return NextResponse.json({
      success: true,
      message: `Evidence '${evidenceId}' successfully linked to project '${projectId}'.`,
      project: updatedProject,
    });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to link evidence to project." },
      { status: 500 }
    );
  }
}
