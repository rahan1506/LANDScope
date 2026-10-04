/**
 * LANDScope — Land Governance Platform Types
 * Core type definitions for Sentinel, Legal Harmonizer, Evidence Dossier, Bhu-Mitra, and Case Management
 */

// ============================================================
// PARCEL & ULPIN TYPES
// ============================================================

export interface ParcelIdentity {
  ulpin: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  coordinates: { lat: number; lng: number };
  boundaryGeoJSON?: GeoJSONPolygon;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface ULPINRecord {
  id: string;
  ulpin: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  ownerName: string;
  registeredAreaHa: number;
  landUseClassification: LandUseType;
  registrationDate: string;
  lastMutationDate: string;
  coordinates: { lat: number; lng: number };
  boundaryGeoJSON?: GeoJSONPolygon;
  isDemo: boolean;
}

export type LandUseType =
  | "Agricultural"
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Forest"
  | "Wetland"
  | "Barren"
  | "Waterbody"
  | "Government"
  | "Mixed";

// ============================================================
// MUTATION TYPES
// ============================================================

export interface MutationRecord {
  id: string;
  mutationId: string;
  parcelId: string;
  ulpin: string;
  oldAreaHa: number;
  newAreaHa: number;
  mutationDate: string;
  mutationType: MutationType;
  status: MutationStatus;
  source: string;
  registrationNumber: string;
  referenceNumber: string;
  oldOwner: string;
  newOwner: string;
  remarks: string;
  isDemo: boolean;
}

export type MutationType =
  | "Sale"
  | "Inheritance"
  | "Gift"
  | "Partition"
  | "Government_Acquisition"
  | "Court_Order"
  | "Consolidation"
  | "Correction";

export type MutationStatus =
  | "Registered"
  | "Pending"
  | "Rejected"
  | "Under_Review"
  | "Completed";

// ============================================================
// SATELLITE / CHANGE DETECTION TYPES
// ============================================================

export interface SatelliteObservation {
  id: string;
  parcelId: string;
  observationDate: string;
  source: string;
  resolution: string;
  ndviValue: number;
  ndbiValue: number;
  vegetationCoverPct: number;
  builtUpPct: number;
  waterbodyCoverPct: number;
  barrenPct: number;
  cloudCoverPct: number;
  isDemo: boolean;
}

export interface ChangeDetection {
  id: string;
  parcelId: string;
  detectionDate: string;
  changeType: ChangeType;
  severity: SeverityLevel;
  confidence: number;
  description: string;
  ndviChange: number;
  ndbiChange: number;
  vegetationLossPct: number;
  builtUpExpansionPct: number;
  waterbodyShrinkagePct: number;
  boundaryDriftMeters: number;
  newStructuralGrowth: boolean;
  areaAffectedHa: number;
  previousImageDate: string;
  currentImageDate: string;
  isDemo: boolean;
}

export type ChangeType =
  | "vegetation_loss"
  | "built_up_expansion"
  | "waterbody_shrinkage"
  | "boundary_drift"
  | "new_structure"
  | "land_use_change"
  | "encroachment"
  | "subdivision";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// ============================================================
// DISCREPANCY & RISK TYPES
// ============================================================

export interface DiscrepancyScore {
  totalScore: number;
  level: SeverityLevel;
  factors: DiscrepancyFactor[];
  generatedAt: string;
  parcelId: string;
  explanation: string;
}

export interface DiscrepancyFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  evidence: string;
  confidence: number;
}

