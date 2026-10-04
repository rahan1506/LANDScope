import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-8 sm:p-12 text-center max-w-lg mx-auto my-6 space-y-3",
        className
      )}
    >
      {icon && <div className="text-slate-300 flex justify-center mb-2">{icon}</div>}
      <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
}
