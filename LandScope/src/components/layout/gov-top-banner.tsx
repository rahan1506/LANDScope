"use client";

import React, { useState, useEffect } from "react";
import { Globe, Clock, Eye, Radio, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface GovTopBannerProps {
  onFontSizeChange?: (delta: number) => void;
  onToggleHighContrast?: () => void;
  isHighContrast?: boolean;
}

export function GovTopBanner({
  onFontSizeChange,
  onToggleHighContrast,
  isHighContrast = false,
}: GovTopBannerProps) {
  const [timeStr, setTimeStr] = useState("03 Oct 2026 | 15:30:00 IST");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          " | " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }) +
          " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#050b0a] text-[#94a3b8] text-[11px] font-sans border-b border-[#3b82f6]/10 select-none relative z-50">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Platform Identity & Spatial Telemetry Node */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="font-bold text-white tracking-wider text-[11px] uppercase">
              LANDScope Command
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <span className="text-[#3b82f6] font-mono text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#3b82f6]/10 rounded border border-[#3b82f6]/20 hidden sm:inline-flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#3b82f6]" />
            <span>SIH 2026 National Prototype</span>
          </span>

          <span className="text-[#94a3b8]/80 hidden xl:inline text-[11px]">
            National Spatial Decision-Support Architecture • EPSG:4326
          </span>
        </div>

        {/* Right: Accessibility Controls & Precision Live Clock */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[#94a3b8] font-mono text-[10px]">
            <Clock className="w-3.5 h-3.5 text-[#3b82f6]/80" />
            <span className="font-tabular text-white/90">{timeStr}</span>
          </div>

          <span className="text-white/10 hidden sm:inline">|</span>

          {/* Clean Scientific Font Scaling */}
          <div className="flex items-center gap-1 bg-[#060e1a] px-2 py-0.5 rounded border border-[#3b82f6]/20">
            <button
              type="button"
              onClick={() => onFontSizeChange?.(-1)}
              className="px-1 text-[10px] text-[#94a3b8] hover:text-[#3b82f6] transition-colors cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange?.(0)}
              className="px-1.5 text-[10px] text-white font-bold cursor-pointer hover:text-[#3b82f6] transition-colors"
              title="Reset Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange?.(1)}
              className="px-1 text-[10px] text-[#94a3b8] hover:text-[#3b82f6] transition-colors cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={onToggleHighContrast}
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer font-mono",
              isHighContrast
                ? "bg-[#3b82f6] text-[#030712] border-[#3b82f6] font-bold"
                : "bg-[#060e1a] text-[#94a3b8] border-[#3b82f6]/20 hover:text-white hover:border-[#3b82f6]/40"
            )}
            title="Toggle High Contrast Display"
          >
            <Eye className="w-3 h-3 text-[#3b82f6]" />
            <span className="hidden md:inline">CONTRAST</span>
          </button>
        </div>
      </div>
    </div>
  );
}
