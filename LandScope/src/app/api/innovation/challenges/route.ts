import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { innovationStore, ChallengeCategory } from "@/lib/innovation/innovation-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const theme = searchParams.get("theme") || undefined;
  const geography = searchParams.get("geography") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const auth = await getAuthenticatedUser();
  const userRole = auth?.role.code;

  const challenges = innovationStore.getChallenges(
    { category, theme, geography, status, search },
    userRole
  );

  return NextResponse.json({
    success: true,
    challenges,
    count: challenges.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  const roleCode = auth.role.code;

  // Role authorization: PUBLIC users CANNOT create challenges!
  if (roleCode === "PUBLIC") {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Public accounts cannot create institutional challenges",
      },
      { status: 403 }
    );
  }

  // Allowed creator roles: RESEARCHER, ACADEMIC_INSTITUTION, POLICYMAKER, GOVERNMENT_AGENCY, ADMIN, INNOVATOR
  const allowedRoles = [
    "RESEARCHER",
    "ACADEMIC_INSTITUTION",
    "POLICYMAKER",
    "GOVERNMENT_AGENCY",
    "ADMIN",
    "INNOVATOR",
  ];

  if (!allowedRoles.includes(roleCode)) {
    return NextResponse.json(
      {
        success: false,
        error: `Forbidden: Role ${roleCode} is not authorized to create innovation challenges`,
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.category || !body.problemStatement) {
      return NextResponse.json(
        { success: false, error: "Missing required challenge fields" },
        { status: 400 }
      );
    }

    // Role-specific category validation where relevant
    if (roleCode === "RESEARCHER" && body.category === "Land Technology Challenge" && !body.theme) {
      // Researchers typically lead Research Grants or Hackathons
    }

    const newChallenge = innovationStore.createChallenge(
      {
        title: body.title,
        description: body.description,
        category: body.category as ChallengeCategory,
        theme: body.theme || "General Land Innovation",
        problemStatement: body.problemStatement,
        expectedOutcome: body.expectedOutcome || "Actionable prototype or empirical study",
        eligibility: body.eligibility || "Open to eligible participants",
        organizer: body.organizer || auth.user.name,
        organizerEmail: auth.user.email,
        organizerRole: auth.role.code,
        geography: body.geography || "National",
        startDate: body.startDate || new Date().toISOString().split("T")[0],
        endDate: body.endDate || "2026-12-31",
        submissionDeadline: body.submissionDeadline || "2026-11-30",
        evaluationCriteria: Array.isArray(body.evaluationCriteria)
          ? body.evaluationCriteria
          : ["Innovation", "Technical Feasibility", "Problem Understanding", "Evidence Grounding"],
        status: body.status || "Open",
        visibility: body.visibility || "Published",
        budgetOrPrize: body.budgetOrPrize,
        relatedContext: body.relatedContext,
      },
      {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        roleCode: auth.role.code,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Challenge created successfully",
        challenge: newChallenge,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create challenge",
      },
      { status: 500 }
    );
  }
}
