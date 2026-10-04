/**
 * LANDScope Land Governance Analytics Data Engine
 *
 * Combines multi-temporal land use, climate resilience, cadastral governance,
 * and Policy Digital Twin simulations with complete evidence traceability.
 *
 * Follows strict data credibility guidelines:
 * Labels all outputs as "Illustrative Demo Analysis" and "Illustrative Model Output".
 * Uses neutral non-causal terminology: "Observed trend", "Illustrative relationship".
 */

import { getBaselineForGeography, runSimulationEngine, SimulationResult, BaselineProfile } from "@/lib/policy/policy-twin-data";
import { INITIAL_EVIDENCE_REPOSITORY, EvidenceItem } from "@/lib/research/research-data";

export interface TimeSeriesLandUse {
  year: number;
  agriculturePct: number;
  builtUpPct: number;
  forestPct: number;
  waterPct: number;
}

export interface ClimateResilienceMetrics {
  waterStressIndex: number; // 0 - 100 (higher = worse)
  waterStressStatus: "Low" | "Moderate" | "Semi-Critical" | "Critical";
  floodExposureIndex: number; // 0 - 100
  floodRiskCategory: "Low" | "Moderate" | "High";
  droughtVulnerability: "Low" | "Moderate" | "Severe";
  ecologicalVulnerabilityIndex: number; // 0 - 100
  aquiferRechargeScore: number; // 0 - 100
  aquiferStatus: "Safe" | "Semi-Critical" | "Critical";
  statusLabel: "Illustrative Model Output";
}

export interface GovernanceMetrics {
  cadastralFormalizationPct: number;
  disputeRatePct: number;
  averageMutationDays: number;
  svamitvaTitleDeedCoveragePct: number;
  digitizedParcelsCount: number;
  annualLitigationPlaints: number;
  tenureSecurityIndex: number; // 0 - 100
  statusLabel: "Illustrative Demo Dataset";
}

export interface AnalyticalTrendInsight {
  id: string;
  metric: string;
  category: "LAND_USE" | "CLIMATE" | "GOVERNANCE" | "POLICY";
  observedTrend: "Increasing" | "Decreasing" | "Stable";
  percentageChange: string;
  timeWindow: "2018–2026";
  narrative: string;
  analyticalCaveat: string;
  whyKey: string;
}

export interface AnalyticsGeographyProfile {
  state: string;
  district: string;
  tehsil: string;
  areaSqKm: number;
  totalCadastralParcels: number;
  selectedYear: number;
  timeSeries: TimeSeriesLandUse[];
  currentLandUse: TimeSeriesLandUse;
  climateResilience: ClimateResilienceMetrics;
  governance: GovernanceMetrics;
  insights: AnalyticalTrendInsight[];
  policyPerformance: {
    baseline: BaselineProfile;
    simulationResult: SimulationResult;
  };
  supportingEvidence: EvidenceItem[];
  metadata: {
    analysisType: "Illustrative Demo Analysis";
    spatialLayerTag: "Prototype Spatial Layer";
    disclaimer: "Analytical metrics represent illustrative prototype models for SIH26019 decision support and do not constitute statutory government notifications.";
  };
}

// ========================================================
// MULTI-TEMPORAL GEOGRAPHIC DATA STORE
// ========================================================

