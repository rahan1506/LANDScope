import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to query AI Research Copilot." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "copilot:access") && !hasPermission(ctx, "research:read")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'copilot:access'.`,
        requiredPermission: "copilot:access",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "A research question or search query is required." },
        { status: 400 }
      );
    }

    const copilotResult = researchStore.processCopilotQuery(query.trim());

    return NextResponse.json({
      success: true,
      query: query.trim(),
      userRole: ctx.role.code,
      result: copilotResult,
    });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process copilot query." },
      { status: 500 }
    );
  }
}
