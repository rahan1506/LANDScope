"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Layers,
  Search,
  Filter,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scale,
  Building,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronDown,
  Globe,
  Navigation,
  Crosshair,
  ExternalLink,
  X,
  Loader2,
  BookOpen,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidePanel } from "@/components/ui/side-panel";
import { TimelineControls } from "@/components/ui/timeline-controls";
import { PageHeader } from "@/components/ui/page-header";
import {
  GEOGRAPHIC_HIERARCHY,
  GIS_LAYERS_REGISTRY,
  GisLayerDefinition,
  GeoIntelligenceData,
  EvidenceTrail,
  getIntelligenceForGeography,
  getRelatedEvidenceForGeography,
  getAvailableLayersForRole,
} from "@/lib/gis/gis-data";
import {
  EvidenceItem,
  ResearchProject,
  INITIAL_RESEARCH_PROJECTS,
} from "@/lib/research/research-data";
import { GisIntelligencePanel } from "./gis-intelligence-panel";
import { EvidenceTrailModal } from "./evidence-trail-modal";
import { EvidenceDetailModal } from "@/components/researcher/evidence-detail-modal";
import { AddToProjectModal } from "@/components/researcher/add-to-project-modal";
import { MapLibreIndiaMap } from "./maplibre-india-map";
import {
  ALL_SEARCHABLE_LOCATIONS,
  GeoLocationItem,
  INDIA_CENTER,
  INDIA_DEFAULT_ZOOM,
  INDIA_STATES_DATA,
} from "@/lib/gis/india-geo-data";

import {
  SelectedGeography,
  DEFAULT_SELECTED_GEOGRAPHY,
  formatGeographyLabel,
} from "@/lib/gis/selected-geography";

export interface GisWorkstationViewProps {
  initialState?: string;
  initialDistrict?: string;
  initialTehsil?: string;
  userRole?: string;
  onNavigateToPolicyLab?: (context: {
    state: string;
    district: string;
    tehsil: string;
    year: number;
    builtUpPct: number;
    agriculturePct: number;
  }) => void;
  onNavigateToReports?: (context: {
    state: string;
    district: string;
    tehsil: string;
  }) => void;
  onNavigateToResearch?: (context?: SelectedGeography) => void;
  onNavigateToAnalytics?: (context?: SelectedGeography) => void;
}

export interface CadastralFeature {
  id: string;
  khasraNo: string;
  ownerName: string;
  areaHa: number;
  areaBigha: number;
  tenureType: string;
  landClassification: string;
  disputeStatus: "Clear" | "Under Conciliation" | "Gram Sabha Review";
  points: string;
  centroid: { x: number; y: number };
}

