import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore, PilotStatus } from "@/lib/innovation/innovation-data";

export async function GET() {
  const pilots = innovationStore.getPilotProjects();
  return NextResponse.json({
    success: true,
    pilots,
    count: pilots.length,
    demonstrationLabel: "Illustrative Demonstration Pilot",
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot propose institutional pilots
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot register institutional pilot projects" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.pilotName || !body.problem || !body.location || !body.innovation) {
      return NextResponse.json(
        { success: false, error: "Missing required pilot project fields" },
        { status: 400 }
      );
    }

    const pilot = innovationStore.createPilotProject(
      {
        pilotName: body.pilotName,
        problem: body.problem,
        location: body.location,
        state: body.state || "Madhya Pradesh",
        district: body.district || "Sehore",
        tehsil: body.tehsil || "Ashta",
        innovation: body.innovation,
        expectedOutcome: body.expectedOutcome || "Demonstration of spatial AI in land governance",
        timeline: body.timeline || "2026 - 2027",
        partners: body.partners || [auth.user.organization],
        metrics: body.metrics || [
          { label: "Target Area", value: "500 Ha" },
          { label: "Resolution Status", value: "Under Monitoring" },
        ],
        status: (body.status as PilotStatus) || "Approved for Demonstration",
        leadOrganization: auth.user.organization,
        leadUser: auth.user.name,
      },
      {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        roleCode: auth.role.code,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Pilot project successfully registered",
        pilot,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create pilot project" },
      { status: 500 }
    );
  }
}
