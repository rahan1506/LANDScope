import { Request, Response } from "express";
import { CaseRepository } from "../repositories/caseRepository";
import { ParcelRepository } from "../repositories/parcelRepository";
import { CaseStatus, SeverityLevel } from "../types";
import { sendSuccess, sendError } from "../utils/response";

export class CaseController {
  static async listCases(req: Request, res: Response) {
    const { status, priority } = req.query as {
      status?: CaseStatus;
      priority?: SeverityLevel;
    };

    const cases = await CaseRepository.findAll(status, priority);
    return sendSuccess(res, cases, "Cases retrieved successfully", 200, {
      total: cases.length,
    });
  }

  static async getCaseById(req: Request, res: Response) {
    const id = req.params.id as string;
    const landCase = await CaseRepository.findById(id);
    if (!landCase) {
      return sendError(res, `Case ${id} not found`, 404);
    }
    return sendSuccess(res, landCase);
  }

  static async createCase(req: any, res: Response) {
    const { parcelId, priority, description } = req.body;

    if (!parcelId) {
      return sendError(res, "parcelId is required", 400);
    }

    const parcel = await ParcelRepository.findById(parcelId);
    if (!parcel) {
      return sendError(res, `Target parcel ${parcelId} not found`, 404);
    }

    const caseCount = (await CaseRepository.findAll()).length + 1;
    const newCase = await CaseRepository.create({
      id: `case-${Date.now()}`,
      caseId: `CASE-2024-00${caseCount}`,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      location: {
        village: parcel.village,
        taluk: parcel.taluk,
        district: parcel.district,
        state: parcel.state,
        coordinates: parcel.centroid,
      },
      riskScore: 78,
      riskLevel: priority || "HIGH",
      status: "NEW",
      priority: priority || "HIGH",
      assignedOfficer: req.user?.name || "Authorized Revenue Officer",
      assignedOfficerId: req.user?.id || "usr_officer",
      description: description || `Cadastral enforcement investigation initiated for Survey ${parcel.surveyNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return sendSuccess(res, newCase, "Case initiated successfully", 201);
  }

  static async updateStatus(req: Request, res: Response) {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      return sendError(res, "status is required", 400);
    }

    const updated = await CaseRepository.updateStatus(id, status as CaseStatus);
    if (!updated) {
      return sendError(res, `Case ${id} not found`, 404);
    }

    return sendSuccess(res, updated, `Case status updated to ${status}`);
  }
}
