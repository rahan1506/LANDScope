import { SatelliteScene, GeoPoint } from "../../types";

export interface SatelliteSearchParams {
  point?: GeoPoint;
  bbox?: [number, number, number, number];
  startDate: string;
  endDate: string;
  maxCloudCoverPct?: number;
}

export abstract class SatelliteProvider {
  abstract readonly providerName: string;

  /**
   * Search available scenes matching criteria without downloading raster files.
   */
  abstract searchScenes(params: SatelliteSearchParams): Promise<SatelliteScene[]>;

  /**
   * Retrieve surface reflectance spectral bands for a specific coordinate/scene.
   */
  abstract getSpectralBands(
    sceneId: string,
    point: GeoPoint
  ): Promise<{
    red: number;
    nir: number;
    swir: number;
    green?: number;
  }>;

  /**
   * Health check for provider endpoint.
   */
  abstract ping(): Promise<boolean>;
}
