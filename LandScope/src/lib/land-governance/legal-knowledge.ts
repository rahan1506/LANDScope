/**
 * LANDScope — Legal Knowledge Base
 * Structured legal entities for the Policy & Legal Harmonizer module
 *
 * IMPORTANT: All legal data is DEMO/SIMULATED for prototype purposes.
 * Do not rely on this for actual legal advice.
 * Every entry is marked with confidence level.
 */

import {
  LegalAct,
  LegalSection,
  LegalConflict,
  LegalRelationship,
  PolicyOverlay,
  LegalCategory,
} from "./types";

export type { LegalCategory };

// ============================================================
// LEGAL ACTS DATABASE (DEMO)
// ============================================================

export const DEMO_LEGAL_ACTS: LegalAct[] = [
  {
    id: "act-rfra-2006",
    name: "The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act",
    shortName: "Forest Rights Act, 2006",
    year: 2006,
    jurisdiction: "central",
    category: "forest",
    effectiveDate: "2008-01-01",
    sourceDocument: "The Gazette of India, Extraordinary, Part II, Section 1",
    sourceUrl: "https://tribal.nic.in/FRA.aspx",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-rera-2016",
    name: "Real Estate (Regulation and Development) Act",
    shortName: "RERA, 2016",
    year: 2016,
    jurisdiction: "central",
    category: "rera",
    effectiveDate: "2016-05-01",
    sourceDocument: "The Gazette of India, Extraordinary, Part II",
    sourceUrl: "https://rera.gov.in",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-epa-1986",
    name: "The Environment (Protection) Act",
    shortName: "EPA, 1986",
    year: 1986,
    jurisdiction: "central",
    category: "environment",
    effectiveDate: "1986-11-19",
    sourceDocument: "The Gazette of India, Extraordinary, Part II, Section 1",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-ifa-1927",
    name: "The Indian Forest Act",
    shortName: "Indian Forest Act, 1927",
    year: 1927,
    jurisdiction: "central",
    category: "forest",
    effectiveDate: "1927-09-21",
    sourceDocument: "The Gazette of India",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-larr-2013",
    name: "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act",
    shortName: "LARR Act, 2013",
    year: 2013,
    jurisdiction: "central",
    category: "acquisition",
    effectiveDate: "2014-01-01",
    sourceDocument: "The Gazette of India, Extraordinary, Part II",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-wetland-2017",
    name: "Wetlands (Conservation and Management) Rules",
    shortName: "Wetland Rules, 2017",
    year: 2017,
    jurisdiction: "central",
    category: "wetland",
    effectiveDate: "2017-09-26",
    sourceDocument: "Ministry of Environment, Forest and Climate Change Notification",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-crz-2019",
    name: "Coastal Regulation Zone Notification",
    shortName: "CRZ, 2019",
    year: 2019,
    jurisdiction: "central",
    category: "coastal",
    effectiveDate: "2019-01-18",
    sourceDocument: "Ministry of Environment, Forest and Climate Change",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-mp-rev-1959",
    name: "Madhya Pradesh Land Revenue Code",
    shortName: "MP Revenue Code, 1959",
    year: 1959,
    jurisdiction: "state",
    region: "Madhya Pradesh",
    category: "land_revenue",
    effectiveDate: "1959-10-02",
    sourceDocument: "Madhya Pradesh Gazette",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-mh-rev-1966",
    name: "Maharashtra Land Revenue Code",
    shortName: "Maharashtra Revenue Code, 1966",
    year: 1966,
    jurisdiction: "state",
    region: "Maharashtra",
    category: "land_revenue",
    effectiveDate: "1966-08-01",
    sourceDocument: "Maharashtra Government Gazette",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-ka-rev-1964",
    name: "Karnataka Land Revenue Act",
    shortName: "Karnataka Revenue Act, 1964",
    year: 1964,
    jurisdiction: "state",
    region: "Karnataka",
    category: "land_revenue",
    effectiveDate: "1964-04-01",
    sourceDocument: "Karnataka Government Gazette",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-pesa-1996",
    name: "Panchayats (Extension to Scheduled Areas) Act",
    shortName: "PESA Act, 1996",
    year: 1996,
    jurisdiction: "central",
    category: "community_rights",
    effectiveDate: "1996-12-24",
    sourceDocument: "The Gazette of India, Extraordinary",
    isActive: true,
    confidence: "verified",
  },
  {
    id: "act-eia-2006",
    name: "Environmental Impact Assessment Notification",
    shortName: "EIA Notification, 2006",
    year: 2006,
    jurisdiction: "central",
    category: "environment",
    effectiveDate: "2006-09-14",
    sourceDocument: "Ministry of Environment and Forests",
    isActive: true,
    confidence: "verified",
  },
];

// ============================================================
// LEGAL SECTIONS DATABASE (DEMO)
// ============================================================

