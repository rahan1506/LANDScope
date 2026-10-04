import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { BhuMitraDashboard } from "@/components/bhu-mitra/bhu-mitra-dashboard";

export default async function BhuMitraPage() {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    redirect("/login?redirect=/app/bhu-mitra");
  }

  return (
    <AppShell
      user={ctx.user}
      role={ctx.role}
      currentSection="bhu-mitra"
      breadcrumbs={[
        { label: "LANDScope", href: `/app/${ctx.role.slug}` },
        { label: "Bhu-Mitra Field Verification" },
      ]}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <BhuMitraDashboard />
      </div>
    </AppShell>
  );
}
