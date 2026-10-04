/**
 * LANDScope — Demo Data Service for Land Governance
 * Realistic Indian cadastral parcels, temporal satellite changes, mutations,
 * field observations, cases, and risk alerts.
 * All records clearly flagged with `isDemo: true`.
 */

import {
  ULPINRecord,
  MutationRecord,
  SatelliteObservation,
  ChangeDetection,
  DiscrepancyScore,
  RiskAlert,
  LandCase,
  FieldObservation,
  EvidenceDocument,
  DashboardStats,
  EvidenceDossier,
  SeverityLevel,
  CaseStatus,
} from "./types";
import { DEMO_LEGAL_ACTS, DEMO_LEGAL_SECTIONS, DEMO_LEGAL_CONFLICTS } from "./legal-knowledge";
import { generateSha256Hex, generateSvgQrCode } from "./hash-utils";

// ============================================================
// 1. DEMO PARCELS (Realistic Indian Cadastral Parcels)
// ============================================================

export const DEMO_PARCELS: ULPINRecord[] = [
  {
    id: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    surveyNumber: "142/3A",
    village: "Devanahalli Rural",
    taluk: "Devanahalli",
    district: "Bengaluru Rural",
    state: "Karnataka",
    ownerName: "Rameshwar Rao & Brothers",
    registeredAreaHa: 2.45,
    landUseClassification: "Agricultural",
    registrationDate: "2018-04-12",
    lastMutationDate: "2024-01-15",
    coordinates: { lat: 13.2458, lng: 77.7126 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [77.7118, 13.2451],
          [77.7135, 13.2451],
          [77.7137, 13.2466],
          [77.7121, 13.2467],
          [77.7118, 13.2451],
        ],
      ],
    },
    isDemo: true,
  },
  {
    id: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    surveyNumber: "88/1B/2",
    village: "Wagholi",
    taluk: "Haveli",
    district: "Pune",
    state: "Maharashtra",
    ownerName: "Anand Urban Developers LLP",
    registeredAreaHa: 1.18,
    landUseClassification: "Mixed",
    registrationDate: "2021-09-20",
    lastMutationDate: "2023-11-04",
    coordinates: { lat: 18.5793, lng: 73.9785 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [73.9778, 18.5786],
          [73.9792, 18.5788],
          [73.9791, 18.5801],
          [73.9776, 18.5799],
          [73.9778, 18.5786],
        ],
      ],
    },
    isDemo: true,
  },
  {
    id: "parcel-003",
    ulpin: "TS-HYD-SER-2024-09821",
    surveyNumber: "45/A",
    village: "Gachibowli",
    taluk: "Serilingampally",
    district: "Rangareddy",
    state: "Telangana",
    ownerName: "Krishna Murthy Agro Holdings",
    registeredAreaHa: 3.82,
    landUseClassification: "Agricultural",
    registrationDate: "2015-06-18",
    lastMutationDate: "2024-02-28",
    coordinates: { lat: 17.4399, lng: 78.3489 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [78.3475, 17.4388],
          [78.3503, 17.4392],
          [78.3501, 17.4411],
          [78.3472, 17.4407],
          [78.3475, 17.4388],
        ],
      ],
    },
    isDemo: true,
  },
  {
    id: "parcel-004",
    ulpin: "DL-SWD-NAJ-2024-00312",
    surveyNumber: "12/4/1",
    village: "Najafgarh",
    taluk: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    ownerName: "Om Prakash Verma",
    registeredAreaHa: 0.85,
    landUseClassification: "Wetland",
    registrationDate: "2012-03-10",
    lastMutationDate: "2023-08-19",
    coordinates: { lat: 28.6092, lng: 76.9854 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [76.9845, 28.6085],
          [76.9862, 28.6087],
          [76.9861, 28.6099],
          [76.9843, 28.6097],
          [76.9845, 28.6085],
        ],
      ],
    },
    isDemo: true,
  },
  {
    id: "parcel-005",
    ulpin: "KL-EKM-KNP-2024-01205",
    surveyNumber: "204/8",
    village: "Maradu",
    taluk: "Kanayannur",
    district: "Ernakulam",
    state: "Kerala",
    ownerName: "Coastal Green Estates Ltd.",
    registeredAreaHa: 1.62,
    landUseClassification: "Forest",
    registrationDate: "2019-11-22",
    lastMutationDate: "2024-03-01",
    coordinates: { lat: 9.9248, lng: 76.3265 },
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [
        [
          [76.3255, 9.9240],
          [76.3276, 9.9242],
          [76.3274, 9.9257],
          [76.3252, 9.9255],
          [76.3255, 9.9240],
        ],
      ],
    },
    isDemo: true,
  },
];

