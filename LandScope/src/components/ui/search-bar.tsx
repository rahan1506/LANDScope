import React, { useState } from "react";
import { Search, X, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  className?: string;
  showShortcut?: boolean;
  filters?: { id: string; label: string }[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  placeholder = "Search parcels, village revenue codes, policy archives, land cases...",
  value: controlledValue,
  onChange,
  onSearch,
  className,
  showShortcut = true,
  filters,
  activeFilter,
  onFilterChange,
  size = "md",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const searchTerm = isControlled ? controlledValue : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(searchTerm);
    }
  };

  const heightClass = size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-11 text-base" : "h-9 text-sm";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
          <Search className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full bg-white text-slate-900 border border-slate-300 rounded-sm pl-9 font-sans transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173860] focus:border-[#173860] hover:border-slate-400 shadow-2xs",
            showShortcut ? "pr-20" : searchTerm ? "pr-8" : "pr-3",
            heightClass
          )}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Keyboard shortcut badge */}
        {showShortcut && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">
              <Command className="w-2.5 h-2.5 mr-0.5" /> K
            </kbd>
          </div>
        )}
      </div>

      {/* Optional Filter Pills */}
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Scope:
          </span>
          {filters.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange?.(filter.id)}
                className={cn(
                  "px-2 py-0.5 rounded-sm text-xs font-medium transition-colors cursor-pointer border",
                  isSelected
                    ? "bg-[#112A4A] text-white border-[#112A4A]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
