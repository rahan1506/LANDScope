"use client";

import React from "react";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  FlaskConical,
  BarChart3,
  FileSpreadsheet,
  Users,
  Lightbulb,
  HelpCircle,
  Settings,
  Code,
  LogOut,
  Radio,
  ChevronRight,
  ShieldAlert,
  Scale,
  FileCheck,
  Smartphone,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSection =
  | "overview"
  | "research-evidence"
  | "land-intelligence"
  | "sentinel"
  | "legal-harmonizer"
  | "evidence-dossier"
  | "bhu-mitra"
  | "cases"
  | "policy-lab"
  | "analytics"
  | "collaboration"
  | "innovation-hub"
  | "reports"
  | "api-center"
  | "design-system"
  | "help-docs"
  | "settings"
  | "profile";

export interface NavGroupItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "saffron" | "navy" | "green" | "neutral";
  requiredModule?: string;
}

export interface NavGroup {
  title: string;
  items: NavGroupItem[];
}

export interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  allowedModules?: string[];
  isOpen?: boolean;
  onCloseMobile?: () => void;
  user?: {
    name: string;
    roleTitle: string;
    roleCode?: string;
    organization: string;
    email: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function Sidebar({
  currentSection,
  onSelectSection,
  allowedModules,
  isOpen = true,
  onCloseMobile,
  user,
  onLogout,
  className,
}: SidebarProps) {
  const navigationGroups: NavGroup[] = [
    {
      title: "WORKSPACE",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: <LayoutDashboard className="w-4 h-4" />,
          requiredModule: "overview",
        },
        {
          id: "research-evidence",
          label: "Research",
          icon: <BookOpen className="w-4 h-4" />,
          requiredModule: "research-evidence",
        },
        {
          id: "land-intelligence",
          label: "Land Intelligence",
          icon: <MapPin className="w-4 h-4" />,
          requiredModule: "land-intelligence",
        },
        {
          id: "policy-lab",
          label: "Policy Lab",
          icon: <FlaskConical className="w-4 h-4" />,
          requiredModule: "policy-lab",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: <BarChart3 className="w-4 h-4" />,
          requiredModule: "analytics",
        },
      ],
    },
    {
      title: "GOVERNANCE & ENFORCEMENT",
      items: [
        {
          id: "sentinel",
          label: "Mutation Sentinel",
          icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />,
          badge: "AI Guard",
          badgeVariant: "green",
          requiredModule: "sentinel",
        },
        {
          id: "legal-harmonizer",
          label: "Legal Harmonizer",
          icon: <Scale className="w-4 h-4 text-amber-400" />,
          badge: "Acts",
          badgeVariant: "saffron",
          requiredModule: "legal-harmonizer",
        },
        {
          id: "evidence-dossier",
          label: "Evidence Dossier",
          icon: <FileCheck className="w-4 h-4 text-sky-400" />,
          badge: "SHA-256",
          badgeVariant: "navy",
          requiredModule: "evidence-dossier",
        },
        {
          id: "bhu-mitra",
          label: "Bhu-Mitra Field",
          icon: <Smartphone className="w-4 h-4 text-purple-400" />,
          badge: "PWA",
          badgeVariant: "saffron",
          requiredModule: "bhu-mitra",
        },
        {
          id: "cases",
          label: "Case Management",
          icon: <FolderKanban className="w-4 h-4 text-blue-400" />,
          requiredModule: "cases",
        },
      ],
    },
    {
      title: "COLLABORATION",
      items: [
        {
          id: "collaboration",
          label: "Projects",
          icon: <Users className="w-4 h-4" />,
          requiredModule: "collaboration",
        },
        {
          id: "innovation-hub",
          label: "Innovation Hub",
          icon: <Lightbulb className="w-4 h-4" />,
          requiredModule: "innovation-hub",
        },
      ],
    },
    {
      title: "OUTPUT",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: <FileSpreadsheet className="w-4 h-4" />,
          requiredModule: "reports",
        },
      ],
    },
    {
      title: "DEVELOPER",
      items: [
        {
          id: "api-center",
          label: "API Center",
          icon: <Code className="w-4 h-4" />,
          requiredModule: "overview",
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          id: "help-docs",
          label: "Help",
          icon: <HelpCircle className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleItemClick = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile?.();
  };

  return (
    <aside
      className={cn(
        "w-64 bg-[#060e1a]/90 backdrop-blur-2xl border-r border-[#3b82f6]/15 flex flex-col justify-between shrink-0 select-none font-sans z-30 transition-all duration-300",
        isOpen ? "flex" : "hidden md:flex",
        className
      )}
    >
      {/* Scrollable Navigation Groups */}
      <div className="p-3.5 space-y-6 overflow-y-auto flex-1">
        {navigationGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.requiredModule) return true;
            if (!allowedModules) return true;
            return allowedModules.includes(item.requiredModule);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold font-mono uppercase tracking-widest text-[#94a3b8]/60 flex items-center justify-between">
                <span>{group.title}</span>
                <span className="text-[9px] text-[#3b82f6]/40 font-mono">0{visibleItems.length}</span>
              </div>

              <nav className="space-y-1" aria-label={group.title}>
                {visibleItems.map((item) => {
                  const isActive = currentSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all duration-150 cursor-pointer group text-left relative",
                        isActive
                          ? "bg-[#0b1c38] text-white font-semibold border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.12)]"
                          : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {/* Active Left Indicator Line */}
                      {isActive && (
                        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#3b82f6] rounded-r shadow-[0_0_8px_#3b82f6]" />
                      )}

                      <div className="flex items-center gap-3 truncate">
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isActive ? "text-[#3b82f6]" : "text-[#94a3b8] group-hover:text-white"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-bold font-mono tracking-tight",
                            isActive
                              ? "bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40"
                              : "bg-white/5 text-[#94a3b8] border border-white/10"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Intelligence Navigation Rail User Footer */}
      <div className="p-3.5 border-t border-[#3b82f6]/15 bg-[#030712]/80 space-y-3">
        {user ? (
          <div className="flex items-center justify-between gap-2.5 text-left">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate block">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-semibold text-[#3b82f6] px-1.5 py-0.5 bg-[#3b82f6]/10 rounded border border-[#3b82f6]/20 truncate font-mono">
                  {user.roleTitle}
                </span>
                <span className="text-[9px] text-[#94a3b8]/60 font-mono">
                  ACTIVE
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-[#94a3b8] hover:text-[#e47d72] hover:bg-[#e47d72]/10 rounded transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-[#94a3b8]/60 font-mono text-center">
            LANDScope Sovereign Intelligence
          </div>
        )}
      </div>
    </aside>
  );
}
