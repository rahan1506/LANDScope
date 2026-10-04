import React from "react";
import { FileText, ExternalLink, ShieldCheck, Database, Award, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface EvidenceCardProps {
  title: string;
  agency: string;
  year: number | string;
  referenceNumber: string;
  abstract: string;
  confidenceScore: number; // 0 - 100
  methodology: string;
  peerReviewStatus: "Peer Reviewed" | "Government Audit" | "Empirical Fieldwork" | "Satellite Verified";
  sampleSize?: string;
  tags?: string[];
  downloadUrl?: string;
  className?: string;
  onViewDetails?: () => void;
}

export function EvidenceCard({
  title,
  agency,
  year,
  referenceNumber,
  abstract,
  confidenceScore,
  methodology,
  peerReviewStatus,
  sampleSize,
  tags,
  downloadUrl,
  className,
  onViewDetails,
}: EvidenceCardProps) {
  const getConfidenceBadge = (score: number) => {
    if (score >= 90)
      return {
        label: "High Confidence (90%+)",
        color: "text-[#93c5fd] bg-[#3b82f6]/15 border-[#3b82f6]/30",
      };
    if (score >= 75)
      return {
        label: "Standard (75-89%)",
        color: "text-[#7dd3fc] bg-[#38bdf8]/15 border-[#38bdf8]/30",
      };
    return {
      label: "Preliminary",
      color: "text-[#f5d082] bg-[#e8b85c]/15 border-[#e8b85c]/30",
    };
  };

  const conf = getConfidenceBadge(confidenceScore);

  return (
    <div
      className={cn(
        "bg-[#0a1526]/80 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-4 flex flex-col justify-between transition-all duration-200 hover:border-[#3b82f6]/45 card-tilt-hover shadow-lg font-sans",
        className
      )}
    >
      <div>
        {/* Header: Agency, Year, Reference */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#94a3b8]">
            <span className="font-bold text-white">{agency}</span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-white/90">{year}</span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-[10px] text-[#3b82f6] bg-[#0b1c38] px-1.5 py-0.2 rounded border border-[#3b82f6]/25">
              {referenceNumber}
            </span>
          </div>

          <span
            className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border shrink-0",
              conf.color
            )}
          >
            {conf.label}
          </span>
        </div>

        {/* Title */}
        <h4
          className="text-sm font-bold text-white hover:text-[#3b82f6] transition-colors leading-snug cursor-pointer mb-2"
          onClick={onViewDetails}
        >
          {title}
        </h4>

        {/* Abstract */}
        <p className="text-xs text-[#94a3b8] line-clamp-3 mb-3 leading-relaxed">
          {abstract}
        </p>

        {/* Methodology & Metadata Strip */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#060e1a]/90 rounded border border-[#3b82f6]/15 text-[11px] text-[#94a3b8] mb-3">
          <div>
            <span className="text-[#94a3b8]/60 block text-[10px] uppercase font-mono font-semibold">
              Methodology
            </span>
            <span className="font-medium text-[#f8fafc] line-clamp-1">{methodology}</span>
          </div>
          <div>
            <span className="text-[#94a3b8]/60 block text-[10px] uppercase font-mono font-semibold">
              Validation Status
            </span>
            <span className="font-medium text-[#3b82f6] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>{peerReviewStatus}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-[#94a3b8] border border-white/10 rounded-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#3b82f6]/10 text-xs mt-2">
        {sampleSize && (
          <span className="text-[11px] font-mono text-[#94a3b8]">
            Cohort: <strong className="text-white">{sampleSize}</strong>
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#3b82f6] hover:text-[#93c5fd] transition-colors cursor-pointer font-mono"
          >
            <span>Examine Evidence</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
