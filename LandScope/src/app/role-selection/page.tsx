"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  MapPin,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("policy-secretary");

  const roles = [
    {
      id: "policy-secretary",
      title: "Principal Policy Analyst",
      sector: "Policy Lab & Regulatory Impact",
      icon: <FlaskConical className="w-5 h-5 text-[#D35E0E]" />,
      description:
        "Formulate what-if zoning scenarios, model cross-sector trade-offs, and synthesize evidence-backed draft Gazette resolutions.",
      focus: ["Policy Digital Twin", "Scenario Equilibrium", "Gazette Drafting"],
    },
    {
      id: "district-magistrate",
      title: "District Governance Officer",
      sector: "Tenure Security & Conciliation",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      description:
        "Monitor district-level tenure security, track active land dispute queues, and review inter-departmental revenue mutations.",
      focus: ["Dispute Lok Adalat", "DILRMP Audit", "Nodal Collaboration"],
    },
    {
      id: "gis-surveyor",
      title: "Senior Cadastral Cartographer",
      sector: "Spatial Data & Ground-Truth",
      icon: <MapPin className="w-5 h-5 text-[#112A4A]" />,
      description:
        "Inspect high-resolution cadastral vector parcels, verify survey boundaries against CORS network, and analyze multi-temporal LULC.",
      focus: ["Cadastral Parcels", "EPSG:4326 Telemetry", "Drone Validation"],
    },
    {
      id: "research-fellow",
      title: "Policy Research Fellow",
      sector: "Empirical Studies & Evidence",
      icon: <BookOpen className="w-5 h-5 text-cyan-700" />,
      description:
        "Access peer-reviewed datasets, empirical studies with confidence scores, and analyze land tenure econometric indices.",
      focus: ["Evidence Traceability", "DOI Repository", "Econometric Indices"],
    },
  ];

  const handleProceed = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#3b82f6]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="glass-panel-primary border-b border-[#19386c]/30 py-3.5 px-6 shadow-xl relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <LandScopeLogo size="sm" variant="navy" showTagline={false} />
          </Link>
          <span className="text-xs text-[#8ea79e] font-mono">Step 2: Operational Perspective</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center relative z-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="official" size="sm" className="mb-3">
            Personalized Workspace
          </Badge>
          <h1 className="text-3xl font-black text-[#f8fafc] tracking-tight bg-gradient-to-r from-[#f8fafc] via-[#e2ece8] to-[#3b82f6] bg-clip-text text-transparent">
            Select Your Analytical Perspective
          </h1>
          <p className="text-xs text-[#8ea79e] mt-2">
            LANDScope adapts its decision-support workflows based on your governance role, whether you are modeling policy, evaluating GIS cadastre, or researching evidence.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between select-none ${
                  isSelected
                    ? "bg-[#0b1c38]/50 border-[#3b82f6] ring-1 ring-[#3b82f6]/50 shadow-[0_0_20px_rgba(59, 130, 246,0.15)]"
                    : "glass-panel-secondary border-[#19386c]/30 hover:border-[#3b82f6]/40 hover:bg-[#0b1c38]/20"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#060e1a] border border-[#19386c]/40">
                        {r.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#f8fafc]">{r.title}</div>
                        <div className="text-[11px] text-[#3b82f6] font-mono">{r.sector}</div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#3b82f6] border-[#3b82f6] text-[#030712] shadow-[0_0_10px_rgba(59, 130, 246,0.6)]"
                          : "border-[#19386c]/60 bg-[#030712]"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-[#a4bcaf] leading-relaxed mb-4">
                    {r.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#19386c]/30">
                  {r.focus.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#060e1a] text-[#8ea79e] border border-[#19386c]/40"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceed}
            rightIcon={<ArrowRight className="w-4 h-4 text-[#030712]" />}
          >
            Enter LANDScope Workspace
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#678278] border-t border-[#19386c]/30 bg-[#060e1a]/60 relative z-10 font-mono">
        LANDScope is a prototype developed for Smart India Hackathon 2026 (SIH26019).
      </footer>
    </div>
  );
}
