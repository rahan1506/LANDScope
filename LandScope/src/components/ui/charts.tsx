"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

// 1. Multi-Year LULC (Land Use / Land Cover) Trend Chart
export interface LulcTrendPoint {
  year: string;
  agriculture: number; // in thousand hectares / percentages
  forest: number;
  builtUp: number;
  waterBodies: number;
}

export interface LulcTrendChartProps {
  data: LulcTrendPoint[];
  height?: number;
  className?: string;
}

export function LulcTrendChart({
  data,
  height = 240,
  className,
}: LulcTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxY = 100; // percentages
  const width = 640;
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxY) * innerHeight;

  const makeLinePath = (key: keyof Omit<LulcTrendPoint, "year">) => {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key] as number)}`)
      .join(" ");
  };

  const makeAreaPath = (key: keyof Omit<LulcTrendPoint, "year">) => {
    const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key] as number)}`).join(" ");
    return `${line} L ${getX(data.length - 1)} ${padding.top + innerHeight} L ${getX(0)} ${padding.top + innerHeight} Z`;
  };

  return (
    <div className={cn("w-full flex flex-col font-sans", className)}>
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minWidth: "480px" }}
        >
          <defs>
            {/* Gradients for scientific glow */}
            <linearGradient id="grad-agri" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="grad-forest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="grad-built" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                stroke="rgba(59, 130, 246, 0.1)"
                strokeWidth="1"
                strokeDasharray={tick === 0 ? "0" : "3,3"}
              />
              <text
                x={padding.left - 8}
                y={getY(tick) + 3}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                className="font-tabular font-mono"
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* Area fills */}
          <path d={makeAreaPath("forest")} fill="url(#grad-forest)" />
          <path d={makeAreaPath("builtUp")} fill="url(#grad-built)" />

          {/* Series lines */}
          {/* 1. Agriculture (Earth / Sand) */}
          <path
            d={makeLinePath("agriculture")}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* 2. Forest (Emerald Intelligence) */}
          <path
            d={makeLinePath("forest")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.4"
          />

          {/* 3. Built-up (Satellite Cyan) */}
          <path
            d={makeLinePath("builtUp")}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* 4. Water Bodies (Deep Forest/Teal Dashed) */}
          <path
            d={makeLinePath("waterBodies")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeDasharray="4,2"
          />

          {/* Vertical cursor guideline */}
          {hoveredIdx !== null && (
            <line
              x1={getX(hoveredIdx)}
              y1={padding.top}
              x2={getX(hoveredIdx)}
              y2={padding.top + innerHeight}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}

          {data.map((d, i) => (
            <g
              key={d.year}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Year label */}
              <text
                x={getX(i)}
                y={height - 14}
                textAnchor="middle"
                fontSize="11"
                fill={hoveredIdx === i ? "#ffffff" : "#94a3b8"}
                fontWeight={hoveredIdx === i ? "bold" : "normal"}
                className="font-mono"
              >
                {d.year}
              </text>

              {/* Data circles */}
              <circle
                cx={getX(i)}
                cy={getY(d.forest)}
                r={hoveredIdx === i ? 5 : 3}
                fill="#030712"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.builtUp)}
                r={hoveredIdx === i ? 4.5 : 2.5}
                fill="#030712"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.agriculture)}
                r={hoveredIdx === i ? 4.5 : 2.5}
                fill="#030712"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Scientific Legend & Dynamic Telemetry Tooltip */}
      <div className="flex items-center justify-between px-2 pt-3 border-t border-[#3b82f6]/10 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
            <span className="text-[11px] text-[#f8fafc] font-medium">Forest Reserve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="text-[11px] text-[#f8fafc] font-medium">Built-up / Urban</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[11px] text-[#f8fafc] font-medium">Agriculture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#2563eb] border-b border-dashed border-[#3b82f6] inline-block" />
            <span className="text-[11px] text-[#94a3b8] font-medium">Water Bodies</span>
          </div>
        </div>

        {hoveredIdx !== null && (
          <div className="text-[11px] font-mono text-[#3b82f6] bg-[#060e1a] border border-[#3b82f6]/30 px-2.5 py-1 rounded shadow-lg">
            {data[hoveredIdx].year}: Forest {data[hoveredIdx].forest}% | Built {data[hoveredIdx].builtUp}% | Agri {data[hoveredIdx].agriculture}%
          </div>
        )}
      </div>
    </div>
  );
}

