import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import { addPersistedResearchQuestion } from "@/lib/supabase/research-service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to add research questions." },
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
    const { question } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Question text is required." },
        { status: 400 }
      );
    }

    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    const newQuestion = await addPersistedResearchQuestion(
      supabaseClient,
      projectId,
      question.trim()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Research question added and persisted successfully.",
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add research question.";
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: msg },
      { status: 500 }
    );
  }
}
