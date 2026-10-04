import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { ReportsPageClient } from "@/components/reports/reports-page-client";

export default async function ReportsPage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access Reports
  if (!ctx) {
    redirect("/login?redirect=/app/reports");
  }

  return <ReportsPageClient user={ctx.user} role={ctx.role} />;
}
