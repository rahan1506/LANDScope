import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  compact?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      compact = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#94a3b8] select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#e47d72] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full bg-[#060e1a]/90 text-[#f8fafc] border transition-all duration-150 rounded-sm font-sans placeholder:text-[#94a3b8]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] disabled:bg-[#030712]/50 disabled:text-[#94a3b8]/40 disabled:cursor-not-allowed",
              compact ? "h-8 text-xs px-2.5" : "h-9 text-sm px-3",
              leftIcon ? (compact ? "pl-8" : "pl-9") : "",
              rightIcon ? (compact ? "pr-8" : "pr-9") : "",
              error
                ? "border-[#e47d72] focus:border-[#e47d72] focus:ring-[#e47d72]"
                : "border-[#3b82f6]/20 hover:border-[#3b82f6]/40",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-[#e47d72] font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-[#94a3b8]/80 leading-tight">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
