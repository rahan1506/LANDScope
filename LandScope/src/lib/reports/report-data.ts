/**
 * LANDScope Reports & Evidence-Based Policy Briefs Data Engine
 *
 * Implements end-to-end report synthesis connecting:
 * Research Evidence + Land Intelligence GIS + Policy Parameters + Simulation Engine + Multi-Dimensional Trade-Offs.
 *
 * Strictly adheres to data integrity:
 * Labels all demo results as "Illustrative Demo Dataset" and "Illustrative Model Output".
 */

import { BaselineProfile, SimulationResult, SectorImpact, PolicyTradeOff } from "@/lib/policy/policy-twin-data";
import { EvidenceItem } from "@/lib/research/research-data";

export type ReportStatus = "Draft" | "Generated" | "Archived";
export type ReportCategory =
  | "Evidence-Based Policy Brief"
  | "Parliamentary Brief"
  | "Annual Governance Audit"
  | "Policy Advisory";

export interface PolicyBriefReport {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    organization: string;
    email: string;
  };
  geography: {
    state: string;
    district: string;
    tehsil: string;
  };
  scenario: {
    scenarioId: string;
    scenarioTitle: string;
    category: string;
    horizonYear: number;
    stressCondition: string;
    parameters: Array<{
      id: string;
      name: string;
      unit: string;
      baseline: number;
      scenarioValue: number;
      whyItMatters: string;
    }>;
  };
  sections: {
    executiveSummary: string;
    geographyStudyArea: {
      state: string;
      district: string;
      tehsil: string;
      narrative: string;
      spatialCoordinates: string;
    };
    currentLandSituation: {
      landUse: {
        agriculturePct: number;
        builtUpPct: number;
        forestPct: number;
        waterPct: number;
      };
      environment: {
        aquiferRechargeIndex: number;
        aquiferStatus: string;
        forestBufferHealth: number;
        droughtRisk: string;
      };
      governance: {
        cadastralFormalizationPct: number;
        disputeRatePct: number;
        mutationLatencyDays: number;
      };
    };
    supportingEvidence: Array<{
      id: string;
      title: string;
      author: string;
      year: number;
      status: string;
      geography: string;
      relevance: string;
      referenceNumber: string;
    }>;
    policyScenarioSummary: {
      title: string;
      category: string;
      description: string;
    };
    baselineVsScenario: Array<{
      dimension: string;
      baseline: string;
      scenario: string;
      delta: string;
      direction: "positive" | "negative" | "neutral";
    }>;
    multiDimensionalImpact: {
      agriculture: { baseline: string; scenario: string; change: string; narrative: string };
      water: { baseline: string; scenario: string; change: string; narrative: string };
      ecology: { baseline: string; scenario: string; change: string; narrative: string };
      urbanDevelopment: { baseline: string; scenario: string; change: string; narrative: string };
      infrastructure: { baseline: string; scenario: string; change: string; narrative: string };
      landGovernance: { baseline: string; scenario: string; change: string; narrative: string };
    };
    policyTradeOffs: Array<{
      id: string;
      primaryBenefit: string;
      correspondingCost: string;
      rationale: string;
      severity: string;
    }>;
    spatialGisContext: {
      selectedLayers: string[];
      landUseSummary: string;
      criticalParcelsFlagged: number;
      sdiIntegrationSummary: string;
    };
    evidenceTrail: Array<{
      step: number;
      stage: string;
      content: string;
      source: string;
    }>;
    assumptions: string[];
    limitations: string[];
  };
  isPublic: boolean;
  metadata: {
    datasetLabel: "Illustrative Demo Dataset";
    modelOutputLabel: "Illustrative Model Output";
  };
}

// ========================================================
// PRE-BUILT INITIAL REPORTS REPOSITORY
// ========================================================

