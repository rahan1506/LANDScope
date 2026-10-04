"use client";

import React from "react";
import {
  GeoIntelligenceData,
  EvidenceTrail,
  EVIDENCE_TRAILS,
} from "@/lib/gis/gis-data";
import { EvidenceItem } from "@/lib/research/research-data";
import { SelectedGeography } from "@/lib/gis/selected-geography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Compass,
  Scale,
  FolderPlus,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
  Radio,
} from "lucide-react";

interface GisIntelligencePanelProps {
  intelligence: GeoIntelligenceData;
  relatedEvidence: EvidenceItem[];
  selectedYear: number;
  userRole: string;
  currentTier?: "country" | "state" | "district" | "tehsil";
  selectedState?: string;
  selectedDistrict?: string;
  selectedTehsil?: string;
  selectedGeography?: SelectedGeography;
  onDrillDownToDemo?: () => void;
  onOpenEvidenceTrail: (trail: EvidenceTrail) => void;
  onOpenEvidenceDetail: (evidence: EvidenceItem) => void;
  onAddToProject: (evidence: EvidenceItem) => void;
  onTestPolicyScenario: (geographyContext: {
    state: string;
    district: string;
    tehsil: string;
    year: number;
    builtUpPct: number;
    agriculturePct: number;
    source?: string;
  }) => void;
  onNavigateToReports: (geographyContext: {
    state: string;
    district: string;
    tehsil: string;
    source?: string;
  }) => void;
  onNavigateToResearch: (context?: SelectedGeography) => void;
  onNavigateToAnalytics?: (context?: SelectedGeography) => void;
}

