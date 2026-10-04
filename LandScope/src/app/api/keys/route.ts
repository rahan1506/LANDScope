import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  // PUBLIC accounts cannot manage API keys
  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot provision API keys" },
      { status: 403 }
    );
  }

  const keys = apiCenterStore.getApiKeysForUser(auth.user.email, auth.role.code);

  return NextResponse.json({
    success: true,
    keys,
    count: keys.length,
    demonstrationLabel: "Demonstration API Credentials",
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

  if (auth.role.code === "PUBLIC") {
    return NextResponse.json(
      { success: false, error: "Forbidden: Public accounts cannot provision API keys" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid request: Missing or invalid API key name" },
        { status: 400 }
      );
    }

    const permissions = Array.isArray(body.permissions) && body.permissions.length > 0
      ? body.permissions
      : ["read:gis", "read:research", "read:policy"];

    const { keyRecord, fullSecret } = apiCenterStore.createApiKey(
      body.name.trim(),
      permissions,
      { email: auth.user.email, roleCode: auth.role.code }
    );

    return NextResponse.json(
      {
        success: true,
        message: "API key provisioned successfully. Record this secret now; it will not be shown again in full.",
        key: keyRecord,
        oneTimeSecret: fullSecret,
        demonstrationLabel: "Demonstration API Credentials",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create API key" },
      { status: 500 }
    );
  }
}
