"use client";

import React from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { SimulationEvidenceTrail } from "@/lib/policy/policy-twin-data";
import {
  FileText,
  Database,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calculator,
  Compass,
} from "lucide-react";

interface PolicyWhyModalProps {
  trail: SimulationEvidenceTrail | null;
  isOpen: boolean;
  onClose: () => void;
  onViewResearch?: (refNum: string) => void;
}

export function PolicyWhyModal({
  trail,
  isOpen,
  onClose,
  onViewResearch,
}: PolicyWhyModalProps) {
  if (!trail) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={trail.title}
      subtitle={`Policy Digital Twin Explainability • ${trail.question}`}
      badge={
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b1c38] text-[#3b82f6] border border-[#3b82f6]/40 font-bold">
          {trail.status}
        </span>
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-[11px] text-[#8ea79e] italic font-mono">
            LANDScope Evidence-to-Decision Trace (SIH26019)
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs" onClick={onClose}>
              Close
            </Button>
            {onViewResearch && (
              <Button
                variant="primary"
                size="xs"
                onClick={() => {
                  onClose();
                  onViewResearch(trail.evidenceSource.reference);
                }}
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              >
                View Supporting Research
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs text-[#d1e0da]">
        {/* Core Question & Answer Banner */}
        <div className="p-3.5 bg-[#0b1c38]/50 border border-[#3b82f6]/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#3b82f6]/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-[10px] font-mono font-bold text-[#3b82f6] uppercase tracking-wider block mb-1">
            Simulated Hypothesis & Question
          </span>
          <p className="text-[#f8fafc] font-bold text-sm leading-snug">
            {trail.question}
          </p>
        </div>

        {/* Structured 6-Step Evidence Trace */}
        <div className="space-y-2.5">
          {/* 1. Evidence Source */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/40 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#f8fafc] font-bold text-xs">
              <span className="p-1 bg-[#0b1c38] rounded text-[#3b82f6] border border-[#3b82f6]/20">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <span className="text-[#e2ece8]">1. Supporting Empirical Study</span>
            </div>
            <p className="text-[#f8fafc] font-medium pl-6">{trail.evidenceSource.title}</p>
            <div className="text-[11px] text-[#8ea79e] pl-6 flex items-center gap-2">
              <span>{trail.evidenceSource.author} ({trail.evidenceSource.year})</span>
              <span>•</span>
              <span className="font-mono text-[#38bdf8]">Ref: {trail.evidenceSource.reference}</span>
            </div>
            <p className="text-[11px] text-[#9bb3aa] italic pl-6 pt-0.5 border-l-2 border-[#3b82f6]/30 ml-6">
              &ldquo;{trail.evidenceSource.quote}&rdquo;
            </p>
          </div>

          {/* 2. Spatial Data & Historical Trend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[#f8fafc] font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>2. Spatial Layer Linkage</span>
              </div>
              <p className="text-[#a4bcaf] text-[11px] leading-snug">{trail.spatialLayer}</p>
            </div>

            <div className="p-3 bg-[#060e1a]/80 border border-[#19386c]/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[#f8fafc] font-bold text-xs">
                <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>3. Historical Trend (2018–2026)</span>
              </div>
              <p className="text-[#a4bcaf] text-[11px] leading-snug">{trail.historicalTrend}</p>
            </div>
          </div>

          {/* 3. Scenario Parameter & Calculation Details */}
          <div className="p-3.5 bg-[#060e1a]/80 border border-[#19386c]/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#f8fafc] font-bold text-xs">
              <span className="p-1 bg-[#0b1c38] rounded text-[#f59e0b] border border-[#f59e0b]/30">
                <Calculator className="w-3.5 h-3.5" />
              </span>
              <span className="text-[#e2ece8]">4. Scenario Parameter & Mathematical Model</span>
            </div>
            <div className="pl-6 space-y-1.5">
              <p className="text-[#d1e0da] font-medium">
                <strong className="text-[#f8fafc]">Parameter:</strong> {trail.scenarioParameter}
              </p>
              <div className="p-2.5 bg-[#030712] rounded-lg border border-[#19386c]/40 font-mono text-[11px] text-[#3b82f6]">
                {trail.calculationDetails}
              </div>
            </div>
          </div>

          {/* 4. Limitations */}
          <div className="p-3 bg-[#060e1a]/60 border border-[#19386c]/30 rounded-xl text-[11px] text-[#9bb3aa] space-y-1">
            <strong className="text-[#f59e0b] block uppercase text-[10px] tracking-widest font-mono">
              Model Assumptions & Limitations
            </strong>
            <p>{trail.limitations}</p>
          </div>
        </div>

        {/* Prototype notice */}
        <div className="p-3 bg-[#e8b85c]/10 border border-[#e8b85c]/30 rounded-xl text-[11px] text-[#e8b85c] flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#e8b85c] shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-[#f8fafc]">Illustrative Model Output:</strong> This calculation is an illustrative scenario simulation designed for Smart India Hackathon prototype evaluation. It does not represent an official Government of India projection.
          </span>
        </div>
      </div>
    </ModalDialog>
  );
}
