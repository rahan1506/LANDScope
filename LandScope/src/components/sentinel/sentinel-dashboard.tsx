"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  Layers,
  Calendar,
  Building2,
  TreeDeciduous,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ULPINRecord, MutationRecord, ChangeDetection, DiscrepancyScore, RiskAlert } from "@/lib/land-governance/types";
import {
  DEMO_PARCELS,
  DEMO_MUTATIONS,
  DEMO_CHANGES,
  getDiscrepancyForParcel,
  DEMO_RISK_ALERTS,
} from "@/lib/land-governance/demo-data";
import { useRouter } from "next/navigation";

export function SentinelDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParcel, setSelectedParcel] = useState<ULPINRecord>(DEMO_PARCELS[0]);
  const [satelliteViewMode, setSatelliteViewMode] = useState<"current" | "baseline" | "difference">("current");
  const [alerts, setAlerts] = useState<RiskAlert[]>(DEMO_RISK_ALERTS);
  const [alertFilter, setAlertFilter] = useState<string>("ALL");
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  // Filter parcels based on search query
  const filteredParcels = DEMO_PARCELS.filter(
    (p) =>
      p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parcelMutations: MutationRecord[] = DEMO_MUTATIONS.filter((m) => m.parcelId === selectedParcel.id);
  const parcelChanges: ChangeDetection[] = DEMO_CHANGES.filter((c) => c.parcelId === selectedParcel.id);
  const discrepancy: DiscrepancyScore = getDiscrepancyForParcel(selectedParcel.id);
  const parcelAlerts = alerts.filter((a) => a.parcelId === selectedParcel.id);

  const handleAcknowledge = async (alertId: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [alertId]: true }));
    try {
      await fetch("/api/sentinel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge_alert", alertId }),
      });
    } catch {
      // Demo fallback already set in state
    }
  };

  const handleCreateCaseFromAlert = (parcel: ULPINRecord) => {
    router.push(`/app/cases?create=true&parcelId=${parcel.id}&survey=${encodeURIComponent(parcel.surveyNumber)}`);
  };

  const visibleAlerts = alerts.filter((a) => {
    if (alertFilter === "ALL") return true;
    return a.severity === alertFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b192c]/90 via-[#0e2744]/80 to-[#071322]/90 border border-emerald-500/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Sovereign Earth Observation Sentinel & Temporal Audit Engine</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Mutation & Encroachment Sentinel
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automated cadastral discrepancy detection reconciling Copernicus Sentinel-2 multispectral telemetry against state revenue registries (Bhoomi, Mahabhulekh, Dharani).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/app/evidence-dossier")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700/60 text-xs font-medium transition-all shadow-md hover:border-slate-600"
            >
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span>Evidence Dossiers</span>
            </button>
            <button
              onClick={() => handleCreateCaseFromAlert(selectedParcel)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Enforcement Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Parcel Search & Selector Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ULPIN (e.g. KA-BLR-DEV-2024-00189), Survey No (142/3A), or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091524]/90 border border-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filteredParcels.map((parcel) => (
              <button
                key={parcel.id}
                onClick={() => setSelectedParcel(parcel)}
                className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                  selectedParcel.id === parcel.id
                    ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold shadow-md shadow-emerald-950/40"
                    : "bg-[#091524]/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {parcel.surveyNumber} ({parcel.district.split(" ")[0]})
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center justify-end gap-2 text-xs font-mono text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Cadastral Polling: 14,280 Parcels</span>
        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spatial Imagery & Temporal Change (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Spatial Sentinel Viewport Card */}
          <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">ULPIN Demarcation</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {selectedParcel.ulpin}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Survey No. {selectedParcel.surveyNumber} — {selectedParcel.village}
                </h3>
              </div>

              {/* View mode toggle */}
              <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setSatelliteViewMode("baseline")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    satelliteViewMode === "baseline"
                      ? "bg-emerald-600 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Baseline (2023)
                </button>
                <button
                  onClick={() => setSatelliteViewMode("current")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    satelliteViewMode === "current"
                      ? "bg-emerald-600 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Current (2024)
                </button>
                <button
                  onClick={() => setSatelliteViewMode("difference")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    satelliteViewMode === "difference"
                      ? "bg-rose-600 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Difference Mask
                </button>
              </div>
            </div>

            {/* Simulated Satellite Map Canvas Display */}
            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-slate-800 bg-[#040810] flex items-center justify-center group">
              {/* Map background grid & imagery simulation */}
              <div
                className={`absolute inset-0 transition-all duration-700 ${
                  satelliteViewMode === "baseline"
                    ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#11301c] via-[#091f14] to-[#040d08]"
                    : satelliteViewMode === "current"
                    ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1c12] via-[#1a120d] to-[#08080c]"
                    : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#450a0a] via-[#1c0505] to-[#070202]"
                }`}
              />

              {/* Overlay Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Cadastral Polygon Simulation */}
              <div className="relative z-10 p-6 rounded-xl border-2 border-dashed border-emerald-400/70 bg-emerald-950/20 backdrop-blur-sm max-w-sm text-center space-y-2.5 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-emerald-500/20 pb-2">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> {selectedParcel.coordinates.lat.toFixed(4)}°N, {selectedParcel.coordinates.lng.toFixed(4)}°E
                  </span>
                  <span>{selectedParcel.registeredAreaHa} Ha</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-mono">
                    Mode:{" "}
                    <span className="text-white font-bold uppercase">
                      {satelliteViewMode === "baseline" && "Sentinel-2 L2A (10m) — Pure Agricultural Baseline"}
                      {satelliteViewMode === "current" && "Sentinel-2 MSI (10m) — Active Construction Signature"}
                      {satelliteViewMode === "difference" && "Δ NDBI Anomaly Heatmap (+0.60 Deviation)"}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Cadastral Boundary Polygon anchored with PostGIS RTK-GPS survey coordinates.
                  </p>
                </div>

                {satelliteViewMode === "difference" && (
                  <div className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-medium animate-pulse">
                    Encroachment / Built-up Footprint: ~1.28 Ha (+52.2%)
                  </div>
                )}
              </div>

              {/* Live telemetry badges */}
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className="px-2 py-1 rounded bg-black/70 border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                  Copernicus Sentinel-2
                </span>
                <span className="px-2 py-1 rounded bg-black/70 border border-slate-700 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                  Cloud Cover: 0.4%
                </span>
              </div>

              <div className="absolute bottom-3 right-3 z-20">
                <button
                  onClick={() => router.push("/app/land-intelligence")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md"
                >
                  <span>Open Full GIS Workstation</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Spectral Indices & Change Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="rounded-xl bg-[#091626]/70 border border-slate-800/80 p-3 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">NDVI Change</span>
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-lg font-mono">
                  <TrendingDown className="w-4 h-4" />
                  <span>{parcelChanges[0]?.ndviChange ? `${parcelChanges[0].ndviChange.toFixed(2)}` : "-0.37"}</span>
                </div>
                <span className="text-[10px] text-slate-400">Vegetation decline</span>
              </div>

              <div className="rounded-xl bg-[#091626]/70 border border-slate-800/80 p-3 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">NDBI Change</span>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg font-mono">
                  <TrendingUp className="w-4 h-4" />
                  <span>{parcelChanges[0]?.ndbiChange ? `+${parcelChanges[0].ndbiChange.toFixed(2)}` : "+0.60"}</span>
                </div>
                <span className="text-[10px] text-slate-400">Built-up index spike</span>
              </div>

              <div className="rounded-xl bg-[#091626]/70 border border-slate-800/80 p-3 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Boundary Drift</span>
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-lg font-mono">
                  <Compass className="w-4 h-4" />
                  <span>{parcelChanges[0]?.boundaryDriftMeters ? `${parcelChanges[0].boundaryDriftMeters}m` : "4.2m"}</span>
                </div>
                <span className="text-[10px] text-slate-400">Cadastre displacement</span>
              </div>

              <div className="rounded-xl bg-[#091626]/70 border border-slate-800/80 p-3 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Confidence</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{parcelChanges[0]?.confidence ? `${(parcelChanges[0].confidence * 100).toFixed(0)}%` : "94%"}</span>
                </div>
                <span className="text-[10px] text-slate-400">AI spectral validation</span>
              </div>
            </div>
          </div>

          {/* Mutation Records Comparison Card */}
          <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Revenue Registry Mutation Repertoire</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Source: {parcelMutations[0]?.source || "State Land Registry"}
              </span>
            </div>

            {parcelMutations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#050b14] text-slate-400 font-mono">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Mutation ID</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Old Area → New Area</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 rounded-r-lg">Discrepancy Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {parcelMutations.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-mono text-emerald-400 font-medium">{m.mutationId}</td>
                        <td className="p-2.5 text-slate-300 font-mono">{m.mutationDate}</td>
                        <td className="p-2.5 text-slate-200">{m.mutationType}</td>
                        <td className="p-2.5 font-mono text-slate-300">
                          {m.oldAreaHa} Ha → <span className="text-amber-400 font-bold">{m.newAreaHa} Ha</span>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                              m.status === "Completed"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400 max-w-xs truncate" title={m.remarks}>
                          {m.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 text-center text-slate-400 text-xs">
                No recent mutation filings on record for this parcel ID.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Explainable AI Discrepancy & Risk Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Explainable AI Discrepancy Score Card */}
          <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-semibold text-white">Discrepancy Score (XAI)</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold">
                {discrepancy.level} RISK
              </span>
            </div>

            {/* Score Ring Display */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-[#040a14] border border-slate-800/70">
              <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-rose-500 transition-all duration-1000 stroke-current"
                    strokeWidth="3.5"
                    strokeDasharray={`${discrepancy.totalScore}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold font-mono text-white leading-none">
                    {discrepancy.totalScore}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-200">Autonomous Sentinel Assessment</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {discrepancy.explanation}
                </p>
              </div>
            </div>

            {/* Discrepancy Factors Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Contributing Risk Factors
              </span>
              <div className="space-y-2.5">
                {discrepancy.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{factor.name}</span>
                      <span className="font-mono font-bold text-amber-400">
                        +{factor.score} / {factor.maxScore}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{factor.evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2">
              <button
                onClick={() => router.push(`/app/legal-harmonizer?ulpin=${selectedParcel.ulpin}`)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span>Check Conflict Matrix in Legal Harmonizer</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Risk Alerts Stream Card */}
          <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Active Risk Alerts</h3>
              </div>
              <div className="flex items-center gap-1">
                {(["ALL", "CRITICAL", "HIGH"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setAlertFilter(lvl)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      alertFilter === lvl
                        ? "bg-slate-700 text-white font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {visibleAlerts.map((alert) => {
                const isAck = acknowledgedAlerts[alert.id] || alert.isAcknowledged;
                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                      alert.severity === "CRITICAL"
                        ? "bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60"
                        : "bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              alert.severity === "CRITICAL"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{alert.ulpin}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-white">{alert.title}</h4>
                      </div>
                      {isAck ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 text-[10px] font-mono flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Ack
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono shrink-0 transition-all border border-slate-700"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{alert.description}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/40">
                      <span>{alert.location}</span>
                      <button
                        onClick={() => router.push(`/app/cases?create=true&parcelId=${alert.parcelId}`)}
                        className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                      >
                        <span>Dispatch Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
