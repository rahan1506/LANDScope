import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";

interface StoredScenario {
  id: string;
  title: string;
  category: string;
  geography: string;
  status: "ACTIVE_SIMULATION" | "DRAFT_GAZETTE" | "ARCHIVED";
  parameters: Record<string, number>;
  createdAt: string;
}

// In-memory scenario store
const POLICY_SCENARIOS_STORE: StoredScenario[] = [
  {
    id: "SCN-2026-01",
    title: "Controlled Peri-Urban Expansion 2031",
    category: "Land-Use Planning",
    geography: "Sehore, Madhya Pradesh",
    status: "ACTIVE_SIMULATION",
    parameters: {
      "param-agri-cap": 650,
      "param-eco-buffer": 750,
      "param-water-setback": 150,
      "param-pervious-quotient": 35,
      "param-cadastre-verification": 1,
    },
    createdAt: "2026-09-28",
  },
  {
    id: "SCN-2026-02",
    title: "Wildlife Corridor Inviolate Zone Expansion",
    category: "Ecological Protection",
    geography: "Raisen, Madhya Pradesh",
    status: "DRAFT_GAZETTE",
    parameters: {
      "param-agri-cap": 300,
      "param-eco-buffer": 1200,
      "param-water-setback": 200,
      "param-pervious-quotient": 40,
      "param-cadastre-verification": 1,
    },
    createdAt: "2026-09-15",
  },
];

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Policy Scenarios." },
      { status: 401 }
    );
  }

  // Enforce server-side role permission (policy:read)
  if (!hasPermission(ctx, "policy:read") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'policy:read' to inspect or simulate policy digital twin scenarios.`,
        requiredPermission: "policy:read",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authorized: true,
    userRole: ctx.role.code,
    scenariosCount: POLICY_SCENARIOS_STORE.length,
    scenarios: POLICY_SCENARIOS_STORE,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to create a Policy Scenario." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "policy:read") && !hasPermission(ctx, "policy:simulate") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to create policy scenarios.`,
        requiredPermission: "policy:simulate",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { title, category, geography, parameters } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Scenario title is required." },
        { status: 400 }
      );
    }

    const newScenario: StoredScenario = {
      id: `SCN-${Date.now().toString(36).toUpperCase()}`,
      title: title.trim(),
      category: category || "Land-Use Planning",
      geography: geography || "Sehore, Madhya Pradesh",
      status: "ACTIVE_SIMULATION",
      parameters: parameters || {
        "param-agri-cap": 650,
        "param-eco-buffer": 750,
        "param-water-setback": 150,
        "param-pervious-quotient": 35,
        "param-cadastre-verification": 1,
      },
      createdAt: new Date().toISOString().split("T")[0],
    };

    POLICY_SCENARIOS_STORE.unshift(newScenario);

    return NextResponse.json(
      {
        success: true,
        message: "Policy scenario initialized successfully.",
        scenario: newScenario,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to create policy scenario." },
      { status: 500 }
    );
  }
}
