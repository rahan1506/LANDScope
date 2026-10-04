import React from "react";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Compass,
  Ruler,
  MapPin,
  Eye,
  EyeOff,
  Navigation,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BasemapType = "cadastral" | "satellite" | "topographic" | "hybrid";

export interface MapLayer {
  id: string;
  name: string;
  category: "cadastral" | "regulatory" | "ecological" | "dispute";
  visible: boolean;
  opacity: number;
  count?: number;
  color: string;
}

export interface MapControlsProps {
  basemap: BasemapType;
  onBasemapChange: (type: BasemapType) => void;
  layers: MapLayer[];
  onToggleLayer: (id: string) => void;
  onLayerOpacityChange: (id: string, opacity: number) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  coordinates?: { lat: number; lng: number; zoom: number; epsg?: string };
  scaleText?: string;
  className?: string;
}

export function MapControls({
  basemap,
  onBasemapChange,
  layers,
  onToggleLayer,
  onLayerOpacityChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
  coordinates = { lat: 23.2048, lng: 77.0841, zoom: 12, epsg: "EPSG:4326 (WGS84)" },
  scaleText = "1 : 12,500",
  className,
}: MapControlsProps) {
  const [layersOpen, setLayersOpen] = React.useState(false);

  return (
    <div className={cn("pointer-events-none select-none", className)}>
      {/* 1. Top-Right Floating Controls: Basemap & Layers Switcher */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Basemap Selector Pill */}
        <div className="flex items-center bg-white/95 backdrop-blur-xs border border-slate-300 rounded-sm shadow-sm p-1 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Basemap:</span>
          {(
            [
              { id: "cadastral", label: "Cadastral" },
              { id: "satellite", label: "Satellite" },
              { id: "topographic", label: "Topo" },
              { id: "hybrid", label: "Hybrid" },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              onClick={() => onBasemapChange(b.id)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer",
                basemap === b.id
                  ? "bg-[#112A4A] text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Layer Manager Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-sm shadow-sm text-xs font-semibold cursor-pointer transition-colors",
              layersOpen ? "bg-slate-100 text-[#112A4A] border-slate-400" : "text-slate-800 hover:bg-slate-50"
            )}
          >
            <Layers className="w-3.5 h-3.5 text-[#112A4A]" />
            <span>GIS Layers ({layers.filter((l) => l.visible).length}/{layers.length})</span>
          </button>

          {/* Collapsible Layer Menu */}
          {layersOpen && (
            <div className="absolute right-0 top-9 w-64 bg-white border border-slate-300 rounded-sm shadow-lg p-3 text-xs z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Thematic Overlay Layers
                </span>
                <span className="text-[10px] text-slate-500 font-mono">NIC-WMS 1.3</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-2xs shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          layer.visible ? "text-slate-900" : "text-slate-400 line-through"
                        )}
                      >
                        {layer.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleLayer(layer.id)}
                      className="text-slate-500 hover:text-slate-800 p-1 rounded cursor-pointer"
                      title={layer.visible ? "Hide layer" : "Show layer"}
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-[#112A4A]" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top-Left Floating Controls: Zoom & Measure Stack */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-auto">
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <button
            onClick={onZoomIn}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors border-b border-slate-200 cursor-pointer"
            title="Zoom In (Level +1)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors border-b border-slate-200 cursor-pointer"
            title="Zoom Out (Level -1)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onResetZoom}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Reset to National Extent"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {onToggleFullscreen && (
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden mt-1">
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter GIS Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Coordinates & Spatial Metadata Bar */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between bg-white/95 backdrop-blur-xs border border-slate-300 rounded-sm px-3 py-1 text-[11px] font-mono text-slate-600 shadow-sm pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-[#D35E0E]" />
            <span>
              Lat: <strong className="text-slate-800">{coordinates.lat.toFixed(4)}° N</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Lng: <strong className="text-slate-800">{coordinates.lng.toFixed(4)}° E</strong>
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-1 text-slate-600">
            <span>Projection:</span>
            <strong className="text-slate-800">{coordinates.epsg || "EPSG:4326 (WGS84)"}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Scale</span>
            <span className="font-semibold text-slate-800">{scaleText}</span>
          </div>
          <div className="h-2 w-16 bg-slate-300 border-x border-slate-500 relative flex items-center justify-center">
            <span className="text-[9px] -top-3 absolute text-slate-500">500m</span>
          </div>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
            Cadastre Validated
          </span>
        </div>
      </div>
    </div>
  );
}
