import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
    isPositiveGood?: boolean;
  };
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "navy" | "saffron" | "green" | "red" | "neutral";
  };
  description?: string;
  className?: string;
  accentBar?: "navy" | "saffron" | "green" | "teal" | "none";
}

export function StatCard({
  title,
  value,
  unit,
  change,
  icon,
  badge,
  description,
  className,
  accentBar = "none",
}: StatCardProps) {
  const accentClasses = {
    none: "",
    navy: "border-t-2 border-t-[#38bdf8]",
    saffron: "border-t-2 border-t-[#f59e0b]",
    green: "border-t-2 border-t-[#3b82f6]",
    teal: "border-t-2 border-t-[#38bdf8]",
  };

  const badgeVariants = {
    navy: "bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30",
    saffron: "bg-[#f59e0b]/15 text-[#fde68a] border-[#f59e0b]/30",
    green: "bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30",
    red: "bg-[#e47d72]/15 text-[#ff9f96] border-[#e47d72]/30",
    neutral: "bg-white/5 text-[#94a3b8] border-white/10",
  };

  const getTrendColor = () => {
    if (!change) return "";
    const isGood = change.isPositiveGood ?? true;
    if (change.trend === "neutral") return "text-[#94a3b8]";
    if (change.trend === "up") return isGood ? "text-[#3b82f6] font-semibold" : "text-[#e47d72] font-semibold";
    if (change.trend === "down") return isGood ? "text-[#e47d72] font-semibold" : "text-[#3b82f6] font-semibold";
    return "text-[#94a3b8]";
  };

  return (
    <div
      className={cn(
        "bg-[#0a1526]/80 backdrop-blur-md border border-[#3b82f6]/15 rounded-md p-4 flex flex-col justify-between transition-all duration-200 hover:border-[#3b82f6]/35 card-tilt-hover shadow-lg",
        accentClasses[accentBar],
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider leading-snug">
          {title}
        </span>
        {icon && (
          <div className="text-[#3b82f6] p-1.5 bg-[#0b1c38]/50 rounded border border-[#3b82f6]/20 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Row */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-black text-white tracking-tight font-tabular">
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-[#94a3b8]">{unit}</span>}
      </div>

      {/* Footer / Context Row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3b82f6]/10 text-xs">
        {change && (
          <div className={cn("flex items-center gap-1 text-[11px]", getTrendColor())}>
            {change.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
            {change.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
            {change.trend === "neutral" && <Minus className="w-3.5 h-3.5" />}
            <span>{change.value}</span>
            {change.label && <span className="text-[#94a3b8] font-normal">{change.label}</span>}
          </div>
        )}

        {badge && (
          <span
            className={cn(
              "px-1.5 py-0.5 text-[10px] font-semibold border rounded-sm ml-auto font-mono",
              badgeVariants[badge.variant || "neutral"]
            )}
          >
            {badge.text}
          </span>
        )}

        {!change && !badge && description && (
          <span className="text-[11px] text-[#94a3b8] truncate">{description}</span>
        )}
      </div>
    </div>
  );
}
