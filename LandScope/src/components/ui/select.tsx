import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  compact?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, id, compact = false, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-700 select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-red-600 font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-white text-slate-900 border appearance-none transition-all duration-150 rounded-sm font-sans pr-8 focus:outline-none focus:ring-1 focus:ring-[#173860] focus:border-[#173860] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer",
              compact ? "h-8 text-xs pl-2.5" : "h-9 text-sm pl-3",
              error
                ? "border-red-500 focus:border-red-600 focus:ring-red-500"
                : "border-slate-300 hover:border-slate-400",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Institutional down-caret */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-slate-500 leading-tight">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
