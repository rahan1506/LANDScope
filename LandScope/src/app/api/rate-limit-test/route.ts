import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { apiCenterStore } from "@/lib/api/api-center-data";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  const clientId = auth ? auth.user.email : request.headers.get("x-forwarded-for") || "anonymous_client";

  const { searchParams } = new URL(request.url);
  const testLimit = searchParams.get("testLimit") ? Number(searchParams.get("testLimit")) : 100;

  const check = apiCenterStore.checkRateLimit(clientId, testLimit);

  if (!check.allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMIT_EXCEEDED",
        message: `Rate limit of ${testLimit} requests per minute exceeded. Please retry after the window resets.`,
        retryAfterSeconds: 60,
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(testLimit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Request within allowable rate limit bounds",
    clientId,
    remaining: check.remaining,
    limit: testLimit,
  });
}
