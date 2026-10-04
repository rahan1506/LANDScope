import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import {
  reportsStore,
  buildPolicyBriefFromSimulationContext,
  ReportStatus,
} from "@/lib/reports/report-data";
import { getBaselineForGeography, runSimulationEngine } from "@/lib/policy/policy-twin-data";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Policy Reports & Decision Briefs." },
      { status: 401 }
    );
  }

  // Permission check: role must have reports:public, reports:audit, or admin:all
  const hasAccess =
    hasPermission(ctx, "reports:public") ||
    hasPermission(ctx, "reports:audit") ||
    ctx.role.code === "ADMIN" ||
    ctx.role.allowedModules.includes("reports") ||
    ctx.role.allowedModules.includes("public-reports");

  if (!hasAccess) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to inspect reports.`,
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const reports = reportsStore.getAll(ctx.role.code, ctx.user.email);

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    reports,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to generate policy reports." },
      { status: 401 }
    );
  }

  // Public users are strictly forbidden from creating/generating policy briefs
  if (ctx.role.code === "PUBLIC") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: "Access Denied: Public accounts cannot generate or modify policy briefs.",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      state = "Madhya Pradesh",
      district = "Sehore",
      tehsil = "Ashta",
      scenarioTitle = "Controlled Peri-Urban Expansion 2031",
      parameters = {},
      stressCondition = "Normal Conditions",
      status = "Generated",
      title,
    } = body;

    // Use passed baseline or fetch geography baseline
    const baseline = body.baseline || getBaselineForGeography(state, district, tehsil);

    // Use passed simulationResult or run engine with provided parameters
    const simulationResult =
      body.simulationResult ||
      runSimulationEngine(baseline, parameters, stressCondition, scenarioTitle);

    const newReport = buildPolicyBriefFromSimulationContext({
      geography: { state, district, tehsil },
      baseline,
      simulationResult,
      author: {
        name: ctx.user.name,
        role: ctx.role.code,
        organization: ctx.user.organization,
        email: ctx.user.email,
      },
      status: (status as ReportStatus) || "Generated",
      title,
    });

    reportsStore.create(newReport);

    return NextResponse.json(
      {
        success: true,
        userRole: ctx.role.code,
        report: newReport,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Failed to generate policy report from provided payload." },
      { status: 400 }
    );
  }
}
