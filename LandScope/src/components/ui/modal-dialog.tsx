import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidth = "lg",
  className,
}: ModalDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window: Floating Glass Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative w-full bg-[#060e1a]/95 backdrop-blur-2xl border border-[#3b82f6]/25 rounded-md shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Top Illuminated Gradient Indicator */}
        <div className="h-0.5 bg-gradient-to-r from-[#3b82f6] via-[#93c5fd] to-[#38bdf8] w-full" />

        {/* Dialog Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-[#3b82f6]/15 bg-[#0a1526]/50">
          <div className="flex flex-col gap-1 pr-6">
            <div className="flex items-center gap-2.5">
              <h2 id="dialog-title" className="text-base font-bold text-white tracking-tight">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-[#94a3b8] font-normal leading-relaxed">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-6 overflow-y-auto text-sm text-[#f8fafc] flex-1">{children}</div>

        {/* Dialog Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 p-4 bg-[#030712]/80 border-t border-[#3b82f6]/15">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
