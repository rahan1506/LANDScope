import { Parcel, GeoPoint } from "../types";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export interface UlpinRecordResponse {
  ulpin: string;
  source: "GOVERNMENT_GATEWAY" | "IMPORTED_SURVEY_RECORD" | "DEMO_SIMULATION";
  isDemo: boolean;
  isValidChecksum: boolean;
  surveyNumber: string;
  location: {
    village: string;
    taluk: string;
    district: string;
    state: string;
  };
  centroid?: GeoPoint;
  registeredAreaHa: number;
  landUseClassification: string;
  verifiedAt: string;
}

export class ULPINProvider {
  /**
   * Validates standard 14-character alphanumeric ULPIN (Bhu-Aadhaar) format or State-coded format.
   * Does NOT invent official ULPINs.
   */
  static validateUlpinFormat(ulpin: string): boolean {
    if (!ulpin || typeof ulpin !== "string") return false;
    const clean = ulpin.trim();
    // Support standard 14-char alphanumeric or state-prefixed national standard format
    const standard14Regex = /^[A-Z0-9]{14}$/i;
    const stateCodedRegex = /^[A-Z]{2}-[A-Z0-9]{3,4}-[A-Z0-9]{2,4}-[0-9]{4}-[0-9]{4,6}$/i;
    return standard14Regex.test(clean) || stateCodedRegex.test(clean);
  }

  /**
   * Look up ULPIN record from government gateway or sovereign local repository.
   */
  static async resolveUlpin(ulpin: string, parcelFallback?: Parcel): Promise<UlpinRecordResponse | null> {
    const isValidFormat = this.validateUlpinFormat(ulpin);

    // If external government gateway is configured and live
    if (!env.DEMO_MODE && process.env.ULPIN_GATEWAY_URL) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${process.env.ULPIN_GATEWAY_URL}/${encodeURIComponent(ulpin)}`, {
          headers: {
            Authorization: `Bearer ${process.env.ULPIN_GATEWAY_TOKEN || ""}`,
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = (await res.json()) as any;
          return {
            ulpin: data.ulpin,
            source: "GOVERNMENT_GATEWAY",
            isDemo: false,
            isValidChecksum: true,
            surveyNumber: data.surveyNumber,
            location: data.location,
            registeredAreaHa: data.areaHa,
            landUseClassification: data.landUse,
            verifiedAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        logger.warn("Government ULPIN gateway inquiry failed, checking local registry:", err);
      }
    }

    if (parcelFallback) {
      return {
        ulpin: parcelFallback.ulpin,
        source: parcelFallback.isDemo ? "DEMO_SIMULATION" : "IMPORTED_SURVEY_RECORD",
        isDemo: parcelFallback.isDemo,
        isValidChecksum: isValidFormat,
        surveyNumber: parcelFallback.surveyNumber,
        location: {
          village: parcelFallback.village,
          taluk: parcelFallback.taluk,
          district: parcelFallback.district,
          state: parcelFallback.state,
        },
        centroid: parcelFallback.centroid,
        registeredAreaHa: parcelFallback.registeredAreaHa,
        landUseClassification: parcelFallback.landUseClassification,
        verifiedAt: new Date().toISOString(),
      };
    }

    return null;
  }
}
