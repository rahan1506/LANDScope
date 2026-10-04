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

  // PUBLIC accounts cannot view internal evaluation scoring
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot inspect internal evaluation records" },
      { status: 403 }
    );
  }

  const reviews = innovationStore.getReviewsForApplication(id, {
    id: auth.user.id,
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  return NextResponse.json({
    success: true,
    reviews,
    count: reviews.length,
    demonstrationLabel: "Illustrative Evaluation",
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

  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot submit evaluations" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const scores = body.scores || {
      problemUnderstanding: 15,
      innovation: 15,
      technicalFeasibility: 15,
      evidence: 15,
      expectedImpact: 15,
      scalability: 15,
    };

    const result = innovationStore.addReview(
      id,
      {
        scores,
        feedbackNotes: body.feedbackNotes || "Illustrative evaluation assessment completed.",
      },
      {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        roleCode: auth.role.code,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Evaluation review submitted successfully",
        review: result.review,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to record review" },
      { status: 500 }
    );
  }
}
