import { redirect } from "next/navigation";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { AccessDenied } from "@/components/auth/access-denied";
import { LandIntelligencePageClient } from "@/components/gis/land-intelligence-page-client";

export default async function LandIntelligencePage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access Land Intelligence
  if (!ctx) {
    redirect("/login?redirect=/app/land-intelligence");
  }

  // 2. Authorization check
  const isAuthorized = hasPermission(ctx, "gis:public") || ctx.role.code === "ADMIN";
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc]">
        <AccessDenied
          currentRoleTitle={ctx.role.title}
          currentRoleSlug={ctx.role.slug}
          requiredRoleTitle="Land Intelligence GIS"
          requiredPermission="gis:public"
        />
      </div>
    );
  }

  return <LandIntelligencePageClient user={ctx.user} role={ctx.role} />;
}