// ============================================================
// 2. DEMO MUTATIONS (Registered Revenue Mutations)
// ============================================================

export const DEMO_MUTATIONS: MutationRecord[] = [
  {
    id: "mut-001",
    mutationId: "MUT-2024-BLR-0182",
    parcelId: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    oldAreaHa: 2.45,
    newAreaHa: 2.15,
    mutationDate: "2024-01-15",
    mutationType: "Partition",
    status: "Completed",
    source: "Bhoomi Karnataka Portal",
    registrationNumber: "REG/2024/DEV/9912",
    referenceNumber: "TAH/DEV/MUT/441/2023",
    oldOwner: "Rameshwar Rao & Brothers",
    newOwner: "Rameshwar Rao (0.95 Ha) & Suresh Rao (1.20 Ha)",
    remarks: "Partition deed sub-division executed; 0.30 Ha remaining unrecorded / disputed corridor",
    isDemo: true,
  },
  {
    id: "mut-002",
    mutationId: "MUT-2023-PUN-8419",
    parcelId: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    oldAreaHa: 1.18,
    newAreaHa: 1.18,
    mutationDate: "2023-11-04",
    mutationType: "Sale",
    status: "Under_Review",
    source: "Mahabhulekh 7/12",
    registrationNumber: "HAV/SRO-4/2023/11029",
    referenceNumber: "REV/HAV/APPEAL/12/2023",
    oldOwner: "Babanrao Jagtap",
    newOwner: "Anand Urban Developers LLP",
    remarks: "Non-agricultural (NA) conversion permission pending with Collector Pune; commercial excavation reported",
    isDemo: true,
  },
  {
    id: "mut-003",
    mutationId: "MUT-2024-HYD-5021",
    parcelId: "parcel-003",
    ulpin: "TS-HYD-SER-2024-09821",
    oldAreaHa: 3.82,
    newAreaHa: 3.82,
    mutationDate: "2024-02-28",
    mutationType: "Court_Order",
    status: "Pending",
    source: "Dharani Portal Telangana",
    registrationNumber: "TS-DHA-SER-2024-771",
    referenceNumber: "OS/412/2023 City Civil Court",
    oldOwner: "Krishna Murthy Agro Holdings",
    newOwner: "Telangana State Industrial Infrastructure Corp",
    remarks: "Interim injunction against alienating lake buffer zone land in Survey 45/A",
    isDemo: true,
  },
];

// ============================================================
// 3. SATELLITE OBSERVATIONS (Sentinel-2 / PlanetScope)
// ============================================================

export const DEMO_OBSERVATIONS: SatelliteObservation[] = [
  {
    id: "obs-001",
    parcelId: "parcel-001",
    observationDate: "2023-01-10",
    source: "Copernicus Sentinel-2 L2A",
    resolution: "10m Multispectral",
    ndviValue: 0.68,
    ndbiValue: -0.32,
    vegetationCoverPct: 82.5,
    builtUpPct: 4.2,
    waterbodyCoverPct: 0.0,
    barrenPct: 13.3,
    cloudCoverPct: 1.2,
    isDemo: true,
  },
  {
    id: "obs-002",
    parcelId: "parcel-001",
    observationDate: "2024-02-20",
    source: "Copernicus Sentinel-2 L2A",
    resolution: "10m Multispectral",
    ndviValue: 0.31,
    ndbiValue: 0.28,
    vegetationCoverPct: 28.0,
    builtUpPct: 56.4,
    waterbodyCoverPct: 0.0,
    barrenPct: 15.6,
    cloudCoverPct: 0.4,
    isDemo: true,
  },
  {
    id: "obs-003",
    parcelId: "parcel-004",
    observationDate: "2022-10-15",
    source: "Sentinel-2 MSI",
    resolution: "10m",
    ndviValue: 0.52,
    ndbiValue: -0.45,
    vegetationCoverPct: 45.0,
    builtUpPct: 2.1,
    waterbodyCoverPct: 48.0,
    barrenPct: 4.9,
    cloudCoverPct: 0.0,
    isDemo: true,
  },
  {
    id: "obs-004",
    parcelId: "parcel-004",
    observationDate: "2024-01-30",
    source: "Sentinel-2 MSI",
    resolution: "10m",
    ndviValue: 0.18,
    ndbiValue: 0.41,
    vegetationCoverPct: 12.0,
    builtUpPct: 62.0,
    waterbodyCoverPct: 14.0,
    barrenPct: 12.0,
    cloudCoverPct: 0.0,
    isDemo: true,
  },
];

