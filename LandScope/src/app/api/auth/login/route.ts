import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_USERS, ROLES, ROLE_SLUG_TO_CODE } from "@/lib/auth/rbac-data";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, roleSlug } = body;

    let targetUser = email ? DEMO_USERS[email] : null;

    // Fallback: If roleSlug is provided directly (e.g. 1-click evaluator login)
    if (!targetUser && roleSlug) {
      const code = ROLE_SLUG_TO_CODE[roleSlug.toLowerCase()];
      targetUser = Object.values(DEMO_USERS).find((u) => u.roleCode === code) || null;
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS", message: "User not found in demonstration registry." },
        { status: 401 }
      );
    }

    const token = createSessionToken(targetUser);
    const cookieStore = await cookies();

    // Set secure HttpOnly session cookie
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Authenticate with Supabase to obtain authenticated session token
    try {
      const { supabase } = await import("@/lib/supabase/client");
      if (supabase) {
        const supabaseEmail = targetUser.email.replace("@landscope.demo", "@landscope.in");
        const { data: authData } = await supabase.auth.signInWithPassword({
          email: supabaseEmail,
          password: "LandScope2026!",
        });

        if (authData?.session?.access_token) {
          cookieStore.set("sb_access_token", authData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }
      }
    } catch {
      // Continue gracefully with sovereign session token
    }

    return NextResponse.json({
      success: true,
      user: targetUser,
      role: ROLES[targetUser.roleCode],
      redirectUrl: `/app/${ROLES[targetUser.roleCode].slug}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json(
      { error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}
