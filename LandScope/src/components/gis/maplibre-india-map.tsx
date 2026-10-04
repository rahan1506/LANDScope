/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  MapPin,
  Crosshair,
  Layers,
  Globe,
} from "lucide-react";
import {
  INDIA_STATES_DATA,
  getAshtaCadastralGeoJson,
} from "@/lib/gis/india-geo-data";
import { AdministrativeBoundaryProvider } from "@/lib/gis/boundary-provider";
import { CadastralFeature } from "./gis-workstation-view";

// Basemap styles supporting Google Maps, Esri Dark, and OpenStreetMap
export type BasemapStyle = "cadastral" | "google-satellite" | "google-maps" | "topographic";

export interface MapLibreIndiaMapProps {
  currentTier: "country" | "state" | "district" | "tehsil";
  selectedState?: string;
  selectedDistrict?: string;
  selectedTehsil?: string;
  selectedYear?: number;
  selectedFeatureId?: string;
  activeLayers?: Record<string, boolean>;
  onSelectState: (stateName: string) => void;
  onSelectDistrict?: (districtName: string) => void;
  onSelectTehsil?: (tehsilName: string) => void;
  onSelectFeature?: (feature: CadastralFeature) => void;
  flyToLocation?: { center: [number, number]; zoom?: number } | null;
  className?: string;
}

// Initial center and zoom: India [Lat: 22.59, Lng: 78.96]
const INDIA_MAP_CENTER: [number, number] = [22.59, 78.96];
const INDIA_MAP_ZOOM = 5;