// ============================================================
// 4. TEMPORAL CHANGE DETECTIONS
// ============================================================

export const DEMO_CHANGES: ChangeDetection[] = [
  {
    id: "chg-001",
    parcelId: "parcel-001",
    detectionDate: "2024-02-25",
    changeType: "built_up_expansion",
    severity: "HIGH",
    confidence: 0.94,
    description: "Rapid warehouse construction detected on registered agricultural land. NDBI increased by +0.60; vegetation dropped 54.5%.",
    ndviChange: -0.37,
    ndbiChange: 0.60,
    vegetationLossPct: 54.5,
    builtUpExpansionPct: 52.2,
    waterbodyShrinkagePct: 0.0,
    boundaryDriftMeters: 4.2,
    newStructuralGrowth: true,
    areaAffectedHa: 1.28,
    previousImageDate: "2023-01-10",
    currentImageDate: "2024-02-20",
    isDemo: true,
  },
  {
    id: "chg-002",
    parcelId: "parcel-004",
    detectionDate: "2024-02-15",
    changeType: "encroachment",
    severity: "CRITICAL",
    confidence: 0.96,
    description: "Illegal filling and plinth laying on protected Najafgarh wetland drain corridor. Waterbody area dropped 34%.",
    ndviChange: -0.34,
    ndbiChange: 0.86,
    vegetationLossPct: 33.0,
    builtUpExpansionPct: 59.9,
    waterbodyShrinkagePct: 34.0,
    boundaryDriftMeters: 12.8,
    newStructuralGrowth: true,
    areaAffectedHa: 0.53,
    previousImageDate: "2022-10-15",
    currentImageDate: "2024-01-30",
    isDemo: true,
  },
  {
    id: "chg-003",
    parcelId: "parcel-002",
    detectionDate: "2024-01-12",
    changeType: "boundary_drift",
    severity: "MEDIUM",
    confidence: 0.88,
    description: "Perimeter boundary wall drifted 6.4 meters eastward into adjoining government survey gaothan parcel.",
    ndviChange: -0.12,
    ndbiChange: 0.31,
    vegetationLossPct: 14.0,
    builtUpExpansionPct: 18.5,
    waterbodyShrinkagePct: 0.0,
    boundaryDriftMeters: 6.4,
    newStructuralGrowth: true,
    areaAffectedHa: 0.22,
    previousImageDate: "2023-05-10",
    currentImageDate: "2024-01-05",
    isDemo: true,
  },
  {
    id: "chg-004",
    parcelId: "parcel-005",
    detectionDate: "2024-03-05",
    changeType: "vegetation_loss",
    severity: "CRITICAL",
    confidence: 0.92,
    description: "Mangrove canopy clearance along Vembanad tidal influence zone. Breach of CRZ Notification 2019 Category I-A.",
    ndviChange: -0.48,
    ndbiChange: 0.22,
    vegetationLossPct: 61.2,
    builtUpExpansionPct: 12.0,
    waterbodyShrinkagePct: 8.0,
    boundaryDriftMeters: 2.1,
    newStructuralGrowth: false,
    areaAffectedHa: 0.98,
    previousImageDate: "2023-08-14",
    currentImageDate: "2024-02-28",
    isDemo: true,
  },
];

// ============================================================
// 5. RISK ALERTS
// ============================================================

