import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { EvidenceDossierDashboard } from "@/components/evidence/evidence-dossier-dashboard";

export default async function EvidenceDossierPage() {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    redirect("/login?redirect=/app/evidence-dossier");
  }

  return (
    <AppShell
      user={ctx.user}
      role={ctx.role}
      currentSection="evidence-dossier"
      breadcrumbs={[
        { label: "LANDScope", href: `/app/${ctx.role.slug}` },
        { label: "Evidence Dossier Generator" },
      ]}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <EvidenceDossierDashboard />
      </div>
    </AppShell>
  );
}
