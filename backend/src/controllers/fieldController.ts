import { Request, Response } from "express";
import { FieldSyncService } from "../field/fieldSyncService";
import { GroundSatelliteAligner } from "../field/groundSatelliteAligner";
import { ParcelRepository } from "../repositories/parcelRepository";
import { sendSuccess, sendError } from "../utils/response";

export class FieldController {
  static async createObservation(req: any, res: Response) {
    const input = {
      ...req.body,
      observerId: req.user?.id || req.body.observerId,
      observerName: req.user?.name || req.body.observerName,
    };

    const { observation, isDuplicate } = await FieldSyncService.ingestObservation(input);

    return sendSuccess(
      res,
      { observation, isDuplicate },
      isDuplicate ? "Observation already synchronized (duplicate skipped)" : "Observation recorded",
      isDuplicate ? 200 : 201
    );
  }

  static async batchSync(req: Request, res: Response) {
    const { observations } = req.body;
    if (!Array.isArray(observations)) {
      return sendError(res, "'observations' array is required for batch sync", 400);
    }

    const result = await FieldSyncService.syncBatch(observations);
    return sendSuccess(res, result, "Offline batch synchronization completed");
  }

  static async getObservationById(req: Request, res: Response) {
    const id = req.params.id as string;
    const observation = FieldSyncService.getObservationById(id);
    if (!observation) {
      return sendError(res, `Field observation ${id} not found`, 404);
    }
    return sendSuccess(res, observation);
  }

  static async attachPhoto(req: any, res: Response) {
    const id = req.params.id as string;
    const { photoBase64, coordinates } = req.body;

    if (!photoBase64) {
      return sendError(res, "photoBase64 data is required", 400);
    }

    try {
      const buffer = Buffer.from(photoBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
      const updated = await FieldSyncService.attachPhoto(id, buffer, coordinates);
      return sendSuccess(res, updated, "Geotagged photo attached to observation");
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async alignGroundSatellite(req: Request, res: Response) {
    const id = req.params.id as string;
    const observation = FieldSyncService.getObservationById(id);
    if (!observation) {
      return sendError(res, `Field observation ${id} not found`, 404);
    }

    const parcel = await ParcelRepository.findById(observation.parcelId);
    if (!parcel) {
      return sendError(res, `Target parcel ${observation.parcelId} not found`, 404);
    }

    const alignment = GroundSatelliteAligner.align(observation, parcel);
    return sendSuccess(res, alignment, "Ground-to-satellite alignment evaluated");
  }
}
