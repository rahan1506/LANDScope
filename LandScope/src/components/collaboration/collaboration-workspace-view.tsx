"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FolderGit2,
  Share2,
  Plus,
  Shield,
  FileText,
  Database,
  MapPin,
  Clock,
  MessageSquare,
  Activity,
  Send,
  Trash2,
  ExternalLink,
  Lock,
  UserCheck,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle,
  MailCheck,
  XCircle,
  FileSpreadsheet,
  CornerDownRight,
  TrendingUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ModalDialog } from "@/components/ui/modal-dialog";
import {
  CollaborativeProject,
  ProjectMember,
  MemberInvitation,
  SharedEvidence,
  SharedDataset,
  SharedGisContext,
  SharedPolicyScenario,
  ProjectComment,
  ProjectActivityEvent,
  ProjectRole,
  ProjectPermission,
  ProjectType,
  ProjectVisibility,
} from "@/lib/collaboration/collaboration-data";

export interface CollaborationWorkspaceViewProps {
  userRole?: string;
  initialProjectId?: string;
  onNavigateToGis?: (geo: { state: string; district: string; tehsil: string }) => void;
  onNavigateToPolicyLab?: (geo?: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (topic?: string) => void;
  onNavigateToReports?: (reportId?: string) => void;
}

export function CollaborationWorkspaceView({
  userRole = "RESEARCHER",
  initialProjectId,
  onNavigateToGis,
  onNavigateToPolicyLab,
  onNavigateToResearch,
  onNavigateToReports,
}: CollaborationWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "shared" | "invitations" | "activity">("projects");
  const [ownedProjects, setOwnedProjects] = useState<CollaborativeProject[]>([]);
  const [sharedProjects, setSharedProjects] = useState<CollaborativeProject[]>([]);
  const [invitations, setInvitations] = useState<MemberInvitation[]>([]);
  const [recentActivities, setRecentActivities] = useState<ProjectActivityEvent[]>([]);
  const [selectedProject, setSelectedProject] = useState<CollaborativeProject | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<
    "overview" | "members" | "evidence" | "datasets" | "gis" | "scenarios" | "reports" | "comments" | "activity"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    organization: "",
    projectRole: "RESEARCHER" as ProjectRole,
    projectPermission: "write" as ProjectPermission,
  });

  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    researchArea: "Land Economics & Peri-Urban Governance",
    geography: "Madhya Pradesh > Sehore > Ashta",
    projectType: "Research" as ProjectType,
    visibility: "Private" as ProjectVisibility,
  });

  const [commentInput, setCommentInput] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    authorOrOrg: "",
    year: 2026,
    confidence: 92,
    evidenceType: "Research Paper",
    notes: "",
  });

  const isPublic = userRole === "PUBLIC";

  // Initial load projects effect
  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await fetch("/api/collaboration/projects");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setOwnedProjects(data.owned || []);
          setSharedProjects(data.shared || []);
          setInvitations(data.invitations || []);
          setRecentActivities(data.recentActivities || []);
          const all = [...(data.owned || []), ...(data.shared || [])];
          if (all.length > 0) {
            const match = initialProjectId ? all.find((p: CollaborativeProject) => p.id === initialProjectId) : all[0];
            setSelectedProject(match || all[0]);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [initialProjectId]);

  // Re-fetch collaboration projects on user actions
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/collaboration/projects");
      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Session expired. Please log in.");
        } else {
          setErrorMsg("Failed to load collaborative projects.");
        }
        return;
      }
      const data = await res.json();
      setOwnedProjects(data.owned || []);
      setSharedProjects(data.shared || []);
      setInvitations(data.invitations || []);
      setRecentActivities(data.recentActivities || []);

      const all = [...(data.owned || []), ...(data.shared || [])];
      if (all.length > 0) {
        const match = initialProjectId ? all.find((p: CollaborativeProject) => p.id === initialProjectId) : all[0];
        setSelectedProject(match || all[0]);
      }
    } catch {
      setErrorMsg("Network error loading collaboration data.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh single project
  const refreshProject = async (id: string) => {
    try {
      const res = await fetch(`/api/collaboration/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data.project);
        setOwnedProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
        setSharedProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle invite member
  const handleInviteMember = async () => {
    if (!selectedProject || !inviteForm.name || !inviteForm.email) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      if (res.ok) {
        await refreshProject(selectedProject.id);
        setInviteModalOpen(false);
        setInviteForm({
          name: "",
          email: "",
          organization: "",
          projectRole: "RESEARCHER",
          projectPermission: "write",
        });
      } else {
        const err = await res.json();
        alert(err.message || "Failed to invite member.");
      }
    } catch (err) {
      alert("Error inviting member.");
    }
  };

  // Accept invitation
  const handleAcceptInvite = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/collaboration/invitations/${invitationId}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchProjects();
      } else {
        alert("Failed to accept invitation.");
      }
    } catch (err) {
      alert("Error accepting invitation.");
    }
  };

  // Reject invitation
  const handleRejectInvite = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/collaboration/invitations/${invitationId}/reject`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchProjects();
      } else {
        alert("Failed to reject invitation.");
      }
    } catch (err) {
      alert("Error rejecting invitation.");
    }
  };

  // Handle create project
  const handleCreateProject = async () => {
    if (!newProjectForm.title) return;
    try {
      const res = await fetch("/api/collaboration/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectForm),
      });
      if (res.ok) {
        const data = await res.json();
        setNewProjectModalOpen(false);
        setNewProjectForm({
          title: "",
          subtitle: "",
          description: "",
          researchArea: "Land Economics & Peri-Urban Governance",
          geography: "Madhya Pradesh > Sehore > Ashta",
          projectType: "Research",
          visibility: "Private",
        });
        await fetchProjects();
        if (data.project) setSelectedProject(data.project);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create project.");
      }
    } catch (err) {
      alert("Error creating project.");
    }
  };

  // Handle post comment
  const handleAddComment = async () => {
    if (!selectedProject || !commentInput.trim()) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput.trim(), parentId: replyParentId || undefined }),
      });
      if (res.ok) {
        setCommentInput("");
        setReplyParentId(null);
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to post comment.");
      }
    } catch (err) {
      alert("Error posting comment.");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `/api/collaboration/projects/${selectedProject.id}/comments?commentId=${encodeURIComponent(commentId)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete comment.");
      }
    } catch (err) {
      alert("Error deleting comment.");
    }
  };

  // Handle add evidence
  const handleAddEvidence = async () => {
    if (!selectedProject || !evidenceForm.title) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evidenceForm),
      });
      if (res.ok) {
        setEvidenceModalOpen(false);
        setEvidenceForm({ title: "", authorOrOrg: "", year: 2026, confidence: 92, evidenceType: "Research Paper", notes: "" });
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add evidence.");
      }
    } catch (err) {
      alert("Error adding evidence.");
    }
  };

  // Handle remove evidence
  const handleRemoveEvidence = async (evidenceId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `/api/collaboration/projects/${selectedProject.id}/evidence?evidenceId=${encodeURIComponent(evidenceId)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshProject(selectedProject.id);
      } else {
        alert("Failed to remove evidence.");
      }
    } catch (err) {
      alert("Error removing evidence.");
    }
  };

  // Role headline mapping
  const getRoleSectionTitle = () => {
    switch (userRole) {
      case "POLICYMAKER":
        return "Policy Collaborations";
      case "ACADEMIC_INSTITUTION":
        return "Institutional Projects";
      case "GOVERNMENT_AGENCY":
        return "Agency Projects";
      case "RESEARCHER":
      default:
        return "My Projects";
    }
  };

  if (isPublic) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="p-8 text-center glass-panel-primary border border-amber-500/20 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Institutional Collaboration Workspace</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Multi-stakeholder project collaboration is reserved for authorized researchers, policymakers, academic institutions, and government agencies. Public users can browse published research and public briefs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3b82f6]/15">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Collaboration Workspace", active: true },
            ]}
          />
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Collaboration Workspace
            </h1>
            <span className="text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
              SIH Demonstration Account
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Work across research, evidence, geospatial intelligence and policy experimentation in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setNewProjectModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Collaboration Project
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#3b82f6]/15 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projects"
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          {getRoleSectionTitle()} ({ownedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("shared")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "shared"
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Shared With Me ({sharedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "invitations"
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Pending Invitations
          {invitations.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#3b82f6] text-[#030712] text-[10px] flex items-center justify-center font-bold">
              {invitations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "activity"
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5 rounded-t"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Recent Activity ({recentActivities.length})
        </button>
      </div>

      {/* INVITATIONS TAB */}
      {activeTab === "invitations" ? (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm text-slate-100">Pending Project Invitations</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Invitations from institutional project owners to collaborate across land research, policy simulation, or demarcation audits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MailCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No pending project invitations.
              </div>
            ) : (
              <div className="divide-y divide-[#3b82f6]/10">
                {invitations.map((inv) => (
                  <div key={inv.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{inv.projectTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Invited by <span className="font-semibold text-slate-300">{inv.inviterName}</span> ({inv.inviterEmail})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25 px-2 py-0.5 rounded">
                          Role: {inv.assignedRole}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">Permission: {inv.assignedPermission}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleAcceptInvite(inv.id)}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleRejectInvite(inv.id)}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : activeTab === "activity" ? (
        /* ACTIVITY TAB */
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm text-slate-100">Platform Collaboration Activity Log</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Chronological log of multi-stakeholder project milestones, evidence contributions, and scenario evaluations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#3b82f6]/10">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{act.actorName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{act.description}</p>
                    <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-2 py-0.5 rounded">
                      {act.type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* PROJECTS LIST & WORKSPACE GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Projects Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#3b82f6]" />
              {activeTab === "projects" ? "Active Projects" : "Collaborations Joined"}
            </h3>

            {(activeTab === "projects" ? ownedProjects : sharedProjects).length === 0 ? (
              <div className="p-8 text-center glass-panel-secondary rounded-lg border border-[#3b82f6]/15">
                <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No collaborative projects found.</p>
              </div>
            ) : (
              (activeTab === "projects" ? ownedProjects : sharedProjects).map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "glass-panel-floating border-[#3b82f6] shadow-[0_0_15px_rgba(59, 130, 246,0.15)] ring-1 ring-[#3b82f6]/40"
                        : "glass-panel-secondary border-[#3b82f6]/15 hover:border-[#3b82f6]/40 hover:bg-[#0a1814]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/25 px-2 py-0.5 rounded">
                        {proj.projectType || proj.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{proj.lastUpdated}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{proj.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2.5 border-t border-[#3b82f6]/10">
                      <span>Owner: <strong className="text-slate-200">{proj.ownerName}</strong></span>
                      <span className="text-[10px] text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/25 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#3b82f6]" /> {proj.members.length} members
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#38bdf8]" /> {proj.evidence.length} evidence
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-[#f59e0b]" /> {proj.datasets.length} datasets
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Project Details Workspace (8 Cols) */}
          <div className="lg:col-span-8">
            {selectedProject ? (
              <div className="glass-panel-primary border border-[#3b82f6]/20 rounded-lg overflow-hidden divide-y divide-[#3b82f6]/15">
                {/* Project Header */}
                <div className="p-5 sm:p-6 bg-[#030712]/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 px-2 py-0.5 rounded">
                        {selectedProject.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 px-2 py-0.5 rounded">
                        {selectedProject.projectType || selectedProject.category}
                      </span>
                      {selectedProject.isPrivate && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-400" /> Private Project
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Created: {selectedProject.createdAt.split("T")[0]}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-100 tracking-tight">{selectedProject.title}</h2>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{selectedProject.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400 mt-4 pt-3.5 border-t border-[#3b82f6]/10">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Lead / Owner</span>
                      <span className="font-bold text-slate-200 text-xs mt-0.5 block">{selectedProject.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Research Area</span>
                      <span className="font-medium text-slate-300 text-xs mt-0.5 block">{selectedProject.researchArea || "Land Policy"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Geography</span>
                      <span className="font-medium text-slate-300 text-xs mt-0.5 block">{selectedProject.geography || "Central India"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Visibility</span>
                      <span className="font-medium text-[#38bdf8] text-xs uppercase mt-0.5 block">{selectedProject.visibility || "Private"}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex flex-wrap items-center gap-1 px-4 py-2 bg-[#030712]/80 border-b border-[#3b82f6]/15 text-xs overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview", icon: FolderGit2 },
                    { id: "members", label: `Members (${selectedProject.members.length})`, icon: Users },
                    { id: "evidence", label: `Evidence (${selectedProject.evidence.length})`, icon: FileText },
                    { id: "datasets", label: `Datasets (${selectedProject.datasets.length})`, icon: Database },
                    { id: "gis", label: `GIS Context (${selectedProject.gisContexts.length})`, icon: MapPin },
                    { id: "scenarios", label: `Scenarios (${selectedProject.scenarios.length})`, icon: TrendingUp },
                    { id: "reports", label: `Reports (${selectedProject.associatedReportIds?.length || 0})`, icon: FileSpreadsheet },
                    { id: "comments", label: `Comments (${selectedProject.comments.length})`, icon: MessageSquare },
                    { id: "activity", label: "Activity", icon: Activity },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = projectDetailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setProjectDetailTab(
                            tab.id as
                              | "overview"
                              | "members"
                              | "evidence"
                              | "datasets"
                              | "gis"
                              | "scenarios"
                              | "reports"
                              | "comments"
                              | "activity"
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-[#3b82f6]/15 text-[#3b82f6] font-bold border border-[#3b82f6]/30 shadow-xs"
                            : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1f1b]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab Content Panes */}
                <div className="p-5 sm:p-6">
                  {/* OVERVIEW TAB */}
                  {projectDetailTab === "overview" && (
                    <div className="space-y-5">
                      <div className="p-4 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-1.5">
                          Project Objective & Collaboration Scope
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Empirical Studies</span>
                          <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{selectedProject.evidence.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Attached from Research</span>
                        </div>
                        <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">GIS Contexts</span>
                          <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{selectedProject.gisContexts.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Tehsil Boundary Baselines</span>
                        </div>
                        <div className="p-3.5 glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Policy Scenarios</span>
                          <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{selectedProject.scenarios.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Digital Twin Simulations</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MEMBERS TAB */}
                  {projectDetailTab === "members" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Project Collaborators & Access Controls
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Multi-stakeholder team members across Research, Policy, Academic, and Agency nodes.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setInviteModalOpen(true)}
                          leftIcon={<Plus className="w-3.5 h-3.5 text-[#3b82f6]" />}
                        >
                          Invite Member
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Collaborator</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Project Role</TableHead>
                            <TableHead>Permission</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.members.map((mem) => (
                            <TableRow key={mem.id}>
                              <TableCell>
                                <span className="font-bold text-slate-100 block text-xs">{mem.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{mem.email}</span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-300">{mem.organization}</TableCell>
                              <TableCell>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
                                  {mem.projectRole}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-[10px] font-medium text-slate-400 capitalize">{mem.projectPermission}</span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    mem.status === "ACTIVE"
                                      ? "text-[#3b82f6] bg-[#3b82f6]/15 border border-[#3b82f6]/30"
                                      : "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                                  }`}
                                >
                                  {mem.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* EVIDENCE TAB */}
                  {projectDetailTab === "evidence" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Empirical Research & Evidence Repository
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Shared studies and peer-reviewed papers informing policy design and spatial modeling.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setEvidenceModalOpen(true)}
                          leftIcon={<Plus className="w-3.5 h-3.5 text-[#3b82f6]" />}
                        >
                          Add Evidence
                        </Button>
                      </div>

                      {selectedProject.evidence.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-[#3b82f6]/20 rounded-lg">
                          <p className="text-xs text-slate-400">No empirical evidence shared yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#3b82f6]/10">
                          {selectedProject.evidence.map((ev) => (
                            <div key={ev.id} className="py-3.5 flex items-start justify-between gap-3">
                              <div>
                                <h5 className="text-xs font-bold text-slate-100">{ev.title}</h5>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                  <span>{ev.authorOrOrg} • {ev.year}</span>
                                  <span className="text-[10px] font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25 px-1.5 py-0.2 rounded">
                                    {ev.evidenceType}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#3b82f6]">
                                    {ev.confidence}% Confidence
                                  </span>
                                </div>
                                {ev.notes && <p className="text-[11px] text-slate-300 italic mt-1.5 leading-relaxed">&ldquo;{ev.notes}&rdquo;</p>}
                                <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                                  Added by {ev.addedBy} on {ev.dateAdded}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {onNavigateToResearch && (
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onNavigateToResearch(ev.title)}
                                    rightIcon={<ExternalLink className="w-3 h-3" />}
                                  >
                                    View Evidence
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleRemoveEvidence(ev.id)}
                                  className="text-slate-400 hover:text-red-400"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DATASETS TAB */}
                  {projectDetailTab === "datasets" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Spatial & Cadastral Datasets
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Multi-spectral satellite imagery stacks and vector cadastre layers linked to this project.
                          </p>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dataset Name</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Geography</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.datasets.map((ds) => (
                            <TableRow key={ds.id}>
                              <TableCell className="text-xs font-bold text-slate-100">{ds.name}</TableCell>
                              <TableCell className="text-xs text-slate-300 font-mono">{ds.format}</TableCell>
                              <TableCell className="text-xs text-slate-300">{ds.geography}</TableCell>
                              <TableCell className="text-xs text-slate-400">{ds.coverage}</TableCell>
                              <TableCell>
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                                  {ds.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* GIS TAB */}
                  {projectDetailTab === "gis" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Saved Geospatial Intelligence Contexts
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            State, district, and tehsil boundaries with active OGC layer configurations.
                          </p>
                        </div>
                      </div>

                      {selectedProject.gisContexts.map((gis) => (
                        <div key={gis.id} className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-100">
                              {gis.state} &gt; {gis.district} &gt; {gis.tehsil}
                            </span>
                            {onNavigateToGis && (
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                  onNavigateToGis({
                                    state: gis.state,
                                    district: gis.district,
                                    tehsil: gis.tehsil,
                                  })
                                }
                                leftIcon={<MapPin className="w-3.5 h-3.5" />}
                              >
                                Open in Land Intelligence
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {gis.selectedLayers.map((lay) => (
                              <span
                                key={lay}
                                className="text-[10px] font-medium text-slate-300 bg-[#030712] border border-[#3b82f6]/25 px-2 py-0.5 rounded"
                              >
                                {lay}
                              </span>
                            ))}
                          </div>
                          {gis.notes && <p className="text-[11px] text-slate-300 mt-2.5 italic">&ldquo;{gis.notes}&rdquo;</p>}
                          <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                            Saved by {gis.savedBy} on {gis.dateSaved}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SCENARIOS TAB */}
                  {projectDetailTab === "scenarios" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Policy Digital Twin Scenarios
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Simulated policy parameter models and statutory multi-dimensional impact briefs.
                          </p>
                        </div>
                      </div>

                      {selectedProject.scenarios.map((scn) => (
                        <div key={scn.id} className="p-4 glass-panel-secondary border border-[#3b82f6]/20 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-100">{scn.name}</span>
                              <span className="text-[10px] font-bold text-[#38bdf8] bg-[#38bdf8]/15 border border-[#38bdf8]/30 px-2 py-0.5 rounded">
                                {scn.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-1">
                              {scn.geography} • Type: {scn.policyType}
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {scn.impactDimensions?.map((dim) => (
                                <span key={dim} className="text-[9px] bg-[#030712] text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-0.5 rounded">
                                  {dim}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-1.5 font-mono">
                              Created by {scn.createdBy} • Simulation: {scn.lastSimulation}
                            </span>
                          </div>
                          {onNavigateToPolicyLab && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => onNavigateToPolicyLab()}
                              leftIcon={<ExternalLink className="w-3.5 h-3.5 text-[#3b82f6]" />}
                            >
                              Open Policy Scenario
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* REPORTS TAB */}
                  {projectDetailTab === "reports" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Associated Policy Briefs & Reports
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Evidence-backed policy briefs linked from the Reports module.
                          </p>
                        </div>
                      </div>

                      {(!selectedProject.associatedReportIds || selectedProject.associatedReportIds.length === 0) ? (
                        <div className="p-8 text-center border border-dashed border-[#3b82f6]/20 rounded-lg">
                          <p className="text-xs text-slate-400">No policy reports linked yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#3b82f6]/10">
                          {selectedProject.associatedReportIds.map((repId) => (
                            <div key={repId} className="py-3.5 flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-slate-100 block">
                                  Statutory Policy Decision Brief: Controlled Peri-Urban Expansion
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">Reference: {repId}</span>
                              </div>
                              {onNavigateToReports && (
                                <Button
                                  variant="primary"
                                  size="xs"
                                  onClick={() => onNavigateToReports(repId)}
                                  leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                                >
                                  Open Policy Brief
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COMMENTS TAB */}
                  {projectDetailTab === "comments" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Inter-Institutional Discussion & Deliberation
                      </h4>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {selectedProject.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`p-3.5 rounded-lg border ${
                              cmt.parentId ? "ml-6 glass-panel-floating border-[#38bdf8]/30" : "glass-panel-secondary border-[#3b82f6]/15"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {cmt.parentId && <CornerDownRight className="w-3.5 h-3.5 text-[#38bdf8]" />}
                                <span className="text-xs font-bold text-slate-200">{cmt.authorName}</span>
                                <span className="text-[10px] uppercase font-bold text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-1.5 py-0.2 rounded">
                                  {cmt.authorRole}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-500">{cmt.timestamp}</span>
                                <button
                                  onClick={() => setReplyParentId(cmt.id)}
                                  className="text-[10px] text-[#38bdf8] hover:underline cursor-pointer"
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(cmt.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{cmt.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment form */}
                      <div className="space-y-2 pt-3 border-t border-[#3b82f6]/15">
                        {replyParentId && (
                          <div className="flex items-center justify-between text-[11px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/25 px-2.5 py-1 rounded">
                            <span>Replying to comment...</span>
                            <button onClick={() => setReplyParentId(null)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                              Cancel Reply
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            placeholder={replyParentId ? "Type reply..." : "Add comment, policy feedback, or methodological note..."}
                            className="flex-1 text-xs bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3.5 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/40"
                          />
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={handleAddComment}
                            leftIcon={<Send className="w-3.5 h-3.5" />}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVITY TAB */}
                  {projectDetailTab === "activity" && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Project Event Audit Log
                      </h4>
                      <div className="divide-y divide-[#3b82f6]/10">
                        {selectedProject.activities.map((act) => (
                          <div key={act.id} className="py-3 flex items-start gap-2.5">
                            <Activity className="w-3.5 h-3.5 text-[#3b82f6] mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <span className="text-xs text-slate-200 font-medium block">{act.description}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {act.actorName} ({act.actorRole}) • {act.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center glass-panel-secondary border border-[#3b82f6]/15 rounded-lg">
                <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Select a project on the left to inspect collaborative workspace.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <ModalDialog
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Invite Project Collaborator"
        >
          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
              <input
                type="text"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="e.g. Prof. Sudhir Kulkarni"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Institutional Email</label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="e.g. academic@landscope.demo"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Organization</label>
              <input
                type="text"
                value={inviteForm.organization}
                onChange={(e) => setInviteForm({ ...inviteForm, organization: e.target.value })}
                placeholder="e.g. National Institute of Advanced Rural Studies"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Project Role</label>
                <select
                  value={inviteForm.projectRole}
                  onChange={(e) => setInviteForm({ ...inviteForm, projectRole: e.target.value as ProjectRole })}
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="RESEARCHER">RESEARCHER</option>
                  <option value="POLICYMAKER">POLICYMAKER</option>
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="GOVERNMENT_AGENCY">GOVERNMENT_AGENCY</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Permissions</label>
                <select
                  value={inviteForm.projectPermission}
                  onChange={(e) => setInviteForm({ ...inviteForm, projectPermission: e.target.value as ProjectPermission })}
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="write">Read & Write</option>
                  <option value="comment">Comment Only</option>
                  <option value="read">Read-Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#3b82f6]/15">
              <Button variant="outline" size="xs" onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleInviteMember}>
                Send Invitation
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* New Project Modal */}
      {newProjectModalOpen && (
        <ModalDialog
          isOpen={newProjectModalOpen}
          onClose={() => setNewProjectModalOpen(false)}
          title="Create Collaboration Project"
        >
          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Project Name</label>
              <input
                type="text"
                value={newProjectForm.title}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                placeholder="e.g. Peri-Urban Land Governance Study"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Description</label>
              <textarea
                value={newProjectForm.description}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                rows={2}
                placeholder="Describe project objectives and scope..."
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Research Area</label>
                <input
                  type="text"
                  value={newProjectForm.researchArea}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, researchArea: e.target.value })}
                  placeholder="e.g. Land Economics & Peri-Urban Governance"
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Geography</label>
                <input
                  type="text"
                  value={newProjectForm.geography}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, geography: e.target.value })}
                  placeholder="e.g. Madhya Pradesh > Sehore > Ashta"
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Project Type</label>
                <select
                  value={newProjectForm.projectType}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, projectType: e.target.value as ProjectType })}
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="Research">Research</option>
                  <option value="Policy Analysis">Policy Analysis</option>
                  <option value="Land Governance">Land Governance</option>
                  <option value="Climate & Resilience">Climate & Resilience</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Academic Study">Academic Study</option>
                  <option value="Innovation Pilot">Innovation Pilot</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Visibility</label>
                <select
                  value={newProjectForm.visibility}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, visibility: e.target.value as ProjectVisibility })}
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="Private">Private</option>
                  <option value="Project Members">Project Members</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#3b82f6]/15">
              <Button variant="outline" size="xs" onClick={() => setNewProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* Add Evidence Modal */}
      {evidenceModalOpen && (
        <ModalDialog
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          title="Attach Shared Research Evidence"
        >
          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Evidence Title</label>
              <input
                type="text"
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                placeholder="e.g. Tenure Insecurity and Agricultural Credit Accessibility"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Author / Source</label>
                <input
                  type="text"
                  value={evidenceForm.authorOrOrg}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, authorOrOrg: e.target.value })}
                  placeholder="e.g. NITI Aayog & NCAER"
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Publication Year</label>
                <input
                  type="number"
                  value={evidenceForm.year}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, year: parseInt(e.target.value, 10) })}
                  className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">Contextual Notes</label>
              <textarea
                value={evidenceForm.notes}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, notes: e.target.value })}
                rows={2}
                placeholder="Why is this evidence relevant to project collaborators?"
                className="w-full bg-[#030712]/90 border border-[#3b82f6]/25 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#3b82f6]/15">
              <Button variant="outline" size="xs" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleAddEvidence}>
                Attach Evidence
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </div>
  );
}

