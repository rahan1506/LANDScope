import { EvidenceItem, INITIAL_EVIDENCE_REPOSITORY } from "@/lib/research/research-data";

export interface GeoDistrict {
  id: string;
  name: string;
  tehsils: string[];
  centroid: { lat: number; lng: number };
  areaSqKm: number;
  totalParcels: number;
}

export interface GeoState {
  id: string;
  name: string;
  districts: GeoDistrict[];
}

export interface LandUseProfile {
  agriculturePct: number;
  forestPct: number;
  builtUpPct: number;
  waterPct: number;
}

export interface EnvironmentalIndicators {
  aquiferRechargeIndex: number; // 0-100
  aquiferStatus: "Critical" | "Semi-Critical" | "Safe";
  forestBufferHealth: number; // 0-100
  droughtVulnerability: "High" | "Moderate" | "Low";
}

export interface InfrastructureIndicators {
  corridorProximityKm: number;
  logisticsHubDensity: string;
  roadNetworkDensityKmPerSqKm: number;
}

export interface GovernanceIndicators {
  cadastralFormalizationPct: number;
  disputePendencyRate: number; // % of parcels under litigation
  averageMutationDays: number;
  svamitvaCoveragePct: number;
}

export interface TrendDirection {
  direction: "up" | "down" | "stable";
  changePct: number;
  narrative: string;
}

export interface GeoIntelligenceData {
  geography: {
    state: string;
    district: string;
    tehsil: string;
    areaSqKm: number;
    totalParcels: number;
  };
  year: number;
  landUse: LandUseProfile;
  environment: EnvironmentalIndicators;
  infrastructure: InfrastructureIndicators;
  governance: GovernanceIndicators;
  trends: {
    agriculture: TrendDirection;
    builtUp: TrendDirection;
    forest: TrendDirection;
    water: TrendDirection;
  };
  evidenceCount: number;
}

export interface EvidenceTrail {
  id: string;
  topic: string;
  flagTitle: string;
  researchTitle: string;
  authorOrAgency: string;
  referenceNumber: string;
  datasetName: string;
  spatialLayer: string;
  analysisMethod: string;
  modelAssumptions: string;
  status: "Illustrative Demo Analysis";
  keyMetric: string;
  geography: string;
}

export interface GisLayerDefinition {
  id: string;
  name: string;
  category: "LAND USE" | "ENVIRONMENT" | "INFRASTRUCTURE" | "GOVERNANCE";
  description: string;
  color: string;
  isRestricted: boolean; // restricted layers hidden/blocked for PUBLIC
  defaultVisible: boolean;
}

// ==========================================
// GEOGRAPHIC REGISTRY
// ==========================================