export const DEMO_LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "sec-fra-3",
    actId: "act-rfra-2006",
    sectionNumber: "3",
    title: "Forest Rights of Forest Dwelling Scheduled Tribes and Other Traditional Forest Dwellers",
    summary: "Recognizes and vests forest rights in forest dwelling scheduled tribes and other traditional forest dwellers who have been residing in such forests for generations.",
    appliesTo: ["Forest"],
    restrictions: ["No diversion of forest land without consent of gram sabha"],
    authorities: ["District Level Committee", "Gram Sabha"],
    effectiveDate: "2008-01-01",
    confidence: "verified",
  },
  {
    id: "sec-fra-4",
    actId: "act-rfra-2006",
    sectionNumber: "4",
    title: "Recognition of and Vesting of Forest Rights",
    summary: "Procedure for recognition of forest rights through Gram Sabha and verification by Sub-Divisional and District Level Committees.",
    appliesTo: ["Forest"],
    restrictions: ["Rights subject to verification by Sub-Divisional Committee"],
    authorities: ["Gram Sabha", "Sub-Divisional Level Committee", "District Level Committee"],
    effectiveDate: "2008-01-01",
    confidence: "verified",
  },
  {
    id: "sec-epa-3",
    actId: "act-epa-1986",
    sectionNumber: "3",
    title: "Power of Central Government to Take Measures for Environmental Protection",
    summary: "Central Government empowered to take measures for protection and improvement of environment, including setting standards for emissions and discharges.",
    appliesTo: ["Agricultural", "Industrial", "Forest", "Wetland", "Waterbody"],
    restrictions: ["Prior environmental clearance required for specified activities"],
    authorities: ["Ministry of Environment, Forest and Climate Change", "State Environment Impact Assessment Authority"],
    effectiveDate: "1986-11-19",
    confidence: "verified",
  },
  {
    id: "sec-rera-3",
    actId: "act-rera-2016",
    sectionNumber: "3",
    title: "Registration of Real Estate Projects",
    summary: "Mandatory registration of real estate projects with RERA authority before advertising, marketing, booking, selling or offering for sale.",
    appliesTo: ["Residential", "Commercial"],
    restrictions: ["Cannot advertise or sell without RERA registration", "Land title must be clear"],
    authorities: ["Real Estate Regulatory Authority"],
    effectiveDate: "2016-05-01",
    confidence: "verified",
  },
  {
    id: "sec-wetland-4",
    actId: "act-wetland-2017",
    sectionNumber: "4",
    title: "Prohibited Activities in Wetlands",
    summary: "Activities such as conversion of wetland for non-wetland use, setting up of industry, construction activities, etc. are prohibited.",
    appliesTo: ["Wetland", "Waterbody"],
    restrictions: ["No conversion for non-wetland use", "No industrial activity", "No solid waste dumping"],
    authorities: ["State Wetland Authority", "National Wetland Committee"],
    effectiveDate: "2017-09-26",
    confidence: "verified",
  },
  {
    id: "sec-ifa-4",
    actId: "act-ifa-1927",
    sectionNumber: "4",
    title: "Reserved Forests",
    summary: "State Government may constitute any forest land or wasteland which is property of government as a reserved forest.",
    appliesTo: ["Forest"],
    restrictions: ["No private rights in reserved forests without permission", "No clearing or breaking up of land"],
    authorities: ["State Forest Department", "Forest Settlement Officer"],
    effectiveDate: "1927-09-21",
    confidence: "verified",
  },
  {
    id: "sec-larr-4",
    actId: "act-larr-2013",
    sectionNumber: "4",
    title: "Publication of Preliminary Notification and Land Acquisition Process",
    summary: "When land is needed for a public purpose, preliminary notification must be published with details and Social Impact Assessment conducted.",
    appliesTo: ["Agricultural", "Residential", "Commercial", "Industrial", "Barren"],
    restrictions: ["Social Impact Assessment mandatory", "Consent of 70-80% of affected families required"],
    authorities: ["Appropriate Government", "District Collector", "Expert Committee"],
    effectiveDate: "2014-01-01",
    confidence: "verified",
  },
];

// ============================================================
// LEGAL CONFLICTS DATABASE (DEMO)
// ============================================================

