import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  count,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 mb-4", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-base sm:text-lg font-bold text-[#0A1C30] tracking-tight">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {count}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-slate-500 hidden md:inline ml-1 font-normal">
            — {subtitle}
          </span>
        )}
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