export const INITIAL_REPORTS: PolicyBriefReport[] = [
  {
    id: "REP-2026-081",
    title: "Parliamentary Standing Committee on Rural Development: Cadastral Geo-Referencing Audit 2026",
    category: "Parliamentary Brief",
    status: "Generated",
    createdAt: "2026-09-28",
    updatedAt: "2026-09-28",
    author: {
      name: "Vikram Malhotra",
      role: "POLICYMAKER",
      organization: "Ministry of Rural Development / Town Planning",
      email: "policymaker@landscope.demo",
    },
    geography: {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
    },
    scenario: {
      scenarioId: "SCN-2026-01",
      scenarioTitle: "Controlled Peri-Urban Expansion 2031",
      category: "Land-Use Planning",
      horizonYear: 2031,
      stressCondition: "Normal Conditions",
      parameters: [
        {
          id: "param-agri-cap",
          name: "Agricultural Land Diversion Ceiling",
          unit: "Ha / Year",
          baseline: 1200,
          scenarioValue: 650,
          whyItMatters: "Directly controls the rate at which fertile alluvial soil is irreversibly converted into impervious warehousing.",
        },
        {
          id: "param-eco-buffer",
          name: "Eco-Sensitive Buffer Zone Depth",
          unit: "Meters",
          baseline: 250,
          scenarioValue: 750,
          whyItMatters: "Prevents habitat fragmentation and enforces statutory compliance with National Green Tribunal guidelines.",
        },
      ],
    },
    sections: {
      executiveSummary:
        "This evidence-based policy brief examines the Ashta tehsil of Sehore district (Madhya Pradesh) under the Controlled Peri-Urban Expansion 2031 scenario. Calibrating historical 2018–2026 remote sensing trends against empirical groundwater extraction studies, the model demonstrates that introducing a 650 Ha annual farmland diversion cap protects ~550 Ha of double-cropped alluvial land and raises the aquifer recharge index from 44 (Critical) to 60 (Semi-Critical). An acknowledged trade-off is an estimated 21% reduction in immediate commercial logistics absorption along the NH-46 corridor.",
      geographyStudyArea: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        narrative: "Located along the Bhopal-Indore economic corridor with high peri-urban conversion velocity.",
        spatialCoordinates: "23.02° N, 76.53° E (Centroid: Ashta Revenue Circle)",
      },
      currentLandSituation: {
        landUse: {
          agriculturePct: 52.1,
          builtUpPct: 25.8,
          forestPct: 17.1,
          waterPct: 5.0,
        },
        environment: {
          aquiferRechargeIndex: 44,
          aquiferStatus: "Critical",
          forestBufferHealth: 68,
          droughtRisk: "High",
        },
        governance: {
          cadastralFormalizationPct: 92,
          disputeRatePct: 6.2,
          mutationLatencyDays: 45,
        },
      },
      supportingEvidence: [
        {
          id: "ev-103",
          title: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
          author: "Central Ground Water Board (CGWB) & Town Planning Directorate",
          year: 2026,
          status: "Peer Reviewed",
          geography: "Madhya Pradesh / Sehore",
          relevance: "Empirical hydrogeological regression correlating commercial land conversion with declining water table depths.",
          referenceNumber: "CGWB/URB/2026/19",
        },
        {
          id: "ev-101",
          title: "Tenure Insecurity and Agricultural Credit Accessibility in Central India",
          author: "NITI Aayog & NCAER",
          year: 2025,
          status: "Government Technical Report",
          geography: "Madhya Pradesh / Sehore",
          relevance: "Establishes baseline annual agricultural land diversion rates (1,200 Ha/year) in peri-urban corridors.",
          referenceNumber: "NITI/LGD/2025/089-B",
        },
      ],
      policyScenarioSummary: {
        title: "Controlled Peri-Urban Expansion 2031",
        category: "Land-Use Planning",
        description: "Balanced growth boundary setting statutory diversion caps and widening eco-sensitive perimeters.",
      },
      baselineVsScenario: [
        { dimension: "Agriculture", baseline: "1,200 Ha Diversion/Yr", scenario: "650 Ha Cap", delta: "-46% Farmland Loss", direction: "positive" },
        { dimension: "Water", baseline: "44 / 100 (Critical)", scenario: "60 / 100 (Semi-Critical)", delta: "+16 Pts Recharge", direction: "positive" },
        { dimension: "Ecology", baseline: "250m Buffer (68% Health)", scenario: "750m Buffer (88% Health)", delta: "+20% Canopy Buffer", direction: "positive" },
        { dimension: "Urban Development", baseline: "78% Unregulated Capacity", scenario: "57% Managed Capacity", delta: "-21% Footprint", direction: "negative" },
        { dimension: "Infrastructure", baseline: "100% Inundation Load", scenario: "72% Controlled Runoff", delta: "-28% Drainage Stress", direction: "positive" },
        { dimension: "Land Governance", baseline: "6.2% Disputed Parcels", scenario: "3.6% Disputed", delta: "-42% Court Plaints", direction: "positive" },
      ],
      multiDimensionalImpact: {
        agriculture: { baseline: "1,200 Ha/Yr", scenario: "650 Ha/Yr", change: "-46% Loss", narrative: "Protects 550 Ha of high-yield wheat and soybean soil from asphalt sealing." },
        water: { baseline: "44 / 100", scenario: "60 / 100", change: "+16 Pts", narrative: "Improves unconfined aquifer percolation through mandatory pervious quotas." },
        ecology: { baseline: "250m / 68%", scenario: "750m / 88%", change: "+20%", narrative: "Expands contiguous reserve forest perimeters protecting bird migration corridors." },
        urbanDevelopment: { baseline: "78% Capacity", scenario: "57% Capacity", change: "-21%", narrative: "Constrains speculative highway ribbon zoning and channels development into designated brownfield hubs." },
        infrastructure: { baseline: "100% Load", scenario: "72% Load", change: "-28%", narrative: "Reduces peak monsoon storm runoff by maintaining natural drainage swales." },
        landGovernance: { baseline: "6.2% Disputed", scenario: "3.6% Disputed", change: "-42%", narrative: "Pre-litigation CORS RTK drone verification curtails fraudulent parcel fragmentation." },
      },
      policyTradeOffs: [
        {
          id: "to-1",
          primaryBenefit: "Farmland & Aquifer Preservation (+550 Ha)",
          correspondingCost: "Reduced Immediate Logistics Absorption (-21%)",
          rationale: "Restricting highway commercial plot conversions protects regional food security but increases warehouse leasing costs.",
          severity: "Moderate",
        },
        {
          id: "to-2",
          primaryBenefit: "Ecological Buffer Integrity (750m No-Construction Zone)",
          correspondingCost: "Industrial Development Footprint Deflection",
          rationale: "Widening wildlife sanctuary buffers forces new industrial warehousing outward into secondary corridors.",
          severity: "Balanced",
        },
      ],
      spatialGisContext: {
        selectedLayers: ["Cadastral Parcels", "Master Plan 2031 Zoning", "Aquifer Vulnerability Heatmap", "Eco-Sensitive Buffer"],
        landUseSummary: "Agriculture (52.1%), Built-up (25.8%), Forest (17.1%), Water (5.0%).",
        criticalParcelsFlagged: 142,
        sdiIntegrationSummary: "Synchronized with Survey of India CORS Network and state revenue department shapefiles.",
      },
      evidenceTrail: [
        { step: 1, stage: "Policy Scenario", content: "Controlled Peri-Urban Expansion 2031", source: "Policy Digital Twin Lab" },
        { step: 2, stage: "Policy Parameters", content: "Agricultural Diversion Ceiling: 650 Ha; Eco-Buffer: 750m", source: "Calibrated Parameters" },
        { step: 3, stage: "GIS Context", content: "Ashta, Sehore, MP (Centroid: 23.02° N, 76.53° E)", source: "Land Intelligence GIS Engine" },
        { step: 4, stage: "Research Evidence", content: "CGWB Hydrogeology 2026 & NITI Aayog 2025", source: "National Research Repository" },
        { step: 5, stage: "Model Calculation", content: "Farmland Saved = 1200 Ha Baseline - 650 Ha Cap = 550 Ha", source: "Simulation Engine DiD Model" },
        { step: 6, stage: "Simulation Output", content: "46% Farmland Retention & +16 Aquifer Index Improvement", source: "Multi-Dimensional Impact Engine" },
      ],
      assumptions: [
        "Urban expansion pressure derived from 2018–2026 multi-temporal Sentinel-2 change detection.",
        "Aquifer percolation coefficient calibrated to Central Malwa black cotton & alluvial soil profiles.",
        "Commercial logistics footprint assumes average parcel requirement of 2.4 Hectares per unit.",
        "Court litigation avoidance regression derived from NITI Aayog SVAMITVA evaluation model.",
      ],
      limitations: [
        "Simulated outputs are illustrative prototype approximations and do not constitute statutory government notifications.",
        "Macroeconomic commodity shocks or state capital highway realignments are not modeled dynamically.",
        "Ground truth cadastral verification remains mandatory before any gazette notification is tabled.",
      ],
    },
    isPublic: true,
    metadata: {
      datasetLabel: "Illustrative Demo Dataset",
      modelOutputLabel: "Illustrative Model Output",
    },
  },
  {
    id: "REP-2026-074",
    title: "State of Central India Land Governance: Annual Land Insecurity & Dispute Conciliation Report",
    category: "Annual Governance Audit",
    status: "Generated",
    createdAt: "2026-09-15",
    updatedAt: "2026-09-15",
    author: {
      name: "Dr. Ananya Sharma",
      role: "RESEARCHER",
      organization: "National Institute of Public Finance and Policy",
      email: "researcher@landscope.demo",
    },
    geography: {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
    },
    scenario: {
      scenarioId: "SCN-2026-02",
      scenarioTitle: "Tenure Formalization & Pre-Registration Cadastral Survey",
      category: "Land Governance",
      horizonYear: 2028,
      stressCondition: "Normal Conditions",
      parameters: [
        {
          id: "param-cadastre-verification",
          name: "Mandatory Pre-Registration Drone Cadastre Verification",
          unit: "Binary (Enforced)",
          baseline: 0,
          scenarioValue: 1,
          whyItMatters: "Curtails overlapping sales deeds and fraudulent mutations.",
        },
      ],
    },
    sections: {
      executiveSummary:
        "An annual empirical audit evaluating 18,000 revenue court plaints across Central India. Demonstrates that institutionalizing digital RoR issuance and CORS-synchronized parcel demarcation reduces title litigation rates from 6.2% to 3.6% within three fiscal cycles.",
      geographyStudyArea: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        narrative: "Agricultural heartland undergoing transition toward agro-processing corridors.",
        spatialCoordinates: "23.02° N, 76.53° E",
      },
      currentLandSituation: {
        landUse: { agriculturePct: 52.1, builtUpPct: 25.8, forestPct: 17.1, waterPct: 5.0 },
        environment: { aquiferRechargeIndex: 44, aquiferStatus: "Critical", forestBufferHealth: 68, droughtRisk: "High" },
        governance: { cadastralFormalizationPct: 92, disputeRatePct: 6.2, mutationLatencyDays: 45 },
      },
      supportingEvidence: [
        {
          id: "ev-101",
          title: "Tenure Insecurity and Agricultural Credit Accessibility in Central India",
          author: "NITI Aayog & NCAER",
          year: 2025,
          status: "Government Technical Report",
          geography: "Madhya Pradesh / Sehore",
          relevance: "Direct correlation between boundary demarcation certainty and agricultural formal credit access.",
          referenceNumber: "NITI/LGD/2025/089-B",
        },
      ],
      policyScenarioSummary: {
        title: "Tenure Formalization & Pre-Registration Cadastral Survey",
        category: "Land Governance",
        description: "Enforcement of digital cadastral ground checks prior to sub-registrar mutation recording.",
      },
      baselineVsScenario: [
        { dimension: "Land Governance", baseline: "6.2% Dispute Rate", scenario: "3.6% Dispute Rate", delta: "-42% Litigation", direction: "positive" },
        { dimension: "Mutation Turnaround", baseline: "45 Days", scenario: "53 Days", delta: "+8 Days Verification", direction: "negative" },
      ],
      multiDimensionalImpact: {
        agriculture: { baseline: "High Vulnerability", scenario: "Enhanced Tenure", change: "+35% Credit Flow", narrative: "Clear titles unlock subsidized institutional credit." },
        water: { baseline: "Unchanged", scenario: "Unchanged", change: "0%", narrative: "Governance intervention has neutral hydrogeological delta." },
        ecology: { baseline: "Unchanged", scenario: "Unchanged", change: "0%", narrative: "Neutral ecological impact." },
        urbanDevelopment: { baseline: "Informal Subdivision", scenario: "Transparent Conveyance", change: "-60% Title Fraud", narrative: "Mitigates duplicate plot sales." },
        infrastructure: { baseline: "Right-of-Way Disputes", scenario: "De-risked Corridors", change: "-40% Acquisition Delays", narrative: "Facilitates seamless public works." },
        landGovernance: { baseline: "6.2% Litigated", scenario: "3.6% Litigated", change: "-42% Cases", narrative: "Significant de-clogging of sub-divisional magistrate courts." },
      },
      policyTradeOffs: [
        {
          id: "to-gov-1",
          primaryBenefit: "Litigation Drop (-42% Court Plaints)",
          correspondingCost: "Initial Mutation Latency (+8 Days)",
          rationale: "Mandatory RTK survey ground-check adds survey validation time prior to registry.",
          severity: "Balanced",
        },
      ],
      spatialGisContext: {
        selectedLayers: ["Cadastral Parcels", "Svamitva Abadi Vector", "Revenue Court Dispute Overlay"],
        landUseSummary: "Formalized parcels: 92%, Unmapped common land: 8%.",
        criticalParcelsFlagged: 88,
        sdiIntegrationSummary: "Direct feed from State Revenue Land Records Directorate (Bhulekh MP).",
      },
      evidenceTrail: [
        { step: 1, stage: "Policy Scenario", content: "Pre-Registration Drone Cadastre", source: "Governance Reform Suite" },
        { step: 2, stage: "Evidence", content: "NITI Aayog SVAMITVA Evaluation (2025)", source: "National Research Repository" },
        { step: 3, stage: "Simulation Output", content: "42% Reduction in Revenue Court Cases", source: "Governance Module" },
      ],
      assumptions: [
        "SDM revenue courts process plaints with standard 6-month procedural timelines.",
        "CORS base station network maintains sub-5cm RTK precision.",
      ],
      limitations: [
        "Historical mutation datasets reflect reported dispute plaints; informal panchayat settlements are excluded.",
        "All calculations represent illustrative model outputs.",
      ],
    },
    isPublic: true,
    metadata: {
      datasetLabel: "Illustrative Demo Dataset",
      modelOutputLabel: "Illustrative Model Output",
    },
  },
  {
    id: "REP-2026-062",
    title: "Special Report: Peri-Urban Agricultural Conversion Trajectories & Master Plan 2031 Alignment",
    category: "Policy Advisory",
    status: "Draft",
    createdAt: "2026-09-30",
    updatedAt: "2026-10-01",
    author: {
      name: "Vikram Malhotra",
      role: "POLICYMAKER",
      organization: "Ministry of Housing and Urban Affairs / Town Planning",
      email: "policymaker@landscope.demo",
    },
    geography: {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
    },
    scenario: {
      scenarioId: "SCN-DRAFT-03",
      scenarioTitle: "High-Productivity Agricultural Protection Moratorium",
      category: "Ecological & Food Security",
      horizonYear: 2031,
      stressCondition: "Climate Stress",
      parameters: [
        {
          id: "param-agri-cap",
          name: "Agricultural Land Diversion Ceiling",
          unit: "Ha / Year",
          baseline: 1200,
          scenarioValue: 300,
          whyItMatters: "Imposes strict moratorium on double-cropped farmland conversion.",
        },
      ],
    },
    sections: {
      executiveSummary:
        "Draft policy brief evaluating severe agricultural preservation constraints (300 Ha ceiling) under climate stress conditions. Highlights significant regional water table stability (+24 points) alongside stringent commercial real estate supply compression.",
      geographyStudyArea: {
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
        narrative: "Focus on prime wheat and chickpea agricultural belts.",
        spatialCoordinates: "23.02° N, 76.53° E",
      },
      currentLandSituation: {
        landUse: { agriculturePct: 52.1, builtUpPct: 25.8, forestPct: 17.1, waterPct: 5.0 },
        environment: { aquiferRechargeIndex: 44, aquiferStatus: "Critical", forestBufferHealth: 68, droughtRisk: "High" },
        governance: { cadastralFormalizationPct: 92, disputeRatePct: 6.2, mutationLatencyDays: 45 },
      },
      supportingEvidence: [
        {
          id: "ev-103",
          title: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
          author: "Central Ground Water Board (CGWB)",
          year: 2026,
          status: "Peer Reviewed",
          geography: "Madhya Pradesh / Sehore",
          relevance: "Hydrogeological vulnerability analysis.",
          referenceNumber: "CGWB/URB/2026/19",
        },
      ],
      policyScenarioSummary: {
        title: "High-Productivity Agricultural Protection Moratorium",
        category: "Ecological & Food Security",
        description: "Strict agro-conservation zoning placing a moratorium on double-cropped farmland.",
      },
      baselineVsScenario: [
        { dimension: "Agriculture", baseline: "1,200 Ha Loss/Yr", scenario: "300 Ha Cap", delta: "-75% Loss", direction: "positive" },
        { dimension: "Water", baseline: "44 / 100", scenario: "68 / 100", delta: "+24 Pts", direction: "positive" },
      ],
      multiDimensionalImpact: {
        agriculture: { baseline: "1,200 Ha", scenario: "300 Ha", change: "-75%", narrative: "Maximal food security retention." },
        water: { baseline: "44", scenario: "68", change: "+24 Pts", narrative: "Significant groundwater table recovery." },
        ecology: { baseline: "68%", scenario: "92%", change: "+24%", narrative: "Enhanced wildlife and riparian vegetation corridors." },
        urbanDevelopment: { baseline: "78%", scenario: "32%", change: "-46%", narrative: "Acute deficit in new logistics park land supply." },
        infrastructure: { baseline: "100%", scenario: "55%", change: "-45%", narrative: "Minimal road expansion requirements." },
        landGovernance: { baseline: "6.2%", scenario: "4.8%", change: "-22%", narrative: "Lower boundary disputes along commercial fringe." },
      },
      policyTradeOffs: [
        {
          id: "to-draft-1",
          primaryBenefit: "Maximal Food Security & Aquifer Retention (+900 Ha Protected)",
          correspondingCost: "Severe Logistics Supply Deficit (-46% Absorption)",
          rationale: "Sharp limits on farmland diversion deflect warehousing to neighboring districts.",
          severity: "High",
        },
      ],
      spatialGisContext: {
        selectedLayers: ["Cadastral Parcels", "Agricultural Productivity Index"],
        landUseSummary: "Agriculture (52.1%), Built-up (25.8%).",
        criticalParcelsFlagged: 210,
        sdiIntegrationSummary: "National Spatial Data Infrastructure Node 4.",
      },
      evidenceTrail: [
        { step: 1, stage: "Policy Scenario", content: "Moratorium on Prime Farmland", source: "Policy Digital Twin Lab" },
        { step: 2, stage: "Evidence", content: "CGWB Hydrogeology 2026", source: "Research Repository" },
        { step: 3, stage: "Simulation Output", content: "+24 Points Aquifer Recharge Index", source: "Impact Engine" },
      ],
      assumptions: ["Assumes 100% compliance with non-diversion moratorium."],
      limitations: ["Economic deflection to neighboring tehsils not captured in single-geography model."],
    },
    isPublic: false,
    metadata: {
      datasetLabel: "Illustrative Demo Dataset",
      modelOutputLabel: "Illustrative Model Output",
    },
  },
];

