/**
 * LANDScope Sovereign Land Governance — Core Backend Domain Types
 */

export type RoleCode =
  | "RESEARCHER"
  | "POLICYMAKER"
  | "ACADEMIC_INSTITUTION"
  | "GOVERNMENT_AGENCY"
  | "INNOVATOR"
  | "PUBLIC"
  | "ADMIN"
  | "DISTRICT_OFFICER"
  | "FIELD_OFFICER"
  | "LEGAL_REVIEWER";

export type PermissionCode =
  | "parcels:read"
  | "parcels:write"
  | "sentinel:read"
  | "sentinel:write"
  | "mutations:read"
  | "mutations:write"
  | "legal:read"
  | "legal:write"
  | "evidence:read"
  | "evidence:write"
  | "field:read"
  | "field:write"
  | "cases:read"
  | "cases:write"
  | "admin:all"
  | "admin:audit";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  roleCode: RoleCode;
  organization: string;
  designation: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface GeoPoint {
  lat: number;
  lng: number;
  accuracyMeters?: number;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][]; // GeoJSON uses [lng, lat]
}

export interface GeoJSONMultiPolygon {
  type: "MultiPolygon";
  coordinates: number[][][][];
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

export interface Parcel {
  id: string;
  ulpin: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  ownerName: string;
  registeredAreaHa: number;
  observedAreaHa?: number;
  landUseClassification: LandUseType;
  registrationDate: string;
  lastMutationDate?: string;
  centroid: GeoPoint;
  boundaryGeoJSON: GeoJSONPolygon;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface Mutation {
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
  registrationNumber?: string;
  referenceNumber?: string;
  oldOwner: string;
  newOwner: string;
  remarks: string;
  isDemo: boolean;
  createdAt: string;
}

export interface SatelliteScene {
  sceneId: string;
  source: "Copernicus_Sentinel_2" | "USGS_Landsat_8_9" | "NASA_MODIS" | "DEMO_SYNTHETIC";
  acquisitionDate: string;
  cloudCoveragePct: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  resolutionMeters: number;
  bandsAvailable: string[];
  url?: string;
  processingStatus: "RAW" | "PROCESSED" | "INDEXED";
  bandValues?: {
    red: number; // Band 4 in Sentinel-2
    nir: number; // Band 8 in Sentinel-2
    swir: number; // Band 11 in Sentinel-2
    green: number; // Band 3 in Sentinel-2
  };
}

export interface SpectralAnalysis {
  parcelId: string;
  ulpin: string;
  date: string;
  sceneId: string;
  ndvi: number;
  ndbi: number;
  interpretation: string;
}

export interface NdviReport {
  parcelId: string;
  ulpin: string;
  currentNdvi: number;
  historicalNdvi: number;
  deltaNdvi: number;
  vegetationHealth: "Dense" | "Moderate" | "Sparse" | "Barren" | "Water";
  observationDates: {
    current: string;
    historical: string;
  };
  bandsUsed: string;
  confidence: number;
}

export interface NdbiReport {
  parcelId: string;
  ulpin: string;
  currentNdbi: number;
  historicalNdbi: number;
  deltaNdbi: number;
  builtUpExpansion: boolean;
  observationDates: {
    current: string;
    historical: string;
  };
  bandsUsed: string;
  confidence: number;
}

export interface ChangeDetectionResult {
  parcelId: string;
  ulpin: string;
  changeScore: number; // 0 - 100
  builtUpChangePct: number;
  vegetationChangePct: number;
  waterChangePct: number;
  boundaryDiscrepancyMeters: number;
  status: "Potential change detected" | "No significant change" | "High likelihood of unauthorized expansion";
  confidence: number;
  evidenceReferences: string[];
  analyzedAt: string;
}

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  scoreContribution: number;
  evidence: string;
}

export interface RiskScoreResult {
  score: number; // 0 - 100
  severity: SeverityLevel;
  factors: RiskFactor[];
  explanation: string;
  recommendedAction: string;
}

export type CaseStatus =
  | "NEW"
  | "AI_FLAGGED"
  | "FIELD_VERIFICATION"
  | "UNDER_REVIEW"
  | "LEGAL_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

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
    coordinates: GeoPoint;
  };
  riskScore: number;
  riskLevel: SeverityLevel;
  status: CaseStatus;
  priority: SeverityLevel;
  assignedOfficer: string;
  assignedOfficerId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalAct {
  id: string;
  name: string;
  shortName: string;
  year: number;
  jurisdiction: "central" | "state" | "local";
  region?: string;
  category: string;
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
  confidence: "verified" | "source_verification_required";
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
  citation: string;
  confidence: "verified" | "source_verification_required";
}

export interface FieldObservation {
  id: string;
  clientGeneratedId?: string;
  caseId: string;
  parcelId: string;
  observerId: string;
  observerName: string;
  timestamp: string;
  gpsCoordinates: GeoPoint;
  compassOrientation?: number;
  boundaryPoints?: GeoPoint[];
  observations: string;
  notes?: string;
  photos: {
    photoId: string;
    url: string;
    sha256Hash: string;
    timestamp: string;
    coordinates?: GeoPoint;
  }[];
  syncStatus: "synced" | "pending" | "failed";
  deviceInfo: string;
}

export interface GroundSatelliteAlignmentResult {
  alignmentScore: number; // 0 - 100
  distanceDifferenceMeters: number;
  boundaryDifferencePct: number;
  potentialDiscrepancy: boolean;
  confidence: number;
  notes: string;
  disclaimer: "Analytical aid only; not conclusive legal proof";
}

export interface EvidenceDocument {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sha256Hash: string;
  source: string;
  uploadedBy: string;
  timestamp: string;
}

export interface EvidenceDossierManifest {
  caseId: string;
  ulpin: string;
  packageHash: string;
  generatedAt: string;
  generatedBy: string;
  verificationUrl: string;
  documents: EvidenceDocument[];
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    hashRef?: string;
  }[];
  status: "VALID" | "TAMPERED";
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress?: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  timestamp: string;
}
