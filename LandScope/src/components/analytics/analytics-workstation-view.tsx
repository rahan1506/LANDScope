"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Layers,
  BookOpen,
  Download,
  HelpCircle,
  ShieldAlert,
  Droplets,
  Scale,
  TreePine,
  Building2,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAnalyticsForGeography,
  AnalyticsGeographyProfile,
  AnalyticsWhyTrail,
  ANALYTICS_WHY_TRAILS,
  AnalyticalTrendInsight,
} from "@/lib/analytics/analytics-data";
import { GEOGRAPHIC_HIERARCHY } from "@/lib/gis/gis-data";

export interface AnalyticsWorkstationViewProps {
  initialState?: string;
  initialDistrict?: string;
  initialTehsil?: string;
  userRole?: string;
  onNavigateToGis?: (geoCtx: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (context?: { state: string; district: string; tehsil: string; topic?: string }) => void;
  onNavigateToReports?: (context: Record<string, unknown>) => void;
}

export function AnalyticsWorkstationView({
  initialState = "Madhya Pradesh",
  initialDistrict = "Sehore",
  initialTehsil = "Ashta",
  userRole = "POLICYMAKER",
  onNavigateToGis,
  onNavigateToResearch,
  onNavigateToReports,
}: AnalyticsWorkstationViewProps) {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedTehsil, setSelectedTehsil] = useState<string>(initialTehsil);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeWhyTrail, setActiveWhyTrail] = useState<AnalyticsWhyTrail | null>(null);

  // Sync state if initial props change
  const [prevGeoProps, setPrevGeoProps] = useState({ initialState, initialDistrict, initialTehsil });
  if (
    initialState !== prevGeoProps.initialState ||
    initialDistrict !== prevGeoProps.initialDistrict ||
    initialTehsil !== prevGeoProps.initialTehsil
  ) {
    setPrevGeoProps({ initialState, initialDistrict, initialTehsil });
    if (initialState) setSelectedState(initialState);
    if (initialDistrict) setSelectedDistrict(initialDistrict);
    if (initialTehsil) setSelectedTehsil(initialTehsil);
  }

  // Retrieve current analytics profile
  const profile: AnalyticsGeographyProfile = getAnalyticsForGeography(
    selectedState,
    selectedDistrict,
    selectedTehsil,
    selectedYear
  );

  const availableDistricts =
    GEOGRAPHIC_HIERARCHY.find((s) => s.name === selectedState)?.districts || [];
  const availableTehsils =
    availableDistricts.find((d) => d.name === selectedDistrict)?.tehsils || ["Ashta"];

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const dists = GEOGRAPHIC_HIERARCHY.find((s) => s.name === st)?.districts || [];
    if (dists.length > 0) {
      setSelectedDistrict(dists[0].name);
      setSelectedTehsil(dists[0].tehsils[0] || "Main");
    }
  };

  const handleDistrictChange = (dst: string) => {
    setSelectedDistrict(dst);
    const tehs = availableDistricts.find((d) => d.name === dst)?.tehsils || [];
    if (tehs.length > 0) {
      setSelectedTehsil(tehs[0]);
    }
  };

  const handleOpenWhy = (whyKey: string) => {
    const trail = ANALYTICS_WHY_TRAILS[whyKey] || ANALYTICS_WHY_TRAILS["why-agri-conversion"];
    setActiveWhyTrail(trail);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1700px] mx-auto select-none">
      {/* 1. Top Header */}
      <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Breadcrumbs
              items={[
                { label: "National SDI Registry" },
                { label: "Land Governance Analytics", active: true },
              ]}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-[#f8fafc] tracking-tight mt-1 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#f8fafc] via-[#e2ece8] to-[#3b82f6] bg-clip-text text-transparent">
                Land Governance Analytics
              </span>
              <Badge variant="official" size="sm" dot>
                Cross-Sector Intelligence
              </Badge>
            </h1>
            <p className="text-xs text-[#8ea79e] mt-0.5">
              Analyze land-use trends, climate resilience, governance indicators and policy outcomes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToGis && (
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  onNavigateToGis({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                  })
                }
                leftIcon={<MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />}
              >
                View on Map
              </Button>
            )}
            {onNavigateToResearch && (
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  onNavigateToResearch({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    topic: "Land-Use & Peri-Urban",
                  })
                }
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />}
              >
                Explore Supporting Research
              </Button>
            )}
            {onNavigateToReports && (
              <Button
                variant="primary"
                size="xs"
                onClick={() =>
                  onNavigateToReports({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    scenarioTitle: "Analytics Decision Brief: Land-Use & Resilience Assessment",
                  })
                }
                leftIcon={<Download className="w-3.5 h-3.5 text-[#030712]" />}
              >
                Generate Analytics Brief
              </Button>
            )}
          </div>
        </div>

        {/* Geographic & Timeline Bar */}
        <div className="mt-5 pt-3.5 border-t border-[#19386c]/30 flex flex-wrap items-center justify-between gap-3">
          {/* Geo Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-[#3b82f6] flex items-center gap-1 uppercase tracking-widest text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
              Study Area:
            </span>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="px-2.5 py-1.5 bg-[#060e1a]/90 border border-[#19386c]/50 rounded-lg font-semibold text-[#f8fafc] text-xs focus:outline-none focus:border-[#3b82f6]"
            >
              {GEOGRAPHIC_HIERARCHY.map((st) => (
                <option key={st.name} value={st.name} className="bg-[#060e1a] text-[#f8fafc]">
                  {st.name}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="px-2.5 py-1.5 bg-[#060e1a]/90 border border-[#19386c]/50 rounded-lg font-semibold text-[#f8fafc] text-xs focus:outline-none focus:border-[#3b82f6]"
            >
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name} className="bg-[#060e1a] text-[#f8fafc]">
                  {d.name}
                </option>
              ))}
            </select>

            {/* Tehsil */}
            <select
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
              className="px-2.5 py-1.5 bg-[#060e1a]/90 border border-[#19386c]/50 rounded-lg font-semibold text-[#f8fafc] text-xs focus:outline-none focus:border-[#3b82f6]"
            >
              {availableTehsils.map((t) => (
                <option key={t} value={t} className="bg-[#060e1a] text-[#f8fafc]">
                  {t} Tehsil
                </option>
              ))}
            </select>
          </div>

          {/* Timeline Buttons */}
          <div className="flex items-center gap-1.5 bg-[#030712]/90 p-1 rounded-lg border border-[#19386c]/40 text-xs shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-[#3b82f6] ml-1 mr-0.5" />
            <span className="text-[10px] font-mono font-bold text-[#8ea79e] uppercase mr-1">Year:</span>
            {[2018, 2020, 2022, 2024, 2026].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-[#3b82f6] text-[#030712] shadow-[0_0_10px_rgba(59, 130, 246,0.5)] font-bold"
                    : "text-[#a4bcaf] hover:text-[#f8fafc] hover:bg-[#0b1c38]/50"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Land-Use Trend Chart & Policy Performance */}
        <div className="lg:col-span-8 space-y-6">
          {/* VISUALIZATION 1: Multi-Temporal Land-Use Trend (2018-2026) */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#3b82f6]" />
                <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest">
                  Multi-Temporal Land-Use Trend (2018–2026)
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
                {profile.metadata.analysisType}
              </span>
            </div>

            {/* Visual Multi-Series Trend Chart */}
            <div className="p-4 bg-[#060e1a]/90 border border-[#19386c]/30 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8ea79e]">
                <span>Land-Use Distribution (% of Total 1,240 sq km Geographic Area)</span>
                <div className="flex items-center gap-3 text-[11px] font-mono font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6] inline-block shadow-[0_0_5px_rgba(59, 130, 246,0.5)]" />
                    Agriculture
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#e8b85c] inline-block shadow-[0_0_5px_rgba(232,184,92,0.5)]" />
                    Built-Up
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#10274e] inline-block" />
                    Forest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8] inline-block shadow-[0_0_5px_rgba(56, 189, 248,0.5)]" />
                    Water
                  </span>
                </div>
              </div>

              {/* Stacked Comparative Timeline Bars */}
              <div className="space-y-2.5 pt-2">
                {profile.timeSeries.map((ts) => {
                  const isCurrent = ts.year === selectedYear;
                  return (
                    <div
                      key={ts.year}
                      className={`p-3 rounded-xl transition-all duration-200 border ${
                        isCurrent
                          ? "bg-[#0b1c38]/40 border-[#3b82f6] ring-1 ring-[#3b82f6]/40 shadow-[0_0_15px_rgba(59, 130, 246,0.15)]"
                          : "bg-[#030712]/60 border-[#19386c]/20 hover:border-[#19386c]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[#f8fafc] flex items-center gap-2">
                          <span className="font-mono text-sm">{ts.year}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-[#3b82f6] bg-[#0b1c38] border border-[#3b82f6]/40 px-2 py-0.2 rounded-full font-mono font-bold">
                              Active View
                            </span>
                          )}
                        </span>
                        <div className="font-mono text-[11px] text-[#8ea79e] space-x-3">
                          <span className="text-[#3b82f6] font-bold">Agri: {ts.agriculturePct}%</span>
                          <span className="text-[#e8b85c] font-bold">Built: {ts.builtUpPct}%</span>
                          <span className="text-[#a4bcaf]">Forest: {ts.forestPct}%</span>
                          <span className="text-[#38bdf8]">Water: {ts.waterPct}%</span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="h-3.5 w-full bg-[#030712] rounded-md flex overflow-hidden border border-[#19386c]/30">
                        <div
                          style={{ width: `${ts.agriculturePct}%` }}
                          className="bg-[#3b82f6] h-full"
                          title={`Agriculture: ${ts.agriculturePct}%`}
                        />
                        <div
                          style={{ width: `${ts.builtUpPct}%` }}
                          className="bg-[#e8b85c] h-full"
                          title={`Built-up: ${ts.builtUpPct}%`}
                        />
                        <div
                          style={{ width: `${ts.forestPct}%` }}
                          className="bg-[#10274e] h-full"
                          title={`Forest: ${ts.forestPct}%`}
                        />
                        <div
                          style={{ width: `${ts.waterPct}%` }}
                          className="bg-[#38bdf8] h-full"
                          title={`Water: ${ts.waterPct}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-[#678278] font-mono flex items-center justify-between pt-1">
                <span>Methodology: Multi-temporal Sentinel-2 OBIA change detection.</span>
                <span>Spatial Reference: Ashta Revenue Cadastre (EPSG:4326)</span>
              </div>
            </div>
          </section>

          {/* VISUALIZATION 2: Policy Performance Simulation Correlation */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19386c]/30 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#3b82f6]" />
                <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest">
                  Policy Performance vs Baseline Calibration
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#e8b85c]/15 text-[#e8b85c] border border-[#e8b85c]/30 font-bold">
                {profile.climateResilience.statusLabel}
              </span>
            </div>

            <p className="text-[11.5px] text-[#8ea79e]">
              Correlating current geographic baseline against the active Policy Digital Twin simulation (
              <strong className="text-[#f8fafc]">{profile.policyPerformance.simulationResult.scenarioTitle}</strong>).
            </p>

            <div className="overflow-x-auto border border-[#19386c]/30 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060e1a]/90 text-[#8ea79e] font-mono font-bold border-b border-[#19386c]/30 text-[11px]">
                  <tr>
                    <th className="p-3">Sector Dimension</th>
                    <th className="p-3">Current Baseline</th>
                    <th className="p-3">Simulated Scenario</th>
                    <th className="p-3">Estimated Delta</th>
                    <th className="p-3 text-right">Evidence Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19386c]/20 bg-[#030712]/50">
                  {profile.policyPerformance.simulationResult.sectorImpacts.map((si, idx) => (
                    <tr key={idx} className="hover:bg-[#0b1c38]/20 transition-colors">
                      <td className="p-3 font-bold text-[#f8fafc]">{si.dimension}</td>
                      <td className="p-3 font-mono text-[#f59e0b]">{si.baselineValue}</td>
                      <td className="p-3 font-mono text-[#f8fafc] font-semibold">{si.scenarioValue}</td>
                      <td className="p-3 font-mono font-bold text-[#3b82f6]">{si.deltaText}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenWhy(si.whyExplainKey || "why-agri-conversion")}
                          className="text-[11px] text-[#38bdf8] font-semibold hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          Why?
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* VISUALIZATION 3: Trend Detection Insights (Neutral, Non-Causal) */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
                <span>Analytical Trend Signals & Observational Insights</span>
              </h2>
              <span className="text-[10px] text-[#678278] font-mono">
                Period: 2018–2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.insights.map((ins) => {
                const isInc = ins.observedTrend === "Increasing";
                const isDec = ins.observedTrend === "Decreasing";
                return (
                  <div
                    key={ins.id}
                    className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2 hover:border-[#3b82f6]/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#f8fafc] text-xs">{ins.metric}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                          isInc
                            ? "bg-[#e8b85c]/15 text-[#e8b85c] border-[#e8b85c]/30"
                            : isDec
                            ? "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30"
                            : "bg-[#030712] text-[#8ea79e] border-[#19386c]/40"
                        }`}
                      >
                        {isInc ? (
                          <TrendingUp className="w-3 h-3 text-[#e8b85c]" />
                        ) : isDec ? (
                          <TrendingDown className="w-3 h-3 text-[#38bdf8]" />
                        ) : (
                          <Minus className="w-3 h-3 text-[#8ea79e]" />
                        )}
                        <span>{ins.observedTrend} ({ins.percentageChange})</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-[#a4bcaf] leading-snug">{ins.narrative}</p>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-[#8ea79e] border-t border-[#19386c]/30">
                      <span className="italic">{ins.analyticalCaveat}</span>
                      <button
                        onClick={() => handleOpenWhy(ins.whyKey)}
                        className="text-[#38bdf8] font-mono font-semibold hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                      >
                        Evidence
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Climate Resilience & Governance Indicators */}
        <div className="lg:col-span-4 space-y-6">
          {/* Climate & Resilience Panel */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#38bdf8]" />
                <span>Climate & Resilience</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
                Model Output
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Aquifer Status Indicator */}
              <div className="p-3.5 bg-[#e47d72]/10 border border-[#e47d72]/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f8fafc]">Aquifer Depletion State</span>
                  <Badge variant="outline" size="sm" className="bg-[#e47d72]/20 text-[#e47d72] border-[#e47d72]/40">
                    {profile.climateResilience.aquiferStatus}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[#a4bcaf] text-[11px]">Recharge Score:</span>
                  <span className="font-mono font-bold text-[#e47d72]">
                    {profile.climateResilience.aquiferRechargeScore} / 100
                  </span>
                </div>
                <div className="w-full bg-[#030712] h-1.5 rounded-full overflow-hidden border border-[#19386c]/30">
                  <div
                    style={{ width: `${profile.climateResilience.aquiferRechargeScore}%` }}
                    className="bg-[#e47d72] h-full"
                  />
                </div>
              </div>

              {/* Water Stress Index */}
              <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[#8ea79e] font-mono font-bold block text-[10px] uppercase">
                    Water Stress Index
                  </span>
                  <strong className="text-[#f8fafc] font-mono text-xs">
                    {profile.climateResilience.waterStressIndex} / 100
                  </strong>
                </div>
                <Badge variant="outline" size="sm" className="border-[#19386c]/50 text-[#8ea79e]">
                  {profile.climateResilience.waterStressStatus}
                </Badge>
              </div>

              {/* Flood & Drought Vulnerability */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    Flood Exposure
                  </span>
                  <span className="font-bold text-[#f8fafc]">
                    {profile.climateResilience.floodRiskCategory} ({profile.climateResilience.floodExposureIndex}%)
                  </span>
                </div>
                <div className="p-2.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    Drought Hazard
                  </span>
                  <span className="font-bold text-[#e47d72]">
                    {profile.climateResilience.droughtVulnerability}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Cadastral Governance Panel */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#3b82f6]" />
                <span>Cadastral Governance Signals</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#060e1a] text-[#8ea79e] border border-[#19386c]/40">
                Demo Dataset
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#a4bcaf] font-semibold">Cadastral Formalization:</span>
                  <span className="font-mono font-bold text-[#3b82f6]">
                    {profile.governance.cadastralFormalizationPct}%
                  </span>
                </div>
                <div className="w-full bg-[#030712] h-1.5 rounded-full overflow-hidden border border-[#19386c]/30">
                  <div
                    style={{ width: `${profile.governance.cadastralFormalizationPct}%` }}
                    className="bg-[#3b82f6] h-full shadow-[0_0_10px_rgba(59, 130, 246,0.5)]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#a4bcaf] font-semibold">Title Mutation Dispute Rate:</span>
                  <span className="font-mono font-bold text-[#e8b85c]">
                    {profile.governance.disputeRatePct}%
                  </span>
                </div>
                <span className="text-[10px] text-[#678278] block mt-0.5 font-mono">
                  Annual Court Plaints: {profile.governance.annualLitigationPlaints} cases
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    Mutation Turnaround
                  </span>
                  <span className="font-bold text-[#f8fafc] font-mono">
                    {profile.governance.averageMutationDays} Days
                  </span>
                </div>
                <div className="p-2.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    SVAMITVA Coverage
                  </span>
                  <span className="font-bold text-[#3b82f6] font-mono">
                    {profile.governance.svamitvaTitleDeedCoveragePct}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting Evidence References */}
          <section className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest flex items-center gap-2 border-b border-[#19386c]/30 pb-3">
              <BookOpen className="w-4 h-4 text-[#3b82f6]" />
              <span>Evidence Basis</span>
            </h2>
            <div className="space-y-2 text-[11px]">
              {profile.supportingEvidence.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
                  <strong className="block text-[#f8fafc] font-semibold truncate">{ev.title}</strong>
                  <span className="text-[10px] text-[#8ea79e] block font-mono">
                    {ev.authorOrOrg} ({ev.year}) • <span className="text-[#38bdf8]">{ev.evidenceStatus}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 3. "Why?" Explainability Modal */}
      {activeWhyTrail && (
        <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-floating border border-[#3b82f6]/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-[#19386c]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#3b82f6] bg-[#0b1c38] px-2.5 py-0.5 rounded-full border border-[#3b82f6]/40">
                  Evidence Traceability Modal
                </span>
                <h3 className="text-base font-bold text-[#f8fafc] mt-1.5">
                  {activeWhyTrail.metric}
                </h3>
              </div>
              <button
                onClick={() => setActiveWhyTrail(null)}
                className="text-[#8ea79e] hover:text-[#f8fafc] p-1.5 rounded-lg bg-[#060e1a] border border-[#19386c]/40 hover:bg-[#0b1c38]/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#0b1c38]/40 border border-[#3b82f6]/30 rounded-xl text-xs text-[#3b82f6] font-semibold">
              {activeWhyTrail.question}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase tracking-wider block">
                  Observed Pattern / Model Relationship
                </span>
                <p className="text-[#f8fafc] mt-1 leading-snug">{activeWhyTrail.observedTrend}</p>
              </div>

              <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/40 rounded-xl space-y-1.5">
                <span className="text-[10px] text-[#3b82f6] font-mono font-bold uppercase tracking-wider block">
                  Attached Empirical Research Source
                </span>
                <strong className="text-[#f8fafc] block font-semibold">
                  {activeWhyTrail.researchSource.title}
                </strong>
                <p className="text-[11px] text-[#8ea79e] italic border-l-2 border-[#3b82f6]/30 pl-3 my-1">
                  &ldquo;{activeWhyTrail.researchSource.quote}&rdquo;
                </p>
                <div className="text-[10px] text-[#678278] pt-1 font-mono">
                  <span>{activeWhyTrail.researchSource.organization} ({activeWhyTrail.researchSource.year})</span>
                  <span className="mx-1.5">•</span>
                  <span className="text-[#38bdf8]">Ref: {activeWhyTrail.researchSource.reference}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    Spatial Layer
                  </span>
                  <p className="text-[#f8fafc] mt-0.5">{activeWhyTrail.spatialLayer}</p>
                </div>
                <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl">
                  <span className="text-[10px] text-[#8ea79e] font-mono font-bold uppercase block">
                    Analysis Method
                  </span>
                  <p className="text-[#f8fafc] mt-0.5">{activeWhyTrail.analysisMethod}</p>
                </div>
              </div>

              <div className="p-3 bg-[#e8b85c]/10 border border-[#e8b85c]/30 rounded-xl text-[11px] text-[#e8b85c] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#e8b85c]" />
                  Model Limitations & Ground Truth Requirement:
                </span>
                <p className="text-[#f8fafc]/80">{activeWhyTrail.limitations}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#19386c]/30">
              <Button variant="outline" size="sm" onClick={() => setActiveWhyTrail(null)}>
                Close Evidence Trace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
