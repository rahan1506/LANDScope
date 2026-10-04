import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string | { text: string; variant?: "saffron" | "navy" | "green" | "neutral" };
  badgeVariant?: "saffron" | "navy" | "green" | "neutral";
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  badge,
  badgeVariant = "navy",
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  const badgeStyles = {
    saffron: "bg-[#f59e0b]/15 text-[#fde68a] border-[#f59e0b]/30",
    navy: "bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30",
    green: "bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30",
    neutral: "bg-white/5 text-[#94a3b8] border-white/10",
  };

  const badgeText = typeof badge === "object" && badge !== null ? badge.text : badge;
  const effectiveVariant =
    (typeof badge === "object" && badge !== null && badge.variant ? badge.variant : badgeVariant) || "navy";
  const effectiveSubtitle = subtitle || description;

  return (
    <div className={cn("space-y-2 pb-6 border-b border-[#3b82f6]/15 mb-8 relative", className)}>
      {/* Subtle top indicator glow */}
      <div className="absolute -bottom-px left-0 w-32 h-[2px] bg-gradient-to-r from-[#3b82f6] to-transparent" />

      {breadcrumbs && <div className="text-xs text-[#94a3b8] mb-1.5">{breadcrumbs}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {badgeText && (
              <span
                className={cn(
                  "text-[10px] uppercase font-bold font-mono px-2.5 py-0.5 rounded border tracking-wider",
                  badgeStyles[effectiveVariant]
                )}
              >
                {badgeText}
              </span>
            )}
          </div>
          {effectiveSubtitle && (
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-normal">
              {effectiveSubtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2.5">{action}</div>}
      </div>
    </div>
  );
}