export const GEOGRAPHIC_HIERARCHY: GeoState[] = [
  {
    id: "MP",
    name: "Madhya Pradesh",
    districts: [
      {
        id: "MP-SEH",
        name: "Sehore",
        tehsils: ["Ashta", "Ichhawar", "Sehore Tehsil", "Shyampur", "Budhni"],
        centroid: { lat: 23.2048, lng: 77.0841 },
        areaSqKm: 6578,
        totalParcels: 284100,
      },
      {
        id: "MP-BHO",
        name: "Bhopal",
        tehsils: ["Huzur", "Berasia", "Kolar"],
        centroid: { lat: 23.2599, lng: 77.4126 },
        areaSqKm: 2772,
        totalParcels: 198400,
      },
      {
        id: "MP-RAI",
        name: "Raisen",
        tehsils: ["Goharganj", "Raisen Tehsil", "Bareli", "Silwani"],
        centroid: { lat: 23.3322, lng: 77.7839 },
        areaSqKm: 8466,
        totalParcels: 312000,
      },
    ],
  },
  {
    id: "MH",
    name: "Maharashtra",
    districts: [
      {
        id: "MH-PUN",
        name: "Pune",
        tehsils: ["Haveli", "Mulshi", "Baramati", "Khed"],
        centroid: { lat: 18.5204, lng: 73.8567 },
        areaSqKm: 15643,
        totalParcels: 620000,
      },
      {
        id: "MH-NAG",
        name: "Nagpur",
        tehsils: ["Nagpur Rural", "Hingna", "Umred", "Katol"],
        centroid: { lat: 21.1458, lng: 79.0882 },
        areaSqKm: 9892,
        totalParcels: 410000,
      },
    ],
  },
  {
    id: "OD",
    name: "Odisha",
    districts: [
      {
        id: "OD-MAY",
        name: "Mayurbhanj",
        tehsils: ["Baripada", "Rairangpur", "Karanjia"],
        centroid: { lat: 21.9322, lng: 86.7468 },
        areaSqKm: 10418,
        totalParcels: 389000,
      },
      {
        id: "OD-CUT",
        name: "Cuttack",
        tehsils: ["Cuttack Sadar", "Salepur", "Athagarh"],
        centroid: { lat: 20.4625, lng: 85.8828 },
        areaSqKm: 3932,
        totalParcels: 260000,
      },
    ],
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    districts: [
      {
        id: "TN-TRI",
        name: "Tiruchirappalli",
        tehsils: ["Trichy Urban", "Srirangam", "Lalgudi", "Manapparai", "Thuraiyur"],
        centroid: { lat: 10.8071, lng: 78.6881 },
        areaSqKm: 4404,
        totalParcels: 412000,
      },
      {
        id: "TN-THA",
        name: "Thanjavur",
        tehsils: ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai"],
        centroid: { lat: 10.7860, lng: 79.1381 },
        areaSqKm: 3397,
        totalParcels: 384000,
      },
      {
        id: "TN-CHE",
        name: "Chennai",
        tehsils: ["Chennai Central", "Mylapore", "Guindy", "Tondiarpet"],
        centroid: { lat: 13.0837, lng: 80.2702 },
        areaSqKm: 426,
        totalParcels: 580000,
      },
      {
        id: "TN-COI",
        name: "Coimbatore",
        tehsils: ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam"],
        centroid: { lat: 11.0018, lng: 76.9628 },
        areaSqKm: 4723,
        totalParcels: 495000,
      },
    ],
  },
  {
    id: "DL",
    name: "Delhi",
    districts: [
      {
        id: "DL-DEL",
        name: "Delhi",
        tehsils: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi"],
        centroid: { lat: 28.6665, lng: 77.2170 },
        areaSqKm: 1484,
        totalParcels: 820000,
      },
    ],
  },
  {
    id: "KA",
    name: "Karnataka",
    districts: [
      {
        id: "KA-BLR",
        name: "Bengaluru Urban",
        tehsils: ["Bengaluru North", "Bengaluru South", "Anekal", "Yelahanka"],
        centroid: { lat: 12.9716, lng: 77.5946 },
        areaSqKm: 2196,
        totalParcels: 910000,
      },
    ],
  },
];

// ==========================================
// 4 ORGANIZED SPATIAL LAYER GROUPS
// ==========================================