const TIME_SERIES_ARCHIVE: Record<string, TimeSeriesLandUse[]> = {
  "Madhya Pradesh-Sehore-Ashta": [
    { year: 2018, agriculturePct: 62.4, builtUpPct: 14.1, forestPct: 18.2, waterPct: 5.3 },
    { year: 2020, agriculturePct: 59.8, builtUpPct: 17.2, forestPct: 17.8, waterPct: 5.2 },
    { year: 2022, agriculturePct: 56.5, builtUpPct: 20.8, forestPct: 17.6, waterPct: 5.1 },
    { year: 2024, agriculturePct: 53.8, builtUpPct: 23.9, forestPct: 17.2, waterPct: 5.1 },
    { year: 2026, agriculturePct: 52.1, builtUpPct: 25.8, forestPct: 17.1, waterPct: 5.0 },
  ],
  "Maharashtra-Pune-Haveli": [
    { year: 2018, agriculturePct: 44.5, builtUpPct: 38.2, forestPct: 12.1, waterPct: 5.2 },
    { year: 2020, agriculturePct: 41.2, builtUpPct: 42.0, forestPct: 11.8, waterPct: 5.0 },
    { year: 2022, agriculturePct: 38.0, builtUpPct: 45.6, forestPct: 11.5, waterPct: 4.9 },
    { year: 2024, agriculturePct: 35.2, builtUpPct: 48.8, forestPct: 11.2, waterPct: 4.8 },
    { year: 2026, agriculturePct: 33.1, builtUpPct: 51.2, forestPct: 11.0, waterPct: 4.7 },
  ],
  "Gujarat-Surat-Chorasi": [
    { year: 2018, agriculturePct: 40.2, builtUpPct: 42.1, forestPct: 8.5, waterPct: 9.2 },
    { year: 2020, agriculturePct: 37.5, builtUpPct: 45.3, forestPct: 8.2, waterPct: 9.0 },
    { year: 2022, agriculturePct: 34.8, builtUpPct: 48.5, forestPct: 8.0, waterPct: 8.7 },
    { year: 2024, agriculturePct: 32.1, builtUpPct: 51.6, forestPct: 7.8, waterPct: 8.5 },
    { year: 2026, agriculturePct: 30.4, builtUpPct: 53.6, forestPct: 7.6, waterPct: 8.4 },
  ],
};

// ========================================================
// ANALYTICS EXPLAINABILITY REPOSITORY ("Why?")
// ========================================================

export interface AnalyticsWhyTrail {
  key: string;
  metric: string;
  question: string;
  observedTrend: string;
  researchSource: {
    title: string;
    organization: string;
    year: number;
    reference: string;
    quote: string;
  };
  spatialLayer: string;
  observationPeriod: string;
  analysisMethod: string;
  modelStatus: "Illustrative Model Output" | "Illustrative Demo Analysis";
  limitations: string;
  isRestricted?: boolean;
}

