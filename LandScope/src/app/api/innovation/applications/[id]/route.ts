import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore } from "@/lib/innovation/innovation-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot view private submissions
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot view private applications" },
      { status: 403 }
    );
  }

  const app = innovationStore.getApplicationById(id, {
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  if (!app) {
    // Check if application exists at all to differentiate 403 vs 404
    const anyApps = (innovationStore as unknown as { applications: { id: string }[] }).applications;
    const exists = anyApps?.some((a) => a.id === id);

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You are not authorized to view this applicant's submission",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Application not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, application: app });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  try {
    const updates = await request.json();
    const result = innovationStore.updateApplication(id, updates, {
      id: auth.user.id,
      email: auth.user.email,
      roleCode: auth.role.code,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
      application: result.application,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  const success = innovationStore.withdrawApplication(id, {
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  if (!success) {
    return NextResponse.json(
      { success: false, error: "Forbidden: You cannot withdraw this application" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Application proposal successfully withdrawn",
  });
}
