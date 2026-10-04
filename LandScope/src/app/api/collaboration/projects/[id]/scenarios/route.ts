import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { collaborationStore } from "@/lib/collaboration/collaboration-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to associate policy scenarios." },
      { status: 401 }
    );
  }

  const project = collaborationStore.getProjectById(id);
  if (!project) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Collaborative project '${id}' not found.` },
      { status: 404 }
    );
  }

  if (!collaborationStore.canUserAccessProject(project, ctx.user.email, ctx.role.code)) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: You are not an authorized member of this project." },
      { status: 403 }
    );
  }

  const { projectRole } = collaborationStore.getUserRoleInProject(project, ctx.user.email, ctx.role.code);
  if (projectRole === "VIEWER") {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot associate scenarios with this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, scenarioId, geography, policyType, lastSimulation, impactDimensions, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Scenario name is required." },
        { status: 400 }
      );
    }

    const added = collaborationStore.associateScenario(
      id,
      {
        scenarioId: scenarioId || `SCN-${Date.now().toString(36)}`,
        name,
        geography: geography || "Madhya Pradesh > Sehore > Ashta",
        policyType: policyType || "Zoning Ceiling & Aquifer Buffer",
        createdBy: ctx.user.name,
        createdByEmail: ctx.user.email,
        lastSimulation: lastSimulation || new Date().toISOString(),
        impactDimensions: impactDimensions || ["Agriculture", "Water", "Ecology", "Urban Development", "Infrastructure", "Land Governance"],
        status: status || "Illustrative Model Output",
      },
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      }
    );

    return NextResponse.json(
      {
        success: true,
        scenario: added,
        message: `Policy scenario '${name}' successfully associated with project.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid scenario association payload." },
      { status: 400 }
    );
  }
}