export const ANALYTICS_WHY_TRAILS: Record<string, AnalyticsWhyTrail> = {
  "why-agri-conversion": {
    key: "why-agri-conversion",
    metric: "Agricultural Land Conversion Trend",
    question: "Why is double-cropped agricultural land declining by 10.3 percentage points (2018–2026)?",
    observedTrend: "Observed trend indicates accelerated peri-urban commercial zoning along the NH-46 corridor.",
    researchSource: {
      title: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
      organization: "Central Ground Water Board (CGWB) & Town Planning Directorate",
      year: 2026,
      reference: "CGWB/URB/2026/19",
      quote: "Corridor expansion between 2018 and 2026 absorbed approximately 1,200 Hectares of prime agricultural land annually.",
    },
    spatialLayer: "Cadastral Parcels Overlay & Master Plan 2031 Statutory Zoning Layer",
    observationPeriod: "2018–2026 Multi-Temporal Series",
    analysisMethod: "Object-Based Image Analysis (OBIA) on Sentinel-2 multi-spectral reflectance datasets.",
    modelStatus: "Illustrative Demo Analysis",
    limitations: "Parcel-level ground truth survey is required to verify seasonal crop rotation exemptions.",
    isRestricted: false,
  },
  "why-aquifer-stress": {
    key: "why-aquifer-stress",
    metric: "Aquifer Critical Depletion Signal",
    question: "Why is the aquifer recharge index categorized as Critical (44 / 100)?",
    observedTrend: "Illustrative relationship showing groundwater draft exceeding natural monsoon percolation capacity.",
    researchSource: {
      title: "Dynamic Ground Water Resources Assessment of India (National Water Informatics)",
      organization: "Ministry of Jal Shakti / CGWB",
      year: 2025,
      reference: "GW-RES-2025-IND",
      quote: "Stage of groundwater extraction in Ashta block reached 94.2%, placing the unconfined basalt aquifer in critical vulnerability.",
    },
    spatialLayer: "Aquifer Vulnerability Heatmap & CGWB Observation Well Locations",
    observationPeriod: "2018–2026 Pre & Post-Monsoon Hydrographs",
    analysisMethod: "Hydrogeological water table contour interpolation and extraction-to-recharge ratio calculation.",
    modelStatus: "Illustrative Model Output",
    limitations: "Micro-watershed recharge variations within non-irrigated command areas are averaged at tehsil level.",
    isRestricted: false,
  },
  "why-dispute-decline": {
    key: "why-dispute-decline",
    metric: "Title Dispute Litigation Reduction",
    question: "Why are land dispute court plaints declining from 6.2% to 3.6% under pre-litigation cadastre?",
    observedTrend: "Scenario-model relationship correlating high-precision CORS RTK drone mapping with lower mutation boundary contests.",
    researchSource: {
      title: "Tenure Insecurity and Agricultural Credit Accessibility in Central India",
      organization: "NITI Aayog & NCAER",
      year: 2025,
      reference: "NITI/LGD/2025/089-B",
      quote: "Formalizing digital parcel boundaries using CORS technology reduced boundary overlap plaints by 42% over three fiscal terms.",
    },
    spatialLayer: "SVAMITVA Abadi Boundary Vector & Revenue Sub-Registrar Mutation Queue",
    observationPeriod: "2022–2026 Revenue Court Audit",
    analysisMethod: "Difference-in-Differences (DiD) econometric regression across digitized vs non-digitized revenue circles.",
    modelStatus: "Illustrative Model Output",
    limitations: "Excludes informal village panchayat customary mediation agreements not registered with SDM revenue courts.",
    isRestricted: false,
  },
  "why-confidential-cadastre": {
    key: "why-confidential-cadastre",
    metric: "Confidential Revenue Court Demarcation Audit",
    question: "What internal judicial audits substantiate boundary encroachment proceedings?",
    observedTrend: "Confidential agency operational audit tracking pending state revenue litigation.",
    researchSource: {
      title: "State Revenue Department Internal Compliance & Demarcation Enforcement Record",
      organization: "State Department of Revenue & Land Records",
      year: 2026,
      reference: "CONF-REV-2026-091",
      quote: "Internal demarcation plaints under judicial seal pending high court resolution.",
    },
    spatialLayer: "Restricted Cadastral Boundary Encroachment Vector",
    observationPeriod: "2024–2026 Internal Audit",
    analysisMethod: "Judicial case tracking and GIS cadastral discrepancy verification.",
    modelStatus: "Illustrative Demo Analysis",
    limitations: "Confidential agency data; prohibited from public disclosure.",
    isRestricted: true,
  },
};

// ========================================================
// ANALYTICS DATA GENERATOR
// ========================================================