export const DEMO_RISK_ALERTS: RiskAlert[] = [
  {
    id: "alert-001",
    parcelId: "parcel-004",
    ulpin: "DL-SWD-NAJ-2024-00312",
    severity: "CRITICAL",
    title: "Protected Wetland Fill & Construction Detected",
    description: "Copernicus Sentinel-2 MSI and PlanetScope imagery shows 59.9% built-up expansion on eco-sensitive wetland. Potential breach of Wetlands Rules 2017.",
    location: "Najafgarh, South West Delhi",
    evidence: "NDBI shifted from -0.45 to +0.41. 0.53 Ha waterbody reclaimed.",
    confidence: 0.96,
    timestamp: "2024-02-15T09:30:00Z",
    recommendedAction: "Issue immediate stop-work order; dispatch Revenue Inspector with Delhi Pollution Control Committee team.",
    category: "waterbody_encroachment",
    isAcknowledged: false,
  },
  {
    id: "alert-002",
    parcelId: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    severity: "HIGH",
    title: "Unrecorded Commercial Conversion on Agricultural Land",
    description: "Large shed structures (56.4% footprint) detected on parcel registered as pure agricultural in Bhoomi database.",
    location: "Devanahalli Rural, Bengaluru Rural",
    evidence: "Vegetation loss -54.5%; NDBI +0.60; No Non-Agricultural (NA) order recorded in Bhoomi.",
    confidence: 0.94,
    timestamp: "2024-02-25T11:15:00Z",
    recommendedAction: "Verify conversion challan and order Patwari ground inspection via Bhu-Mitra.",
    category: "built_up_in_protected",
    isAcknowledged: false,
  },
  {
    id: "alert-003",
    parcelId: "parcel-005",
    ulpin: "KL-EKM-KNP-2024-01205",
    severity: "CRITICAL",
    title: "Mangrove Clearance in Coastal Regulation Zone (CRZ-I)",
    description: "Sentinel-2 NDVI drop of 0.48 indicates clear-felling of tidal mangroves without KCZMA clearance.",
    location: "Maradu, Kanayannur, Ernakulam",
    evidence: "Multi-temporal NDVI time-series shows steep decline from 0.74 to 0.26 over 6 months.",
    confidence: 0.92,
    timestamp: "2024-03-05T08:00:00Z",
    recommendedAction: "Notify Kerala Coastal Zone Management Authority & Forest Range Officer for immediate seizure.",
    category: "vegetation_change",
    isAcknowledged: true,
    acknowledgedBy: "Dr. K. S. Menon (Forest Officer)",
    acknowledgedAt: "2024-03-06T10:15:00Z",
  },
  {
    id: "alert-004",
    parcelId: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    severity: "MEDIUM",
    title: "Perimeter Encroachment into Gaothan Boundary",
    description: "New structural wall extends 6.4 meters beyond cadastral shapefile boundary into community common land.",
    location: "Wagholi, Haveli, Pune",
    evidence: "Drone-assisted vector comparison against Mahabhulekh cadastre indicates 0.22 Ha overlap.",
    confidence: 0.88,
    timestamp: "2024-01-12T14:45:00Z",
    recommendedAction: "Order joint survey with Talathi and Haveli Municipal Corporation surveyor.",
    category: "boundary_drift",
    isAcknowledged: false,
  },
];

// ============================================================
// 6. EVIDENCE DOCUMENTS
// ============================================================

export const DEMO_EVIDENCE_DOCUMENTS: EvidenceDocument[] = [
  {
    id: "doc-001",
    documentId: "DOC-2024-BHOOMI-7712",
    fileName: "bhoomi_karnataka_rtc_142_3a.pdf",
    fileType: "application/pdf",
    fileSize: 421800,
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    creationTimestamp: "2024-01-15T09:00:00Z",
    source: "Bhoomi Revenue Record Repository",
    uploadedBy: "Tahsildar Devanahalli",
    version: 1,
    metadata: {
      surveyNumber: "142/3A",
      village: "Devanahalli Rural",
      state: "Karnataka",
      watermark: "OFFICIAL_RECORD_COPY",
    },
    category: "land_document",
  },
  {
    id: "doc-002",
    documentId: "DOC-2024-S2-GEO-993",
    fileName: "sentinel2_ndvi_difference_geotiff.tif",
    fileType: "image/tiff",
    fileSize: 18450000,
    sha256Hash: "8f434346648f6b96df89dda901c5176b10e6d83961dd3c1ac88b59b2dc327aa4",
    creationTimestamp: "2024-02-20T16:30:00Z",
    source: "ESA Copernicus Sentinel-2 L2A Pipeline",
    uploadedBy: "LANDScope Sentinel Bot",
    version: 1,
    metadata: {
      granuleId: "T43PGT_20240220T050901",
      cloudCover: "0.4%",
      spectralBands: "B4, B8, B11",
    },
    category: "satellite_image",
  },
  {
    id: "doc-003",
    documentId: "DOC-2024-FIELD-PHOTO-01",
    fileName: "patwari_ground_survey_plinth.jpg",
    fileType: "image/jpeg",
    fileSize: 3120400,
    sha256Hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    creationTimestamp: "2024-02-26T11:20:00Z",
    source: "Bhu-Mitra PWA (Offline GPS Tagged)",
    uploadedBy: "M. Gowda (Village Accountant)",
    version: 1,
    metadata: {
      gpsAccuracy: "3.2m",
      compassAzimuth: "142° SE",
      device: "Samsung Galaxy XCover 5 (Android 13)",
    },
    category: "field_photograph",
  },
];

