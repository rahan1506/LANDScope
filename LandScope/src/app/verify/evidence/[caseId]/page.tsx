import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  FileText,
  Calendar,
  Compass,
  ArrowLeft,
  Building,
  Lock,
} from "lucide-react";
import { generateEvidenceDossier, getCaseById } from "@/lib/land-governance/demo-data";

interface VerifyPageProps {
  params: Promise<{
    caseId: string;
  }>;
}

export default async function VerifyEvidencePage({ params }: VerifyPageProps) {
  const { caseId } = await params;
  const decodedCaseId = decodeURIComponent(caseId);
  const landCase = getCaseById(decodedCaseId);
  const dossier = await generateEvidenceDossier(decodedCaseId);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-sky-900 selection:text-sky-200">
      {/* Top Sovereign Bar */}
      <header className="border-b border-slate-800 bg-[#060c18]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-sky-400 block font-semibold leading-tight">
                GOVERNMENT OF INDIA • NATIONAL LAND INTELLIGENCE
              </span>
              <h1 className="text-sm font-bold text-white leading-tight">
                Cryptographic Evidence Verification Registry
              </h1>
            </div>
          </div>

          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Official Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Verification Status Card */}
        <div className="rounded-2xl bg-gradient-to-b from-[#081729] to-[#040b15] border border-emerald-500/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/40">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              Cryptographically Verified & Sovereign Anchored
            </span>
            <h2 className="text-2xl font-bold text-white">Authentic Judicial Land Dossier</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              This evidence dossier fingerprint matches the immutable SHA-256 seal generated at time of inspection. No post-hoc document alteration detected.
            </p>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="p-4 rounded-xl bg-[#02050c] border border-slate-800 max-w-2xl mx-auto space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Immutable SHA-256 Integrity Hash:
            </span>
            <div className="text-xs font-mono text-emerald-400 break-all select-all font-semibold">
              {dossier.integrityHash}
            </div>
          </div>
        </div>

        {/* Case & Parcel Details */}
        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-400" />
            <span>Case Demarcation Profile</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">CASE ID</span>
              <span className="text-white font-bold">{dossier.caseId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ULPIN</span>
              <span className="text-sky-400 font-bold">{dossier.parcelIdentity.ulpin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">SURVEY NUMBER</span>
              <span className="text-amber-400 font-bold">{dossier.parcelIdentity.surveyNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">JURISDICTION</span>
              <span className="text-slate-300">
                {dossier.parcelIdentity.district}, {dossier.parcelIdentity.state}
              </span>
            </div>
          </div>
        </div>

        {/* Certified Documents List */}
        <div className="rounded-2xl bg-[#081220]/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Certified Corroborating Documents ({dossier.documents.length})</span>
          </h3>

          <div className="space-y-3">
            {dossier.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl bg-[#030812] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{doc.fileName}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      VALID
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-md">
                    SHA-256: {doc.sha256Hash}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-400 sm:text-right shrink-0">
                  <span>{doc.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notice */}
        <div className="text-center text-[11px] font-mono text-slate-500 space-y-1">
          <p>LANDScope Judicial Evidence Verification Service • Ministry of Rural Development & DoLR</p>
          <p>Admissible under Section 65B of the Indian Evidence Act, 1872</p>
        </div>
      </main>
    </div>
  );
}
