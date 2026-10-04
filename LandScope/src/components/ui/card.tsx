import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "accent-emerald" | "accent-cyan" | "muted";
  interactive?: boolean;
}

export function Card({
  className,
  variant = "default",
  interactive = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-[#0a1526]/80 backdrop-blur-md border border-[#3b82f6]/15 text-[#f8fafc] shadow-lg",
    elevated:
      "bg-[#0e1d35]/90 backdrop-blur-xl border border-[#3b82f6]/25 text-[#f8fafc] shadow-2xl",
    glass:
      "glass-panel-primary text-[#f8fafc]",
    "accent-emerald":
      "bg-[#0a1526]/90 backdrop-blur-md border border-[#3b82f6]/20 border-t-2 border-t-[#3b82f6] text-[#f8fafc] shadow-lg",
    "accent-cyan":
      "bg-[#0a1526]/90 backdrop-blur-md border border-[#38bdf8]/20 border-t-2 border-t-[#38bdf8] text-[#f8fafc] shadow-lg",
    muted:
      "bg-[#060e1a]/60 backdrop-blur-sm border border-white/5 text-[#94a3b8]",
  };

  return (
    <div
      className={cn(
        "rounded-md transition-all duration-300",
        interactive && "card-tilt-hover cursor-pointer hover:border-[#3b82f6]/40 hover:shadow-[#3b82f6]/10 hover:shadow-xl",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1 p-5 pb-3 border-b border-[#3b82f6]/10",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-bold text-white tracking-tight flex items-center justify-between",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[#94a3b8] font-normal leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 pt-3 bg-[#060e1a]/40 border-t border-[#3b82f6]/10 text-xs text-[#94a3b8]",
        className
      )}
      {...props}
    />
  );
}
