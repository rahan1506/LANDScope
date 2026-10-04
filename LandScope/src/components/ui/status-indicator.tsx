import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "live"
  | "demo"
  | "planned"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface StatusIndicatorProps {
  status: string;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  variant,
  pulse = false,
  className,
}: StatusIndicatorProps) {
  // Auto-infer variant if not explicitly supplied
  let v = variant;
  if (!v) {
    const s = status.toLowerCase();
    if (s.includes("live") || s.includes("safe") || s.includes("operational") || s.includes("active") || s.includes("accepted")) {
      v = "success";
    } else if (s.includes("demo") || s.includes("illustrative") || s.includes("semi-critical") || s.includes("review")) {
      v = "demo";
    } else if (s.includes("planned") || s.includes("draft") || s.includes("proposed")) {
      v = "planned";
    } else if (s.includes("critical") || s.includes("rejected") || s.includes("error") || s.includes("revoked")) {
      v = "danger";
    } else {
      v = "neutral";
    }
  }

  const styles = {
    live: "bg-emerald-50 text-emerald-800 border-emerald-200 dot-emerald-500",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 dot-emerald-500",
    demo: "bg-amber-50 text-amber-900 border-amber-200 dot-amber-500",
    planned: "bg-slate-100 text-slate-700 border-slate-200 dot-slate-400",
    warning: "bg-amber-50 text-amber-900 border-amber-200 dot-amber-500",
    danger: "bg-rose-50 text-rose-800 border-rose-200 dot-rose-500",
    neutral: "bg-slate-50 text-slate-600 border-slate-200 dot-slate-400",
  };

  const dotColors = {
    live: "bg-emerald-500",
    success: "bg-emerald-500",
    demo: "bg-amber-500",
    planned: "bg-slate-400",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border tracking-tight font-sans",
        styles[v],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          dotColors[v],
          pulse && "animate-pulse"
        )}
      />
      <span>{status}</span>
    </span>
  );
}