// ============================================================
// 7. FIELD OBSERVATIONS (Bhu-Mitra Field Reports)
// ============================================================

export const DEMO_FIELD_OBSERVATIONS: FieldObservation[] = [
  {
    id: "field-001",
    caseId: "CASE-2024-001",
    parcelId: "parcel-001",
    observerId: "usr-va-014",
    observerName: "M. Gowda (Patwari / Village Accountant)",
    observerRole: "patwari",
    timestamp: "2024-02-26T11:20:00Z",
    gpsCoordinates: { lat: 13.2459, lng: 77.7128 },
    gpsAccuracy: 3.2,
    compassOrientation: 142,
    photos: [
      {
        id: "photo-001",
        dataUrl: "",
        timestamp: "2024-02-26T11:20:15Z",
        latitude: 13.2459,
        longitude: 77.7128,
        orientation: 142,
        deviceInfo: "Samsung Galaxy XCover 5",
        caseId: "CASE-2024-001",
        parcelId: "parcel-001",
      },
    ],
    boundaryPoints: [
      { lat: 13.2451, lng: 77.7118 },
      { lat: 13.2451, lng: 77.7135 },
      { lat: 13.2466, lng: 77.7137 },
      { lat: 13.2467, lng: 77.7121 },
    ],
    observations: "Ground inspection confirms ongoing pre-engineered steel warehouse assembly. No agricultural crop present. Foundation covers ~1.2 Ha.",
    notes: "Site manager presented an unverified application receipt. No sanctioned NA conversion order produced.",
    syncStatus: "synced",
    deviceInfo: "Bhu-Mitra PWA v1.0.4 - Chrome Mobile",
  },
  {
    id: "field-002",
    caseId: "CASE-2024-002",
    parcelId: "parcel-004",
    observerId: "usr-rev-099",
    observerName: "S. K. Sharma (Kanoongo / Revenue Inspector)",
    observerRole: "village_officer",
    timestamp: "2024-02-18T14:10:00Z",
    gpsCoordinates: { lat: 28.6091, lng: 76.9855 },
    gpsAccuracy: 2.8,
    compassOrientation: 210,
    photos: [],
    boundaryPoints: [
      { lat: 28.6085, lng: 76.9845 },
      { lat: 28.6087, lng: 76.9862 },
      { lat: 28.6099, lng: 76.9861 },
      { lat: 28.6097, lng: 76.9843 },
    ],
    observations: "Debris and construction waste being dumped directly into the Najafgarh wetland feeder channel. Earthmovers present on site.",
    notes: "Immediate police intervention requested. Notice pasted on site hoarding.",
    syncStatus: "synced",
    deviceInfo: "Bhu-Mitra PWA v1.0.4 - Offline Sync",
  },
];

// ============================================================
// 8. LAND CASES (Case Management Lifecycle)
// ============================================================

