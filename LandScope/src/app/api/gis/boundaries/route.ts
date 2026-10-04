import { NextRequest, NextResponse } from "next/server";
import { AdministrativeBoundaryProvider } from "@/lib/gis/boundary-provider";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = (searchParams.get("level") || searchParams.get("type") || "country").toLowerCase();
    const state = searchParams.get("state") || searchParams.get("stateId") || "MP";
    const district = searchParams.get("district") || searchParams.get("districtId") || "Sehore";

    let data;
    switch (level) {
      case "state":
      case "states":
        data = AdministrativeBoundaryProvider.getStates();
        break;
      case "district":
      case "districts":
        data = AdministrativeBoundaryProvider.getDistricts(state);
        break;
      case "tehsil":
      case "tehsils":
      case "subdistrict":
        data = AdministrativeBoundaryProvider.getTehsils(district);
        break;
      case "country":
      default:
        data = AdministrativeBoundaryProvider.getCountryBoundary();
        break;
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to retrieve administrative boundary data",
        message,
        status: "Demonstration dataset error",
      },
      { status: 500 }
    );
  }
}
