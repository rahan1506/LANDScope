import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function DELETE(
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

  const result = apiCenterStore.revokeApiKey(id, {
    email: auth.user.email,
    roleCode: auth.role.code,
  });

  if (!result.success) {
    const is404 = result.error === "API key not found";
    return NextResponse.json(
      { success: false, error: result.error },
      { status: is404 ? 404 : 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "API key successfully revoked. Any future requests with this key will be rejected.",
  });
}