// 2. District Benchmark Horizontal Bar Chart (Tenure Security Index)
export interface DistrictBenchmarkItem {
  district: string;
  state: string;
  score: number; // 0 - 100
  target: number;
  status: "high" | "medium" | "low";
}

export function DistrictIndexBarChart({
  items,
  className,
}: {
  items: DistrictBenchmarkItem[];
  className?: string;
}) {
  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between text-xs text-[#94a3b8] pb-1 border-b border-[#3b82f6]/15">
        <span className="font-semibold uppercase text-[10px] tracking-wider font-mono">
          District / Administrative Unit
        </span>
        <span className="font-semibold uppercase text-[10px] tracking-wider font-mono">
          Tenure Security Index (Out of 100)
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const barColor =
            item.score >= 80
              ? "bg-[#3b82f6] shadow-[0_0_10px_rgba(59, 130, 246,0.3)]"
              : item.score >= 60
              ? "bg-[#38bdf8] shadow-[0_0_10px_rgba(56, 189, 248,0.3)]"
              : "bg-[#e8b85c] shadow-[0_0_10px_rgba(232,184,92,0.3)]";

          return (
            <div key={item.district} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{item.district}</span>
                  <span className="text-[10px] text-[#94a3b8] font-medium font-mono">({item.state})</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-tabular font-bold text-[#3b82f6]">{item.score}</span>
                  <span className="text-[10px] text-[#94a3b8]">/ 100</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="relative w-full h-2.5 bg-[#060e1a] rounded-full overflow-hidden border border-[#3b82f6]/15">
                {/* Benchmark marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#f59e0b] z-10"
                  style={{ left: `${item.target}%` }}
                  title={`National Target: ${item.target}`}
                />
                {/* Fill bar */}
                <div
                  className={cn("h-full transition-all duration-700 rounded-full", barColor)}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#3b82f6]/10 text-[11px] text-[#94a3b8]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#3b82f6] rounded-full" /> High (80+)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#38bdf8] rounded-full" /> Moderate (60-79)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#e8b85c] rounded-full" /> Review (&lt;60)
          </span>
        </div>
        <span className="font-mono text-[#f59e0b]">National Avg: 68.4</span>
      </div>
    </div>
  );
}

// 3. Policy Lab Scenario Impact Comparison Meter
export interface ScenarioMetric {
  label: string;
  baseline: number;
  simulated: number;
  unit: string;
  trend: "positive" | "negative" | "neutral";
}

export function ScenarioImpactMeter({
  metrics,
  className,
}: {
  metrics: ScenarioMetric[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3.5", className)}>
      {metrics.map((m) => {
        const delta = Number((m.simulated - m.baseline).toFixed(1));
        const deltaPercent = Number(((delta / m.baseline) * 100).toFixed(1));
        const isUp = delta > 0;

        return (
          <div
            key={m.label}
            className="p-3.5 bg-[#060e1a]/80 border border-[#3b82f6]/15 rounded-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-white">{m.label}</span>
              <span
                className={cn(
                  "text-[10px] font-mono font-bold px-2 py-0.5 rounded border",
                  m.trend === "positive"
                    ? "bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30"
                    : m.trend === "negative"
                    ? "bg-[#e47d72]/15 text-[#ff9f96] border-[#e47d72]/30"
                    : "bg-white/5 text-[#94a3b8] border-white/10"
                )}
              >
                {isUp ? `+${deltaPercent}%` : `${deltaPercent}%`}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white font-tabular font-mono">
                  {m.simulated}
                </span>
                <span className="text-xs text-[#94a3b8]">{m.unit}</span>
              </div>
              <div className="text-[11px] text-[#94a3b8] font-mono">
                Baseline: {m.baseline} {m.unit}
              </div>
            </div>

            {/* Micro Dual-Bar Comparison */}
            <div className="w-full space-y-1.5 mt-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#94a3b8] w-14 shrink-0">Simulated</span>
                <div className="h-2 flex-1 bg-[#030712] rounded-full overflow-hidden border border-[#3b82f6]/15">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      m.trend === "positive" ? "bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" : "bg-[#e47d72]"
                    )}
                    style={{ width: `${Math.min(100, (m.simulated / (m.baseline * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#94a3b8] w-14 shrink-0">Baseline</span>
                <div className="h-2 flex-1 bg-[#030712] rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-[#94a3b8]/40 rounded-full"
                    style={{ width: `${Math.min(100, (m.baseline / (m.baseline * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
