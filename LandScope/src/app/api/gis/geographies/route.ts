import { NextResponse } from "next/server";
import { GEOGRAPHIC_HIERARCHY } from "@/lib/gis/gis-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: GEOGRAPHIC_HIERARCHY.length,
    geographies: GEOGRAPHIC_HIERARCHY,
    demonstrationLabel: "Demonstration Geographies",
  });
}
