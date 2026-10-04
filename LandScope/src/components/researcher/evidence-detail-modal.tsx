"use client";

import React from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EvidenceItem,
  SpatialContext,
} from "@/lib/research/research-data";
import {
  ShieldCheck,
  Download,
  FolderPlus,
  MapPin,
  FileText,
  Building,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Scale,
} from "lucide-react";

interface EvidenceDetailModalProps {
  evidence: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToProject?: (evidence: EvidenceItem) => void;
  onExploreGis?: (spatialContext?: SpatialContext) => void;
  onUseInPolicy?: (evidence: EvidenceItem) => void;
}

export function EvidenceDetailModal({
  evidence,
  isOpen,
  onClose,
  onAddToProject,
  onExploreGis,
  onUseInPolicy,
}: EvidenceDetailModalProps) {
  if (!evidence) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={evidence.title}
      subtitle={`${evidence.authorOrOrg} • Ref: ${evidence.referenceNumber} (${evidence.year})`}
      badge={
        evidence.isDemoRecord ? (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
            Illustrative Demo Record
          </span>
        ) : (
          <Badge variant="official" size="sm" dot>
            Verified National Record
          </Badge>
        )
      }
      maxWidth="2xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onAddToProject?.(evidence)}
              leftIcon={<FolderPlus className="w-3.5 h-3.5 text-blue-600" />}
            >
              Add to Project
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onExploreGis?.(evidence.spatialContext)}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Explore Spatial Evidence
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onUseInPolicy?.(evidence)}
              leftIcon={<Scale className="w-3.5 h-3.5 text-purple-600" />}
            >
              Use in Policy Scenario
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="xs"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Dossier
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Demo status alert if applicable */}
        {evidence.isDemoRecord && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-sm text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">LANDScope SIH 2026 Demonstration Environment:</strong>{" "}
              This entry is an illustrative demo record calibrated to realistic Indian cadastral and land-use metrics for hackathon prototype evaluation.
            </div>
          </div>
        )}

        {/* Executive Abstract */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
            Executive Abstract & Scope
          </span>
          <p className="leading-relaxed text-slate-800">{evidence.abstract}</p>
        </div>

        {/* Key Empirical Findings */}
        {evidence.keyFindings && evidence.keyFindings.length > 0 && (
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1.5">
            <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
              Key Empirical Findings
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              {evidence.keyFindings.map((finding, idx) => (
                <li key={idx} className="leading-snug">{finding}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
              Empirical Methodology
            </span>
            <p className="font-medium text-slate-800">{evidence.methodology}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
              Sample Cohort / Scope
            </span>
            <p className="font-medium text-slate-800">{evidence.sampleSize}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
              Geographic Scope
            </span>
            <p className="font-medium text-slate-800">
              {evidence.geography.state}
              {evidence.geography.district ? ` • District: ${evidence.geography.district}` : ""}
              {evidence.geography.region ? ` (${evidence.geography.region})` : ""}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
              Evidence Status & Domain
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{evidence.evidenceStatus}</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-800 font-medium">{evidence.researchDomain}</span>
            </div>
          </div>
        </div>

        {/* Confidence rating strip */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-950 block text-xs">
              Empirical Confidence Index: {evidence.confidenceScore} / 100
            </span>
            <span className="text-[11px] text-emerald-800">
              Audited against verified spatial layers and national survey standards.
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        </div>

        {/* Topics tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Classification Tags:</span>
          {evidence.topics.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </ModalDialog>
  );
}
