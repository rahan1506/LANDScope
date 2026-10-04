import React from "react";
import { Filter, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface DataFiltersProps {
  groups: FilterGroup[];
  selectedValues: Record<string, string[]>;
  onFilterChange: (groupId: string, optionId: string) => void;
  onResetFilters: () => void;
  className?: string;
}

export function DataFilters({
  groups,
  selectedValues,
  onFilterChange,
  onResetFilters,
  className,
}: DataFiltersProps) {
  const totalActive = Object.values(selectedValues).reduce(
    (acc, arr) => acc + (arr ? arr.length : 0),
    0
  );

  return (
    <div
      className={cn(
        "bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-4 flex flex-col gap-3.5 font-sans text-xs shadow-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#3b82f6]/15">
        <div className="flex items-center gap-2 font-bold text-white font-mono">
          <Filter className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>Faceted Filters</span>
          {totalActive > 0 && (
            <span className="px-1.5 py-0.2 bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#93c5fd] text-[10px] rounded-full font-tabular font-mono">
              {totalActive}
            </span>
          )}
        </div>

        {totalActive > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-[#3b82f6] cursor-pointer font-mono transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {groups.map((group) => {
          const selectedInGroup = selectedValues[group.id] || [];

          return (
            <div key={group.id} className="space-y-1.5">
              <div className="font-semibold text-[#94a3b8] text-[10px] uppercase font-mono tracking-widest">
                {group.title}
              </div>

              <div className="space-y-1">
                {group.options.map((opt) => {
                  const isChecked = selectedInGroup.includes(opt.id);

                  return (
                    <label
                      key={opt.id}
                      onClick={() => onFilterChange(group.id, opt.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-sm transition-all cursor-pointer select-none",
                        isChecked
                          ? "bg-[#0b1c38] text-white font-medium border border-[#3b82f6]/30"
                          : "hover:bg-white/5 text-[#94a3b8]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-2xs border flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-[#3b82f6] border-[#3b82f6] text-[#030712]"
                              : "border-[#3b82f6]/30 bg-[#030712]"
                          )}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs">{opt.label}</span>
                      </div>

                      {opt.count !== undefined && (
                        <span className="text-[10px] text-[#94a3b8]/60 font-mono font-tabular">
                          ({opt.count})
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
