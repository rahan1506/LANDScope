import { SatelliteProvider } from "./satelliteProvider";
import { SentinelProvider } from "./sentinelProvider";
import { LandsatProvider } from "./landsatProvider";
import { DemoSatelliteProvider } from "./demoSatelliteProvider";
import { env } from "../../config/env";

export function getSatelliteProvider(): SatelliteProvider {
  if (env.DEMO_MODE) {
    return new DemoSatelliteProvider();
  }

  switch (env.SATELLITE_PROVIDER) {
    case "copernicus":
      return new SentinelProvider();
    case "usgs":
    case "nasa":
      return new LandsatProvider();
    default:
      return new DemoSatelliteProvider();
  }
}
