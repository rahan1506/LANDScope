"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Compass,
  Search,
  Filter,
  Layers,
  MapPin,
  FolderPlus,
  Scale,
  Sparkles,
  ShieldCheck,
  Download,
  Share2,
  Clock,
  ArrowRight,
  ExternalLink,
  Users,
  FileText,
  Database,
  Building,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  EvidenceItem,
  ResearchProject,
  RecentActivityItem,
  SpatialContext,
  INITIAL_RESEARCH_PROJECTS,
  INITIAL_EVIDENCE_REPOSITORY,
  INITIAL_RECENT_ACTIVITIES,
} from "@/lib/research/research-data";
import { EvidenceDetailModal } from "./evidence-detail-modal";
import { AddToProjectModal } from "./add-to-project-modal";
import { LinkPolicyModal } from "./link-policy-modal";
import { StartResearchModal } from "./start-research-modal";

interface ResearcherWorkspaceViewProps {
  initialSpatialContext?: SpatialContext | null;
  onNavigateToGis?: (spatialContext?: SpatialContext) => void;
}

export function ResearcherWorkspaceView({
  initialSpatialContext,
  onNavigateToGis,
}: ResearcherWorkspaceViewProps) {
  // Projects State
  const [projects, setProjects] = useState<ResearchProject[]>(INITIAL_RESEARCH_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Evidence Repository State
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_REPOSITORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedGeography, setSelectedGeography] = useState<string>("All");

  // Recent Activity State
  const [activities, setActivities] = useState<RecentActivityItem[]>(INITIAL_RECENT_ACTIVITIES);

  // Modals State
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<EvidenceItem | null>(null);
  const [selectedEvidenceForAdd, setSelectedEvidenceForAdd] = useState<EvidenceItem | null>(null);
  const [selectedEvidenceForPolicy, setSelectedEvidenceForPolicy] = useState<EvidenceItem | null>(null);
  const [isStartResearchOpen, setIsStartResearchOpen] = useState(false);

  // AI Copilot State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<{
    answer: string;
    supportingSources: Array<{
      id: string;
      type: string;
      title: string;
      agency: string;
      referenceNumber: string;
      confidenceScore: number;
      relevantEvidence: string;
      spatialContext?: SpatialContext;
    }>;
    disclaimer: string;
  } | null>(null);

  // Fetch live projects from API
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const res = await fetch("/api/research/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            setProjects(data.projects);
          }
        }
      } catch {
        // Fallback to initial seed projects
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Fetch live evidence from API (Supabase persistent + demo repository)
  useEffect(() => {
    async function loadEvidence() {
      try {
        const res = await fetch("/api/research/evidence");
        if (res.ok) {
          const data = await res.json();
          if (data.evidence && Array.isArray(data.evidence)) {
            setEvidenceList(data.evidence);
          }
        }
      } catch {
        // Fallback to initial seed evidence
      }
    }
    loadEvidence();
  }, []);

  // Filter evidence
  const filteredEvidence = evidenceList.filter((item) => {
    if (selectedType !== "All" && item.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    if (selectedDomain !== "All" && item.researchDomain !== selectedDomain) {
      return false;
    }
    if (selectedGeography !== "All" && item.geography.state !== selectedGeography) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.abstract.toLowerCase().includes(q) ||
      item.authorOrOrg.toLowerCase().includes(q) ||
      item.referenceNumber.toLowerCase().includes(q) ||
      item.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleCopilotSubmit = async (queryText?: string) => {
    const textToSubmit = queryText || copilotQuery;
    if (!textToSubmit.trim()) return;

    setCopilotLoading(true);
    setCopilotQuery(textToSubmit);

    try {
      const res = await fetch("/api/research/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSubmit.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotResponse(data.result);
      } else {
        const err = await res.json();
        setCopilotResponse({
          answer: `Unable to complete copilot query: ${err.message || "Access Denied."}`,
          supportingSources: [],
          disclaimer: "Verification error.",
        });
      }
    } catch {
      setCopilotResponse({
        answer: "Network error communicating with AI Research Copilot engine.",
        supportingSources: [],
        disclaimer: "Connection failed.",
      });
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleProjectCreated = (newProject: ResearchProject) => {
    setProjects((prev) => [newProject, ...prev]);
    // Add to recent activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "project_updated",
        title: "Created New Research Project",
        description: `Initiated research project: '${newProject.title}'`,
        timestamp: "Just now",
        userEmail: newProject.leadResearcherEmail,
        targetId: newProject.id,
      },
      ...prev,
    ]);
  };

  const handleEvidenceAddedToProject = (projectId: string, evidenceId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && !p.evidenceIds.includes(evidenceId)) {
          return {
            ...p,
            evidenceIds: [...p.evidenceIds, evidenceId],
            evidenceCount: p.evidenceCount + 1,
            lastUpdated: "Just now",
          };
        }
        return p;
      })
    );

    const ev = evidenceList.find((e) => e.id === evidenceId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "evidence_saved",
        title: "Evidence Added to Project",
        description: `Saved '${ev?.title.slice(0, 45) || evidenceId}' into project`,
        timestamp: "Just now",
        userEmail: "researcher@landscope.demo",
        targetId: projectId,
      },
      ...prev,
    ]);
  };

  const handlePolicyLinked = (evidenceId: string, scenarioTitle: string) => {
    const ev = evidenceList.find((e) => e.id === evidenceId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "policy_linked",
        title: "Evidence Linked to Policy Scenario",
        description: `Submitted '${ev?.title.slice(0, 40) || evidenceId}' to '${scenarioTitle}'`,
        timestamp: "Just now",
        userEmail: "researcher@landscope.demo",
        targetId: evidenceId,
      },
      ...prev,
    ]);
  };

  const scrollToEvidenceSection = () => {
    const el = document.getElementById("evidence-repository-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* 1. RESEARCHER LANDING WORKSPACE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-500/20 glass-panel-primary p-6 rounded-sm shadow-xl">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Research Intelligence Workspace", active: true },
            ]}
          />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1 flex items-center gap-2.5">
            <span>Research Intelligence Workspace</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
              Researcher Role
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Discover evidence, analyze land intelligence, and build research projects. All records and spatial overlays are governed by verified national SDI schemas (SIH26019).
          </p>
        </div>

        {/* Primary and Secondary CTAs */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToEvidenceSection}
            leftIcon={<Compass className="w-4 h-4 text-emerald-400" />}
          >
            Explore Evidence
          </Button>

          <Button
            variant="saffron"
            size="sm"
            onClick={() => setIsStartResearchOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Start Research
          </Button>
        </div>
      </div>

      {/* Transferred GIS Research Geography Context Banner */}
      {initialSpatialContext && (
        <div className="glass-panel-secondary border border-emerald-500/30 rounded-sm p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider font-mono">
                  Active GIS Research Geography
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Synchronized
                </span>
              </div>
              <strong className="text-sm font-bold text-slate-100 block mt-0.5">
                Research Geography: {initialSpatialContext.district ? `${initialSpatialContext.district}, ` : ""}
                {initialSpatialContext.state}, India
              </strong>
              <span className="text-xs text-slate-400 block mt-0.5">
                Active geographic context transferred from LANDScope GIS. All project questions, evidence searches, and audits are calibrated for this territory.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="saffron"
              size="xs"
              onClick={() => setIsStartResearchOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Start Research for {initialSpatialContext.district || initialSpatialContext.state}
            </Button>
            {onNavigateToGis && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onNavigateToGis(initialSpatialContext)}
                leftIcon={<Compass className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Back to GIS Map
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 2. SECTION A: MY RESEARCH PROJECTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
              <FolderPlus className="w-4 h-4 text-emerald-400" />
              <span>My Research Projects</span>
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
              {projects.length}
            </span>
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsStartResearchOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-400" />}
          >
            New Project
          </Button>
        </div>

        {loadingProjects ? (
          <div className="p-8 text-center glass-panel-primary border border-emerald-500/20 rounded-sm text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
            Loading research projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center glass-panel-primary border border-dashed border-emerald-500/30 rounded-sm text-xs space-y-2">
            <p className="text-slate-400">No active research projects found.</p>
            <Button
              variant="saffron"
              size="xs"
              onClick={() => setIsStartResearchOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Start First Research Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-panel-secondary border border-emerald-500/20 hover:border-emerald-500/40 rounded-sm p-5 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                          {project.status}
                        </span>
                        {project.isDemoProject && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold">
                            Illustrative Record
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {project.subtitle || project.description}
                      </p>
                    </div>
                  </div>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-emerald-500/15 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">
                        Evidence Count
                      </span>
                      <strong className="text-emerald-300 font-mono font-bold text-sm block mt-0.5">
                        {project.evidenceCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">
                        Datasets
                      </span>
                      <strong className="text-emerald-300 font-mono font-bold text-sm block mt-0.5">
                        {project.datasetCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">
                        Last Updated
                      </span>
                      <span className="text-slate-300 text-xs font-medium block mt-0.5">
                        {project.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {/* Collaborators row */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-emerald-400/80" />
                      <span className="text-[11px]">
                        Lead: <strong className="text-slate-200">{project.leadResearcherName}</strong>
                        {project.collaborators.length > 1
                          ? ` + ${project.collaborators.length - 1} co-authors`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Open project workspace link */}
                <div className="pt-3 mt-3 border-t border-emerald-500/15 flex items-center justify-end">
                  <Link
                    href={`/app/researcher/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                  >
                    <span>OPEN PROJECT WORKSPACE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. SECTION C: AI RESEARCH COPILOT */}
      <section className="glass-panel-primary text-white p-6 rounded-sm shadow-xl border border-emerald-500/30">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold tracking-tight text-slate-100 font-mono">AI Research Copilot</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
              Grounded Evidence Engine
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            Cites verified research papers, legal documents, and official surveys
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed max-w-4xl">
          Ask questions against the LANDScope National Evidence Repository. Responses are derived strictly from empirical citations and peer-reviewed studies. Unsupported AI claims are never presented as facts.
        </p>

        {/* Input box */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCopilotSubmit();
              }}
              placeholder="e.g. What research exists on agricultural-to-urban land conversion?"
              className="w-full h-10 pl-9 pr-4 text-xs bg-[#060e1a] border border-emerald-500/30 rounded-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 shadow-inner font-sans"
            />
          </div>
          <Button
            variant="saffron"
            size="sm"
            onClick={() => handleCopilotSubmit()}
            disabled={copilotLoading || !copilotQuery.trim()}
            leftIcon={
              copilotLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )
            }
          >
            {copilotLoading ? "Synthesizing..." : "Query Copilot"}
          </Button>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px]">
          <span className="text-slate-400 font-mono">Suggested queries:</span>
          {[
            "What research exists on agricultural-to-urban land conversion?",
            "How does cadastral titling impact Kisan Credit Card access?",
            "What are the litigation costs in revenue court disputes?",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleCopilotSubmit(prompt)}
              className="px-2.5 py-1 rounded bg-[#060e1a] hover:bg-[#122621] text-slate-300 hover:text-white border border-emerald-500/20 hover:border-emerald-500/40 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Response Box */}
        {copilotResponse && (
          <div className="mt-5 p-5 glass-panel-secondary border border-emerald-500/30 rounded-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2.5">
              <strong className="text-emerald-300 font-semibold flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Synthesized Evidence Summary:
              </strong>
              <span className="text-[10px] text-emerald-400/80 font-mono">
                {copilotResponse.supportingSources.length} Verified Citations
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed text-xs">
              {copilotResponse.answer}
            </p>

            {/* Supporting Sources List */}
            {copilotResponse.supportingSources.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-emerald-500/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block font-mono">
                  Supporting Sources & Citations:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {copilotResponse.supportingSources.map((source, idx) => (
                    <div
                      key={source.id || idx}
                      className="p-3 bg-[#060e1a]/90 border border-emerald-500/25 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                            {source.type}
                          </span>
                          <strong className="text-slate-100 text-xs font-semibold">
                            {source.title}
                          </strong>
                        </div>
                        <p className="text-[11px] text-slate-300 italic">
                          &ldquo;{source.relevantEvidence}&rdquo;
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>{source.agency}</span>
                          <span>•</span>
                          <span>Ref: {source.referenceNumber}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            Confidence: {source.confidenceScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {source.spatialContext && onNavigateToGis && (
                          <button
                            type="button"
                            onClick={() => onNavigateToGis(source.spatialContext)}
                            className="px-2.5 py-1 text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-sm flex items-center gap-1 transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>Spatial Map</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const found = evidenceList.find((e) => e.id === source.id);
                            if (found) setSelectedEvidenceForDetail(found);
                          }}
                          className="px-2.5 py-1 text-[11px] bg-[#060e1a] hover:bg-[#122621] text-slate-200 border border-emerald-500/20 rounded-sm flex items-center gap-1 transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          <span>View Study</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 italic pt-1 font-mono">
              {copilotResponse.disclaimer}
            </div>
          </div>
        )}
      </section>

      {/* 4. SECTION D: LAND INTELLIGENCE SPATIAL INTEGRATION */}
      <section className="glass-panel-secondary border border-emerald-500/20 rounded-sm p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-950/70 border border-emerald-500/30 rounded text-emerald-400 shadow-xs">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-100 font-mono">
              Land Intelligence & Spatial Cadastre Integration
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Overlay research questions with cadastral boundaries (khasra parcels), SVAMITVA drone orthomosaics, hydrogeology layers, and Master Plan 2031 statutory zoning perimeters.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onNavigateToGis?.({
              state: "Madhya Pradesh",
              district: "Sehore",
              tehsil: "Ashta",
              village: "Beda Munjhkheda",
              defaultLayer: "cadastral",
            })
          }
          leftIcon={<MapPin className="w-3.5 h-3.5 text-emerald-400" />}
          className="shrink-0"
        >
          Explore Spatial Evidence
        </Button>
      </section>

      {/* 5. SECTION B: RESEARCH & EVIDENCE REPOSITORY */}
      <section id="evidence-repository-section" className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/15 pb-2.5">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Research & Evidence Repository</span>
            </h2>
            <p className="text-xs text-slate-400">
              Peer-reviewed papers, policy gazettes, cadastral datasets, and judicial dispute monitors
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Showing:</span>
            <strong className="text-emerald-300 font-mono font-bold">
              {filteredEvidence.length} Entries
            </strong>
          </div>
        </div>

        {/* Faceted Search & Filters Bar */}
        <div className="glass-panel-primary border border-emerald-500/20 rounded-sm p-4 shadow-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author agency, DOI, or keywords..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#060e1a] border border-emerald-500/25 rounded-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-sans"
              />
            </div>

            {/* Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-8 px-2 text-xs bg-[#060e1a] border border-emerald-500/25 rounded-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="All" className="bg-[#060e1a] text-slate-200">All Types (Papers, Datasets, Laws)</option>
                <option value="Research Paper" className="bg-[#060e1a] text-slate-200">Research Papers</option>
                <option value="Policy Document" className="bg-[#060e1a] text-slate-200">Policy Documents</option>
                <option value="Dataset" className="bg-[#060e1a] text-slate-200">Datasets</option>
                <option value="Case Study" className="bg-[#060e1a] text-slate-200">Case Studies</option>
                <option value="Legal Document" className="bg-[#060e1a] text-slate-200">Legal Documents</option>
              </select>
            </div>

            {/* Research Domain Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full h-8 px-2 text-xs bg-[#060e1a] border border-emerald-500/25 rounded-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="All" className="bg-[#060e1a] text-slate-200">All Domains</option>
                <option value="Land Economics" className="bg-[#060e1a] text-slate-200">Land Economics</option>
                <option value="Cadastral Technology" className="bg-[#060e1a] text-slate-200">Cadastral Technology</option>
                <option value="Forest & Ecological Rights" className="bg-[#060e1a] text-slate-200">Forest & Ecological Rights</option>
                <option value="Judicial Governance" className="bg-[#060e1a] text-slate-200">Judicial Governance</option>
                <option value="Peri-Urban Master Planning" className="bg-[#060e1a] text-slate-200">Peri-Urban Master Planning</option>
              </select>
            </div>

            {/* Geography Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
                className="w-full h-8 px-2 text-xs bg-[#060e1a] border border-emerald-500/25 rounded-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="All" className="bg-[#060e1a] text-slate-200">All Geographies</option>
                <option value="Madhya Pradesh" className="bg-[#060e1a] text-slate-200">Madhya Pradesh</option>
                <option value="Odisha" className="bg-[#060e1a] text-slate-200">Odisha</option>
                <option value="Maharashtra & Gujarat" className="bg-[#060e1a] text-slate-200">Western India</option>
                <option value="National Coverage" className="bg-[#060e1a] text-slate-200">Pan-India</option>
              </select>
            </div>
          </div>
        </div>

        {/* Evidence Cards Feed */}
        <div className="space-y-3">
          {filteredEvidence.length === 0 ? (
            <div className="p-8 text-center glass-panel-primary border border-emerald-500/20 rounded-sm text-xs text-slate-400">
              No evidence matching search criteria. Try clearing filters.
            </div>
          ) : (
            filteredEvidence.map((item) => (
              <div
                key={item.id}
                className="glass-panel-secondary border border-emerald-500/20 hover:border-emerald-500/40 rounded-sm p-4.5 shadow-lg transition-all space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060e1a] text-slate-300 border border-emerald-500/20 font-medium">
                        {item.evidenceStatus}
                      </span>
                      {item.isDemoRecord ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 font-bold">
                          Illustrative Demo Record
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                          Official Public Source
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">• Ref: {item.referenceNumber}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedEvidenceForDetail(item)}
                      className="font-bold text-slate-100 text-sm hover:text-emerald-300 cursor-pointer transition-colors leading-snug group-hover:text-emerald-200"
                    >
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-300 font-medium">{item.authorOrOrg}</span>
                      <span>•</span>
                      <span className="font-mono">{item.year}</span>
                      <span>•</span>
                      <span>
                        Scope: {item.geography.state}
                        {item.geography.district ? ` (${item.geography.district})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score Pill */}
                  <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-1">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">
                        Confidence
                      </span>
                      <strong className="text-emerald-300 font-bold font-mono text-sm">
                        {item.confidenceScore} / 100
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Abstract snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.abstract}
                </p>

                {/* Card Actions & Topic Tags */}
                <div className="pt-2.5 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.topics.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060e1a] text-emerald-400/90 border border-emerald-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.topics.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{item.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedEvidenceForDetail(item)}
                    >
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedEvidenceForAdd(item)}
                      leftIcon={<FolderPlus className="w-3 h-3 text-emerald-400" />}
                    >
                      + Add to Project
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        if (onNavigateToGis) {
                          onNavigateToGis(item.spatialContext);
                        }
                      }}
                      leftIcon={<MapPin className="w-3 h-3 text-emerald-400" />}
                    >
                      Explore Spatial Evidence
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedEvidenceForPolicy(item)}
                      leftIcon={<Scale className="w-3 h-3 text-emerald-400" />}
                    >
                      Use in Policy Scenario
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. SECTION E: RECENT ACTIVITY */}
      <section className="glass-panel-secondary border border-emerald-500/20 rounded-sm p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2.5">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Recent Research Activity & Audit Log</span>
          </h2>
          <span className="text-[11px] text-emerald-400/80 font-mono">SESSION AUDIT</span>
        </div>

        <div className="divide-y divide-emerald-500/15 text-xs">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-200 font-medium">{act.title}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">• {act.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{act.description}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                {act.userEmail}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <EvidenceDetailModal
        evidence={selectedEvidenceForDetail}
        isOpen={selectedEvidenceForDetail !== null}
        onClose={() => setSelectedEvidenceForDetail(null)}
        onAddToProject={(ev) => {
          setSelectedEvidenceForDetail(null);
          setSelectedEvidenceForAdd(ev);
        }}
        onExploreGis={(ctx) => {
          setSelectedEvidenceForDetail(null);
          if (onNavigateToGis) onNavigateToGis(ctx);
        }}
        onUseInPolicy={(ev) => {
          setSelectedEvidenceForDetail(null);
          setSelectedEvidenceForPolicy(ev);
        }}
      />

      <AddToProjectModal
        evidence={selectedEvidenceForAdd}
        projects={projects}
        isOpen={selectedEvidenceForAdd !== null}
        onClose={() => setSelectedEvidenceForAdd(null)}
        onSuccess={handleEvidenceAddedToProject}
      />

      <LinkPolicyModal
        evidence={selectedEvidenceForPolicy}
        isOpen={selectedEvidenceForPolicy !== null}
        onClose={() => setSelectedEvidenceForPolicy(null)}
        onSuccess={handlePolicyLinked}
      />

      <StartResearchModal
        isOpen={isStartResearchOpen}
        onClose={() => setIsStartResearchOpen(false)}
        onSuccess={handleProjectCreated}
        initialGeography={
          initialSpatialContext
            ? `${initialSpatialContext.district ? initialSpatialContext.district + ", " : ""}${initialSpatialContext.state}, India`
            : undefined
        }
      />
    </div>
  );
}
