import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  getCases,
  getCaseById,
  updateCaseStatus,
  DEMO_CASES,
  getParcelById,
} from "@/lib/land-governance/demo-data";
import { LandCase, CaseStatus, SeverityLevel } from "@/lib/land-governance/types";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const status = searchParams.get("status") as CaseStatus | null;
  const priority = searchParams.get("priority") as SeverityLevel | null;

  if (id) {
    const c = getCaseById(id);
    if (!c) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, case: c });
  }

  const cases = getCases(status || undefined, priority || undefined);
  return NextResponse.json({
    success: true,
    cases,
    count: cases.length,
  });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { caseId, status } = body;

    if (!caseId || !status) {
      return NextResponse.json({ error: "caseId and status are required" }, { status: 400 });
    }

    const updated = updateCaseStatus(caseId, status as CaseStatus);
    if (!updated) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { parcelId, description, priority } = body;

    const parcel = getParcelById(parcelId);
    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    const caseNum = DEMO_CASES.length + 1;
    const newCase: LandCase = {
      id: `case-${Date.now()}`,
      caseId: `CASE-2024-00${caseNum}`,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      location: {
        village: parcel.village,
        taluk: parcel.taluk,
        district: parcel.district,
        state: parcel.state,
        coordinates: parcel.coordinates,
      },
      riskScore: 75,
      riskLevel: priority || "HIGH",
      status: "NEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedOfficer: ctx.user.name,
      assignedOfficerId: ctx.user.id,
      alerts: [],
      legalIssues: [],
      fieldObservations: [],
      evidenceDocuments: [],
      description: description || `Governance review case initiated for parcel ${parcel.surveyNumber}`,
      priority: priority || "HIGH",
    };

    DEMO_CASES.unshift(newCase);

    return NextResponse.json({ success: true, case: newCase });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
