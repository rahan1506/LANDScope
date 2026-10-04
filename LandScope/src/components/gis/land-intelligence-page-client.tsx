"use client";

import React, { useState } from "react";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar, NavSection } from "@/components/layout/sidebar";
import { GisWorkstationView } from "./gis-workstation-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import { SelectedGeography } from "@/lib/gis/selected-geography";
import { useRouter } from "next/navigation";

interface LandIntelligencePageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

interface GeoContext {
  state: string;
  district: string;
  tehsil?: string;
  [key: string]: unknown;
}

export function LandIntelligencePageClient({ user, role }: LandIntelligencePageClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

  const handleNavigateToPolicyLab = (geoCtx?: GeoContext | SelectedGeography) => {
    const params = new URLSearchParams();
    params.set("section", "policy-lab");
    if (geoCtx?.state) params.set("state", geoCtx.state);
    if (geoCtx?.district) params.set("district", geoCtx.district);
    if (geoCtx?.tehsil) params.set("tehsil", geoCtx.tehsil);
    router.push(`/app/${role.slug}?${params.toString()}`);
  };

  const handleNavigateToReports = (geoCtx?: GeoContext | SelectedGeography) => {
    const params = new URLSearchParams();
    params.set("section", "reports");
    if (geoCtx?.state) params.set("state", geoCtx.state);
    if (geoCtx?.district) params.set("district", geoCtx.district);
    if (geoCtx?.tehsil) params.set("tehsil", geoCtx.tehsil);
    params.set("source", "GIS");
    router.push(`/app/${role.slug}?${params.toString()}`);
  };

  const handleNavigateToAnalytics = (geoCtx?: SelectedGeography) => {
    const params = new URLSearchParams();
    params.set("section", "analytics");
    if (geoCtx?.state) params.set("state", geoCtx.state);
    if (geoCtx?.district) params.set("district", geoCtx.district);
    if (geoCtx?.tehsil) params.set("tehsil", geoCtx.tehsil);
    router.push(`/app/${role.slug}?${params.toString()}`);
  };

  const handleNavigateToResearch = (geoCtx?: SelectedGeography) => {
    const params = new URLSearchParams();
    params.set("section", "research-evidence");
    if (geoCtx?.state) params.set("state", geoCtx.state);
    if (geoCtx?.district) params.set("district", geoCtx.district);
    if (geoCtx?.tehsil) params.set("tehsil", geoCtx.tehsil);
    params.set("source", "GIS");
    router.push(`/app/${role.slug}?${params.toString()}`);
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
        onFontSizeChange={(delta) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        unreadCount={0}
      />

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto relative overflow-hidden">
        <Sidebar
          currentSection="land-intelligence"
          onSelectSection={(sec) => {
            if (sec !== "land-intelligence") {
              router.push(`/app/${role.slug}?section=${sec}`);
            }
          }}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          <GisWorkstationView
            userRole={role.code}
            onNavigateToPolicyLab={handleNavigateToPolicyLab}
            onNavigateToReports={handleNavigateToReports}
            onNavigateToResearch={handleNavigateToResearch}
            onNavigateToAnalytics={handleNavigateToAnalytics}
          />
        </main>
      </div>

      <footer className="w-full bg-[#060e1a] text-[#8ea79e] border-t border-[#19386c]/30 py-3 text-xs font-sans">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
          <div>
            <strong className="text-[#f8fafc] font-mono">LANDScope</strong> — SIH 2026 Demonstration Environment • Session: {user.email}
          </div>
          <div className="text-[#678278]">
            Role: <span className="text-[#3b82f6] font-bold">{role.title}</span> • All rights & modules enforced by server RBAC.
          </div>
        </div>
      </footer>
    </div>
  );
}