export const DEMO_LEGAL_CONFLICTS: LegalConflict[] = [
  {
    id: "conflict-01",
    frameworkA: "State Land Revenue Code",
    frameworkB: "Forest Rights Act, 2006",
    conflictDescription: "State revenue records may classify land as revenue land while FRA recognizes forest dwelling rights. Revenue mutations may conflict with FRA-vested rights of tribal communities.",
    severity: "HIGH",
    affectedClassifications: ["Forest", "Agricultural"],
    requiredAuthority: "District Level Committee (FRA) + Revenue Court",
    evidence: "Concurrent jurisdiction over forest fringe areas where both revenue and forest rights may apply.",
    confidence: "source_verification_required",
  },
  {
    id: "conflict-02",
    frameworkA: "RERA, 2016",
    frameworkB: "Environmental Protection Act, 1986",
    conflictDescription: "RERA mandates project registration and completion timelines, but environmental clearance delays under EPA/EIA can conflict with RERA timeline commitments to buyers.",
    severity: "MEDIUM",
    affectedClassifications: ["Residential", "Commercial"],
    requiredAuthority: "RERA Authority + State Environment Impact Assessment Authority",
    evidence: "Projects in eco-sensitive zones face regulatory overlap between real estate development mandates and environmental protection requirements.",
    confidence: "source_verification_required",
  },
  {
    id: "conflict-03",
    frameworkA: "State Land Revenue Code",
    frameworkB: "Wetland Rules, 2017",
    conflictDescription: "Revenue records may classify wetland-adjacent areas as cultivable land, potentially permitting conversions that conflict with wetland conservation rules.",
    severity: "HIGH",
    affectedClassifications: ["Wetland", "Agricultural", "Waterbody"],
    requiredAuthority: "State Wetland Authority + Revenue Department",
    evidence: "Discrepancy between revenue land classification and satellite-detected wetland boundaries.",
    confidence: "source_verification_required",
  },
  {
    id: "conflict-04",
    frameworkA: "Forest Rights Act, 2006",
    frameworkB: "Environmental Protection Act, 1986",
    conflictDescription: "FRA recognizes individual and community forest rights, but EPA-notified eco-sensitive zones may restrict activities on the same land, creating regulatory conflict.",
    severity: "HIGH",
    affectedClassifications: ["Forest"],
    requiredAuthority: "Ministry of Environment + Tribal Affairs Ministry",
    evidence: "Overlapping jurisdictions in scheduled forest areas with eco-sensitive zone notifications.",
    confidence: "source_verification_required",
  },
  {
    id: "conflict-05",
    frameworkA: "RERA, 2016",
    frameworkB: "Local Development Regulations",
    conflictDescription: "RERA-registered projects may face post-registration changes to municipal master plans or zoning regulations, affecting approved layouts and land use permissions.",
    severity: "MEDIUM",
    affectedClassifications: ["Residential", "Commercial", "Mixed"],
    requiredAuthority: "Municipal Corporation/Development Authority + RERA Authority",
    evidence: "Temporal misalignment between RERA registration and evolving local development plans.",
    confidence: "source_verification_required",
  },
  {
    id: "conflict-06",
    frameworkA: "State Land Revenue Code",
    frameworkB: "LARR Act, 2013",
    conflictDescription: "State revenue mutations may proceed on land earmarked for acquisition under LARR, creating competing ownership claims during the acquisition process.",
    severity: "CRITICAL",
    affectedClassifications: ["Agricultural", "Residential", "Commercial", "Industrial"],
    requiredAuthority: "District Collector + Revenue Court + Civil Court",
    evidence: "Pendency in acquisition proceedings allowing parallel revenue transactions.",
    confidence: "source_verification_required",
  },
];

// ============================================================
// LEGAL RELATIONSHIPS (DEMO)
// ============================================================

export const DEMO_LEGAL_RELATIONSHIPS: LegalRelationship[] = [
  {
    id: "rel-01",
    sourceActId: "act-rfra-2006",
    sourceSectionId: "sec-fra-3",
    targetActId: "act-ifa-1927",
    targetSectionId: "sec-ifa-4",
    relationshipType: "conflicts_with",
    description: "FRA forest rights may conflict with reserved forest restrictions under IFA",
    severity: "HIGH",
  },
  {
    id: "rel-02",
    sourceActId: "act-epa-1986",
    sourceSectionId: "sec-epa-3",
    targetActId: "act-rera-2016",
    targetSectionId: "sec-rera-3",
    relationshipType: "conflicts_with",
    description: "Environmental clearance requirements may delay RERA-mandated timelines",
    severity: "MEDIUM",
  },
  {
    id: "rel-03",
    sourceActId: "act-wetland-2017",
    sourceSectionId: "sec-wetland-4",
    targetActId: "act-epa-1986",
    targetSectionId: "sec-epa-3",
    relationshipType: "complements",
    description: "Wetland rules complement EPA environmental protection measures",
    severity: "LOW",
  },
];

// ============================================================
// POLICY OVERLAYS (DEMO)
// ============================================================

