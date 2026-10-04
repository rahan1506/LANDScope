import { Request, Response } from "express";
import { ULPINProvider } from "../services/ulpinProvider";
import { ParcelRepository } from "../repositories/parcelRepository";
import { sendSuccess, sendError } from "../utils/response";

export class UlpinController {
  static async resolve(req: Request, res: Response) {
    const ulpin = req.params.ulpin as string;

    if (!ulpin) {
      return sendError(res, "ULPIN is required", 400);
    }

    const parcel = await ParcelRepository.findByUlpin(ulpin);
    const result = await ULPINProvider.resolveUlpin(ulpin, parcel || undefined);

    if (!result) {
      return sendError(res, `ULPIN ${ulpin} not found in state or central registry`, 404);
    }

    return sendSuccess(res, result, "ULPIN verification completed");
  }
}
