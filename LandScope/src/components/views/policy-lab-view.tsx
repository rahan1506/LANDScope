"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  FileText,
  Activity,
  Layers,
  Radio,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScenarioControls, ScenarioParameter } from "@/components/ui/scenario-controls";
import { ScenarioImpactMeter, ScenarioMetric } from "@/components/ui/charts";
import { ModalDialog } from "@/components/ui/modal-dialog";

export function PolicyLabView() {
  const [activeScenarioPreset, setActiveScenarioPreset] = useState("urban-buffer");
  const [isSimulating, setIsSimulating] = useState(false);
  const [showGazetteDraft, setShowGazetteDraft] = useState(false);

  // Scenario Parameters
  const [parameters, setParameters] = useState<ScenarioParameter[]>([
    {
      id: "agri-conversion-cap",
      name: "Agricultural Land Diversion Ceiling",
      description: "Maximum prime fertile cropland allowed for commercial conversion annually",
      min: 100,
      max: 2000,
      step: 50,
      value: 650,
      baseline: 1200,
      unit: "Ha / Tehsil",
    },
    {
      id: "afforestation-ratio",
      name: "Compensatory Afforestation Multiplier",
      description: "Required non-forest land afforested per hectare of diverted land",
      min: 1.0,
      max: 3.0,
      step: 0.1,
      value: 2.2,
      baseline: 1.0,
      unit: "x Ratio",
    },
    {
      id: "eco-buffer-distance",
      name: "Eco-Sensitive Buffer Zone Depth",
      description: "Mandatory no-construction perimeter around sanctuaries and wetlands",
      min: 100,
      max: 2000,
      step: 50,
      value: 750,
      baseline: 250,
      unit: "Meters",
    },
    {
      id: "water-setback",
      name: "Surface Water Body Setback Buffer",
      description: "Prohibited commercial development corridor around rivers and canals",
      min: 50,
      max: 500,
      step: 25,
      value: 200,
      baseline: 100,
      unit: "Meters",
    },
  ]);

  const handleParameterChange = (id: string, val: number) => {
    setParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value: val } : p))
    );
  };

  const handleResetParameters = () => {
    setParameters((prev) =>
      prev.map((p) => ({ ...p, value: p.baseline }))
    );
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  // Dynamically calculated outcome metrics based on current slider values
  const conversionParam = parameters.find((p) => p.id === "agri-conversion-cap")?.value || 650;
  const afforestParam = parameters.find((p) => p.id === "afforestation-ratio")?.value || 2.2;
  const ecoParam = parameters.find((p) => p.id === "eco-buffer-distance")?.value || 750;

  // Impact Calculations
  const calculatedYield = Number((86.4 + ((1200 - conversionParam) / 1200) * 8.2).toFixed(1));
  const calculatedRevenue = Number((420 - ((1200 - conversionParam) / 1200) * 95).toFixed(0));
  const calculatedDisputeRisk = Number((54.2 - ((ecoParam - 250) / 1750) * 18.5).toFixed(1));
  const calculatedEcoScore = Number((62.8 + (afforestParam - 1.0) * 14.2).toFixed(1));

  const simulationMetrics: ScenarioMetric[] = [
    {
      label: "Cropland Preservation & Food Security",
      baseline: 86.4,
      simulated: calculatedYield,
      unit: "% Index",
      trend: "positive",
    },
    {
      label: "Projected State Conversion Revenue",
      baseline: 420,
      simulated: calculatedRevenue,
      unit: "₹ Crores",
      trend: calculatedRevenue < 420 ? "negative" : "positive",
    },
    {
      label: "Land Boundary Dispute Risk Probability",
      baseline: 54.2,
      simulated: calculatedDisputeRisk,
      unit: "Risk Score",
      trend: calculatedDisputeRisk < 54.2 ? "positive" : "negative",
    },
    {
      label: "Ecological Integrity & Forest Buffer",
      baseline: 62.8,
      simulated: calculatedEcoScore,
      unit: "Eco Score",
      trend: "positive",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3b82f6]/15 relative">
        <div className="space-y-1.5">
          <Breadcrumbs
            items={[
              { label: "National Land Governance Directorate" },
              { label: "Policy Innovation & Simulation Laboratory", active: true },
            ]}
          />
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Policy Lab — Spatial Regulation Simulator</span>
            <Badge variant="official" size="sm" dot>
              SIH26019 Sandbox
            </Badge>
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Model statutory zoning levers, evaluate socio-economic trade-offs, and synthesize evidence-backed Gazette draft notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGazetteDraft(true)}
            leftIcon={<FileText className="w-3.5 h-3.5 text-[#3b82f6]" />}
            className="font-mono text-xs"
          >
            Draft Gazette Resolution
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSimulation}
            isLoading={isSimulating}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="font-mono text-xs font-bold"
          >
            Recompute Equilibrium
          </Button>
        </div>
      </div>

      {/* Preset Policy Scenarios Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold text-[#94a3b8] font-mono uppercase tracking-widest mr-1">
          Policy Archetypes:
        </span>
        {[
          {
            id: "urban-buffer",
            title: "Draft Peri-Urban Master Plan 2026",
            state: "Central & Western States",
          },
          {
            id: "eco-sanctuary",
            title: "Wildlife Corridor & Eco-Sensitive Buffer Zone",
            state: "Forest Fringe Districts",
          },
          {
            id: "tribal-safeguard",
            title: "Scheduled V Tribal Land Protection Amendment",
            state: "Tribal Tehsils",
          },
        ].map((preset) => (
          <button
            key={preset.id}
            onClick={() => setActiveScenarioPreset(preset.id)}
            className={`px-3.5 py-2 rounded-sm border text-left cursor-pointer transition-all ${
              activeScenarioPreset === preset.id
                ? "bg-[#0b1c38] text-white border-[#3b82f6]/50 shadow-[0_0_12px_rgba(59, 130, 246,0.2)]"
                : "bg-[#060e1a]/80 text-[#94a3b8] border-[#3b82f6]/15 hover:border-[#3b82f6]/30 hover:text-white"
            }`}
          >
            <div className="font-bold text-xs">{preset.title}</div>
            <div
              className={`text-[10px] font-mono ${
                activeScenarioPreset === preset.id ? "text-[#3b82f6]" : "text-[#94a3b8]/60"
              }`}
            >
              Target: {preset.state}
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid: 12-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (6 cols): Regulatory Sliders */}
        <div className="lg:col-span-6 space-y-5">
          <ScenarioControls
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onReset={handleResetParameters}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
          />

          {/* Policy Rationale Note */}
          <div className="p-4 bg-[#060e1a]/80 border border-[#3b82f6]/15 rounded-md text-xs space-y-1.5">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider font-mono block">
              Simulation Engine Framework
            </span>
            <p className="text-[11px] text-[#94a3b8] leading-relaxed">
              Projections combine multi-criteria spatial decision analysis (MCDA) with econometric revenue elasticity models calibrated against 10 years of state revenue collection records.
            </p>
          </div>
        </div>

        {/* Right Column (6 cols): Dynamic Simulation Impact Outcome */}
        <div className="lg:col-span-6 space-y-5">
          <Card variant="accent-emerald">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-white">Projected Policy Equilibrium (vs Baseline 2026)</CardTitle>
                <CardDescription>
                  Simulated outcomes on food security, state revenue, civil litigation, and ecology
                </CardDescription>
              </div>

              <Badge variant="official" size="sm" dot>
                Live Equilibrium
              </Badge>
            </CardHeader>

            <CardContent>
              <ScenarioImpactMeter metrics={simulationMetrics} />
            </CardContent>
          </Card>

          {/* AI Evidence Recommendation Summary */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Evidence-Backed Policy Synthesizer (LANDScope Advisor)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-[#030712]/90 border border-[#3b82f6]/30 rounded-md space-y-1.5 text-[#f8fafc]">
                <span className="font-bold text-[10px] uppercase tracking-wider block text-[#3b82f6] font-mono">
                  Recommended Regulatory Configuration
                </span>
                <p className="leading-relaxed">
                  Capping agricultural diversion at{" "}
                  <strong className="text-white">{conversionParam} Ha/Tehsil</strong> preserves prime double-cropped land while a{" "}
                  <strong className="text-white">{afforestParam}x afforestation multiplier</strong> offsets 100% of carbon loss without crippling industrial corridor development.
                </p>
              </div>

              <div className="p-3.5 bg-[#030712]/80 border border-white/10 rounded-md space-y-1.5 text-[#94a3b8]">
                <span className="font-bold text-[10px] uppercase tracking-wider block text-[#f59e0b] font-mono">
                  Mitigation for Revenue Loss
                </span>
                <p className="leading-relaxed">
                  The projected ₹{420 - calculatedRevenue} Crore shortfall in conversion premiums can be balanced by introducing a 0.75% green infrastructure surcharge on peri-urban logistics hubs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gazette Resolution Draft Modal */}
      <ModalDialog
        isOpen={showGazetteDraft}
        onClose={() => setShowGazetteDraft(false)}
        title="Extraordinary Gazette Notification (Draft Proposal)"
        subtitle="Ministry of Rural Development & Department of Land Resources — Proposed Policy Circular"
        badge={
          <Badge variant="official" size="sm">
            CONFIDENTIAL DRAFT
          </Badge>
        }
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowGazetteDraft(false)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Gazette Dossier (.docx)
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs text-[#f8fafc] leading-relaxed bg-[#030712] p-5 border border-[#3b82f6]/20 rounded-md font-sans">
          <div className="text-center font-bold uppercase tracking-wider border-b border-[#3b82f6]/20 pb-3">
            <div className="text-white font-mono text-sm">The Gazette of India: Extraordinary</div>
            <div className="text-[10px] font-normal font-mono text-[#3b82f6] mt-1">
              Part II — Section 3 — Sub-section (ii) • SIH26019 Working Paper
            </div>
          </div>

          <p className="text-[#94a3b8]">
            <strong className="text-white">NOTIFICATION No. LGD-2026/POLICY-04:</strong> In exercise of the powers conferred by the National Land Policy Guidelines, the Central Government hereby formulates the following draft model guidelines for state land governance:
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-xs text-[#94a3b8]">
            <li>
              <strong className="text-white">Mandatory Eco-Buffer:</strong> An inviolable buffer perimeter of{" "}
              <strong className="text-[#3b82f6]">{ecoParam} meters</strong> shall be maintained around all state-notified wetlands, sanctuary boundaries, and perennial river banks.
            </li>
            <li>
              <strong className="text-white">Agricultural Diversion Ceiling:</strong> Prime double-cropped irrigated land diversion shall not exceed{" "}
              <strong className="text-[#38bdf8]">{conversionParam} Hectares</strong> per sub-divisional administrative block per fiscal year.
            </li>
            <li>
              <strong className="text-white">Compensatory Afforestation Multiplier:</strong> Every industrial conversion sanction shall deposit funds equivalent to{" "}
              <strong className="text-[#f59e0b]">{afforestParam} times</strong> the standard CAMPA afforestation rate.
            </li>
          </ol>
        </div>
      </ModalDialog>
    </div>
  );
}
