import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { LegalHarmonizerDashboard } from "@/components/legal/legal-harmonizer-dashboard";

export default async function LegalHarmonizerPage() {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    redirect("/login?redirect=/app/legal-harmonizer");
  }

  return (
    <AppShell
      user={ctx.user}
      role={ctx.role}
      currentSection="legal-harmonizer"
      breadcrumbs={[
        { label: "LANDScope", href: `/app/${ctx.role.slug}` },
        { label: "Policy & Legal Harmonizer" },
      ]}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <LegalHarmonizerDashboard />
      </div>
    </AppShell>
  );
}
