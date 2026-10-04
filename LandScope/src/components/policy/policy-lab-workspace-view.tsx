"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  FileText,
  BookOpen,
  MapPin,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_POLICY_PARAMETERS,
  PolicyParameter,
  BaselineProfile,
  getBaselineForGeography,
  runSimulationEngine,
  SimulationResult,
  SimulationEvidenceTrail,
  POLICY_EXPLAINABILITY_TRAILS,
  SCENARIO_ALTERNATIVES,
  StressCondition,
} from "@/lib/policy/policy-twin-data";
import { PolicyTwinVisual } from "./policy-twin-visual";
import { PolicyWhyModal } from "./policy-why-modal";
import { PolicyAlternativesTable } from "./policy-alternatives-table";
import { PolicyStressTestCard } from "./policy-stress-test-card";
import { EvidenceItem } from "@/lib/research/research-data";

export interface PolicyLabWorkspaceViewProps {
  initialState?: string;
  initialDistrict?: string;
  initialTehsil?: string;
  userRole?: string;
  onNavigateToReports?: (context: Record<string, unknown>) => void;
  onNavigateToResearch?: (referenceNumber?: string) => void;
}

export function PolicyLabWorkspaceView({
  initialState = "Madhya Pradesh",
  initialDistrict = "Sehore",
  initialTehsil = "Ashta",
  userRole = "POLICYMAKER",
  onNavigateToReports,
  onNavigateToResearch,
}: PolicyLabWorkspaceViewProps) {
  // Scenario Metadata State
  const [scenarioTitle, setScenarioTitle] = useState("Controlled Peri-Urban Expansion 2031");
  const [policyCategory, setPolicyCategory] = useState("Land-Use Planning & Agro-Preservation");
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedTehsil, setSelectedTehsil] = useState(initialTehsil);

  // Baseline and Parameters
  const [baseline, setBaseline] = useState<BaselineProfile>(() =>
    getBaselineForGeography(initialState, initialDistrict, initialTehsil)
  );
  const [parameters, setParameters] = useState<PolicyParameter[]>(DEFAULT_POLICY_PARAMETERS);
  const [stressCondition, setStressCondition] = useState<StressCondition>("Normal Conditions");
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Output
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => {
    const pMap: Record<string, number> = {};
    DEFAULT_POLICY_PARAMETERS.forEach((p) => {
      pMap[p.id] = p.value;
    });
    return runSimulationEngine(
      getBaselineForGeography(initialState, initialDistrict, initialTehsil),
      pMap,
      "Normal Conditions",
      "Controlled Peri-Urban Expansion 2031"
    );
  });

  // Modal State
  const [activeWhyTrail, setActiveWhyTrail] = useState<SimulationEvidenceTrail | null>(null);

  // Sync when initial geography changes from GIS
  const [prevGeo, setPrevGeo] = useState({ initialState, initialDistrict, initialTehsil });
  if (
    initialState !== prevGeo.initialState ||
    initialDistrict !== prevGeo.initialDistrict ||
    initialTehsil !== prevGeo.initialTehsil
  ) {
    setPrevGeo({ initialState, initialDistrict, initialTehsil });
    if (initialState) setSelectedState(initialState);
    if (initialDistrict) setSelectedDistrict(initialDistrict);
    if (initialTehsil) setSelectedTehsil(initialTehsil);
    setBaseline(getBaselineForGeography(initialState, initialDistrict, initialTehsil));
  }

  const handleParameterChange = (paramId: string, val: number) => {
    setParameters((prev) =>
      prev.map((p) => (p.id === paramId ? { ...p, value: val } : p))
    );
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const pMap: Record<string, number> = {};
      parameters.forEach((p) => {
        pMap[p.id] = p.value;
      });
      const result = runSimulationEngine(baseline, pMap, stressCondition, scenarioTitle);
      setSimulationResult(result);
      setIsSimulating(false);
    }, 400);
  };

  const handleLoadPreset = (presetKey: "baseline" | "scenarioA" | "scenarioB") => {
    const preset = SCENARIO_ALTERNATIVES[presetKey];
    if (!preset) return;

    setScenarioTitle(preset.title);
    setParameters((prev) =>
      prev.map((p) => {
        const val = preset.parameters[p.id as keyof typeof preset.parameters];
        return val !== undefined ? { ...p, value: val } : p;
      })
    );

    // Re-run simulation with preset
    const pMap = { ...preset.parameters };
    const result = runSimulationEngine(baseline, pMap, stressCondition, preset.title);
    setSimulationResult(result);
  };

  const handleStressChange = (stress: StressCondition) => {
    setStressCondition(stress);
    const pMap: Record<string, number> = {};
    parameters.forEach((p) => {
      pMap[p.id] = p.value;
    });
    const result = runSimulationEngine(baseline, pMap, stress, scenarioTitle);
    setSimulationResult(result);
  };

  const handleOpenWhy = (key: string) => {
    const trail = POLICY_EXPLAINABILITY_TRAILS[key] || POLICY_EXPLAINABILITY_TRAILS["why-agriculture"];
    setActiveWhyTrail(trail);
  };

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto pb-12 select-none">
      {/* 1. Header with Preserved Geographic Context */}
      <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#19386c]/30 pb-3">
          <div>
            <Breadcrumbs
              items={[
                { label: "National SDI Registry" },
                { label: "Policy Decision Workspace" },
                { label: "Policy Digital Twin Lab", active: true },
              ]}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-[#f8fafc] tracking-tight mt-1 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#f8fafc] via-[#e2ece8] to-[#3b82f6] bg-clip-text text-transparent">
                Policy Digital Twin Lab
              </span>
              <Badge variant="official" size="sm" dot>
                Predictive Simulation Engine
              </Badge>
            </h1>
            <p className="text-xs text-[#8ea79e] mt-0.5">
              Simulate spatial zoning trade-offs, calibrate empirical evidence, and model multi-dimensional policy outcomes (SIH26019).
            </p>
          </div>

          {/* Preserved Geography Context Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2.5 bg-[#060e1a]/90 border border-[#19386c]/50 rounded-xl text-xs flex items-center gap-2.5 shadow-inner">
              <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0" />
              <div>
                <span className="text-[10px] text-[#3b82f6] font-mono font-bold uppercase tracking-widest block">
                  Scenario Geography
                </span>
                <strong className="text-[#f8fafc] text-xs">
                  {selectedTehsil} Tehsil, {selectedDistrict}, {selectedState}
                </strong>
              </div>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                if (onNavigateToReports) {
                  onNavigateToReports({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    scenarioTitle,
                    simulationResult,
                  });
                }
              }}
              leftIcon={<Download className="w-3.5 h-3.5 text-[#3b82f6]" />}
            >
              Generate Policy Brief
            </Button>
          </div>
        </div>

        {/* 2. Visual Digital Twin Continuum Bar */}
        <PolicyTwinVisual
          activeStage={4}
          geographyName={`${selectedDistrict}, ${selectedState}`}
        />
      </div>

      {/* 3. CURRENT BASELINE OVERVIEW */}
      <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest">
              Current Geographic Baseline (Pre-Simulation Calibration)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#060e1a] text-[#8ea79e] border border-[#19386c]/40">
              Reference Year: 2026
            </span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
            Illustrative Demo Dataset
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Baseline Land-Use Profile */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2">
            <span className="text-[10px] text-[#3b82f6] font-mono font-bold uppercase tracking-wider block">
              Land-Use Profile
            </span>
            <div className="space-y-1 text-[11px] text-[#a4bcaf]">
              <div className="flex justify-between">
                <span>Agriculture:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.landUse.agriculturePct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Built-up / Urban:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.landUse.builtUpPct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Forest & Buffer:</span>
                <strong className="font-mono text-[#3b82f6]">{baseline.landUse.forestPct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bodies:</span>
                <strong className="font-mono text-[#38bdf8]">{baseline.landUse.waterPct}%</strong>
              </div>
            </div>
          </div>

          {/* Environmental Indicators */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2">
            <span className="text-[10px] text-[#38bdf8] font-mono font-bold uppercase tracking-wider block">
              Environmental Indicators
            </span>
            <div className="space-y-1 text-[11px] text-[#a4bcaf]">
              <div className="flex justify-between">
                <span>Aquifer Recharge:</span>
                <span className="text-[#e47d72] font-bold font-mono">
                  {baseline.environment.aquiferRechargeIndex} / 100 ({baseline.environment.aquiferStatus})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Forest Buffer Health:</span>
                <strong className="font-mono text-[#3b82f6]">{baseline.environment.forestBufferHealth}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Drought Risk Rating:</span>
                <strong className="text-[#e8b85c] font-mono">{baseline.environment.droughtRisk}</strong>
              </div>
            </div>
          </div>

          {/* Infrastructure Context */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2">
            <span className="text-[10px] text-[#f59e0b] font-mono font-bold uppercase tracking-wider block">
              Infrastructure Context
            </span>
            <div className="space-y-1 text-[11px] text-[#a4bcaf]">
              <div className="flex justify-between">
                <span>Road Network Density:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.infrastructure.roadDensityKmPerSqKm} km/km²</strong>
              </div>
              <div className="flex justify-between">
                <span>Logistics Capacity:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.infrastructure.logisticsCapacityPct}% Active</strong>
              </div>
              <div className="flex justify-between">
                <span>Corridor Axis:</span>
                <strong className="text-[#f59e0b]">NH-46 Transit Ribbon</strong>
              </div>
            </div>
          </div>

          {/* Governance Indicators */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2">
            <span className="text-[10px] text-[#3b82f6] font-mono font-bold uppercase tracking-wider block">
              Governance Indicators
            </span>
            <div className="space-y-1 text-[11px] text-[#a4bcaf]">
              <div className="flex justify-between">
                <span>Cadastral Formalization:</span>
                <strong className="text-[#3b82f6] font-bold font-mono">
                  {baseline.governance.cadastralFormalizationPct}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Dispute Pendency Rate:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.governance.disputeRatePct}% of parcels</strong>
              </div>
              <div className="flex justify-between">
                <span>Mutation Latency:</span>
                <strong className="font-mono text-[#f8fafc]">{baseline.governance.mutationLatencyDays} Days</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCENARIO BUILDER: Meaningful Policy Parameters (No excessive sliders) */}
      <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#3b82f6]" />
              <span>Policy Scenario Builder & Parameter Tuning</span>
            </h2>
            <p className="text-[11px] text-[#8ea79e] mt-0.5">
              Tune statutory zoning thresholds and regulatory moratorium caps
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleLoadPreset("scenarioA")}
              leftIcon={<RotateCcw className="w-3 h-3 text-[#8ea79e]" />}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              {isSimulating ? "Simulating..." : "Run Scenario Simulation"}
            </Button>
          </div>
        </div>

        {/* Scenario Name & Category Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#19386c]/30 text-xs">
          <div>
            <label className="block text-[#a4bcaf] font-mono text-[11px] uppercase tracking-wider mb-1.5">Scenario Name:</label>
            <input
              type="text"
              value={scenarioTitle}
              onChange={(e) => setScenarioTitle(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-[#030712]/80 border border-[#19386c]/40 rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/40 transition-all font-sans"
            />
          </div>
          <div>
            <label className="block text-[#a4bcaf] font-mono text-[11px] uppercase tracking-wider mb-1.5">Policy Category:</label>
            <input
              type="text"
              value={policyCategory}
              onChange={(e) => setPolicyCategory(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-[#030712]/80 border border-[#19386c]/40 rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/40 transition-all font-sans"
            />
          </div>
        </div>

        {/* 5 Meaningful Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {parameters.map((param) => (
            <div
              key={param.id}
              className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2.5 flex flex-col justify-between hover:border-[#3b82f6]/30 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-[#f8fafc] font-bold text-xs">{param.name}</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/30 font-bold shrink-0">
                    {param.unit}
                  </span>
                </div>
                <p className="text-[10.5px] text-[#8ea79e] leading-snug">{param.description}</p>
              </div>

              {/* Slider & Value row */}
              <div className="space-y-2 pt-2 border-t border-[#19386c]/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#678278] text-[10px] font-mono">
                    Baseline: <strong className="text-[#a4bcaf]">{param.baseline}</strong>
                  </span>
                  <span className="text-[#3b82f6] font-bold font-mono text-sm">
                    {param.value} {param.unit}
                  </span>
                </div>

                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                  className="w-full accent-[#3b82f6] cursor-pointer"
                />

                <div className="p-2 bg-[#0b1c38]/30 border border-[#3b82f6]/20 rounded-lg text-[10px] text-[#3b82f6] leading-tight">
                  <strong className="text-[#f8fafc]">Why it matters:</strong> {param.whyItMatters}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MULTI-DIMENSIONAL IMPACT ENGINE: BASELINE VS SCENARIO (6 Sectors) */}
      <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#38bdf8]" />
              <span>Multi-Dimensional Impact Engine: Baseline vs Scenario</span>
            </h2>
            <p className="text-[11px] text-[#8ea79e] mt-0.5">
              Always comparing current planning trajectory against simulated policy scenario
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
            Illustrative Model Output
          </span>
        </div>

        {/* 6 Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {simulationResult.sectorImpacts.map((sector) => (
            <div
              key={sector.dimension}
              className="p-4 bg-[#060e1a]/90 border border-[#19386c]/40 hover:border-[#3b82f6]/50 rounded-xl shadow-lg space-y-2.5 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8ea79e]">
                    {sector.dimension}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      sector.isPositive
                        ? "bg-[#0b1c38] text-[#3b82f6] border-[#3b82f6]/40"
                        : "bg-[#e8b85c]/10 text-[#e8b85c] border-[#e8b85c]/40"
                    }`}
                  >
                    {sector.deltaText}
                  </span>
                </div>

                <strong className="text-sm font-bold text-[#f8fafc] block leading-snug">
                  {sector.headlineMetric}
                </strong>

                {/* Baseline vs Scenario comparison box */}
                <div className="p-2.5 bg-[#030712]/80 border border-[#19386c]/30 rounded-lg space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#8ea79e]">Baseline:</span>
                    <span className="font-mono text-[#f59e0b]">{sector.baselineValue}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#19386c]/30 pt-1">
                    <span className="text-[#8ea79e] font-semibold">Scenario:</span>
                    <span className="font-mono text-[#3b82f6] font-bold">{sector.scenarioValue}</span>
                  </div>
                </div>

                <p className="text-[10.5px] text-[#a4bcaf] leading-snug">{sector.description}</p>
              </div>

              {/* "Why?" Button on each simulation result */}
              <div className="pt-2.5 border-t border-[#19386c]/30 flex items-center justify-between">
                <span className="text-[10px] text-[#678278] font-mono">
                  Conf: {sector.confidenceScore}%
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenWhy(sector.whyExplainKey)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0b1c38]/50 hover:bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/30 font-bold text-[10px] transition-colors"
                >
                  <HelpCircle className="w-3 h-3 text-[#3b82f6]" />
                  <span>Why? (Evidence Trail)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. POLICY TRADE-OFFS & RELATIONSHIPS */}
      <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#e8b85c]" />
              <span>Simulated Policy Trade-Offs & Interdependencies</span>
            </h2>
            <p className="text-[11px] text-[#8ea79e] mt-0.5">
              Inter-sectoral tensions: Ecological and agricultural protections may correspond with constrained commercial capacity
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#060e1a] text-[#8ea79e] border border-[#19386c]/40">
            Calibrated Model Dynamics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {simulationResult.tradeOffs.map((to) => (
            <div
              key={to.id}
              className="p-4 bg-[#e8b85c]/5 border border-[#e8b85c]/25 rounded-xl space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e8b85c]/15 text-[#e8b85c] font-bold border border-[#e8b85c]/30">
                    Trade-Off: {to.severity}
                  </span>
                </div>
                <strong className="text-xs font-bold text-[#f8fafc] block leading-snug">
                  {to.primaryBenefit}
                </strong>
                <p className="text-[11px] text-[#e8b85c] font-medium">
                  &harr; {to.correspondingCost}
                </p>
                <p className="text-[10.5px] text-[#a4bcaf] leading-snug">{to.rationale}</p>
              </div>

              <div className="pt-2 border-t border-[#e8b85c]/20 text-[10px] text-[#8ea79e] italic font-mono">
                Citation: {to.evidenceCitation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. EVIDENCE USED SECTION */}
      <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3b82f6]" />
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest">
              Evidence Used in This Simulation ({simulationResult.evidenceUsed.length})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              if (onNavigateToResearch) onNavigateToResearch();
            }}
          >
            View Supporting Research
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {simulationResult.evidenceUsed.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2 flex flex-col justify-between hover:border-[#3b82f6]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] font-bold uppercase border border-[#3b82f6]/30">
                    {ev.type}
                  </span>
                  <span className="text-[9px] font-mono text-[#38bdf8]">Ref: {ev.referenceNumber}</span>
                </div>
                <strong className="text-xs font-semibold text-[#f8fafc] block leading-snug line-clamp-2">
                  {ev.title}
                </strong>
                <span className="text-[11px] text-[#8ea79e] block mt-0.5">
                  {ev.authorOrOrg} • {ev.year}
                </span>
              </div>

              <div className="pt-2 border-t border-[#19386c]/30 flex items-center justify-between">
                <span className="text-[10px] text-[#3b82f6] font-bold font-mono">
                  {ev.confidenceScore}% Confidence
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToResearch) onNavigateToResearch(ev.referenceNumber);
                  }}
                  className="text-[10px] text-[#38bdf8] font-semibold hover:underline"
                >
                  Inspect Study &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. POLICY ALTERNATIVES SIDE-BY-SIDE TABLE */}
      <PolicyAlternativesTable onSelectPreset={handleLoadPreset} />

      {/* 9. POLICY STRESS-TESTING SANDBOX */}
      <PolicyStressTestCard
        selectedStress={stressCondition}
        onSelectStress={handleStressChange}
      />

      {/* Policy Why Modal */}
      <PolicyWhyModal
        trail={activeWhyTrail}
        isOpen={activeWhyTrail !== null}
        onClose={() => setActiveWhyTrail(null)}
        onViewResearch={(ref) => {
          if (onNavigateToResearch) onNavigateToResearch(ref);
        }}
      />
    </div>
  );
}
