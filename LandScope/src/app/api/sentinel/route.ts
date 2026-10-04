import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  getParcels,
  getParcelByUlpin,
  getParcelById,
  getMutations,
  getSatelliteObservations,
  getChangeDetections,
  getDiscrepancyForParcel,
  getRiskAlerts,
} from "@/lib/land-governance/demo-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Mutation Sentinel." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const ulpin = searchParams.get("ulpin");
  const parcelId = searchParams.get("parcelId");
  const category = searchParams.get("category");

  if (ulpin) {
    const parcel = getParcelByUlpin(ulpin);
    if (!parcel) {
      return NextResponse.json({ error: "NOT_FOUND", message: `Parcel with ULPIN ${ulpin} not found.` }, { status: 404 });
    }
    const mutations = getMutations(parcel.id);
    const observations = getSatelliteObservations(parcel.id);
    const changes = getChangeDetections(parcel.id);
    const discrepancy = getDiscrepancyForParcel(parcel.id);
    const alerts = getRiskAlerts(parcel.id);

    return NextResponse.json({
      success: true,
      parcel,
      mutations,
      observations,
      changes,
      discrepancy,
      alerts,
    });
  }

  if (parcelId) {
    const parcel = getParcelById(parcelId);
    if (!parcel) {
      return NextResponse.json({ error: "NOT_FOUND", message: `Parcel ID ${parcelId} not found.` }, { status: 404 });
    }
    const mutations = getMutations(parcel.id);
    const observations = getSatelliteObservations(parcel.id);
    const changes = getChangeDetections(parcel.id);
    const discrepancy = getDiscrepancyForParcel(parcel.id);
    const alerts = getRiskAlerts(parcel.id);

    return NextResponse.json({
      success: true,
      parcel,
      mutations,
      observations,
      changes,
      discrepancy,
      alerts,
    });
  }

  // Otherwise return full overview
  const parcels = getParcels();
  const alerts = getRiskAlerts(undefined, category || undefined);
  const changes = getChangeDetections();
  const mutations = getMutations();

  return NextResponse.json({
    success: true,
    parcels,
    alerts,
    changes,
    mutations,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, alertId } = body;

    if (action === "acknowledge_alert" && alertId) {
      const alerts = getRiskAlerts();
      const targetAlert = alerts.find((a) => a.id === alertId);
      if (targetAlert) {
        targetAlert.isAcknowledged = true;
        targetAlert.acknowledgedBy = ctx.user.name;
        targetAlert.acknowledgedAt = new Date().toISOString();
        return NextResponse.json({ success: true, alert: targetAlert });
      }
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
