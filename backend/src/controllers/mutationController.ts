import { Request, Response } from "express";
import { MutationRepository } from "../repositories/mutationRepository";
import { MutationEngine } from "../services/mutationEngine";
import { sendSuccess, sendError } from "../utils/response";

export class MutationController {
  static async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const mutation = await MutationRepository.findById(id);
    if (!mutation) {
      return sendError(res, `Mutation ${id} not found`, 404);
    }
    return sendSuccess(res, mutation);
  }

  static async create(req: Request, res: Response) {
    const {
      mutationId,
      parcelId,
      ulpin,
      oldAreaHa,
      newAreaHa,
      mutationDate,
      mutationType,
      source,
      oldOwner,
      newOwner,
      remarks,
    } = req.body;

    if (!parcelId || !ulpin || oldAreaHa === undefined || newAreaHa === undefined) {
      return sendError(res, "parcelId, ulpin, oldAreaHa, and newAreaHa are required", 400);
    }

    const created = await MutationRepository.create({
      mutationId: mutationId || `MUT-${Date.now()}`,
      parcelId,
      ulpin,
      oldAreaHa: Number(oldAreaHa),
      newAreaHa: Number(newAreaHa),
      mutationDate: mutationDate || new Date().toISOString().split("T")[0],
      mutationType: mutationType || "Sale",
      status: "Pending",
      source: source || "State Revenue Registry",
      oldOwner: oldOwner || "Previous Owner",
      newOwner: newOwner || "Transferee",
      remarks: remarks || "Mutation recorded via sovereign revenue API",
      isDemo: true,
    });

    return sendSuccess(res, created, "Mutation record created successfully", 201);
  }

  static async compare(req: Request, res: Response) {
    const {
      registeredAreaHa,
      observedAreaHa,
      surveyNumber,
      mutationDate,
      isSplitOrMerge,
      boundaryDriftMeters,
    } = req.body;

    if (registeredAreaHa === undefined || observedAreaHa === undefined) {
      return sendError(res, "registeredAreaHa and observedAreaHa are required for comparison", 400);
    }

    const comparison = MutationEngine.compare({
      registeredAreaHa: Number(registeredAreaHa),
      observedAreaHa: Number(observedAreaHa),
      surveyNumber: surveyNumber || "Unknown",
      mutationDate,
      isSplitOrMerge: Boolean(isSplitOrMerge),
      boundaryDriftMeters: boundaryDriftMeters ? Number(boundaryDriftMeters) : undefined,
    });

    return sendSuccess(res, comparison, "Mutation comparison completed");
  }
}