export function GisIntelligencePanel({
  intelligence,
  relatedEvidence,
  selectedYear,
  userRole,
  currentTier = "tehsil",
  selectedState,
  selectedDistrict,
  selectedTehsil,
  selectedGeography,
  onDrillDownToDemo,
  onOpenEvidenceTrail,
  onOpenEvidenceDetail,
  onAddToProject,
  onTestPolicyScenario,
  onNavigateToReports,
  onNavigateToResearch,
  onNavigateToAnalytics,
}: GisIntelligencePanelProps) {
  const { geography, landUse, environment, infrastructure, governance, trends } = intelligence;

  const handleOpenUrbanTrail = () => {
    const trail = EVIDENCE_TRAILS["urban-expansion-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  const handleOpenWaterTrail = () => {
    const trail = EVIDENCE_TRAILS["aquifer-stress-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  const handleOpenDisputeTrail = () => {
    const trail = EVIDENCE_TRAILS["dispute-reduction-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* 1. Selected Geography Header & Key Cross-Module CTA */}
      <div className="bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-4 shadow-xl space-y-3.5">
        {/* Tier Hierarchy Breadcrumb Pill */}
        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#3b82f6]/10">
          <span className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] animate-pulse" />
            {currentTier === "country"
              ? "TIER 0 • NATIONAL LEVEL (INDIA)"
              : currentTier === "state"
              ? `TIER 1 • STATE (${selectedState || geography.state})`
              : currentTier === "district"
              ? `TIER 2 • DISTRICT (${selectedDistrict || geography.district})`
              : `TIER 3 • LOCAL CADASTRAL (${selectedTehsil || geography.tehsil})`}
          </span>
          {currentTier !== "tehsil" && onDrillDownToDemo && (
            <button
              type="button"
              onClick={onDrillDownToDemo}
              className="text-[10px] font-mono font-bold text-[#3b82f6] hover:underline cursor-pointer"
            >
              Jump to Ashta Demo &rarr;
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3b82f6]/10 pb-3">
          <div>
            <span className="text-[10px] text-[#94a3b8] font-mono font-bold uppercase tracking-wider block">
              {selectedGeography?.placeName
                ? `${selectedGeography.placeName.toUpperCase()} LAND INTELLIGENCE`
                : currentTier === "country"
                ? "NATIONAL LAND INTELLIGENCE"
                : currentTier === "state"
                ? "REGIONAL LAND INTELLIGENCE"
                : currentTier === "district"
                ? "DISTRICT LAND INTELLIGENCE"
                : "LOCAL LAND INTELLIGENCE"}
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <MapPin className="w-4 h-4 text-[#3b82f6]" />
              <span>
                {selectedGeography?.placeName || (currentTier === "country" ? "India" : currentTier === "state" ? (selectedState || geography.state) : `${selectedTehsil || geography.tehsil}, ${selectedDistrict || geography.district}`)}
              </span>
              <span className="text-xs font-normal text-[#94a3b8]">
                ({selectedGeography?.state || selectedState || geography.state})
              </span>
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#94a3b8] uppercase font-mono font-semibold block">
              Dataset Origin
            </span>
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/25">
              Illustrative LANDScope Demo Dataset
            </span>
          </div>
        </div>

        {/* Primary Action Bridge: Research, Policy, Analytics & Reports */}
        <div className="p-3.5 bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#3b82f6]" />
              <strong className="text-xs font-mono font-bold text-white tracking-wide">
                SPATIAL INTELLIGENCE ACTIONS
              </strong>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#93c5fd] border border-[#3b82f6]/30 font-bold">
              Active Context
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] leading-snug">
            Connected GIS intelligence for {selectedGeography?.placeName || selectedDistrict || selectedState || "this region"}. Pass active geography to research, policy simulator, or analytics.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <Button
              variant="saffron"
              size="xs"
              onClick={() => onNavigateToResearch(selectedGeography)}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Research This Region
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                onTestPolicyScenario({
                  state: selectedGeography?.state || geography.state,
                  district: selectedGeography?.district || geography.district,
                  tehsil: selectedGeography?.tehsil || geography.tehsil,
                  year: selectedYear,
                  builtUpPct: landUse.builtUpPct,
                  agriculturePct: landUse.agriculturePct,
                  source: "GIS",
                })
              }
              leftIcon={<Scale className="w-3.5 h-3.5 text-[#38bdf8]" />}
              className="text-[#38bdf8] border-[#38bdf8]/30 hover:border-[#38bdf8]"
            >
              Test Policy Scenario (Digital Twin)
            </Button>
            {onNavigateToAnalytics && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onNavigateToAnalytics(selectedGeography)}
                leftIcon={<TrendingUp className="w-3.5 h-3.5 text-[#3b82f6]" />}
              >
                View Analytics
              </Button>
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                onNavigateToReports({
                  state: selectedGeography?.state || geography.state,
                  district: selectedGeography?.district || geography.district,
                  tehsil: selectedGeography?.tehsil || geography.tehsil,
                  source: "GIS",
                })
              }
              leftIcon={<FileText className="w-3.5 h-3.5 text-[#94a3b8]" />}
            >
              Generate Brief
            </Button>
          </div>
        </div>

        {/* Quick Regional Stats Strip */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#030712]/70 border border-[#3b82f6]/15 rounded">
            <span className="text-[10px] text-[#94a3b8] font-mono uppercase font-semibold block">
              Spatial Extent
            </span>
            <strong className="text-white font-tabular font-mono text-sm">
              {geography.areaSqKm.toLocaleString()}
            </strong>
            <span className="text-[#94a3b8] text-[11px] ml-1">sq km</span>
          </div>
          <div className="p-2.5 bg-[#030712]/70 border border-[#3b82f6]/15 rounded">
            <span className="text-[10px] text-[#94a3b8] font-mono uppercase font-semibold block">
              Cadastral Parcels
            </span>
            <strong className="text-white font-tabular font-mono text-sm">
              {geography.totalParcels.toLocaleString()}
            </strong>
            <span className="text-[#94a3b8] text-[11px] ml-1">Khasras</span>
          </div>
        </div>
      </div>

      {/* 2. Land-Use Profile & Directional Trend Intelligence */}
      <div className="bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#3b82f6]/10 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#3b82f6]" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Land-Use Profile & Trend Intelligence
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f59e0b]/15 text-[#fde68a] border border-[#f59e0b]/30 font-semibold">
            Illustrative Demo
          </span>
        </div>

        {/* Land-Use Progress Stack */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#030712] rounded-full overflow-hidden flex border border-[#3b82f6]/20">
            <div
              style={{ width: `${landUse.agriculturePct}%` }}
              className="bg-[#f59e0b] transition-all duration-500"
              title={`Agriculture: ${landUse.agriculturePct}%`}
            />
            <div
              style={{ width: `${landUse.builtUpPct}%` }}
              className="bg-[#38bdf8] transition-all duration-500"
              title={`Built-up: ${landUse.builtUpPct}%`}
            />
            <div
              style={{ width: `${landUse.forestPct}%` }}
              className="bg-[#3b82f6] transition-all duration-500"
              title={`Forest: ${landUse.forestPct}%`}
            />
            <div
              style={{ width: `${landUse.waterPct}%` }}
              className="bg-[#2563eb] transition-all duration-500"
              title={`Water: ${landUse.waterPct}%`}
            />
          </div>

          {/* 4 Interactive Land Use Trend Cards with "Why?" Evidence Trails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            {/* Agriculture */}
            <div className="p-2.5 bg-[#030712]/80 border border-[#f59e0b]/20 rounded space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
                  <span>Agriculture</span>
                </span>
                <span className="font-bold text-white font-tabular font-mono">
                  {landUse.agriculturePct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-0.5">
                <span className="flex items-center gap-1 text-[#e47d72] font-semibold font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{trends.agriculture.changePct}%</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenUrbanTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060e1a] border border-[#3b82f6]/30 text-[10px] text-[#3b82f6] font-mono hover:bg-[#0b1c38] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>

            {/* Built-up / Urban */}
            <div className="p-2.5 bg-[#030712]/80 border border-[#38bdf8]/20 rounded space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0" />
                  <span>Built-up / Urban</span>
                </span>
                <span className="font-bold text-white font-tabular font-mono">
                  {landUse.builtUpPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-0.5">
                <span className="flex items-center gap-1 text-[#38bdf8] font-bold font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{trends.builtUp.changePct}% (Fast)</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenUrbanTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060e1a] border border-[#38bdf8]/30 text-[10px] text-[#38bdf8] font-mono hover:bg-[#10242b] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>

            {/* Forest */}
            <div className="p-2.5 bg-[#030712]/80 border border-[#3b82f6]/20 rounded space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
                  <span>Forest & Eco-Buffer</span>
                </span>
                <span className="font-bold text-white font-tabular font-mono">
                  {landUse.forestPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-0.5">
                <span className="flex items-center gap-1 text-[#3b82f6] font-mono">
                  <Minus className="w-3.5 h-3.5" />
                  <span>Stable (Geo-fenced)</span>
                </span>
                <span className="text-[10px] text-[#94a3b8]/60 font-mono">FSI Protected</span>
              </div>
            </div>

            {/* Water */}
            <div className="p-2.5 bg-[#030712]/80 border border-[#2563eb]/30 rounded space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                  <span>Water Bodies</span>
                </span>
                <span className="font-bold text-white font-tabular font-mono">
                  {landUse.waterPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-0.5">
                <span className="flex items-center gap-1 text-[#e47d72] font-semibold font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{trends.water.changePct}% Aquifer</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenWaterTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060e1a] border border-[#3b82f6]/30 text-[10px] text-[#3b82f6] font-mono hover:bg-[#0b1c38] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Environmental & Governance Multi-Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Environmental Indicators */}
        <div className="bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-3.5 shadow-xl space-y-2.5">
          <span className="text-[10px] text-[#94a3b8] font-mono font-bold uppercase tracking-wider block">
            Environmental Indicators
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Aquifer Recharge Index:</span>
              <span
                className={`font-bold font-tabular font-mono px-2 py-0.5 rounded text-[11px] ${
                  environment.aquiferStatus === "Critical"
                    ? "bg-[#e47d72]/15 text-[#ff9f96] border border-[#e47d72]/30"
                    : "bg-[#3b82f6]/15 text-[#93c5fd] border border-[#3b82f6]/30"
                }`}
              >
                {environment.aquiferRechargeIndex} / 100 ({environment.aquiferStatus})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Forest Buffer Health:</span>
              <strong className="text-white font-tabular font-mono">
                {environment.forestBufferHealth}%
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Drought Vulnerability:</span>
              <strong className="text-[#e8b85c] font-mono">{environment.droughtVulnerability}</strong>
            </div>
          </div>
        </div>

        {/* Governance & Titling Indicators */}
        <div className="bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-3.5 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#94a3b8] font-mono font-bold uppercase tracking-wider block">
              Governance & Titling
            </span>
            <button
              type="button"
              onClick={handleOpenDisputeTrail}
              className="text-[10px] text-[#3b82f6] font-mono font-semibold hover:underline cursor-pointer"
            >
              Why disputes fell?
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Cadastral Formalization:</span>
              <strong className="text-[#3b82f6] font-bold font-tabular font-mono">
                {governance.cadastralFormalizationPct}%
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Dispute Pendency Rate:</span>
              <strong className="text-white font-tabular font-mono">
                {governance.disputePendencyRate}% of parcels
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Avg Mutation Latency:</span>
              <strong className="text-white font-tabular font-mono">
                {governance.averageMutationDays} Days
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Related Research Evidence for Selected Geography */}
      <div className="bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#3b82f6]/10 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3b82f6]" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Related Research Evidence ({relatedEvidence.length})
            </h3>
          </div>
          <Button variant="ghost" size="xs" onClick={() => onNavigateToResearch(selectedGeography)}>
            Explore All Evidence
          </Button>
        </div>

        {relatedEvidence.length === 0 ? (
          <p className="text-[#94a3b8] italic text-center py-4 font-mono text-[11px]">
            No research evidence indexed for this geography yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {relatedEvidence.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#030712]/80 border border-[#3b82f6]/15 rounded space-y-1.5 text-xs hover:border-[#3b82f6]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-white font-semibold leading-snug line-clamp-2">
                    {item.title}
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#93c5fd] border border-[#3b82f6]/30 font-bold shrink-0">
                    {item.confidenceScore}% Conf
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">
                  {item.authorOrOrg} • {item.year} • Ref: {item.referenceNumber}
                </p>

                <div className="pt-1.5 flex items-center justify-end gap-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onOpenEvidenceDetail(item)}
                  >
                    Open Evidence
                  </Button>
                  {userRole === "RESEARCHER" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onAddToProject(item)}
                      leftIcon={<FolderPlus className="w-3 h-3 text-[#38bdf8]" />}
                    >
                      Add to Project
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
