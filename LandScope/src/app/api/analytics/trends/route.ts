import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsForGeography } from "@/lib/analytics/analytics-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "Madhya Pradesh";
  const district = searchParams.get("district") || "Sehore";
  const tehsil = searchParams.get("tehsil") || "Ashta";

  const profile = getAnalyticsForGeography(state, district, tehsil);

  return NextResponse.json({
    success: true,
    geography: { state, district, tehsil },
    trends: profile.insights,
    historicalLandUse: profile.timeSeries,
    currentLandUse: profile.currentLandUse,
    demonstrationLabel: "Illustrative Demo Analysis",
  });
}
