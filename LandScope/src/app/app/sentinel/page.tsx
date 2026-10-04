import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { SentinelDashboard } from "@/components/sentinel/sentinel-dashboard";

export default async function SentinelPage() {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    redirect("/login?redirect=/app/sentinel");
  }

  return (
    <AppShell
      user={ctx.user}
      role={ctx.role}
      currentSection="sentinel"
      breadcrumbs={[
        { label: "LANDScope", href: `/app/${ctx.role.slug}` },
        { label: "Mutation & Encroachment Sentinel" },
      ]}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <SentinelDashboard />
      </div>
    </AppShell>
  );
}
