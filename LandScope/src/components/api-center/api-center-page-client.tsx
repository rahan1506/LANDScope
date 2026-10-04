"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ApiCenterView } from "@/components/api-center/api-center-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";

export interface ApiCenterPageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function ApiCenterPageClient({ user, role }: ApiCenterPageClientProps) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

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
          currentSection="overview"
          onSelectSection={(sec) => router.push(`/app/${role.slug}?section=${sec}`)}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712]">
          <ApiCenterView userRole={role.code} userEmail={user.email} />
        </main>
      </div>
    </div>
  );
}
