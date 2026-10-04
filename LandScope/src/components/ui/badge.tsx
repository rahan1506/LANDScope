import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "official"
    | "gazetted"
    | "saffron"
    | "dispute"
    | "pending"
    | "cadastral"
    | "neutral"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    // Official / Verified / FRA Approved: Emerald
    official: "bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30",
    // Gazetted notification: Deep Command Sapphire
    gazetted: "bg-[#10274e]/60 text-[#93c5fd] border-[#3b82f6]/25",
    // Saffron priority: Earth / Sand
    saffron: "bg-[#f59e0b]/15 text-[#fde68a] border-[#f59e0b]/30",
    // Dispute / Encroachment alert: Muted Coral
    dispute: "bg-[#e47d72]/15 text-[#ff9f96] border-[#e47d72]/30",
    // Pending / Review: Muted Amber
    pending: "bg-[#e8b85c]/15 text-[#f5d082] border-[#e8b85c]/30",
    // Cadastral / GIS spatial layer: Satellite Cyan
    cadastral: "bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30",
    // Neutral slate
    neutral: "bg-white/5 text-[#94a3b8] border-white/10",
    // Simple outline
    outline: "bg-transparent text-[#f8fafc] border-white/15",
  };

  const dotColors = {
    official: "bg-[#3b82f6] shadow-[0_0_6px_#3b82f6]",
    gazetted: "bg-[#60a5fa] shadow-[0_0_6px_#60a5fa]",
    saffron: "bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]",
    dispute: "bg-[#e47d72] shadow-[0_0_6px_#e47d72]",
    pending: "bg-[#e8b85c] shadow-[0_0_6px_#e8b85c]",
    cadastral: "bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]",
    neutral: "bg-[#94a3b8]",
    outline: "bg-white/60",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1.5 font-medium font-mono",
    md: "text-xs px-2.5 py-0.5 gap-1.5 font-semibold font-mono",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border uppercase tracking-wider select-none leading-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