export const GIS_LAYERS_REGISTRY: GisLayerDefinition[] = [
  // 1. LAND USE
  {
    id: "lu-agri",
    name: "Agricultural Cropland",
    category: "LAND USE",
    description: "Active multi-crop & seasonal agricultural parcels",
    color: "#166534",
    isRestricted: false,
    defaultVisible: true,
  },
  {
    id: "lu-builtup",
    name: "Built-up / Urban Corridors",
    category: "LAND USE",
    description: "Commercial warehousing, industrial parks, and settlements",
    color: "#D97706",
    isRestricted: false,
    defaultVisible: true,
  },
  {
    id: "lu-forest",
    name: "Forest & Ecological Reserves",
    category: "LAND USE",
    description: "Reserved forest land, sanctuaries & community forest rights",
    color: "#059669",
    isRestricted: false,
    defaultVisible: true,
  },
  {
    id: "lu-water",
    name: "Water Bodies & River Basins",
    category: "LAND USE",
    description: "Parvati river tributaries, reservoirs & seasonal tanks",
    color: "#0284C7",
    isRestricted: false,
    defaultVisible: true,
  },

  // 2. ENVIRONMENT
  {
    id: "env-climate",
    name: "Climate Vulnerability Index",
    category: "ENVIRONMENT",
    description: "Groundwater extraction vs natural recharge heatmaps",
    color: "#E11D48",
    isRestricted: false,
    defaultVisible: true,
  },
  {
    id: "env-flood",
    name: "Flood & Drought Inundation Zones",
    category: "ENVIRONMENT",
    description: "1-in-25 year hydrological runoff boundaries",
    color: "#7C3AED",
    isRestricted: false,
    defaultVisible: false,
  },

  // 3. INFRASTRUCTURE
  {
    id: "infra-roads",
    name: "National & State Highway Corridors",
    category: "INFRASTRUCTURE",
    description: "NH-46 transit axis and arterial feeder roads",
    color: "#334155",
    isRestricted: false,
    defaultVisible: true,
  },
  {
    id: "infra-projects",
    name: "Major Infrastructure Projects",
    category: "INFRASTRUCTURE",
    description: "Proposed logistics parks and SEZ industrial land banks",
    color: "#475569",
    isRestricted: false,
    defaultVisible: false,
  },

  // 4. GOVERNANCE
  {
    id: "gov-cadastre",
    name: "Cadastral Boundaries (Khasras)",
    category: "GOVERNANCE",
    description: "Centimeter-precision land parcel boundaries and property cards",
    color: "#0A1C30",
    isRestricted: true, // RESTRICTED FOR PUBLIC: detailed ownership & khasra polygons
    defaultVisible: true,
  },
  {
    id: "gov-disputes",
    name: "Land Dispute & Litigation Flags",
    category: "GOVERNANCE",
    description: "eCourts revenue litigation flags and unconciliated boundaries",
    color: "#DC2626",
    isRestricted: true, // RESTRICTED FOR PUBLIC: private litigation records
    defaultVisible: true,
  },
];

// ==========================================
// TEMPORAL MULTI-YEAR DATA (2018 - 2026)
// ==========================================

