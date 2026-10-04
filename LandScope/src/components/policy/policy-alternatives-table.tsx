"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Minus,
  TrendingDown,
  TrendingUp,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyAlternativesTableProps {
  onSelectPreset?: (presetKey: "baseline" | "scenarioA" | "scenarioB") => void;
}

export function PolicyAlternativesTable({ onSelectPreset }: PolicyAlternativesTableProps) {
  const comparisonRows = [
    {
      dimension: "Agriculture",
      metric: "Annual Farmland Conversion",
      baseline: "1,200 Ha / Year (Loss)",
      scenarioA: "650 Ha / Year (Capped)",
      scenarioB: "300 Ha / Year (Strict Moratorium)",
      statusA: "+550 Ha Protected",
      statusB: "+900 Ha Protected",
    },
    {
      dimension: "Water",
      metric: "Aquifer Recharge Index",
      baseline: "44 / 100 (Critical)",
      scenarioA: "70 / 100 (Semi-Critical)",
      scenarioB: "84 / 100 (Safe)",
      statusA: "+26 Pts Recharge",
      statusB: "+40 Pts Recharge",
    },
    {
      dimension: "Ecology",
      metric: "Eco-Sensitive Buffer Zone",
      baseline: "250m Buffer (68% Canopy)",
      scenarioA: "750m Buffer (86% Canopy)",
      scenarioB: "1,200m Buffer (95% Canopy)",
      statusA: "+18% Protection",
      statusB: "+27% Protection",
    },
    {
      dimension: "Urban Development",
      metric: "Logistics Capacity Footprint",
      baseline: "78% Unregulated Expansion",
      scenarioA: "63% Managed Expansion",
      scenarioB: "48% Constrained Expansion",
      statusA: "-15% Absorption",
      statusB: "-30% Absorption",
    },
    {
      dimension: "Infrastructure",
      metric: "Peak Stormwater Runoff",
      baseline: "100% Inundation Baseline",
      scenarioA: "72% (-28% Runoff)",
      scenarioB: "58% (-42% Runoff)",
      statusA: "Moderate Drainage Relief",
      statusB: "High Drainage Relief",
    },
    {
      dimension: "Governance",
      metric: "Boundary Litigation Risk",
      baseline: "6.2% Disputed Parcels",
      scenarioA: "3.6% (-42% Plaints)",
      scenarioB: "3.6% (-42% Plaints)",
      statusA: "RTK Cadastre Enforced",
      statusB: "RTK Cadastre Enforced",
    },
  ];

  return (
    <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4 text-xs font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
        <div>
          <h3 className="font-mono font-bold text-[#f8fafc] text-xs uppercase tracking-widest flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#3b82f6]" />
            <span>Policy Alternatives Multi-Scenario Comparison</span>
          </h3>
          <p className="text-[11px] text-[#8ea79e] mt-0.5">
            Objective side-by-side comparison across 6 land governance dimensions (No subjective ranking)
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
          Illustrative Model Output
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#19386c]/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#19386c]/30 bg-[#060e1a]/90 text-[11px] text-[#8ea79e]">
              <th className="p-3 font-mono font-bold uppercase tracking-wider">Dimension & Metric</th>
              <th className="p-3 font-mono font-bold uppercase tracking-wider text-[#f59e0b] bg-[#030712]/70">
                Baseline (Unregulated)
              </th>
              <th className="p-3 font-mono font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/5">
                Scenario A (Controlled Expansion)
              </th>
              <th className="p-3 font-mono font-bold uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/5">
                Scenario B (Agro Protection)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#19386c]/20 bg-[#030712]/50">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#0b1c38]/20 transition-colors">
                <td className="p-3">
                  <strong className="text-[#f8fafc] block font-semibold">{row.dimension}</strong>
                  <span className="text-[11px] text-[#8ea79e]">{row.metric}</span>
                </td>
                <td className="p-3 bg-[#060e1a]/40 font-mono text-[#f59e0b]">
                  {row.baseline}
                </td>
                <td className="p-3 bg-[#38bdf8]/5">
                  <span className="font-mono text-[#38bdf8] font-semibold block">{row.scenarioA}</span>
                  <span className="text-[10px] text-[#38bdf8]/80 font-mono">({row.statusA})</span>
                </td>
                <td className="p-3 bg-[#3b82f6]/5">
                  <span className="font-mono text-[#3b82f6] font-semibold block">{row.scenarioB}</span>
                  <span className="text-[10px] text-[#3b82f6]/80 font-mono">({row.statusB})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onSelectPreset && (
        <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#19386c]/30">
          <span className="text-[11px] text-[#8ea79e] mr-2 font-mono">Load Preset into Simulator:</span>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("baseline")}
          >
            Load Baseline
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("scenarioA")}
            className="border-[#38bdf8]/40 text-[#38bdf8] bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20"
          >
            Load Scenario A
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("scenarioB")}
            className="border-[#3b82f6]/40 text-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20"
          >
            Load Scenario B
          </Button>
        </div>
      )}
    </div>
  );
}
