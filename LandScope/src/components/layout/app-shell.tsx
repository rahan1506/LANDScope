"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar, NavSection } from "@/components/layout/sidebar";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { SearchBar } from "@/components/ui/search-bar";
import { NotificationPanel, NotificationItem } from "@/components/ui/notification-panel";
import { LandIntelligenceCanvas } from "@/components/canvas/land-intelligence-canvas";

export interface AppShellProps {
  user: UserAccount;
  role: RoleDefinition;
  currentSection: NavSection;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

export function AppShell({
  user,
  role,
  currentSection,
  breadcrumbs,
  children,
}: AppShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "alert",
      title: "Eco-Buffer Anomaly Detected (Sehore District)",
      message: "42 cadastral plots flagged overlapping the 750m Ratapani Sanctuary buffer zone.",
      timestamp: "12m ago",
      stateOrAgency: "Forest Survey Node",
      priority: "urgent",
      isRead: false,
    },
    {
      id: "n-2",
      type: "sync",
      title: "SVAMITVA Drone Cadastre Batch Sync Complete",
      message: "18,400 rural Abadi parcels updated with RTK-GPS centimeter precision.",
      timestamp: "1h ago",
      stateOrAgency: "Survey of India",
      isRead: false,
    },
  ]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
    router.refresh();
  };

  const handleSelectSection = (section: NavSection) => {
    switch (section) {
      case "overview":
        router.push(`/app/${role.slug}`);
        break;
      case "research-evidence":
        router.push(`/app/${role.slug}?section=research-evidence`);
        break;
      case "land-intelligence":
        router.push("/app/land-intelligence");
        break;
      case "sentinel":
        router.push("/app/sentinel");
        break;
      case "legal-harmonizer":
        router.push("/app/legal-harmonizer");
        break;
      case "evidence-dossier":
        router.push("/app/evidence-dossier");
        break;
      case "bhu-mitra":
        router.push("/app/bhu-mitra");
        break;
      case "cases":
        router.push("/app/cases");
        break;
      case "policy-lab":
        router.push("/app/policy-lab");
        break;
      case "analytics":
        router.push("/app/analytics");
        break;
      case "collaboration":
        router.push("/app/collaboration");
        break;
      case "innovation-hub":
        router.push("/app/innovation");
        break;
      case "reports":
        router.push("/app/reports");
        break;
      case "api-center":
        router.push("/app/api");
        break;
      default:
        router.push(`/app/${role.slug}?section=${section}`);
        break;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#030712] text-[#f8fafc] relative selection:bg-[#10274e] selection:text-[#93c5fd] ${
        isHighContrast ? "high-contrast" : ""
      }`}
      style={{
        fontSize: fontSizeDelta !== 0 ? `${100 + fontSizeDelta * 6}%` : undefined,
      }}
    >
      {/* Persistent Subtle 3D WebGL Terrain & Particle Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <LandIntelligenceCanvas intensity="subtle" showCoordinates={false} />
      </div>

      {/* 1. National Banner */}
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={(delta: number) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      {/* 2. Unified Header */}
      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        breadcrumbs={breadcrumbs || [{ label: "LANDScope" }, { label: role.workspaceTitle }]}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onToggleNotifications={() => setNotificationsOpen((prev) => !prev)}
        unreadCount={notifications.length}
      />

      {/* 3. Main Workspace: Fixed Sidebar + Centered Content Container */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={handleSelectSection}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          user={{
            name: user.name,
            roleTitle: role.title,
            roleCode: role.code,
            organization: user.organization,
            email: user.email,
          }}
          onLogout={handleLogout}
        />

        {/* Standard Page Container: max-w-[1440px], translucent dark backdrop */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 bg-transparent">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>

        {/* Global Notifications Drawer / Panel */}
        {notificationsOpen && (
          <div className="absolute right-4 top-2 z-50 w-96 shadow-2xl">
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={() => {}}
              onClearAll={() => {}}
            />
          </div>
        )}
      </div>

      {/* Quick Search Modal */}
      <ModalDialog
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Quick Search & Navigation"
        subtitle="Search across authorized datasets, khasra parcels, evidence, and spatial layers"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <SearchBar
            placeholder="Search cadastral parcels, khasra numbers, policy drafts, evidence..."
            value={searchQuery}
            onChange={setSearchQuery}
            showShortcut={false}
          />
        </div>
      </ModalDialog>
    </div>
  );
}
