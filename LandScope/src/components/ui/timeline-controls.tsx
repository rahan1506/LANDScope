import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineMilestone {
  year: number;
  label: string;
  tag?: string;
  description?: string;
}

export interface TimelineControlsProps {
  years: number[];
  currentYear: number;
  onYearChange: (year: number) => void;
  milestones?: TimelineMilestone[];
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

export function TimelineControls({
  years = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026],
  currentYear,
  onYearChange,
  milestones = [
    { year: 2016, label: "DILRMP Launch", tag: "Policy" },
    { year: 2020, label: "SVAMITVA Drone Survey", tag: "Tech" },
    { year: 2024, label: "Geo-referenced Cadastre 85%", tag: "Milestone" },
    { year: 2026, label: "LANDScope AI Platform", tag: "SIH26019" },
  ],
  className,
}: TimelineControlsProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (playing) {
      interval = setInterval(() => {
        const nextIdx = (years.indexOf(currentYear) + 1) % years.length;
        onYearChange(years[nextIdx]);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, currentYear, years, onYearChange]);

  const currentIndex = years.indexOf(currentYear);

  const handlePrev = () => {
    if (currentIndex > 0) onYearChange(years[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < years.length - 1) onYearChange(years[currentIndex + 1]);
  };

  const activeMilestone = milestones.find((m) => m.year === currentYear);

  return (
    <div
      className={cn(
        "bg-white border border-slate-300 rounded-sm p-3 shadow-xs flex flex-col gap-2 font-sans select-none",
        className
      )}
    >
      {/* Top Header Row with Active Year Display & Playback */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#112A4A] text-white px-2.5 py-1 rounded text-xs font-bold font-tabular">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Epoch: {currentYear}</span>
          </div>

          {activeMilestone && (
            <span className="text-[11px] font-semibold text-slate-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
              ★ {activeMilestone.label}
            </span>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            title="Previous Year"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-800 cursor-pointer"
          >
            {playing ? (
              <>
                <Pause className="w-3 h-3 text-[#D35E0E]" /> <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#166534]" /> <span>Simulate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === years.length - 1}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            title="Next Year"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onYearChange(years[0])}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 cursor-pointer ml-1"
            title="Reset to 2010"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spatio-temporal Slider Track with Milestones */}
      <div className="relative pt-4 pb-2 px-2">
        {/* Slider Input */}
        <input
          type="range"
          min={years[0]}
          max={years[years.length - 1]}
          step={2}
          value={currentYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#112A4A]"
        />

        {/* Year Tick Marks */}
        <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-tabular font-medium">
          {years.map((y) => {
            const isMilestone = milestones.some((m) => m.year === y);
            const isSelected = y === currentYear;

            return (
              <button
                key={y}
                type="button"
                onClick={() => onYearChange(y)}
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-colors focus:outline-none",
                  isSelected ? "text-[#112A4A] font-bold" : "hover:text-slate-900"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mb-1",
                    isSelected
                      ? "bg-[#D35E0E] ring-2 ring-orange-200"
                      : isMilestone
                      ? "bg-slate-400"
                      : "bg-slate-300"
                  )}
                />
                <span>{y}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
