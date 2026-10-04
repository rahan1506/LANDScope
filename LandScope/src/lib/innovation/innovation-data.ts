// LANDScope Innovation Hub Data Architecture & In-Memory Store
// Provides Discovery, Challenge Creation, Application Lifecycle, Reviewing,
// Pilot Projects, and Knowledge Competitions.
// Demonstrates national-scale land innovation workflows with strict server RBAC.

export type ChallengeCategory =
  | "Hackathon"
  | "Research Grant"
  | "Pilot Project"
  | "Knowledge Competition"
  | "Policy Challenge"
  | "Land Technology Challenge";

export type ChallengeStatus = "Draft" | "Open" | "Closed" | "Under Review" | "Completed";

export type ChallengeVisibility = "Published" | "Draft" | "Internal";

export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Accepted"
  | "Rejected";

export type PilotStatus =
  | "Proposed"
  | "Approved for Demonstration"
  | "Active"
  | "Completed";

export interface RelatedContext {
  researchTopic?: string;
  evidenceTitle?: string;
  datasetName?: string;
  datasetFormat?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  scenarioName?: string;
  scenarioId?: string;
  reportTitle?: string;
  collaborationProjectId?: string;
}

export interface InnovationChallenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  theme: string;
  problemStatement: string;
  expectedOutcome: string;
  eligibility: string;
  organizer: string;
  organizerEmail: string;
  organizerRole: string;
  geography: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  evaluationCriteria: string[];
  status: ChallengeStatus;
  visibility: ChallengeVisibility;
  demonstrationLabel: "Illustrative Demonstration Challenge";
  participantsCount: number;
  submissionsCount: number;
  budgetOrPrize?: string;
  relatedContext?: RelatedContext;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeApplication {
  id: string;
  challengeId: string;
  challengeTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: string;
  organization: string;
  proposalTitle: string;
  problemUnderstanding: string;
  proposedSolution: string;
  expectedImpact: string;
  teamMembers: string;
  attachments: {
    title: string;
    type: "Dataset" | "Research Evidence" | "GIS Context" | "Policy Brief" | "External Link";
    urlOrRef: string;
  }[];
  status: ApplicationStatus;
  isLocked: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  demonstrationLabel: "Illustrative Demonstration Application";
}

export interface ApplicationReview {
  id: string;
  applicationId: string;
  challengeId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  scores: {
    problemUnderstanding: number; // 1-20
    innovation: number; // 1-20
    technicalFeasibility: number; // 1-20
    evidence: number; // 1-20
    expectedImpact: number; // 1-20
    scalability: number; // 1-20
  };
  totalScore: number; // out of 120
  feedbackNotes: string;
  status: "Draft Review" | "Submitted Review";
  reviewedAt: string;
  evaluationLabel: "Illustrative Evaluation";
}

export interface PilotProjectRecord {
  id: string;
  pilotName: string;
  problem: string;
  location: string;
  state: string;
  district: string;
  tehsil?: string;
  innovation: string;
  expectedOutcome: string;
  timeline: string;
  partners: string[];
  metrics: {
    label: string;
    value: string;
    trend?: string;
  }[];
  status: PilotStatus;
  leadOrganization: string;
  leadUser: string;
  demonstrationLabel: "Illustrative Demonstration Pilot";
  createdAt: string;
}

