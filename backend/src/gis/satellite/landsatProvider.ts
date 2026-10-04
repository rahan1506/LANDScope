import { SatelliteProvider, SatelliteSearchParams } from "./satelliteProvider";
import { SatelliteScene, GeoPoint } from "../../types";

export class LandsatProvider extends SatelliteProvider {
  readonly providerName = "USGS_Landsat_8_9";

  async ping(): Promise<boolean> {
    return true;
  }

  async searchScenes(params: SatelliteSearchParams): Promise<SatelliteScene[]> {
    const lat = params.point?.lat || 18.5793;
    const lng = params.point?.lng || 73.9785;

    return [
      {
        sceneId: `LC09_L1TP_146047_${params.endDate.replace(/-/g, "")}`,
        source: "USGS_Landsat_8_9",
        acquisitionDate: params.endDate,
        cloudCoveragePct: 2.4,
        bbox: [lng - 0.1, lat - 0.1, lng + 0.1, lat + 0.1],
        resolutionMeters: 30,
        bandsAvailable: ["B1", "B2", "B3", "B4_Red", "B5_NIR", "B6_SWIR1", "B7_SWIR2"],
        processingStatus: "INDEXED",
        bandValues: {
          red: 0.16,
          nir: 0.46,
          swir: 0.28,
          green: 0.18,
        },
      },
    ];
  }

  async getSpectralBands(sceneId: string, point: GeoPoint) {
    return {
      red: 0.16,
      nir: 0.46,
      swir: 0.28,
      green: 0.18,
    };
  }
}
