import { Request, Response } from "express";
import { analyzeParcelChange } from "../gis/changeDetection/changeEngine";
import { ParcelRepository } from "../repositories/parcelRepository";
import { sendSuccess, sendError } from "../utils/response";

export class ChangeDetectionController {
  static async analyze(req: Request, res: Response) {
    const { parcelId, geometry, dateRange, imagerySource } = req.body;

    if (!parcelId) {
      return sendError(res, "parcelId is required", 400);
    }

    const parcel = await ParcelRepository.findById(parcelId);
    const targetGeometry = geometry || parcel?.boundaryGeoJSON;

    if (!targetGeometry) {
      return sendError(res, "Valid GeoJSON geometry or registered parcel is required", 400);
    }

    try {
      const result = await analyzeParcelChange({
        parcelId,
        ulpin: parcel?.ulpin,
        geometry: targetGeometry,
        dateRange: dateRange || {
          startDate: "2023-01-01",
          endDate: "2024-03-01",
        },
        imagerySource: imagerySource || "Copernicus_Sentinel_2",
      });

      return sendSuccess(res, result, "Change detection analysis completed");
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
