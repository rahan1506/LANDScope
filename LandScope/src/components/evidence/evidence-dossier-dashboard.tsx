"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  QrCode,
  ShieldCheck,
  Copy,
  Download,
  ExternalLink,
  Layers,
  History,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Compass,
} from "lucide-react";
import { DEMO_CASES, generateEvidenceDossier, DEMO_PARCELS } from "@/lib/land-governance/demo-data";
import { EvidenceDossier, LandCase } from "@/lib/land-governance/types";
import { useRouter } from "next/navigation";

export function EvidenceDossierDashboard() {
  const router = useRouter();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DEMO_CASES[0].caseId);
  const [dossier, setDossier] = useState<EvidenceDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    generateEvidenceDossier(selectedCaseId).then((res) => {
      if (isMounted) {
        setDossier(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCaseId]);

  const handleCopyHash = () => {
    if (dossier?.integrityHash) {
      navigator.clipboard.writeText(dossier.integrityHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061727]/90 via-[#0a233a]/80 to-[#04101e]/90 border border-sky-500/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-medium">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Court-Admissible Multi-Spectral Land Evidence Dossier</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Evidence Dossier Generator
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Cryptographically anchors multi-temporal satellite telemetry, state revenue RTC records, and Bhu-Mitra ground verification photos into an immutable SHA-256 evidence package with instant QR verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow-md"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Export Judicial PDF</span>
            </button>
            <button
              onClick={() => router.push(`/verify/evidence/${selectedCaseId}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-sky-950/40 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Public Verification Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Case Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-2">
          Select Active Case:
        </span>
        {DEMO_CASES.map((c) => (
          <button
            key={c.caseId}
            onClick={() => setSelectedCaseId(c.caseId)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border shrink-0 flex items-center gap-2 ${
              selectedCaseId === c.caseId
                ? "bg-sky-500/20 border-sky-500/60 text-sky-300 font-semibold shadow-md shadow-sky-950/30"
                : "bg-[#081322]/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                c.priority === "CRITICAL" ? "bg-rose-500" : "bg-amber-500"
              }`}
            />
            <span>{c.caseId}</span>
            <span className="text-slate-500">({c.surveyNumber})</span>
          </button>
        ))}
      </div>

      {loading || !dossier ? (
        <div className="p-12 text-center text-slate-400 text-sm font-mono animate-pulse">
          Computing cryptographic SHA-256 seal and compiling multi-spectral evidence...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dossier Summary, QR Code & Integrity Seal (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Cryptographic Seal Card */}
            <div className="rounded-2xl bg-[#081322]/85 border border-sky-500/30 p-5 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Cryptographic Dossier Seal</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  SEALED & VALID
                </span>
              </div>

              {/* QR Code Presentation */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-slate-800 space-y-3">
                <div
                  className="w-40 h-40 p-2 bg-white rounded-xl shadow-2xl flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: dossier.qrCodeData }}
                />
                <span className="text-[10px] font-mono text-slate-400 text-center">
                  Scan with any mobile device to verify digital seal against sovereign blockchain ledger
                </span>
              </div>

              {/* SHA-256 Fingerprint */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Dossier SHA-256 Hash</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedHash ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#040912] border border-slate-800 text-[11px] font-mono text-emerald-300 break-all leading-tight select-all">
                  {dossier.integrityHash}
                </div>
              </div>

              {/* Metadata attributes */}
              <div className="space-y-2 text-xs divide-y divide-slate-800/60 pt-1">
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Generated By</span>
                  <span className="text-slate-200 font-mono text-[11px]">{dossier.generatedBy}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Timestamp</span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    {new Date(dossier.generatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Associated ULPIN</span>
                  <span className="text-sky-400 font-mono text-[11px]">{dossier.parcelIdentity.ulpin}</span>
                </div>
              </div>
            </div>

            {/* Documents Manifest Card */}
            <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Sealed Documents ({dossier.documents.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {dossier.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200 truncate">{doc.fileName}</span>
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">SHA-256 OK</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      Hash: {doc.sha256Hash.slice(0, 24)}...
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                      <span>{doc.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 4-Pillar Evidence & Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 4-Pillar Evidence Grid */}
            <div className="rounded-2xl bg-[#081322]/85 border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div className="border-b border-slate-800/60 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">4-Pillar Cadastral Evidence Matrix</h3>
                  <p className="text-xs text-slate-400">
                    Integrated statutory corpus compiled under Indian Evidence Act §65B certification standards
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
                  Case ID: {dossier.caseId}
                </span>
              </div>

              {/* Pillar 1: Geospatial & Temporal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Pillar 1: Multi-Temporal Geospatial Evidence</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">Primary Sensor</span>
                    <p className="text-xs font-bold text-white">Copernicus Sentinel-2 MSI</p>
                    <span className="text-[10px] text-slate-400">10m spatial resolution</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">Δ NDVI Vegetation</span>
                    <p className="text-xs font-bold text-rose-400">{dossier.geospatialEvidence.ndviChange}</p>
                    <span className="text-[10px] text-slate-400">54.5% canopy loss</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">Δ NDBI Built-Up</span>
                    <p className="text-xs font-bold text-amber-400">+{dossier.geospatialEvidence.ndbiChange}</p>
                    <span className="text-[10px] text-slate-400">Structural growth spike</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Cadastral Alignment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Pillar 2: Cadastral Boundary & Land Records</span>
                </div>
                <div className="p-4 rounded-xl bg-[#050b14] border border-slate-800 space-y-2 text-xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Survey No</span>
                      <span>{dossier.parcelIdentity.surveyNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Village</span>
                      <span>{dossier.parcelIdentity.village}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Taluk / District</span>
                      <span>{dossier.parcelIdentity.taluk}, {dossier.parcelIdentity.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Coordinates</span>
                      <span>{dossier.parcelIdentity.coordinates.lat.toFixed(4)}°N, {dossier.parcelIdentity.coordinates.lng.toFixed(4)}°E</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Statutory Legislation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Pillar 3: Statutory Breaches & Legal Precedents</span>
                </div>
                <div className="space-y-2">
                  {dossier.legalEvidence.applicableActs.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{act.name}</span>
                        <p className="text-[11px] text-slate-400">{dossier.legalEvidence.relevantExcerpts[0]}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300 shrink-0">
                        {act.shortName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 4: Chronological Audit Trail */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
                  <History className="w-4 h-4" />
                  <span>Pillar 4: Chronological Evidence Trail</span>
                </div>
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                  {dossier.timeline.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-sky-400" />
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.title}</span>
                          <span className="text-[10px] font-mono text-sky-400">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                        {item.actor && (
                          <span className="text-[10px] font-mono text-slate-500 block pt-0.5">
                            Recorded by: {item.actor}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
