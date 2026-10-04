"use client";

import React from "react";
import {
  Bell,
  Search,
  Menu,
  ChevronRight,
  Shield,
  Layers,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  userName?: string;
  userRoleTitle?: string;
  userEmail?: string;
  organization?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onOpenSearch?: () => void;
  onToggleSidebar?: () => void;
  onToggleNotifications?: () => void;
  unreadCount?: number;
}

export function Header({
  userName = "Platform User",
  userRoleTitle = "Authorized User",
  userEmail,
  breadcrumbs = [{ label: "LANDScope" }, { label: "Workspace" }],
  onOpenSearch,
  onToggleSidebar,
  onToggleNotifications,
  unreadCount = 2,
}: HeaderProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/85 backdrop-blur-xl border-b border-[#3b82f6]/15 shadow-xl font-sans transition-all duration-300">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo + Clean Breadcrumbs Hierarchy */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-[#94a3b8] hover:text-white hover:bg-white/5 rounded cursor-pointer transition-colors"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="hover:opacity-90 shrink-0 transition-opacity"
            title="LANDScope Platform Home"
          >
            <LandScopeLogo size="sm" variant="emerald" showTagline={false} />
          </Link>

          <div className="h-4 w-px bg-[#3b82f6]/20 hidden sm:block" />

          {/* Clean Spatial Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8] font-medium truncate">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#3b82f6]/40 shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#3b82f6] transition-colors truncate max-w-[140px]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate max-w-[180px]",
                      idx === breadcrumbs.length - 1 ? "font-semibold text-white" : "text-[#94a3b8]"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right: Quick Search, Notifications, Profile (Translucent instrument panel controls) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[#0a1526]/80 hover:bg-[#0b1c38] text-[#94a3b8] hover:text-white text-xs transition-all border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 shadow-sm cursor-pointer"
            title="Search cadastral parcels, khasra, evidence (Cmd/Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="hidden md:inline text-[11px] text-[#94a3b8]">Quick Search...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-[#030712] rounded border border-[#3b82f6]/20 text-[#3b82f6]">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Alert Bell */}
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative p-2 rounded-sm text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="System Alerts & Sensor Signals"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
            )}
          </button>

          {/* User Profile Avatar with Emerald Indicator */}
          <div
            className="flex items-center gap-2.5 pl-3 border-l border-[#3b82f6]/20"
            title={`Signed in as ${userName} (${userRoleTitle})`}
          >
            <div className="w-8 h-8 rounded-sm bg-[#0b1c38] border border-[#3b82f6]/40 text-[#93c5fd] flex items-center justify-center text-xs font-bold font-mono tracking-tight shrink-0 shadow-[0_0_10px_rgba(59, 130, 246,0.15)]">
              {getInitials(userName)}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <span className="font-bold text-white block truncate max-w-[130px]">{userName}</span>
              <span className="text-[10px] text-[#3b82f6] font-mono block truncate max-w-[130px]">
                {userRoleTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
