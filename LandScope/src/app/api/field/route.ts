import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  getFieldObservations,
  getCaseById,
  getParcelById,
  DEMO_FIELD_OBSERVATIONS,
} from "@/lib/land-governance/demo-data";
import { FieldObservation } from "@/lib/land-governance/types";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");

  const observations = getFieldObservations(caseId || undefined);

  return NextResponse.json({
    success: true,
    observations,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      caseId,
      parcelId,
      gpsCoordinates,
      gpsAccuracy,
      compassOrientation,
      observations,
      notes,
      photos,
      boundaryPoints,
      deviceInfo,
    } = body;

    if (!caseId || !parcelId) {
      return NextResponse.json({ error: "caseId and parcelId are required" }, { status: 400 });
    }

    const newObservation: FieldObservation = {
      id: `field-${Date.now()}`,
      caseId,
      parcelId,
      observerId: ctx.user.id,
      observerName: ctx.user.name,
      observerRole: "patwari",
      timestamp: new Date().toISOString(),
      gpsCoordinates: gpsCoordinates || null,
      gpsAccuracy: gpsAccuracy || 3.0,
      compassOrientation: compassOrientation || 0,
      photos: photos || [],
      boundaryPoints: boundaryPoints || [],
      observations: observations || "Field observation submitted via Bhu-Mitra PWA.",
      notes: notes || "",
      syncStatus: "synced",
      deviceInfo: deviceInfo || "Bhu-Mitra PWA (Online)",
    };

    // Store in demo store
    DEMO_FIELD_OBSERVATIONS.unshift(newObservation);

    // Also attach to case if found
    const c = getCaseById(caseId);
    if (c) {
      c.fieldObservations.unshift(newObservation);
      c.updatedAt = new Date().toISOString();
      if (c.status === "NEW" || c.status === "FIELD_VERIFICATION") {
        c.status = "UNDER_REVIEW";
      }
    }

    return NextResponse.json({
      success: true,
      observation: newObservation,
      message: "Field verification observation recorded successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