export function getAnalyticsForGeography(
  state: string = "Madhya Pradesh",
  district: string = "Sehore",
  tehsil: string = "Ashta",
  year: number = 2026
): AnalyticsGeographyProfile {
  const key = `${state}-${district}-${tehsil}`;
  const defaultSeries = TIME_SERIES_ARCHIVE[key] || TIME_SERIES_ARCHIVE["Madhya Pradesh-Sehore-Ashta"];

  const matchedLandUse = defaultSeries.find((ts) => ts.year === year) || defaultSeries[defaultSeries.length - 1];

  // Retrieve baseline and run Policy Digital Twin simulation for policy performance correlation
  const baseline = getBaselineForGeography(state, district, tehsil);
  const simulationResult = runSimulationEngine(baseline, {
    "param-agri-cap": 650,
    "param-eco-buffer": 750,
    "param-water-setback": 150,
    "param-pervious-quotient": 35,
    "param-cadastre-verification": 1,
  }, "Normal Conditions", "Controlled Peri-Urban Expansion 2031");

  // Climate & Resilience Metrics
  const climateResilience: ClimateResilienceMetrics = {
    waterStressIndex: Math.round(100 - baseline.environment.aquiferRechargeIndex),
    waterStressStatus: baseline.environment.aquiferStatus as "Critical",
    floodExposureIndex: 38,
    floodRiskCategory: "Moderate",
    droughtVulnerability: "Severe",
    ecologicalVulnerabilityIndex: Math.round(100 - baseline.environment.forestBufferHealth),
    aquiferRechargeScore: baseline.environment.aquiferRechargeIndex,
    aquiferStatus: baseline.environment.aquiferStatus as "Critical",
    statusLabel: "Illustrative Model Output",
  };

  // Cadastral Governance Metrics
  const governance: GovernanceMetrics = {
    cadastralFormalizationPct: baseline.governance.cadastralFormalizationPct,
    disputeRatePct: baseline.governance.disputeRatePct,
    averageMutationDays: baseline.governance.mutationLatencyDays,
    svamitvaTitleDeedCoveragePct: 84,
    digitizedParcelsCount: 48200,
    annualLitigationPlaints: 1420,
    tenureSecurityIndex: 82,
    statusLabel: "Illustrative Demo Dataset",
  };

  // Trend Detection Insights (Neutral, non-causal language)
  const insights: AnalyticalTrendInsight[] = [
    {
      id: "ins-1",
      metric: "Agricultural Land Use",
      category: "LAND_USE",
      observedTrend: "Decreasing",
      percentageChange: "-10.3%",
      timeWindow: "2018–2026",
      narrative: "Observed trend demonstrates persistent contraction of alluvial cropland coinciding with highway commercial expansion.",
      analyticalCaveat: "Does not establish automatic loss of crop output due to simultaneous intensification in secondary parcels.",
      whyKey: "why-agri-conversion",
    },
    {
      id: "ins-2",
      metric: "Built-Up Impervious Surface",
      category: "LAND_USE",
      observedTrend: "Increasing",
      percentageChange: "+83.0%",
      timeWindow: "2018–2026",
      narrative: "Built-up surface expanded from 14.1% in 2018 to 25.8% in 2026 along transport corridors.",
      analyticalCaveat: "Reflects satellite reflectance signature; includes paved logistics staging areas and warehouses.",
      whyKey: "why-agri-conversion",
    },
    {
      id: "ins-3",
      metric: "Groundwater Extraction Ratio",
      category: "CLIMATE",
      observedTrend: "Increasing",
      percentageChange: "+14.2%",
      timeWindow: "2018–2026",
      narrative: "Illustrative relationship indicates seasonal extraction depth declining as impervious surface prevents natural infiltration.",
      analyticalCaveat: "Calibrated to CGWB hydrogeological assessment; local micro-aquifers may exhibit variations.",
      whyKey: "why-aquifer-stress",
    },
    {
      id: "ins-4",
      metric: "Title Mutation Dispute Rate",
      category: "GOVERNANCE",
      observedTrend: "Decreasing",
      percentageChange: "-42.0%",
      timeWindow: "2018–2026",
      narrative: "Observed trend correlates RTK drone parcel digitization with reduced boundary contestation in formal revenue courts.",
      analyticalCaveat: "Scenario-model relationship based on SVAMITVA pilot evaluation (DiD).",
      whyKey: "why-dispute-decline",
    },
  ];

  // Supporting empirical evidence
  const supportingEvidence = INITIAL_EVIDENCE_REPOSITORY.filter(
    (e: EvidenceItem) => e.geography.state === state || e.topics.some((t: string) => t.includes("Land") || t.includes("Water"))
  );

  return {
    state,
    district,
    tehsil,
    areaSqKm: 1240,
    totalCadastralParcels: 48200,
    selectedYear: year,
    timeSeries: defaultSeries,
    currentLandUse: matchedLandUse,
    climateResilience,
    governance,
    insights,
    policyPerformance: {
      baseline,
      simulationResult,
    },
    supportingEvidence,
    metadata: {
      analysisType: "Illustrative Demo Analysis",
      spatialLayerTag: "Prototype Spatial Layer",
      disclaimer: "Analytical metrics represent illustrative prototype models for SIH26019 decision support and do not constitute statutory government notifications.",
    },
  };
}
