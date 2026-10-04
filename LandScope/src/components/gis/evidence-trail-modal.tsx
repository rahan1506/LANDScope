"use client";

import React from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { EvidenceTrail } from "@/lib/gis/gis-data";
import {
  FileText,
  Database,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MapPin,
  HelpCircle,
} from "lucide-react";

interface EvidenceTrailModalProps {
  trail: EvidenceTrail | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResearch?: (referenceNumber: string) => void;
}

export function EvidenceTrailModal({
  trail,
  isOpen,
  onClose,
  onOpenResearch,
}: EvidenceTrailModalProps) {
  if (!trail) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={trail.flagTitle}
      subtitle={`Spatial Intelligence Evidence Trail • ${trail.geography}`}
      badge={
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
          {trail.status}
        </span>
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-[11px] text-slate-500 italic">
            LANDScope Explainable Spatial Intelligence (SIH26019)
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs" onClick={onClose}>
              Close
            </Button>
            {onOpenResearch && (
              <Button
                variant="primary"
                size="xs"
                onClick={() => {
                  onClose();
                  onOpenResearch(trail.referenceNumber);
                }}
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              >
                Inspect Empirical Study
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs text-slate-700">
        {/* Core Key Metric Banner */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-sm">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
            Empirical Finding & Alert Trigger
          </span>
          <p className="text-slate-900 font-semibold leading-relaxed">
            {trail.keyMetric}
          </p>
        </div>

        {/* Structured Evidence Trail Steps */}
        <div className="space-y-2.5">
          {/* 1. Research Source */}
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <span className="p-1 bg-slate-100 rounded text-[#112A4A]">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <span>1. Research & Empirical Source</span>
            </div>
            <p className="text-slate-800 font-medium pl-6">{trail.researchTitle}</p>
            <div className="text-[11px] text-slate-500 pl-6 flex items-center gap-2">
              <span>{trail.authorOrAgency}</span>
              <span>•</span>
              <span className="font-mono text-slate-600">Ref: {trail.referenceNumber}</span>
            </div>
          </div>

          {/* 2. Dataset */}
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <span className="p-1 bg-slate-100 rounded text-emerald-700">
                <Database className="w-3.5 h-3.5" />
              </span>
              <span>2. Underlying Geospatial Dataset</span>
            </div>
            <p className="text-slate-800 font-medium pl-6">{trail.datasetName}</p>
          </div>

          {/* 3. Spatial Layer */}
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <span className="p-1 bg-slate-100 rounded text-purple-700">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <span>3. Active Spatial GIS Layer</span>
            </div>
            <p className="text-slate-800 font-medium pl-6">{trail.spatialLayer}</p>
          </div>

          {/* 4. Analysis Method & Model Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Analysis Method
              </span>
              <p className="text-slate-800 leading-snug">{trail.analysisMethod}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Model Assumptions & Calibration
              </span>
              <p className="text-slate-800 leading-snug">{trail.modelAssumptions}</p>
            </div>
          </div>
        </div>

        {/* Prototype notice */}
        <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-sm text-[11px] text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Illustrative Model Output:</strong> This evidence trail links the analytical flag to simulated research regressions calibrated to authentic Indian cadastral indices for hackathon evaluation.
          </span>
        </div>
      </div>
    </ModalDialog>
  );
}
