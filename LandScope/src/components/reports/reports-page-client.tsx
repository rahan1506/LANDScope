"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ReportsWorkspaceView } from "@/components/reports/reports-workspace-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";

export interface ReportsPageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function ReportsPageClient({ user, role }: ReportsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read geographic / simulation context passed from Policy Lab
  const stateFromUrl = searchParams.get("state") || undefined;
  const districtFromUrl = searchParams.get("district") || undefined;
  const tehsilFromUrl = searchParams.get("tehsil") || undefined;
  const scenarioTitleFromUrl = searchParams.get("scenarioTitle") || undefined;

  const initialContext = districtFromUrl
    ? {
        state: stateFromUrl || "Madhya Pradesh",
        district: districtFromUrl,
        tehsil: tehsilFromUrl || "Ashta",
        scenarioTitle: scenarioTitleFromUrl || "Controlled Peri-Urban Expansion 2031",
      }
    : null;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

  const handleNavigateToResearch = (ref?: string) => {
    router.push(`/app/${role.slug}?section=research-evidence${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`);
  };

  const handleNavigateToPolicyLab = (geoCtx?: { state: string; district: string; tehsil: string }) => {
    const s = geoCtx?.state || stateFromUrl || "Madhya Pradesh";
    const d = geoCtx?.district || districtFromUrl || "Sehore";
    const t = geoCtx?.tehsil || tehsilFromUrl || "Ashta";
    router.push(`/app/policy-lab?state=${encodeURIComponent(s)}&district=${encodeURIComponent(d)}&tehsil=${encodeURIComponent(t)}`);
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
          currentSection="reports"
          onSelectSection={(sec) => router.push(`/app/${role.slug}?section=${sec}`)}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712]">
          <ReportsWorkspaceView
            userRole={role.code}
            initialContext={initialContext}
            onNavigateToResearch={handleNavigateToResearch}
            onNavigateToPolicyLab={handleNavigateToPolicyLab}
          />
        </main>
      </div>
    </div>
  );
}