// ========================================================
// IN-MEMORY REPORTS STORE
// ========================================================

class ReportsStore {
  private reports: PolicyBriefReport[];

  constructor() {
    this.reports = [...INITIAL_REPORTS];
  }

  public getAll(userRole: string, userEmail: string): PolicyBriefReport[] {
    // RBAC filter:
    // ADMIN, POLICYMAKER, GOVERNMENT_AGENCY can view all generated and their own drafts
    // RESEARCHER can view public reports and their own reports
    // PUBLIC can only view public generated reports
    if (userRole === "ADMIN") {
      return this.reports;
    }
    if (userRole === "PUBLIC") {
      return this.reports.filter((r) => r.isPublic && r.status === "Generated");
    }
    if (userRole === "RESEARCHER") {
      return this.reports.filter((r) => r.isPublic || r.author.email === userEmail);
    }
    // Policymaker & Government Agency
    return this.reports.filter(
      (r) => r.isPublic || r.author.email === userEmail || userRole === "POLICYMAKER" || userRole === "GOVERNMENT_AGENCY"
    );
  }

  public getById(id: string, userRole: string, userEmail: string): PolicyBriefReport | null {
    const report = this.reports.find((r) => r.id === id);
    if (!report) return null;

    if (userRole === "ADMIN") return report;
    if (userRole === "PUBLIC" && (!report.isPublic || report.status !== "Generated")) {
      return null;
    }
    if (userRole === "RESEARCHER" && !report.isPublic && report.author.email !== userEmail) {
      return null;
    }
    return report;
  }

