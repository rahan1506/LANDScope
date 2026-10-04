import { NextResponse } from "next/server";

export async function GET() {
  const layers = [
    {
      id: "lyr-cadastre-parcels",
      name: "Cadastral Abadi Parcels (SVAMITVA RTK)",
      category: "Cadastre",
      type: "Vector (Polygon)",
      protocol: "OGC WFS 2.0",
      resolution: "0.05m sub-decimeter",
      source: "Survey of India & Revenue Records",
      capabilities: ["GetCapabilities", "GetFeature", "DescribeFeatureType"],
      defaultVisible: true,
      status: "Demonstration Layer",
    },
    {
      id: "lyr-land-use",
      name: "Multi-Temporal Land Use & Land Cover (LULC)",
      category: "Land Use",
      type: "Raster (Multi-band)",
      protocol: "OGC WMS 1.3",
      resolution: "10m (Sentinel-2 Harmonized)",
      source: "NRSC / ISRO Bhuvan",
      capabilities: ["GetCapabilities", "GetMap", "GetFeatureInfo"],
      defaultVisible: true,
      status: "Demonstration Layer",
    },
    {
      id: "lyr-climate-stress",
      name: "Aquifer Recharge & Hydrological Vulnerability",
      category: "Climate Risk",
      type: "Vector & Raster Contour",
      protocol: "OGC WMS 1.3",
      resolution: "Village micro-catchment",
      source: "Central Ground Water Board (CGWB)",
      capabilities: ["GetCapabilities", "GetMap"],
      defaultVisible: false,
      status: "Demonstration Layer",
    },
    {
      id: "lyr-eco-buffers",
      name: "Ratapani Sanctuary Eco-Sensitive Buffer Zone",
      category: "Environmental",
      type: "Vector (Buffer Corridor)",
      protocol: "OGC WFS 2.0",
      resolution: "750m Statutory Delineation",
      source: "Forest Survey of India",
      capabilities: ["GetCapabilities", "GetFeature"],
      defaultVisible: true,
      status: "Demonstration Layer",
    },
    {
      id: "lyr-infrastructure",
      name: "PMGSY Rural Road & Economic Transport Corridors",
      category: "Infrastructure",
      type: "Vector (LineString)",
      protocol: "OGC WFS 2.0",
      resolution: "1:10,000 scale",
      source: "NRIDA & State PWD",
      capabilities: ["GetCapabilities", "GetFeature"],
      defaultVisible: false,
      status: "Demonstration Layer",
    },
  ];

  return NextResponse.json({
    success: true,
    count: layers.length,
    layers,
    ogcSpecification: "OGC WMS 1.3.0 / WFS 2.0.0 NSDI Standards",
    demonstrationLabel: "Demonstration Spatial Layers",
  });
}
