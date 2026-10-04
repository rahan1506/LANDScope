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
      { error: "UNAUTHORIZED", message: "Authentication required to save GIS context." },
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
      { error: "FORBIDDEN", message: "Access Denied: Read-only VIEWER role cannot save GIS context to this project." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { state, district, tehsil, selectedLayers, timePeriod, notes } = body;

    if (!state || !district || !tehsil) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "State, district, and tehsil are required for GIS context." },
        { status: 400 }
      );
    }

    const added = collaborationStore.saveGisContext(
      id,
      {
        state,
        district,
        tehsil,
        selectedLayers: selectedLayers || ["Cadastral Parcels Overlay", "Land Use (LULC)"],
        timePeriod: timePeriod || "2026 Baseline",
        notes: notes || "Geographic intelligence focus area.",
        savedBy: ctx.user.name,
        savedByEmail: ctx.user.email,
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
        gisContext: added,
        message: `GIS spatial context (${state} > ${district} > ${tehsil}) saved to project.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid GIS context payload." },
      { status: 400 }
    );
  }
}
