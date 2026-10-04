import { NextRequest, NextResponse } from "next/server";
import { getIntelligenceForGeography } from "@/lib/gis/gis-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "Madhya Pradesh";
  const district = searchParams.get("district") || "Sehore";
  const tehsil = searchParams.get("tehsil") || "Ashta";

  const intel = getIntelligenceForGeography(state, district, tehsil);

  return NextResponse.json({
    success: true,
    context: intel,
    demonstrationLabel: "Demonstration Geospatial Context",
  });
}