export const TEMPORAL_INTELLIGENCE: Record<number, Record<string, GeoIntelligenceData>> = {
  2018: {
    "Sehore-Ashta": {
      geography: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        areaSqKm: 1240,
        totalParcels: 48200,
      },
      year: 2018,
      landUse: { agriculturePct: 62.4, forestPct: 18.2, builtUpPct: 14.1, waterPct: 5.3 },
      environment: {
        aquiferRechargeIndex: 78,
        aquiferStatus: "Safe",
        forestBufferHealth: 84,
        droughtVulnerability: "Moderate",
      },
      infrastructure: {
        corridorProximityKm: 4.8,
        logisticsHubDensity: "Low (Emerging)",
        roadNetworkDensityKmPerSqKm: 1.2,
      },
      governance: {
        cadastralFormalizationPct: 42,
        disputePendencyRate: 11.2,
        averageMutationDays: 142,
        svamitvaCoveragePct: 0,
      },
      trends: {
        agriculture: { direction: "stable", changePct: 0, narrative: "Baseline multi-crop farming dominant." },
        builtUp: { direction: "stable", changePct: 0, narrative: "Traditional village abadi perimeters." },
        forest: { direction: "stable", changePct: 0, narrative: "Contiguous forest canopy." },
        water: { direction: "stable", changePct: 0, narrative: "Normal reservoir storage." },
      },
      evidenceCount: 1,
    },
  },
  2020: {
    "Sehore-Ashta": {
      geography: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        areaSqKm: 1240,
        totalParcels: 48200,
      },
      year: 2020,
      landUse: { agriculturePct: 59.8, forestPct: 18.0, builtUpPct: 16.9, waterPct: 5.3 },
      environment: {
        aquiferRechargeIndex: 72,
        aquiferStatus: "Safe",
        forestBufferHealth: 82,
        droughtVulnerability: "Moderate",
      },
      infrastructure: {
        corridorProximityKm: 3.9,
        logisticsHubDensity: "Moderate",
        roadNetworkDensityKmPerSqKm: 1.4,
      },
      governance: {
        cadastralFormalizationPct: 54,
        disputePendencyRate: 10.8,
        averageMutationDays: 115,
        svamitvaCoveragePct: 18,
      },
      trends: {
        agriculture: { direction: "down", changePct: -4.2, narrative: "Initial farmland conversion along bypass." },
        builtUp: { direction: "up", changePct: +19.8, narrative: "Expansion of roadside warehousing." },
        forest: { direction: "stable", changePct: -1.1, narrative: "Minor fringe tree clearing." },
        water: { direction: "stable", changePct: 0, narrative: "Monsoon replenishment stable." },
      },
      evidenceCount: 2,
    },
  },
  2022: {
    "Sehore-Ashta": {
      geography: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        areaSqKm: 1240,
        totalParcels: 48200,
      },
      year: 2022,
      landUse: { agriculturePct: 56.5, forestPct: 17.6, builtUpPct: 20.8, waterPct: 5.1 },
      environment: {
        aquiferRechargeIndex: 61,
        aquiferStatus: "Semi-Critical",
        forestBufferHealth: 76,
        droughtVulnerability: "Moderate",
      },
      infrastructure: {
        corridorProximityKm: 2.8,
        logisticsHubDensity: "High Growth",
        roadNetworkDensityKmPerSqKm: 1.8,
      },
      governance: {
        cadastralFormalizationPct: 69,
        disputePendencyRate: 9.4,
        averageMutationDays: 88,
        svamitvaCoveragePct: 45,
      },
      trends: {
        agriculture: { direction: "down", changePct: -9.5, narrative: "Accelerating industrial plot conversion." },
        builtUp: { direction: "up", changePct: +47.5, narrative: "Major logistics park construction underway." },
        forest: { direction: "down", changePct: -3.3, narrative: "Eco-buffer encroachment flagged." },
        water: { direction: "down", changePct: -3.8, narrative: "Lower pre-monsoon water tables." },
      },
      evidenceCount: 3,
    },
  },
  2024: {
    "Sehore-Ashta": {
      geography: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        areaSqKm: 1240,
        totalParcels: 48200,
      },
      year: 2024,
      landUse: { agriculturePct: 53.8, forestPct: 17.2, builtUpPct: 23.9, waterPct: 5.1 },
      environment: {
        aquiferRechargeIndex: 52,
        aquiferStatus: "Semi-Critical",
        forestBufferHealth: 71,
        droughtVulnerability: "High",
      },
      infrastructure: {
        corridorProximityKm: 2.1,
        logisticsHubDensity: "Very High",
        roadNetworkDensityKmPerSqKm: 2.2,
      },
      governance: {
        cadastralFormalizationPct: 84,
        disputePendencyRate: 7.9,
        averageMutationDays: 64,
        svamitvaCoveragePct: 78,
      },
      trends: {
        agriculture: { direction: "down", changePct: -13.8, narrative: "Loss of double-cropped alluvial soil." },
        builtUp: { direction: "up", changePct: +69.5, narrative: "Heavy commercial ribbon development." },
        forest: { direction: "stable", changePct: -2.2, narrative: "Protected zone demarcations enforced." },
        water: { direction: "stable", changePct: 0, narrative: "Surface tanks maintained." },
      },
      evidenceCount: 4,
    },
  },
  2026: {
    "Sehore-Ashta": {
      geography: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        areaSqKm: 1240,
        totalParcels: 48200,
      },
      year: 2026,
      landUse: { agriculturePct: 52.1, forestPct: 17.1, builtUpPct: 25.8, waterPct: 5.0 },
      environment: {
        aquiferRechargeIndex: 44,
        aquiferStatus: "Critical",
        forestBufferHealth: 68,
        droughtVulnerability: "High",
      },
      infrastructure: {
        corridorProximityKm: 1.5,
        logisticsHubDensity: "Saturated Corridor",
        roadNetworkDensityKmPerSqKm: 2.6,
      },
      governance: {
        cadastralFormalizationPct: 92,
        disputePendencyRate: 6.2,
        averageMutationDays: 45,
        svamitvaCoveragePct: 94,
      },
      trends: {
        agriculture: { direction: "down", changePct: -16.5, narrative: "Critical farmland transition along NH-46." },
        builtUp: { direction: "up", changePct: +83.0, narrative: "Industrial warehousing corridor consolidated." },
        forest: { direction: "stable", changePct: -0.6, narrative: "Geo-fenced boundary alert operational." },
        water: { direction: "down", changePct: -5.7, narrative: "Groundwater extraction exceeds recharge by 2.4x." },
      },
      evidenceCount: 5,
    },
  },
};

