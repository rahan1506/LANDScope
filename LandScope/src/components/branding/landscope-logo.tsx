import React from "react";

interface LandScopeLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  variant?: "light" | "dark" | "navy" | "azure" | "emerald";
  subtitle?: string;
}

export function LandScopeLogo({
  className = "",
  size = "md",
  showTagline = false,
  variant = "azure",
  subtitle = "National Land Intelligence & Policy Innovation Platform",
}: LandScopeLogoProps) {
  const iconSize = size === "sm" ? 32 : size === "md" ? 40 : 48;
  const titleSize =
    size === "sm" ? "text-base font-bold" : size === "md" ? "text-lg font-bold" : "text-2xl font-black";
  const subSize = size === "sm" ? "text-[10px]" : size === "md" ? "text-[11px]" : "text-xs";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Emblem: Digital Earth Meridian + Cadastral Mesh + AI Intelligence Nodes */}
      <div className="relative shrink-0 flex items-center justify-center group">
        <div className="absolute inset-0 rounded-lg bg-[#3b82f6]/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative transition-transform duration-300"
          aria-label="LANDScope Geospatial Intelligence Emblem"
        >
          {/* Base Sapphire Panel with Illuminated Azure Border */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="10"
            fill="#060e1a"
            stroke="rgba(59, 130, 246, 0.45)"
            strokeWidth="1.2"
          />

          {/* Coordinate Micro-Grid */}
          <line x1="3" y1="16" x2="45" y2="16" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="0.8" />
          <line x1="3" y1="32" x2="45" y2="32" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="0.8" />
          <line x1="16" y1="3" x2="16" y2="45" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="0.8" />
          <line x1="32" y1="3" x2="32" y2="45" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="0.8" />

          {/* Procedural Land Ridge Silhouette in Deep Sapphire Navy */}
          <path
            d="M6 38L15 25L24 32L34 21L42 29V42C42 43.1 41.1 44 40 44H8C6.9 44 6 43.1 6 42V38Z"
            fill="#0b1c38"
            fillOpacity="0.75"
          />
          <path
            d="M6 40L18 29L26 35L36 26L42 32V42C42 43.1 41.1 44 40 44H8C6.9 44 6 43.1 6 42V40Z"
            fill="#10274e"
            fillOpacity="0.95"
          />

          {/* Precision Topographic Vector Contour Line: Electric Azure */}
          <path
            d="M6 34C13 27 21 29 27 23C33 17 38 22 42 19"
            stroke="#3b82f6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cadastral Polygon Highlight with Cyan Vector */}
          <polygon
            points="18,12 28,9 33,17 23,19"
            fill="#38bdf8"
            fillOpacity="0.35"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />

          {/* Intelligence Signal Nodes */}
          <circle cx="28" cy="9" r="2.2" fill="#3b82f6" />
          <circle cx="28" cy="9" r="4.5" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.7" />
          <circle cx="18" cy="24" r="1.8" fill="#38bdf8" />
          <circle cx="34" cy="21" r="1.8" fill="#f59e0b" />
        </svg>
      </div>

      {/* Brand Nomenclature */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSize} tracking-tight text-white`}>
            LAND<span className="text-[#3b82f6]">Scope</span>
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#10274e] text-[#60a5fa] border border-[#3b82f6]/30 font-bold">
            INTELLIGENCE
          </span>
        </div>

        {subtitle && (
          <span className={`${subSize} font-medium text-slate-400 tracking-tight line-clamp-1`}>
            {subtitle}
          </span>
        )}

        {showTagline && (
          <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mt-0.5">
            Explore • Analyze • Simulate • Decide
          </span>
        )}
      </div>
    </div>
  );
}
