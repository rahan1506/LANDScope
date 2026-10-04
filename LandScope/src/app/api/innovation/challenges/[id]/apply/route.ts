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

  const applications = innovationStore.getApplicationsForChallenge(id, {
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  return NextResponse.json({
    success: true,
    applications,
  });
}

export async function POST(
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

  // PUBLIC accounts cannot submit institutional applications
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Public stakeholder accounts cannot submit institutional challenge proposals",
      },
      { status: 403 }
    );
  }

  const challenge = innovationStore.getChallengeById(id, auth.role.code);
  if (!challenge) {
    return NextResponse.json(
      { success: false, error: "Challenge not found or not accessible" },
      { status: 404 }
    );
  }

  if (challenge.status === "Closed" || challenge.status === "Completed") {
    return NextResponse.json(
      { success: false, error: "Challenge is closed for new submissions" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    if (!body.proposalTitle || !body.problemUnderstanding || !body.proposedSolution) {
      return NextResponse.json(
        { success: false, error: "Missing required application proposal fields" },
        { status: 400 }
      );
    }

    const application = innovationStore.createApplication(
      id,
      {
        proposalTitle: body.proposalTitle,
        organization: body.organization || auth.user.organization,
        problemUnderstanding: body.problemUnderstanding,
        proposedSolution: body.proposedSolution,
        expectedImpact: body.expectedImpact || "Measurable improvement in land governance",
        teamMembers: body.teamMembers || auth.user.name,
        attachments: body.attachments,
        submitImmediately: body.submitImmediately ?? false,
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
        message: application.isLocked
          ? "Proposal successfully submitted and locked"
          : "Application draft saved",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit application",
      },
      { status: 500 }
    );
  }
}
