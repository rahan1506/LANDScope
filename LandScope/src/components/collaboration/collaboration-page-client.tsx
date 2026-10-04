"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CollaborationWorkspaceView } from "@/components/collaboration/collaboration-workspace-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";

export interface CollaborationPageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function CollaborationPageClient({ user, role }: CollaborationPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId") || undefined;

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

  const handleNavigateToPolicyLab = (geo?: { state: string; district: string; tehsil: string }) => {
    const s = geo?.state || "Madhya Pradesh";
    const d = geo?.district || "Sehore";
    const t = geo?.tehsil || "Ashta";
    router.push(
      `/app/policy-lab?state=${encodeURIComponent(s)}&district=${encodeURIComponent(
        d
      )}&tehsil=${encodeURIComponent(t)}`
    );
  };

  const handleNavigateToResearch = (topic?: string) => {
    router.push(
      `/app/${role.slug}?section=research-evidence${topic ? `&topic=${encodeURIComponent(topic)}` : ""}`
    );
  };

  const handleNavigateToReports = (reportId?: string) => {
    router.push(`/app/reports${reportId ? `?reportId=${encodeURIComponent(reportId)}` : ""}`);
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
          currentSection="collaboration"
          onSelectSection={(sec) => router.push(`/app/${role.slug}?section=${sec}`)}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712]">
          <CollaborationWorkspaceView
            userRole={role.code}
            initialProjectId={projectIdFromUrl}
            onNavigateToGis={handleNavigateToGis}
            onNavigateToPolicyLab={handleNavigateToPolicyLab}
            onNavigateToResearch={handleNavigateToResearch}
            onNavigateToReports={handleNavigateToReports}
          />
        </main>
      </div>
    </div>
  );
}
