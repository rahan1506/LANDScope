"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import {
  ResearchProject,
  EvidenceItem,
  SpatialContext,
  INITIAL_EVIDENCE_REPOSITORY,
} from "@/lib/research/research-data";
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Database,
  Layers,
  BarChart3,
  Scale,
  Users,
  FileCheck2,
  Download,
  Share2,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { EvidenceDetailModal } from "./evidence-detail-modal";
import { LinkPolicyModal } from "./link-policy-modal";

interface ResearchProjectWorkspaceClientProps {
  user: UserAccount;
  role: RoleDefinition;
  project: ResearchProject;
}

type ProjectTab =
  | "overview"
  | "questions"
  | "evidence"
  | "datasets"
  | "gis"
  | "analysis"
  | "policy"
  | "collaborators"
  | "reports";

export function ResearchProjectWorkspaceClient({
  user,
  role,
  project,
}: ResearchProjectWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<EvidenceItem | null>(null);
  const [selectedEvidenceForPolicy, setSelectedEvidenceForPolicy] = useState<EvidenceItem | null>(null);

  // Dynamic questions state (supports adding questions to Supabase)
  const [questions, setQuestions] = useState(project.researchQuestions);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [savingQuestion, setSavingQuestion] = useState(false);

  // Dynamic evidence repository state
  const [allEvidence, setAllEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_REPOSITORY);

  React.useEffect(() => {
    async function loadEvidence() {
      try {
        const res = await fetch("/api/research/evidence");
        if (res.ok) {
          const data = await res.json();
          if (data.evidence && Array.isArray(data.evidence)) {
            setAllEvidence(data.evidence);
          }
        }
      } catch {
        // Fallback to initial repository
      }
    }
    loadEvidence();
  }, []);

  // Resolved evidence items linked to this project
  const linkedEvidence = allEvidence.filter((e) =>
    project.evidenceIds.includes(e.id)
  );

  const tabs: Array<{ id: ProjectTab; label: string; icon: React.ReactNode; count?: number }> = [
    { id: "overview", label: "Overview", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "questions", label: "Research Questions", icon: <HelpCircle className="w-3.5 h-3.5" />, count: questions.length },
    { id: "evidence", label: "Evidence", icon: <FileCheck2 className="w-3.5 h-3.5" />, count: linkedEvidence.length },
    { id: "datasets", label: "Datasets", icon: <Database className="w-3.5 h-3.5" />, count: project.datasets.length },
    { id: "gis", label: "GIS Layers", icon: <Layers className="w-3.5 h-3.5" />, count: project.gisLayers.length },
    { id: "analysis", label: "Analysis & Metrics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy Scenarios", icon: <Scale className="w-3.5 h-3.5" />, count: project.policyScenarios.length },
    { id: "collaborators", label: "Collaborators", icon: <Users className="w-3.5 h-3.5" />, count: project.collaborators.length },
    { id: "reports", label: "Reports & Dossiers", icon: <Download className="w-3.5 h-3.5" />, count: project.reports.length },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#030712] text-[#f8fafc] ${
        isHighContrast ? "high-contrast" : ""
      }`}
      style={{
        fontSize: fontSizeDelta !== 0 ? `${100 + fontSizeDelta * 6}%` : undefined,
      }}
    >
      {/* 1. National Banner */}
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={(delta) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      {/* 2. Platform Header */}
      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        unreadCount={0}
      />

      {/* 3. Project Header Bar */}
      <div className="glass-panel-primary border-b border-[#19386c]/30 px-4 sm:px-6 py-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1600px] mx-auto space-y-3.5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href="/app/researcher"
                className="inline-flex items-center gap-1.5 text-xs text-[#8ea79e] hover:text-[#3b82f6] font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Research Intelligence</span>
              </Link>
              <span className="text-[#19386c]">/</span>
              <Breadcrumbs
                items={[
                  { label: "Research Projects", href: "/app/researcher" },
                  { label: project.title, active: true },
                ]}
              />
            </div>

            <div className="flex items-center gap-2.5">
              {project.isDemoProject && (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
                  Illustrative Demo Record
                </span>
              )}
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold uppercase">
                {project.status}
              </span>
              <Button
                variant="outline"
                size="xs"
                leftIcon={<Download className="w-3.5 h-3.5 text-[#3b82f6]" />}
              >
                Export Project Dossier
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f8fafc] tracking-tight bg-gradient-to-r from-[#f8fafc] via-[#e2ece8] to-[#3b82f6] bg-clip-text text-transparent">
              {project.title}
            </h1>
            <p className="text-xs text-[#8ea79e] mt-1 max-w-3xl leading-relaxed">
              {project.subtitle || project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#a4bcaf] pt-1 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>{project.organization}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Lead: <strong className="text-[#f8fafc]">{project.leadResearcherName}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Updated: {project.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation Strip */}
      <div className="glass-panel-primary border-b border-[#19386c]/30 px-4 sm:px-6 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-[#3b82f6] text-[#3b82f6] bg-[#0b1c38]/40 shadow-[0_4px_15px_rgba(59, 130, 246,0.1)]"
                  : "border-transparent text-[#8ea79e] hover:text-[#f8fafc] hover:bg-[#0b1c38]/20"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                    activeTab === tab.id
                      ? "bg-[#3b82f6] text-[#030712] border-[#3b82f6] font-bold"
                      : "bg-[#060e1a] text-[#8ea79e] border-[#19386c]/40"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Workspace Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
                <h2 className="font-mono font-bold text-[#f8fafc] uppercase tracking-widest text-xs">
                  Executive Abstract & Research Methodology
                </h2>
                <span className="text-xs text-[#8ea79e] font-mono">Dossier ID: {project.id}</span>
              </div>

              <p className="text-xs text-[#a4bcaf] leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#3b82f6] font-mono font-bold uppercase tracking-wider block">
                    Research Questions
                  </span>
                  <strong className="text-base text-[#f8fafc] font-mono font-bold block">
                    {project.researchQuestions.length} Formulated
                  </strong>
                  <span className="text-[11px] text-[#8ea79e]">
                    {project.researchQuestions.filter((q) => q.status === "Validated").length} empirically validated
                  </span>
                </div>

                <div className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#38bdf8] font-mono font-bold uppercase tracking-wider block">
                    Linked Evidence & Data
                  </span>
                  <strong className="text-base text-[#f8fafc] font-mono font-bold block">
                    {project.evidenceCount} Studies • {project.datasetCount} Datasets
                  </strong>
                  <span className="text-[11px] text-[#8ea79e]">
                    Multi-temporal satellite rasters & eCourts records
                  </span>
                </div>

                <div className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#f59e0b] font-mono font-bold uppercase tracking-wider block">
                    Policy Digital Twin Link
                  </span>
                  <strong className="text-base text-[#3b82f6] font-mono font-bold block">
                    {project.policyScenarios.length} Linked Scenario(s)
                  </strong>
                  <span className="text-[11px] text-[#8ea79e]">
                    Calibrating Master Plan 2031 parameters
                  </span>
                </div>
              </div>
            </div>

            {/* Quick summary of questions */}
            <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-3">
              <h2 className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-widest">
                Investigative Hypotheses
              </h2>
              <div className="space-y-2.5">
                {project.researchQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-[#f8fafc]">
                        {idx + 1}. {q.question}
                      </strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
                        {q.status}
                      </span>
                    </div>
                    {q.hypothesis && (
                      <p className="text-[11px] text-[#8ea79e]">
                        <span className="font-semibold text-[#a4bcaf]">Hypothesis:</span> {q.hypothesis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === "questions" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#f8fafc]">Research Questions & Hypotheses</h2>
                <p className="text-xs text-[#8ea79e]">
                  Empirically testable hypotheses linked to spatial datasets and econometric indices
                </p>
              </div>

              {!isAddingQuestion ? (
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 rounded-lg hover:bg-[#10274e] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              ) : null}
            </div>

            {isAddingQuestion && (
              <div className="p-4 bg-[#060e1a]/90 border border-[#19386c]/40 rounded-xl space-y-3">
                <label className="text-xs font-bold text-[#f8fafc] block">
                  New Research Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. How does cadastral formalization influence agricultural productivity across clusters?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#030712] border border-[#19386c]/50 rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#3b82f6]"
                  disabled={savingQuestion}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingQuestion(false);
                      setNewQuestionText("");
                    }}
                    className="px-3 py-1.5 text-xs text-[#8ea79e] hover:text-[#f8fafc] transition-colors"
                    disabled={savingQuestion}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={savingQuestion || !newQuestionText.trim()}
                    onClick={async () => {
                      if (!newQuestionText.trim()) return;
                      setSavingQuestion(true);
                      try {
                        const res = await fetch(`/api/research/projects/${project.id}/questions`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ question: newQuestionText.trim() }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.question) {
                            setQuestions((prev) => [...prev, data.question]);
                          }
                          setNewQuestionText("");
                          setIsAddingQuestion(false);
                        }
                      } finally {
                        setSavingQuestion(false);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#3b82f6] text-[#030712] rounded-lg hover:bg-[#60a5fa] transition-colors disabled:opacity-50 font-bold"
                  >
                    {savingQuestion ? "Saving..." : "Save Question"}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#3b82f6] font-mono font-bold block mb-0.5">
                        QUESTION #{idx + 1}
                      </span>
                      <h3 className="font-bold text-[#f8fafc] text-sm leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold shrink-0">
                      {q.status}
                    </span>
                  </div>

                  {q.hypothesis && (
                    <div className="p-3 bg-[#030712] border border-[#19386c]/40 rounded-lg text-[#8ea79e] text-xs">
                      <strong className="text-[#3b82f6]">Working Hypothesis:</strong> {q.hypothesis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE TAB */}
        {activeTab === "evidence" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#f8fafc]">Linked Research & Evidence</h2>
                <p className="text-xs text-[#8ea79e]">
                  Curated empirical studies, judicial cases, and cadastral audits supporting this project
                </p>
              </div>

              <Link
                href="/app/researcher#evidence-repository-section"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 rounded-lg hover:bg-[#10274e] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Evidence</span>
              </Link>
            </div>

            {linkedEvidence.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#19386c]/40 rounded-xl text-xs text-[#8ea79e]">
                No evidence items attached yet. Browse the repository to add empirical studies.
              </div>
            ) : (
              <div className="space-y-3">
                {linkedEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-2.5 text-xs hover:border-[#3b82f6]/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/30 font-bold uppercase">
                            {ev.type}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#060e1a] text-[#8ea79e] border border-[#19386c]/40 font-medium">
                            {ev.evidenceStatus}
                          </span>
                          <span className="text-[#38bdf8] font-mono text-[11px]">Ref: {ev.referenceNumber}</span>
                        </div>
                        <h3 className="font-bold text-[#f8fafc] text-sm">{ev.title}</h3>
                        <p className="text-[#8ea79e] text-[11px]">
                          {ev.authorOrOrg} • {ev.year} • Scope: {ev.geography.state}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] text-[#8ea79e] block font-semibold">Confidence</span>
                        <strong className="text-[#3b82f6] font-bold font-mono text-sm">
                          {ev.confidenceScore} / 100
                        </strong>
                      </div>
                    </div>

                    <p className="text-[#a4bcaf] leading-relaxed text-xs">{ev.abstract}</p>

                    <div className="pt-2 border-t border-[#19386c]/30 flex items-center justify-between text-xs">
                      <div className="flex flex-wrap gap-1">
                        {ev.topics.map((t) => (
                          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#030712] text-[#8ea79e] border border-[#19386c]/30">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedEvidenceForDetail(ev)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSelectedEvidenceForPolicy(ev)}
                          leftIcon={<Scale className="w-3 h-3 text-[#3b82f6]" />}
                        >
                          Use in Policy Scenario
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DATASETS TAB */}
        {activeTab === "datasets" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#f8fafc]">Project Datasets & Spatial Layers</h2>
                <p className="text-xs text-[#8ea79e]">
                  Standardized spatial vectors, cloud-optimized rasters, and tabular revenue statistics
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.datasets.map((ds) => (
                <div key={ds.id} className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-[#f8fafc] font-semibold text-xs block">{ds.name}</strong>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8ea79e] font-mono">
                      <span>Provider: {ds.provider}</span>
                      <span>•</span>
                      <span>Format: {ds.format}</span>
                      <span>•</span>
                      <span>Size: {ds.size}</span>
                      <span>•</span>
                      <span>Records: {ds.recordsCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#030712] text-[#8ea79e] border border-[#19386c]/40">
                      Sync: {ds.lastSync}
                    </span>
                    <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3 text-[#3b82f6]" />}>
                      Download Sample
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIS LAYERS TAB */}
        {activeTab === "gis" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#f8fafc]">Spatial GIS Layers & Overlays</h2>
                <p className="text-xs text-[#8ea79e]">
                  OGC WMS / WFS spatial boundary layers configured for this research investigation
                </p>
              </div>

              <Link
                href="/app/researcher"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 rounded-lg hover:bg-[#10274e] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Land Intelligence GIS</span>
              </Link>
            </div>

            <div className="space-y-3">
              {project.gisLayers.map((gl) => (
                <div key={gl.id} className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/30 font-bold uppercase">
                        {gl.type}
                      </span>
                      <strong className="text-[#f8fafc] font-semibold">{gl.name}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8ea79e] font-mono">
                      <span>Source: {gl.source}</span>
                      <span>•</span>
                      <span>CRS: {gl.crs}</span>
                      <span>•</span>
                      <span>Coverage: {gl.coverage}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#3b82f6] bg-[#0b1c38] px-2 py-0.5 rounded-full border border-[#3b82f6]/40 font-mono font-medium">
                    OGC Validated
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === "analysis" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc]">Quantitative Analysis & Econometric Findings</h2>
            </div>
            <div className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl text-xs leading-relaxed text-[#a4bcaf] space-y-2">
              <strong className="block text-[#f8fafc] font-semibold">Principal Investigator Notes:</strong>
              <p>{project.analysisNotes}</p>
            </div>
          </div>
        )}

        {/* POLICY SCENARIOS TAB */}
        {activeTab === "policy" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#f8fafc]">Evidence → Policy Digital Twin Bridge</h2>
                <p className="text-xs text-[#8ea79e]">
                  Empirical research models registered for parameterizing Policy Lab simulations
                </p>
              </div>
            </div>

            {project.policyScenarios.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#19386c]/40 rounded-xl text-xs text-[#8ea79e]">
                No policy scenarios linked yet. Use &quot;Use in Policy Scenario&quot; from the Evidence tab to establish a digital twin linkage.
              </div>
            ) : (
              <div className="space-y-3">
                {project.policyScenarios.map((sc) => (
                  <div key={sc.id} className="p-4 border border-[#3b82f6]/30 bg-[#0b1c38]/20 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-[#f8fafc] font-bold text-sm">{sc.title}</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] font-bold border border-[#3b82f6]/40">
                        {sc.status}
                      </span>
                    </div>
                    <p className="text-[#a4bcaf]">{sc.rationale}</p>
                    <div className="p-2.5 bg-[#060e1a] border border-[#19386c]/40 rounded-lg text-[11px] text-[#3b82f6] font-mono">
                      Simulated Metrics: {sc.metrics}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COLLABORATORS TAB */}
        {activeTab === "collaborators" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc]">Research Collaborators & Co-Investigators</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.collaborators.map((c, idx) => (
                <div key={idx} className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#f8fafc] font-semibold">{c.name}</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#030712] text-[#8ea79e] border border-[#19386c]/40">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-[#a4bcaf] block">{c.organization}</span>
                  <span className="text-[#38bdf8] font-mono text-[11px]">{c.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="glass-panel-primary border border-[#19386c]/40 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#19386c]/30 pb-3">
              <h2 className="text-sm font-bold text-[#f8fafc]">Project Reports, Working Papers & Citations</h2>
            </div>
            <div className="space-y-3">
              {project.reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-[#f8fafc] font-semibold block">{rep.title}</strong>
                    <span className="text-[#8ea79e] text-[11px] font-mono">{rep.type} • Generated {rep.generatedAt} • {rep.size}</span>
                  </div>
                  <Button variant="outline" size="xs" leftIcon={<Download className="w-3.5 h-3.5 text-[#3b82f6]" />}>
                    Download Report
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <EvidenceDetailModal
        evidence={selectedEvidenceForDetail}
        isOpen={selectedEvidenceForDetail !== null}
        onClose={() => setSelectedEvidenceForDetail(null)}
        onUseInPolicy={(ev) => {
          setSelectedEvidenceForDetail(null);
          setSelectedEvidenceForPolicy(ev);
        }}
      />

      <LinkPolicyModal
        evidence={selectedEvidenceForPolicy}
        isOpen={selectedEvidenceForPolicy !== null}
        onClose={() => setSelectedEvidenceForPolicy(null)}
        onSuccess={() => {}}
      />
    </div>
  );
}
