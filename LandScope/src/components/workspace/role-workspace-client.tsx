"use client";

import React, { useState } from "react";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar, NavSection } from "@/components/layout/sidebar";
import { OverviewView } from "@/components/views/overview-view";
import { LandIntelligenceView } from "@/components/views/land-intelligence-view";
import { ResearchEvidenceView } from "@/components/views/research-evidence-view";
import { PolicyLabView } from "@/components/views/policy-lab-view";
import { AnalyticsView } from "@/components/views/analytics-view";
import { ReportsView } from "@/components/views/reports-view";
import { ReportsWorkspaceView } from "@/components/reports/reports-workspace-view";
import { CollaborationWorkspaceView } from "@/components/collaboration/collaboration-workspace-view";
import { InnovationHubView } from "@/components/innovation/innovation-hub-view";
import { DesignSystemShowcaseView } from "@/components/views/design-system-showcase-view";
import { ResearcherWorkspaceView } from "@/components/researcher/researcher-workspace-view";
import { GisWorkstationView } from "@/components/gis/gis-workstation-view";
import { PolicyLabWorkspaceView } from "@/components/policy/policy-lab-workspace-view";
import { AnalyticsWorkstationView } from "@/components/analytics/analytics-workstation-view";
import { LandIntelligenceCanvas } from "@/components/canvas/land-intelligence-canvas";
import { SpatialContext } from "@/lib/research/research-data";
import { SentinelDashboard } from "@/components/sentinel/sentinel-dashboard";
import { LegalHarmonizerDashboard } from "@/components/legal/legal-harmonizer-dashboard";
import { EvidenceDossierDashboard } from "@/components/evidence/evidence-dossier-dashboard";
import { BhuMitraDashboard } from "@/components/bhu-mitra/bhu-mitra-dashboard";
import { CaseManagementDashboard } from "@/components/cases/case-management-dashboard";
import { NotificationPanel, NotificationItem } from "@/components/ui/notification-panel";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import {
  ShieldCheck,
  Plus,
  Play,
  FileCheck2,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";

interface RoleWorkspaceClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function RoleWorkspaceClient({ user, role }: RoleWorkspaceClientProps) {
  // Determine default initial section based on role
  const getInitialSection = (): NavSection => {
    switch (role.code) {
      case "POLICYMAKER":
        return "policy-lab";
      case "RESEARCHER":
        return "research-evidence";
      case "ACADEMIC_INSTITUTION":
        return "collaboration";
      case "GOVERNMENT_AGENCY":
        return "collaboration";
      case "INNOVATOR":
        return "innovation-hub";
      case "PUBLIC":
        return "overview";
      case "ADMIN":
      default:
        return "overview";
    }
  };

  const [currentSection, setCurrentSection] = useState<NavSection>(getInitialSection());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gisSpatialContext, setGisSpatialContext] = useState<SpatialContext | null>(null);
  const [policyReportContext, setPolicyReportContext] = useState<Record<string, unknown> | null>(null);

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

  const handleFontSizeChange = (delta: number) => {
    if (delta === 0) setFontSizeDelta(0);
    else setFontSizeDelta((prev) => Math.max(-2, Math.min(3, prev + delta)));
  };

  const handlePrimaryAction = () => {
    switch (role.code) {
      case "POLICYMAKER":
        setCurrentSection("policy-lab");
        break;
      case "RESEARCHER":
        setCurrentSection("research-evidence");
        break;
      case "ACADEMIC_INSTITUTION":
        setCurrentSection("collaboration");
        break;
      case "GOVERNMENT_AGENCY":
        setCurrentSection("collaboration");
        break;
      case "INNOVATOR":
        setCurrentSection("innovation-hub");
        break;
      case "PUBLIC":
        setCurrentSection("land-intelligence");
        break;
      default:
        setCurrentSection("overview");
        break;
    }
  };

  const renderActiveView = () => {
    switch (currentSection) {
      case "overview":
        return <OverviewView onNavigateToModule={(mod) => setCurrentSection(mod as NavSection)} />;
      case "land-intelligence":
        return (
          <GisWorkstationView
            initialState={gisSpatialContext?.state}
            initialDistrict={gisSpatialContext?.district}
            initialTehsil={gisSpatialContext?.tehsil}
            userRole={role.code}
            onNavigateToPolicyLab={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("policy-lab");
            }}
            onNavigateToReports={(geo) => {
              if (geo) {
                setPolicyReportContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                  source: "GIS",
                });
              }
              setCurrentSection("reports");
            }}
            onNavigateToAnalytics={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state || "Madhya Pradesh",
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("analytics");
            }}
            onNavigateToResearch={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state || "Madhya Pradesh",
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("research-evidence");
            }}
          />
        );
      case "research-evidence":
        if (role.code === "RESEARCHER") {
          return (
            <ResearcherWorkspaceView
              initialSpatialContext={gisSpatialContext}
              onNavigateToGis={(ctx) => {
                if (ctx) setGisSpatialContext(ctx);
                setCurrentSection("land-intelligence");
              }}
            />
          );
        }
        return <ResearchEvidenceView />;
      case "policy-lab":
        // Double-check permission in rendering
        if (!role.permissions.includes("policy:read") && role.code !== "ADMIN") {
          return (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-sm">
              <Lock className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h2 className="text-base font-bold text-slate-800">Module Restricted</h2>
              <p className="text-xs text-slate-500">
                Policy Lab simulations are restricted to Policymaker and Government Agency roles.
              </p>
            </div>
          );
        }
        return (
          <PolicyLabWorkspaceView
            initialState={gisSpatialContext?.state}
            initialDistrict={gisSpatialContext?.district}
            initialTehsil={gisSpatialContext?.tehsil}
            userRole={role.code}
            onNavigateToReports={(ctx) => {
              if (ctx) setPolicyReportContext(ctx);
              setCurrentSection("reports");
            }}
            onNavigateToResearch={() => setCurrentSection("research-evidence")}
          />
        );
      case "analytics":
        return (
          <AnalyticsWorkstationView
            initialState={gisSpatialContext?.state}
            initialDistrict={gisSpatialContext?.district}
            initialTehsil={gisSpatialContext?.tehsil}
            userRole={role.code}
            onNavigateToGis={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("land-intelligence");
            }}
            onNavigateToResearch={(ctx) => {
              if (ctx) {
                setGisSpatialContext({
                  state: ctx.state,
                  district: ctx.district,
                  tehsil: ctx.tehsil,
                });
              }
              setCurrentSection("research-evidence");
            }}
            onNavigateToReports={(ctx) => {
              if (ctx) {
                setPolicyReportContext(ctx);
              }
              setCurrentSection("reports");
            }}
          />
        );
      case "reports":
        return (
          <ReportsWorkspaceView
            userRole={role.code}
            initialContext={policyReportContext}
            onNavigateToResearch={() => {
              setCurrentSection("research-evidence");
            }}
            onNavigateToPolicyLab={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("policy-lab");
            }}
          />
        );
      case "collaboration":
        return (
          <CollaborationWorkspaceView
            userRole={role.code}
            onNavigateToGis={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("land-intelligence");
            }}
            onNavigateToPolicyLab={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("policy-lab");
            }}
            onNavigateToResearch={() => {
              setCurrentSection("research-evidence");
            }}
            onNavigateToReports={() => {
              setCurrentSection("reports");
            }}
          />
        );
      case "innovation-hub":
        return (
          <InnovationHubView
            userRole={role.code}
            onNavigateToGis={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("land-intelligence");
            }}
            onNavigateToPolicyLab={(geo) => {
              if (geo) {
                setGisSpatialContext({
                  state: geo.state,
                  district: geo.district,
                  tehsil: geo.tehsil,
                });
              }
              setCurrentSection("policy-lab");
            }}
            onNavigateToResearch={() => {
              setCurrentSection("research-evidence");
            }}
            onNavigateToReports={() => {
              setCurrentSection("reports");
            }}
            onNavigateToCollaboration={() => {
              setCurrentSection("collaboration");
            }}
          />
        );
      case "sentinel":
        return <SentinelDashboard />;
      case "legal-harmonizer":
        return <LegalHarmonizerDashboard />;
      case "evidence-dossier":
        return <EvidenceDossierDashboard />;
      case "bhu-mitra":
        return <BhuMitraDashboard />;
      case "cases":
        return <CaseManagementDashboard />;
      case "design-system":
        return <DesignSystemShowcaseView />;
      case "help-docs":
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-[#0A1C30]">Help & Documentation</h1>
            <p className="text-sm text-slate-600">
              User manuals, NSDI OGC WMS/WFS API specifications, and standard operating procedures (SOP).
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-[#0A1C30]">System & Data Settings</h1>
            <p className="text-sm text-slate-600">
              Configure OGC WMS geospatial layers, CORS station credentials, and national audit logging parameters.
            </p>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-4 max-w-xl bg-white border border-slate-200 rounded-sm p-6">
            <h1 className="text-xl font-bold text-[#0A1C30] mb-2">Authenticated Profile</h1>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Full Name</span>
                <span className="font-bold text-slate-800 text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Designation</span>
                <span className="font-medium text-slate-800">{user.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Organization</span>
                <span className="font-medium text-slate-800">{user.organization}</span>
              </div>
              <div>
                <span className="text-slate-400 block">System Role</span>
                <span className="font-bold text-[#D35E0E]">{role.title} ({role.code})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Account Status</span>
                <span className="text-emerald-700 font-semibold">{user.status} • {user.accountType}</span>
              </div>
            </div>
          </div>
        );
      default:
        return <OverviewView onNavigateToModule={(mod) => setCurrentSection(mod as NavSection)} />;
    }
  };

  const sectionLabels: Record<NavSection, string> = {
    "overview": "Dashboard",
    "research-evidence": "Research & Evidence",
    "land-intelligence": "Land Intelligence",
    "sentinel": "Mutation Sentinel",
    "legal-harmonizer": "Legal Harmonizer",
    "evidence-dossier": "Evidence Dossier",
    "bhu-mitra": "Bhu-Mitra Field",
    "cases": "Case Management",
    "policy-lab": "Policy Lab",
    "analytics": "Analytics",
    "collaboration": "Collaboration",
    "innovation-hub": "Innovation Hub",
    "reports": "Reports",
    "api-center": "API Center",
    "design-system": "Design System",
    "help-docs": "Help & Documentation",
    "settings": "Settings",
    "profile": "Profile",
  };

  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "LANDScope", href: "/" },
      { label: sectionLabels[currentSection] || "Workspace" },
    ];
    if (currentSection === "land-intelligence" && gisSpatialContext?.district) {
      crumbs.push({ label: gisSpatialContext.district });
    }
    return crumbs;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    window.location.href = "/login";
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

      {/* 1. National Institutional Top Bar */}
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 2. Unified Top Bar with Breadcrumbs & Profile */}
      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        breadcrumbs={getBreadcrumbs()}
        onOpenSearch={() => setSearchModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
        unreadCount={notifications.length}
      />

      {/* 3. Main Workspace: Fixed Sidebar + Centered Content Container */}
      <div className="flex-1 flex w-full relative overflow-hidden z-10">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
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

        <main className="flex-1 min-w-0 overflow-y-auto bg-transparent">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
            {renderActiveView()}
          </div>
        </main>

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

      {/* 4. Global Search Modal */}
      <ModalDialog
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Cadastral & Spatial Quick Search"
        subtitle="Search across authorized datasets, khasra parcels, and spatial layers"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <SearchBar
            placeholder="Search cadastral parcels, khasra numbers, policy drafts..."
            value={searchQuery}
            onChange={setSearchQuery}
            showShortcut={false}
          />
        </div>
      </ModalDialog>

      {/* 5. Clean Institutional Footer */}
      <footer className="w-full bg-[#050b0a] text-[#94a3b8] border-t border-[#3b82f6]/15 py-3 text-xs font-sans relative z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
          <div>
            <strong className="text-white">LANDScope</strong> — SIH 2026 Sovereign Prototype • {user.organization}
          </div>
          <div className="text-[#94a3b8]">
            Session: <span className="text-[#3b82f6] font-mono">{user.email}</span> • Role: <span className="text-[#f59e0b] font-semibold">{role.title}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