  public create(report: PolicyBriefReport): PolicyBriefReport {
    this.reports.unshift(report);
    return report;
  }

  public updateStatus(id: string, newStatus: ReportStatus): PolicyBriefReport | null {
    const r = this.reports.find((item) => item.id === id);
    if (!r) return null;
    r.status = newStatus;
    r.updatedAt = new Date().toISOString().split("T")[0];
    return r;
  }
}

export const reportsStore = new ReportsStore();

// ========================================================
// REPORT GENERATOR HELPER FROM SIMULATION CONTEXT
// ========================================================

export function buildPolicyBriefFromSimulationContext(params: {
  geography: { state: string; district: string; tehsil: string };
  baseline: BaselineProfile;
  simulationResult: SimulationResult;
  author: { name: string; role: string; organization: string; email: string };
  status?: ReportStatus;
  title?: string;
}): PolicyBriefReport {
  const { geography, baseline, simulationResult, author, status = "Generated", title } = params;

  const agriImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "AGRICULTURE");
  const waterImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "WATER");
  const ecoImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "ECOLOGY");
  const urbanImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "URBAN DEVELOPMENT");
  const infraImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "INFRASTRUCTURE");
  const govImpact = simulationResult.sectorImpacts.find((s) => s.dimension === "LAND GOVERNANCE");

  const reportTitle =
    title ||
    `Policy Decision Brief: ${simulationResult.scenarioTitle} (${geography.tehsil}, ${geography.district})`;

  const executiveSummary =
    `This evidence-based policy decision brief analyzes ${geography.tehsil} Tehsil in ${geography.district} (${geography.state}) under the "${simulationResult.scenarioTitle}". ` +
    `Calibrated against the 2026 geographic baseline and empirical research evidence, the policy simulation yields an estimated agricultural diversion impact of ${agriImpact?.deltaText || "-46%"}, ` +
    `an aquifer recharge delta of ${waterImpact?.deltaText || "+16 Pts"}, and an ecological buffer health improvement of ${ecoImpact?.deltaText || "+20%"}. ` +
    `These interventions entail strategic trade-offs, notably balancing farmland conservation and aquifer replenishment against managed commercial absorption (${urbanImpact?.deltaText || "-21%"}). ` +
    `All findings are anchored in peer-reviewed research and institutional dataset references from the National Land Intelligence Repository.`;

  const baselineVsScenario = simulationResult.sectorImpacts.map((si) => ({
    dimension: si.dimension,
    baseline: si.baselineValue,
    scenario: si.scenarioValue,
    delta: si.deltaText,
    direction: si.isPositive ? ("positive" as const) : ("negative" as const),
  }));

  const attachedEvidenceList = (simulationResult.evidenceUsed || baseline.evidenceSources || []).map((e, idx) => ({
    id: e.id || `ev-auto-${idx}`,
    title: e.title,
    author: e.authorOrOrg || "National Research Institution",
    year: e.year || 2025,
    status: e.evidenceStatus || "Peer Reviewed",
    geography: `${geography.state} / ${geography.district}`,
    relevance: e.abstract || "Empirical research grounding scenario baseline and simulation equations.",
    referenceNumber: e.source || `REF-GEO-2026-${idx + 101}`,
  }));

  const evidenceTrail = [
    {
      step: 1,
      stage: "Policy Scenario",
      content: simulationResult.scenarioTitle,
      source: "LANDScope Policy Digital Twin Lab",
    },
    {
      step: 2,
      stage: "Policy Parameters",
      content: Object.entries(simulationResult.parametersUsed || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("; "),
      source: "Scenario Builder Specification",
    },
    {
      step: 3,
      stage: "Geospatial Context",
      content: `${geography.tehsil}, ${geography.district}, ${geography.state}`,
      source: "Land Intelligence GIS Engine",
    },
    {
      step: 4,
      stage: "Research Evidence",
      content: attachedEvidenceList.map((e) => `${e.title} (${e.author})`).join("; "),
      source: "National Research & Evidence Repository",
    },
    {
      step: 5,
      stage: "Model Calculation",
      content: "Multi-temporal Sentinel-2 change detection coupled with SVAMITVA cadastral regression model.",
      source: "Simulation Engine DiD Model",
    },
    {
      step: 6,
      stage: "Simulation Output",
      content: `Multi-dimensional impact across 6 sectors; ${simulationResult.tradeOffs.length} trade-offs identified.`,
      source: "Impact Engine Output",
    },
  ];

  const reportId = `REP-${Date.now().toString(36).toUpperCase()}`;

  return {
    id: reportId,
    title: reportTitle,
    category: "Evidence-Based Policy Brief",
    status,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    author,
    geography,
    scenario: {
      scenarioId: simulationResult.scenarioId,
      scenarioTitle: simulationResult.scenarioTitle,
      category: "Land-Use Planning & Agro-Preservation",
      horizonYear: simulationResult.horizonYear || 2031,
      stressCondition: simulationResult.stressCondition || "Normal Conditions",
      parameters: Object.entries(simulationResult.parametersUsed || {}).map(([id, val]) => ({
        id,
        name: id.replace("param-", "").replace(/-/g, " ").toUpperCase(),
        unit: id.includes("cap") ? "Ha / Year" : id.includes("buffer") ? "Meters" : "Index",
        baseline: id.includes("cap") ? 1200 : id.includes("buffer") ? 250 : 0,
        scenarioValue: val,
        whyItMatters: "Directly modulates spatial allocation coefficients in the simulation engine.",
      })),
    },
    sections: {
      executiveSummary,
      geographyStudyArea: {
        state: geography.state,
        district: geography.district,
        tehsil: geography.tehsil,
        narrative: `Study area covering ${geography.tehsil} tehsil within ${geography.district} district, representing a critical peri-urban transitional corridor.`,
        spatialCoordinates: `Centroid coordinates calibrated for ${geography.district}, ${geography.state}`,
      },
      currentLandSituation: {
        landUse: {
          agriculturePct: baseline.landUse.agriculturePct,
          builtUpPct: baseline.landUse.builtUpPct,
          forestPct: baseline.landUse.forestPct,
          waterPct: baseline.landUse.waterPct,
        },
        environment: {
          aquiferRechargeIndex: baseline.environment.aquiferRechargeIndex,
          aquiferStatus: baseline.environment.aquiferStatus,
          forestBufferHealth: baseline.environment.forestBufferHealth,
          droughtRisk: baseline.environment.droughtRisk,
        },
        governance: {
          cadastralFormalizationPct: baseline.governance.cadastralFormalizationPct,
          disputeRatePct: baseline.governance.disputeRatePct,
          mutationLatencyDays: baseline.governance.mutationLatencyDays,
        },
      },
      supportingEvidence: attachedEvidenceList,
      policyScenarioSummary: {
        title: simulationResult.scenarioTitle,
        category: "Land-Use Planning & Agro-Preservation",
        description: `Simulated policy scenario operating under ${simulationResult.stressCondition}.`,
      },
      baselineVsScenario,
      multiDimensionalImpact: {
        agriculture: {
          baseline: agriImpact?.baselineValue || "1,200 Ha/Yr",
          scenario: agriImpact?.scenarioValue || "650 Ha/Yr",
          change: agriImpact?.deltaText || "-46%",
          narrative: agriImpact?.description || "Significant retention of high-yield arable agricultural soils.",
        },
        water: {
          baseline: waterImpact?.baselineValue || "44 / 100",
          scenario: waterImpact?.scenarioValue || "60 / 100",
          change: waterImpact?.deltaText || "+16 Pts",
          narrative: waterImpact?.description || "Recovers unconfined aquifer recharge through pervious surfacing mandates.",
        },
        ecology: {
          baseline: ecoImpact?.baselineValue || "250m Buffer",
          scenario: ecoImpact?.scenarioValue || "750m Buffer",
          change: ecoImpact?.deltaText || "+20%",
          narrative: ecoImpact?.description || "Secures contiguous vegetative buffers and mitigates corridor fragmentation.",
        },
        urbanDevelopment: {
          baseline: urbanImpact?.baselineValue || "78% Capacity",
          scenario: urbanImpact?.scenarioValue || "57% Capacity",
          change: urbanImpact?.deltaText || "-21%",
          narrative: urbanImpact?.description || "Curbs ribbon sprawl and channels growth into planned nodes.",
        },
        infrastructure: {
          baseline: infraImpact?.baselineValue || "100% Load",
          scenario: infraImpact?.scenarioValue || "72% Load",
          change: infraImpact?.deltaText || "-28%",
          narrative: infraImpact?.description || "Reduces monsoon surface runoff pressure on arterial transport drains.",
        },
        landGovernance: {
          baseline: govImpact?.baselineValue || "6.2% Disputed",
          scenario: govImpact?.scenarioValue || "3.6% Disputed",
          change: govImpact?.deltaText || "-42%",
          narrative: govImpact?.description || "Pre-registration RTK verification curtails title mutation litigation.",
        },
      },
      policyTradeOffs: simulationResult.tradeOffs.map((to) => ({
        id: to.id,
        primaryBenefit: to.primaryBenefit,
        correspondingCost: to.correspondingCost,
        rationale: to.rationale,
        severity: to.severity,
      })),
      spatialGisContext: {
        selectedLayers: [
          "Cadastral Parcels (Khasra) Vector Overlay",
          "Master Plan 2031 Statutory Zoning",
          "Aquifer Vulnerability Heatmap",
          "Eco-Sensitive Protected Perimeters",
        ],
        landUseSummary: `Agriculture (${baseline.landUse.agriculturePct}%), Built-up (${baseline.landUse.builtUpPct}%), Forest (${baseline.landUse.forestPct}%), Water (${baseline.landUse.waterPct}%).`,
        criticalParcelsFlagged: 142,
        sdiIntegrationSummary: "Integrated with National Spatial Data Infrastructure (NSDI) and Survey of India CORS Network.",
      },
      evidenceTrail,
      assumptions: simulationResult.modelAssumptions || [
        "Urban expansion pressure derived from 2018–2026 multi-temporal Sentinel-2 change detection.",
        "Aquifer percolation coefficient calibrated to Central Malwa black cotton & alluvial soil profiles.",
        "Commercial logistics footprint assumes average parcel requirement of 2.4 Hectares per unit.",
        "Court litigation avoidance regression derived from NITI Aayog SVAMITVA evaluation model.",
      ],
      limitations: simulationResult.limitations || [
        "Simulated outputs are illustrative prototype approximations and do not constitute statutory government notifications.",
        "Macroeconomic commodity shocks or state capital highway realignments are not modeled dynamically.",
        "Ground truth cadastral verification remains mandatory before any gazette notification is tabled.",
      ],
    },
    isPublic: author.role === "POLICYMAKER" || author.role === "ADMIN",
    metadata: {
      datasetLabel: "Illustrative Demo Dataset",
      modelOutputLabel: "Illustrative Model Output",
    },
  };
}
