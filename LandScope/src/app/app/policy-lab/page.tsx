import { redirect } from "next/navigation";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { AccessDenied } from "@/components/auth/access-denied";
import { PolicyLabPageClient } from "@/components/policy/policy-lab-page-client";

export default async function PolicyLabPage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access Policy Lab
  if (!ctx) {
    redirect("/login?redirect=/app/policy-lab");
  }

  // 2. Strict RBAC: Public users cannot access Policy Lab
  const isAuthorized = hasPermission(ctx, "policy:read") || ctx.role.code === "ADMIN";
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc]">
        <AccessDenied
          currentRoleTitle={ctx.role.title}
          currentRoleSlug={ctx.role.slug}
          requiredRoleTitle="Policy Digital Twin Lab"
          requiredPermission="policy:read"
        />
      </div>
    );
  }

  return <PolicyLabPageClient user={ctx.user} role={ctx.role} />;
}
