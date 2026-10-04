import React from "react";
import { Sliders, RotateCcw, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ScenarioParameter {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  baseline: number;
}

export interface ScenarioControlsProps {
  parameters: ScenarioParameter[];
  onParameterChange: (id: string, value: number) => void;
  onReset: () => void;
  onRunSimulation: () => void;
  isSimulating?: boolean;
  className?: string;
}

export function ScenarioControls({
  parameters,
  onParameterChange,
  onReset,
  onRunSimulation,
  isSimulating = false,
  className,
}: ScenarioControlsProps) {
  return (
    <div
      className={cn(
        "bg-[#060e1a]/85 backdrop-blur-xl border border-[#3b82f6]/20 rounded-md p-5 flex flex-col gap-4 font-sans text-xs shadow-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3b82f6]/15">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-[#3b82f6]" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Policy Digital Twin Instrument Panel
            </h4>
            <span className="text-[11px] text-[#94a3b8]">
              Calibrate statutory levers to model multi-dimensional spatio-economic outcomes
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] hover:text-[#3b82f6] font-mono cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Sliders Stack styled as scientific precision dials */}
      <div className="space-y-4">
        {parameters.map((param) => {
          const isModified = param.value !== param.baseline;

          return (
            <div
              key={param.id}
              className="space-y-2 p-3 rounded bg-[#030712]/70 border border-[#3b82f6]/15 hover:border-[#3b82f6]/35 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">{param.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#3b82f6] font-tabular font-mono text-sm">
                    {param.value} {param.unit}
                  </span>
                  {isModified && (
                    <span className="text-[10px] font-mono text-[#f59e0b] bg-[#f59e0b]/15 px-1.5 py-0.5 rounded border border-[#f59e0b]/30">
                      Base: {param.baseline}
                    </span>
                  )}
                </div>
              </div>

              {/* Precision Range Slider */}
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => onParameterChange(param.id, Number(e.target.value))}
                className="w-full h-1.5 bg-[#0b1c38] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
              />

              <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]/60">
                <span>Min: {param.min} {param.unit}</span>
                <span className="text-[#94a3b8] italic font-sans">{param.description}</span>
                <span>Max: {param.max} {param.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Actions */}
      <div className="pt-3 border-t border-[#3b82f6]/15 flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#94a3b8] flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>Equilibrium Engine Active (v4.2 Neural-Twin)</span>
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={onRunSimulation}
          isLoading={isSimulating}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          className="font-bold font-mono text-xs"
        >
          Compute Scenario Impact
        </Button>
      </div>
    </div>
  );
}
