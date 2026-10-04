import { Request, Response } from "express";
import { LegalKnowledgeService } from "../legal/legalKnowledgeService";
import { RagService } from "../legal/ragService";
import { ParcelRepository } from "../repositories/parcelRepository";
import { sendSuccess, sendError } from "../utils/response";

export class LegalController {
  static async listActs(req: Request, res: Response) {
    const acts = LegalKnowledgeService.getActs();
    return sendSuccess(res, acts, "Legal acts retrieved", 200, { total: acts.length });
  }

  static async getActById(req: Request, res: Response) {
    const id = req.params.id as string;
    const details = LegalKnowledgeService.getActById(id);
    if (!details) {
      return sendError(res, `Legal act ${id} not found`, 404);
    }
    return sendSuccess(res, details);
  }

  static async search(req: Request, res: Response) {
    const { q } = req.query as { q?: string };
    if (!q) {
      return sendError(res, "Search query 'q' parameter is required", 400);
    }
    const results = LegalKnowledgeService.searchLegalCorpus(q);
    return sendSuccess(res, results, "Legal corpus search completed");
  }

  static async analyzeParcel(req: Request, res: Response) {
    const { parcelId } = req.body;
    if (!parcelId) {
      return sendError(res, "parcelId is required", 400);
    }

    const parcel = await ParcelRepository.findById(parcelId);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${parcelId} not found`, 404);
    }

    const analysis = LegalKnowledgeService.analyzeParcel(parcel);
    return sendSuccess(res, analysis, "Parcel statutory diagnostic completed");
  }

  static async askLegalQuestion(req: Request, res: Response) {
    const { question } = req.body;
    if (!question) {
      return sendError(res, "question is required", 400);
    }

    try {
      const response = await RagService.askLegalQuestion(question);
      return sendSuccess(res, response, "Cited legal answer generated");
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
