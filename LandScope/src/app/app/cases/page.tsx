import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { CaseManagementDashboard } from "@/components/cases/case-management-dashboard";

export default async function CasesPage() {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    redirect("/login?redirect=/app/cases");
  }

  return (
    <AppShell
      user={ctx.user}
      role={ctx.role}
      currentSection="cases"
      breadcrumbs={[
        { label: "LANDScope", href: `/app/${ctx.role.slug}` },
        { label: "Case Management" },
      ]}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <CaseManagementDashboard />
      </div>
    </AppShell>
  );
}
