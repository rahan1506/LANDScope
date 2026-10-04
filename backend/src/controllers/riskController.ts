import { Request, Response } from "express";
import { RiskScoringService } from "../services/riskScoringService";
import { sendSuccess, sendError } from "../utils/response";

export class RiskController {
  static async evaluate(req: Request, res: Response) {
    const {
      mutationMismatchPct = 0,
      boundaryMismatchMeters = 0,
      builtUpChangePct = 0,
      waterbodyOverlapPct = 0,
      isEcoSensitiveOrForest = false,
      fieldDiscrepancyReported = false,
      historicalAnomalyCount = 0,
      weights,
    } = req.body;

    try {
      const evaluation = RiskScoringService.evaluate(
        {
          mutationMismatchPct: Number(mutationMismatchPct),
          boundaryMismatchMeters: Number(boundaryMismatchMeters),
          builtUpChangePct: Number(builtUpChangePct),
          waterbodyOverlapPct: Number(waterbodyOverlapPct),
          isEcoSensitiveOrForest: Boolean(isEcoSensitiveOrForest),
          fieldDiscrepancyReported: Boolean(fieldDiscrepancyReported),
          historicalAnomalyCount: Number(historicalAnomalyCount),
        },
        weights
      );

      return sendSuccess(res, evaluation, "Risk score evaluated successfully");
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
