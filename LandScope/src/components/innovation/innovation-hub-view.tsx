"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Lightbulb,
  Search,
  Plus,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  FileCheck2,
  Calendar,
  Users,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  FileText,
  Clock,
  Lock,
  Edit,
  Send,
  Trash2,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InnovationChallenge,
  ChallengeApplication,
  PilotProjectRecord,
  ChallengeCategory,
} from "@/lib/innovation/innovation-data";

export interface InnovationHubViewProps {
  userRole?: string;
  initialChallengeId?: string;
  onNavigateToGis?: (geo: { state: string; district: string; tehsil: string }) => void;
  onNavigateToPolicyLab?: (geo?: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (topic?: string) => void;
  onNavigateToReports?: (reportId?: string) => void;
  onNavigateToCollaboration?: (projectId?: string) => void;
}

export function InnovationHubView({
  userRole = "INNOVATOR",
  initialChallengeId,
  onNavigateToGis,
  onNavigateToPolicyLab,
  onNavigateToResearch,
  onNavigateToReports,
  onNavigateToCollaboration,
}: InnovationHubViewProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "hackathons" | "grants" | "pilots" | "competitions" | "my-dashboard"
  >("all");

  // State
  const [challenges, setChallenges] = useState<InnovationChallenge[]>([]);
  const [pilots, setPilots] = useState<PilotProjectRecord[]>([]);
  const [savedChallengeIds, setSavedChallengeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedGeography, setSelectedGeography] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Selected Challenge Detail Drawer
  const [selectedChallenge, setSelectedChallenge] = useState<InnovationChallenge | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userApplications, setUserApplications] = useState<ChallengeApplication[]>([]);
  const [selectedAppForReview, setSelectedAppForReview] = useState<ChallengeApplication | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Create Challenge Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ChallengeCategory>("Policy Challenge");
  const [newTheme, setNewTheme] = useState("Peri-Urban Governance");
  const [newGeography, setNewGeography] = useState("Madhya Pradesh (Sehore)");
  const [newDescription, setNewDescription] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newEligibility, setNewEligibility] = useState("Open to academic researchers & innovators");
  const [newDeadline, setNewDeadline] = useState("2026-11-30");
  const [newBudget, setNewBudget] = useState("₹15,00,000 Demonstration Grant");

  // Apply Form
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalOrg, setProposalOrg] = useState("");
  const [problemUnderstanding, setProblemUnderstanding] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [submitImmediately, setSubmitImmediately] = useState(false);

  // Review Form (1-20 each)
  const [revProblem, setRevProblem] = useState(16);
  const [revInnovation, setRevInnovation] = useState(18);
  const [revFeasibility, setRevFeasibility] = useState(16);
  const [revEvidence, setRevEvidence] = useState(17);
  const [revImpact, setRevImpact] = useState(18);
  const [revScalability, setRevScalability] = useState(17);
  const [revNotes, setRevNotes] = useState("");

  const isPublicUser = userRole === "PUBLIC";
  const canCreate = [
    "RESEARCHER",
    "ACADEMIC_INSTITUTION",
    "POLICYMAKER",
    "GOVERNMENT_AGENCY",
    "ADMIN",
    "INNOVATOR",
  ].includes(userRole);
  const canReview = ["POLICYMAKER", "GOVERNMENT_AGENCY", "ADMIN"].includes(userRole);

  // Fetch Challenges
  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch("/api/innovation/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);

        if (initialChallengeId) {
          const match = data.challenges.find((c: InnovationChallenge) => c.id === initialChallengeId);
          if (match) setSelectedChallenge(match);
        }
      }
    } catch (err) {
      console.error("Failed to load challenges:", err);
    }
  }, [initialChallengeId]);

  // Fetch Pilots
  const fetchPilots = useCallback(async () => {
    try {
      const res = await fetch("/api/innovation/pilots");
      if (res.ok) {
        const data = await res.json();
        setPilots(data.pilots || []);
      }
    } catch (err) {
      console.error("Failed to load pilots:", err);
    }
  }, []);

  // Fetch User Applications / Dashboard
  const fetchUserData = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/innovation/user-dashboard");
      if (res.ok) {
        const data = await res.json();
        setUserApplications(data.dashboard?.myApplications || []);
        const savedIds = new Set<string>(
          (data.dashboard?.savedChallenges || []).map((c: InnovationChallenge) => c.id)
        );
        setSavedChallengeIds(savedIds);
      }
    } catch (err) {
      console.error("Failed to load user dashboard:", err);
    }
  }, [isPublicUser]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([fetchChallenges(), fetchPilots(), fetchUserData()]);
      setLoading(false);
    }
    loadAll();
  }, [fetchChallenges, fetchPilots, fetchUserData]);

  // Toggle Save Challenge
  const handleToggleSave = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPublicUser) {
      setActionMessage("Please sign in to bookmark challenges");
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }
    try {
      const res = await fetch("/api/innovation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedChallengeIds((prev) => {
          const updated = new Set(prev);
          if (data.isSaved) updated.add(id);
          else updated.delete(id);
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  // Create Challenge Handler
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newProblem.trim()) return;

    try {
      const res = await fetch("/api/innovation/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          theme: newTheme,
          geography: newGeography,
          description: newDescription,
          problemStatement: newProblem,
          expectedOutcome: newOutcome || "Demonstration of spatial AI in land governance",
          eligibility: newEligibility,
          submissionDeadline: newDeadline,
          budgetOrPrize: newBudget,
          evaluationCriteria: [
            "Problem Understanding & Grounding",
            "Technical Innovation & Feasibility",
            "Evidence Traceability & Provenance",
            "Tenure Security & Scalability",
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage("Challenge created successfully!");
        setIsCreateModalOpen(false);
        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewProblem("");
        setNewOutcome("");
        await fetchChallenges();
        if (data.challenge) setSelectedChallenge(data.challenge);
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to create challenge");
      }
    } catch {
      setActionMessage("Network error creating challenge");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Submit Application Handler
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    if (!proposalTitle.trim() || !problemUnderstanding.trim() || !proposedSolution.trim()) return;

    try {
      const res = await fetch(`/api/innovation/challenges/${selectedChallenge.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalTitle,
          organization: proposalOrg,
          problemUnderstanding,
          proposedSolution,
          expectedImpact: expectedImpact || "Measurable improvement in cadastral precision",
          teamMembers,
          submitImmediately,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(
          submitImmediately
            ? "Proposal successfully submitted and locked for review!"
            : "Application draft saved in your dashboard."
        );
        setIsApplyModalOpen(false);
        setProposalTitle("");
        setProblemUnderstanding("");
        setProposedSolution("");
        setExpectedImpact("");
        await fetchUserData();
        await fetchChallenges();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to submit application");
      }
    } catch {
      setActionMessage("Network error submitting application");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReview) return;

    try {
      const res = await fetch(`/api/innovation/applications/${selectedAppForReview.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores: {
            problemUnderstanding: revProblem,
            innovation: revInnovation,
            technicalFeasibility: revFeasibility,
            evidence: revEvidence,
            expectedImpact: revImpact,
            scalability: revScalability,
          },
          feedbackNotes: revNotes || "Illustrative evaluation completed.",
        }),
      });

      if (res.ok) {
        setActionMessage("Evaluation submitted successfully!");
        setIsReviewModalOpen(false);
        setSelectedAppForReview(null);
        await fetchUserData();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to submit review");
      }
    } catch {
      setActionMessage("Network error submitting review");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Tab filter
      if (activeTab === "hackathons" && c.category !== "Hackathon" && c.category !== "Knowledge Competition") {
        return false;
      }
      if (activeTab === "grants" && c.category !== "Research Grant") {
        return false;
      }
      if (activeTab === "competitions" && c.category !== "Knowledge Competition") {
        return false;
      }

      // Dropdown filters
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
      if (selectedTheme !== "All" && !c.theme.toLowerCase().includes(selectedTheme.toLowerCase())) return false;
      if (selectedGeography !== "All" && !c.geography.toLowerCase().includes(selectedGeography.toLowerCase()))
        return false;

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.theme.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [challenges, activeTab, selectedCategory, selectedStatus, selectedTheme, selectedGeography, searchQuery]);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto text-slate-200">
      {/* 1. Header Banner */}
      <div className="glass-panel-primary border border-[#3b82f6]/25 text-white p-6 sm:p-8 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3b82f6]/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
              National Land Technology & Research Opportunities
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Innovation Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              &quot;Turn land intelligence into real-world innovation.&quot; Accelerate tenure security,
              climate resilience, and cadastral demarcation through national hackathons, research grants, and
              collaborative pilot sandboxes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canCreate && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-sm font-semibold"
              >
                Create Challenge
              </Button>
            )}
            <div className="glass-panel-secondary px-4 py-2.5 rounded-lg border border-[#3b82f6]/20 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Active Opportunities
              </span>
              <span className="text-xl font-bold text-[#3b82f6] font-mono">{challenges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="bg-[#3b82f6]/15 border border-[#3b82f6]/35 text-[#3b82f6] px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#3b82f6]" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[#3b82f6] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Primary Navigation Tabs */}
      <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          All Challenges ({challenges.length})
        </button>

        <button
          onClick={() => setActiveTab("hackathons")}
          className={`px-4 py-2 rounded transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "hackathons"
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
          }`}
        >
          <Award className="w-4 h-4 text-[#f59e0b]" />
          Active Hackathons & Competitions
        </button>

        <button
          onClick={() => setActiveTab("grants")}
          className={`px-4 py-2 rounded transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "grants"
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
          }`}
        >
          <FileText className="w-4 h-4 text-[#38bdf8]" />
          Research Grants & Fellowships
        </button>

        <button
          onClick={() => setActiveTab("pilots")}
          className={`px-4 py-2 rounded transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "pilots"
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
          }`}
        >
          <Layers className="w-4 h-4 text-[#3b82f6]" />
          Pilot Projects Sandbox ({pilots.length})
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("my-dashboard")}
            className={`px-4 py-2 rounded transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "my-dashboard"
                ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            My Dashboard ({userApplications.length})
          </button>
        )}
      </div>

      {/* 3. Main Workspace Area */}
      {activeTab === "pilots" ? (
        /* ---------------- PILOT PROJECTS VIEW ---------------- */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel-primary p-5 border border-[#3b82f6]/20 rounded-lg">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Field Pilot Projects & Ground Sandboxes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live test deployments of spatial AI and participatory GIS across rural revenue tehsils.
              </p>
            </div>
            <Badge variant="saffron" className="text-xs">
              Demonstration Sandboxes
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pilots.map((p) => (
              <div
                key={p.id}
                className="glass-panel-secondary border border-[#3b82f6]/20 rounded-lg p-5 hover:border-[#3b82f6]/45 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 font-bold">
                      {p.status}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-2 tracking-tight">{p.pilotName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
                      {p.location} • Lead: {p.leadOrganization}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#030712] text-[#f59e0b] border border-[#f59e0b]/30 font-mono">
                    {p.demonstrationLabel}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-0.5">Core Challenge:</span>
                    <p className="text-slate-400 leading-relaxed">{p.problem}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-0.5">Applied Innovation:</span>
                    <p className="text-slate-400 leading-relaxed">{p.innovation}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-[#030712]/80 p-3.5 rounded-lg border border-[#3b82f6]/15 grid grid-cols-3 gap-2 text-center">
                  {p.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{m.label}</span>
                      <span className="font-bold text-slate-100 text-sm font-mono mt-0.5 block">{m.value}</span>
                      {m.trend && (
                        <span className="text-[10px] text-[#3b82f6] font-mono block">{m.trend}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#3b82f6]/10 text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">Timeline: {p.timeline}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      if (onNavigateToGis) {
                        onNavigateToGis({
                          state: p.state,
                          district: p.district,
                          tehsil: p.tehsil || "Ashta",
                        });
                      }
                    }}
                    rightIcon={<ArrowRight className="w-3 h-3 text-[#3b82f6]" />}
                  >
                    View in GIS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "my-dashboard" ? (
        /* ---------------- MY DASHBOARD VIEW ---------------- */
        <div className="space-y-6">
          <div className="glass-panel-primary p-5 border border-[#3b82f6]/20 rounded-lg">
            <h2 className="text-base font-bold text-slate-100">
              My Applications, Submissions & Saved Opportunities
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your proposal lifecycle, review status, and bookmarked challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Submissions Column */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>My Submitted Proposals & Drafts</span>
                <Badge variant="outline" className="text-xs">
                  {userApplications.length} Record(s)
                </Badge>
              </h3>

              {userApplications.length === 0 ? (
                <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-10 text-center text-slate-400 text-xs">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>You have not submitted or drafted any proposals yet.</p>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setActiveTab("all")}
                    className="mt-3"
                  >
                    Browse Open Opportunities
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userApplications.map((app) => (
                    <div
                      key={app.id}
                      className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-4 hover:border-[#3b82f6]/40 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                app.status === "Submitted"
                                  ? "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30"
                                  : app.status === "Under Review"
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {app.status}
                            </span>
                            {app.isLocked && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-slate-500" /> Locked
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 mt-1.5 tracking-tight">
                            {app.proposalTitle}
                          </h4>
                          <span className="text-xs text-slate-400 mt-0.5 block">
                            Challenge: {app.challengeTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {canReview && app.applicantEmail !== userRole && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setSelectedAppForReview(app);
                                setIsReviewModalOpen(true);
                              }}
                            >
                              Review Proposal
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {app.proposedSolution}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-[#3b82f6]/10">
                        <span className="font-mono">Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Draft"}</span>
                        <span>Team: {app.teamMembers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Challenges Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>Bookmarked Opportunities</span>
                <Badge variant="outline" className="text-xs">
                  {savedChallengeIds.size} Saved
                </Badge>
              </h3>

              {savedChallengeIds.size === 0 ? (
                <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-8 text-center text-slate-500 text-xs">
                  <Bookmark className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <p>No saved challenges. Click the bookmark icon on any card to save it here.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {challenges
                    .filter((c) => savedChallengeIds.has(c.id))
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedChallenge(c)}
                        className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-3.5 hover:border-[#3b82f6]/40 cursor-pointer transition-colors"
                      >
                        <span className="text-[10px] text-[#38bdf8] font-semibold block uppercase tracking-wider">
                          {c.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mt-0.5">{c.title}</h4>
                        <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                          Deadline: {c.submissionDeadline}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- DISCOVERY & CHALLENGES LIST ---------------- */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Query */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search challenges, datasets, topics, organizers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="All">All Categories</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research Grant">Research Grant</option>
                  <option value="Policy Challenge">Policy Challenge</option>
                  <option value="Land Technology Challenge">Land Technology</option>
                  <option value="Knowledge Competition">Knowledge Competition</option>
                  <option value="Pilot Project">Pilot Project</option>
                </select>
              </div>

              {/* Geography Filter */}
              <div>
                <select
                  value={selectedGeography}
                  onChange={(e) => setSelectedGeography(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="All">All Geographies</option>
                  <option value="National">National (Pan-India)</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open for Proposals</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-16 text-center text-slate-400 text-sm">
              Loading national innovation opportunities...
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="glass-panel-secondary border border-[#3b82f6]/15 rounded-lg p-16 text-center text-slate-400 text-sm">
              <Lightbulb className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-slate-300">No innovation opportunities match your selected filters.</p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTheme("All");
                  setSelectedGeography("All");
                  setSelectedStatus("All");
                  setSearchQuery("");
                }}
                className="mt-3"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChallenges.map((challenge) => {
                const isSaved = savedChallengeIds.has(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="glass-panel-secondary border border-[#3b82f6]/15 hover:border-[#3b82f6]/45 rounded-lg p-5 shadow-sm hover:shadow-[0_0_15px_rgba(59, 130, 246,0.12)] transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25 font-bold">
                          {challenge.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/25 font-semibold">
                            {challenge.status}
                          </span>
                          <button
                            onClick={(e) => handleToggleSave(challenge.id, e)}
                            className="text-slate-400 hover:text-amber-400 p-1 cursor-pointer transition-colors"
                            title={isSaved ? "Remove bookmark" : "Save opportunity"}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-[#3b82f6] transition-colors line-clamp-2 tracking-tight">
                        {challenge.title}
                      </h3>

                      {/* Theme */}
                      <p className="text-xs font-semibold text-[#f59e0b] mt-1.5">
                        Theme: {challenge.theme}
                      </p>

                      {/* Short Description */}
                      <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-4 pt-3.5 border-t border-[#3b82f6]/10 space-y-2 text-[11px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                          <span className="line-clamp-1 max-w-[170px]">{challenge.organizer}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span className="line-clamp-1">{challenge.geography}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          Deadline: {challenge.submissionDeadline}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {challenge.submissionsCount} proposal(s)
                        </span>
                      </div>

                      {/* Illustrative Demonstration Label */}
                      <div className="pt-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">
                          {challenge.demonstrationLabel}
                        </span>
                        <span className="text-[#3b82f6] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Challenge Detail Drawer / Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 flex items-center justify-end">
          <div className="glass-panel-floating border-l border-[#3b82f6]/30 w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-[#3b82f6]/20 flex items-start justify-between gap-4 bg-[#030712]/60">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] font-bold border border-[#38bdf8]/25">
                    {selectedChallenge.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#3b82f6] font-semibold border border-[#3b82f6]/25">
                    {selectedChallenge.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedChallenge.demonstrationLabel}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">{selectedChallenge.title}</h2>
                <span className="text-xs text-slate-400 mt-1 block">
                  Organized by {selectedChallenge.organizer} • {selectedChallenge.geography}
                </span>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
              {/* Problem Statement */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                  Problem Statement
                </h3>
                <p className="bg-[#030712]/90 p-4 rounded-lg border border-[#f59e0b]/30 text-slate-200 leading-relaxed font-sans">
                  {selectedChallenge.problemStatement}
                </p>
              </div>

              {/* Expected Outcome */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider">
                  Expected Deliverables & Outcomes
                </h3>
                <p className="glass-panel-secondary p-4 rounded-lg border border-[#3b82f6]/20 leading-relaxed text-slate-300">
                  {selectedChallenge.expectedOutcome}
                </p>
              </div>

              {/* Eligibility & Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel-secondary p-3.5 rounded-lg border border-[#3b82f6]/15 space-y-1">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">Eligibility</span>
                  <span className="text-slate-400">{selectedChallenge.eligibility}</span>
                </div>
                <div className="glass-panel-secondary p-3.5 rounded-lg border border-[#3b82f6]/15 space-y-1">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">Submission Deadline</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    {selectedChallenge.submissionDeadline}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Duration: {selectedChallenge.startDate} to {selectedChallenge.endDate}
                  </span>
                </div>
              </div>

              {/* Budget / Award */}
              {selectedChallenge.budgetOrPrize && (
                <div className="bg-[#3b82f6]/10 p-3.5 rounded-lg border border-[#3b82f6]/25 flex items-center justify-between">
                  <span className="font-bold text-slate-200">Demonstration Grant / Prize:</span>
                  <span className="font-bold text-[#3b82f6] text-sm font-mono">
                    {selectedChallenge.budgetOrPrize}
                  </span>
                </div>
              )}

              {/* Evaluation Criteria */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Evaluation Criteria
                </h3>
                <ul className="space-y-2 pl-1">
                  {selectedChallenge.evaluationCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-[#3b82f6] flex-shrink-0" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related LANDScope System Contexts */}
              {selectedChallenge.relatedContext && (
                <div className="space-y-2.5 pt-3 border-t border-[#3b82f6]/15">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Associated LANDScope Intelligence Contexts
                  </h3>
                  <div className="space-y-2 glass-panel-secondary p-3.5 rounded-lg border border-[#3b82f6]/15 text-slate-400 text-[11px]">
                    {selectedChallenge.relatedContext.evidenceTitle && (
                      <div className="flex items-center justify-between">
                        <span>Research Evidence:</span>
                        <span className="font-semibold text-slate-200">
                          {selectedChallenge.relatedContext.evidenceTitle}
                        </span>
                      </div>
                    )}
                    {selectedChallenge.relatedContext.datasetName && (
                      <div className="flex items-center justify-between">
                        <span>Demarcation Dataset:</span>
                        <span className="font-semibold text-slate-200">
                          {selectedChallenge.relatedContext.datasetName} (
                          {selectedChallenge.relatedContext.datasetFormat})
                        </span>
                      </div>
                    )}
                    {selectedChallenge.relatedContext.scenarioName && (
                      <div className="flex items-center justify-between">
                        <span>Policy Digital Twin Scenario:</span>
                        <span className="font-semibold text-slate-200">
                          {selectedChallenge.relatedContext.scenarioName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-[#3b82f6]/20 bg-[#030712]/70 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleToggleSave(selectedChallenge.id, e)}
                leftIcon={
                  savedChallengeIds.has(selectedChallenge.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )
                }
              >
                {savedChallengeIds.has(selectedChallenge.id) ? "Saved" : "Save Opportunity"}
              </Button>

              <div className="flex items-center gap-2">
                {selectedChallenge.relatedContext?.state && onNavigateToGis && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedChallenge.relatedContext?.state) {
                        onNavigateToGis({
                          state: selectedChallenge.relatedContext.state,
                          district: selectedChallenge.relatedContext.district || "Sehore",
                          tehsil: selectedChallenge.relatedContext.tehsil || "Ashta",
                        });
                      }
                    }}
                  >
                    View in GIS
                  </Button>
                )}

                {!isPublicUser && selectedChallenge.status === "Open" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsApplyModalOpen(true);
                    }}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Apply / Submit Proposal
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Challenge Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-floating border border-[#3b82f6]/30 w-full max-w-xl rounded-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#3b82f6]/20 bg-[#030712]/60 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">+ Create Innovation Opportunity</h3>
                <span className="text-xs text-slate-400">
                  Launch a research challenge, hackathon, or demonstration grant
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Drone AI Cadastral Demarcation Challenge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ChallengeCategory)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="Policy Challenge">Policy Challenge</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Research Grant">Research Grant</option>
                    <option value="Land Technology Challenge">Land Technology</option>
                    <option value="Knowledge Competition">Knowledge Competition</option>
                    <option value="Pilot Project">Pilot Project</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Theme *</label>
                  <input
                    type="text"
                    required
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Geography *</label>
                  <input
                    type="text"
                    required
                    value={newGeography}
                    onChange={(e) => setNewGeography(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Overview of the research problem or hackathon challenge..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Problem Statement *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of the statutory or technological obstacle..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Expected Deliverables</label>
                <input
                  type="text"
                  placeholder="e.g. Open-source deep learning segmentation model or policy whitepaper"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Eligibility</label>
                  <input
                    type="text"
                    value={newEligibility}
                    onChange={(e) => setNewEligibility(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Budget / Demonstration Grant</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300">
                Notice: All challenges are registered under the &quot;Illustrative Demonstration Challenge&quot;
                label. Permissions and access boundaries are strictly validated on the server.
              </div>

              <div className="pt-3.5 border-t border-[#3b82f6]/20 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Challenge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Apply / Submit Proposal Modal */}
      {isApplyModalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-floating border border-[#3b82f6]/30 w-full max-w-xl rounded-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#3b82f6]/20 bg-[#030712]/60 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Submit Innovation Proposal</h3>
                <span className="text-xs text-slate-400">
                  Challenge: {selectedChallenge.title}
                </span>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GeoVision: High-Resolution Orthomosaic Feature Delineator"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Applicant Organization</label>
                  <input
                    type="text"
                    placeholder="University, Lab, or Startup"
                    value={proposalOrg}
                    onChange={(e) => setProposalOrg(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Team Members</label>
                  <input
                    type="text"
                    placeholder="Names of collaborating researchers"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Understanding of the Problem Statement *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline your technical diagnosis of the land governance obstacle..."
                  value={problemUnderstanding}
                  onChange={(e) => setProblemUnderstanding(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Proposed Solution & Technical Methodology *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify model architecture, spatial datasets, or policy intervention mechanism..."
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Expected Impact on Land Governance
                </label>
                <input
                  type="text"
                  placeholder="e.g. 95% reduction in boundary dispute settlement latency"
                  value={expectedImpact}
                  onChange={(e) => setExpectedImpact(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Formal Submission</span>
                  <span className="text-[11px] text-slate-400">
                    If checked, your proposal will be locked and sent directly for evaluation.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={submitImmediately}
                  onChange={(e) => setSubmitImmediately(e.target.checked)}
                  className="w-4 h-4 accent-[#3b82f6]"
                />
              </div>

              <div className="pt-3.5 border-t border-[#3b82f6]/20 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {submitImmediately ? "Submit & Lock Proposal" : "Save as Draft"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Review / Evaluation Modal */}
      {isReviewModalOpen && selectedAppForReview && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-floating border border-[#3b82f6]/30 w-full max-w-xl rounded-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#3b82f6]/20 bg-[#030712]/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                    Illustrative Evaluation
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">Review Proposal</h3>
                <span className="text-xs text-slate-400">
                  {selectedAppForReview.proposalTitle} ({selectedAppForReview.applicantName})
                </span>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="glass-panel-secondary p-3.5 rounded-lg border border-[#3b82f6]/15 space-y-1">
                <span className="font-semibold text-slate-200">Proposal Summary:</span>
                <p className="text-slate-400 line-clamp-3 leading-relaxed">{selectedAppForReview.proposedSolution}</p>
              </div>

              {/* 6 Evaluation Dimensions (1-20 each) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Scoring Criteria (1 - 20 Points Each)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Problem Understanding: <span className="font-bold text-[#3b82f6] font-mono">{revProblem}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revProblem}
                      onChange={(e) => setRevProblem(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Innovation: <span className="font-bold text-[#3b82f6] font-mono">{revInnovation}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revInnovation}
                      onChange={(e) => setRevInnovation(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Technical Feasibility: <span className="font-bold text-[#3b82f6] font-mono">{revFeasibility}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revFeasibility}
                      onChange={(e) => setRevFeasibility(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Evidence Grounding: <span className="font-bold text-[#3b82f6] font-mono">{revEvidence}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revEvidence}
                      onChange={(e) => setRevEvidence(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Expected Impact: <span className="font-bold text-[#3b82f6] font-mono">{revImpact}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revImpact}
                      onChange={(e) => setRevImpact(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Scalability: <span className="font-bold text-[#3b82f6] font-mono">{revScalability}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revScalability}
                      onChange={(e) => setRevScalability(Number(e.target.value))}
                      className="w-full accent-[#3b82f6]"
                    />
                  </div>
                </div>

                <div className="bg-[#3b82f6]/10 p-3 rounded-lg border border-[#3b82f6]/25 text-center font-bold text-[#3b82f6] font-mono">
                  Total Assessment Score:{" "}
                  {revProblem + revInnovation + revFeasibility + revEvidence + revImpact + revScalability} / 120
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Evaluator Feedback & Recommendation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Constructive feedback for the applicant..."
                  value={revNotes}
                  onChange={(e) => setRevNotes(e.target.value)}
                  className="w-full p-2.5 border border-[#3b82f6]/25 rounded-md bg-[#030712]/90 text-slate-200 text-xs focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="pt-3.5 border-t border-[#3b82f6]/20 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Submit Evaluation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