// ==========================================
// EVIDENCE TRAILS ("Why?" Explainability Engine)
// ==========================================

export const EVIDENCE_TRAILS: Record<string, EvidenceTrail> = {
  "urban-expansion-ashta": {
    id: "trail-urban-01",
    topic: "Urban Expansion",
    flagTitle: "WHY IS URBAN EXPANSION FLAGGED ALONG NH-46?",
    researchTitle: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
    authorOrAgency: "Central Ground Water Board (CGWB) & Town Planning Directorate",
    referenceNumber: "CGWB/URB/2026/19",
    datasetName: "Sentinel-2 Multi-Temporal LULC Time-Series (2018-2025)",
    spatialLayer: "Master Plan 2031 Statutory Zoning Overlay & Cadastral Parcels",
    analysisMethod: "Historical multi-temporal change detection (OBIA) & revenue diversion audit",
    modelAssumptions: "Impervious runoff coefficient: 0.85; Buffer zone radius: 750m; Baseline rainfall: 2018",
    status: "Illustrative Demo Analysis",
    keyMetric: "+83.0% built-up surface expansion since 2018, displacing prime multi-crop alluvial soils.",
    geography: "Ashta Tehsil, Sehore District, Madhya Pradesh",
  },
  "aquifer-stress-ashta": {
    id: "trail-water-02",
    topic: "Groundwater Recharge",
    flagTitle: "WHY IS AQUIFER RECHARGE INDEX MARKED CRITICAL?",
    researchTitle: "Hydrogeological Stress Analysis of Peri-Urban Logistics Clusters",
    authorOrAgency: "Central Ground Water Board (CGWB)",
    referenceNumber: "CGWB/GW-HYDRO/2025/44",
    datasetName: "National Ground Water Level Monitoring Database (CORS Synced)",
    spatialLayer: "Aquifer Recharge Vulnerability Heatmap",
    analysisMethod: "Hydrogeological MODFLOW simulation integrated with cadastral spatial zoning",
    modelAssumptions: "Extraction rates based on active industrial borewells; infiltration reduced by concrete paving",
    status: "Illustrative Demo Analysis",
    keyMetric: "Annual water extraction exceeds recharge by 2.4x; aquifer depth down 8.4m since 2018.",
    geography: "Ashta Tehsil, Sehore District, Madhya Pradesh",
  },
  "dispute-reduction-ashta": {
    id: "trail-dispute-03",
    topic: "Land Governance",
    flagTitle: "WHY DID DISPUTE PENDENCY DROP FROM 11.2% TO 6.2%?",
    researchTitle: "Tenure Insecurity and Agricultural Credit Accessibility: Cadastral Titling in Central India",
    authorOrAgency: "NITI Aayog & National Council of Applied Economic Research (NCAER)",
    referenceNumber: "NITI/LGD/2025/089-B",
    datasetName: "SVAMITVA Drone Cadastre Validation Dataset (Survey of India)",
    spatialLayer: "Cadastral Parcels (Khasra) Vector Layer",
    analysisMethod: "Double-blind Difference-in-Differences (DiD) regression on eCourts suit records",
    modelAssumptions: "CORS RTK ground-truthed coordinates remove boundary ambiguity from legacy revenue maps",
    status: "Illustrative Demo Analysis",
    keyMetric: "42% reduction in civil boundary plaints post-SVAMITVA drone cadastre validation.",
    geography: "Ashta Tehsil, Sehore District, Madhya Pradesh",
  },
};

