"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  Archive,
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Scale,
  ShieldAlert,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  Filter,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PolicyBriefReport,
  ReportStatus,
  buildPolicyBriefFromSimulationContext,
  INITIAL_REPORTS,
} from "@/lib/reports/report-data";
import { getBaselineForGeography, runSimulationEngine, SimulationResult, BaselineProfile } from "@/lib/policy/policy-twin-data";

export interface ReportsWorkspaceViewProps {
  userRole?: string;
  initialContext?: {
    state?: string;
    district?: string;
    tehsil?: string;
    scenarioTitle?: string;
    simulationResult?: SimulationResult | Record<string, unknown>;
    baseline?: BaselineProfile | Record<string, unknown>;
  } | null;
  onNavigateToResearch?: (referenceNumber?: string) => void;
  onNavigateToPolicyLab?: (geoCtx?: { state: string; district: string; tehsil: string }) => void;
}

export function ReportsWorkspaceView({
  userRole = "POLICYMAKER",
  initialContext,
  onNavigateToResearch,
  onNavigateToPolicyLab,
}: ReportsWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "generated" | "create">("all");
  const [reports, setReports] = useState<PolicyBriefReport[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<PolicyBriefReport | null>(() => {
    if (initialContext?.district && initialContext?.simulationResult) {
      const bl = (initialContext.baseline as BaselineProfile) || getBaselineForGeography(
        initialContext.state || "Madhya Pradesh",
        initialContext.district || "Sehore",
        initialContext.tehsil || "Ashta"
      );
      return buildPolicyBriefFromSimulationContext({
        geography: {
          state: initialContext.state || "Madhya Pradesh",
          district: initialContext.district || "Sehore",
          tehsil: initialContext.tehsil || "Ashta",
        },
        baseline: bl,
        simulationResult: initialContext.simulationResult as SimulationResult,
        author: {
          name: "Current User",
          role: userRole,
          organization: "Policy Planning & Urban Directorate",
          email: "user@landscope.demo",
        },
        status: "Generated",
        title: `Policy Decision Brief: ${initialContext.scenarioTitle || "Controlled Expansion"}`,
      });
    }
    return INITIAL_REPORTS[0] || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Create Form State
  const [formState, setFormState] = useState(initialContext?.state || "Madhya Pradesh");
  const [formDistrict, setFormDistrict] = useState(initialContext?.district || "Sehore");
  const [formTehsil, setFormTehsil] = useState(initialContext?.tehsil || "Ashta");
  const [formScenarioTitle, setFormScenarioTitle] = useState(
    initialContext?.scenarioTitle || "Controlled Peri-Urban Expansion 2031"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          if (data.reports) {
            setReports(data.reports);

            // If initialContext was passed from Policy Lab, auto-generate and open the brief
            if (initialContext?.district && initialContext?.simulationResult) {
              const bl = initialContext.baseline || getBaselineForGeography(
                initialContext.state || "Madhya Pradesh",
                initialContext.district || "Sehore",
                initialContext.tehsil || "Ashta"
              );
              const generated = buildPolicyBriefFromSimulationContext({
                geography: {
                  state: initialContext.state || "Madhya Pradesh",
                  district: initialContext.district || "Sehore",
                  tehsil: initialContext.tehsil || "Ashta",
                },
                baseline: bl as BaselineProfile,
                simulationResult: initialContext.simulationResult as SimulationResult,
                author: {
                  name: "Current User",
                  role: userRole,
                  organization: "Policy Planning & Urban Directorate",
                  email: "user@landscope.demo",
                },
                status: "Generated",
                title: `Policy Decision Brief: ${initialContext.scenarioTitle || "Controlled Expansion"}`,
              });
              setSelectedReport(generated);
            } else if (data.reports.length > 0) {
              setSelectedReport(data.reports[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [initialContext, userRole]);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (activeTab === "draft" && r.status !== "Draft") return false;
    if (activeTab === "generated" && r.status !== "Generated") return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.geography.district.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Generate New Brief Action
  const handleGenerateBrief = async (status: ReportStatus = "Generated") => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: formState,
          district: formDistrict,
          tehsil: formTehsil,
          scenarioTitle: formScenarioTitle,
          status,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReports((prev) => [data.report, ...prev]);
          setSelectedReport(data.report);
          setActiveTab("all");
        }
      }
    } catch (e) {
      console.error("Error creating report:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Export / Print
  const handlePrintExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 text-slate-200">
      {/* 1. Header Bar */}
      <div className="glass-panel-primary border border-[#3b82f6]/20 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-5 sm:p-6 mb-6 rounded-b-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Breadcrumbs
              items={[
                { label: "National SDI Registry" },
                { label: "Reports & Policy Briefs", active: true },
              ]}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1.5 flex items-center gap-2.5">
              <span>Reports & Evidence-Based Policy Briefs</span>
              <Badge variant="official" size="sm" dot>
                Statutory Decision Support
              </Badge>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Transform research evidence, spatial intelligence and policy simulations into traceable decision briefs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintExport}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Export Policy Brief
              </Button>
            )}
            {userRole !== "PUBLIC" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedReport(null);
                  setActiveTab("create");
                }}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Create New Brief
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#3b82f6]/15 mt-5 -mb-4 pt-1 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("all");
              if (!selectedReport && reports.length > 0) setSelectedReport(reports[0]);
            }}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "all"
                ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Recent Reports ({reports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "draft"
                ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Draft Reports ({reports.filter((r) => r.status === "Draft").length})</span>
          </button>
          <button
            onClick={() => setActiveTab("generated")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "generated"
                ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Generated Reports ({reports.filter((r) => r.status === "Generated").length})</span>
          </button>
          {userRole !== "PUBLIC" && (
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === "create"
                  ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Create New Brief</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "create" ? (
        /* CREATE NEW BRIEF FORM */
        <div className="glass-panel-primary border border-[#3b82f6]/20 rounded-lg p-6 max-w-3xl mx-auto shadow-xl space-y-6">
          <div className="border-b border-[#3b82f6]/15 pb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-4 h-4 text-[#3b82f6]" />
              <span>Synthesize Evidence-Based Policy Decision Brief</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect calibrated land intelligence, attached empirical research, and policy simulation parameters into a formal traceable decision brief.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">State</label>
              <input
                type="text"
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                className="w-full px-3 py-2 border border-[#3b82f6]/25 rounded-md text-xs bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">District</label>
              <input
                type="text"
                value={formDistrict}
                onChange={(e) => setFormDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-[#3b82f6]/25 rounded-md text-xs bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Tehsil</label>
              <input
                type="text"
                value={formTehsil}
                onChange={(e) => setFormTehsil(e.target.value)}
                className="w-full px-3 py-2 border border-[#3b82f6]/25 rounded-md text-xs bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Scenario Title</label>
            <input
              type="text"
              value={formScenarioTitle}
              onChange={(e) => setFormScenarioTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#3b82f6]/25 rounded-md text-xs font-medium bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
              placeholder="e.g. Controlled Peri-Urban Expansion 2031"
            />
          </div>

          <div className="p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/25 rounded-lg text-xs text-slate-300 space-y-1.5">
            <strong className="block font-bold text-[#3b82f6] uppercase tracking-wider text-[11px]">Automated Data Traceability Pipeline:</strong>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              The brief engine automatically pulls 2026 geographic baselines, correlates spatial layers from Land Intelligence GIS, links attached empirical research records, and calculates 6-sector impact deltas. No fictional numbers are generated.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3b82f6]/15">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("all")}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateBrief("Draft")}
              disabled={isGenerating}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleGenerateBrief("Generated")}
              disabled={isGenerating}
              leftIcon={<CheckCircle className="w-4 h-4 text-[#030712]" />}
            >
              {isGenerating ? "Synthesizing Brief..." : "Generate Policy Decision Brief"}
            </Button>
          </div>
        </div>
      ) : (
        /* REPORTS WORKSPACE SPLIT VIEW: SIDEBAR LIST + 12-SECTION DOCUMENT VIEWER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Reports Catalog (4 cols) */}
          <div className="lg:col-span-4 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between gap-2 border-b border-[#3b82f6]/10 pb-2.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Reports Repository
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 font-semibold">
                {filteredReports.length} briefs
              </span>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by title, district, category..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
              <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Reports List */}
            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {isLoading ? (
                <p className="text-xs text-slate-500 italic p-6 text-center">Loading reports...</p>
              ) : filteredReports.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-6 text-center">No reports match filter.</p>
              ) : (
                filteredReports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "glass-panel-floating border-[#3b82f6] shadow-[0_0_15px_rgba(59, 130, 246,0.15)] ring-1 ring-[#3b82f6]/40"
                          : "glass-panel-secondary border-[#3b82f6]/15 hover:border-[#3b82f6]/35 hover:bg-[#0a1814]/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#38bdf8]">
                          {report.id}
                        </span>
                        <Badge
                          variant={report.status === "Generated" ? "official" : "outline"}
                          size="sm"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <h3 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2 mt-1">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 font-mono">
                        <span className="flex items-center gap-1 text-[#3b82f6]">
                          <MapPin className="w-3 h-3" />
                          {report.geography.district}, {report.geography.state}
                        </span>
                        <span>•</span>
                        <span>{report.createdAt}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Full 12-Section Structured Policy Brief Document (8 cols) */}
          <div className="lg:col-span-8">
            {selectedReport ? (
              <article className="glass-panel-primary border border-[#3b82f6]/20 rounded-lg shadow-xl print:border-none print:shadow-none overflow-hidden divide-y divide-[#3b82f6]/15">
                {/* Print Banner / Header */}
                <div className="p-6 bg-[#030712]/50 print:bg-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                        {selectedReport.id}
                      </span>
                      <Badge variant="official" size="sm">
                        {selectedReport.category}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Status: {selectedReport.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      {onNavigateToResearch && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            const firstRef = selectedReport.sections.supportingEvidence[0]?.referenceNumber;
                            onNavigateToResearch(firstRef);
                          }}
                          leftIcon={<BookOpen className="w-3.5 h-3.5 text-[#3b82f6]" />}
                        >
                          View Supporting Research
                        </Button>
                      )}
                      {onNavigateToPolicyLab && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onNavigateToPolicyLab(selectedReport.geography)}
                          leftIcon={<Scale className="w-3.5 h-3.5 text-[#38bdf8]" />}
                        >
                          View Policy Scenario
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={handlePrintExport}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print Brief
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                    {selectedReport.title}
                  </h1>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-[#3b82f6]/10 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Geography
                      </span>
                      <strong className="text-slate-100 font-semibold block mt-0.5">
                        {selectedReport.geography.tehsil}, {selectedReport.geography.district}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Lead Author
                      </span>
                      <strong className="text-slate-100 font-semibold block mt-0.5">
                        {selectedReport.author.name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Organization
                      </span>
                      <strong className="text-slate-100 font-semibold truncate block mt-0.5">
                        {selectedReport.author.organization}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Date Tabled
                      </span>
                      <strong className="text-slate-100 font-semibold font-mono block mt-0.5">
                        {selectedReport.createdAt}
                      </strong>
                    </div>
                  </div>

                  {/* Demo Labels */}
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span className="font-mono px-2 py-0.5 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25 font-bold">
                      {selectedReport.metadata.datasetLabel}
                    </span>
                    <span className="font-mono px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25 font-bold">
                      {selectedReport.metadata.modelOutputLabel}
                    </span>
                  </div>
                </div>

                {/* Document Body: 12 Structured Sections */}
                <div className="p-6 space-y-8 text-xs text-slate-300 leading-relaxed">
                  {/* SECTION 1: EXECUTIVE SUMMARY */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <span>Executive Summary</span>
                    </h2>
                    <div className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg text-slate-200 leading-relaxed">
                      <p>{selectedReport.sections.executiveSummary}</p>
                    </div>
                  </section>

                  {/* SECTION 2: GEOGRAPHY & STUDY AREA */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        2
                      </span>
                      <span>Geography & Study Area</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Administrative Boundary
                        </span>
                        <p className="font-semibold text-slate-100 mt-1">
                          {selectedReport.sections.geographyStudyArea.tehsil} Tehsil, {selectedReport.sections.geographyStudyArea.district} District, {selectedReport.sections.geographyStudyArea.state}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                          {selectedReport.sections.geographyStudyArea.narrative}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Spatial Coordinates & Centroid
                        </span>
                        <p className="font-mono text-[#3b82f6] mt-1 text-xs">
                          {selectedReport.sections.geographyStudyArea.spatialCoordinates}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* SECTION 3: CURRENT LAND SITUATION */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        3
                      </span>
                      <span>Current Land Situation (Baseline Calibration)</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                        <strong className="block text-[#3b82f6] font-bold mb-1.5 uppercase tracking-wider text-[11px]">Land-Use Profile</strong>
                        <ul className="space-y-1 text-slate-300 text-[11px] font-mono">
                          <li>Agriculture: {selectedReport.sections.currentLandSituation.landUse.agriculturePct}%</li>
                          <li>Built-Up: {selectedReport.sections.currentLandSituation.landUse.builtUpPct}%</li>
                          <li>Forest Canopy: {selectedReport.sections.currentLandSituation.landUse.forestPct}%</li>
                          <li>Water Bodies: {selectedReport.sections.currentLandSituation.landUse.waterPct}%</li>
                        </ul>
                      </div>
                      <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                        <strong className="block text-[#38bdf8] font-bold mb-1.5 uppercase tracking-wider text-[11px]">Environmental Indicators</strong>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          <li>Aquifer: {selectedReport.sections.currentLandSituation.environment.aquiferRechargeIndex}/100 ({selectedReport.sections.currentLandSituation.environment.aquiferStatus})</li>
                          <li>Forest Buffer: {selectedReport.sections.currentLandSituation.environment.forestBufferHealth}%</li>
                          <li>Drought Risk: {selectedReport.sections.currentLandSituation.environment.droughtRisk}</li>
                        </ul>
                      </div>
                      <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                        <strong className="block text-[#f59e0b] font-bold mb-1.5 uppercase tracking-wider text-[11px]">Cadastral Governance</strong>
                        <ul className="space-y-1 text-slate-300 text-[11px] font-mono">
                          <li>Formalization: {selectedReport.sections.currentLandSituation.governance.cadastralFormalizationPct}%</li>
                          <li>Dispute Rate: {selectedReport.sections.currentLandSituation.governance.disputeRatePct}%</li>
                          <li>Mutation: {selectedReport.sections.currentLandSituation.governance.mutationLatencyDays} Days</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* SECTION 4: SUPPORTING EVIDENCE */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        4
                      </span>
                      <span>Supporting Empirical Evidence</span>
                    </h2>
                    <div className="space-y-2.5">
                      {selectedReport.sections.supportingEvidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-3.5 border border-[#3b82f6]/15 rounded-lg glass-panel-secondary space-y-1.5 hover:border-[#3b82f6]/35 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-100 text-xs">
                              {ev.title}
                            </span>
                            <span className="font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/25">
                              {ev.referenceNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 italic leading-relaxed">
                            &ldquo;{ev.relevance}&rdquo;
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>Author: {ev.author} ({ev.year})</span>
                            <span>•</span>
                            <span className="text-[#3b82f6] font-semibold">{ev.status}</span>
                            <span>•</span>
                            <span>Geography: {ev.geography}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 5: POLICY SCENARIO & PARAMETERS */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        5
                      </span>
                      <span>Policy Scenario & Parameters</span>
                    </h2>
                    <div className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-100 font-bold tracking-tight">
                          {selectedReport.scenario.scenarioTitle}
                        </strong>
                        <Badge variant="outline" size="sm">
                          Horizon: {selectedReport.scenario.horizonYear} ({selectedReport.scenario.stressCondition})
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                        {selectedReport.scenario.parameters.map((p) => (
                          <div key={p.id} className="p-2.5 bg-[#030712]/80 border border-[#3b82f6]/15 rounded-md">
                            <span className="text-slate-400 font-semibold block">{p.name}:</span>
                            <span className="font-bold text-slate-100 font-mono mt-0.5 block">
                              Baseline {p.baseline} {p.unit} → Scenario {p.scenarioValue} {p.unit}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">{p.whyItMatters}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* SECTION 6: BASELINE VS SCENARIO */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        6
                      </span>
                      <span>Baseline vs Scenario Comparison</span>
                    </h2>
                    <div className="overflow-x-auto border border-[#3b82f6]/20 rounded-lg">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#030712] text-slate-300 font-bold border-b border-[#3b82f6]/20 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Sector Dimension</th>
                            <th className="p-3">Current Baseline</th>
                            <th className="p-3">Scenario Value</th>
                            <th className="p-3">Simulated Delta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3b82f6]/10">
                          {selectedReport.sections.baselineVsScenario.map((row, i) => (
                            <tr key={i} className="hover:bg-[#3b82f6]/5 transition-colors">
                              <td className="p-3 font-bold text-slate-100">{row.dimension}</td>
                              <td className="p-3 font-mono text-slate-400">{row.baseline}</td>
                              <td className="p-3 font-mono text-slate-200 font-semibold">{row.scenario}</td>
                              <td className="p-3 font-mono font-bold text-[#3b82f6]">{row.delta}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* SECTION 7: MULTI-DIMENSIONAL IMPACT ANALYSIS */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        7
                      </span>
                      <span>Multi-Dimensional Impact Analysis</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {Object.entries(selectedReport.sections.multiDimensionalImpact).map(([k, v]) => (
                        <div key={k} className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            {k}
                          </span>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-mono">{v.baseline} → {v.scenario}</span>
                            <span className="font-mono font-bold text-[#3b82f6]">{v.change}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pt-0.5 leading-relaxed">{v.narrative}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 8: POLICY TRADE-OFFS */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        8
                      </span>
                      <span>Policy Trade-Offs (Objective Analysis)</span>
                    </h2>
                    <div className="space-y-2.5">
                      {selectedReport.sections.policyTradeOffs.map((to) => (
                        <div
                          key={to.id}
                          className="p-3.5 border border-amber-500/25 bg-amber-500/10 rounded-lg space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#3b82f6]">
                              + {to.primaryBenefit}
                            </span>
                            <span className="text-xs font-bold text-amber-300">
                              ⇄ {to.correspondingCost}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{to.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 9: SPATIAL / GIS CONTEXT */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        9
                      </span>
                      <span>Spatial & GIS Context</span>
                    </h2>
                    <div className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedReport.sections.spatialGisContext.selectedLayers.map((l, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded bg-[#030712] text-[#3b82f6] border border-[#3b82f6]/25 text-[10px] font-semibold"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {selectedReport.sections.spatialGisContext.landUseSummary}
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        {selectedReport.sections.spatialGisContext.sdiIntegrationSummary}
                      </p>
                    </div>
                  </section>

                  {/* SECTION 10: EVIDENCE TRAIL */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        10
                      </span>
                      <span>Complete Traceable Evidence Trail</span>
                    </h2>
                    <div className="space-y-2.5 border-l-2 border-[#3b82f6]/40 pl-3.5 ml-2">
                      {selectedReport.sections.evidenceTrail.map((tr) => (
                        <div key={tr.step} className="text-xs space-y-0.5">
                          <strong className="font-bold text-[#3b82f6] block">
                            Stage {tr.step}: {tr.stage}
                          </strong>
                          <p className="text-slate-200 text-[11px] leading-relaxed">{tr.content}</p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Source: {tr.source}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 11: ASSUMPTIONS */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        11
                      </span>
                      <span>Model Assumptions</span>
                    </h2>
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300 p-4 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg leading-relaxed">
                      {selectedReport.sections.assumptions.map((asm, i) => (
                        <li key={i}>{asm}</li>
                      ))}
                    </ul>
                  </section>

                  {/* SECTION 12: LIMITATIONS */}
                  <section className="space-y-2.5">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-[#3b82f6]/20 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] font-bold flex items-center justify-center">
                        12
                      </span>
                      <span>Statutory Limitations & Disclaimers</span>
                    </h2>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-200/90 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Illustrative Prototype Output Notification</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-amber-200/80 leading-relaxed">
                        {selectedReport.sections.limitations.map((lim, i) => (
                          <li key={i}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
              </article>
            ) : (
              <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-16 text-center text-slate-400 italic">
                Select a report from the catalog or click &quot;+ Create New Brief&quot; to synthesize an evidence-based decision brief.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
