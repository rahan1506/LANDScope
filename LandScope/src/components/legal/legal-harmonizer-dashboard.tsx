"use client";

import React, { useState } from "react";
import {
  Scale,
  Search,
  BookOpen,
  AlertOctagon,
  CheckCircle,
  FileText,
  Filter,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  DEMO_LEGAL_ACTS,
  DEMO_LEGAL_SECTIONS,
  DEMO_LEGAL_CONFLICTS,
  DEMO_POLICY_OVERLAYS,
  CONFLICT_MATRIX,
  ConflictFramework,
  ConflictMatrixCell,
  getConflictDetails,
} from "@/lib/land-governance/legal-knowledge";
import { DEMO_PARCELS } from "@/lib/land-governance/demo-data";
import { LegalAct, LegalSection, LegalConflict } from "@/lib/land-governance/types";
import { useRouter } from "next/navigation";

const FRAMEWORKS: ConflictFramework[] = ["Revenue", "Forest", "Environment", "RERA", "Local", "Acquisition"];

export function LegalHarmonizerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"matrix" | "acts" | "parcel-diagnostic">("matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCell, setSelectedCell] = useState<ConflictMatrixCell | null>(CONFLICT_MATRIX[0]);
  const [selectedConflict, setSelectedConflict] = useState<LegalConflict | null>(
    DEMO_LEGAL_CONFLICTS[0]
  );
  const [selectedAct, setSelectedAct] = useState<LegalAct>(DEMO_LEGAL_ACTS[0]);
  const [selectedUlpin, setSelectedUlpin] = useState<string>(DEMO_PARCELS[0].ulpin);

  const selectedParcel = DEMO_PARCELS.find((p) => p.ulpin === selectedUlpin) || DEMO_PARCELS[0];

  const filteredActs = DEMO_LEGAL_ACTS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSections = DEMO_LEGAL_SECTIONS.filter((s) => s.actId === selectedAct.id);

  const handleCellClick = (cell: ConflictMatrixCell) => {
    setSelectedCell(cell);
    if (cell.conflictId) {
      const conflict = getConflictDetails(cell.conflictId);
      if (conflict) setSelectedConflict(conflict);
    } else {
      setSelectedConflict(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17150a]/90 via-[#27210c]/80 to-[#120e06]/90 border border-amber-500/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
              <Scale className="w-3.5 h-3.5" />
              <span>Multi-Jurisdictional Statutory Harmonization & Conflict Resolver</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Policy & Legal Harmonizer
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Disentangling overlapping central, state, and environmental land legislations. Evaluates statutory conflicts between State Land Revenue Codes, Forest Conservation Act, RERA, and Environmental Protection Orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>6 Statutory Domains Mapped</span>
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mt-6 border-b border-amber-500/20 pb-1">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all ${
              activeTab === "matrix"
                ? "bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cross-Framework Conflict Matrix
          </button>
          <button
            onClick={() => setActiveTab("parcel-diagnostic")}
            className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all ${
              activeTab === "parcel-diagnostic"
                ? "bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cadastral Parcel Legal Diagnostic
          </button>
          <button
            onClick={() => setActiveTab("acts")}
            className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all ${
              activeTab === "acts"
                ? "bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Statutory Acts & Clauses Repertoire
          </button>
        </div>
      </div>

      {/* 2. TAB 1: CONFLICT MATRIX */}
      {activeTab === "matrix" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matrix Grid (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Cross-Framework Conflict Matrix</h3>
                <p className="text-[11px] text-slate-400">Click any matrix cell to examine the statutory conflict details</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical / High
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-700" /> Harmonious
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-slate-400">Domains</th>
                    {FRAMEWORKS.map((col) => (
                      <th key={col} className="p-2 text-slate-300 font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {FRAMEWORKS.map((row) => (
                    <tr key={row}>
                      <td className="p-2.5 text-left font-semibold text-slate-300 bg-slate-900/30">{row}</td>
                      {FRAMEWORKS.map((col) => {
                        if (row === col) {
                          return (
                            <td key={col} className="p-2.5 bg-slate-900/10 text-slate-700">
                              —
                            </td>
                          );
                        }
                        const cell = CONFLICT_MATRIX.find(
                          (c) =>
                            (c.frameworkA === row && c.frameworkB === col) ||
                            (c.frameworkA === col && c.frameworkB === row)
                        );
                        const isSelected =
                          selectedCell &&
                          ((selectedCell.frameworkA === row && selectedCell.frameworkB === col) ||
                            (selectedCell.frameworkA === col && selectedCell.frameworkB === row));

                        const severity = cell?.severity || "none";
                        const bgClass =
                          severity === "critical" || severity === "high"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                            : severity === "medium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                            : "bg-slate-900/40 text-slate-500 border border-slate-800 hover:bg-slate-800/40";

                        return (
                          <td key={col} className="p-1">
                            <button
                              onClick={() => cell && handleCellClick(cell)}
                              className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${bgClass} ${
                                isSelected ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105" : ""
                              }`}
                            >
                              {severity === "critical"
                                ? "CRIT"
                                : severity === "high"
                                ? "HIGH"
                                : severity === "medium"
                                ? "MED"
                                : "OK"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Statutory conflicts represent irreconcilable divergence between land revenue records, forest notifications, and urban conversion permissions requiring high-level departmental harmonization.
              </span>
            </div>
          </div>

          {/* Conflict Deep Dive Inspector (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Statutory Conflict Profile</h3>
              </div>
              {selectedConflict && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
                  {selectedConflict.severity} CONFLICT
                </span>
              )}
            </div>

            {selectedConflict ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{selectedConflict.frameworkA} Framework</span>
                    <span className="text-rose-400 font-bold">VS</span>
                    <span>{selectedConflict.frameworkB} Framework</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white pt-1">
                    {selectedConflict.conflictDescription}
                  </h4>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Statutory Evidence & Rule Inconsistency
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#050b14] border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                    {selectedConflict.evidence}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-mono text-[10px] block">Clearing Authority</span>
                    <span className="text-white font-medium">{selectedConflict.requiredAuthority}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-mono text-[10px] block">Affected Uses</span>
                    <span className="text-amber-400 font-medium">
                      {selectedConflict.affectedClassifications.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => router.push("/app/evidence-dossier")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
                  >
                    <span>Attach Conflict to Evidence Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-slate-200">No Statutory Conflict Detected</p>
                <p className="text-[11px]">
                  The selected frameworks operate concurrently without contradictory regulatory mandates.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB 2: PARCEL LEGAL DIAGNOSTIC */}
      {activeTab === "parcel-diagnostic" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Select Cadastral Parcel</h3>
            <div className="space-y-2">
              {DEMO_PARCELS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedUlpin(p.ulpin)}
                  className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                    selectedUlpin === p.ulpin
                      ? "bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-950/30"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{p.surveyNumber}</span>
                    <span className="text-slate-400">{p.landUseClassification}</span>
                  </div>
                  <div className="text-xs text-white font-medium">{p.village}, {p.district}</div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{p.ulpin}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">ULPIN {selectedParcel.ulpin}</span>
                <h3 className="text-lg font-bold text-white">
                  Legal Overlay Diagnostic — Survey {selectedParcel.surveyNumber}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs">
                {selectedParcel.registeredAreaHa} Ha • {selectedParcel.state}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Revenue Master Status</span>
                <p className="text-xs font-bold text-white">{selectedParcel.landUseClassification}</p>
                <span className="text-[10px] text-slate-400">Section 95 KLR Applicable</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Environmental Overlay</span>
                <p className="text-xs font-bold text-emerald-400">
                  {selectedParcel.landUseClassification === "Wetland"
                    ? "Wetlands Rules 2017 Corridor"
                    : selectedParcel.landUseClassification === "Forest"
                    ? "CRZ-I Eco-Sensitive Zone"
                    : "Standard Agro Buffer"}
                </p>
                <span className="text-[10px] text-slate-400">MoEFCC Clearance Mandate</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">RERA Development Status</span>
                <p className="text-xs font-bold text-amber-400">Section 3 Registration Required</p>
                <span className="text-[10px] text-slate-400">Prior to layout advertisement</span>
              </div>
            </div>

            {/* Statutory Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Statutory Compliance & Clearances Checklist
              </h4>
              <div className="space-y-2">
                {[
                  {
                    act: "State Land Revenue Code (§95)",
                    requirement: "Non-Agricultural (NA) diversion sanction from Deputy Commissioner / Collector",
                    status: selectedParcel.landUseClassification === "Agricultural" ? "PENDING_VIOLATION" : "COMPLIED",
                  },
                  {
                    act: "RERA Act 2016 (§3)",
                    requirement: "Registration with State Real Estate Regulatory Authority before plot marketing",
                    status: "NOT_SUBMITTED",
                  },
                  {
                    act: "Environment (Protection) Act 1986",
                    requirement: "EIA Environmental Clearance for construction footprint > 20,000 sq. meters",
                    status: "EXEMPT_BELOW_THRESHOLD",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#050b14] border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">{item.act}</span>
                      <p className="text-[11px] text-slate-300">{item.requirement}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        item.status === "PENDING_VIOLATION"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : item.status === "COMPLIED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: STATUTORY ACTS REPERTOIRE */}
      {activeTab === "acts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Acts by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredActs.map((act) => (
                <button
                  key={act.id}
                  onClick={() => setSelectedAct(act)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                    selectedAct.id === act.id
                      ? "bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-950/30"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{act.shortName}</span>
                    <span className="text-slate-400">{act.year}</span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-1">{act.name}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 uppercase">{act.jurisdiction}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 uppercase">{act.category}</span>
                    <span className="text-emerald-400">Verified Citation</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-[#0a121e]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-5">
            <div className="border-b border-slate-800/60 pb-3 space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-amber-400 uppercase">Act Gazette Details</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedAct.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Source: {selectedAct.sourceDocument} • In Force Since: {selectedAct.effectiveDate}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Key Clauses & Operative Restrictions ({filteredSections.length})
              </h4>
              <div className="space-y-3">
                {filteredSections.map((sec) => (
                  <div key={sec.id} className="p-4 rounded-xl bg-[#050b14] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 font-mono">{sec.sectionNumber}</span>
                      <span className="text-slate-400">{sec.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sec.summary}</p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                      {sec.restrictions.map((res, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-900/30">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
