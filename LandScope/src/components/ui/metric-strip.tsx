import React from "react";
import { cn } from "@/lib/utils";

export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtext?: string;
  caption?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export interface MetricStripProps {
  metrics: MetricItem[];
  className?: string;
}

export function MetricStrip({ metrics, className }: MetricStripProps) {
  // Cap strictly at 4 metrics maximum
  const displayMetrics = metrics.slice(0, 4);

  return (
    <div
      className={cn(
        "bg-[#0a1526]/80 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md shadow-xl divide-y sm:divide-y-0 sm:divide-x divide-[#3b82f6]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8",
        className
      )}
    >
      {displayMetrics.map((m, idx) => (
        <div key={idx} className="p-4 sm:p-5 flex items-start justify-between gap-3 relative group">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-semibold text-[#94a3b8] uppercase tracking-wider block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-tabular font-mono">
                {m.value}
              </span>
              {m.change && (
                <span
                  className={cn(
                    "text-xs font-semibold font-mono",
                    (m.changeType === "positive" || (!m.changeType && m.trend === "up"))
                      ? "text-[#3b82f6]"
                      : (m.changeType === "negative" || (!m.changeType && m.trend === "down"))
                      ? "text-[#e47d72]"
                      : "text-[#94a3b8]"
                  )}
                >
                  {m.change}
                </span>
              )}
            </div>
            {(m.subtext || m.caption) && (
              <span className="text-[11px] text-[#94a3b8]/80 block font-mono">{m.subtext || m.caption}</span>
            )}
          </div>

          {m.icon && (
            <div className="text-[#3b82f6] shrink-0 p-2 bg-[#0b1c38]/50 border border-[#3b82f6]/20 rounded-sm">
              {m.icon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
