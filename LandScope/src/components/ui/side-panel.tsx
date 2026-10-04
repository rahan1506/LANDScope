import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  position = "right",
  width = "md",
  className,
}: SidePanelProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[440px]",
    xl: "w-[560px]",
  };

  const positionClasses = {
    right: "right-0 border-l border-slate-300",
    left: "left-0 border-r border-slate-300",
  };

  return (
    <aside
      className={cn(
        "absolute top-0 bottom-0 z-30 bg-white flex flex-col shadow-xl transition-all duration-200 overflow-hidden font-sans",
        positionClasses[position],
        widthClasses[width],
        className
      )}
    >
      {/* Top Gov Blue Bar */}
      <div className="h-1 bg-[#112A4A] w-full" />

      {/* Header */}
      <div className="flex items-start justify-between p-3.5 pb-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#0A1C30] tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 cursor-pointer"
          aria-label="Close side panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 text-xs text-slate-700 space-y-4">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          {footer}
        </div>
      )}
    </aside>
  );
}
