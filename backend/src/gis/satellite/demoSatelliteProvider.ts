import { SatelliteProvider, SatelliteSearchParams } from "./satelliteProvider";
import { SatelliteScene, GeoPoint } from "../../types";

export class DemoSatelliteProvider extends SatelliteProvider {
  readonly providerName = "DEMO_SYNTHETIC";

  async ping(): Promise<boolean> {
    return true;
  }

  async searchScenes(params: SatelliteSearchParams): Promise<SatelliteScene[]> {
    const lat = params.point?.lat || 13.2458;
    const lng = params.point?.lng || 77.7126;

    return [
      {
        sceneId: `S2B_L2A_DEMO_${params.startDate.replace(/-/g, "")}`,
        source: "DEMO_SYNTHETIC",
        acquisitionDate: params.startDate,
        cloudCoveragePct: 0.8,
        bbox: [lng - 0.04, lat - 0.04, lng + 0.04, lat + 0.04],
        resolutionMeters: 10,
        bandsAvailable: ["B02_Blue", "B03_Green", "B04_Red", "B08_NIR", "B11_SWIR"],
        processingStatus: "PROCESSED",
        bandValues: {
          red: 0.08,
          nir: 0.65,
          swir: 0.18,
          green: 0.14,
        },
      },
      {
        sceneId: `S2A_L2A_DEMO_${params.endDate.replace(/-/g, "")}`,
        source: "DEMO_SYNTHETIC",
        acquisitionDate: params.endDate,
        cloudCoveragePct: 0.4,
        bbox: [lng - 0.04, lat - 0.04, lng + 0.04, lat + 0.04],
        resolutionMeters: 10,
        bandsAvailable: ["B02_Blue", "B03_Green", "B04_Red", "B08_NIR", "B11_SWIR"],
        processingStatus: "PROCESSED",
        bandValues: {
          red: 0.22,
          nir: 0.38,
          swir: 0.48,
          green: 0.18,
        },
      },
    ];
  }

  async getSpectralBands(sceneId: string, point: GeoPoint) {
    if (sceneId.includes("2023") || sceneId.includes("baseline")) {
      return { red: 0.08, nir: 0.65, swir: 0.18, green: 0.14 };
    }
    return { red: 0.22, nir: 0.38, swir: 0.48, green: 0.18 };
  }
}
