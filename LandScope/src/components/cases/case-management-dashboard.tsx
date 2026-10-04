"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Scale,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { LandCase, CaseStatus, SeverityLevel } from "@/lib/land-governance/types";
import { DEMO_CASES, DEMO_PARCELS, DEMO_STATS } from "@/lib/land-governance/demo-data";
import { useRouter } from "next/navigation";

export function CaseManagementDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState<LandCase[]>(DEMO_CASES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [selectedCase, setSelectedCase] = useState<LandCase>(DEMO_CASES[0]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Case form state
  const [newCaseParcelId, setNewCaseParcelId] = useState(DEMO_PARCELS[0].id);
  const [newCasePriority, setNewCasePriority] = useState<SeverityLevel>("HIGH");
  const [newCaseDesc, setNewCaseDesc] = useState("");

  const filteredCases = cases.filter((c) => {
    const matchQuery =
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || c.priority === priorityFilter;

    return matchQuery && matchStatus && matchPriority;
  });

  const handleUpdateStatus = async (newStatus: CaseStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: selectedCase.caseId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCases((prev) =>
          prev.map((item) => (item.caseId === selectedCase.caseId ? data.case : item))
        );
        setSelectedCase(data.case);
      }
    } catch {
      // Local state fallback
      const updated = { ...selectedCase, status: newStatus, updatedAt: new Date().toISOString() };
      setCases((prev) =>
        prev.map((item) => (item.caseId === selectedCase.caseId ? updated : item))
      );
      setSelectedCase(updated);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: newCaseParcelId,
          priority: newCasePriority,
          description: newCaseDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCases((prev) => [data.case, ...prev]);
        setSelectedCase(data.case);
        setShowCreateModal(false);
        setNewCaseDesc("");
      }
    } catch {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1829]/90 via-[#10243e]/80 to-[#071322]/90 border border-blue-500/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Sovereign Cadastral Enforcement & Case Lifecycle Management</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Land Governance Case Management
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified operational command uniting satellite sentinel alerts, statutory conflicts, Bhu-Mitra ground observations, and cryptographic evidence dossiers into actionable legal workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-950/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate New Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Unified Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-4 space-y-1 backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">Total Monitored Parcels</span>
          <div className="text-2xl font-bold font-mono text-white">
            {DEMO_STATS.totalMonitoredParcels.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Sat-Covered</span>
        </div>

        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-4 space-y-1 backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">High Risk Parcels</span>
          <div className="text-2xl font-bold font-mono text-rose-400">{DEMO_STATS.highRiskParcels}</div>
          <span className="text-[10px] text-rose-400/80 font-mono">Encroachment / Conversion</span>
        </div>

        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-4 space-y-1 backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">Field Verifications</span>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {DEMO_STATS.pendingFieldVerification}
          </div>
          <span className="text-[10px] text-purple-400/80 font-mono">Dispatched to Patwaris</span>
        </div>

        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-4 space-y-1 backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">Active Enforcement Cases</span>
          <div className="text-2xl font-bold font-mono text-sky-400">{cases.length}</div>
          <span className="text-[10px] text-sky-400/80 font-mono">Multi-Agency Action</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cases by Case ID, ULPIN, Survey Number, Officer, or District..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081220]/90 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#081220]/90 border border-slate-800 text-xs text-slate-300 outline-none focus:border-blue-500/50"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="FIELD_VERIFICATION">FIELD VERIFICATION</option>
          <option value="LEGAL_REVIEW">LEGAL REVIEW</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#081220]/90 border border-slate-800 text-xs text-slate-300 outline-none focus:border-blue-500/50"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </select>
      </div>

      {/* 4. Split View: Case List & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case List (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#081220]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="text-sm font-semibold text-white">Active Case Dossiers ({filteredCases.length})</h3>
            <span className="text-[11px] font-mono text-slate-400">Live Queue</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredCases.map((c) => (
              <button
                key={c.caseId}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-2 ${
                  selectedCase.caseId === c.caseId
                    ? "bg-blue-500/20 border-blue-500/60 shadow-lg shadow-blue-950/30"
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        c.priority === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {c.priority}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{c.caseId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                    {c.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-1">{c.description}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Survey {c.surveyNumber} • {c.location.district}</span>
                  </span>
                  <span>Risk Score: {c.riskScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Case Inspector (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#081220]/85 border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400 font-bold">{selectedCase.caseId}</span>
                <span className="text-xs font-mono text-slate-400">• ULPIN {selectedCase.ulpin}</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Survey No. {selectedCase.surveyNumber} — {selectedCase.location.village}, {selectedCase.location.district}
              </h2>
            </div>

            {/* Status Transition Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Status:</span>
              <select
                disabled={updatingStatus}
                value={selectedCase.status}
                onChange={(e) => handleUpdateStatus(e.target.value as CaseStatus)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
              >
                <option value="NEW">NEW</option>
                <option value="FIELD_VERIFICATION">FIELD VERIFICATION</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="LEGAL_REVIEW">LEGAL REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED</option>
              </select>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="p-4 rounded-xl bg-[#040812] border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Case Narrative & Ground Allegations
            </span>
            <p className="text-slate-200 leading-relaxed">{selectedCase.description}</p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-sky-400" />
                <span>Assigned: {selectedCase.assignedOfficer}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Opened: {new Date(selectedCase.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons to Other Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => router.push(`/app/sentinel?ulpin=${selectedCase.ulpin}`)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-left transition-all space-y-1 hover:border-emerald-500/50 group"
            >
              <div className="flex items-center justify-between text-emerald-400">
                <ShieldAlert className="w-4 h-4" />
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-white block">Sentinel Audit</span>
              <p className="text-[10px] text-slate-400">Inspect NDVI / NDBI satellite shifts</p>
            </button>

            <button
              onClick={() => router.push(`/app/bhu-mitra?caseId=${selectedCase.caseId}`)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-left transition-all space-y-1 hover:border-purple-500/50 group"
            >
              <div className="flex items-center justify-between text-purple-400">
                <Smartphone className="w-4 h-4" />
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-white block">Bhu-Mitra PWA</span>
              <p className="text-[10px] text-slate-400">Dispatch ground Patwari inspection</p>
            </button>

            <button
              onClick={() => router.push(`/app/evidence-dossier?caseId=${selectedCase.caseId}`)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-left transition-all space-y-1 hover:border-sky-500/50 group"
            >
              <div className="flex items-center justify-between text-sky-400">
                <FileCheck2 className="w-4 h-4" />
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-white block">Evidence Dossier</span>
              <p className="text-[10px] text-slate-400">Generate SHA-256 sealed packet</p>
            </button>
          </div>

          {/* Attached Corroborating Evidence */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Attached Evidence Records ({selectedCase.evidenceDocuments.length + selectedCase.fieldObservations.length})
            </h4>

            <div className="space-y-2">
              {selectedCase.fieldObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-3 rounded-xl bg-[#040812] border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-400">Ground Observation</span>
                      <span className="text-slate-400 font-mono text-[10px]">{obs.observerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{obs.observations}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">GPS VERIFIED</span>
                </div>
              ))}

              {selectedCase.evidenceDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-[#040812] border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-sky-400">{doc.fileName}</span>
                    <p className="text-[10px] font-mono text-slate-500 truncate max-w-sm">
                      SHA-256: {doc.sha256Hash}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{doc.source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0a1220] border border-blue-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">Initiate New Enforcement Case</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Select Target Parcel</label>
                <select
                  value={newCaseParcelId}
                  onChange={(e) => setNewCaseParcelId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                >
                  {DEMO_PARCELS.map((p) => (
                    <option key={p.id} value={p.id}>
                      Survey {p.surveyNumber} — {p.village} ({p.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Enforcement Priority</label>
                <select
                  value={newCasePriority}
                  onChange={(e) => setNewCasePriority(e.target.value as SeverityLevel)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                >
                  <option value="CRITICAL">CRITICAL (Wetland / Forest / Immediate Encroachment)</option>
                  <option value="HIGH">HIGH (Unauthorized Commercial Conversion)</option>
                  <option value="MEDIUM">MEDIUM (Boundary Wall Misalignment)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Case Allegation & Ground Summary</label>
                <textarea
                  required
                  rows={3}
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  placeholder="Detail the discrepancy detected and recommended enforcement action..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
