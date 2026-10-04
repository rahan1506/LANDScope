import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { INITIAL_EVIDENCE_REPOSITORY } from "@/lib/research/research-data";

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

  const item = INITIAL_EVIDENCE_REPOSITORY.find((e) => e.id === id);
  if (!item) {
    return NextResponse.json(
      { success: false, error: `Evidence item with ID "${id}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    evidence: item,
    demonstrationLabel: "Empirical Demonstration Evidence",
  });
}
