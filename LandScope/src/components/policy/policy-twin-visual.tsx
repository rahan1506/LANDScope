"use client";

import React from "react";
import {
  MapPin,
  Sliders,
  Play,
  BarChart3,
  FileCheck2,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyTwinVisualProps {
  activeStage?: number;
  onSelectStage?: (stage: number) => void;
  geographyName?: string;
  className?: string;
}

export function PolicyTwinVisual({
  activeStage = 3,
  onSelectStage,
  geographyName = "Sehore, Madhya Pradesh",
  className,
}: PolicyTwinVisualProps) {
  const steps = [
    {
      step: 1,
      title: "Current Land",
      subtitle: geographyName,
      icon: <MapPin className="w-3.5 h-3.5" />,
    },
    {
      step: 2,
      title: "Policy Scenario",
      subtitle: "Zoning & Moratoriums",
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
    {
      step: 3,
      title: "Simulation",
      subtitle: "Calibrate & Run",
      icon: <Play className="w-3.5 h-3.5" />,
    },
    {
      step: 4,
      title: "Impact Analysis",
      subtitle: "Multi-Sector Evaluation",
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      step: 5,
      title: "Evidence & Decision",
      subtitle: "Explainability & Brief",
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav
      aria-label="Policy Simulation Workflow"
      className={cn(
        "glass-panel-primary border border-[#19386c]/40 rounded-xl p-4 shadow-xl space-y-3 font-sans relative overflow-hidden",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-2.5">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#3b82f6] uppercase tracking-widest block">
            Policy Digital Twin Workflow
          </span>
          <span className="text-xs text-[#9bb3aa] font-medium">
            Test policy decisions on digital cadastre before statutory gazetting
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#9bb3aa]">
          <span>Active Step:</span>
          <strong className="text-[#3b82f6] font-bold">
            {activeStage} of {steps.length}
          </strong>
        </div>
      </div>

      {/* Horizontal Stepper Grid */}
      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((st) => {
          const isCompleted = activeStage > st.step;
          const isCurrent = activeStage === st.step;

          return (
            <li
              key={st.step}
              onClick={() => onSelectStage && onSelectStage(st.step)}
              className={cn(
                "relative p-3 rounded-lg border transition-all duration-200 select-none text-left flex items-start gap-2.5",
                isCurrent &&
                  "bg-[#0b1c38]/50 border-[#3b82f6] ring-1 ring-[#3b82f6]/40 shadow-[0_0_15px_rgba(59, 130, 246,0.15)]",
                isCompleted &&
                  "bg-[#060e1a]/80 border-[#19386c]/40 text-[#f8fafc] hover:border-[#3b82f6]/50 hover:bg-[#0b1c38]/30",
                !isCurrent && !isCompleted && "bg-[#030712]/60 border-[#19386c]/20 text-[#678278] opacity-75 hover:opacity-100",
                onSelectStage && "cursor-pointer"
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors",
                  isCurrent && "bg-[#3b82f6] text-[#030712] shadow-[0_0_10px_rgba(59, 130, 246,0.5)]",
                  isCompleted && "bg-[#10274e] text-[#3b82f6] border border-[#3b82f6]/30",
                  !isCurrent && !isCompleted && "bg-[#0d1d19] text-[#678278] border border-[#19386c]/30"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.step}
              </div>

              {/* Step Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <strong
                    className={cn(
                      "text-xs font-bold block truncate",
                      isCurrent ? "text-[#f8fafc]" : isCompleted ? "text-[#e2ece8]" : "text-[#7c978d]"
                    )}
                  >
                    {st.title}
                  </strong>
                </div>
                <span className="text-[10.5px] text-[#8ea79e] block truncate">
                  {st.subtitle}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
