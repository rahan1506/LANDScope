import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { authenticated: false, error: "UNAUTHORIZED", message: "No active session found." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: ctx.user,
    role: ctx.role,
  });
}