export const DEMO_CASES: LandCase[] = [
  {
    id: "case-001",
    caseId: "CASE-2024-001",
    parcelId: "parcel-001",
    ulpin: "KA-BLR-DEV-2024-00189",
    surveyNumber: "142/3A",
    location: {
      village: "Devanahalli Rural",
      taluk: "Devanahalli",
      district: "Bengaluru Rural",
      state: "Karnataka",
      coordinates: { lat: 13.2458, lng: 77.7126 },
    },
    riskScore: 84,
    riskLevel: "HIGH",
    status: "FIELD_VERIFICATION",
    createdAt: "2024-02-25T11:30:00Z",
    updatedAt: "2024-02-26T12:00:00Z",
    assignedOfficer: "M. Gowda (Village Accountant)",
    assignedOfficerId: "usr-va-014",
    alerts: [DEMO_RISK_ALERTS[1]],
    legalIssues: [DEMO_LEGAL_CONFLICTS[0]],
    fieldObservations: [DEMO_FIELD_OBSERVATIONS[0]],
    evidenceDocuments: [DEMO_EVIDENCE_DOCUMENTS[0], DEMO_EVIDENCE_DOCUMENTS[1], DEMO_EVIDENCE_DOCUMENTS[2]],
    description: "Commercial warehouse erection detected on agricultural parcel 142/3A without Section 95 KLR Act non-agricultural conversion permission.",
    priority: "HIGH",
  },
  {
    id: "case-002",
    caseId: "CASE-2024-002",
    parcelId: "parcel-004",
    ulpin: "DL-SWD-NAJ-2024-00312",
    surveyNumber: "12/4/1",
    location: {
      village: "Najafgarh",
      taluk: "Najafgarh",
      district: "South West Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6092, lng: 76.9854 },
    },
    riskScore: 96,
    riskLevel: "CRITICAL",
    status: "LEGAL_REVIEW",
    createdAt: "2024-02-15T09:45:00Z",
    updatedAt: "2024-02-18T15:00:00Z",
    assignedOfficer: "Dr. Aarti Singhal (SDM Najafgarh)",
    assignedOfficerId: "usr-sdm-002",
    alerts: [DEMO_RISK_ALERTS[0]],
    legalIssues: [DEMO_LEGAL_CONFLICTS[2]],
    fieldObservations: [DEMO_FIELD_OBSERVATIONS[1]],
    evidenceDocuments: [DEMO_EVIDENCE_DOCUMENTS[1]],
    description: "Active wetland reclamation and unapproved plinth work on Najafgarh eco-fragile buffer. Violates Wetlands Rules 2017 & EPA 1986.",
    priority: "CRITICAL",
  },
  {
    id: "case-003",
    caseId: "CASE-2024-003",
    parcelId: "parcel-005",
    ulpin: "KL-EKM-KNP-2024-01205",
    surveyNumber: "204/8",
    location: {
      village: "Maradu",
      taluk: "Kanayannur",
      district: "Ernakulam",
      state: "Kerala",
      coordinates: { lat: 9.9248, lng: 76.3265 },
    },
    riskScore: 92,
    riskLevel: "CRITICAL",
    status: "UNDER_REVIEW",
    createdAt: "2024-03-05T08:15:00Z",
    updatedAt: "2024-03-06T10:15:00Z",
    assignedOfficer: "Dr. K. S. Menon (Forest Officer)",
    assignedOfficerId: "usr-fo-088",
    alerts: [DEMO_RISK_ALERTS[2]],
    legalIssues: [DEMO_LEGAL_CONFLICTS[3]],
    fieldObservations: [],
    evidenceDocuments: [],
    description: "Clearance of mangrove green belt along Vembanad tidal line in violation of CRZ-I regulations and Forest Conservation Act.",
    priority: "CRITICAL",
  },
  {
    id: "case-004",
    caseId: "CASE-2024-004",
    parcelId: "parcel-002",
    ulpin: "MH-PUN-HAV-2023-04912",
    surveyNumber: "88/1B/2",
    location: {
      village: "Wagholi",
      taluk: "Haveli",
      district: "Pune",
      state: "Maharashtra",
      coordinates: { lat: 18.5793, lng: 73.9785 },
    },
    riskScore: 68,
    riskLevel: "MEDIUM",
    status: "NEW",
    createdAt: "2024-01-12T15:00:00Z",
    updatedAt: "2024-01-12T15:00:00Z",
    assignedOfficer: "Vikram Jadhav (Talathi Wagholi)",
    assignedOfficerId: "usr-tal-042",
    alerts: [DEMO_RISK_ALERTS[3]],
    legalIssues: [DEMO_LEGAL_CONFLICTS[1]],
    fieldObservations: [],
    evidenceDocuments: [],
    description: "Boundary wall misalignment and 6.4m encroachment into village gaothan common grazing path.",
    priority: "MEDIUM",
  },
];

// ============================================================
// 9. DASHBOARD STATS
// ============================================================

export const DEMO_STATS: DashboardStats = {
  totalMonitoredParcels: 14280,
  highRiskParcels: 38,
  pendingFieldVerification: 14,
  mutationDiscrepancies: 52,
  potentialEncroachments: 27,
  legalConflicts: 19,
  evidenceDossiers: 12,
  activeCases: 4,
};

// ============================================================
// 10. HELPER FUNCTIONS & QUERY METHODS
// ============================================================

export function getParcels(): ULPINRecord[] {
  return DEMO_PARCELS;
}

export function getParcelByUlpin(ulpin: string): ULPINRecord | undefined {
  return DEMO_PARCELS.find(
    (p) => p.ulpin.toLowerCase() === ulpin.trim().toLowerCase()
  );
}