export interface InnovationActivityEvent {
  id: string;
  challengeId?: string;
  applicationId?: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetTitle: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// SEED DATA: Clearly labelled Illustrative Demonstrations
// -----------------------------------------------------------------------------

const INITIAL_CHALLENGES: InnovationChallenge[] = [
  {
    id: "CHALL-2026-01",
    title: "AI for Sustainable Peri-Urban Land Planning",
    description:
      "Develop spatial AI models to forecast rapid conversion of agricultural holdings to urban uses in peri-urban belts, identifying biodiversity corridors and prime farmland at risk.",
    category: "Policy Challenge",
    theme: "Peri-Urban Governance & Agricultural Protection",
    problemStatement:
      "Rapid peri-urban sprawl in central India frequently causes leapfrog fragmentation of irrigated multi-crop farmland and encroaches upon micro-watershed drainage corridors before statutory master plans are updated.",
    expectedOutcome:
      "An automated spatial risk scoring engine and policy intervention simulator that outputs 5-year conversion heatmaps with evidence-backed zoning recommendations.",
    eligibility: "Researchers, Urban Planners, Data Scientists, and Multi-disciplinary Consortia",
    organizer: "Policy Planning Directorate & NIC Spatial Cell",
    organizerEmail: "policymaker@landscope.demo",
    organizerRole: "POLICYMAKER",
    geography: "Madhya Pradesh (Sehore, Raisen, Bhopal fringe)",
    startDate: "2026-09-01",
    endDate: "2026-12-15",
    submissionDeadline: "2026-11-20",
    evaluationCriteria: [
      "Problem Understanding & Statutory Grounding",
      "Model Accuracy on Empirical Drone/Satellite Sets",
      "Explainability & Policy Traceability",
      "Equitable Farmer Tenure Protection",
      "Interoperability with LANDScope GIS Layers",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 38,
    submissionsCount: 7,
    budgetOrPrize: "₹15,00,000 Demonstration Research Grant",
    relatedContext: {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
      scenarioName: "Controlled Peri-Urban Expansion",
      scenarioId: "SCN-2026-PERIURBAN-01",
      evidenceTitle: "Peri-Urban Agricultural Land Conversion Velocity in Bhopal-Sehore Corridor",
      datasetName: "Sehore District Khasra Land Classification Time-Series (2015-2025)",
      datasetFormat: "GeoJSON",
    },
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-28T14:30:00Z",
  },
  {
    id: "CHALL-2026-02",
    title: "Land Climate Resilience Innovation Challenge",
    description:
      "National hackathon to build predictive hydrology and soil erosion mitigation models using high-resolution spatial topography and satellite climate indices.",
    category: "Hackathon",
    theme: "Climate Resilience & Watershed Land Management",
    problemStatement:
      "Changing monsoon precipitation patterns have intensified flash runoff across undulating plateau watersheds, triggering topsoil loss and siltation of minor irrigation tanks.",
    expectedOutcome:
      "Open-source micro-watershed ridge-to-valley soil moisture forecasting models linked with Gram Panchayat revenue map overlays.",
    eligibility: "Student teams, Academic Researchers, Startup Innovators, and Geospatial Engineers",
    organizer: "National Land Research Consortium & MoRD Innovation Desk",
    organizerEmail: "researcher@landscope.demo",
    organizerRole: "RESEARCHER",
    geography: "Maharashtra (Pune, Satara, Solapur rainshadow)",
    startDate: "2026-09-15",
    endDate: "2026-11-30",
    submissionDeadline: "2026-11-10",
    evaluationCriteria: [
      "Technical Feasibility & Open Source Architecture",
      "Geospatial Precision of Runoff Vectors",
      "Farmer Decision Support Usability",
      "Evidence Traceability to ICAR/CGWB Baselines",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 64,
    submissionsCount: 14,
    budgetOrPrize: "₹10,00,000 Seed Innovation Award",
    relatedContext: {
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Haveli",
      evidenceTitle: "Hydrogeological Evaluation of Deccan Basalt Aquifers",
      datasetName: "Deccan Basalt Aquifer Piezometric Stack",
      datasetFormat: "CSV",
    },
    createdAt: "2026-09-15T09:00:00Z",
    updatedAt: "2026-09-30T11:00:00Z",
  },
  {
    id: "CHALL-2026-03",
    title: "Cadastral Boundary Delineation Benchmark",
    description:
      "Computer vision challenge for automatic parcel polygon extraction from 0.05m RTK drone orthomosaics with sub-decimeter boundary precision.",
    category: "Land Technology Challenge",
    theme: "Cadastral AI & Boundary Delineation",
    problemStatement:
      "Manual on-screen digitization of rural Abadi property boundaries from drone orthomosaics is labor-intensive and prone to human boundary curvature variation.",
    expectedOutcome:
      "Deep learning pipeline delivering >= 95% Intersection-over-Union (IoU) on complex rural village settlements and ridge-separated farm parcels.",
    eligibility: "AI Researchers, Academic Labs, and Computer Vision Practitioners",
    organizer: "Cadastral Survey Operations Directorate",
    organizerEmail: "agency@landscope.demo",
    organizerRole: "GOVERNMENT_AGENCY",
    geography: "National (Multi-terrain sample sets)",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    submissionDeadline: "2026-10-25",
    evaluationCriteria: [
      "Intersection over Union (IoU) on Unseen Village Tiles",
      "Geometric Regularity & Topology Preservation",
      "Inference Latency per Square Kilometer",
      "Robustness to Tree Canopy Shadowing",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 82,
    submissionsCount: 21,
    budgetOrPrize: "Deployment Sandbox Integration & Technical Citation",
    relatedContext: {
      datasetName: "Svamitva Drone 5cm Orthomosaic Benchmarking Tiles",
      datasetFormat: "GeoJSON",
    },
    createdAt: "2026-08-01T08:00:00Z",
    updatedAt: "2026-10-01T16:00:00Z",
  },
  {
    id: "CHALL-2026-04",
    title: "National Land Tenure Security Research Fellowship",
    description:
      "Competitive multi-year empirical research grant supporting academic field investigations into digitized land record impacts on smallholder credit access.",
    category: "Research Grant",
    theme: "Tenure Security & Agricultural Finance",
    problemStatement:
      "While digital land registries enhance transaction transparency, empirical evidence remains fragmented regarding whether digitized property cards consistently translate into institutional bank collateral acceptance.",
    expectedOutcome:
      "Peer-reviewed empirical monographs and an econometric dataset tracing credit uptake before and after cadastral title card issuance.",
    eligibility: "PhD Candidates, Postdoctoral Researchers, and University Faculty",
    organizer: "Centre for Spatial Governance Studies",
    organizerEmail: "academic@landscope.demo",
    organizerRole: "ACADEMIC_INSTITUTION",
    geography: "Pan-India Comparative Study",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    submissionDeadline: "2026-11-30",
    evaluationCriteria: [
      "Empirical Methodology & Sampling Rigor",
      "Theoretical Grounding in Land Economics",
      "Institutional Policy Relevance",
      "Data Provenance & Ethical Field Protocols",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 22,
    submissionsCount: 5,
    budgetOrPrize: "₹25,00,000 Institutional Research Grant",
    relatedContext: {
      researchTopic: "Digital Cadastre & Rural Credit Linkage",
      evidenceTitle: "Svamitva Property Card Issuance & Formal Credit Absorption Study",
    },
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-09-20T12:00:00Z",
  },
  {
    id: "CHALL-2026-05",
    title: "Gram Panchayat Common Property Land Innovation Pilot",
    description:
      "Empower local communities with mobile GIS tools to demarcate, protect, and restore village grazing lands (Gauchar) and community water harvesting bodies.",
    category: "Pilot Project",
    theme: "Common Property Resources & Community Demarcation",
    problemStatement:
      "Community commons and pastoral grazing lands suffer progressive encroachment due to ambiguous boundary demarcations and absence of geo-referenced Gram Sabha records.",
    expectedOutcome:
      "Participatory GIS pilot deployed across 15 Gram Panchayats with verifiable digital village common asset registers.",
    eligibility: "Civil Society Organizations, Social Enterprises, Gram Panchayat Federations",
    organizer: "Directorate of Rural Land Governance & Academic Cell",
    organizerEmail: "academic@landscope.demo",
    organizerRole: "ACADEMIC_INSTITUTION",
    geography: "Madhya Pradesh & Maharashtra pilot blocks",
    startDate: "2026-09-01",
    endDate: "2027-03-31",
    submissionDeadline: "2026-11-15",
    evaluationCriteria: [
      "Community Participatory Protocols",
      "Conflict Resolution Mechanisms",
      "Mobile Offline Capability",
      "Sustainability of Gram Sabha Maintenance",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 19,
    submissionsCount: 4,
    budgetOrPrize: "₹8,00,000 Field Deployment Sponsorship",
    createdAt: "2026-09-01T11:00:00Z",
    updatedAt: "2026-09-25T09:00:00Z",
  },
  {
    id: "CHALL-2026-06",
    title: "National Land Policy Brief Competition",
    description:
      "Annual inter-university policy analysis competition for formulating evidence-backed legislative briefs addressing eco-buffer land rights.",
    category: "Knowledge Competition",
    theme: "Statutory Drafting & Eco-Sensitive Zoning",
    problemStatement:
      "Drafting statutory regulations that balance wildlife sanctuary buffer protection with traditional agrarian livelihood rights requires synthesis of satellite telemetry and legal jurisprudence.",
    expectedOutcome:
      "Actionable 5-page Model Policy Briefs evaluated by senior revenue jurists and land economists.",
    eligibility: "Law Students, Public Policy Fellows, Land Governance Scholars",
    organizer: "Policy Planning Directorate",
    organizerEmail: "policymaker@landscope.demo",
    organizerRole: "POLICYMAKER",
    geography: "National",
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    submissionDeadline: "2026-10-30",
    evaluationCriteria: [
      "Constitutional & Statutory Consistency",
      "Empirical Evidence Trail Integration",
      "Clarity of Executive Recommendations",
      "Multi-Stakeholder Impact Analysis",
    ],
    status: "Open",
    visibility: "Published",
    demonstrationLabel: "Illustrative Demonstration Challenge",
    participantsCount: 45,
    submissionsCount: 11,
    budgetOrPrize: "National Policy Citation & Fellowship Commendation",
    createdAt: "2026-08-15T12:00:00Z",
    updatedAt: "2026-09-10T14:00:00Z",
  },
];

const INITIAL_PILOT_PROJECTS: PilotProjectRecord[] = [
  {
    id: "PILOT-2026-01",
    pilotName: "Sehore Peri-Urban Farmland Retention Corridor",
    problem:
      "Rapid uncoordinated plot layouts threatening perennial irrigation canals in Ashta tehsil.",
    location: "Ashta Tehsil, Sehore District",
    state: "Madhya Pradesh",
    district: "Sehore",
    tehsil: "Ashta",
    innovation:
      "Automated satellite change-detection triggering early-warning field inspection alerts to Tehsildar before unapproved plot layout sales occur.",
    expectedOutcome:
      "Preservation of 1,200 hectares of double-cropped black cotton soil and prevention of illegal sub-division.",
    timeline: "Jan 2026 - Dec 2026",
    partners: ["District Land Records Office", "Sehore Farmers Collective", "LANDScope Spatial AI Lab"],
    metrics: [
      { label: "Protected Farmland", value: "1,140 Ha", trend: "+8.4% target met" },
      { label: "Encroachment Alerts Issued", value: "32 Verified", trend: "100% inspected" },
      { label: "Drone Flight Audits", value: "12 Missions", trend: "0.05m GSD" },
    ],
    status: "Approved for Demonstration",
    leadOrganization: "Policy Planning Directorate & NIC Spatial Cell",
    leadUser: "Vikram Malhotra",
    demonstrationLabel: "Illustrative Demonstration Pilot",
    createdAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "PILOT-2026-02",
    pilotName: "Pune Micro-Watershed Rejuvenation Sandbox",
    problem:
      "Soil erosion and depleting groundwater piezometric levels in Haveli rainshadow micro-catchments.",
    location: "Haveli Tehsil, Pune District",
    state: "Maharashtra",
    district: "Pune",
    tehsil: "Haveli",
    innovation:
      "Continuous IoT piezometer telemetry combined with Sentinel-2 NDVI to optimize check-dam and contour bunding locations.",
    expectedOutcome:
      "18% increase in pre-monsoon water table recharge and 24% reduction in downstream reservoir siltation.",
    timeline: "Mar 2026 - Mar 2027",
    partners: ["Central Ground Water Board", "Pune Zilla Parishad", "IIT Bombay Water Resources Lab"],
    metrics: [
      { label: "Aquifer Monitoring Nodes", value: "18 IoT Wells", trend: "Real-time sync" },
      { label: "Check Dam Sites Demarcated", value: "24 Locations", trend: "Validated" },
      { label: "Soil Retention Ratio", value: "+14.2%", trend: "Seasonal gain" },
    ],
    status: "Active",
    leadOrganization: "Centre for Spatial Governance Studies",
    leadUser: "Prof. Sudhir Kulkarni",
    demonstrationLabel: "Illustrative Demonstration Pilot",
    createdAt: "2026-05-10T10:00:00Z",
  },
];

const INITIAL_APPLICATIONS: ChallengeApplication[] = [
  {
    id: "APP-2026-001",
    challengeId: "CHALL-2026-01",
    challengeTitle: "AI for Sustainable Peri-Urban Land Planning",
    applicantId: "usr_innovator_01",
    applicantName: "Rohan Varma",
    applicantEmail: "innovator@landscope.demo",
    applicantRole: "INNOVATOR",
    organization: "GeoVision Spatial AI Lab",
    proposalTitle: "GeoVision-PeriUrban: Multi-Temporal Sentinel SAR & Optical Sprawl Predictor",
    problemUnderstanding:
      "Current peri-urban planning is reactive because land use changes occur in informal stages before official title mutation records register the shift. Optical satellite data alone fails during overcast monsoon periods.",
    proposedSolution:
      "Our system combines bi-weekly Sentinel-1 C-band SAR coherence changes with Sentinel-2 NDVI trends, feeding a spatial graph neural network that flags early unauthorized road leveling and boundary stone construction.",
    expectedImpact:
      "Enables Tehsildars to detect unapproved plot layouts 90 days earlier than satellite NDVI alone, preserving contiguous agricultural belts.",
    teamMembers: "Rohan Varma (Lead AI), Dr. Priya Nair (Remote Sensing), Amit K. (Backend GIS)",
    attachments: [
      {
        title: "SAR Coherence Benchmarking Methodology",
        type: "Research Evidence",
        urlOrRef: "DOC-2026-SAR-01",
      },
      {
        title: "Ashta Tehsil Sample Prediction Shapefile",
        type: "GIS Context",
        urlOrRef: "GIS-CTX-ASHTA-2026",
      },
    ],
    status: "Submitted",
    isLocked: true,
    submittedAt: "2026-09-22T14:15:00Z",
    createdAt: "2026-09-18T10:00:00Z",
    updatedAt: "2026-09-22T14:15:00Z",
    demonstrationLabel: "Illustrative Demonstration Application",
  },
  {
    id: "APP-2026-002",
    challengeId: "CHALL-2026-02",
    challengeTitle: "Land Climate Resilience Innovation Challenge",
    applicantId: "usr_academic_01",
    applicantName: "Prof. Sudhir Kulkarni",
    applicantEmail: "academic@landscope.demo",
    applicantRole: "ACADEMIC_INSTITUTION",
    organization: "Centre for Spatial Governance Studies",
    proposalTitle: "Ridge-to-Reef Watershed Infiltration Modeling for Maharashtra Drought Zones",
    problemUnderstanding:
      "Standard run-off equations rely on outdated 1980s land-use lookup tables that do not reflect recent horticulture tree crop conversions in Pune and Satara districts.",
    proposedSolution:
      "Calibrate the SWAT hydrological model against high-resolution drone DEM elevation models and real-time CGWB observation piezometers.",
    expectedImpact:
      "Actionable micro-catchment water conservation plans adopted directly by 12 Village Gram Panchayats.",
    teamMembers: "Prof. Sudhir Kulkarni, Devendra Joshi (GIS Scholar), Sneha Patil (Hydrology)",
    attachments: [
      {
        title: "Deccan Basalt Aquifer Piezometric Stack",
        type: "Dataset",
        urlOrRef: "DATASET-HAVELI-2026",
      },
    ],
    status: "Submitted",
    isLocked: true,
    submittedAt: "2026-09-25T16:30:00Z",
    createdAt: "2026-09-20T11:00:00Z",
    updatedAt: "2026-09-25T16:30:00Z",
    demonstrationLabel: "Illustrative Demonstration Application",
  },
];

const INITIAL_REVIEWS: ApplicationReview[] = [
  {
    id: "REV-2026-01",
    applicationId: "APP-2026-001",
    challengeId: "CHALL-2026-01",
    reviewerId: "usr_policy_01",
    reviewerName: "Vikram Malhotra",
    reviewerRole: "POLICYMAKER",
    scores: {
      problemUnderstanding: 18,
      innovation: 19,
      technicalFeasibility: 17,
      evidence: 16,
      expectedImpact: 18,
      scalability: 17,
    },
    totalScore: 105,
    feedbackNotes:
      "Exceptional proposal leveraging SAR coherence for overcast season monitoring. Highly applicable to the Sehore corridor. Recommend linking directly with District Revenue Portal.",
    status: "Submitted Review",
    reviewedAt: "2026-09-26T11:00:00Z",
    evaluationLabel: "Illustrative Evaluation",
  },
];

const INITIAL_ACTIVITIES: InnovationActivityEvent[] = [
  {
    id: "ACT-01",
    challengeId: "CHALL-2026-01",
    actorName: "Vikram Malhotra",
    actorRole: "POLICYMAKER",
    action: "Published Challenge",
    targetTitle: "AI for Sustainable Peri-Urban Land Planning",
    timestamp: "2026-09-01T10:05:00Z",
  },
  {
    id: "ACT-02",
    challengeId: "CHALL-2026-02",
    actorName: "Dr. Ananya Sharma",
    actorRole: "RESEARCHER",
    action: "Published Hackathon",
    targetTitle: "Land Climate Resilience Innovation Challenge",
    timestamp: "2026-09-15T09:10:00Z",
  },
  {
    id: "ACT-03",
    challengeId: "CHALL-2026-01",
    applicationId: "APP-2026-001",
    actorName: "Rohan Varma",
    actorRole: "INNOVATOR",
    action: "Submitted Proposal",
    targetTitle: "GeoVision-PeriUrban: Multi-Temporal Sentinel SAR & Optical Sprawl Predictor",
    timestamp: "2026-09-22T14:15:00Z",
  },
  {
    id: "ACT-04",
    challengeId: "CHALL-2026-01",
    applicationId: "APP-2026-001",
    actorName: "Vikram Malhotra",
    actorRole: "POLICYMAKER",
    action: "Submitted Review",
    targetTitle: "Review score 105/120 for GeoVision-PeriUrban",
    timestamp: "2026-09-26T11:00:00Z",
  },
];

// -----------------------------------------------------------------------------
// IN-MEMORY STORE CLASS
// -----------------------------------------------------------------------------

class InnovationStore {
  private challenges: InnovationChallenge[] = [...INITIAL_CHALLENGES];
  private applications: ChallengeApplication[] = [...INITIAL_APPLICATIONS];
  private reviews: ApplicationReview[] = [...INITIAL_REVIEWS];
  private pilotProjects: PilotProjectRecord[] = [...INITIAL_PILOT_PROJECTS];
  private savedChallenges: Record<string, Set<string>> = {
    usr_innovator_01: new Set(["CHALL-2026-01", "CHALL-2026-03"]),
    usr_researcher_01: new Set(["CHALL-2026-02", "CHALL-2026-04"]),
  };
  private activities: InnovationActivityEvent[] = [...INITIAL_ACTIVITIES];

  // --- CHALLENGE METHODS ---

  public getChallenges(
    filters?: {
      category?: string;
      theme?: string;
      geography?: string;
      status?: string;
      search?: string;
      organizationType?: string;
    },
    userRole?: string
  ): InnovationChallenge[] {
    return this.challenges.filter((c) => {
      // Visibility check: Draft or Internal challenges only visible to creators or Admin
      if (c.visibility !== "Published" && userRole !== "ADMIN" && userRole !== c.organizerRole) {
        return false;
      }

      if (filters?.category && filters.category !== "All" && c.category !== filters.category) {
        return false;
      }
      if (filters?.status && filters.status !== "All" && c.status !== filters.status) {
        return false;
      }
      if (
        filters?.theme &&
        filters.theme !== "All" &&
        !c.theme.toLowerCase().includes(filters.theme.toLowerCase())
      ) {
        return false;
      }
      if (
        filters?.geography &&
        filters.geography !== "All" &&
        !c.geography.toLowerCase().includes(filters.geography.toLowerCase())
      ) {
        return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matches =
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.theme.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  public getChallengeById(id: string, userRole?: string): InnovationChallenge | null {
    const c = this.challenges.find((x) => x.id === id);
    if (!c) return null;

    if (c.visibility !== "Published" && userRole !== "ADMIN" && userRole !== c.organizerRole) {
      return null; // Denied access
    }
    return c;
  }

  public createChallenge(
    data: Omit<
      InnovationChallenge,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "participantsCount"
      | "submissionsCount"
      | "demonstrationLabel"
    >,
    creatorUser: { id: string; name: string; email: string; roleCode: string }
  ): InnovationChallenge {
    const id = `CHALL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const newChallenge: InnovationChallenge = {
      ...data,
      id,
      organizer: data.organizer || creatorUser.name,
      organizerEmail: creatorUser.email,
      organizerRole: creatorUser.roleCode,
      participantsCount: 1,
      submissionsCount: 0,
      demonstrationLabel: "Illustrative Demonstration Challenge",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.challenges.unshift(newChallenge);

    this.logActivity({
      challengeId: id,
      actorName: creatorUser.name,
      actorRole: creatorUser.roleCode,
      action: "Created Challenge",
      targetTitle: newChallenge.title,
    });

    return newChallenge;
  }

  public updateChallenge(
    id: string,
    updates: Partial<InnovationChallenge>,
    user: { id: string; roleCode: string; email: string }
  ): InnovationChallenge | null {
    const idx = this.challenges.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const existing = this.challenges[idx];
    // Must be creator or admin
    if (existing.organizerEmail !== user.email && user.roleCode !== "ADMIN") {
      return null;
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.challenges[idx] = updated;
    return updated;
  }

  // --- APPLICATION / SUBMISSION METHODS ---

  public getApplicationsForChallenge(
    challengeId: string,
    user: { id: string; email: string; roleCode: string }
  ): ChallengeApplication[] {
    const challenge = this.challenges.find((c) => c.id === challengeId);
    if (!challenge) return [];

    // If user is organizer, reviewer, policymaker, agency, or admin -> can see all applications
    const isReviewerOrAdmin =
      challenge.organizerEmail === user.email ||
      user.roleCode === "ADMIN" ||
      user.roleCode === "POLICYMAKER" ||
      user.roleCode === "GOVERNMENT_AGENCY";

    if (isReviewerOrAdmin) {
      return this.applications.filter((a) => a.challengeId === challengeId);
    }

    // Otherwise, APPLICANT ISOLATION: user can ONLY see their own applications!
    return this.applications.filter(
      (a) => a.challengeId === challengeId && a.applicantEmail === user.email
    );
  }

  public getApplicationById(
    id: string,
    user: { id: string; email: string; roleCode: string }
  ): ChallengeApplication | null {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;

    const challenge = this.challenges.find((c) => c.id === app.challengeId);
    const isReviewerOrAdmin =
      challenge?.organizerEmail === user.email ||
      user.roleCode === "ADMIN" ||
      user.roleCode === "POLICYMAKER" ||
      user.roleCode === "GOVERNMENT_AGENCY";

    // Applicant can see their own, reviewer/admin can see
    if (app.applicantEmail !== user.email && !isReviewerOrAdmin) {
      return null; // 403 Forbidden
    }

    return app;
  }

  public getUserApplications(userEmail: string): ChallengeApplication[] {
    return this.applications.filter((a) => a.applicantEmail === userEmail);
  }

  public createApplication(
    challengeId: string,
    data: {
      proposalTitle: string;
      organization: string;
      problemUnderstanding: string;
      proposedSolution: string;
      expectedImpact: string;
      teamMembers: string;
      attachments?: ChallengeApplication["attachments"];
      submitImmediately?: boolean;
    },
    user: { id: string; name: string; email: string; roleCode: string }
  ): ChallengeApplication {
    const challenge = this.challenges.find((c) => c.id === challengeId);
    if (!challenge) throw new Error("Challenge not found");

    const id = `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const isSubmitting = data.submitImmediately ?? false;

    const newApp: ChallengeApplication = {
      id,
      challengeId,
      challengeTitle: challenge.title,
      applicantId: user.id,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantRole: user.roleCode,
      organization: data.organization || "Independent Innovator",
      proposalTitle: data.proposalTitle,
      problemUnderstanding: data.problemUnderstanding,
      proposedSolution: data.proposedSolution,
      expectedImpact: data.expectedImpact,
      teamMembers: data.teamMembers || user.name,
      attachments: data.attachments || [],
      status: isSubmitting ? "Submitted" : "Draft",
      isLocked: isSubmitting,
      submittedAt: isSubmitting ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      demonstrationLabel: "Illustrative Demonstration Application",
    };

    this.applications.unshift(newApp);
    challenge.submissionsCount += isSubmitting ? 1 : 0;
    challenge.participantsCount += 1;

    this.logActivity({
      challengeId,
      applicationId: id,
      actorName: user.name,
      actorRole: user.roleCode,
      action: isSubmitting ? "Submitted Application" : "Drafted Application",
      targetTitle: newApp.proposalTitle,
    });

    return newApp;
  }

  public updateApplication(
    id: string,
    updates: Partial<ChallengeApplication>,
    user: { id: string; email: string; roleCode: string }
  ): { success: boolean; application?: ChallengeApplication; error?: string } {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return { success: false, error: "Application not found" };

    const app = this.applications[idx];

    // Applicant isolation check
    if (app.applicantEmail !== user.email && user.roleCode !== "ADMIN") {
      return { success: false, error: "Unauthorized: You can only edit your own application" };
    }

    // Submission locking check
    if (app.isLocked && user.roleCode !== "ADMIN") {
      return {
        success: false,
        error: "Submission is locked and cannot be edited after submission deadline",
      };
    }

    const updated: ChallengeApplication = {
      ...app,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.applications[idx] = updated;
    return { success: true, application: updated };
  }

  public submitApplication(
    id: string,
    user: { id: string; email: string; roleCode: string }
  ): { success: boolean; application?: ChallengeApplication; error?: string } {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return { success: false, error: "Application not found" };

    const app = this.applications[idx];
    if (app.applicantEmail !== user.email && user.roleCode !== "ADMIN") {
      return { success: false, error: "Unauthorized: You can only submit your own proposal" };
    }

    if (app.isLocked) {
      return { success: false, error: "Proposal has already been submitted and locked" };
    }

    app.status = "Submitted";
    app.isLocked = true;
    app.submittedAt = new Date().toISOString();
    app.updatedAt = new Date().toISOString();

    const challenge = this.challenges.find((c) => c.id === app.challengeId);
    if (challenge) {
      challenge.submissionsCount += 1;
    }

    this.logActivity({
      challengeId: app.challengeId,
      applicationId: app.id,
      actorName: app.applicantName,
      actorRole: app.applicantRole,
      action: "Submitted Proposal",
      targetTitle: app.proposalTitle,
    });

    return { success: true, application: app };
  }

  public withdrawApplication(
    id: string,
    user: { id: string; email: string; roleCode: string }
  ): boolean {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return false;

    const app = this.applications[idx];
    if (app.applicantEmail !== user.email && user.roleCode !== "ADMIN") {
      return false;
    }

    this.applications.splice(idx, 1);
    return true;
  }

  // --- REVIEW SYSTEM ---

  public getReviewsForApplication(
    applicationId: string,
    user: { id: string; email: string; roleCode: string }
  ): ApplicationReview[] {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return [];

    const challenge = this.challenges.find((c) => c.id === app.challengeId);

    // Reviews can ONLY be seen by reviewers, organizers, or admins.
    // Public and Applicants CANNOT see raw review scoring sheet (Internal Evaluation).
    const isReviewerOrAdmin =
      challenge?.organizerEmail === user.email ||
      user.roleCode === "ADMIN" ||
      user.roleCode === "POLICYMAKER" ||
      user.roleCode === "GOVERNMENT_AGENCY";

    if (!isReviewerOrAdmin) {
      return [];
    }

    return this.reviews.filter((r) => r.applicationId === applicationId);
  }

  public addReview(
    applicationId: string,
    reviewData: {
      scores: ApplicationReview["scores"];
      feedbackNotes: string;
    },
    user: { id: string; name: string; email: string; roleCode: string }
  ): { success: boolean; review?: ApplicationReview; error?: string } {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: "Application not found" };

    const challenge = this.challenges.find((c) => c.id === app.challengeId);

    // Reviewer authorization: Organizer, Policymaker, Agency, Admin
    const canReview =
      challenge?.organizerEmail === user.email ||
      user.roleCode === "ADMIN" ||
      user.roleCode === "POLICYMAKER" ||
      user.roleCode === "GOVERNMENT_AGENCY";

    if (!canReview) {
      return { success: false, error: "Unauthorized: You do not have reviewer credentials" };
    }

    // Cannot review own proposal
    if (app.applicantEmail === user.email) {
      return { success: false, error: "Conflict of interest: You cannot review your own proposal" };
    }

    const { problemUnderstanding, innovation, technicalFeasibility, evidence, expectedImpact, scalability } =
      reviewData.scores;
    const totalScore =
      problemUnderstanding +
      innovation +
      technicalFeasibility +
      evidence +
      expectedImpact +
      scalability;

    const id = `REV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const newReview: ApplicationReview = {
      id,
      applicationId,
      challengeId: app.challengeId,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerRole: user.roleCode,
      scores: reviewData.scores,
      totalScore,
      feedbackNotes: reviewData.feedbackNotes,
      status: "Submitted Review",
      reviewedAt: new Date().toISOString(),
      evaluationLabel: "Illustrative Evaluation",
    };

    this.reviews.push(newReview);
    app.status = "Under Review";

    this.logActivity({
      challengeId: app.challengeId,
      applicationId: app.id,
      actorName: user.name,
      actorRole: user.roleCode,
      action: "Completed Review",
      targetTitle: `Scored ${totalScore}/120 for "${app.proposalTitle}"`,
    });

    return { success: true, review: newReview };
  }

  // --- PILOT PROJECTS ---

  public getPilotProjects(): PilotProjectRecord[] {
    return this.pilotProjects;
  }

  public createPilotProject(
    data: Omit<PilotProjectRecord, "id" | "createdAt" | "demonstrationLabel">,
    user: { id: string; name: string; email: string; roleCode: string }
  ): PilotProjectRecord {
    const id = `PILOT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const newPilot: PilotProjectRecord = {
      ...data,
      id,
      demonstrationLabel: "Illustrative Demonstration Pilot",
      createdAt: new Date().toISOString(),
    };

    this.pilotProjects.unshift(newPilot);

    this.logActivity({
      actorName: user.name,
      actorRole: user.roleCode,
      action: "Proposed Pilot Project",
      targetTitle: newPilot.pilotName,
    });

    return newPilot;
  }

  // --- BOOKMARKS / SAVED CHALLENGES ---

  public toggleSaveChallenge(challengeId: string, userId: string): boolean {
    if (!this.savedChallenges[userId]) {
      this.savedChallenges[userId] = new Set();
    }
    const userSaves = this.savedChallenges[userId];
    if (userSaves.has(challengeId)) {
      userSaves.delete(challengeId);
      return false; // un-saved
    } else {
      userSaves.add(challengeId);
      return true; // saved
    }
  }

  public getSavedChallenges(userId: string): InnovationChallenge[] {
    const savedIds = this.savedChallenges[userId];
    if (!savedIds) return [];
    return this.challenges.filter((c) => savedIds.has(c.id));
  }

  // --- USER DASHBOARD ---

  public getUserDashboard(user: { id: string; email: string; roleCode: string }) {
    const myApplications = this.getUserApplications(user.email);
    const savedChallenges = this.getSavedChallenges(user.id);
    const myCreatedChallenges = this.challenges.filter((c) => c.organizerEmail === user.email);
    const recentActivities = this.activities.slice(0, 15);

    return {
      myApplications,
      mySubmissions: myApplications.filter((a) => a.status === "Submitted" || a.status === "Under Review"),
      savedChallenges,
      myCreatedChallenges,
      recentActivities,
    };
  }

  // --- ACTIVITY LOGGER ---

  private logActivity(event: Omit<InnovationActivityEvent, "id" | "timestamp">) {
    const newEvent: InnovationActivityEvent = {
      ...event,
      id: `ACT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.activities.unshift(newEvent);
    if (this.activities.length > 50) {
      this.activities.pop();
    }
  }

  public getRecentActivities(): InnovationActivityEvent[] {
    return this.activities.slice(0, 20);
  }
}

// Global singleton instance
export const innovationStore = new InnovationStore();
