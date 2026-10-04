"use client";

import React from "react";
import { StressCondition } from "@/lib/policy/policy-twin-data";
import {
  Flame,
  CloudRain,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface PolicyStressTestCardProps {
  selectedStress: StressCondition;
  onSelectStress: (stress: StressCondition) => void;
}

export function PolicyStressTestCard({
  selectedStress,
  onSelectStress,
}: PolicyStressTestCardProps) {
  const conditions: Array<{
    id: StressCondition;
    label: string;
    description: string;
    icon: React.ReactNode;
    color?: string;
    impactSummary: string;
    activeClasses?: string;
  }> = [
    {
      id: "Normal Conditions",
      label: "Normal Conditions",
      description: "Standard macroeconomic growth and average 920mm annual precipitation.",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" />,
      activeClasses: "bg-[#0b1c38]/60 border-[#3b82f6] ring-1 ring-[#3b82f6]/50 shadow-[0_0_15px_rgba(59, 130, 246,0.2)] text-[#f8fafc]",
      impactSummary: "Baseline model dynamics operate under historical trend assumptions.",
    },
    {
      id: "High Urban Growth",
      label: "High Urban Growth (+40%)",
      description: "Accelerated logistics influx; 1.4x higher warehousing conversion demand.",
      icon: <Building2 className="w-3.5 h-3.5 text-[#e8b85c]" />,
      activeClasses: "bg-[#e8b85c]/10 border-[#e8b85c] ring-1 ring-[#e8b85c]/50 shadow-[0_0_15px_rgba(232,184,92,0.2)] text-[#f8fafc]",
      impactSummary: "Agricultural conversion pressure increases by 40%; tested cap absorbs spike.",
    },
    {
      id: "Climate Stress",
      label: "Climate Stress (Drought)",
      description: "Consecutive deficient monsoons; subsoil infiltration down 35%.",
      icon: <Flame className="w-3.5 h-3.5 text-[#e47d72]" />,
      activeClasses: "bg-[#e47d72]/10 border-[#e47d72] ring-1 ring-[#e47d72]/50 shadow-[0_0_15px_rgba(228,125,114,0.2)] text-[#f8fafc]",
      impactSummary: "Pervious vegetative soil ratio becomes decisive to prevent deep aquifer collapse.",
    },
    {
      id: "Infrastructure Pressure",
      label: "Infrastructure Pressure",
      description: "Rapid arterial highway widening; 1.25x commercial strip allotment.",
      icon: <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />,
      activeClasses: "bg-[#38bdf8]/10 border-[#38bdf8] ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56, 189, 248,0.2)] text-[#f8fafc]",
      impactSummary: "Setbacks along Parvati tributaries buffer increased impervious surface velocity.",
    },
  ];

  return (
    <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-3.5 text-xs font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-2.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#3b82f6]" />
          <h3 className="font-mono font-bold text-[#f8fafc] text-xs uppercase tracking-widest">
            Policy Stress-Testing Sandbox
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
          Illustrative Scenario Stress Test
        </span>
      </div>

      <p className="text-[11.5px] text-[#8ea79e]">
        Evaluate scenario resilience under demographic shocks and climatic anomalies before finalizing statutory gazette drafting.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {conditions.map((cond) => {
          const isSelected = selectedStress === cond.id;
          return (
            <button
              key={cond.id}
              type="button"
              onClick={() => onSelectStress(cond.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? cond.activeClasses
                  : "bg-[#060e1a]/70 border-[#19386c]/30 text-[#a4bcaf] hover:border-[#3b82f6]/40 hover:bg-[#0b1c38]/30"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span>{cond.icon}</span>
                  <span className={isSelected ? "text-[#f8fafc]" : "text-[#d1e0da]"}>{cond.label}</span>
                </div>
                <p className="text-[10.5px] text-[#8ea79e] leading-snug">{cond.description}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#19386c]/30 text-[10px] italic text-[#678278]">
                {cond.impactSummary}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
