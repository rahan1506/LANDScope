import { redirect } from "next/navigation";
import { getAuthenticatedUser, canAccessWorkspaceRoute } from "@/lib/auth/session";
import { ROLES, ROLE_SLUG_TO_CODE } from "@/lib/auth/rbac-data";
import { AccessDenied } from "@/components/auth/access-denied";
import { RoleWorkspaceClient } from "@/components/workspace/role-workspace-client";

interface PageProps {
  params: Promise<{ role: string }>;
}

export default async function RoleWorkspacePage({ params }: PageProps) {
  const resolvedParams = await params;
  const ctx = await getAuthenticatedUser();

  // 1. If not authenticated, redirect to login
  if (!ctx) {
    redirect(`/login?redirect=/app/${resolvedParams.role}`);
  }

  const targetRoleSlug = resolvedParams.role.toLowerCase();
  const targetRoleCode = ROLE_SLUG_TO_CODE[targetRoleSlug];
  const targetRoleDefinition = targetRoleCode ? ROLES[targetRoleCode] : null;

  // 2. Strict Server-Side Authorization Check
  const isAuthorized = canAccessWorkspaceRoute(ctx, targetRoleSlug);

  if (!isAuthorized) {
    // Renders real Access Denied page without exposing any data
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc]">
        <AccessDenied
          currentRoleTitle={ctx.role.title}
          currentRoleSlug={ctx.role.slug}
          requiredRoleTitle={targetRoleDefinition?.workspaceTitle || `${targetRoleSlug} Workspace`}
          requiredPermission={
            targetRoleCode
              ? `${targetRoleCode}:authorized_access`
              : "Role-Specific Authorization"
          }
        />
      </div>
    );
  }

  // 3. Authorized: Render role-specific workspace
  return <RoleWorkspaceClient user={ctx.user} role={ctx.role} />;
}