export const DEMO_POLICY_OVERLAYS: PolicyOverlay[] = [
  {
    id: "overlay-wetland-01",
    name: "Wetland Buffer Protection Zone",
    type: "environmental",
    jurisdiction: "central",
    region: "National",
    restrictions: [
      "No permanent commercial construction within 50m buffer",
      "No waste dumping or untreated sewage discharge",
      "Prior State Wetland Authority clearance mandatory",
    ],
    governingAct: "Wetlands (Conservation and Management) Rules, 2017",
    effectiveDate: "2017-09-26",
  },
  {
    id: "overlay-crz-01",
    name: "Coastal Regulation Zone I-A (Ecologically Sensitive)",
    type: "coastal",
    jurisdiction: "central",
    region: "Coastal States",
    restrictions: [
      "Strict ban on new construction in mangrove belts",
      "No reclamation of intertidal zones",
      "KCZMA / NCZMA prior clearance required",
    ],
    governingAct: "CRZ Notification 2019 under EPA 1986",
    effectiveDate: "2019-01-18",
  },
  {
    id: "overlay-forest-01",
    name: "Eco-Sensitive Zone (ESZ) Protected Sanctuary Perimeter",
    type: "forest",
    jurisdiction: "central",
    region: "Wildlife Sanctuaries",
    restrictions: [
      "Prohibition of commercial mining and large-scale industrial projects",
      "Strict regulation of ground water extraction",
      "Regulated change of land use",
    ],
    governingAct: "Forest Conservation Act 1980 & Wildlife Protection Act 1972",
    effectiveDate: "2011-02-09",
  },
];

// ============================================================
// CONFLICT MATRIX DATA
// ============================================================

export type ConflictFramework = "Revenue" | "Forest" | "Environment" | "RERA" | "Local" | "Acquisition";

export interface ConflictMatrixCell {
  frameworkA: ConflictFramework;
  frameworkB: ConflictFramework;
  hasConflict: boolean;
  severity: "none" | "low" | "medium" | "high" | "critical";
  conflictId?: string;
}

export const CONFLICT_MATRIX: ConflictMatrixCell[] = [
  { frameworkA: "Revenue", frameworkB: "Forest", hasConflict: true, severity: "high", conflictId: "conflict-01" },
  { frameworkA: "Revenue", frameworkB: "Environment", hasConflict: true, severity: "high", conflictId: "conflict-03" },
  { frameworkA: "Revenue", frameworkB: "RERA", hasConflict: false, severity: "none" },
  { frameworkA: "Revenue", frameworkB: "Local", hasConflict: true, severity: "medium" },
  { frameworkA: "Revenue", frameworkB: "Acquisition", hasConflict: true, severity: "critical", conflictId: "conflict-06" },
  { frameworkA: "Forest", frameworkB: "Environment", hasConflict: true, severity: "high", conflictId: "conflict-04" },
  { frameworkA: "Forest", frameworkB: "RERA", hasConflict: false, severity: "none" },
  { frameworkA: "Forest", frameworkB: "Local", hasConflict: true, severity: "medium" },
  { frameworkA: "Forest", frameworkB: "Acquisition", hasConflict: true, severity: "high" },
  { frameworkA: "Environment", frameworkB: "RERA", hasConflict: true, severity: "medium", conflictId: "conflict-02" },
  { frameworkA: "Environment", frameworkB: "Local", hasConflict: true, severity: "medium" },
  { frameworkA: "Environment", frameworkB: "Acquisition", hasConflict: true, severity: "high" },
  { frameworkA: "RERA", frameworkB: "Local", hasConflict: true, severity: "medium", conflictId: "conflict-05" },
  { frameworkA: "RERA", frameworkB: "Acquisition", hasConflict: true, severity: "medium" },
  { frameworkA: "Local", frameworkB: "Acquisition", hasConflict: true, severity: "high" },
];

/**
 * Get conflict between two frameworks
 */
export function getConflict(a: ConflictFramework, b: ConflictFramework): ConflictMatrixCell | null {
  if (a === b) return null;
  return CONFLICT_MATRIX.find(
    (c) =>
      (c.frameworkA === a && c.frameworkB === b) ||
      (c.frameworkA === b && c.frameworkB === a)
  ) || null;
}

/**
 * Get all conflicts for a framework
 */
export function getFrameworkConflicts(framework: ConflictFramework): ConflictMatrixCell[] {
  return CONFLICT_MATRIX.filter(
    (c) => c.frameworkA === framework || c.frameworkB === framework
  );
}

/**
 * Get conflict details by ID
 */
export function getConflictDetails(conflictId: string): LegalConflict | undefined {
  return DEMO_LEGAL_CONFLICTS.find((c) => c.id === conflictId);
}

/**
 * Get acts by category
 */
export function getActsByCategory(category: LegalCategory): LegalAct[] {
  return DEMO_LEGAL_ACTS.filter((a) => a.category === category);
}

/**
 * Get sections for an act
 */
export function getSectionsForAct(actId: string): LegalSection[] {
  return DEMO_LEGAL_SECTIONS.filter((s) => s.actId === actId);
}