export function getParcelById(id: string): ULPINRecord | undefined {
  return DEMO_PARCELS.find((p) => p.id === id);
}

export function getMutations(parcelId?: string): MutationRecord[] {
  if (parcelId) {
    return DEMO_MUTATIONS.filter((m) => m.parcelId === parcelId);
  }
  return DEMO_MUTATIONS;
}

export function getSatelliteObservations(parcelId: string): SatelliteObservation[] {
  return DEMO_OBSERVATIONS.filter((o) => o.parcelId === parcelId);
}

export function getChangeDetections(parcelId?: string): ChangeDetection[] {
  if (parcelId) {
    return DEMO_CHANGES.filter((c) => c.parcelId === parcelId);
  }
  return DEMO_CHANGES;
}

export function getDiscrepancyForParcel(parcelId: string): DiscrepancyScore {
  const parcel = getParcelById(parcelId);
  const changes = getChangeDetections(parcelId);
  const mutations = getMutations(parcelId);

  const highestChange = changes.reduce(
    (max, c) => (c.severity === "CRITICAL" ? 40 : c.severity === "HIGH" ? 30 : 15),
    10
  );

  const mutationFactor = mutations.some((m) => m.status === "Under_Review" || m.status === "Pending")
    ? 25
    : 10;

  const totalScore = Math.min(100, highestChange + mutationFactor + (parcel?.landUseClassification === "Agricultural" ? 25 : 15));
  const level: SeverityLevel = totalScore >= 75 ? "CRITICAL" : totalScore >= 50 ? "HIGH" : totalScore >= 25 ? "MEDIUM" : "LOW";

  return {
    totalScore,
    level,
    parcelId,
    generatedAt: new Date().toISOString(),
    factors: [
      {
        name: "Spectral Discrepancy (NDVI / NDBI)",
        score: highestChange,
        maxScore: 40,
        description: "Satellite spectral band divergence vs registered agricultural baseline.",
        evidence: changes.length > 0 ? changes[0].description : "No significant spectral shift.",
        confidence: 0.94,
      },
      {
        name: "Mutation Status Inconsistency",
        score: mutationFactor,
        maxScore: 30,
        description: "Pending or disputed non-agricultural conversion in revenue records.",
        evidence: mutations.length > 0 ? mutations[0].remarks : "Revenue records consistent.",
        confidence: 0.91,
      },
      {
        name: "Zonal Regulation & Environmental Sensitivity",
        score: parcel?.landUseClassification === "Wetland" || parcel?.landUseClassification === "Forest" ? 30 : 15,
        maxScore: 30,
        description: "Sensitivity classification per State Land Revenue Code and Environment Protection Act.",
        evidence: `Parcel designated as ${parcel?.landUseClassification ?? "General"}.`,
        confidence: 0.95,
      },
    ],
    explanation: `Discrepancy score calculated at ${totalScore}/100. Factors indicate significant divergence between physical satellite surface reflectance and official revenue master records.`,
  };
}

export function getRiskAlerts(parcelId?: string, category?: string): RiskAlert[] {
  let list = DEMO_RISK_ALERTS;
  if (parcelId) {
    list = list.filter((a) => a.parcelId === parcelId);
  }
  if (category) {
    list = list.filter((a) => a.category === category);
  }
  return list;
}

export function getCases(status?: CaseStatus, priority?: SeverityLevel): LandCase[] {
  let list = DEMO_CASES;
  if (status) {
    list = list.filter((c) => c.status === status);
  }
  if (priority) {
    list = list.filter((c) => c.priority === priority);
  }
  return list;
}

export function getCaseById(id: string): LandCase | undefined {
  return DEMO_CASES.find((c) => c.id === id || c.caseId === id);
}

export function updateCaseStatus(caseId: string, newStatus: CaseStatus): LandCase | null {
  const c = DEMO_CASES.find((item) => item.id === caseId || item.caseId === caseId);
  if (c) {
    c.status = newStatus;
    c.updatedAt = new Date().toISOString();
    return c;
  }
  return null;
}

export function getFieldObservations(caseId?: string): FieldObservation[] {
  if (caseId) {
    return DEMO_FIELD_OBSERVATIONS.filter((o) => o.caseId === caseId);
  }
  return DEMO_FIELD_OBSERVATIONS;
}

export function getEvidenceDocuments(caseId?: string): EvidenceDocument[] {
  if (caseId) {
    const c = getCaseById(caseId);
    return c ? c.evidenceDocuments : DEMO_EVIDENCE_DOCUMENTS;
  }
  return DEMO_EVIDENCE_DOCUMENTS;
}

