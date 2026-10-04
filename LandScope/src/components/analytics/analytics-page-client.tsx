"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalyticsWorkstationView } from "@/components/analytics/analytics-workstation-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";

export interface AnalyticsPageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function AnalyticsPageClient({ user, role }: AnalyticsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read geographic / timeline context passed from GIS, Research, Policy Lab, or Reports
  const stateFromUrl = searchParams.get("state") || undefined;
  const districtFromUrl = searchParams.get("district") || undefined;
  const tehsilFromUrl = searchParams.get("tehsil") || undefined;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

  const handleNavigateToGis = (geo: { state: string; district: string; tehsil: string }) => {
    router.push(
      `/app/land-intelligence?state=${encodeURIComponent(geo.state)}&district=${encodeURIComponent(
        geo.district
      )}&tehsil=${encodeURIComponent(geo.tehsil)}`
    );
  };

  const handleNavigateToResearch = (ctx?: { state: string; district: string; tehsil: string; topic?: string }) => {
    const s = ctx?.state || stateFromUrl || "Madhya Pradesh";
    const d = ctx?.district || districtFromUrl || "Sehore";
    const t = ctx?.tehsil || tehsilFromUrl || "Ashta";
    router.push(
      `/app/${role.slug}?section=research-evidence&state=${encodeURIComponent(
        s
      )}&district=${encodeURIComponent(d)}&tehsil=${encodeURIComponent(t)}${
        ctx?.topic ? `&topic=${encodeURIComponent(ctx.topic)}` : ""
      }`
    );
  };

  const handleNavigateToReports = (ctx?: Record<string, unknown>) => {
    const s = (ctx?.state as string) || stateFromUrl || "Madhya Pradesh";
    const d = (ctx?.district as string) || districtFromUrl || "Sehore";
    const t = (ctx?.tehsil as string) || tehsilFromUrl || "Ashta";
    router.push(
      `/app/reports?state=${encodeURIComponent(s)}&district=${encodeURIComponent(
        d
      )}&tehsil=${encodeURIComponent(t)}&source=analytics`
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#030712] text-[#f8fafc] ${
        isHighContrast ? "high-contrast" : ""
      }`}
      style={{
        fontSize: fontSizeDelta !== 0 ? `${100 + fontSizeDelta * 6}%` : undefined,
      }}
    >
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={(delta: number) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      <Header
        userRoleTitle={role.title}
        userName={user.name}
        userEmail={user.email}
        organization={user.organization}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentSection="analytics"
          onSelectSection={(sec) => router.push(`/app/${role.slug}?section=${sec}`)}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712]">
          <AnalyticsWorkstationView
            initialState={stateFromUrl}
            initialDistrict={districtFromUrl}
            initialTehsil={tehsilFromUrl}
            userRole={role.code}
            onNavigateToGis={handleNavigateToGis}
            onNavigateToResearch={handleNavigateToResearch}
            onNavigateToReports={handleNavigateToReports}
          />
        </main>
      </div>
    </div>
  );
}