export function MapLibreIndiaMap({
  currentTier,
  selectedState = "India",
  selectedDistrict = "Sehore",
  selectedTehsil = "Ashta",
  selectedFeatureId,
  activeLayers = {},
  onSelectState,
  onSelectDistrict,
  onSelectTehsil,
  onSelectFeature,
  flyToLocation,
  className = "",
}: MapLibreIndiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);

  // GeoJSON Layer references
  const statesLayerRef = useRef<any>(null);
  const districtsLayerRef = useRef<any>(null);
  const tehsilsLayerRef = useRef<any>(null);
  const cadastreLayerRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(INDIA_MAP_ZOOM);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(INDIA_MAP_CENTER);
  const [activeStyle, setActiveStyle] = useState<BasemapStyle>("cadastral");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Initialize Leaflet Map with Google Maps & Esri Dark Support
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let map: any = null;

    async function initLeaflet() {
      try {
        const L = await import("leaflet");
        leafletRef.current = L;

        // Create Leaflet map instance
        map = L.map(mapContainerRef.current!, {
          center: INDIA_MAP_CENTER,
          zoom: INDIA_MAP_ZOOM,
          minZoom: 3,
          maxZoom: 19,
          zoomControl: false,
          attributionControl: false,
        });

        // 1. Setup Initial Base Tile Layer (Esri Dark Canvas: 100% Watermark-Free)
        const initialTileLayer = L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            attribution: "Esri World Dark Gray Canvas SDI",
            className: "esri-dark-tiles",
          }
        );
        initialTileLayer.addTo(map);
        currentTileLayerRef.current = initialTileLayer;

        // 2. Add India States GeoJSON Layer
        const statesData = AdministrativeBoundaryProvider.getStates();
        const statesLayer = L.geoJSON(statesData as any, {
          style: (feature) => {
            const isSelected =
              feature?.properties?.name?.toLowerCase() === selectedState?.toLowerCase();
            return {
              fillColor: isSelected ? "#3b82f6" : "#0b1c38",
              fillOpacity: isSelected ? 0.35 : 0.15,
              color: isSelected ? "#60a5fa" : "#3b82f6",
              weight: isSelected ? 2.5 : 1.2,
              opacity: 0.85,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "State";
            layer.bindTooltip(name, {
              permanent: false,
              direction: "center",
              className: "bg-[#060e1a] text-white border border-[#3b82f6]/40 px-2 py-1 rounded text-xs font-mono shadow-xl",
            });

            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  fillColor: "#38bdf8",
                  fillOpacity: 0.35,
                  weight: 2,
                });
                setHoveredRegion(name);
              },
              mouseout: (e) => {
                statesLayer.resetStyle(e.target);
                setHoveredRegion(null);
              },
              click: () => {
                onSelectState(name);
              },
            });
          },
        }).addTo(map);
        statesLayerRef.current = statesLayer;

        // 3. Add Districts GeoJSON Layer
        const districtsData = AdministrativeBoundaryProvider.getDistricts(selectedState);
        const districtsLayer = L.geoJSON(districtsData as any, {
          style: (feature) => {
            const isSelected =
              feature?.properties?.name?.toLowerCase() === selectedDistrict?.toLowerCase();
            return {
              fillColor: isSelected ? "#38bdf8" : "#081b36",
              fillOpacity: isSelected ? 0.3 : 0.1,
              color: isSelected ? "#38bdf8" : "#60a5fa",
              weight: isSelected ? 2.2 : 1.2,
              dashArray: "4, 3",
              opacity: 0.8,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "District";
            layer.bindTooltip(name, {
              permanent: false,
              direction: "center",
              className: "bg-[#060e1a] text-white border border-[#38bdf8]/40 px-2 py-1 rounded text-xs font-mono shadow-xl",
            });
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({ fillColor: "#60a5fa", fillOpacity: 0.35 });
                setHoveredRegion(name);
              },
              mouseout: (e) => {
                districtsLayer.resetStyle(e.target);
                setHoveredRegion(null);
              },
              click: () => {
                if (onSelectDistrict) onSelectDistrict(name);
              },
            });
          },
        });
        districtsLayerRef.current = districtsLayer;

        // 4. Add Tehsils GeoJSON Layer
        const tehsilsData = AdministrativeBoundaryProvider.getTehsils(selectedDistrict);
        const tehsilsLayer = L.geoJSON(tehsilsData as any, {
          style: (feature) => {
            const isSelected =
              feature?.properties?.name?.toLowerCase() === selectedTehsil?.toLowerCase();
            return {
              fillColor: isSelected ? "#f59e0b" : "#1a2a47",
              fillOpacity: isSelected ? 0.35 : 0.12,
              color: isSelected ? "#fbbf24" : "#f59e0b",
              weight: isSelected ? 2.4 : 1.4,
              opacity: 0.9,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "Tehsil";
            layer.bindTooltip(name, {
              permanent: false,
              direction: "center",
              className: "bg-[#060e1a] text-[#fbbf24] border border-[#f59e0b]/40 px-2 py-1 rounded text-xs font-mono shadow-xl",
            });
            layer.on({
              click: () => {
                if (onSelectTehsil) onSelectTehsil(name);
              },
            });
          },
        });
        tehsilsLayerRef.current = tehsilsLayer;

        // 5. Add Ashta Cadastral Parcels Layer (High-Resolution Zoom)
        const cadastreData = getAshtaCadastralGeoJson();
        const cadastreLayer = L.geoJSON(cadastreData as any, {
          style: (feature) => {
            const p = feature?.properties;
            const isSelected =
              p?.khasraNo === selectedFeatureId || p?.id === selectedFeatureId;
            let fill = "#10b981"; // Clear
            if (p?.disputeStatus === "Under Conciliation") fill = "#ef4444";
            else if (p?.disputeStatus === "Gram Sabha Review") fill = "#f59e0b";

            return {
              fillColor: fill,
              fillOpacity: isSelected ? 0.65 : 0.35,
              color: isSelected ? "#f59e0b" : "#047857",
              weight: isSelected ? 3 : 1.4,
              opacity: 0.95,
            };
          },
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            layer.bindTooltip(`Khasra #${p.khasraNo} • ${p.ownerName} (${p.areaHa} Ha)`, {
              permanent: false,
              direction: "top",
              className: "bg-[#060e1a] text-white border border-[#3b82f6]/40 px-2.5 py-1 rounded text-xs font-mono shadow-2xl",
            });
            layer.on({
              click: () => {
                if (onSelectFeature) {
                  onSelectFeature({
                    id: p.id,
                    khasraNo: p.khasraNo,
                    ownerName: p.ownerName,
                    areaHa: parseFloat(p.areaHa),
                    areaBigha: parseFloat(p.areaBigha),
                    tenureType: p.tenureType,
                    landClassification: p.landClassification,
                    disputeStatus: p.disputeStatus,
                    points: "",
                    centroid: { x: 400, y: 250 },
                  });
                }
              },
            });
          },
        });
        cadastreLayerRef.current = cadastreLayer;

        // Dynamic layer display based on zoom level
        const updateLayersByZoom = () => {
          const z = map.getZoom();
          setCurrentZoom(Math.round(z * 10) / 10);

          if (z >= 11) {
            if (!map.hasLayer(cadastreLayer)) map.addLayer(cadastreLayer);
          } else {
            if (map.hasLayer(cadastreLayer)) map.removeLayer(cadastreLayer);
          }

          if (z >= 8.5) {
            if (!map.hasLayer(tehsilsLayer)) map.addLayer(tehsilsLayer);
          } else {
            if (map.hasLayer(tehsilsLayer)) map.removeLayer(tehsilsLayer);
          }

          if (z >= 6) {
            if (!map.hasLayer(districtsLayer)) map.addLayer(districtsLayer);
          } else {
            if (map.hasLayer(districtsLayer)) map.removeLayer(districtsLayer);
          }
        };

        map.on("zoomend", updateLayersByZoom);
        map.on("move", () => {
          const center = map.getCenter();
          setCurrentCenter([
            Math.round(center.lat * 100) / 100,
            Math.round(center.lng * 100) / 100,
          ]);
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
        updateLayersByZoom();
      } catch (err) {
        console.error("Failed to initialize Leaflet Map:", err);
      }
    }

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update District and Tehsil GeoJSON when selection changes
  useEffect(() => {
    const L = leafletRef.current;
    if (!L || !mapLoaded) return;

    if (districtsLayerRef.current) {
      const districtsData = AdministrativeBoundaryProvider.getDistricts(selectedState);
      districtsLayerRef.current.clearLayers();
      districtsLayerRef.current.addData(districtsData as any);
    }

    if (tehsilsLayerRef.current) {
      const tehsilsData = AdministrativeBoundaryProvider.getTehsils(selectedDistrict);
      tehsilsLayerRef.current.clearLayers();
      tehsilsLayerRef.current.addData(tehsilsData as any);
    }
  }, [selectedState, selectedDistrict, mapLoaded]);

  // Handle Basemap Switcher (Google Satellite, Google Maps, Esri Dark, Topographic)
  const handleStyleChange = (style: BasemapStyle) => {
    setActiveStyle(style);
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Remove previous tile layer
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    let newTileLayer: any;

    if (style === "google-satellite") {
      // Google Maps Hybrid Satellite (Satellite imagery + Roads & Labels)
      newTileLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          subdomains: ["0", "1", "2", "3"],
          maxZoom: 20,
          attribution: "© Google Maps Satellite Imagery",
        }
      );
    } else if (style === "google-maps") {
      // Google Maps Standard / Road View
      newTileLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          subdomains: ["0", "1", "2", "3"],
          maxZoom: 20,
          attribution: "© Google Maps",
        }
      );
    } else if (style === "topographic") {
      // OpenTopoMap / World Topographic
      newTileLayer = L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Tiles © Esri Topographic",
        }
      );
    } else {
      // Default: Esri World Dark Gray Canvas (Sovereign Command Obsidian, 100% Watermark-Free)
      newTileLayer = L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Tiles © Esri World Dark Gray Canvas",
        }
      );
    }

    newTileLayer.addTo(map);
    currentTileLayerRef.current = newTileLayer;

    // Send tile layer to back so vector GeoJSON stays cleanly on top
    newTileLayer.bringToBack();
  };

  // Fly to location when requested via geocoder or prop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !flyToLocation) return;
    map.flyTo([flyToLocation.center[1], flyToLocation.center[0]], flyToLocation.zoom || 11, {
      duration: 1.4,
    });
  }, [flyToLocation, mapLoaded]);

  // Navigate map when currentTier or selections change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    if (currentTier === "country" || selectedState === "India") {
      map.flyTo(INDIA_MAP_CENTER, INDIA_MAP_ZOOM, { duration: 1.2 });
    } else if (currentTier === "state") {
      const stateObj = INDIA_STATES_DATA.find(
        (s) => s.name.toLowerCase() === selectedState.toLowerCase()
      );
      if (stateObj) {
        map.flyTo([stateObj.coordinates[1], stateObj.coordinates[0]], 7, { duration: 1.2 });
      }
    } else if (currentTier === "district") {
      if (selectedDistrict.toLowerCase() === "sehore") {
        map.flyTo([23.2048, 77.0841], 10, { duration: 1.2 });
      } else if (selectedDistrict.toLowerCase() === "pune") {
        map.flyTo([18.5204, 73.8567], 10, { duration: 1.2 });
      }
    } else if (currentTier === "tehsil") {
      if (selectedTehsil.toLowerCase() === "ashta") {
        map.flyTo([23.0232, 76.7214], 13.5, { duration: 1.2 });
      }
    }
  }, [currentTier, selectedState, selectedDistrict, selectedTehsil, mapLoaded]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetIndia = () => {
    onSelectState("India");
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(INDIA_MAP_CENTER, INDIA_MAP_ZOOM, { duration: 1.2 });
    }
  };

  const handleLocateCurrent = () => {
    if (!mapInstanceRef.current) return;
    if (currentTier === "tehsil") {
      mapInstanceRef.current.flyTo([23.0232, 76.7214], 13.5, { duration: 1.2 });
    } else if (currentTier === "district") {
      mapInstanceRef.current.flyTo([23.2048, 77.0841], 10, { duration: 1.2 });
    } else if (currentTier === "state") {
      mapInstanceRef.current.flyTo([23.2599, 77.4126], 7, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo(INDIA_MAP_CENTER, INDIA_MAP_ZOOM, { duration: 1.2 });
    }
  };

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full h-[580px] bg-[#060e1a] rounded-xl border border-[#3b82f6]/20 overflow-hidden shadow-2xl flex select-none ${className}`}
    >
      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Header: Live Coordinates & Current Geographic Context */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="bg-[#060e1a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#3b82f6]/25 text-[11px] font-mono flex items-center gap-2.5 text-[#f8fafc] shadow-xl">
          <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="font-bold text-white">
            {currentTier === "country"
              ? "India (National Command)"
              : `${selectedTehsil || ""}, ${selectedDistrict || ""}, ${selectedState || ""}`}
          </span>
          <span className="text-[#3b82f6]/40">|</span>
          <span className="text-[#94a3b8]">
            Z: {currentZoom} ({currentCenter[0].toFixed(2)}°N, {currentCenter[1].toFixed(2)}°E)
          </span>
        </div>

        {hoveredRegion && (
          <div className="bg-[#0b1c38]/95 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-xl border border-[#3b82f6]/40 animate-in fade-in">
            {hoveredRegion}
          </div>
        )}
      </div>

      {/* Floating Basemap Style Switcher (Top Right: Google Maps + Esri Dark + Topo) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#060e1a]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#3b82f6]/25 shadow-xl pointer-events-auto">
        <button
          type="button"
          onClick={() => handleStyleChange("cadastral")}
          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
            activeStyle === "cadastral"
              ? "bg-[#3b82f6] text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#0b1c38]/50"
          }`}
          title="Esri Sovereign Dark Canvas (Watermark-Free)"
        >
          Dark Cadastral
        </button>

        <button
          type="button"
          onClick={() => handleStyleChange("google-satellite")}
          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
            activeStyle === "google-satellite"
              ? "bg-[#3b82f6] text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#0b1c38]/50"
          }`}
          title="Google Maps Hybrid Satellite (High-Res)"
        >
          Google Satellite
        </button>

        <button
          type="button"
          onClick={() => handleStyleChange("google-maps")}
          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
            activeStyle === "google-maps"
              ? "bg-[#3b82f6] text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#0b1c38]/50"
          }`}
          title="Google Maps Roads & Topography"
        >
          Google Maps
        </button>

        <button
          type="button"
          onClick={() => handleStyleChange("topographic")}
          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
            activeStyle === "topographic"
              ? "bg-[#3b82f6] text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#0b1c38]/50"
          }`}
          title="Topographic Elevation Relief"
        >
          Topographic
        </button>
      </div>

      {/* Floating Vertical Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-[#060e1a]/90 backdrop-blur-md rounded-xl border border-[#3b82f6]/25 shadow-2xl flex flex-col divide-y divide-[#3b82f6]/10 overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-[#94a3b8] hover:bg-[#0b1c38] hover:text-white transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-[#94a3b8] hover:bg-[#0b1c38] hover:text-white transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetIndia}
            className="p-2.5 text-[#94a3b8] hover:bg-[#0b1c38] hover:text-white transition-colors"
            title="Reset View to India"
            aria-label="Reset to India"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLocateCurrent}
            className="p-2.5 text-[#94a3b8] hover:bg-[#0b1c38] hover:text-white transition-colors"
            title="Locate Selected Geography"
            aria-label="Locate Geography"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2.5 text-[#94a3b8] hover:bg-[#0b1c38] hover:text-white transition-colors"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Zoom-Tier Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="bg-[#060e1a]/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-mono border border-[#3b82f6]/30 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
          <span className="font-bold text-[#60a5fa]">Tier: {currentTier.toUpperCase()}</span>
          <span className="text-[#3b82f6]/40">•</span>
          <span>
            {currentZoom < 6
              ? "National State Boundaries"
              : currentZoom < 8.5
              ? "District Boundaries"
              : currentZoom < 11
              ? "Tehsil Boundaries"
              : "Cadastral Demonstration Mesh"}
          </span>
          <span className="text-[#3b82f6]/40">•</span>
          <span className="text-[#38bdf8] font-bold flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#38bdf8]" />
            {activeStyle === "google-satellite"
              ? "Google Hybrid Satellite Active"
              : activeStyle === "google-maps"
              ? "Google Maps Active"
              : activeStyle === "topographic"
              ? "Topographic Relief Active"
              : "Esri Dark Canvas Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
