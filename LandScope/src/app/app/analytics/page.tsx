import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AnalyticsPageClient } from "@/components/analytics/analytics-page-client";

export default async function AnalyticsPage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access Analytics
  if (!ctx) {
    redirect("/login?redirect=/app/analytics");
  }

  return <AnalyticsPageClient user={ctx.user} role={ctx.role} />;
}
