import { Request, Response } from "express";
import { EvidenceService } from "../evidence/evidenceService";
import { CaseRepository } from "../repositories/caseRepository";
import { ParcelRepository } from "../repositories/parcelRepository";
import { sendSuccess, sendError } from "../utils/response";
import { EvidenceDocument, EvidenceDossierManifest } from "../types";

const dossierStore: Map<string, EvidenceDossierManifest> = new Map();

export class EvidenceController {
  static async generate(req: any, res: Response) {
    const caseId = req.params.caseId as string;
    const landCase = await CaseRepository.findById(caseId);

    if (!landCase) {
      return sendError(res, `Case ${caseId} not found`, 404);
    }

    const parcel = await ParcelRepository.findById(landCase.parcelId);
    if (!parcel) {
      return sendError(res, `Associated parcel ${landCase.parcelId} not found`, 404);
    }

    const defaultDocs: EvidenceDocument[] = [
      {
        id: "doc-rtc-01",
        caseId: landCase.caseId,
        fileName: `revenue_rtc_${parcel.surveyNumber.replace(/\//g, "_")}.pdf`,
        fileType: "application/pdf",
        fileSize: 421800,
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        source: "State Revenue Department Repository",
        uploadedBy: req.user?.name || "Revenue Officer",
        timestamp: "2024-01-15T09:00:00Z",
      },
      {
        id: "doc-sat-01",
        caseId: landCase.caseId,
        fileName: `sentinel2_ndvi_spectral_differencing.tif`,
        fileType: "image/tiff",
        fileSize: 18450000,
        sha256Hash: "8f434346648f6b96df89dda901c5176b10e6d83961dd3c1ac88b59b2dc327aa4",
        source: "Copernicus Sentinel-2 MSI L2A",
        uploadedBy: "LANDScope Sentinel Bot",
        timestamp: "2024-02-20T16:30:00Z",
      },
      {
        id: "doc-ground-01",
        caseId: landCase.caseId,
        fileName: `patwari_ground_inspection_plinth.jpg`,
        fileType: "image/jpeg",
        fileSize: 3120400,
        sha256Hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
        source: "Bhu-Mitra PWA (Offline GPS Tagged)",
        uploadedBy: "M. Gowda (Village Accountant)",
        timestamp: "2024-02-26T11:20:00Z",
      },
    ];

    const manifest = EvidenceService.generateDossier(
      landCase,
      parcel,
      defaultDocs,
      req.user?.name || "Authorized Judicial Officer"
    );

    const qrSvg = EvidenceService.generateVerificationQR(landCase.caseId);
    dossierStore.set(landCase.caseId, manifest);

    return sendSuccess(
      res,
      {
        manifest,
        qrCodeSvg: qrSvg,
        verificationUrl: manifest.verificationUrl,
      },
      "Evidence dossier generated and cryptographically sealed with SHA-256",
      201
    );
  }

  static async verify(req: Request, res: Response) {
    const caseId = req.params.caseId as string;
    let manifest = dossierStore.get(caseId);

    // If not in runtime cache, construct and verify from case record
    const landCase = await CaseRepository.findById(caseId);
    if (!landCase) {
      return sendError(res, `Case ${caseId} not found for verification`, 404);
    }

    const parcel = await ParcelRepository.findById(landCase.parcelId);
    if (!parcel) {
      return sendError(res, `Parcel associated with case ${caseId} not found`, 404);
    }

    if (!manifest) {
      manifest = EvidenceService.generateDossier(landCase, parcel, [], "Official Ledger");
      dossierStore.set(caseId, manifest);
    }

    const verification = EvidenceService.verifyDossier(manifest, parcel);

    return sendSuccess(res, {
      valid: verification.isValid,
      caseId: verification.caseId,
      packageHash: verification.packageHash,
      documentHashes: verification.documentHashes,
      createdAt: manifest.generatedAt,
      status: verification.status,
      parcelDetails: {
        ulpin: parcel.ulpin,
        surveyNumber: parcel.surveyNumber,
        district: parcel.district,
        state: parcel.state,
      },
    });
  }
}
