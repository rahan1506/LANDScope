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
      { error: "UNAUTHORIZED", message: "Authentication required to add datasets." },
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
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot add datasets to this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, format, geography, timePeriod, source, coverage, recordsCount } = body;

    if (!name) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Dataset name is required." },
        { status: 400 }
      );
    }

    const added = collaborationStore.addDataset(
      id,
      {
        name,
        format: format || "GeoJSON",
        geography: geography || "Madhya Pradesh > Sehore > Ashta",
        timePeriod: timePeriod || "2018–2026",
        source: source || "National SDI Open Data Node",
        coverage: coverage || "District Boundary",
        recordsCount: recordsCount || 10000,
        status: "Illustrative Demo Dataset",
        addedBy: ctx.user.name,
        addedByEmail: ctx.user.email,
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
        dataset: added,
        message: `Dataset '${name}' successfully associated with project.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid dataset payload." },
      { status: 400 }
    );
  }
}
