import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { ApiCenterPageClient } from "@/components/api-center/api-center-page-client";

export default async function ApiCenterPage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access /app/api
  if (!ctx) {
    redirect("/login?redirect=/app/api");
  }

  return <ApiCenterPageClient user={ctx.user} role={ctx.role} />;
}
