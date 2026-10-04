import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AccessDenied } from "@/components/auth/access-denied";
import { researchStore } from "@/lib/research/research-data";
import { ResearchProjectWorkspaceClient } from "@/components/researcher/research-project-workspace-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ResearchProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access researcher project workspace
  if (!ctx) {
    redirect(`/login?redirect=/app/researcher/projects/${resolvedParams.projectId}`);
  }

  // 2. Strict RBAC: Policymaker and Public cannot access researcher-private project data
  const allowedRoles = ["RESEARCHER", "ACADEMIC_INSTITUTION", "ADMIN"];
  if (!allowedRoles.includes(ctx.role.code)) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc]">
        <AccessDenied
          currentRoleTitle={ctx.role.title}
          currentRoleSlug={ctx.role.slug}
          requiredRoleTitle="Researcher Private Project Workspace"
          requiredPermission="research:write (Restricted Project Data)"
        />
      </div>
    );
  }

  // 3. Fetch project from Supabase PostgreSQL (or fallback to store)
  const { getAuthenticatedSupabaseClient } = await import("@/lib/supabase/client");
  const { getPersistedResearchProjectById } = await import("@/lib/supabase/research-service");
  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const project =
    (await getPersistedResearchProjectById(supabaseClient, resolvedParams.projectId)) ||
    researchStore.getProjectById(resolvedParams.projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel-primary border border-[rgba(59, 130, 246,0.2)] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <h2 className="text-base font-bold text-[#f8fafc] tracking-tight">Project Not Found</h2>
          <p className="text-xs text-[#94a3b8]">
            The research project dossier &apos;{resolvedParams.projectId}&apos; does not exist or has been archived.
          </p>
          <Link
            href="/app/researcher"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#10274e] text-[#93c5fd] border border-[#3b82f6]/30 rounded-xl hover:bg-[#19386c] transition-all shadow-[0_0_15px_rgba(59, 130, 246,0.15)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Research Intelligence</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResearchProjectWorkspaceClient
      user={ctx.user}
      role={ctx.role}
      project={project}
    />
  );
}
