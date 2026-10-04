import request from "supertest";
import { createApp } from "../app";
import { calculateDistanceMeters, calculatePolygonAreaHa } from "../gis/spatialUtils";
import { calculateNdvi } from "../gis/spectral/ndvi";
import { calculateNdbi } from "../gis/spectral/ndbi";
import { MutationEngine } from "../services/mutationEngine";
import { RiskScoringService } from "../services/riskScoringService";
import { sha256Hex, verifyHash } from "../utils/hash";
import { generateQRCodeSVG } from "../utils/qr";

const app = createApp();

describe("LANDScope Sovereign Backend Test Suite", () => {
  let authToken: string;

  // 1. AUTHENTICATION & RBAC TESTS
  describe("Authentication & RBAC", () => {
    it("should authenticate demo admin officer and return JWT", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@landscope.gov.in", password: "any" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.roleCode).toBe("ADMIN");

      authToken = res.body.data.token;
    });

    it("should retrieve authenticated profile via /api/v1/auth/me", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("admin@landscope.gov.in");
    });
  });

  // 2. HEALTH CHECK
  describe("System Health Check", () => {
    it("should return healthy status across components", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
      expect(res.body.components).toBeDefined();
    });
  });

  // 3. PARCEL SEARCH & ULPIN TESTS
  describe("Parcels & ULPIN Resolution", () => {
    it("should list cadastral parcels", async () => {
      const res = await request(app)
        .get("/api/v1/parcels")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should resolve ULPIN record without inventing numbers", async () => {
      const ulpin = "KA-BLR-DEV-2024-00189";
      const res = await request(app)
        .get(`/api/v1/ulpin/${ulpin}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.ulpin).toBe(ulpin);
      expect(res.body.data.isValidChecksum).toBe(true);
    });
  });

  // 4. SPECTRAL NDVI & NDBI TESTS
  describe("Spectral Telemetry (NDVI & NDBI)", () => {
    it("should verify mathematical NDVI formula: (NIR - Red) / (NIR + Red)", () => {
      const red = 0.1;
      const nir = 0.7;
      const ndvi = calculateNdvi(nir, red);
      expect(ndvi).toBe(0.75); // (0.7 - 0.1) / (0.7 + 0.1) = 0.6 / 0.8 = 0.75
    });

    it("should verify mathematical NDBI formula: (SWIR - NIR) / (SWIR + NIR)", () => {
      const swir = 0.6;
      const nir = 0.4;
      const ndbi = calculateNdbi(swir, nir);
      expect(ndbi).toBe(0.2); // (0.6 - 0.4) / (0.6 + 0.4) = 0.2 / 1.0 = 0.2
    });

    it("should retrieve empirical NDVI report for parcel", async () => {
      const res = await request(app)
        .get("/api/v1/parcels/parcel-001/ndvi")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.currentNdvi).toBeDefined();
      expect(res.body.data.historicalNdvi).toBeDefined();
      expect(res.body.data.deltaNdvi).toBeDefined();
    });

    it("should retrieve empirical NDBI report for parcel", async () => {
      const res = await request(app)
        .get("/api/v1/parcels/parcel-001/ndbi")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.currentNdbi).toBeDefined();
      expect(res.body.data.deltaNdbi).toBeDefined();
    });
  });

  // 5. CHANGE DETECTION ENGINE
  describe("Multi-Temporal Change Detection", () => {
    it("should execute change detection and return 'Potential change detected'", async () => {
      const res = await request(app)
        .post("/api/v1/change-detection/analyze")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          parcelId: "parcel-001",
          dateRange: { startDate: "2023-01-01", endDate: "2024-03-01" },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.changeScore).toBeGreaterThan(0);
      expect(res.body.data.status).toBe("Potential change detected");
      expect(res.body.data.evidenceReferences.length).toBeGreaterThan(0);
    });
  });

  // 6. MUTATION RECONCILIATION ENGINE
  describe("Mutation Reconciliation & Discrepancy Scoring", () => {
    it("should evaluate area divergence and boundary drift", () => {
      const result = MutationEngine.compare({
        registeredAreaHa: 2.0,
        observedAreaHa: 2.5,
        surveyNumber: "142/3A",
        boundaryDriftMeters: 6.2,
      });

      expect(result.discrepancyScore).toBeGreaterThan(35);
      expect(result.isAreaSignificant).toBe(true);
      expect(result.reconciliationRequired).toBe(true);
    });

    it("should test mutation compare API endpoint", async () => {
      const res = await request(app)
        .post("/api/v1/mutations/compare")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          registeredAreaHa: 1.0,
          observedAreaHa: 1.35,
          surveyNumber: "88/1",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.discrepancyScore).toBeDefined();
    });
  });

  // 7. RISK SCORING ENGINE
  describe("Centralized Risk Engine", () => {
    it("should calculate composite risk score 0 - 100 with explanation", () => {
      const result = RiskScoringService.evaluate({
        builtUpChangePct: 35.0,
        mutationMismatchPct: 15.0,
        boundaryMismatchMeters: 4.5,
        waterbodyOverlapPct: 10.0,
        isEcoSensitiveOrForest: true,
        fieldDiscrepancyReported: true,
        historicalAnomalyCount: 1,
      });

      expect(result.score).toBeGreaterThan(50);
      expect(result.severity).toBe("HIGH");
      expect(result.factors.length).toBe(6);
      expect(result.recommendedAction).toBeDefined();
    });

    it("should test /api/v1/risk/evaluate endpoint", async () => {
      const res = await request(app)
        .post("/api/v1/risk/evaluate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          builtUpChangePct: 20,
          mutationMismatchPct: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.score).toBeDefined();
    });
  });

  // 8. LEGAL KNOWLEDGE & RAG RETRIEVAL
  describe("Statutory Legal Knowledge & RAG", () => {
    it("should retrieve canonical acts with Gazette citations", async () => {
      const res = await request(app)
        .get("/api/v1/legal/acts")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].sourceDocument).toBeDefined();
    });

    it("should answer legal query grounded strictly in retrieved statutes", async () => {
      const res = await request(app)
        .post("/api/v1/legal/ask")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ question: "What is required to divert agricultural land under Section 95?" });

      expect(res.status).toBe(200);
      expect(res.body.data.answer).toBeDefined();
      expect(res.body.data.sourceCitations.length).toBeGreaterThan(0);
    });

    it("should respond with 'Unable to verify source' when no statutes match", async () => {
      const res = await request(app)
        .post("/api/v1/legal/ask")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ question: "quantum spaceship teleportation registration acts" });

      expect(res.status).toBe(200);
      expect(res.body.data.answer).toContain("Unable to verify source");
    });
  });

  // 9. EVIDENCE DOSSIER & SHA-256 INTEGRITY HASHING
  describe("Evidence Dossier & SHA-256 Verification", () => {
    it("should verify cryptographic SHA-256 hashing", () => {
      const text = "National Land Governance Sovereignty 2026";
      const hash1 = sha256Hex(text);
      const hash2 = sha256Hex(text);
      expect(hash1).toBe(hash2);
      expect(verifyHash(text, hash1)).toBe(true);
    });

    it("should generate evidence dossier and QR code", async () => {
      const res = await request(app)
        .post("/api/v1/evidence/generate/CASE-2024-001")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(201);
      expect(res.body.data.manifest.packageHash).toBeDefined();
      expect(res.body.data.qrCodeSvg).toContain("<svg");
      expect(res.body.data.verificationUrl).toContain("/verify/evidence/CASE-2024-001");
    });

    it("should publicly verify evidence dossier without authentication", async () => {
      const res = await request(app).get("/api/v1/evidence/verify/CASE-2024-001");

      expect(res.status).toBe(200);
      expect(res.body.data.valid).toBe(true);
      expect(res.body.data.packageHash).toBeDefined();
    });
  });

  // 10. BHU-MITRA OFFLINE FIELD SYNC & IDEMPOTENCY
  describe("Bhu-Mitra Offline Field Sync & Idempotency", () => {
    const clientGeneratedId = `offline-client-${Date.now()}`;

    it("should ingest field observation with clientGeneratedId", async () => {
      const res = await request(app)
        .post("/api/v1/field-observations")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientGeneratedId,
          caseId: "CASE-2024-001",
          parcelId: "parcel-001",
          observations: "Physical foundation wall erected across parcel boundary.",
          gpsCoordinates: { lat: 13.2459, lng: 77.7128 },
        });

      expect(res.status).toBe(201);
      expect(res.body.data.isDuplicate).toBe(false);
      expect(res.body.data.observation.id).toBeDefined();
    });

    it("should prevent duplicate uploads on duplicate clientGeneratedId", async () => {
      const res = await request(app)
        .post("/api/v1/field-observations")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          clientGeneratedId,
          caseId: "CASE-2024-001",
          parcelId: "parcel-001",
          observations: "Physical foundation wall erected across parcel boundary.",
          gpsCoordinates: { lat: 13.2459, lng: 77.7128 },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.isDuplicate).toBe(true);
    });

    it("should evaluate ground-to-satellite alignment", async () => {
      // First create observation
      const createRes = await request(app)
        .post("/api/v1/field-observations")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          caseId: "CASE-2024-001",
          parcelId: "parcel-001",
          observations: "Walked perimeter",
          gpsCoordinates: { lat: 13.2458, lng: 77.7126 },
        });

      const obsId = createRes.body.data.observation.id;
      const alignRes = await request(app)
        .post(`/api/v1/field-observations/${obsId}/align`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(alignRes.status).toBe(200);
      expect(alignRes.body.data.alignmentScore).toBeGreaterThan(0);
      expect(alignRes.body.data.disclaimer).toContain("Analytical aid only");
    });
  });

  // 11. SPATIAL GEOMETRY & PROXIMITY QUERIES
  describe("Spatial Geometry Calculations", () => {
    it("should compute distance accurately using Haversine formula", () => {
      const p1 = { lat: 13.2458, lng: 77.7126 };
      const p2 = { lat: 13.2459, lng: 77.7126 }; // ~11 meters difference north
      const dist = calculateDistanceMeters(p1, p2);
      expect(dist).toBeGreaterThan(5);
      expect(dist).toBeLessThan(20);
    });

    it("should compute polygon area in hectares", () => {
      const poly = {
        type: "Polygon" as const,
        coordinates: [
          [
            [77.7118, 13.2451],
            [77.7135, 13.2451],
            [77.7137, 13.2466],
            [77.7121, 13.2467],
            [77.7118, 13.2451],
          ],
        ],
      };
      const area = calculatePolygonAreaHa(poly);
      expect(area).toBeGreaterThan(1.0);
      expect(area).toBeLessThan(5.0);
    });
  });
});
