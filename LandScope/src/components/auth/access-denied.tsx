"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AccessDeniedProps {
  currentRoleTitle?: string;
  currentRoleSlug?: string;
  requiredRoleTitle?: string;
  requiredPermission?: string;
}

export function AccessDenied({
  currentRoleTitle = "Unspecified Role",
  currentRoleSlug = "login",
  requiredRoleTitle = "Restricted Area",
  requiredPermission = "Role-Specific Authorization",
}: AccessDeniedProps) {
  const returnUrl = currentRoleSlug ? `/app/${currentRoleSlug}` : "/login";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-md w-full glass-panel-floating border border-[#e47d72]/30 rounded-2xl shadow-2xl overflow-hidden text-center relative">
        {/* Coral Warning Hairline */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#e47d72] to-transparent w-full" />

        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#e47d72]/10 border border-[#e47d72]/30 text-[#e47d72] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(228,125,114,0.15)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e47d72]/15 text-[#e47d72] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e47d72]/30 mb-1">
              <Lock className="w-3 h-3" />
              <span>403 Forbidden • Access Denied</span>
            </div>
            <h1 className="text-xl font-bold text-[#f8fafc] tracking-tight">
              Restricted Workspace
            </h1>
            <p className="text-xs text-[#8ea79e] leading-relaxed max-w-sm mx-auto">
              You don&apos;t have permission to access this workspace. Access to LANDScope operational modules is restricted according to verified organizational mandates.
            </p>
          </div>

          {/* Authorization Details Card */}
          <div className="p-4 bg-[#060e1a]/90 border border-[#19386c]/30 rounded-xl text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#8ea79e]">Your Authenticated Role:</span>
              <span className="font-bold text-[#f8fafc]">{currentRoleTitle}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#19386c]/20">
              <span className="text-[#8ea79e]">Target Workspace:</span>
              <span className="font-semibold text-[#e47d72]">{requiredRoleTitle}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#19386c]/20">
              <span className="text-[#8ea79e]">Required Permission:</span>
              <span className="font-mono text-[10px] text-[#38bdf8] bg-[#030712] px-2 py-0.5 rounded-md border border-[#19386c]/40">
                {requiredPermission}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <Link href={returnUrl} className="block w-full">
              <Button
                variant="primary"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4 text-[#030712]" />}
              >
                Return to My Authorized Workspace
              </Button>
            </Link>

            <Link href="/" className="inline-block text-xs text-[#8ea79e] hover:text-[#3b82f6] transition-colors">
              Return to Public Portal
            </Link>
          </div>
        </div>

        <div className="p-3 bg-[#060e1a]/60 border-t border-[#19386c]/30 text-[11px] text-[#678278] font-mono">
          Security Event Logged: RBAC-SEC-403
        </div>
      </div>
    </div>
  );
}