export function getDashboardStats(): DashboardStats {
  return DEMO_STATS;
}

/**
 * Generate a complete Evidence Dossier for a case with SHA-256 integrity hash & QR Code
 */
export async function generateEvidenceDossier(caseId: string): Promise<EvidenceDossier> {
  const c = getCaseById(caseId) || DEMO_CASES[0];
  const parcel = getParcelById(c.parcelId) || DEMO_PARCELS[0];
  const changes = getChangeDetections(c.parcelId);
  const docs = c.evidenceDocuments;

  // Compute composite content string to hash
  const payloadToHash = JSON.stringify({
    caseId: c.caseId,
    ulpin: c.ulpin,
    surveyNumber: c.surveyNumber,
    location: c.location,
    docHashes: docs.map((d) => d.sha256Hash),
    timestamp: c.createdAt,
  });

  const integrityHash = await generateSha256Hex(payloadToHash);
  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/evidence/${c.caseId}`
    : `https://landscope.gov.in/verify/evidence/${c.caseId}`;

  const qrCodeSvg = generateSvgQrCode(verifyUrl);

  const dossier: EvidenceDossier = {
    id: `dossier-${c.caseId.toLowerCase()}`,
    caseId: c.caseId,
    parcelIdentity: {
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      village: parcel.village,
      taluk: parcel.taluk,
      district: parcel.district,
      state: parcel.state,
      coordinates: parcel.coordinates,
      boundaryGeoJSON: parcel.boundaryGeoJSON,
    },
    geospatialEvidence: {
      parcelBoundary: parcel.boundaryGeoJSON || null,
      satelliteImageryRefs: ["Sentinel-2 MSI 2024-02-20", "PlanetScope 3m Orthorectified"],
      historicalImageryRefs: ["Sentinel-2 MSI 2023-01-10 Baseline"],
      ndviChange: changes[0]?.ndviChange ?? -0.37,
      ndbiChange: changes[0]?.ndbiChange ?? 0.60,
      detectedChanges: changes,
      gisOverlays: ["Cadastral Layer v2.1", "State Survey & Land Records Cadastre"],
    },
    legalEvidence: {
      applicableActs: DEMO_LEGAL_ACTS.slice(0, 2),
      applicableRules: DEMO_LEGAL_SECTIONS.slice(0, 2),
      notifications: ["G.O. Ms No. 142/Revenue/2021", "MoEFCC Notification S.O. 1533(E)"],
      sourceReferences: ["Karnataka Land Revenue Code 1964 §95", "Real Estate (Regulation and Development) Act 2016 §3"],
      relevantExcerpts: [
        "No occupant of land assessed or held for the purpose of agriculture shall divert such land or any part thereof to any other purpose except with the prior permission of the Deputy Commissioner.",
      ],
    },
    documents: docs,
    timeline: [
      {
        id: "tl-01",
        date: "2023-01-10",
        type: "satellite_observation",
        title: "Baseline Satellite Capture",
        description: "Sentinel-2 Multispectral capture indicates pure green vegetative signature (NDVI 0.68).",
      },
      {
        id: "tl-02",
        date: "2024-01-15",
        type: "mutation",
        title: "Revenue Partition Recorded",
        description: "Partition deed recorded without NA conversion endorsement.",
        actor: "Devanahalli SRO",
      },
      {
        id: "tl-03",
        date: "2024-02-20",
        type: "satellite_observation",
        title: "Sentinel Anomaly Triggered",
        description: "NDBI spike +0.60, AI Sentinel flagged potential unauthorized conversion.",
      },
      {
        id: "tl-04",
        date: "2024-02-26",
        type: "field_verification",
        title: "Bhu-Mitra Ground Inspection",
        description: "Field Officer verified ongoing steel warehouse assembly with geotagged photograph.",
        actor: "M. Gowda (Patwari)",
      },
      {
        id: "tl-05",
        date: "2024-02-28",
        type: "legal_review",
        title: "Dossier Seal & Hash Anchored",
        description: "Evidence packet sealed with cryptographic SHA-256 fingerprint for judicial proceedings.",
      },
    ],
    integrityHash,
    generatedAt: new Date().toISOString(),
    generatedBy: "LANDScope Judicial Dossier Engine v2.4",
    qrCodeData: qrCodeSvg,
    status: "finalized",
  };

  return dossier;
}
