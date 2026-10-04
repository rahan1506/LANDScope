import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { collaborationStore, ProjectType, ProjectVisibility } from "@/lib/collaboration/collaboration-data";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Collaboration Workspace." },
      { status: 401 }
    );
  }

  // Public users cannot access private collaboration workspace
  if (ctx.role.code === "PUBLIC") {
    const { owned, shared, invitations } = collaborationStore.getProjectsForUser(ctx.user.email, ctx.role.code);
    return NextResponse.json({
      success: true,
      userRole: ctx.role.code,
      owned,
      shared,
      invitations,
      recentActivities: [],
      isPublic: true,
    });
  }

  const { owned, shared, invitations } = collaborationStore.getProjectsForUser(ctx.user.email, ctx.role.code);
  const allUserProjects = [...owned, ...shared];
  const recentActivities = allUserProjects
    .flatMap((p) => p.activities)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 20);

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    owned,
    shared,
    invitations,
    recentActivities,
    isPublic: false,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to create a collaborative project." },
      { status: 401 }
    );
  }

  // Public users are denied project creation
  if (ctx.role.code === "PUBLIC") {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Public role is not authorized to create collaborative projects." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      researchArea,
      geography,
      projectType,
      visibility,
      category,
      isPrivate = true,
    } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Project title is required." },
        { status: 400 }
      );
    }

    const newProject = collaborationStore.createProject(
      {
        title: title.trim(),
        subtitle: subtitle || "Inter-institutional collaborative project",
        description: description || "Joint empirical research and policy evaluation workspace.",
        researchArea: researchArea || "Land Governance & Geospatial Planning",
        geography: geography || "Madhya Pradesh > Sehore > Ashta",
        projectType: (projectType as ProjectType) || "Research",
        visibility: (visibility as ProjectVisibility) || "Private",
        category: category || "Research Project",
        status: "Active",
        ownerName: ctx.user.name,
        ownerEmail: ctx.user.email,
        ownerOrganization: ctx.user.organization,
        ownerRole: ctx.role.code,
        isPrivate: isPrivate !== false,
      },
      {
        name: ctx.user.name,
        email: ctx.user.email,
        organization: ctx.user.organization,
        roleCode: ctx.role.code,
      }
    );

    return NextResponse.json(
      {
        success: true,
        project: newProject,
        message: `Collaborative project '${newProject.title}' successfully initialized.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to parse project payload." },
      { status: 400 }
    );
  }
}
