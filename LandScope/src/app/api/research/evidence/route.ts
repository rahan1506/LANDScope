import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import {
  getPersistedEvidence,
  createPersistedEvidence,
} from "@/lib/supabase/research-service";

export async function GET(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access the Research Evidence Repository." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:read")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:read'.`,
        requiredPermission: "research:read",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const type = searchParams.get("type") || undefined;
  const topic = searchParams.get("topic") || undefined;
  const geography = searchParams.get("geography") || undefined;
  const domain = searchParams.get("domain") || undefined;
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : undefined;

  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const evidenceItems = await getPersistedEvidence(supabaseClient, {
    query,
    type,
    topic,
    geography,
    domain,
    year,
  });

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    totalCount: evidenceItems.length,
    evidence: evidenceItems,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to submit evidence." },
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
    const {
      title,
      abstract,
      authorOrOrg,
      type,
      researchDomain,
      source,
      sourceUrl,
      confidenceScore,
      methodology,
      state,
      district,
      tehsil,
      topics,
      evidenceStatus,
    } = body;

    if (!title || !abstract || !source) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "title, abstract, and source are required." },
        { status: 400 }
      );
    }

    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    const newEvidence = await createPersistedEvidence(supabaseClient, {
      title,
      abstract,
      authorOrOrg: authorOrOrg || source,
      type: type || "Research Paper",
      researchDomain: researchDomain || "Land Rights & Titling",
      source,
      sourceUrl,
      confidenceScore: confidenceScore ?? 0.90,
      methodology: methodology || "Empirical econometric & spatial GIS cross-validation",
      state: state || "Madhya Pradesh",
      district,
      tehsil,
      topics: topics || ["Cadastre", "Land Governance"],
      evidenceStatus: evidenceStatus || "Peer-Reviewed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Evidence successfully created and persisted.",
        evidence: newEvidence,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create evidence.";
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: msg },
      { status: 500 }
    );
  }
}
