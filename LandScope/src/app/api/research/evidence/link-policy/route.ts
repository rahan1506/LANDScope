import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to link evidence to policy scenarios." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:write")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:write'.`,
        requiredPermission: "research:write",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { evidenceId, scenarioTitle, rationale } = body;

    if (!evidenceId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "evidenceId is required." },
        { status: 400 }
      );
    }

    const title = scenarioTitle || "National Land Policy Simulation Scenario";
    const rat = rationale || "Empirical evidence source submitted for Policy Digital Twin simulation calibration.";

    const link = researchStore.linkEvidenceToPolicy(evidenceId, title, rat, ctx.user.email);

    if (!link) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: `Evidence '${evidenceId}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Evidence '${evidenceId}' registered as evidence input for policy scenario '${title}'.`,
      policyLink: link,
    });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to link evidence to policy scenario." },
      { status: 500 }
    );
  }
}
