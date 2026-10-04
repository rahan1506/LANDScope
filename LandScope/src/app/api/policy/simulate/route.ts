import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import {
  getBaselineForGeography,
  runSimulationEngine,
  StressCondition,
} from "@/lib/policy/policy-twin-data";

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to run Policy Digital Twin simulations." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "policy:read") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'policy:read' to simulate policy scenarios.`,
        requiredPermission: "policy:read",
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
      parameters = {},
      stressCondition = "Normal Conditions",
      scenarioTitle = "Controlled Peri-Urban Expansion 2031",
    } = body;

    const baseline = getBaselineForGeography(state, district, tehsil);
    const simulationResult = runSimulationEngine(
      baseline,
      parameters,
      stressCondition as StressCondition,
      scenarioTitle
    );

    return NextResponse.json({
      success: true,
      userRole: ctx.role.code,
      baseline,
      simulationResult,
    });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process policy digital twin simulation." },
      { status: 500 }
    );
  }
}
