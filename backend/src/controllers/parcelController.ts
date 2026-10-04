import { Request, Response } from "express";
import { ParcelRepository } from "../repositories/parcelRepository";
import { MutationRepository } from "../repositories/mutationRepository";
import { getParcelNdviReport } from "../gis/spectral/ndvi";
import { getParcelNdbiReport } from "../gis/spectral/ndbi";
import { ULPINProvider } from "../services/ulpinProvider";
import { sendSuccess, sendError } from "../utils/response";

export class ParcelController {
  static async listParcels(req: Request, res: Response) {
    const { query: queryStr, district, state } = req.query as {
      query?: string;
      district?: string;
      state?: string;
    };

    const parcels = await ParcelRepository.search(queryStr, district, state);
    return sendSuccess(res, parcels, "Parcels retrieved successfully", 200, {
      total: parcels.length,
    });
  }

  static async getParcelById(req: Request, res: Response) {
    const id = req.params.id as string;
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${id} not found`, 404);
    }
    return sendSuccess(res, parcel);
  }

  static async getParcelNdvi(req: Request, res: Response) {
    const id = req.params.id as string;
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${id} not found`, 404);
    }

    try {
      const report = await getParcelNdviReport(parcel.id, parcel.ulpin, parcel.centroid);
      return sendSuccess(res, report, "NDVI calculated successfully");
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getParcelNdbi(req: Request, res: Response) {
    const id = req.params.id as string;
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${id} not found`, 404);
    }

    try {
      const report = await getParcelNdbiReport(parcel.id, parcel.ulpin, parcel.centroid);
      return sendSuccess(res, report, "NDBI calculated successfully");
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getParcelUlpin(req: Request, res: Response) {
    const id = req.params.id as string;
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${id} not found`, 404);
    }

    const ulpinData = await ULPINProvider.resolveUlpin(parcel.ulpin, parcel);
    return sendSuccess(res, ulpinData, "ULPIN record verified");
  }

  static async getParcelMutations(req: Request, res: Response) {
    const id = req.params.id as string;
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) {
      return sendError(res, `Parcel with ID ${id} not found`, 404);
    }

    const mutations = await MutationRepository.findByParcelId(parcel.id);
    return sendSuccess(res, mutations, "Mutations retrieved successfully", 200, {
      total: mutations.length,
    });
  }

  static async getNearbyParcels(req: Request, res: Response) {
    const { lat, lng, radiusMeters } = req.body;
    if (lat === undefined || lng === undefined) {
      return sendError(res, "Coordinates (lat, lng) are required", 400);
    }

    const parcels = await ParcelRepository.findNearby(
      { lat: Number(lat), lng: Number(lng) },
      radiusMeters ? Number(radiusMeters) : 5000
    );
    return sendSuccess(res, parcels, "Nearby parcels retrieved", 200, {
      total: parcels.length,
    });
  }
}