export interface RiskAlert {
  id: string;
  parcelId: string;
  ulpin: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  location: string;
  evidence: string;
  confidence: number;
  timestamp: string;
  recommendedAction: string;
  category: RiskCategory;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export type RiskCategory =
  | "unregistered_subdivision"
  | "built_up_in_protected"
  | "area_mismatch"
  | "boundary_drift"
  | "waterbody_encroachment"
  | "vegetation_change"
  | "mutation_mismatch"
  | "temporal_inconsistency";

// ============================================================
// LEGAL / HARMONIZER TYPES
// ============================================================

export interface LegalAct {
  id: string;
  name: string;
  shortName: string;
  year: number;
  jurisdiction: JurisdictionLevel;
  region?: string;
  category: LegalCategory;
  effectiveDate: string;
  sourceDocument: string;
  sourceUrl?: string;
  isActive: boolean;
  confidence: "verified" | "source_verification_required";
}

export interface LegalSection {
  id: string;
  actId: string;
  sectionNumber: string;
  title: string;
  summary: string;
  appliesTo: LandUseType[];
  restrictions: string[];
  authorities: string[];
  effectiveDate: string;
  confidence: "verified" | "source_verification_required";
}

export interface LegalRelationship {
  id: string;
  sourceActId: string;
  sourceSectionId: string;
  targetActId: string;
  targetSectionId: string;
  relationshipType: "contains" | "applies_to" | "conflicts_with" | "supersedes" | "complements";
  description: string;
  severity: SeverityLevel;
}

export interface LegalConflict {
  id: string;
  frameworkA: string;
  frameworkB: string;
  conflictDescription: string;
  severity: SeverityLevel;
  affectedClassifications: LandUseType[];
  requiredAuthority: string;
  evidence: string;
  confidence: "verified" | "source_verification_required";
}

export interface PolicyOverlay {
  id: string;
  name: string;
  type: "environmental" | "forest" | "coastal" | "heritage" | "development" | "agricultural";
  jurisdiction: JurisdictionLevel;
  region: string;
  restrictions: string[];
  governingAct: string;
  effectiveDate: string;
}

export type JurisdictionLevel = "central" | "state" | "local";

export type LegalCategory =
  | "land_revenue"
  | "forest"
  | "environment"
  | "rera"
  | "coastal"
  | "acquisition"
  | "development"
  | "wetland"
  | "community_rights";

export interface ParcelLegalProfile {
  parcelId: string;
  ulpin: string;
  administrativeClassification: string;
  environmentalClassification: string;
  forestClassification: string;
  applicableActs: LegalAct[];
  applicableSections: LegalSection[];
  conflicts: LegalConflict[];
  overlays: PolicyOverlay[];
  requiredVerifications: string[];
}

// ============================================================
// EVIDENCE DOSSIER TYPES
// ============================================================

export interface EvidenceDossier {
  id: string;
  caseId: string;
  parcelIdentity: ParcelIdentity;
  geospatialEvidence: GeospatialEvidence;
  legalEvidence: LegalEvidence;
  documents: EvidenceDocument[];
  timeline: EvidenceTimelineItem[];
  integrityHash: string;
  generatedAt: string;
  generatedBy: string;
  qrCodeData: string;
  status: "draft" | "finalized" | "verified" | "disputed";
}

export interface GeospatialEvidence {
  parcelBoundary: GeoJSONPolygon | null;
  satelliteImageryRefs: string[];
  historicalImageryRefs: string[];
  ndviChange: number;
  ndbiChange: number;
  detectedChanges: ChangeDetection[];
  gisOverlays: string[];
}

export interface LegalEvidence {
  applicableActs: LegalAct[];
  applicableRules: LegalSection[];
  notifications: string[];
  sourceReferences: string[];
  relevantExcerpts: string[];
}

export interface EvidenceDocument {
  id: string;
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sha256Hash: string;
  creationTimestamp: string;
  source: string;
  uploadedBy: string;
  version: number;
  metadata: Record<string, string>;
  category: "land_document" | "mutation_record" | "field_photograph" | "survey_report" | "satellite_image" | "legal_document";
}

export interface EvidenceTimelineItem {
  id: string;
  date: string;
  type: "satellite_observation" | "mutation" | "field_verification" | "legal_review" | "document_upload";
  title: string;
  description: string;
  actor?: string;
  evidenceRef?: string;
}

export interface EvidenceVerification {
  caseId: string;
  isValid: boolean;
  packageHash: string;
  generatedTimestamp: string;
  documentHashes: { documentId: string; hash: string; valid: boolean }[];
  status: "VALID" | "INVALID" | "PARTIAL";
}

// ============================================================
// FIELD OBSERVATION (BHU-MITRA) TYPES
// ============================================================

export interface FieldObservation {
  id: string;
  caseId: string;
  parcelId: string;
  observerId: string;
  observerName: string;
  observerRole: FieldRole;
  timestamp: string;
  gpsCoordinates: { lat: number; lng: number } | null;
  gpsAccuracy?: number;
  compassOrientation?: number;
  photos: FieldPhoto[];
  boundaryPoints: { lat: number; lng: number }[];
  observations: string;
  notes: string;
  syncStatus: "pending" | "synced" | "failed";
  deviceInfo: string;
  offlineCreatedAt?: string;
}

export interface FieldPhoto {
  id: string;
  dataUrl?: string;
  blobUrl?: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  orientation: number | null;
  deviceInfo: string;
  caseId: string;
  parcelId: string;
}

export type FieldRole =
  | "patwari"
  | "village_officer"
  | "talathi"
  | "survey_officer"
  | "authorized_verifier"
  | "citizen";

export interface GroundSatelliteAlignment {
  alignmentScore: number;
  fieldBoundaryPoints: { lat: number; lng: number }[];
  cadastralBoundary: GeoJSONPolygon | null;
  satelliteBoundary: GeoJSONPolygon | null;
  discrepancies: string[];
}

// ============================================================
// CASE MANAGEMENT TYPES
// ============================================================

export interface LandCase {
  id: string;
  caseId: string;
  parcelId: string;
  ulpin: string;
  surveyNumber: string;
  location: {
    village: string;
    taluk: string;
    district: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  riskScore: number;
  riskLevel: SeverityLevel;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  assignedOfficer: string;
  assignedOfficerId: string;
  alerts: RiskAlert[];
  legalIssues: LegalConflict[];
  fieldObservations: FieldObservation[];
  evidenceDocuments: EvidenceDocument[];
  description: string;
  priority: SeverityLevel;
}

export type CaseStatus =
  | "NEW"
  | "AI_FLAGGED"
  | "UNDER_REVIEW"
  | "FIELD_VERIFICATION"
  | "LEGAL_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

// ============================================================
// DASHBOARD STATS
// ============================================================

export interface DashboardStats {
  totalMonitoredParcels: number;
  highRiskParcels: number;
  pendingFieldVerification: number;
  mutationDiscrepancies: number;
  potentialEncroachments: number;
  legalConflicts: number;
  evidenceDossiers: number;
  activeCases: number;
}
