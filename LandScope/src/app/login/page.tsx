"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  User,
  Scale,
  BookOpen,
  GraduationCap,
  Building2,
  Lightbulb,
  Globe2,
  Shield,
  Radio,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandIntelligenceCanvas } from "@/components/canvas/land-intelligence-canvas";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("researcher@landscope.demo");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState("researcher");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const demoAccounts = [
    {
      role: "RESEARCHER",
      slug: "researcher",
      name: "Dr. Ananya Sharma",
      email: "researcher@landscope.demo",
      title: "Senior Policy Research Fellow",
      icon: <BookOpen className="w-3.5 h-3.5 text-[#3b82f6]" />,
      allowed: "Research, Datasets, AI Copilot, GIS",
      badgeColor: "border-[#3b82f6]/30 text-[#93c5fd] bg-[#3b82f6]/10",
    },
    {
      role: "POLICYMAKER",
      slug: "policymaker",
      name: "Vikram Malhotra",
      email: "policymaker@landscope.demo",
      title: "Strategic Policy Analyst",
      icon: <Scale className="w-3.5 h-3.5 text-[#f59e0b]" />,
      allowed: "Policy Lab, Scenarios, Analytics, Reports",
      badgeColor: "border-[#f59e0b]/30 text-[#fde68a] bg-[#f59e0b]/10",
    },
    {
      role: "ACADEMIC_INSTITUTION",
      slug: "academic",
      name: "Prof. Sudhir Kulkarni",
      email: "academic@landscope.demo",
      title: "Dean of Spatial Sciences",
      icon: <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8]" />,
      allowed: "Joint Projects, Publications, Innovation Hub",
      badgeColor: "border-[#38bdf8]/30 text-[#7dd3fc] bg-[#38bdf8]/10",
    },
    {
      role: "GOVERNMENT_AGENCY",
      slug: "agency",
      name: "Sunil Deshmukh",
      email: "agency@landscope.demo",
      title: "Cadastral Reconciliation Officer",
      icon: <Building2 className="w-3.5 h-3.5 text-[#93c5fd]" />,
      allowed: "Demarcation, Inter-Agency Tasks, Audits",
      badgeColor: "border-[#3b82f6]/30 text-[#93c5fd] bg-[#3b82f6]/10",
    },
    {
      role: "INNOVATOR",
      slug: "innovator",
      name: "Rohan Varma",
      email: "innovator@landscope.demo",
      title: "Lead Geospatial AI Engineer",
      icon: <Lightbulb className="w-3.5 h-3.5 text-[#e8b85c]" />,
      allowed: "AI Sandbox, Vision Models, Crowdsourcing",
      badgeColor: "border-[#e8b85c]/30 text-[#f5d082] bg-[#e8b85c]/10",
    },
    {
      role: "PUBLIC",
      slug: "public",
      name: "Kavita Rao",
      email: "public@landscope.demo",
      title: "Community Land Advocate",
      icon: <Globe2 className="w-3.5 h-3.5 text-[#38bdf8]" />,
      allowed: "Public Maps, Land Trends, Open Reports",
      badgeColor: "border-[#38bdf8]/30 text-[#7dd3fc] bg-[#38bdf8]/10",
    },
    {
      role: "ADMIN",
      slug: "admin",
      name: "System Admin",
      email: "admin@landscope.demo",
      title: "Lead Security & System Architect",
      icon: <Shield className="w-3.5 h-3.5 text-white" />,
      allowed: "Full System Administration & User Management",
      badgeColor: "border-white/20 text-white bg-white/10",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Authentication failed");
        setIsLoading(false);
        return;
      }

      router.push(data.redirectUrl || `/app/${selectedRole}`);
      router.refresh();
    } catch {
      setErrorMsg("Connection error during authentication.");
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.slug);
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to authenticate demo account");
        setIsLoading(false);
        return;
      }

      router.push(data.redirectUrl || `/app/${acc.slug}`);
      router.refresh();
    } catch {
      setErrorMsg("Network error during demo session creation.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* 3D Geospatial Terrain & Particle Canvas in Background */}
      <div className="absolute inset-0 z-0">
        <LandIntelligenceCanvas intensity="hero" showCoordinates={true} />
      </div>

      {/* Top Telemetry Header */}
      <header className="relative z-10 bg-[#030712]/80 backdrop-blur-xl border-b border-[#3b82f6]/15 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Platform</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="text-[11px] font-mono text-[#94a3b8]">
              SECURE RESEARCH GATEWAY • SIH26019
            </span>
          </div>
        </div>
      </header>

      {/* Main Terminal Container */}
      <main className="relative z-10 max-w-2xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-[#060e1a]/85 backdrop-blur-2xl border border-[#3b82f6]/25 rounded-lg shadow-2xl shadow-black/80 overflow-hidden">
          {/* Terminal Title Header */}
          <div className="p-6 border-b border-[#3b82f6]/15 bg-[#0a1526]/60 text-center relative">
            <div className="flex justify-center mb-3">
              <LandScopeLogo size="md" variant="emerald" showTagline={false} />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4 text-[#3b82f6]" />
              Platform Authentication Terminal
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono">
              Server-Enforced Role Based Access Control (RBAC) • Cadastral Security Layer
            </p>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded bg-[#e47d72]/15 border border-[#e47d72]/30 text-[#ff9f96] text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#e47d72]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <Input
              label="Work Official Email (Authorized Workspace)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. researcher@landscope.demo"
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Passkey / Cryptographic Token"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-3 h-10 font-bold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate & Enter Workspace
            </Button>
          </form>

          {/* 1-Click Authenticated Demonstration Accounts */}
          <div className="p-5 bg-[#030712]/80 border-t border-[#3b82f6]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#3b82f6] animate-pulse" />
                1-Click Authenticated Testing Terminals:
              </span>
              <span className="text-[10px] text-[#94a3b8] font-mono">
                Click role to verify RBAC
              </span>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  disabled={isLoading}
                  className="w-full p-3 rounded bg-[#060e1a]/70 border border-[#3b82f6]/15 hover:border-[#3b82f6]/50 hover:bg-[#0b1c38]/50 text-left transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm hover:shadow-[0_0_15px_rgba(59, 130, 246,0.1)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded bg-[#0b1c38] border border-[#3b82f6]/25 group-hover:scale-105 transition-transform">
                      {acc.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-[#3b82f6] flex items-center gap-2">
                        <span>{acc.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-medium ${acc.badgeColor}`}>
                          {acc.slug}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] truncate">
                        {acc.email} • {acc.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#94a3b8]/70 font-mono block">
                      {acc.allowed}
                    </span>
                    <span className="text-[10px] font-bold text-[#3b82f6] group-hover:underline flex items-center justify-end gap-1">
                      Sign In &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-[#94a3b8]/60 text-center font-mono">
              LANDScope Sovereign Land Intelligence Platform • SIH 2026 Innovation Demonstration
            </div>
          </div>
        </div>
      </main>

      {/* Terminal Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-[#94a3b8] border-t border-[#3b82f6]/15 bg-[#050b0a]/90 backdrop-blur-md font-mono text-[11px]">
        SIH 2026 National Prototype • SIH26019 • Multi-Spectral Geospatial Decision Support
      </footer>
    </div>
  );
}
