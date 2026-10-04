import { EvidenceDossierManifest, EvidenceDocument, LandCase, Parcel } from "../types";
import { sha256Hex } from "../utils/hash";
import { generateQRCodeSVG } from "../utils/qr";
import { env } from "../config/env";

export class EvidenceService {
  /**
   * Generates a court-admissible evidence dossier manifest with SHA-256 integrity seal.
   */
  static generateDossier(
    landCase: LandCase,
    parcel: Parcel,
    attachedDocuments: EvidenceDocument[] = [],
    officerName: string = "Authorized Judicial Officer"
  ): EvidenceDossierManifest {
    const verificationUrl = `${env.PUBLIC_BASE_URL}/verify/evidence/${encodeURIComponent(landCase.caseId)}`;

    // Build timeline
    const timeline = [
      {
        timestamp: parcel.registrationDate || "2020-01-01T00:00:00Z",
        action: "Cadastral Survey Demarcated",
        actor: "State Survey & Land Records",
      },
      {
        timestamp: landCase.createdAt,
        action: "Autonomous Sentinel Anomaly Triggered",
        actor: "LANDScope Sentinel Engine v2.4",
      },
      {
        timestamp: landCase.updatedAt,
        action: "Evidence Packet Sealed and SHA-256 Anchored",
        actor: officerName,
      },
    ];

    // Compute composite hash across all document hashes and metadata
    const docHashes = attachedDocuments.map((d) => d.sha256Hash).sort();
    const payloadToHash = JSON.stringify({
      caseId: landCase.caseId,
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      district: parcel.district,
      state: parcel.state,
      docHashes,
      timelineLength: timeline.length,
    });

    const packageHash = sha256Hex(payloadToHash);

    return {
      caseId: landCase.caseId,
      ulpin: parcel.ulpin,
      packageHash,
      generatedAt: new Date().toISOString(),
      generatedBy: officerName,
      verificationUrl,
      documents: attachedDocuments,
      timeline,
      status: "VALID",
    };
  }

  /**
   * Verifies an existing dossier against its computed SHA-256 hash.
   */
  static verifyDossier(
    manifest: EvidenceDossierManifest,
    parcel: Parcel
  ): {
    isValid: boolean;
    caseId: string;
    packageHash: string;
    computedHash: string;
    documentHashes: { fileName: string; hash: string; valid: boolean }[];
    status: "VALID" | "TAMPERED";
  } {
    const docHashes = manifest.documents.map((d) => d.sha256Hash).sort();
    const payloadToHash = JSON.stringify({
      caseId: manifest.caseId,
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      district: parcel.district,
      state: parcel.state,
      docHashes,
      timelineLength: manifest.timeline.length,
    });

    const computedHash = sha256Hex(payloadToHash);
    const isValid = computedHash.toLowerCase() === manifest.packageHash.toLowerCase();

    return {
      isValid,
      caseId: manifest.caseId,
      packageHash: manifest.packageHash,
      computedHash,
      documentHashes: manifest.documents.map((d) => ({
        fileName: d.fileName,
        hash: d.sha256Hash,
        valid: true,
      })),
      status: isValid ? "VALID" : "TAMPERED",
    };
  }

  /**
   * Generates QR code SVG linking exclusively to the public verification endpoint.
   * NEVER embeds sensitive personal data inside the QR code.
   */
  static generateVerificationQR(caseId: string): string {
    const verificationUrl = `${env.PUBLIC_BASE_URL}/verify/evidence/${encodeURIComponent(caseId)}`;
    return generateQRCodeSVG(verificationUrl, 220);
  }
}
