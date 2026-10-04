import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { collaborationStore, ProjectRole, ProjectPermission } from "@/lib/collaboration/collaboration-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to invite members." },
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

  // Only project OWNER or system ADMIN can invite members
  const isOwner = project.ownerEmail.toLowerCase() === ctx.user.email.toLowerCase();
  const isAdmin = ctx.role.code === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: "Access Denied: Only the project owner or system administrator can invite new members.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, organization, projectRole = "RESEARCHER", projectPermission = "write" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Member name and email are required." },
        { status: 400 }
      );
    }

    const result = collaborationStore.inviteMember(
      id,
      {
        name,
        email,
        organization: organization || "Institutional Partner (SIH Demo)",
        projectRole: projectRole as ProjectRole,
        projectPermission: projectPermission as ProjectPermission,
      },
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Failed to create invitation." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        member: result.member,
        invitation: result.invitation,
        message: `Member '${name}' successfully invited as ${projectRole}.`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid member invitation payload." },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to update members." },
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

  const isOwner = project.ownerEmail.toLowerCase() === ctx.user.email.toLowerCase();
  const isAdmin = ctx.role.code === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Only project owner or administrator can modify roles." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, projectRole, projectPermission } = body;

    if (!email || !projectRole) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Member email and projectRole are required." },
        { status: 400 }
      );
    }

    const updated = collaborationStore.changeMemberRole(
      id,
      email,
      projectRole,
      projectPermission || "write",
      {
        name: ctx.user.name,
        email: ctx.user.email,
        roleCode: ctx.role.code,
      }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: `Member with email '${email}' not found in project.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Member role updated to ${projectRole}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getAuthenticatedUser();
  const { id } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to remove members." },
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

  const isOwner = project.ownerEmail.toLowerCase() === ctx.user.email.toLowerCase();
  const isAdmin = ctx.role.code === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Only project owner or administrator can remove members." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Member email parameter is required." },
      { status: 400 }
    );
  }

  const removed = collaborationStore.removeMember(id, email, {
    name: ctx.user.name,
    email: ctx.user.email,
    roleCode: ctx.role.code,
  });

  if (!removed) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Member with email '${email}' not found in project.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Member '${email}' successfully removed from project.`,
  });
}
