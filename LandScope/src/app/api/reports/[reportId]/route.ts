import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { reportsStore, ReportStatus } from "@/lib/reports/report-data";

interface RouteParams {
  params: Promise<{ reportId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { reportId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to inspect policy report details." },
      { status: 401 }
    );
  }

  const report = reportsStore.getById(reportId, ctx.role.code, ctx.user.email);

  if (!report) {
    // If report exists but user is unauthorized, return 403, otherwise 404
    const anyReport = reportsStore.getAll("ADMIN", "").find((r) => r.id === reportId);
    if (anyReport) {
      return NextResponse.json(
        {
          error: "FORBIDDEN",
          message: `Access Denied: Role '${ctx.role.title}' is not authorized to view private report '${reportId}'.`,
          userRole: ctx.role.code,
        },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Report '${reportId}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    report,
  });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { reportId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to modify policy reports." },
      { status: 401 }
    );
  }

  if (ctx.role.code === "PUBLIC") {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Access Denied: Public users cannot modify report states." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !["Draft", "Generated", "Archived"].includes(status)) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Valid status ('Draft', 'Generated', 'Archived') is required." },
        { status: 400 }
      );
    }

    const updated = reportsStore.updateStatus(reportId, status as ReportStatus);
    if (!updated) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: `Report '${reportId}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userRole: ctx.role.code,
      report: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Malformed request payload." },
      { status: 400 }
    );
  }
}