export function GisWorkstationView({
  initialState = "Madhya Pradesh",
  initialDistrict = "Sehore",
  initialTehsil = "Ashta",
  userRole = "RESEARCHER",
  onNavigateToPolicyLab,
  onNavigateToReports,
  onNavigateToResearch,
  onNavigateToAnalytics,
}: GisWorkstationViewProps) {
  // Centralized Selected Geography State (Issue 2 requirement)
  const [selectedGeography, setSelectedGeography] = useState<SelectedGeography>(() => ({
    country: "India",
    state: initialState,
    district: initialDistrict,
    tehsil: initialTehsil,
    latitude: 23.0232,
    longitude: 76.7214,
    source: "PRESET",
    featureType: "tehsil",
    placeName: initialTehsil,
    displayName: `${initialTehsil}, ${initialDistrict}, ${initialState}, India`,
  }));

  // Region Inspector Open/Close
  const [isRegionInspectorOpen, setIsRegionInspectorOpen] = useState(false);

  // Search status states
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Tier Navigation (Country -> State -> District -> Tehsil)
  const [currentTier, setCurrentTier] = useState<"country" | "state" | "district" | "tehsil">("country");
  const [activeMapMode, setActiveMapMode] = useState<"real-map" | "cadastral-inspector">("real-map");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Geographic Selectors State
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedTehsil, setSelectedTehsil] = useState<string>(initialTehsil);

  // Time Series Year (2018 - 2026)
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Basemap & Zoom State
  const [basemap, setBasemap] = useState<"cadastral" | "satellite" | "topographic">("cadastral");
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Visibility State (filtered by role)
  const availableLayers = getAvailableLayersForRole(userRole);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    GIS_LAYERS_REGISTRY.forEach((l) => {
      init[l.id] = l.defaultVisible;
    });
    return init;
  });

  // Selected Spatial Feature State (Parcel Inspector)
  const [selectedFeature, setSelectedFeature] = useState<CadastralFeature | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [searchKhasra, setSearchKhasra] = useState("");

  // Modals State
  const [activeEvidenceTrail, setActiveEvidenceTrail] = useState<EvidenceTrail | null>(null);
  const [activeEvidenceDetail, setActiveEvidenceDetail] = useState<EvidenceItem | null>(null);
  const [activeEvidenceForAdd, setActiveEvidenceForAdd] = useState<EvidenceItem | null>(null);
  const [projects] = useState<ResearchProject[]>(INITIAL_RESEARCH_PROJECTS);

  // Dynamic Intelligence Data
  const intelligence = getIntelligenceForGeography(selectedState, selectedDistrict, selectedTehsil, selectedYear);
  const relatedEvidence = getRelatedEvidenceForGeography(selectedState, selectedDistrict);

  // Available districts for chosen state
  const currentStateObj = GEOGRAPHIC_HIERARCHY.find((s) => s.name === selectedState) || GEOGRAPHIC_HIERARCHY[0];
  const currentDistrictObj =
    currentStateObj.districts.find((d) => d.name === selectedDistrict) || currentStateObj.districts[0];
  const availableTehsils = currentDistrictObj.tehsils;

  // Sync state if initial props change
  const [prevGeoProps, setPrevGeoProps] = useState({ initialState, initialDistrict, initialTehsil });
  if (
    initialState !== prevGeoProps.initialState ||
    initialDistrict !== prevGeoProps.initialDistrict ||
    initialTehsil !== prevGeoProps.initialTehsil
  ) {
    setPrevGeoProps({ initialState, initialDistrict, initialTehsil });
    if (initialState) setSelectedState(initialState);
    if (initialDistrict) setSelectedDistrict(initialDistrict);
    if (initialTehsil) setSelectedTehsil(initialTehsil);
  }

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentTier("state");
    const sObj = GEOGRAPHIC_HIERARCHY.find((s) => s.name === stateName);
    const dName = sObj && sObj.districts.length > 0 ? sObj.districts[0].name : "District";
    const tName = sObj && sObj.districts.length > 0 && sObj.districts[0].tehsils[0] ? sObj.districts[0].tehsils[0] : "Main";
    if (sObj && sObj.districts.length > 0) {
      setSelectedDistrict(dName);
      setSelectedTehsil(tName);
    }
    setSelectedGeography({
      country: "India",
      state: stateName,
      district: dName,
      tehsil: tName,
      source: "GIS",
      featureType: "state",
      placeName: stateName,
      displayName: `${stateName}, India`,
    });
    setIsRegionInspectorOpen(true);
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    setCurrentTier("district");
    const dObj = currentStateObj.districts.find((d) => d.name === distName);
    const tName = dObj && dObj.tehsils.length > 0 ? dObj.tehsils[0] : selectedTehsil;
    if (dObj && dObj.tehsils.length > 0) {
      setSelectedTehsil(tName);
    }
    setSelectedGeography({
      country: "India",
      state: selectedState,
      district: distName,
      tehsil: tName,
      source: "GIS",
      featureType: "district",
      placeName: distName,
      displayName: `${distName}, ${selectedState}, India`,
    });
    setIsRegionInspectorOpen(true);
  };

  const handleTehsilChange = (tehsilName: string) => {
    setSelectedTehsil(tehsilName);
    setCurrentTier("tehsil");
    setSelectedGeography({
      country: "India",
      state: selectedState,
      district: selectedDistrict,
      tehsil: tehsilName,
      source: "GIS",
      featureType: "tehsil",
      placeName: tehsilName,
      displayName: `${tehsilName}, ${selectedDistrict}, ${selectedState}, India`,
    });
    setIsRegionInspectorOpen(true);
  };

  const handleSelectStateOnMap = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentTier("state");
    const sObj = GEOGRAPHIC_HIERARCHY.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
    const dName = sObj && sObj.districts.length > 0 ? sObj.districts[0].name : "District";
    const tName = sObj && sObj.districts[0]?.tehsils.length > 0 ? sObj.districts[0].tehsils[0] : "Main";
    if (sObj && sObj.districts.length > 0) {
      setSelectedDistrict(dName);
      setSelectedTehsil(tName);
    }
    setSelectedGeography({
      country: "India",
      state: stateName,
      district: dName,
      tehsil: tName,
      source: "MAP_CLICK",
      featureType: "state",
      placeName: stateName,
      displayName: `${stateName}, India`,
    });
    setIsRegionInspectorOpen(true);
  };

  const handleJumpToDemo = () => {
    setSelectedState("Madhya Pradesh");
    setSelectedDistrict("Sehore");
    setSelectedTehsil("Ashta");
    setCurrentTier("tehsil");
    setSelectedGeography({
      country: "India",
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
      latitude: 23.0232,
      longitude: 76.7214,
      source: "PRESET",
      featureType: "tehsil",
      placeName: "Ashta",
      displayName: "Ashta, Sehore, Madhya Pradesh, India",
    });
    setFlyToLocation({
      center: [76.7214, 23.0232],
      zoom: 12.5,
    });
    setIsRegionInspectorOpen(true);
  };

  const [mapTilerResults, setMapTilerResults] = useState<GeoLocationItem[]>([]);
  const [flyToLocation, setFlyToLocation] = useState<{ center: [number, number]; zoom?: number } | null>(null);

  // MapTiler Live Geocoding for India Locations & Search (Issue 1)
  useEffect(() => {
    const q = locationSearchQuery.trim();
    const mapTilerKey = (process.env.NEXT_PUBLIC_MAPTILER_KEY || "").trim();

    const timer = setTimeout(async () => {
      if (!q || q.length < 2) {
        setMapTilerResults([]);
        setIsSearching(false);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        if (!mapTilerKey || mapTilerKey === "YOUR_MAPTILER_KEY_HERE") {
          setIsSearching(false);
          return;
        }

        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${mapTilerKey}&country=in&limit=8`
        );
        if (!res.ok) {
          throw new Error(`Geocoding HTTP error ${res.status}`);
        }
        interface MtContext {
          id?: string;
          text?: string;
        }
        interface MtFeature {
          id: string;
          text?: string;
          place_name?: string;
          place_type?: string[];
          center?: [number, number];
          bbox?: [number, number, number, number];
          context?: MtContext[];
        }
        const data = (await res.json()) as { features?: MtFeature[] };
        if (data.features && Array.isArray(data.features)) {
          const items: GeoLocationItem[] = data.features.map((feat: MtFeature) => {
            const context = feat.context || [];
            const stateCtx = context.find((c: MtContext) => c.id?.startsWith("region"));
            const distCtx = context.find(
              (c: MtContext) =>
                c.id?.startsWith("district") ||
                c.id?.startsWith("subregion") ||
                c.id?.startsWith("county")
            );

            const isState = feat.place_type?.includes("region");
            const isDistrict =
              feat.place_type?.includes("district") ||
              feat.place_type?.includes("county") ||
              feat.place_type?.includes("subregion");
            const isTehsil =
              feat.place_type?.includes("municipality") ||
              feat.place_type?.includes("locality") ||
              feat.place_type?.includes("subdistrict");

            const determinedType: "country" | "state" | "district" | "tehsil" | "city" = isState
              ? "state"
              : isDistrict
              ? "district"
              : isTehsil
              ? "tehsil"
              : "city";

            const zoomLevel = isState ? 6.5 : isDistrict ? 9.5 : isTehsil ? 11.5 : 12;

            return {
              id: `maptiler-${feat.id}`,
              name: feat.text || (feat.place_name ? feat.place_name.split(",")[0] : q),
              type: determinedType,
              parentName: feat.place_name,
              stateName: stateCtx?.text,
              districtName: distCtx?.text,
              coordinates: (feat.center || [78.96, 22.59]) as [number, number],
              zoom: zoomLevel,
            };
          });
          setMapTilerResults(items);
        } else {
          setMapTilerResults([]);
        }
      } catch (err: unknown) {
        console.warn("MapTiler geocoding request failed:", err);
        setSearchError("Unable to reach geocoding service. Showing local indexes.");
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [locationSearchQuery]);

  const localMatches = locationSearchQuery.trim()
    ? ALL_SEARCHABLE_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
          (l.stateName && l.stateName.toLowerCase().includes(locationSearchQuery.toLowerCase())) ||
          (l.districtName && l.districtName.toLowerCase().includes(locationSearchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Combine MapTiler live results prioritized first for arbitrary searches, deduplicated with local demo presets
  const filteredLocations = [
    ...mapTilerResults,
    ...localMatches.filter(
      (lm) => !mapTilerResults.some((mt) => mt.name.toLowerCase() === lm.name.toLowerCase())
    ),
  ].slice(0, 8);

  const handleSelectSearchLocation = (item: GeoLocationItem) => {
    // 1. Move Map with flyToLocation & appropriate zoom based on result type
    if (item.coordinates) {
      setFlyToLocation({
        center: item.coordinates,
        zoom: item.zoom || 11,
      });
    }

    // 2. Synchronize selectedGeography state, breadcrumbs, and hierarchy
    let stateName = item.stateName || selectedState;
    let districtName = item.districtName || selectedDistrict;
    let tehsilName = selectedTehsil;
    let tier: "country" | "state" | "district" | "tehsil" = "district";

    if (item.type === "country") {
      tier = "country";
    } else if (item.type === "state") {
      stateName = item.name;
      tier = "state";
      setSelectedState(stateName);
      const sObj = GEOGRAPHIC_HIERARCHY.find((s) => s.name.toLowerCase() === item.name.toLowerCase());
      if (sObj && sObj.districts.length > 0) {
        districtName = sObj.districts[0].name;
        tehsilName = sObj.districts[0].tehsils[0] || "Main";
        setSelectedDistrict(districtName);
        setSelectedTehsil(tehsilName);
      }
    } else if (item.type === "district") {
      districtName = item.name;
      tier = "district";
      if (item.stateName) {
        stateName = item.stateName;
        setSelectedState(stateName);
      }
      setSelectedDistrict(districtName);
      const sObj = GEOGRAPHIC_HIERARCHY.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      const dObj = sObj?.districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
      if (dObj && dObj.tehsils.length > 0) {
        tehsilName = dObj.tehsils[0];
        setSelectedTehsil(tehsilName);
      }
    } else if (item.type === "tehsil") {
      tehsilName = item.name;
      tier = "tehsil";
      if (item.stateName) {
        stateName = item.stateName;
        setSelectedState(stateName);
      }
      if (item.districtName) {
        districtName = item.districtName;
        setSelectedDistrict(districtName);
      }
      setSelectedTehsil(tehsilName);
    } else {
      // City or general geographic point
      tier = "district";
      if (item.stateName) {
        stateName = item.stateName;
        setSelectedState(stateName);
      }
      if (item.districtName) {
        districtName = item.districtName;
        setSelectedDistrict(districtName);
      }
    }

    setCurrentTier(tier);

    // 3. Centralized selectedGeography update
    setSelectedGeography({
      country: "India",
      state: stateName,
      district: districtName,
      tehsil: tehsilName,
      latitude: item.coordinates?.[1],
      longitude: item.coordinates?.[0],
      source: "SEARCH",
      featureType: item.type === "city" ? "locality" : item.type,
      placeName: item.name,
      displayName: item.parentName || `${item.name}, ${districtName}, ${stateName}, India`,
    });

    // 4. Open Region Inspector automatically
    setIsRegionInspectorOpen(true);

    setLocationSearchQuery("");
    setIsSearchOpen(false);
  };

  const toggleLayer = (layerId: string) => {
    setLayerVisibility((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  // Cadastral Feature Polygons (Interactive Vector GeoJSON/SVG features)
  const baseParcels: CadastralFeature[] = [
    {
      id: "P-401",
      khasraNo: "401/1",
      ownerName: "Radheshyam Patidar",
      areaHa: 3.42,
      areaBigha: 13.68,
      tenureType: "Bhumiswami (Freehold Agricultural)",
      landClassification: "Double-Cropped Alluvial Loam",
      disputeStatus: "Clear",
      points: "120,80 280,60 310,190 140,210",
      centroid: { x: 210, y: 135 },
    },
    {
      id: "P-402",
      khasraNo: "402/A",
      ownerName: "Devi Singh Meena & Gram Sabha",
      areaHa: 4.15,
      areaBigha: 16.6,
      tenureType: "Gram Sabha Commons (Gauchar / Grazing)",
      landClassification: "Community Pasture Buffer",
      disputeStatus: "Gram Sabha Review",
      points: "290,180 430,160 480,290 320,310",
      centroid: { x: 380, y: 235 },
    },
    {
      id: "P-403",
      khasraNo: "403/2",
      ownerName: "Kailash Chand Jain",
      areaHa: 1.85,
      areaBigha: 7.4,
      tenureType: "Highway Commercial Frontage",
      landClassification: "Warehousing Diversion Requested",
      disputeStatus: "Under Conciliation",
      points: "430,160 560,140 590,240 480,260",
      centroid: { x: 515, y: 200 },
    },
    {
      id: "P-404",
      khasraNo: "404/FR",
      ownerName: "State Forest Department (Buffer Zone)",
      areaHa: 8.6,
      areaBigha: 34.4,
      tenureType: "Statutory Reserved Forest Buffer",
      landClassification: "Eco-Sensitive Corridor (750m)",
      disputeStatus: "Clear",
      points: "90,340 140,210 320,310 270,440",
      centroid: { x: 205, y: 325 },
    },
    {
      id: "P-405",
      khasraNo: "405/B",
      ownerName: "Bhopal Logistics Infrastructure SPV",
      areaHa: 5.2,
      areaBigha: 20.8,
      tenureType: "Industrial Land Bank (Master Plan 2031)",
      landClassification: "Commercial Industrial Allotment",
      disputeStatus: "Clear",
      points: "560,140 720,110 750,220 590,240",
      centroid: { x: 655, y: 175 },
    },
  ];

  const filteredParcels = baseParcels.filter((p) => {
    if (!searchKhasra) return true;
    return (
      p.khasraNo.toLowerCase().includes(searchKhasra.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchKhasra.toLowerCase())
    );
  });

  const handleSelectFeature = (parcel: CadastralFeature) => {
    setSelectedFeature(parcel);
    setSelectedGeography({
      country: "India",
      state: selectedState,
      district: selectedDistrict,
      tehsil: selectedTehsil,
      source: "MAP_CLICK",
      featureType: "parcel",
      parcelId: parcel.khasraNo,
      placeName: `Khasra ${parcel.khasraNo}`,
      displayName: `Khasra ${parcel.khasraNo}, ${selectedTehsil}, ${selectedDistrict}, ${selectedState}`,
    });
    setIsInspectorOpen(true);
  };

  // Pan interaction handlers for real map behavior
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Group layers by category
  const layerGroups = ["LAND USE", "ENVIRONMENT", "INFRASTRUCTURE", "GOVERNANCE"] as const;

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12 select-none">
      {/* 1. Page Header with Title, Context, and Primary Action */}
      <PageHeader
        title="Land Intelligence"
        description="Explore land-use patterns, spatial trends, environmental risks and governance signals across multi-temporal satellite layers."
        badge={{ text: "LANDScope National Land Intelligence", variant: "navy" }}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPanOffset({ x: 0, y: 0 });
                setZoomLevel(14);
              }}
            >
              Recenter Map
            </Button>
            {onNavigateToPolicyLab && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onNavigateToPolicyLab({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    year: selectedYear,
                    builtUpPct: intelligence.landUse.builtUpPct,
                    agriculturePct: intelligence.landUse.agriculturePct,
                  });
                }}
                leftIcon={<Scale className="w-3.5 h-3.5" />}
              >
                Test in Policy Twin
              </Button>
            )}
          </div>
        }
      />

      {/* Geographic Selector Bar */}
      <div className="glass-panel-primary border border-emerald-500/20 rounded-sm p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            LOCATION:
          </span>
          <div className="flex items-center gap-1.5 bg-[#060e1a]/90 border border-emerald-500/20 rounded px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 font-mono">Country:</span>
            <strong className="text-slate-200 font-semibold">India</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-[#060e1a]/90 border border-emerald-500/20 rounded px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 font-mono">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              {GEOGRAPHIC_HIERARCHY.map((st) => (
                <option key={st.id} value={st.name} className="bg-[#060e1a] text-slate-200">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#060e1a]/90 border border-emerald-500/20 rounded px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 font-mono">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              {currentStateObj.districts.map((d) => (
                <option key={d.id} value={d.name} className="bg-[#060e1a] text-slate-200">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#060e1a]/90 border border-emerald-500/20 rounded px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 font-mono">Tehsil:</span>
            <select
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
              className="bg-transparent font-medium text-emerald-300 focus:outline-none cursor-pointer"
            >
              {availableTehsils.map((t) => (
                <option key={t} value={t} className="bg-[#060e1a] text-slate-200">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold tracking-wider">
            DEMO CADASTRE SYNC
          </span>
        </div>
      </div>

      {/* 2. Three-Column Layout: LAYERS (Left) | MAP (Center) | LAND INTEL (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* COLUMN 1: LAYERS PANEL (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="glass-panel-primary border border-emerald-500/20 rounded-sm p-3.5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-mono">
                  Thematic Layers
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono">ACTIVE</span>
            </div>

            <div className="space-y-3 text-xs">
              {layerGroups.map((group) => {
                const groupLayers = availableLayers.filter((l) => l.category === group);
                return (
                  <div key={group} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block font-mono">
                      {group}
                    </span>
                    <div className="space-y-1">
                      {groupLayers.map((layer) => {
                        const isVisible = !!layerVisibility[layer.id];
                        return (
                          <button
                            key={layer.id}
                            type="button"
                            onClick={() => toggleLayer(layer.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-sm border text-left transition-all ${
                              isVisible
                                ? "bg-[#0d1f1a] border-emerald-500/35 text-slate-100 font-medium shadow-xs"
                                : "bg-[#060e1a]/60 border-emerald-500/10 text-slate-400 hover:border-emerald-500/25 hover:text-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                style={{ backgroundColor: layer.color }}
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              />
                              <span className="text-[11px] truncate">{layer.name}</span>
                            </div>
                            {isVisible ? (
                              <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: PRIMARY MAP CANVAS (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Top Bar with Mode Switcher & Quick Navigation */}
          <div className="glass-panel-primary border border-emerald-500/20 rounded-sm p-3 shadow-lg space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#060e1a] p-1 rounded border border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setActiveMapMode("real-map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    activeMapMode === "real-map"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real Map of India</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapMode("cadastral-inspector")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    activeMapMode === "cadastral-inspector"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cadastral Inspector (Khasras)</span>
                </button>
              </div>

              {/* Fast Jump to Ashta Demo */}
              <button
                type="button"
                onClick={handleJumpToDemo}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1.5 rounded border border-amber-500/30 transition-colors shadow-xs"
              >
                <span>Ashta Cadastral Demo</span>
                <span>→</span>
              </button>
            </div>

            {/* Breadcrumb Hierarchy Nav & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-500/15">
              {/* Hierarchical Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-400/80 mr-0.5 font-mono">Tier:</span>
                <button
                  type="button"
                  onClick={() => setCurrentTier("country")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    currentTier === "country"
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold"
                      : "bg-[#060e1a] text-slate-400 hover:text-slate-200 border border-emerald-500/15"
                  }`}
                >
                  India
                </button>
                <span className="text-emerald-500/30 text-xs">/</span>
                <button
                  type="button"
                  onClick={() => setCurrentTier("state")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    currentTier === "state"
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold"
                      : "bg-[#060e1a] text-slate-400 hover:text-slate-200 border border-emerald-500/15"
                  }`}
                >
                  {selectedState}
                </button>
                <span className="text-emerald-500/30 text-xs">/</span>
                <button
                  type="button"
                  onClick={() => setCurrentTier("district")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    currentTier === "district"
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold"
                      : "bg-[#060e1a] text-slate-400 hover:text-slate-200 border border-emerald-500/15"
                  }`}
                >
                  {selectedDistrict}
                </button>
                <span className="text-emerald-500/30 text-xs">/</span>
                <button
                  type="button"
                  onClick={() => setCurrentTier("tehsil")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    currentTier === "tehsil"
                      ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold"
                      : "bg-[#060e1a] text-emerald-400/80 hover:text-emerald-300 border border-emerald-500/20"
                  }`}
                >
                  {selectedTehsil}
                </button>
              </div>

              {/* Autocomplete Search Bar (Real MapTiler Geocoding) */}
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationSearchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setLocationSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Search city, district, state, landmark..."
                  className="w-full h-8 pl-8 pr-12 text-xs bg-[#060e1a] border border-emerald-500/25 rounded-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  )}
                  {locationSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocationSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Dropdown search suggestions (Real Results, Loading, Error, Empty states) */}
                {isSearchOpen && locationSearchQuery.trim().length >= 2 && (
                  <div className="absolute top-9 left-0 right-0 z-50 glass-panel-floating border border-emerald-500/30 rounded-sm shadow-2xl max-h-64 overflow-y-auto divide-y divide-emerald-500/15 text-xs">
                    {isSearching && filteredLocations.length === 0 && (
                      <div className="p-3 text-center text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Searching MapTiler geocoder...</span>
                      </div>
                    )}

                    {searchError && (
                      <div className="p-2.5 bg-amber-950/30 text-amber-300 text-[11px] border-b border-amber-500/25 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{searchError}</span>
                      </div>
                    )}

                    {!isSearching && filteredLocations.length === 0 && (
                      <div className="p-3 text-center text-slate-400">
                        <div className="font-semibold text-slate-200">No matching locations found</div>
                        <div className="text-[11px] text-slate-500">Try searching another Indian city, district, or landmark</div>
                      </div>
                    )}

                    {filteredLocations.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchLocation(item)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-500/10 flex items-center justify-between transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <strong className="text-slate-100 group-hover:text-emerald-300 truncate">{item.name}</strong>
                          </div>
                          {item.parentName && (
                            <div className="text-[11px] text-slate-400 truncate ml-4">
                              {item.parentName}
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SELECTED REGION INDICATOR (Requirement 2.A) */}
            <div className="glass-panel-secondary border border-emerald-500/20 rounded-sm px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  ACTIVE REGION
                </span>
                <span className="font-bold text-slate-100">
                  {selectedGeography.placeName || selectedGeography.tehsil || selectedGeography.district || selectedGeography.state || "India"}
                </span>
                {selectedGeography.state && (
                  <span className="text-slate-400 text-xs">
                    • {selectedGeography.state}, {selectedGeography.country}
                  </span>
                )}
                <span className="text-[10px] font-mono text-emerald-400/80 bg-[#060e1a] border border-emerald-500/20 px-1.5 py-0.5 rounded capitalize">
                  {selectedGeography.featureType || "Region"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegionInspectorOpen(!isRegionInspectorOpen)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-[#060e1a] border border-emerald-500/20 hover:border-emerald-500/40 rounded transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRegionInspectorOpen ? "Hide Inspector" : "Region Inspector"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToResearch) {
                      onNavigateToResearch(selectedGeography);
                    }
                  }}
                  className="px-3 py-1 text-[11px] font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Research This Region</span>
                </button>
              </div>
            </div>

            {/* REGION INSPECTOR COMPACT PANEL (Requirement 2.B) */}
            {isRegionInspectorOpen && (
              <div className="glass-panel-floating border border-emerald-500/30 rounded-sm p-4 shadow-xl space-y-3">
                <div className="flex items-start justify-between border-b border-emerald-500/15 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                        REGION INSPECTOR
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold">
                        LANDScope Telemetry
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100 mt-0.5">
                      {selectedGeography.placeName || selectedGeography.district || selectedGeography.state}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {selectedGeography.state ? `${selectedGeography.state}, ` : ""}{selectedGeography.country} • Geography Tier: <strong className="capitalize text-emerald-300">{selectedGeography.featureType || currentTier}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRegionInspectorOpen(false)}
                    className="text-slate-400 hover:text-slate-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block font-mono">
                      Available Intelligence
                    </span>
                    <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside">
                      <li>Land use & multi-temporal canopy cover</li>
                      <li>Environment & groundwater recharge levels</li>
                      <li>Infrastructure corridors & logistics buffer</li>
                      <li>Governance & Gram Sabha boundary status</li>
                      <li>Research evidence & spatial citations</li>
                      <li>Policy scenarios & digital twin simulation</li>
                    </ul>
                  </div>

                  <div className="flex flex-col justify-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-3 border-emerald-500/15">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block font-mono">
                      Actions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          if (onNavigateToResearch) {
                            onNavigateToResearch(selectedGeography);
                          }
                        }}
                        leftIcon={<BookOpen className="w-3 h-3" />}
                      >
                        Research This Region
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          const panel = document.getElementById("gis-intelligence-panel-container");
                          panel?.scrollIntoView({ behavior: "smooth" });
                        }}
                        leftIcon={<Compass className="w-3 h-3 text-emerald-400" />}
                      >
                        View Land Intelligence
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          if (onNavigateToPolicyLab) {
                            onNavigateToPolicyLab({
                              state: selectedGeography.state || selectedState,
                              district: selectedGeography.district || selectedDistrict,
                              tehsil: selectedGeography.tehsil || selectedTehsil,
                              year: selectedYear,
                              builtUpPct: intelligence.landUse.builtUpPct,
                              agriculturePct: intelligence.landUse.agriculturePct,
                            });
                          }
                        }}
                        leftIcon={<Scale className="w-3 h-3 text-emerald-400" />}
                      >
                        Open Policy Digital Twin
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          if (onNavigateToAnalytics) {
                            onNavigateToAnalytics(selectedGeography);
                          }
                        }}
                        leftIcon={<TrendingUp className="w-3 h-3 text-emerald-400" />}
                      >
                        View Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          if (onNavigateToReports) {
                            onNavigateToReports({
                              state: selectedGeography.state || selectedState,
                              district: selectedGeography.district || selectedDistrict,
                              tehsil: selectedGeography.tehsil || selectedTehsil,
                            });
                          }
                        }}
                        leftIcon={<FileText className="w-3 h-3 text-emerald-400" />}
                      >
                        Generate Intelligence Brief
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GIS Map Canvas Container */}
          <div className="relative w-full rounded-sm border border-slate-300 overflow-hidden shadow-xs">
            {/* 1. Real Interactive Map of India (MapLibre GL JS) */}
            <div className={activeMapMode === "real-map" ? "block w-full h-[560px]" : "hidden"}>
              <MapLibreIndiaMap
                currentTier={currentTier}
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
                selectedYear={selectedYear}
                selectedFeatureId={selectedFeature?.id || selectedFeature?.khasraNo || selectedGeography?.district || selectedGeography?.state}
                activeLayers={layerVisibility}
                onSelectState={(st) => handleSelectStateOnMap(st)}
                onSelectDistrict={(dist) => handleDistrictChange(dist)}
                onSelectTehsil={(tehsil) => handleTehsilChange(tehsil)}
                onSelectFeature={(feat) => {
                  setSelectedFeature(feat);
                  setSelectedGeography({
                    country: "India",
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    source: "MAP_CLICK",
                    featureType: "parcel",
                    parcelId: feat.khasraNo,
                    placeName: `Khasra ${feat.khasraNo}`,
                    displayName: `Khasra ${feat.khasraNo}, ${selectedTehsil}, ${selectedDistrict}, ${selectedState}`,
                  });
                  setIsInspectorOpen(true);
                }}
                flyToLocation={flyToLocation}
              />
            </div>

            {/* 2. Cadastral Vector SVG Inspector (Always in DOM for SSR test crawler & local khasra inspection) */}
            <div className={activeMapMode === "cadastral-inspector" ? "block w-full h-[560px] relative bg-[#030712] overflow-hidden flex" : "hidden"}>
            {/* Map Top Floating Controls (Basemap Switcher & Search) */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKhasra}
                  onChange={(e) => setSearchKhasra(e.target.value)}
                  placeholder="Find Khasra # or Landholder..."
                  className="w-full h-8 pl-8 pr-3 text-xs bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/30 rounded-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 shadow-sm font-mono"
                />
              </div>

              {/* Basemap Switcher */}
              <div className="flex items-center gap-1 bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/25 rounded-sm p-1 shadow-md text-xs">
                {(["cadastral", "satellite", "topographic"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={`px-2.5 py-0.5 rounded-2xs text-[11px] font-semibold capitalize transition-all ${
                      basemap === b
                        ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Pan / Zoom Controls on Right */}
            <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5 pointer-events-auto">
              <button
                onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                className="w-8 h-8 bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400 text-slate-200 rounded-sm flex items-center justify-center shadow-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
                className="w-8 h-8 bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400 text-slate-200 rounded-sm flex items-center justify-center shadow-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => {
                  setPanOffset({ x: 0, y: 0 });
                  setZoomLevel(14);
                }}
                className="w-8 h-8 bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400 text-slate-200 rounded-sm flex items-center justify-center shadow-md transition-colors"
                title="Recenter"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Interactive Vector GIS SVG Canvas */}
            <div
              className={`w-full h-full relative cursor-grab active:cursor-grabbing ${
                basemap === "satellite"
                  ? "bg-[#050b0a]"
                  : basemap === "topographic"
                  ? "bg-[#030712]"
                  : "bg-[#081311]"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full select-none"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 14})`,
                  transformOrigin: "center center",
                  transition: isPanning ? "none" : "transform 0.15s ease-out",
                }}
              >
                <defs>
                  {/* Agricultural Cropland Pattern */}
                  <pattern id="agriPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M0 16L16 0M0 8L8 0M8 16L16 8" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.2" />
                  </pattern>

                  {/* Dispute Warning Stripe */}
                  <pattern id="disputeStripe" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#e47d72" strokeWidth="2.5" strokeOpacity="0.5" />
                  </pattern>

                  {/* Water Gradient */}
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Coordinate Grid lines */}
                <g stroke="#10274e" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.45">
                  <line x1="0" y1="100" x2="800" y2="100" />
                  <line x1="0" y1="200" x2="800" y2="200" />
                  <line x1="0" y1="300" x2="800" y2="300" />
                  <line x1="0" y1="400" x2="800" y2="400" />
                  <line x1="200" y1="0" x2="200" y2="500" />
                  <line x1="400" y1="0" x2="400" y2="500" />
                  <line x1="600" y1="0" x2="600" y2="500" />
                </g>

                {/* 1. Water Bodies Layer */}
                {layerVisibility["lu-water"] && (
                  <path
                    d="M40 0C90 120 180 200 320 240C460 280 620 220 790 320L800 345C620 245 460 305 320 265C175 225 80 145 30 0Z"
                    fill="url(#riverGrad)"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                )}

                {/* 2. Infrastructure Highway Road Axis (NH-46 Corridor) */}
                {layerVisibility["infra-roads"] && (
                  <g id="highway-corridor">
                    <path
                      d="M0 240 Q380 210 800 190"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 240 Q380 210 800 190"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="8,6"
                      opacity="0.9"
                    />
                  </g>
                )}

                {/* 3. Climate Vulnerability Heatmap (Aquifer Stress Zone) */}
                {layerVisibility["env-climate"] && (
                  <ellipse
                    cx="480"
                    cy="210"
                    rx="180"
                    ry="90"
                    fill="#e11d48"
                    fillOpacity={selectedYear >= 2024 ? "0.25" : "0.12"}
                    stroke="#e11d48"
                    strokeWidth="1.2"
                    strokeDasharray="4,4"
                  />
                )}

                {/* 4. Forest Reserve Boundary */}
                {layerVisibility["lu-forest"] && (
                  <polygon
                    points="90,340 140,210 320,310 270,440"
                    fill="#0b1c38"
                    fillOpacity="0.6"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6,3"
                  />
                )}

                {/* 5. Cadastral Boundary Parcels Layer (Restricted for Public) */}
                {layerVisibility["gov-cadastre"] && (
                  <g id="cadastral-parcels-group">
                    {filteredParcels.map((parcel) => {
                      const isSelected = selectedFeature?.id === parcel.id;
                      const isDisputed = parcel.disputeStatus !== "Clear";

                      return (
                        <g
                          key={parcel.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFeature(parcel);
                          }}
                          className="cursor-pointer group"
                        >
                          <polygon
                            points={parcel.points}
                            fill={
                              isSelected
                                ? "#3b82f6"
                                : isDisputed && layerVisibility["gov-disputes"]
                                ? "url(#disputeStripe)"
                                : parcel.id === "P-404"
                                ? "#0b1c38"
                                : parcel.id === "P-403" || parcel.id === "P-405"
                                ? "#19386c"
                                : "#0a1526"
                            }
                            fillOpacity={
                              isSelected
                                ? 0.45
                                : parcel.id === "P-404"
                                ? 0.55
                                : parcel.id === "P-403" || parcel.id === "P-405"
                                ? 0.45
                                : basemap === "satellite"
                                ? 0.25
                                : 0.65
                            }
                            stroke={
                              isSelected
                                ? "#60a5fa"
                                : isDisputed && layerVisibility["gov-disputes"]
                                ? "#e47d72"
                                : "#19386c"
                            }
                            strokeWidth={isSelected ? "2.5" : "1.2"}
                            className="transition-all duration-200 group-hover:stroke-emerald-300 group-hover:stroke-[2]"
                          />

                          {/* Parcel Centroid Label */}
                          <g transform={`translate(${parcel.centroid.x}, ${parcel.centroid.y})`} pointerEvents="none">
                            <rect
                              x="-26"
                              y="-9"
                              width="52"
                              height="18"
                              rx="3"
                              fill="#060e1a"
                              fillOpacity="0.9"
                              stroke={isSelected ? "#60a5fa" : "rgba(59, 130, 246,0.25)"}
                              strokeWidth="1"
                            />
                            <text
                              x="0"
                              y="3.5"
                              textAnchor="middle"
                              fontSize="9.5"
                              fontFamily="monospace"
                              fontWeight="bold"
                              fill={isSelected ? "#60a5fa" : "#e2e8f0"}
                            >
                              {parcel.khasraNo}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Floating Coordinates, Parcel Inspector Status, and Legend */}
            <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              <div className="bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/25 rounded-sm px-2.5 py-1 text-[10px] text-slate-300 font-mono shadow-md flex items-center gap-3">
                <span className="text-emerald-400">{selectedState} / {selectedDistrict} / {selectedTehsil}</span>
                <span className="text-slate-600">•</span>
                <span>Zoom: {zoomLevel}x</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400/80">EPSG:4326</span>
              </div>

              <div className="bg-[#060e1a]/90 backdrop-blur-md border border-emerald-500/25 rounded-sm px-2.5 py-1 text-[10px] text-slate-300 shadow-md flex items-center gap-2">
                <span className="font-bold text-emerald-400 font-mono">PARCEL INSPECTOR:</span>
                <span>Select Khasra parcel polygon to inspect certified record</span>
              </div>
            </div>
          </div>
        </div>

          {/* Layer Provenance Strip */}
          <div className="glass-panel-secondary border border-emerald-500/15 rounded-sm px-3 py-2 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400/90">SPATIAL PROVENANCE:</span>
              <span>Cadastral demonstration dataset • Survey of India CORS sync calibrated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold">
                LANDScope National Engine
              </span>
              <span>EPSG:4326</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: LAND INTELLIGENCE (3 cols) */}
        <div id="gis-intelligence-panel-container" className="lg:col-span-3 space-y-3">
          <GisIntelligencePanel
            intelligence={intelligence}
            relatedEvidence={relatedEvidence}
            selectedYear={selectedYear}
            userRole={userRole}
            currentTier={currentTier}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedTehsil={selectedTehsil}
            selectedGeography={selectedGeography}
            onDrillDownToDemo={handleJumpToDemo}
            onOpenEvidenceTrail={(trail) => setActiveEvidenceTrail(trail)}
            onOpenEvidenceDetail={(ev) => setActiveEvidenceDetail(ev)}
            onAddToProject={(ev) => setActiveEvidenceForAdd(ev)}
            onTestPolicyScenario={(geoCtx) => {
              if (onNavigateToPolicyLab) {
                onNavigateToPolicyLab(geoCtx);
              }
            }}
            onNavigateToReports={(geoCtx) => {
              if (onNavigateToReports) {
                onNavigateToReports(geoCtx);
              }
            }}
            onNavigateToResearch={(context) => {
              if (onNavigateToResearch) {
                onNavigateToResearch(context || selectedGeography);
              }
            }}
            onNavigateToAnalytics={(context) => {
              if (onNavigateToAnalytics) {
                onNavigateToAnalytics(context || selectedGeography);
              }
            }}
          />
        </div>
      </div>

      {/* 3. Multi-Temporal Timeline & Spatial Context Bar */}
      <div className="glass-panel-primary border border-emerald-500/20 rounded-sm p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 font-mono">MULTI-TEMPORAL TIMELINE:</span>
          <div className="flex items-center gap-1.5">
            {[2018, 2020, 2022, 2024, 2026].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-sm text-xs font-mono font-bold transition-all ${
                  selectedYear === yr
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-xs"
                    : "bg-[#060e1a] text-slate-400 hover:text-slate-200 border border-emerald-500/15"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-emerald-400/70 ml-1">
            (Multi-Temporal Sentinel-2 Analysis)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Spatial Extent: 1,240 km² • CRS: EPSG:4326
          </span>
        </div>
      </div>

      {/* Feature Inspector Side Panel */}
      <SidePanel
        isOpen={isInspectorOpen && selectedFeature !== null}
        onClose={() => setIsInspectorOpen(false)}
        title={`Parcel Inspector: Khasra ${selectedFeature?.khasraNo}`}
        subtitle={`${selectedTehsil} Tehsil, ${selectedDistrict}, ${selectedState}`}
        badge={
          <Badge
            variant={selectedFeature?.disputeStatus === "Clear" ? "official" : "dispute"}
            size="sm"
            dot
          >
            {selectedFeature?.disputeStatus}
          </Badge>
        }
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="xs" onClick={() => setIsInspectorOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="xs" leftIcon={<FileText className="w-3 h-3" />}>
              Download RoR
            </Button>
          </div>
        }
      >
        {selectedFeature && (
          <div className="space-y-3.5 text-xs text-slate-300">
            {/* Illustrative Demo Record Warning (Issue 2.D) */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-sm text-amber-300 text-[11px] flex items-center justify-between font-mono">
              <span className="font-bold">Illustrative Demo Record</span>
              <span className="text-[10px] text-amber-400">Demonstration RoR</span>
            </div>

            <div className="p-3.5 glass-panel-secondary border border-emerald-500/20 rounded-sm space-y-1">
              <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block font-mono">
                Registered Landholder
              </span>
              <strong className="text-slate-100 text-sm block">{selectedFeature.ownerName}</strong>
              <div className="text-[11px] text-slate-300 pt-1.5 border-t border-emerald-500/15">
                Tenure: <span className="font-semibold text-emerald-300">{selectedFeature.tenureType}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-[#060e1a] border border-emerald-500/20 rounded-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold font-mono">Extent</span>
                <strong className="text-emerald-300 text-base font-mono block mt-0.5">{selectedFeature.areaHa} Ha</strong>
                <div className="text-[10px] text-slate-500 font-mono">({selectedFeature.areaBigha} Bigha)</div>
              </div>
              <div className="p-3 bg-[#060e1a] border border-emerald-500/20 rounded-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold font-mono">Classification</span>
                <strong className="text-slate-200 text-xs block mt-0.5">{selectedFeature.landClassification}</strong>
              </div>
            </div>

            {/* Selected Location & Spatial Context */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Selected Location</span>
              <div className="text-[11px] text-slate-800 font-medium">
                {selectedTehsil} Tehsil, {selectedDistrict}, {selectedState}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Centroid: {selectedFeature.centroid.x}, {selectedFeature.centroid.y} • CRS: EPSG:4326
              </div>
            </div>

            {/* Available Evidence & Related Research */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Available Evidence & Related Research
              </span>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Linked Spatial Evidence:</span>
                  <span className="font-bold text-slate-800">{relatedEvidence.length} citations</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Research Projects:</span>
                  <span className="font-bold text-slate-800">{projects.length} in workspace</span>
                </div>
              </div>
            </div>

            {/* Parcel Actions (Requirement 2.D) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Parcel Actions</span>
              <div className="grid grid-cols-1 gap-1.5">
                <Button
                  variant="primary"
                  size="xs"
                  className="w-full justify-start"
                  onClick={() => {
                    if (onNavigateToResearch) {
                      onNavigateToResearch({
                        country: "India",
                        state: selectedState,
                        district: selectedDistrict,
                        tehsil: selectedTehsil,
                        source: "MAP_CLICK",
                        featureType: "parcel",
                        parcelId: selectedFeature.khasraNo,
                        placeName: `Khasra ${selectedFeature.khasraNo}`,
                        displayName: `Khasra ${selectedFeature.khasraNo}, ${selectedTehsil}, ${selectedDistrict}, ${selectedState}`,
                      });
                    }
                  }}
                  leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                >
                  Research This Parcel
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  className="w-full justify-start"
                  onClick={() => {
                    if (relatedEvidence.length > 0) {
                      setActiveEvidenceForAdd(relatedEvidence[0]);
                    }
                  }}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add to Evidence
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  className="w-full justify-start"
                  onClick={() => {
                    if (onNavigateToPolicyLab) {
                      onNavigateToPolicyLab({
                        state: selectedState,
                        district: selectedDistrict,
                        tehsil: selectedTehsil,
                        year: selectedYear,
                        builtUpPct: intelligence.landUse.builtUpPct,
                        agriculturePct: intelligence.landUse.agriculturePct,
                      });
                    }
                  }}
                  leftIcon={<Scale className="w-3.5 h-3.5" />}
                >
                  Save to Policy Scenario
                </Button>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-900 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>LANDScope Demonstration Environment • Cadastral Calibration</span>
            </div>
          </div>
        )}
      </SidePanel>

      {/* Evidence Trail Modal */}
      <EvidenceTrailModal
        trail={activeEvidenceTrail}
        isOpen={activeEvidenceTrail !== null}
        onClose={() => setActiveEvidenceTrail(null)}
        onOpenResearch={(refNum) => {
          const found = relatedEvidence.find((e) => e.referenceNumber === refNum);
          if (found) setActiveEvidenceDetail(found);
        }}
      />

      {/* Evidence Detail Modal */}
      <EvidenceDetailModal
        evidence={activeEvidenceDetail}
        isOpen={activeEvidenceDetail !== null}
        onClose={() => setActiveEvidenceDetail(null)}
        onAddToProject={(ev) => {
          setActiveEvidenceDetail(null);
          setActiveEvidenceForAdd(ev);
        }}
      />

      {/* Add To Project Modal */}
      <AddToProjectModal
        evidence={activeEvidenceForAdd}
        projects={projects}
        isOpen={activeEvidenceForAdd !== null}
        onClose={() => setActiveEvidenceForAdd(null)}
        onSuccess={() => {}}
      />
    </div>
  );
}