// ==========================================
// HELPER STORE FUNCTIONS
// ==========================================

export function getIntelligenceForGeography(
  stateName: string = "Madhya Pradesh",
  districtName: string = "Sehore",
  tehsilName: string = "Ashta",
  year: number = 2026
): GeoIntelligenceData {
  const key = `${districtName}-${tehsilName}`;
  const yearData = TEMPORAL_INTELLIGENCE[year] || TEMPORAL_INTELLIGENCE[2026];

  if (yearData[key]) {
    return yearData[key];
  }

  // Fallback default calculation based on state and district
  const baseParcels = districtName === "Sehore" ? 48200 : districtName === "Bhopal" ? 64000 : 38000;
  return {
    geography: {
      state: stateName,
      district: districtName,
      tehsil: tehsilName,
      areaSqKm: 1240,
      totalParcels: baseParcels,
    },
    year,
    landUse: {
      agriculturePct: Math.max(30, 60 - (year - 2018) * 1.2),
      forestPct: 18.5,
      builtUpPct: Math.min(45, 14 + (year - 2018) * 1.5),
      waterPct: 5.2,
    },
    environment: {
      aquiferRechargeIndex: Math.max(35, 75 - (year - 2018) * 3.8),
      aquiferStatus: year >= 2024 ? "Critical" : "Semi-Critical",
      forestBufferHealth: 72,
      droughtVulnerability: "Moderate",
    },
    infrastructure: {
      corridorProximityKm: 2.4,
      logisticsHubDensity: "High Growth",
      roadNetworkDensityKmPerSqKm: 1.8,
    },
    governance: {
      cadastralFormalizationPct: Math.min(95, 45 + (year - 2018) * 6),
      disputePendencyRate: Math.max(5, 11 - (year - 2018) * 0.6),
      averageMutationDays: Math.max(30, 130 - (year - 2018) * 11),
      svamitvaCoveragePct: Math.min(95, (year - 2018) * 12),
    },
    trends: {
      agriculture: { direction: "down", changePct: -14.2, narrative: "Gradual conversion into transit-oriented uses." },
      builtUp: { direction: "up", changePct: +68.4, narrative: "Ribbon industrial logistics expansion." },
      forest: { direction: "stable", changePct: -1.2, narrative: "Monitored boundaries preserved." },
      water: { direction: "down", changePct: -4.1, narrative: "Regional ground table depletion." },
    },
    evidenceCount: 3,
  };
}

export function getRelatedEvidenceForGeography(
  stateName: string,
  districtName?: string
): EvidenceItem[] {
  return INITIAL_EVIDENCE_REPOSITORY.filter((ev) => {
    if (ev.geography.state.toLowerCase() === stateName.toLowerCase()) return true;
    if (districtName && ev.geography.district?.toLowerCase() === districtName.toLowerCase()) return true;
    if (ev.geography.state === "National Coverage") return true;
    return false;
  });
}

export function getAvailableLayersForRole(roleCode: string): GisLayerDefinition[] {
  if (roleCode === "PUBLIC") {
    // PUBLIC role ONLY allowed public layers. Restricted layers (cadastral ownership, disputes) are filtered out!
    return GIS_LAYERS_REGISTRY.filter((l) => !l.isRestricted);
  }
  return GIS_LAYERS_REGISTRY;
}
